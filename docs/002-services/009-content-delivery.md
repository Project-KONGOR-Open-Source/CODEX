---
sidebar_position: 9
id: content-delivery
title: Content Delivery
description: Services Content Delivery
slug: ./content-delivery
---

# Content Delivery

GEMINI is the collection of Heroes Of Newerth distribution files, which the launchers download in order to keep the game client and the match servers up to date. Each distribution has its own directory:

<div align="center">
    | Distribution | Contents             |
    |:------------:|:--------------------:|
    | `wac`        | Windows game client  |
    | `mac`        | macOS game client    |
    | `lac`        | Linux game client    |
    | `was`        | Windows match server |
    | `las`        | Linux match server   |
</div>

Every distribution comes with a `manifest.json`, which lists each file together with its size and its SHA-256 hash. [WILLOWMAKER](/docs/utilities/willowmaker) and [COMPEL](/docs/utilities/compel) compare their local files against the manifest, and only download the files which have changed.

## Where It Is Served From

The same files are available from two places, both with the same layout:

- **Cloudflare** (`https://cdn.kongor.net`): a Cloudflare R2 bucket, which is filled from GEMINI by GitHub Actions; this is the default for both launchers, and it keeps the heaviest traffic off the VPS and the home lab
- **Master Server** (`/cdn`): the [Master Server](/docs/services/master-server) can serve a local directory too, at `http://localhost:5555/cdn` locally, or at `http://api.kongor.net/cdn` publicly; in development, this is a GEMINI clone next to NEXUS, which is handy when working on the distribution files or when running without an internet connection

Both WILLOWMAKER and COMPEL let you choose which one to download from.

## Updating The Files

After adding, removing, or changing files in a distribution, its `manifest.json` needs to be regenerated, so that the hashes match the new files. The GEMINI repository has instructions and scripts for this. Large resource files are kept in object storage rather than in Git, and the same scripts take care of pulling them.

:::warning
    Text files in GEMINI must keep LF line endings. The same text file hashes differently with CRLF than with LF, and a manifest generated from CRLF files would make every launcher download those files again on every start.
:::
