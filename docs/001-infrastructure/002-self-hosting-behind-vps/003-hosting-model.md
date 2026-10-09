---
sidebar_position: 3
id: hosting-model
title: Hosting Model
description: Self-Hosting Behind VPS Hosting Model
slug: ./hosting-model
---

import ThemedImage from '@theme/ThemedImage';
import LightModeDiagram from './003-hosting-model-diagram-light.png';
import DarkModeDiagram from './003-hosting-model-diagram-dark.png';

# Hosting Model

## Diagram

The following diagram shows how the Project KONGOR services are hosted. Everything runs on a private home lab, and a public VPS sits in front of it as the only machine which can be reached from the internet.

<ThemedImage
  alt = "Hosting Model Diagram"
  sources = {{ light: LightModeDiagram, dark: DarkModeDiagram }}
/>

Use `right-click` followed by `Save Link As ...` to download the diagram [source file](./003-hosting-model-diagram.excalidraw), which can be imported for editing in [excalidraw](https://excalidraw.com/).

## How It Works

### Clients

Players connect with [WILLOWMAKER](/docs/utilities/willowmaker), the Project KONGOR client launcher. WILLOWMAKER keeps the game client distribution up to date from the CDN, then launches the game client pointed at the master server.

### Cloudflare

Cloudflare provides DNS for the domain. The records for the API, the user portal, and the chat server point straight at the VPS (DNS-only, not proxied), because the chat server and the match servers need raw TCP and UDP ports, which Cloudflare's proxy does not forward.

Cloudflare also hosts the [CDN](/docs/services/content-delivery), which the launchers use to keep the game client and match server distributions up to date. The master server can act as the CDN too, which is handy for local development or as a fallback.

### Virtual Private Server

The VPS runs [Pangolin](https://pangolin.net) as a Docker Compose stack of three containers:

- **Pangolin**: the dashboard and API, which hold the configuration for sites and resources, and push it to the other components
- **Gerbil**: owns all of the public ports, and manages the WireGuard end of the tunnel
- **Traefik**: shares Gerbil's network, and routes HTTP/HTTPS traffic by host name (with Let's Encrypt certificates) and raw TCP/UDP traffic by port

Nothing else runs on the VPS, and it stores no player data.

### Tunnel

Newt runs on the home lab and dials out to the VPS, setting up an encrypted WireGuard tunnel to Gerbil. Every request which reaches the VPS for a home lab service travels down this tunnel. The home router never accepts an inbound connection, so no ports need to be forwarded and the home network's IP address is never exposed.

### Home Lab

Newt hands the traffic coming out of the tunnel to its target on the local network:

- **Project KONGOR Services**: [NEXUS](/docs/services/landing-page), which includes the master server, the chat server, the user portal, and everything they depend on
- **Match Server Manager / Match Server Reverse-Proxy**: [COMPEL](/docs/utilities/compel), which keeps the match server distribution up to date, runs the match servers, and receives the game and voice traffic on the public ports through its built-in UDP proxy, before forwarding it to the match servers themselves

## Public Endpoints

The following table summarises what is exposed to the internet, and where each request ends up.

<div align="center">
    | Public Endpoint         | Protocol | Home Lab Target   | Purpose                            |
    |:-----------------------:|:--------:|:-----------------:|:----------------------------------:|
    | `api.kongor.net`        | HTTP     | Master Server     | game client and match server API   |
    | `portal.kongor.net`     | HTTPS    | Web Portal UI     | account management                 |
    | `chat.kongor.net:11031` | TCP      | Chat Server       | game client connections            |
    | `chat.kongor.net:11032` | TCP      | Chat Server       | match server connections           |
    | `chat.kongor.net:11033` | TCP      | Chat Server       | match server manager connections   |
    | `kongor.net:21234`      | UDP      | COMPEL            | server list pings                  |
    | `kongor.net:21235+`     | UDP      | COMPEL            | match server game traffic          |
    | `kongor.net:21435+`     | UDP      | COMPEL            | match server voice traffic         |
    | `cdn.kongor.net`        | HTTPS    | none (Cloudflare) | distribution synchronisation       |
</div>

The game and voice ports go up by one for each match server, so five match servers use ports `21235-21239` and `21435-21439`.

## Additional Notes

- Cloudflare is not mandatory for this setup. Any DNS provider works, and the CDN content can be served by the master server instead.
- Renting a VPS may sound costly, but it is not. The VPS only acts as a gateway and does not need much power, so a very modest one is enough.
