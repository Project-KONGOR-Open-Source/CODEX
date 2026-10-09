---
sidebar_position: 4
id: web-portal-api
title: Web Portal API
description: Services Web Portal API
slug: ./web-portal-api
---

# Web Portal API

The web portal API (`ZORGATH.WebPortal.API`) is the back end of the user portal. It is a REST API which handles everything account-related that happens outside of the game.

## What It Does

- creates accounts
- registers and verifies email addresses
- changes and resets passwords
- manages users and clans, and handles administration tasks
- sends emails, such as email address verifications and password resets

## How It Connects

- listens on port `5556`, over HTTPS
- is not exposed to the internet, since only the [Web Portal UI](/docs/services/web-portal-ui) talks to it
- stores its data in the [Database](/docs/services/database), and sends its logs to the [Log Server](/docs/services/log-server)

## Email

In development, emails are caught by Mailpit, a local SMTP server which the application host starts automatically. Mailpit has a web interface at `http://localhost:8025`, where every email which NEXUS sends can be read, and nothing ever reaches a real inbox.

In every other environment, emails go out through a real email service, such as Amazon SES, using SMTP with STARTTLS. Setting one up is covered in the [Email Service](/docs/infrastructure/email-service) section, and the SMTP parameters which NEXUS reads are described in the [Set Up Environment](/docs/services/self-hosting-locally/set-up-environment) section.
