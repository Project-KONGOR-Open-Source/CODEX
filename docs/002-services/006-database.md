---
sidebar_position: 6
id: database
title: Database
description: Services Database
slug: ./database
---

# Database

NEXUS keeps all of its persistent data in a SQL Server database: accounts, clans, matches, statistics, and so on. SQL Server runs as a Docker container, which the application host starts, with its data stored in a Docker volume so that it survives restarts.

## Schema And Migrations

The database schema is defined in `MERRICK.DatabaseContext`, using Entity Framework Core. Every time NEXUS starts, the database context service applies any pending migrations, then seeds the initial data, such as the default users and clans, if it is not already there.

New migrations are created with the Entity Framework Core tools, and get applied automatically on the next start.

## Connecting To The Database

- SQL Server listens on its default port, `1433`, so it can be reached at `localhost` from any SQL Server client, without specifying a port
- the user name is `sa`, and the password is the database password from the [Set Up Environment](/docs/services/self-hosting-locally/set-up-environment) section
- the database is called `development` or `production`, depending on the environment, and each environment has its own data volume

## Used By

- [Master Server](/docs/services/master-server)
- [Chat Server](/docs/services/chat-server)
- [Web Portal API](/docs/services/web-portal-api)
