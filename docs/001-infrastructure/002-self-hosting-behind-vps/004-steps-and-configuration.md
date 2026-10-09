---
sidebar_position: 4
id: steps-and-configuration
title: Steps And Configuration
description: Self-Hosting Behind VPS Steps And Configuration
slug: ./steps-and-configuration
---

# Steps And Configuration

## Prerequisites

Before starting, make sure the following are in place:

- **Virtual Private Server (VPS)**: a Linux VPS with root access (Debian or Ubuntu recommended)
- **Domain Name**: a registered domain name, managed through Cloudflare or another DNS provider
- **Home Lab**: a machine on the local network which can run Docker, NEXUS, and COMPEL
- **Basic Command Line Knowledge**: familiarity with SSH, terminal commands, and editing files on the command line

:::warning
    The VPS does not need to be powerful, but Pangolin, Gerbil, and Traefik together use more memory than one might expect. 1 CPU core, 2GB of RAM, and 10GB of storage is a comfortable minimum.
:::

## Setup Order

The setup follows this order:

1. **Cloudflare**: point the domain at the VPS
2. **VPS**: install Pangolin, and open up the raw TCP and UDP ports
3. **Site Creation**: create a site in Pangolin, which provides the credentials for Newt
4. **Newt**: run Newt on the home lab, which connects it to the VPS
5. **Resource Creation**: create resources in Pangolin, which expose the home lab services
6. **Email Service**: set up an email provider, which NEXUS needs in production
7. **Project KONGOR Services**: run NEXUS and COMPEL on the home lab

:::tip
    Each section ends with a verification step. It is worth checking that each part works before moving on to the next one.
:::

## Cloudflare

### Register/Transfer Host Name

The domain needs to be managed through Cloudflare. If you don't have a domain yet, it can be registered directly through Cloudflare's registrar. If you already own one with another provider, it can either be transferred to Cloudflare, or kept where it is with its nameservers pointed at Cloudflare. Nameserver changes can take up to 24-48 hours to propagate.

Additional information on transferring domains to Cloudflare is available here: [https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare).

### DNS Records

Two DNS records point at the VPS's public IP address. The IP address can be found in the VPS provider's dashboard, or by running `curl -4 ifconfig.me` on the VPS.

The first is an A record for the root domain, which carries the raw TCP and UDP traffic for the chat server and the match servers. The second is a wildcard A record, which lets Pangolin serve any sub-domain (for example `api.kongor.net` or `portal.kongor.net`) without each one needing its own record.

Both records must be set to **DNS only** (grey cloud). Cloudflare's proxy only forwards HTTP/HTTPS traffic on its standard plans, so a proxied record would break the raw TCP and UDP ports, and it would also get in the way of the Let's Encrypt certificates which Pangolin requests for the HTTP sub-domains.

The rest of the records cover the services which don't go through the VPS: the CDN, this documentation site, and the email service. More specific records always take precedence over the wildcard, so these sub-domains are not affected by it.

The full set of DNS records looks like the following:

<div align="center">
    | Type  | Name                  | Content                                     | Proxy Status | Purpose                         |
    |:-----:|:---------------------:|:-------------------------------------------:|:------------:|:-------------------------------:|
    | A     | `@`                   | Public VPS IP Address                       | DNS Only     | chat server and match servers   |
    | A     | `*`                   | Public VPS IP Address                       | DNS Only     | HTTP sub-domains, via Pangolin  |
    | CNAME | `cdn`                 | `public.r2.dev`                             | Proxied      | CDN, on Cloudflare R2           |
    | CNAME | `codex`               | `project-kongor-open-source.github.io`      | Proxied      | this documentation site         |
    | CNAME | `{token}._domainkey`  | `{token}.dkim.amazonses.com`                | DNS Only     | email DKIM (three records)      |
    | MX    | `project`             | `10 feedback-smtp.eu-west-2.amazonses.com`  | DNS Only     | email custom MAIL FROM domain   |
    | TXT   | `project`             | `"v=spf1 include:amazonses.com ~all"`       | DNS Only     | email SPF                       |
    | TXT   | `_dmarc`              | `"v=DMARC1; p=none;"`                       | DNS Only     | email DMARC                     |
</div>

Additional information on setting up DNS records is available here: [https://docs.pangolin.net/self-host/dns-and-networking](https://docs.pangolin.net/self-host/dns-and-networking).

:::note
    The `cdn` record is created automatically when an R2 bucket is connected to a custom domain in the Cloudflare dashboard, and the `codex` record is the one GitHub Pages asks for when using a custom domain. The email records come from the email provider, and are described in the [Email Service](/docs/infrastructure/email-service) section.
:::

:::tip[VERIFICATION]
    Run `nslookup kongor.net` and `nslookup api.kongor.net`, replacing the domain with your own. Both should return the VPS's IP address. If they return Cloudflare IP addresses instead, then the records are still proxied.
:::

## Virtual Private Server

### Pangolin

Pangolin ties the whole setup together. It runs on the VPS, holds the configuration for every site and resource, and drives Traefik and Gerbil, which do the actual work of receiving the traffic and sending it down the tunnel to the home lab.

Pangolin's installer sets up everything as a Docker Compose stack, and it asks for the domain, the dashboard sub-domain, and an email address for Let's Encrypt along the way. Installation instructions are available in Pangolin's official Quick Install guide: [https://docs.pangolin.net/self-host/quick-install](https://docs.pangolin.net/self-host/quick-install).

:::tip[VERIFICATION]
    After installing Pangolin, run `sudo docker ps` and check that the `pangolin`, `gerbil`, and `traefik` containers are running. The Pangolin dashboard should load at the dashboard sub-domain chosen during the installation (for example `https://pangolin.kongor.net`).
:::

### Docker Stack

The installer writes everything to the working directory it was run from (`/root` in our case). The files which matter are the following:

```
/root
├── docker-compose.yml            # The Docker Compose Stack
└── config
    ├── config.yml                # Pangolin Configuration
    ├── db                        # Pangolin Database (Sites, Resources, Users)
    ├── letsencrypt               # TLS Certificates Issued By Let's Encrypt
    └── traefik
        ├── traefik_config.yml    # Traefik Static Configuration
        └── dynamic_config.yml    # Traefik Dynamic Configuration For The Pangolin Dashboard
```

The stack has three containers. **Pangolin** runs the dashboard and the API, and it is the only container which knows about sites and resources. **Gerbil** owns all of the public ports of the VPS and manages the WireGuard end of the tunnel. **Traefik** does not have its own network, it runs inside Gerbil's network (`network_mode: service:gerbil`) instead. This is why every port which Traefik listens on has to be published on the Gerbil container, and why `sudo docker ps` shows all the ports against Gerbil and none against Traefik.

Traefik gets its routing configuration from two places: from Pangolin over HTTP, which covers every resource and is refreshed every few seconds, and from `dynamic_config.yml`, which covers the routes to the Pangolin dashboard itself. Creating, changing, or deleting resources in the dashboard therefore never needs a restart. Only adding or removing public ports does, as described in the [Raw TCP And UDP Ports](#raw-tcp-and-udp-ports) section.

For reference, this is the `docker-compose.yml` which we use, with five match servers:

```yaml
name: pangolin
services:
  pangolin:
    image: docker.io/fosrl/pangolin:1.24.0
    container_name: pangolin
    restart: unless-stopped
    volumes:
      - ./config:/app/config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/v1/"]
      interval: "10s"
      timeout: "10s"
      retries: 15

  gerbil:
    image: docker.io/fosrl/gerbil:1.5.2
    container_name: gerbil
    restart: unless-stopped
    depends_on:
      pangolin:
        condition: service_healthy
    command:
      - --reachableAt=http://gerbil:3004
      - --generateAndSaveKeyTo=/var/config/key
      - --remoteConfig=http://pangolin:3001/api/v1/
    volumes:
      - ./config/:/var/config
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    ports:
      # Tunnel Connection Ports
      - 51820:51820/udp
      - 21820:21820/udp

      # HTTP/HTTPS
      - 443:443
      - 80:80

      # Chat Server Ports
      - 11031-11033:11031-11033/tcp

      # Match Server Ping Port
      - 21234:21234/udp

      # Match Server Game Ports (5x)
      - 21235-21239:21235-21239/udp

      # Match Server Voice Ports (5x)
      - 21435-21439:21435-21439/udp

  traefik:
    image: docker.io/traefik:v3.7.14
    container_name: traefik
    restart: unless-stopped
    network_mode: service:gerbil # Ports Appear On The Gerbil Service
    depends_on:
      pangolin:
        condition: service_healthy
    command:
      - --configFile=/etc/traefik/traefik_config.yml
    volumes:
      - ./config/traefik:/etc/traefik:ro
      - ./config/letsencrypt:/letsencrypt
      - ./config/traefik/logs:/var/log/traefik

networks:
  default:
    driver: bridge
    name: pangolin
```

The relevant parts of `config/config.yml` are the following (trimmed, and with the secret left out):

```yaml
gerbil:
    start_port: 51820
    base_endpoint: "pangolin.kongor.net"

app:
    dashboard_url: "https://pangolin.kongor.net"

domains:
    domain1:
        base_domain: "kongor.net"

server:
    secret: "..." # Generated By The Installer, Keep This Private

flags:
    enable_integration_api: true
    disable_signup_without_invite: true
    allow_raw_resources: true
```

The `enable_integration_api` flag turns on Pangolin's [Integration API](https://docs.pangolin.net/manage/integration-api), which allows sites and resources to be managed from scripts, using an organisation API key created in the dashboard. It listens on port `3003` inside the Docker network only. Making it reachable from the outside needs its own Traefik route and sub-domain, as described in the [official documentation](https://docs.pangolin.net/self-host/advanced/integration-api).

`dynamic_config.yml` is generated by the installer and mostly does not need touching. The one addition we made is a redirect from the bare root domain to the user portal, so that visiting `kongor.net` in a browser lands somewhere useful:

```yaml
http:
  middlewares:
    redirect-to-portal:
      redirectRegex:
        regex: "^https?://kongor\\.net(/.*)?"
        replacement: "https://portal.kongor.net${1}"
        permanent: true

  routers:
    root-domain-http:
      rule: "Host(`kongor.net`)"
      service: next-service
      entryPoints:
        - web
      middlewares:
        - redirect-to-https
        - redirect-to-portal

    root-domain-https:
      rule: "Host(`kongor.net`)"
      service: next-service
      entryPoints:
        - websecure
      middlewares:
        - redirect-to-portal
      tls:
        certResolver: letsencrypt
```

### Raw TCP And UDP Ports

Out of the box, Pangolin only serves HTTP/HTTPS. The chat server and the match servers need raw TCP and UDP ports, and every one of these ports needs to exist in three places before it works:

1. as a published port on the Gerbil container, in `docker-compose.yml`
2. as an entry point in Traefik's static configuration, in `config/traefik/traefik_config.yml`
3. as a resource in the Pangolin dashboard, which is covered in the [Resource Creation](#resource-creation) section

The following steps assume a root user and a working directory of `/root`, which is what a VPS normally comes with. They can be followed over SSH or directly on the machine.

:::tip
    `nano` is a text editor that runs on the command line. Some of the most useful commands are `CTRL + S` (Save), `CTRL + X` (Exit), `ALT + Delete` (Delete Current Line), `ALT + N` (Enable Line Numbers), and `CTRL + A` followed by `CTRL + K` (Cut Current Line).
:::

1. Execute `nano config/config.yml` and make sure that raw resources are allowed:

```yaml
flags:
  allow_raw_resources: true
```

2. Execute `nano docker-compose.yml` and add the chat server and match server ports to the list of Gerbil ports, as shown in the [Docker Stack](#docker-stack) section above. The chat server uses TCP ports `11031-11033`. The match servers, with COMPEL's proxy enabled, use UDP port `21234` for the server list pings, plus one game port starting from `21235` and one voice port starting from `21435` for each match server.

3. Execute `nano config/traefik/traefik_config.yml` and add an entry point for each port. The entry point names must follow the `{protocol}-{port}` convention, which Pangolin relies on to match resources to entry points:

```yaml
entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"
    transport:
      respondingTimeouts:
        readTimeout: "30m"
    http:
      tls:
        certResolver: "letsencrypt"

  # Chat Server Ports
  tcp-11031:
    address: ":11031/tcp"
  tcp-11032:
    address: ":11032/tcp"
  tcp-11033:
    address: ":11033/tcp"

  # Match Server Ping Port
  udp-21234:
    address: ":21234/udp"

  # Match Server Game Ports (5x)
  udp-21235:
    address: ":21235/udp"
  udp-21236:
    address: ":21236/udp"
  udp-21237:
    address: ":21237/udp"
  udp-21238:
    address: ":21238/udp"
  udp-21239:
    address: ":21239/udp"

  # Match Server Voice Ports (5x)
  udp-21435:
    address: ":21435/udp"
  udp-21436:
    address: ":21436/udp"
  udp-21437:
    address: ":21437/udp"
  udp-21438:
    address: ":21438/udp"
  udp-21439:
    address: ":21439/udp"
```

4. Lastly, restart the Docker stack to apply the changes:

```bash
sudo docker compose down
sudo docker compose up --detach
```

:::warning
    If the VPS provider runs a firewall in front of the VPS, then every public port also needs to be allowed there: `80/tcp`, `443/tcp`, `51820/udp`, `21820/udp`, `11031-11033/tcp`, `21234-21239/udp`, and `21435-21439/udp`, plus `22/tcp` for SSH.
:::

:::tip[VERIFICATION]
    Run `sudo docker port gerbil` and check that all of the chat server and match server ports are listed.
:::

A more generic version of these steps can be found in Pangolin's official documentation: [https://docs.pangolin.net/manage/resources/tcp-udp-resources](https://docs.pangolin.net/manage/resources/tcp-udp-resources).

## Sites And Resources

### Site Creation

A site represents a location which hosts services, which in our case is the home lab. Sites are created in the Pangolin dashboard, under the Sites section. When a site is created, Pangolin shows the credentials which Newt needs in order to connect: a site ID, a secret, and the endpoint URL.

:::danger
    **CRITICAL**: The site credentials are only displayed once, when the site is created. Copy them somewhere safe before closing the window. If they are lost, they can only be recovered by inspecting a running Newt container.
:::

For detailed instructions, refer to Pangolin's official documentation: [https://docs.pangolin.net/manage/sites/add-site](https://docs.pangolin.net/manage/sites/add-site).

:::info
    After creating the site, continue with the [Newt](#newt) section to connect the home lab, then come back here to create the resources.
:::

### Resource Creation

:::note
    This step should be done after [Newt](#newt) is running on the home lab.
:::

A resource exposes one home lab service through the VPS. HTTP resources are matched by sub-domain, and Pangolin takes care of the routing and the TLS certificates. Raw TCP and UDP resources are matched by port, and Pangolin needs one resource per port. Resources are created in the Pangolin dashboard, under the Resources section, by picking the site, the protocol, and the target, which is the address and port of the service on the home lab.

The Project KONGOR setup uses the following resources:

<div align="center">
    | Name                               | Protocol | Target                         | Access                      |
    |:----------------------------------:|:--------:|:------------------------------:|:---------------------------:|
    | API Monolith                       | HTTP     | `http://192.168.0.10:5555`     | `http://api.kongor.net`     |
    | User Portal                        | HTTPS    | `https://192.168.0.10:5557`    | `https://portal.kongor.net` |
    | TCP Broker Client                  | TCP      | `192.168.0.10:11031`           | `11031`                     |
    | TCP Broker Server                  | TCP      | `192.168.0.10:11032`           | `11032`                     |
    | TCP Broker Server Manager          | TCP      | `192.168.0.10:11033`           | `11033`                     |
    | Match Server Ping                  | UDP      | `192.168.0.10:21234`           | `21234`                     |
    | Match Server UDP #01 ... #05       | UDP      | `192.168.0.10:21235 ... 21239` | `21235 ... 21239`           |
    | Match Server UDP #01 ... #05 Voice | UDP      | `192.168.0.10:21435 ... 21439` | `21435 ... 21439`           |
</div>

In the table above, `192.168.0.10` is the home lab's address on the local network. Newt reaches the targets over the local network, so it can run on the same machine as the services or on any other machine on the same network. The API and the user portal are served by NEXUS, the chat server ports by NEXUS's chat server, and the match server ports by COMPEL's proxy.

:::note
    SSL is turned off for the API resource, because the game client talks to the master server over plain HTTP. The user portal keeps SSL on, so Pangolin gets a Let's Encrypt certificate for `portal.kongor.net` automatically. Its target uses HTTPS because the portal itself listens on HTTPS.
:::

:::tip[VERIFICATION]
    After creating the resources, check that they all show up in the Pangolin dashboard and that the site shows as online. Then open `https://portal.kongor.net` in a browser to confirm that the certificate has been issued.
:::

## Home Lab

### Newt

Newt is the small client which connects the home lab to the VPS. It dials out to Pangolin over a WebSocket connection to receive its configuration, and to Gerbil over WireGuard for the actual traffic, then forwards that traffic to the targets on the local network. Because it only ever makes outbound connections, nothing on the home router needs to change.

:::note
    Before installing Newt, a site must first be created in Pangolin (see the [Site Creation](#site-creation) section) to obtain the credentials.
:::

Newt can run as a binary or as a Docker container, with the latter being the recommended approach. A minimal Docker Compose file looks like the following, with the credentials from the site creation step filled in:

```yaml
services:
  newt:
    image: fosrl/newt
    container_name: newt
    restart: unless-stopped
    environment:
      - PANGOLIN_ENDPOINT=https://pangolin.kongor.net
      - NEWT_ID=<site ID>
      - NEWT_SECRET=<site secret>
```

Installation instructions are available in Pangolin's official documentation: [https://docs.pangolin.net/manage/sites/install-site](https://docs.pangolin.net/manage/sites/install-site#docker-installation).

:::tip[VERIFICATION]
    Check that the container is running with `docker ps`, and that the site shows as online in the Pangolin dashboard.
:::

:::info
    Once Newt is running, go back to the [Resource Creation](#resource-creation) section to expose the home lab services.
:::

## Email Service

NEXUS needs an email service in production, for verifying email addresses and resetting forgotten passwords. It is the only external service which NEXUS depends on, and setting it up is covered in the [Email Service](/docs/infrastructure/email-service) section.

## Project KONGOR Services

With the VPS, Newt, and the email service in place, the last step is to run the services themselves on the home lab: [NEXUS](/docs/services/landing-page) for the master server, chat server, and user portal, and [COMPEL](/docs/utilities/compel) for the match servers. Once they are running, they are reachable through the sub-domains and ports set up in Pangolin, and players can connect by pointing [WILLOWMAKER](/docs/utilities/willowmaker) at the public host name.

For COMPEL, make sure that `UseProxy` is set to `true` and that `Gateway` is set to the public domain (`kongor.net` in our case), so that the match servers advertise the public address and the proxy ports which Pangolin forwards.

:::info
    For a guide on running NEXUS, please refer to the [Self-Hosting Locally](/docs/services/self-hosting-locally/resolve-dependencies) section.
:::

:::tip[VERIFICATION]
    Test the TCP ports from three different places, replacing the IP address and the domain name with your own.

    **From The Home Lab:**
    ```powershell
    Test-NetConnection -ComputerName localhost -Port 5555
    Test-NetConnection -ComputerName localhost -Port 11031
    ```

    **From Another Machine On The Local Network (What Newt Sees):**
    ```powershell
    Test-NetConnection -ComputerName 192.168.0.10 -Port 5555
    Test-NetConnection -ComputerName 192.168.0.10 -Port 11031
    ```

    **From The Internet (Through The VPS):**
    ```powershell
    Invoke-WebRequest https://portal.kongor.net
    Test-NetConnection -ComputerName chat.kongor.net -Port 11031
    ```

    UDP ports can't be tested this way. The simplest check for them is the in-game server list, which pings every match server on the ping port, followed by joining a match.
:::

## Maintenance And Updates

### Updating Pangolin

Pangolin, Gerbil, Traefik, and the Badger plugin should be updated from time to time, to pick up bug fixes, security patches, and new features. The official update process is the following:

1. Back up the `config` directory and `docker-compose.yml`.
2. Stop the Docker stack with `sudo docker compose down`.
3. Find the latest stable releases of [Pangolin](https://github.com/fosrl/pangolin/releases), [Gerbil](https://github.com/fosrl/gerbil/releases), [Badger](https://github.com/fosrl/badger/releases), and [Traefik](https://github.com/traefik/traefik/releases), and read the release notes.
4. In `docker-compose.yml`, update the image version of each container.
5. In `config/traefik/traefik_config.yml`, update the Badger plugin version:

```yaml
experimental:
  plugins:
    badger:
      moduleName: "github.com/fosrl/badger"
      version: "v1.7.0"
```

6. Pull the new Docker images with `sudo docker compose pull`.
7. Start the Docker stack with `sudo docker compose up --detach`, and follow the logs with `sudo docker compose logs --follow` until Pangolin reports that all migrations completed successfully.

When Pangolin is more than one release behind, it should be updated one minor release at a time, repeating the steps above for each one, rather than jumping straight to the latest release. The release notes also say when a release needs a newer Gerbil or Badger, which Pangolin's migrations do not always take care of.

:::note
    When a release updates the Badger version itself, Pangolin rewrites `traefik_config.yml`, which drops its comments and quotes. The configuration stays the same, so this is harmless.
:::

:::tip[VERIFICATION]
    After updating, check that all containers are running with `sudo docker ps`, and that the site and its resources still show as online in the Pangolin dashboard.
:::

More information on the update process is available at this official resource: [https://docs.pangolin.net/self-host/how-to-update](https://docs.pangolin.net/self-host/how-to-update).

:::warning
    Always back up the `config` directory before updating. It holds Pangolin's database and configuration, and Pangolin cannot be downgraded once its database has been migrated, so the backup is the only way back if anything goes wrong.
:::

:::info
    For common issues and how to fix them, please refer to the [Troubleshooting](./troubleshooting) section.
:::
