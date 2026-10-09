---
sidebar_position: 2
id: master-server
title: Master Server
description: Services Master Server
slug: ./master-server
---

# Master Server

The master server (`KONGOR.MasterServer`) is the HTTP API which the game client and the match servers talk to. It re-implements the API of the original Heroes Of Newerth master server, so the game client and the match servers work with it as they are.

## What It Does

- authenticates players and keeps track of their sessions
- serves account data, such as friends, clans, statistics, masteries, quests, and messages
- runs the in-game store and Plinko
- hands out the server list, and tells the game client where to find the chat server
- registers match servers and match server managers, and receives match state, results, replays, and statistics from them
- tells the game client where to download patches from, and can serve the [Content Delivery](/docs/services/content-delivery) files itself, at `/cdn`

## How It Connects

- listens on port `5555`, over plain HTTP, since that is what the game client speaks
- is publicly reachable at `http://api.kongor.net`, through the VPS
- stores its data in the [Database](/docs/services/database), keeps sessions and other short-lived state in the [Distributed Cache](/docs/services/distributed-cache), and sends its logs to the [Log Server](/docs/services/log-server)

## Configuration

Most of the configuration comes from the application host, such as the chat server's host name and ports, and the public gateway address which gets handed out to clients. The master server's own `appsettings` files hold the CDN settings: where the game client downloads patches from, and which local directory to serve at `/cdn`.
