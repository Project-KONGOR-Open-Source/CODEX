---
sidebar_position: 8
id: log-server
title: Log Server
description: Services Log Server
slug: ./log-server
---

# Log Server

The log server is a [Seq](https://datalust.co/seq) instance, which collects the structured logs of every NEXUS service, so that they can be searched and filtered in one place. It runs as a Docker container, which the application host starts, with its data stored in a Docker volume, and it can be opened from the Aspire dashboard.

The Aspire dashboard shows logs too, but only while NEXUS is running. Seq keeps them across restarts, which makes it the place to look when investigating something after the fact.

## Authentication

In development, the log server does not ask for a login. In every other environment, it is protected by an administrator account, which the application host creates with a well-known first-run password, and Seq asks for a new password on the first login.

:::note
    The administrator password is kept in the log server's data volume. Once it has been set, it is also required when running in development.
:::

## Used By

Every NEXUS service sends its logs here.
