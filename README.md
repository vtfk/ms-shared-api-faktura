[![Build Status](https://travis-ci.com/vtfk/ms-shared-api-faktura.svg?branch=master)](https://travis-ci.com/vtfk/ms-shared-api-faktura)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# ms-shared-api-faktura

API for the faktura service

# API

## `GET /batches`

List all batches

returns array of items

```JavaScript
[
  {
    batchId: "V1StGXR8_Z5jdHi6B-myT",
    batchCreated: 1554728722868,
  },
  {
    batchId: "OuXThQPmRf_aiAPNuRKVA",
    batchCreated: 1554464941589,
  }
]
```

## `GET /batches/download`

Creates a new batch
Returns a latin1 encoded csv-file of the given batch if there are files else you'll get a 404 and an empty array.

## `GET /batches/:batchId/download`

Returns a latin1 encoded csv-file of the given batch

## `GET /docs`

This readme

## `GET /new`

Returns number of new files

```JavaScript
3
```

# License

[MIT](LICENSE)