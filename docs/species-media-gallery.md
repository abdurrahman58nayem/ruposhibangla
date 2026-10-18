# Species media gallery and review workflow

## Safety model

- Discovery is admin-only at `/admin/species-media`. No API is searched on public page requests.
- Search starts with the stored scientific name. iNaturalist additionally requires an exact species-rank taxon-name match and research-grade observations; no common-name-only photo is queued there.
- External search results are signed server-side and stored only after an explicit admin action. New assets start `needs_review`, or `restricted` when a recognized reuse license is absent. They never appear publicly until an administrator confirms both species identity and rights.
- Public species galleries show only new image records with `verificationStatus: "verified"`; new video records are treated the same. Existing legacy media is not migrated or rewritten by this feature.
- Duplicate source IDs/URLs are rejected. If the same source reappears with changed title, creator, URL, or license metadata, the saved record is returned to review.
- No media bytes are downloaded into this app, its uploads directory, or R2. Browser loads approved image URLs lazily. Pexels videos and Commons files stream from their origin; YouTube is an embed only. Admin can manually issue a timed `HEAD` request to fixed allowlisted media hosts; only definitive 404/410 marks Unavailable, while redirects, 403/405, and network failures are inconclusive. YouTube availability is not probed with arbitrary URLs.
- Search endpoints accept a species slug and fixed provider identifier, not a caller-supplied URL. Upstream fetches use fixed API hosts, HTTPS, timeouts, and redirects disabled. Signed review tokens and approved-host checks prevent arbitrary URL fetches.
- iNaturalist and photo metadata can expose sensitive location information. The discovery endpoint refuses records marked sensitive; review of those species must remain separate.

## Existing storage compatibility

`Species.media` already persists as JSON/JSONB in both the JSON repository and Neon `species.media` column. The new metadata is optional, additive JSON data; no SQL schema migration or data rewrite is needed. Existing media entries continue to parse. Export the species data before performing bulk editorial changes. To roll back, revert this code and remove the added media JSON entries using the admin/export workflow; do not run a database reset or reseed.

Each new `SpeciesMedia` record can store: `title`, `creator`, `creatorUrl`, `sourcePlatform`, `sourceId`/`mediaId`, `url`/`directMediaUrl`, `sourceUrl`, `license`, `licenseUrl`, `attributionText`, `commercialUse`, `modificationPermission`, `scientificName`, `identificationConfidence`, `identificationBasis`, `verificationStatus`, `verificationNote`, `lastVerifiedAt`, `lastReviewedAt`, and `lastCheckedAt`. `lastVerifiedAt` is reserved for a full human license/identity approval; URL availability checks have a separate timestamp.

## Legacy media baseline and rollout gate (2026-10-18)

- The repository's combined credit register contains 1,426 file/species records: 757 are marked verified in existing metadata and 669 remain pending. The 627 local `SEED_IMAGES` not represented by an existing exact file/species credit row are included as pending records on `/credits`; they are not silently credited or promoted.
- The species catalog has 1,448 image references. Thirty-seven references (seven to the shared hills placeholder and thirty to the shared forest placeholder) are generic local illustrations, not registered species photographs.
- The existing 156 video seeds intentionally overlap with two canonical curated kingfisher reels; these are checked for matching species identity and detail-page links, not treated as broken duplicate media.
- These counts describe repository metadata, not a fresh rights audit of every file. The live provider pilot and manual visual/license review of pending legacy assets remain release/operations gates. New discovery stays admin-only and nothing auto-publishes while that review is pending.

## Provider rules implemented

- **Wikimedia Commons:** one Action API search per admin query, `imageinfo` URL/MIME and `extmetadata`; file-level license and author are stored. Only CC0, Public Domain, CC BY, and CC BY-SA variants with explicit license metadata can be approved. The User-Agent can be set with `COMMONS_USER_AGENT`. Search metadata is cached in process for 15 minutes; media is not proxied or copied. Wikimedia's current limits can change; keep concurrency low and observe 429 responses.
- **iNaturalist:** exact scientific-name taxon resolution, research-grade observations, and `photo_license=cc0,cc-by,cc-by-sa`; default CC BY-NC and all-rights-reserved photos are excluded. The API docs distinguish `inaturalist-open-data.s3.amazonaws.com` (open-licensed photos) from `static.inaturalist.org` (not open licensed). Requests are cached for 15 minutes and remain below the documented recommendation of 60 requests/minute and 10,000/day in normal single-admin use. Search results still need human visual identification.
- **Pexels:** optional `PEXELS_API_KEY`, sent only from the server. Uses the v1 photo and video search endpoints, checks 429, and displays response quota headers when provided. Metadata cache is 15 minutes; the images/videos themselves are never cached by this app. Pexels requires a prominent Pexels link and recommends photographer credit; public approved Pexels items show both. Search by Latin name is not species identification, so human confirmation is mandatory.
- **YouTube:** optional server-only `YOUTUBE_API_KEY`; uses Data API search constrained to public, embeddable videos and checks `status.embeddable` before presenting a result. Metadata cache is 15 minutes. Only `youtube-nocookie` embed playback is used; standard YouTube terms are not treated as permission to download or reuse the video. The exact project quota is managed by Google Cloud and should be monitored there.

All provider results are cached as metadata only, for 15 minutes in the application process. Public media URLs are fetched by the visitor's browser, not by a server-side image proxy. Provider API terms and rate limits can change; check the official pages linked in the admin interface before changing these durations or reuse rules.

## Required environment variables

- `PEXELS_API_KEY` (optional; server only)
- `YOUTUBE_API_KEY` (optional; server only)
- `MEDIA_REVIEW_SECRET` (recommended long random secret; signs admin discovery candidates; server only)
- `COMMONS_USER_AGENT` (optional descriptive identifier; do not include an invented contact address)

No `NEXT_PUBLIC_*` key is used. Set these in the hosting environment (for example, Vercel Project Settings → Environment Variables), not in browser code. With no Pexels/YouTube keys, those provider searches return a clear configuration message; Commons and iNaturalist need no API key.

## Manual approval checklist

1. Compare the visible specimen with the species record and its scientific name; reject genus-level, lookalike, captive/illustrative, or otherwise uncertain matches.
2. Open the original source page. Confirm the displayed asset is still the same file and attribution matches the creator.
3. Confirm the exact file-level license. CC BY-SA requires an appropriate share-alike notice for adaptations; CC BY-NC and unknown licenses are not eligible for automatic publication. YouTube is embed-only.
4. Approve with both identity and rights confirmations. Otherwise keep restricted, mark unavailable, or remove.
5. Use “লাইসেন্স পুনরায় যাচাই” to unpublish a previously approved item back to Needs review before checking changed terms.

## Official references

- [Wikimedia Commons API / MediaWiki](https://commons.wikimedia.org/wiki/Commons:API/MediaWiki), [MediaWiki API etiquette](https://www.mediawiki.org/wiki/API:Etiquette), [Wikimedia API rate limits](https://www.mediawiki.org/wiki/Wikimedia_APIs/Rate_limits), [Commons reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- [iNaturalist API docs](https://api.inaturalist.org/v1/docs/), [iNaturalist search URL/license filters](https://www.inaturalist.org/pages/search+urls), [iNaturalist image rights guidance](https://help.inaturalist.org/en/support/solutions/articles/151000169918-can-i-use-the-photos-and-sounds-that-are-posted-on-inaturalist-)
- [Pexels API docs](https://www.pexels.com/api/documentation/), [Pexels license](https://www.pexels.com/license/)
- [YouTube Data API search](https://developers.google.com/youtube/data/reference/rest/v3/search/list), [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference), [YouTube API terms](https://developers.google.com/youtube/terms/api-services-terms-of-service)
