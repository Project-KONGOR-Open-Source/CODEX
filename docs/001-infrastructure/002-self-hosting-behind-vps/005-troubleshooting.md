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

**Newt Not Connecting To Pangolin**
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
