---
sidebar_position: 2
id: set-up-environment
title: Set Up Environment
description: Self-Hosting Locally Set Up Environment
slug: ./set-up-environment
---

# Set Up Environment

## Secrets

NEXUS needs a few secrets before it can start. Each one can be set either as a user secret or as an environment variable, and user secrets take precedence.

<div align="center">
    | Parameter                    | Environment Variable         | Required                |
    |:----------------------------:|:----------------------------:|:-----------------------:|
    | `database-password`          | `DATABASE_PASSWORD`          | always                  |
    | `distributed-cache-password` | `DISTRIBUTED_CACHE_PASSWORD` | always                  |
    | `smtp-host`                  | `SMTP_HOST`                  | outside of development  |
    | `smtp-port`                  | `SMTP_PORT`                  | outside of development  |
    | `smtp-username`              | `SMTP_USERNAME`              | outside of development  |
    | `smtp-password`              | `SMTP_PASSWORD`              | outside of development  |
</div>

User secrets are set against the application host project:

```powershell
# In The Context Of The Solution Directory
dotnet user-secrets set "Parameters:database-password" "{password}" --project ASPIRE.ApplicationHost
dotnet user-secrets set "Parameters:distributed-cache-password" "{password}" --project ASPIRE.ApplicationHost
```

:::warning
    SQL Server rejects weak passwords. The database password needs to be at least eight characters long, and include three of the following: upper case letters, lower case letters, digits, and symbols.
:::

## Public Host Names

In development, everything points at `localhost`. The production settings, in `ASPIRE.ApplicationHost/appsettings.Production.json`, hold the public host names which get handed out to game clients and match servers. When hosting under a different domain, change these to match:

```json
"ChatServer": {
    "Host": "chat.kongor.net",
    "ClientPort": 11031,
    "MatchServerPort": 11032,
    "MatchServerManagerPort": 11033
},

"Infrastructure": {
    "Gateway": "kongor.net"
}
```

:::info
    For exposing the locally-hosted services to the public internet securely and anonymously, please refer to the [Self-Hosting Behind VPS](/docs/infrastructure/self-hosting-behind-vps/steps-and-configuration) section.
:::
