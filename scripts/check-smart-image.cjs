#!/usr/bin/env node
// Regression tests for visitor images, including optimizer outages and URL changes.
const fs = require('node:fs')
const Module = require('node:module')
const ts = require('typescript')
const assert = require('node:assert/strict')
const React = require('react')
const { create, act } = require('react-test-renderer')
require('./register-typescript.cjs')
require.extensions['.tsx'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, filename)
}
// Expose the props sent to next/image; actual HTTP delivery is tested separately.
const load = Module._load
Module._load = function (id, ...args) {
  if (id === 'next/image') return { __esModule: true, default: (props) => React.createElement('img', props) }
  return load.call(this, id, ...args)
}
const SmartImage = require('../components/SmartImage.tsx').default
Module._load = load
globalThis.IS_REACT_ACT_ENVIRONMENT = true

async function main() {
  let renderer
  const render = async (props) => {
    await act(() => {
      const element = React.createElement(SmartImage, { alt: 'দোয়েল', width: 600, height: 400, ...props })
      if (renderer) renderer.update(element)
      else renderer = create(element)
    })
  }
  const image = () => renderer.root.findByType('img')
  const fail = async () => act(() => image().props.onError({ type: 'error' }))
  const noImage = () => assert.equal(renderer.root.findAllByType('img').length, 0)

  await render({ src: '/seed/prani/doyel.jpg' })
  assert.equal(image().props.unoptimized, true, 'bundled animals use their public URL')
  await render({ src: '/seed/udbhid/am.jpg' })
  assert.equal(image().props.unoptimized, true, 'bundled plants use their public URL')

  let errors = 0
  const remote = { src: 'https://images.example.org/bird.jpg', onError: () => errors++ }
  await render(remote)
  assert.equal(image().props.unoptimized, false)
  await fail()
  assert.equal(image().props.unoptimized, true, 'optimizer failure retries the original')
  assert.equal(image().props.src, remote.src)
  assert.equal(errors, 0, 'recoverable error is not terminal')
  await fail()
  noImage()
  assert.equal(errors, 1)

  await render({ src: '/seed/prani/doyel.jpg' })
  assert.equal(image().props.src, '/seed/prani/doyel.jpg', 'new source recovers from failed image')
  await fail()
  noImage()
  await render({})
  noImage()
  await render({ src: '/seed/udbhid/am.jpg' })
  assert.equal(image().props.src, '/seed/udbhid/am.jpg', 'empty source can become available')

  await render({ src: '/uploads/test.jpg', unoptimized: true })
  assert.equal(image().props.unoptimized, true)
  await fail()
  noImage()
  await act(() => renderer.unmount())
  console.log('SmartImage: bundled URLs, original-URL retry, terminal fallback, URL reset and caller opt-out passed.')
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
