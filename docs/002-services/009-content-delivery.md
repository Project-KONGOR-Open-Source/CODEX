---
sidebar_position: 9
id: content-delivery
title: Content Delivery
description: Services Content Delivery
slug: ./content-delivery
---

# Content Delivery

GEMINI is the collection of Heroes Of Newerth distributions which the launchers keep up to date, one for each platform:

<div align="center">
    | Distribution | Platform             |
    |:------------:|:--------------------:|
    | `wac`        | Windows game client  |
    | `lac`        | Linux game client    |
    | `was`        | Windows match server |
    | `las`        | Linux match server   |
</div>

Every distribution comes with a `manifest.json`, which describes its contents, with a size and a SHA-256 hash for every entry. [WILLOWMAKER](/docs/utilities/willowmaker) and [COMPEL](/docs/utilities/compel) compare the local installation against the manifest, and only synchronise what has changed.

The manifest also records, for every file, whether it is a program, so that the launchers can give each program the execute permission that Linux needs to run it. It carries two versions, both written as `5.YY.MM.DD`:

- `versionExecutable`, the game's version, which the distribution's programs were built with
- `versionResources`, the date on which the manifest was generated, since the resources can change without the programs

The manifest lives on the CDN only: it never lists itself, and the launchers read it from the CDN without keeping a copy in an installation.

## Where It Is Served From

The same content is available from two places, both with the same layout:

- **Cloudflare** (`https://cdn.kongor.net`): a Cloudflare R2 bucket, which is kept in sync with GEMINI; this is the default for both launchers, and it keeps the heaviest traffic off the VPS and the home lab
- **Master Server** (`/cdn`): the [Master Server](/docs/services/master-server) can act as the CDN too, at `http://localhost:5555/cdn` locally, or at `http://api.kongor.net/cdn` publicly; in development, it uses a copy of GEMINI next to NEXUS, which is handy when working on the distributions or when running without an internet connection

Both WILLOWMAKER and COMPEL let you choose which one to use.

## Keeping Manifests Up To Date

After changing a distribution, its `manifest.json` needs to be regenerated, so that the hashes match the new contents. [ARCANA](/docs/utilities/arcana) generates it, which is also how anyone hosting their own CDN makes the manifests that the launchers need.

:::warning
    Text files in GEMINI must keep LF line endings. The same text file hashes differently with CRLF than with LF, and a manifest generated from CRLF files would make every launcher synchronise those entries again on every start.
:::
