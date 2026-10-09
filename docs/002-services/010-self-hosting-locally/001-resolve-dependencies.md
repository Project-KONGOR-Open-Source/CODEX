---
sidebar_position: 1
id: resolve-dependencies
title: Resolve Dependencies
description: Self-Hosting Locally Resolve Dependencies
slug: ./resolve-dependencies
---

# Resolve Dependencies

## Required Tools

- **.NET**: [https://dotnet.microsoft.com](https://dotnet.microsoft.com), the SDK version needs to match the one used by NEXUS
- **Docker**: [https://www.docker.com](https://www.docker.com), which runs the database, the distributed cache, and the log server

Docker can be installed in one of the following ways:

```powershell
# Windows, Using The Docker Desktop Installer: https://www.docker.com/products/docker-desktop/
# ... Or Using WinGet
winget install --id=Docker.DockerDesktop --exact
```

```bash
# Linux, Using The Online Installation Script
curl -fsSL https://get.docker.com | sh
```

## Optional Tools

- **PowerShell**: [https://learn.microsoft.com/en-gb/powershell](https://learn.microsoft.com/en-gb/powershell)
- **Entity Framework Core Tools**: [https://www.nuget.org/packages/dotnet-ef](https://www.nuget.org/packages/dotnet-ef)
- **Aspire CLI**: [https://www.nuget.org/packages/Aspire.CLI](https://www.nuget.org/packages/Aspire.CLI)

These tools are not required, but the guides in this section use them. The .NET tools are pinned in NEXUS's tool manifest, so they can be restored with a single command:

```powershell
# In The Context Of The Solution Directory
dotnet tool restore
```

:::note
    Restored tools can only be run as `dotnet {command}`, from inside the solution directory. To run the Aspire CLI as just `aspire`, from anywhere, also install it globally with `dotnet tool install --global Aspire.CLI`.
:::

## Source Code

Clone [NEXUS](https://github.com/Project-KONGOR-Open-Source/NEXUS). To have the master server serve the [Content Delivery](/docs/services/content-delivery) files locally, also clone GEMINI into the same parent directory, so that the two sit next to each other.
