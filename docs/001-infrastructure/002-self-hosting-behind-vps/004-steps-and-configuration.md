---
sidebar_position: 4
id: steps-and-configuration
title: Steps And Configuration
description: Self-Hosting Behind VPS Steps And Configuration
slug: ./steps-and-configuration
---

# Steps And Configuration

## Cloudflare

### Register/Transfer Host Name

To use Cloudflare for your self-hosted setup, you'll need a domain name managed through Cloudflare. If you don't have a domain yet, you can register one directly through Cloudflare's registrar service, which offers competitive pricing and automatic integration with their DNS and security features. Alternatively, if you already own a domain with another provider (such as GoDaddy, Namecheap, or Google Domains), you can migrate it to Cloudflare by initiating a domain transfer in the Cloudflare dashboard and following the authorization steps provided by your current registrar. Once your domain is added to Cloudflare, you'll need to update your domain's nameservers to point to Cloudflare's nameservers, which typically takes 24-48 hours to propagate globally.

Additional information on transferring domains to Cloudflare is available here: [https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare).

### DNS Records

To enable dynamic subdomain routing and raw TCP connections for your self-hosted setup, you'll need to configure specific DNS records in Cloudflare. First, create an A record pointing your root domain to your VPS IP address, which will handle raw TCP traffic directly to the hostname root. Next, add a wildcard A record pointing to the same IP address, allowing the system to automatically create and route subdomains to different local resources behind your VPS without manually configuring each subdomain. These DNS records should have the proxy status (orange cloud) enabled in Cloudflare in order to take advantage of DDoS protection, automatic SSL/TLS encryption, CDN caching, and other security features that Cloudflare provides.

The configured DNS records should look similar to the following:

<div align="center">
    | Type | Name | Content        | Proxy Status | TTL  |
    |:----:|:----:|:--------------:|:------------:|:----:|
    | A    | @    | VPS IP Address | Proxied      | Auto |
    | A    | *    | VPS IP Address | Proxied      | Auto |
</div>

Additional information on setting up DNS records is available here: [https://docs.pangolin.net/self-host/dns-and-networking](https://docs.pangolin.net/self-host/dns-and-networking).

:::note
    Please note that for the hosting model which we are trying to set up, both records are required, although the wildcard record could be replaced with multiple more specific sub-domain records.
:::

## Virtual Private Server

### Tailscale

Tailscale is required on the VPS to establish a secure, encrypted mesh network between your VPS and local resources behind your home network. Since your local services are behind NAT and firewalls without exposed ports, Tailscale creates a private WireGuard-based tunnel that allows the VPS to directly communicate with your local machines as if they were on the same network. This eliminates the need for complex port forwarding, dynamic DNS configurations, or exposing your home network to the internet, while enabling the VPS to act as a secure gateway that routes incoming traffic from your domain to the appropriate local services.

Please follow these steps on Tailscale's official knowledge base for instructions on how to install Tailscale and then authenticate once it is installed: [https://tailscale.com/kb/installation](https://tailscale.com/kb/installation).

### Pangolin

Pangolin is the core reverse proxy and routing solution that ties together all the components of this self-hosted setup. It runs on your VPS and intelligently manages incoming traffic from your domain, automatically creating and routing sub-domains to the appropriate local services over the Tailscale network. Pangolin handles SSL/TLS certificate generation and renewal, sub-domain management, and seamless integration with both Cloudflare DNS and your Tailscale mesh network, making it the essential bridge between public internet traffic and your private local resources.

For installation instructions and configuration options, please refer to the Pangolin's official Quick Install guide: [https://docs.pangolin.net/self-host/quick-install](https://docs.pangolin.net/self-host/quick-install).

There a few bits of Pangolin configuration which are required in order to make the entire setup work.

#### Raw TCP Port Passthrough

To set this up, we will need to make changes to the Pangolin configuration file, mounted at [config/config.yml](https://docs.pangolin.net/self-host/advanced/config-file) in the Docker container, the [docker-compose.yml](https://docs.pangolin.net/self-host/manual/docker-compose#docker-compose-configuration) (Pangolin Docker Compose) file, and the [config/traefik/traefik_config.yml](https://docs.pangolin.net/self-host/manual/docker-compose#traefik-static-configuration) (Traefik Configuration) file.

The next steps assume a Linux machine, which a VPS normally is, a root user, which a VPS normally comes provisioned with, and a default working directory of `root@server` or equivalent. These steps can be followed either over SSH or connected directly to the virtual machine; my recommendation would be SSH-ing from a PowerShell terminal because the keyboard shortcuts are better and it is easier to copy/paste from an external source, such as this knowledge base.

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

3. Execute `nano config/traefik/traefik_config.yml` and add the following entry point, or adjust as needed if you're using a non-default chat server port. Make sure to the the `{protocol}-{port}` convention for the entry point name, which is a requirement.

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

This list of configuration steps documents the setup for our specific use case, however a more generic official version can be found at this location: [https://docs.pangolin.net/manage/resources/tcp-udp-resources](https://docs.pangolin.net/manage/resources/tcp-udp-resources).

#### Site Creation



#### Resource Creation

#### Update Pangolin

1. Stop the Docker stack with `sudo docker compose down`.
2. In the `docker-compose.yml` file, update the version number of each service. Check [GitHub](https://github.com/fosrl) for the latest release versions.
3. Pull the new Docker images with `sudo docker compose pull`.
4. Stop the Docker stack with `sudo docker compose up --detach`.

More information on the update process is available at this official resource: [https://docs.pangolin.net/self-host/how-to-update](https://docs.pangolin.net/self-host/how-to-update).

## Local Server

### Tailscale

Tailscale must also be installed on your local server to complete the secure mesh network connection with the VPS. Once installed and authenticated with the same Tailscale account as your VPS, your local server will be able to communicate privately with the VPS over the encrypted WireGuard tunnel. This allows the VPS running Pangolin to route incoming traffic to your local services without requiring any port forwarding on your router or exposing your local network to the internet. Each device on the Tailscale network receives a stable, private IP address that remains consistent even if your local network's public IP changes, ensuring reliable connectivity for your self-hosted services.

As with the VPS, please follow the installation steps on Tailscale's official knowledge base for your specific operating system: [https://tailscale.com/kb/installation](https://tailscale.com/kb/installation).

### Newt

Newt is a lightweight edge client that runs on your local server to complete the connection between your local resources and Pangolin on the VPS. It automatically discovers the optimal Pangolin node for best performance and maintains dual connections: a WebSocket connection to Pangolin for control plane communication and a WireGuard connection via Gerbil (tunnel manager) for the data plane. Newt creates TCP/UDP proxies to securely expose your local applications and services, making them accessible through the sub-domains managed by Pangolin.

Before installing Newt, you must first create a site in Pangolin and copy the Newt credentials (ID, secret, and endpoint). For instructions on how to create a site, please refer to Pangolin's official documentation: [https://docs.pangolin.net/manage/sites/add-site](https://docs.pangolin.net/manage/sites/add-site).

Once the site is created in Pangolin, Newt can be installed via either binary installation or Docker deployment, with the latter being the recommended approach. You don't need to do anything fancy with Docker Compose, just pull the image and run a container as per the following instructions from Pangolin's official documentation: [https://docs.pangolin.net/manage/sites/install-site](https://docs.pangolin.net/manage/sites/install-site#docker-installation).

:::tip
    The Newt credentials are available in Pangolin only at the time of creating a new site. If there is ever a need to retrieve them afterwards, such as for spinning up a new Newt container in Docker, the already-existing container can be inspected for these secrets.
:::

### Project KONGOR Services

Finally, with all the infrastructure components in place (Cloudflare DNS, VPS with Tailscale and Pangolin, and your local server with Tailscale and Newt), you can now set up and run the Project KONGOR services on your local machine. These services will be automatically exposed through the Newt proxies and made accessible via the sub-domains managed by Pangolin, allowing users to connect over the internet to your locally-hosted services by pointing the game client to your public host name.

:::info
    For an in-depth guide on how to set up the Project KONGOR services on a local machine, please refer to the [Local Environment Setup](/docs/services/self-hosting-locally/set-up-environment) section.
:::

:::tip[IMPORTANT]
    Testing
:::
