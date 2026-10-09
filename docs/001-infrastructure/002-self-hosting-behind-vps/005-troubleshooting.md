---
sidebar_position: 5
id: troubleshooting
title: Troubleshooting
description: Self-Hosting Behind VPS Troubleshooting
slug: ./troubleshooting
---

# Troubleshooting

## Common Issues

**DNS Records Not Resolving**
- check that the DNS records in Cloudflare are correctly configured and set to "DNS only"
- wait for DNS propagation (usually a few minutes with Cloudflare, but up to 48 hours globally)
- verify DNS resolution with `nslookup yourdomain.com`, which should return the VPS's IP address and not a Cloudflare one

**Pangolin Containers Not Starting**
- check the Docker logs with `sudo docker logs pangolin`, `sudo docker logs gerbil`, or `sudo docker logs traefik`
- verify that all configuration files exist in the `config` directory
- make sure that nothing else on the VPS is using the same ports (`80`, `443`, and the chat server and match server ports)
- check that the `docker-compose.yml` file is correctly formatted

**Newt Not Connecting To Pangolin**
- verify that the site credentials (ID, secret, endpoint) are correct
- check that the Pangolin dashboard is reachable from the home lab, at the endpoint URL used by Newt
- make sure that UDP ports `51820` and `21820` are open on the VPS, including in the VPS provider's firewall, if there is one
- check the Newt logs for connection errors with `docker logs newt`

**Resources Not Accessible**
- verify that the resources exist in Pangolin, and that the site shows as online
- check that each target is the home lab's local network address, and that the port matches the service
- make sure that the services are running, and that the home lab's own firewall allows connections from the machine running Newt
- for raw TCP and UDP resources, check that the port exists in all three places: the Gerbil ports in `docker-compose.yml`, the Traefik entry points, and the Pangolin resource
- wait for the TLS certificates to be issued, which can take a few minutes the first time a sub-domain is accessed

**Match Servers Not Joinable**
- make sure that COMPEL has `UseProxy` set to `true`, so that the public ports are the ones which Pangolin forwards (`21234` and up)
- check that `Gateway` in COMPEL's configuration is set to the public domain, and not to `localhost` or a local network address
- verify that every match server has both a game port and a voice port resource in Pangolin, using UDP

**Certificate Generation Failures**
- verify that the DNS records are configured, resolving, and set to "DNS only"
- make sure that port `80` is reachable on the VPS, since Let's Encrypt uses it to verify the domain
- review the Traefik logs for certificate errors with `sudo docker logs traefik`

:::tip
    For additional support, consult Pangolin's official documentation at [https://docs.pangolin.net](https://docs.pangolin.net) or join the community support channels.
:::
