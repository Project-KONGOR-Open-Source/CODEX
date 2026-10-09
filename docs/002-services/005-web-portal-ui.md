---
sidebar_position: 5
id: web-portal-ui
title: Web Portal UI
description: Services Web Portal UI
slug: ./web-portal-ui
---

# Web Portal UI

The web portal UI (`DAWNBRINGER.WebPortal.UI`) is the user portal website, available at [https://portal.kongor.net](https://portal.kongor.net). It is a Blazor application, which renders on the server.

## What It Does

- account creation and login
- email address registration
- forgotten password resets
- account tools
- a downloads page for the launchers

## How It Connects

- listens on port `5557`, over HTTPS
- is publicly reachable at `https://portal.kongor.net`, through the VPS, and visiting the bare root domain redirects there
- talks to the [Web Portal API](/docs/services/web-portal-api) for everything account-related, and never to the database directly
- sends its logs to the [Log Server](/docs/services/log-server)
