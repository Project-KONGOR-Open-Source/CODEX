---
sidebar_position: 1
id: landing-page
title: Services
description: Services Landing Page
slug: ./landing-page
---

# Services

NEXUS is the full suite of Project KONGOR services, built as a .NET Aspire distributed application. A single application host starts every service, together with the containers they depend on, and wires them up with the right connection strings, ports, and settings. The source code is available on [GitHub](https://github.com/Project-KONGOR-Open-Source/NEXUS).

NEXUS is made up of the following services:

<div align="center">
    | Service                                               | Purpose                                                    |
    |:-----------------------------------------------------:|:----------------------------------------------------------:|
    | [Master Server](/docs/services/master-server)         | HTTP API for the game client and the match servers         |
    | [Chat Server](/docs/services/chat-server)             | real-time chat, social features, and matchmaking           |
    | [Web Portal API](/docs/services/web-portal-api)       | back end of the user portal                                |
    | [Web Portal UI](/docs/services/web-portal-ui)         | the user portal website                                    |
    | [Database](/docs/services/database)                   | persistent storage for accounts, matches, and statistics   |
    | [Distributed Cache](/docs/services/distributed-cache) | short-lived state shared between services                  |
    | [Log Server](/docs/services/log-server)               | structured logs from every service, in one place           |
    | [Content Delivery](/docs/services/content-delivery)   | the CDN which the launchers synchronise from               |
</div>

The [Self-Hosting Locally](/docs/services/self-hosting-locally/resolve-dependencies) pages cover running all of NEXUS on a single machine, and the [Hosting Model](/docs/infrastructure/self-hosting-behind-vps/hosting-model) shows where NEXUS fits in the bigger picture.
