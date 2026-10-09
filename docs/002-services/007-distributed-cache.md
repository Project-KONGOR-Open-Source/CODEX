---
sidebar_position: 7
id: distributed-cache
title: Distributed Cache
description: Services Distributed Cache
slug: ./distributed-cache
---

# Distributed Cache

The distributed cache is a [Valkey](https://valkey.io) instance, an open-source, Redis-compatible in-memory data store. It runs as a password-protected Docker container, which the application host starts, with its data stored in a Docker volume.

## What It Stores

The distributed cache holds short-lived state which needs to be shared between services, but which does not belong in the database:

- authentication handshakes and session cookies
- pending friend requests
- notifications between the master server and the chat server, such as when a player logs out

## Dashboard

The application host also starts [Redis Insight](https://redis.io/insight), a web interface for browsing and editing the contents of the distributed cache. It comes already connected, and it can be opened from the Aspire dashboard.

## Used By

- [Master Server](/docs/services/master-server)
- [Chat Server](/docs/services/chat-server)
