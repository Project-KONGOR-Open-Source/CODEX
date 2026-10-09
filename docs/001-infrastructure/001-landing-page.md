---
sidebar_position: 1
id: landing-page
title: Infrastructure
description: Infrastructure Landing Page
slug: ./landing-page
---

# Infrastructure

This section covers how the Project KONGOR services are hosted and how they are exposed to the public internet.

The services run on a private home lab, with no ports opened on the home router. A small rented VPS sits in front of the home lab as the public gateway, and the two are connected through an encrypted tunnel which the home lab dials out to. Players only ever talk to the VPS, so the home network's IP address stays private.

The [Self-Hosting Behind VPS](/docs/infrastructure/self-hosting-behind-vps/motivation) pages walk through this setup:

- [Motivation](/docs/infrastructure/self-hosting-behind-vps/motivation): why the services are hosted this way
- [Tooling And Terminology](/docs/infrastructure/self-hosting-behind-vps/tooling-and-terminology): the moving parts and the jargon around them
- [Hosting Model](/docs/infrastructure/self-hosting-behind-vps/hosting-model): how traffic gets from a player to the home lab
- [Steps And Configuration](/docs/infrastructure/self-hosting-behind-vps/steps-and-configuration): how to set it all up, with the configuration in use today
- [Troubleshooting](/docs/infrastructure/self-hosting-behind-vps/troubleshooting): common problems and how to fix them

The [Email Service](/docs/infrastructure/email-service) page covers the one external service which the Project KONGOR services depend on, and which needs to be set up for production.
