#!/usr/bin/env node
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
require('./register-typescript.cjs')
process.env.MEDIA_REVIEW_SECRET = 'test-only-media-review-secret'
process.env.PEXELS_API_KEY = 'test-pexels-key'
process.env.YOUTUBE_API_KEY = 'test-youtube-key'
const { discoverSpeciesMedia, isSpeciesMediaLicenseAllowed, verifyDiscoveredCandidate } = require('../lib/species-media-discovery.ts')

function signedToken(speciesSlug, media) {
  const encoded = Buffer.from(JSON.stringify({ speciesSlug, media, exp: Date.now() + 60_000 })).toString('base64url')
  const signature = crypto.createHmac('sha256', process.env.MEDIA_REVIEW_SECRET).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

async function main() {
  assert.equal(isSpeciesMediaLicenseAllowed({ sourcePlatform: 'commons', license: 'CC0' }).ok, true)
  assert.equal(isSpeciesMediaLicenseAllowed({ sourcePlatform: 'commons', license: 'CC BY-SA 4.0' }).ok, true)
  assert.equal(isSpeciesMediaLicenseAllowed({ sourcePlatform: 'commons', license: 'CC BY-NC 4.0' }).ok, false)
  assert.equal(isSpeciesMediaLicenseAllowed({ sourcePlatform: 'commons', license: 'CC BY-ND 4.0' }).ok, false)
  assert.equal(isSpeciesMediaLicenseAllowed({ sourcePlatform: 'youtube', license: 'YouTube Standard License (embed only)' }).ok, true)

  const commonsCandidate = {
    mediaId: 'commons:abc123', sourceId: 'File:species.jpg', sourcePlatform: 'commons',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/species.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:species.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', verificationStatus: 'needs_review',
  }
  assert.deepEqual(verifyDiscoveredCandidate(signedToken('doyel', commonsCandidate), 'doyel'), commonsCandidate)
  assert.equal(verifyDiscoveredCandidate(signedToken('another-species', commonsCandidate), 'doyel'), null, 'candidate is bound to selected species')
  assert.equal(verifyDiscoveredCandidate(`${signedToken('doyel', commonsCandidate)}x`, 'doyel'), null, 'tampered token is rejected')
  const attackerUrl = { ...commonsCandidate, url: 'https://127.0.0.1/admin' }
  assert.equal(verifyDiscoveredCandidate(signedToken('doyel', attackerUrl), 'doyel'), null, 'untrusted/SSRF URL is rejected')
  const youtubeCandidate = { ...commonsCandidate, sourcePlatform: 'youtube', url: 'https://www.youtube.com/watch?v=abcdefghijk', sourceUrl: 'https://www.youtube.com/watch?v=abcdefghijk', directMediaUrl: undefined, poster: 'https://i.ytimg.com/vi/abcdefghijk/mqdefault.jpg', license: 'YouTube Standard License (embed only)' }
  assert.ok(verifyDiscoveredCandidate(signedToken('doyel', youtubeCandidate), 'doyel'), 'YouTube embed link is an allowed review candidate')

  const oldFetch = global.fetch
  let commonsCalls = 0
  global.fetch = async (input) => {
    const url = new URL(String(input))
    assert.equal(url.hostname, 'commons.wikimedia.org')
    commonsCalls += 1
    return Response.json({ query: { pages: [
      { title: 'File:Doyel_CC.jpg', imageinfo: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/doyel.jpg', thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/doyel.jpg/720px-doyel.jpg', descriptionurl: 'https://commons.wikimedia.org/wiki/File:Doyel_CC.jpg', mime: 'image/jpeg', width: 1200, extmetadata: { ObjectName: { value: 'Oriental magpie-robin' }, Artist: { value: 'Photographer' }, LicenseShortName: { value: 'CC BY-SA 4.0' }, LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0/' } } }] },
      { title: 'File:Doyel_Unknown.jpg', imageinfo: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/doyel2.jpg', thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/doyel2.jpg/720px-doyel2.jpg', descriptionurl: 'https://commons.wikimedia.org/wiki/File:Doyel_Unknown.jpg', mime: 'image/jpeg', width: 1200, extmetadata: { ObjectName: { value: 'Bird' }, Artist: { value: 'Unknown' } } }] },
    ] } })
  }
  try {
    const species = { slug: 'doyel', scientificName: 'Copsychus saularis', sensitive: false }
    const commons = await discoverSpeciesMedia(species, 'commons')
    assert.equal(commons.length, 2)
    assert.equal(commons.filter((item) => item.eligibleLicense).length, 1, 'only explicitly reusable Commons licenses are eligible')
    assert.equal(commons[0].verificationStatus, 'needs_review', 'Commons search never auto-publishes')
    assert.equal(commons[1].verificationStatus, 'restricted', 'missing file-level license is restricted')
    assert.ok(verifyDiscoveredCandidate(commons[0].token, 'doyel'))
    await discoverSpeciesMedia(species, 'commons')
    assert.equal(commonsCalls, 1, 'provider metadata is cached')

    let inatCalls = 0
    global.fetch = async (input) => {
      const url = new URL(String(input)); inatCalls += 1
      if (url.pathname.endsWith('/taxa')) return Response.json({ results: [{ id: 42, name: 'Copsychus saularis' }, { id: 43, name: 'Copsychus saularis ceylonensis' }] })
      assert.equal(url.searchParams.get('photo_license'), 'cc0,cc-by,cc-by-sa')
      return Response.json({ results: [{ id: 888, taxon: { name: 'Copsychus saularis' }, user: { login: 'observer' }, photos: [
        { id: 77, url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/77/square.jpeg', license_code: 'cc-by', attribution: '© observer' },
        { id: 78, url: 'https://static.inaturalist.org/photos/78/square.jpeg', license_code: 'cc-by', attribution: '© observer' },
        { id: 79, url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/79/square.jpeg', license_code: 'cc-by-nc', attribution: '© observer' },
      ] }] })
    }
    const inat = await discoverSpeciesMedia(species, 'inaturalist')
    assert.equal(inat.length, 1, 'iNaturalist requires exact taxon, open-data host and acceptable image license')
    assert.match(inat[0].url, /\/medium\.jpeg$/)
    assert.equal(inat[0].verificationStatus, 'needs_review', 'Research Grade still requires photo review')
    assert.equal(inatCalls, 2)

    console.log('Species media: license allowlist, Commons/iNaturalist response filtering, metadata cache, signed per-species tokens, SSRF URL allowlist, and review-only publication passed.')
  } finally {
    global.fetch = oldFetch
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
