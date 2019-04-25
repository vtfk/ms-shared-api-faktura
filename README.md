[![Build Status](https://travis-ci.com/vtfk/ms-shared-api-faktura.svg?branch=master)](https://travis-ci.com/vtfk/ms-shared-api-faktura)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# ms-shared-api-faktura

API for the faktura service.

Connect it to a compatible database to download batches of invoices ready for import by Visma.

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

Creates a new batch.
Returns a latin1 encoded csv-file of the given batch if there are files else you'll get a 404 and an empty array.
The batch size is limited to 100 invoices.

Returns

```
01020304050;Ole Rusk;Konglevegen 38;;1732;Høtten;9876543211;ole@rusk.no;103;1074;1;ElevPC 2018;Ulla Rusk Rasch - Bamble videregående skole - 32 32 32 41
```

## `GET /batches/:batchId/download`

Returns a latin1 encoded csv-file of the given batch.

Returns

```
01020304050;Ole Rusk;Konglevegen 38;;1732;Høtten;9876543211;ole@rusk.no;103;1074;1;ElevPC 2018;Ulla Rusk Rasch - Bamble videregående skole - 32 32 32 41
```

## `GET /docs`

This readme.

## `GET /new`

Returns number of new files.

A new file is an invoice not yet downloaded via a batch.

Returns

```JavaScript
3
```

# Setup

Configure [now.json](now.json) for your environment.

```
MONGODB_CONNECTION=db-connection # Your mongodb connection string
MONGODB_COLLECTION=fakturagrunnlag # Name for the collection
MONGODB_NAME=felles # Name for DB
MOA_TENANT_ID=@moa_tenant_id # Tenant id for Azure AD, used for GUI (see related)
JWT_SECRET=@jwt-secret # JWT for machine to machine use of the api
PAPERTRAIL_HOST=@papertrail-host # Your papertrail host
PAPERTRAIL_PORT=@papertrail-port # your papertrail port
PAPERTRAIL_HOSTNAME=elevpc # Your papertrail hostname for logs
```

## Deploy to ZEIT/Now

Run the deploy script

```
$ npm run deploy
```

# Related

- [web-admin-faktura](admin.faktura.service.t-fk.no) - GUI for this API

# License

[MIT](LICENSE)