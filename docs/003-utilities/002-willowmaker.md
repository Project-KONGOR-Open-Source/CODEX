---
sidebar_position: 2
id: willowmaker
title: WILLOWMAKER
description: Utilities WILLOWMAKER
slug: ./willowmaker
---

# WILLOWMAKER

WILLOWMAKER is the Heroes Of Newerth game client launcher for Project KONGOR. It keeps the game client distribution up to date, then launches the game client connected to the chosen master server. It runs on Windows and Linux, and it ships as a single self-contained executable, so nothing else needs to be installed.

## What It Does

- lets you pick a master server and a CDN, and shows whether both are reachable
- keeps the game client distribution up to date from the CDN, synchronising only what has changed and removing anything which is no longer part of the distribution, and gives its programs the execute permission on Linux
- checks that the system has everything the game needs, then launches the game client, or the map editor
- checks for new releases on start-up, and updates itself

## Installing

Get the latest release for your platform from [GitHub](https://github.com/Project-KONGOR-Open-Source/WILLOWMAKER/releases), and extract it into either an empty directory or an existing Heroes Of Newerth installation. On the first launch, WILLOWMAKER sets up the game client distribution in that directory.

:::warning
    Since WILLOWMAKER removes files which are not part of the game client distribution, it refuses to run from a directory which contains unrelated files, such as a downloads or documents directory. This protects personal files from being deleted by mistake.
:::

## Prerequisites

Before it launches the game client or the map editor, WILLOWMAKER runs the distribution's prerequisites check, `hon_check`. When anything the game needs from the operating system is missing, such as a runtime or a library, WILLOWMAKER shows a **Missing Prerequisites** dialog, which says what is missing, why the game needs it, and how to install it, and launches nothing. The text in the dialog can be selected, so that an install command can be copied. WILLOWMAKER also launches nothing when the check itself cannot run, and the dialog then says why.

## Master Server And CDN

<div align="center">
    | Master Server    | CDN                                                | When To Use                    |
    |:----------------:|:--------------------------------------------------:|:------------------------------:|
    | `api.kongor.net` | `cdn.kongor.net` or `api.kongor.net/cdn`           | playing on the public services |
    | `localhost:5555` | `localhost:5555/cdn`                               | running NEXUS locally          |
    | custom address   | custom address                                     | any other master server        |
</div>

`cdn.kongor.net` is served by Cloudflare and is the best choice in most cases, while `api.kongor.net/cdn` is served by the master server itself and works as a fallback. See [Content Delivery](/docs/services/content-delivery) for more details.

:::tip
    If the game client distribution is already up to date, or the CDN is not reachable, the game client can also be launched without synchronising first: press and hold **Play Heroes Of Newerth** until the button fills, then confirm. A quick click still synchronises before launching, and releasing the button before it fills launches nothing. Skipping synchronisation is meant for development, because an out-of-date distribution may not be able to connect to match servers.
:::
