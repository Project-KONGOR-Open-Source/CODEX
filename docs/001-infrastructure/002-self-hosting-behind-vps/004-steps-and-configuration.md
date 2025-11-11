---
sidebar_position: 4
id: steps-and-configuration
title: Steps And Configuration
description: Self-Hosting Behind VPS Steps And Configuration
slug: ./steps-and-configuration
---

# Steps And Configuration

## Prerequisites

Before beginning this setup, ensure the following requirements are met:

- **Virtual Private Server (VPS)**: a Linux-based VPS with root access (Ubuntu, Debian, or similar distributions recommended)
- **Domain Name**: a registered domain name, or willingness to register one through Cloudflare or another registrar
- **Local Server**: a local machine capable of running Docker or the Project KONGOR services directly
- **Basic Command Line Knowledge**: familiarity with SSH, terminal commands, and basic file editing
- **Network Access**: ability to access the VPS via SSH and the local server on the same network

:::warning
    Ensure the VPS has sufficient resources for running Pangolin and Traefik. Minimum recommended specifications: 1 CPU core, 1GB RAM, and 10GB storage.
:::

## Setup Order

The configuration process follows this order:

1. **Cloudflare**: configure domain and DNS records
2. **VPS Setup**: install Tailscale and Pangolin on the VPS
3. **Site Creation**: create a site in Pangolin to obtain Newt credentials
4. **Local Server Setup**: install Tailscale and Newt on the local server
5. **Resource Creation**: configure resources in Pangolin to expose local services
6. **Service Deployment**: deploy and configure Project KONGOR services

:::tip
    Each major section includes verification steps to ensure components are working correctly before proceeding to the next step.
:::

## Cloudflare

### Register/Transfer Host Name

To use Cloudflare for your self-hosted setup, you'll need a domain name managed through Cloudflare. If you don't have a domain yet, you can register one directly through Cloudflare's registrar service, which offers competitive pricing and automatic integration with their DNS and security features. Alternatively, if you already own a domain with another provider (such as GoDaddy, Namecheap, or Google Domains), you can migrate it to Cloudflare by initiating a domain transfer in the Cloudflare dashboard and following the authorization steps provided by your current registrar. Once your domain is added to Cloudflare, you'll need to update your domain's nameservers to point to Cloudflare's nameservers, which typically takes 24-48 hours to propagate globally.

Additional information on transferring domains to Cloudflare is available here: [https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare).

### DNS Records

To enable dynamic sub-domain routing and raw TCP connections for your self-hosted setup, specific DNS records must be configured in Cloudflare. These records point to the VPS's public IP address, which can be obtained by logging in to the VPS via SSH and running the command `curl -4 ifconfig.me` or by checking the VPS provider's dashboard.

First, create an A record pointing the root domain to the VPS IP address, which will handle raw TCP traffic directly to the hostname root. Next, add a wildcard A record pointing to the same IP address, allowing the system to automatically create and route sub-domains to different local resources behind the VPS without manually configuring each sub-domain. These DNS records should have the proxy status (orange cloud) enabled in Cloudflare in order to take advantage of DDoS protection, automatic SSL/TLS encryption, CDN caching, and other security features that Cloudflare provides.

The configured DNS records should look similar to the following:

<div align="center">
    | Type | Name | Content               | Proxy Status | TTL  |
    |:----:|:----:|:---------------------:|:------------:|:----:|
    | A    | @    | Public VPS IP Address | Proxied      | Auto |
    | A    | *    | Public VPS IP Address | Proxied      | Auto |
</div>

Additional information on setting up DNS records is available here: [https://docs.pangolin.net/self-host/dns-and-networking](https://docs.pangolin.net/self-host/dns-and-networking).

:::note
    Please note that for the hosting model which we are trying to set up, both records are required, although the wildcard record could be replaced with multiple more specific sub-domain records.
:::

:::warning
    DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. While Cloudflare's propagation is typically fast (5-10 minutes), SSL/TLS certificate generation by Pangolin may take additional time after DNS records are active.
:::

:::tip[VERIFICATION]
    After configuring DNS records, verify they are resolving correctly by running `nslookup yourdomain.com` and `nslookup api.yourdomain.com` from a command line. Both should return the VPS IP address.
:::

## Virtual Private Server

### Tailscale

Tailscale is required on the VPS to establish a secure, encrypted mesh network between the VPS and local resources behind the home network. Since local services are behind NAT and firewalls without exposed ports, Tailscale creates a private WireGuard-based tunnel that allows the VPS to directly communicate with local machines as if they were on the same network. This eliminates the need for complex port forwarding, dynamic DNS configurations, or exposing the home network to the internet, while enabling the VPS to act as a secure gateway that routes incoming traffic from the domain to the appropriate local services.

Installation instructions for Tailscale are available on Tailscale's official knowledge base: [https://tailscale.com/kb/installation](https://tailscale.com/kb/installation).

:::tip[VERIFICATION]
    After installing and authenticating Tailscale on the VPS, verify the installation by running `tailscale status`. This should show the VPS as connected and display its Tailscale IP address (typically in the 100.x.x.x range).
:::

### Pangolin

Pangolin is the core reverse proxy and routing solution that ties together all the components of this self-hosted setup. It runs on the VPS and intelligently manages incoming traffic from the domain, automatically creating and routing sub-domains to the appropriate local services over the Tailscale network. Pangolin handles SSL/TLS certificate generation and renewal, sub-domain management, and seamless integration with both Cloudflare DNS and the Tailscale mesh network, making it the essential bridge between public internet traffic and private local resources.

Installation instructions and configuration options are available in Pangolin's official Quick Install guide: [https://docs.pangolin.net/self-host/quick-install](https://docs.pangolin.net/self-host/quick-install).

:::tip[VERIFICATION]
    After installing Pangolin, verify the Docker containers are running by executing `sudo docker ps`. This should show the `pangolin`, `gerbil`, and `traefik` containers in a running state.
:::

There are a few bits of Pangolin configuration which are required in order to make the entire setup work.

#### Raw TCP Port Passthrough

To set this up, we will need to make changes to the Pangolin configuration file, mounted at [config/config.yml](https://docs.pangolin.net/self-host/advanced/config-file) in the Docker container, the [docker-compose.yml](https://docs.pangolin.net/self-host/manual/docker-compose#docker-compose-configuration) (Pangolin Docker Compose) file, and the [config/traefik/traefik_config.yml](https://docs.pangolin.net/self-host/manual/docker-compose#traefik-static-configuration) (Traefik Configuration) file.

The next steps assume a Linux machine, which a VPS normally is, a root user, which a VPS normally comes provisioned with, and a default working directory of `root@server` or equivalent. These steps can be followed either over SSH or connected directly to the virtual machine. SSH-ing from a PowerShell terminal is recommended as the keyboard shortcuts are better and it is easier to copy/paste from an external source, such as this knowledge base.

:::tip
    `nano` is a text editor that runs on the command line. Some of the most useful commands are `CTRL + S` (Save), `CTRL + X` (Exit), `ALT + Delete` (Delete Current Line), `ALT + N` (Enable Line Numbers), and `CTRL + A` followed by `CTRL + K` (Cut Current Line).
:::

1. Execute `nano config/config.yml` and make sure that the following flag exists and that it is set to true:

```yaml
flags:
  allow_raw_resources: true
```

2. Execute `nano docker-compose.yml` and add the port `11031` to the list of Gerbil ports. `11031` is the default chat server port; if you are overriding it, use the override instead. Simply append the chat server port to the list of already-existing ports, as follows:

```yaml
  gerbil:
    ports:
      - 11031:11031
```

3. Execute `nano config/traefik/traefik_config.yml` and add the following entry point, or adjust as needed if using a non-default chat server port. Make sure to follow the `{protocol}-{port}` convention for the entry point name, which is a requirement.

```yaml
entryPoints:
  tcp-11031:
    address: ":11031/tcp"
```

4. Lastly, restart your Docker stack to apply all changes:

```bash
sudo docker compose down
sudo docker compose up --detach
```

:::tip[VERIFICATION]
    After restarting the Docker stack, verify all containers are running with `sudo docker ps` and check that port 11031 is exposed on the gerbil container by running `sudo docker port gerbil`.
:::

This list of configuration steps documents the setup for our specific use case, however a more generic official version can be found at this location: [https://docs.pangolin.net/manage/resources/tcp-udp-resources](https://docs.pangolin.net/manage/resources/tcp-udp-resources).

#### Site Creation

Before local resources can be connected through Newt, a site must be created in Pangolin's web interface. A site represents a location (such as the local server) that will host resources accessible through the domain. To create a site, log in to the Pangolin dashboard and navigate to the Sites section. When creating the site, credentials will be provided (site ID, secret, and endpoint URL) that are required for Newt installation.

:::danger
    **CRITICAL**: The site credentials are only displayed once during site creation. Copy and save them immediately to a secure location before closing the window. If lost, the credentials can only be recovered by inspecting a running Newt container.
:::

For detailed instructions, refer to Pangolin's official documentation: [https://docs.pangolin.net/manage/sites/add-site](https://docs.pangolin.net/manage/sites/add-site).

:::info
    After creating the site, proceed to the [Newt](#newt) installation section to set up the edge client on the local server before returning here to create resources.
:::

#### Resource Creation

:::note
    This step should be completed after installing [Newt](#newt) on the local server.
:::

Once a site is created and Newt is running on the local server, resources can be added to expose specific local services through sub-domains. A resource in Pangolin represents a mapping between a public sub-domain and a local service (IP address and port). When a resource is created, Pangolin automatically configures the routing, generates SSL/TLS certificates, and creates the necessary sub-domain under the configured domain.

In the case of the Project KONGOR services, two primary resources are required: one for the "master server" API, and another for the raw TCP chat server connection. The API resource handles web-based requests and game client communication over HTTPS, while the chat server resource provides direct TCP connectivity for real-time events. Other services such as the user portal can also be added as resources, if needed.

Resources can be created through the Pangolin web interface by navigating to the Resources section and selecting the appropriate site. Each resource requires the local IP address (typically the Tailscale IP of the local server), the local port number, and the protocol type (HTTP/HTTPS for web services or TCP/UDP for raw connections). Additionally, HTTP/HTTPS resources can be set up on a sub-domain.

The following is an example set of configured resources:

<div align="center">
    | Name         | Protocol | Target                       | Access                |
    |:------------:|:--------:|:----------------------------:|:---------------------:|
    | API Monolith | HTTP     | http://100.100.100.100:55555 | http://api.kongor.net |
    | Chat Service | TCP      | 100.100.100.100:11031        | 11031                 |
</div>

:::note
    In the table above, `100.100.100.100` represents the local server's Tailscale IP address, which is a critical component of the setup. This private Tailscale IP allows the VPS running Pangolin to securely communicate with the local server over the encrypted mesh network. The actual Tailscale IP address for the local server can be found by running `tailscale ip` on the local machine, and should be used in place of the example address shown above.
:::

:::tip
    When creating an HTTP resource in Pangolin, the traffic is automatically upgraded to HTTPS with SSL/TLS certificates managed by Pangolin. This means that even though the local service runs on plain HTTP (as shown in the Target column), the public-facing access URL will use HTTPS encryption. This allows local services to remain simple while still providing secure connections to external users.
:::

:::tip[VERIFICATION]
    After creating resources, verify they appear in the Pangolin dashboard and check that the Newt client shows "Connected" status. Test accessing the HTTP resource URL in a browser to confirm SSL/TLS certificates have been generated.
:::

## Local Server

### Tailscale

Tailscale must also be installed on the local server to complete the secure mesh network connection with the VPS. Once installed and authenticated with the same Tailscale account as the VPS, the local server will be able to communicate privately with the VPS over the encrypted WireGuard tunnel. This allows the VPS running Pangolin to route incoming traffic to local services without requiring any port forwarding on the router or exposing the home network to the internet. Each device on the Tailscale network receives a stable, private IP address that remains consistent even if the local network's public IP changes, ensuring reliable connectivity for self-hosted services.

Installation instructions are available on Tailscale's official knowledge base for each operating system: [https://tailscale.com/kb/installation](https://tailscale.com/kb/installation).

:::tip[VERIFICATION]
    After installing and authenticating Tailscale on the local server, verify connectivity between the VPS and local server by running `tailscale ping [vps-tailscale-ip]` from the local server (or vice versa). Both machines should appear in `tailscale status` on each other.
:::

### Newt

Newt is a lightweight edge client that runs on the local server to complete the connection between local resources and Pangolin on the VPS. It automatically discovers the optimal Pangolin node for best performance and maintains dual connections: a WebSocket connection to Pangolin for control plane communication and a WireGuard connection via Gerbil (tunnel manager) for the data plane. Newt creates TCP/UDP proxies to securely expose local applications and services, making them accessible through the sub-domains managed by Pangolin.

:::note
    Before installing Newt, a site must first be created in Pangolin (see the [Site Creation](#site-creation) section) to obtain the required credentials.
:::

Newt can be installed via either binary installation or Docker deployment, with the latter being the recommended approach. Installation instructions are available in Pangolin's official documentation: [https://docs.pangolin.net/manage/sites/install-site](https://docs.pangolin.net/manage/sites/install-site#docker-installation).

:::tip
    The Newt credentials are only displayed during site creation. If needed later (such as for spinning up a new container), they can be retrieved by inspecting the existing Newt container.
:::

:::tip[VERIFICATION]
    After starting Newt, check that the container is running with `docker ps` (or the equivalent command for the chosen installation method). In the Pangolin dashboard, the site should show as "Connected" or "Online".
:::

:::info
    After Newt is running, return to the VPS configuration to complete the [Resource Creation](#resource-creation) section and expose the local services.
:::

### Project KONGOR Services

Finally, with all the infrastructure components in place (Cloudflare DNS, VPS with Tailscale and Pangolin, and local server with Tailscale and Newt), the Project KONGOR services can be set up and run on the local machine. These services will be automatically exposed through the Newt proxies and made accessible via the sub-domains managed by Pangolin, allowing users to connect over the internet to the locally-hosted services by pointing the game client to the public host name.

:::info
    For an in-depth guide on how to set up the Project KONGOR services on a local machine, please refer to the [Local Environment Setup](/docs/services/self-hosting-locally/set-up-environment) section.
:::

:::tip[VERIFICATION]
    After deploying the Project KONGOR services, test connectivity from three different locations to ensure the setup is working correctly:

    **From Local Server (Direct Connection):**
    ```powershell
    Invoke-WebRequest http://localhost:55555
    Test-NetConnection -ComputerName localhost -Port 11031
    ```

    **From VPS (Over Tailscale):**
    ```powershell
    Invoke-WebRequest http://100.100.100.100:55555
    Test-NetConnection -ComputerName 100.100.100.100 -Port 11031
    ```

    **From Internet (Through Domain):**
    ```powershell
    Invoke-WebRequest https://api.kongor.net
    Test-NetConnection -ComputerName kongor.net -Port 11031
    ```

    All tests should succeed, confirming that services are accessible locally, through the Tailscale network, and over the public internet. In order to run these tests, replace the Tailscale IP address and the domain name as needed.
:::

## Maintenance & Updates

### Updating Pangolin

Pangolin and its associated services (Gerbil and Traefik) should be updated periodically to receive bug fixes, security patches, and new features. The update process involves stopping the Docker stack, updating version numbers, pulling new images, and restarting the services.

**Update Steps:**

1. Stop the Docker stack with `sudo docker compose down`.
2. In the `docker-compose.yml` file, update the version number of each service. Check [GitHub](https://github.com/fosrl) for the latest release versions.
3. Pull the new Docker images with `sudo docker compose pull`.
4. Start the Docker stack with `sudo docker compose up --detach`.

:::tip[VERIFICATION]
    After updating, verify all containers are running with `sudo docker ps` and check the Pangolin dashboard to ensure sites and resources are still connected.
:::

More information on the update process is available at this official resource: [https://docs.pangolin.net/self-host/how-to-update](https://docs.pangolin.net/self-host/how-to-update).

:::warning
    Always back up the `config` directory before performing updates. This ensures configuration files can be restored if any issues occur during the update process.
:::

## Troubleshooting

### Common Issues

**DNS Records Not Resolving**
- check that DNS records in Cloudflare are correctly configured and set to "Proxied"
- wait for DNS propagation (typically 5-10 minutes for Cloudflare, up to 48 hours globally)
- verify DNS resolution with `nslookup yourdomain.com` from multiple locations

**Tailscale Connectivity Issues**
- ensure both VPS and local server are authenticated with the same Tailscale account
- verify both machines appear in `tailscale status` on each device
- check firewall rules are not blocking Tailscale traffic (UDP port 41641)
- test connectivity with `tailscale ping [target-ip]`

**Pangolin Containers Not Starting**
- check Docker logs with `sudo docker logs pangolin`, `sudo docker logs gerbil`, or `sudo docker logs traefik`
- verify all required configuration files exist in the `config` directory
- ensure port conflicts are not occurring (ports 80, 443, and custom ports like 11031)
- check that the `docker-compose.yml` file is correctly formatted

**Newt Not Connecting to Pangolin**
- verify the site credentials (ID, secret, endpoint) are correct
- check that Tailscale is running and connected on the local server
- ensure the local server's Tailscale IP is reachable from the VPS
- check Newt logs for connection errors

**Resources Not Accessible**
- verify resources are created in Pangolin and show "Active" status
- check that the Tailscale IP address used in resources matches the local server's IP
- ensure local services are running and listening on the specified ports
- test local connectivity with `curl http://[tailscale-ip]:[port]` from the VPS
- wait for SSL/TLS certificate generation (can take several minutes on first access)

**Certificate Generation Failures**
- verify DNS records are properly configured and resolving
- check that Cloudflare proxy (orange cloud) is enabled for HTTP/HTTPS resources
- ensure the domain's SSL/TLS mode in Cloudflare is set to "Full" or "Full (strict)"
- review Traefik logs for certificate generation errors: `sudo docker logs traefik`

:::tip
    For additional support and troubleshooting assistance, consult Pangolin's official documentation at [https://docs.pangolin.net](https://docs.pangolin.net) or join the community support channels.
:::
