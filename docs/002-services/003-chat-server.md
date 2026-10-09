---
sidebar_position: 3
id: chat-server
title: Chat Server
description: Services Chat Server
slug: ./chat-server
---

# Chat Server

The chat server (`TRANSMUTANSTEIN.ChatServer`) keeps a long-lived TCP connection open to every game client, match server, and match server manager, and handles everything that needs to happen in real time.

## What It Does

- connects and authenticates game clients, match servers, and match server managers
- chat channels and private messages
- friends and other social features
- groups and matchmaking
- match state and match results, as reported by the match servers

## How It Connects

The chat server listens on the following ports:

<div align="center">
    | Port    | Protocol | Used By                                         |
    |:-------:|:--------:|:-----------------------------------------------:|
    | `11031` | TCP      | game clients                                    |
    | `11032` | TCP      | match servers                                   |
    | `11033` | TCP      | match server managers                           |
    | `5554`  | HTTPS    | health checks and status, for the master server |
</div>

- the TCP ports are publicly reachable at `chat.kongor.net`, through the VPS
- the master server tells game clients and match servers where to find the chat server, using the host name and ports set in the application host's configuration
- stores its data in the [Database](/docs/services/database), uses the [Distributed Cache](/docs/services/distributed-cache) for shared state and for notifications from the master server, and sends its logs to the [Log Server](/docs/services/log-server)
