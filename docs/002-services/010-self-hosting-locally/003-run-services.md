---
sidebar_position: 3
id: run-services
title: Run Services
description: Self-Hosting Locally Run Services
slug: ./run-services
---

# Run Services

After resolving the dependencies and setting up the environment, make sure that Docker is running, then start NEXUS from the solution directory.

```powershell
# In The Context Of The Solution Directory
aspire run
```

... or without the Aspire CLI:

```powershell
# In The Context Of The Solution Directory
dotnet run --project ASPIRE.ApplicationHost --launch-profile "ASPIRE.ApplicationHost Development"
```

The first start takes a while, since Docker needs to download the database, distributed cache, and log server images. These containers are persistent, so they keep running after NEXUS stops, and later starts are much quicker.

## Aspire Dashboard

Once NEXUS is running, the Aspire dashboard is available at `https://localhost:5550`, and the console prints a link which logs straight in. The dashboard lists every service and container, along with its state, endpoints, logs, and traces, and it is the easiest place to check that everything started correctly.

## Production

The `ASPIRE.ApplicationHost Production` launch profile runs NEXUS for real. Compared to development, it uses the production database, the public host names, a real [email service](/docs/infrastructure/email-service) instead of Mailpit, and a login for the log server.

```powershell
# In The Context Of The Solution Directory
dotnet run --project ASPIRE.ApplicationHost --launch-profile "ASPIRE.ApplicationHost Production"
```

## Connecting

With NEXUS running locally, the launchers can be pointed at it:

- **WILLOWMAKER**: pick `localhost:5555` as the master server, and `localhost:5555/cdn` as the CDN
- **COMPEL**: set `Gateway` to `localhost`, and `CDN` to `localhost:5555/cdn`

See [WILLOWMAKER](/docs/utilities/willowmaker) and [COMPEL](/docs/utilities/compel) for more details.
