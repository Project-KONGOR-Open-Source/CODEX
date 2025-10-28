---
sidebar_position: 3
id: hosting-model
title: Hosting Model
description: Self-Hosting Behind VPS Hosting Model
slug: ./hosting-model
---

import ThemedImage from '@theme/ThemedImage';
import LightModeDiagram from './003-hosting-model-diagram-light.png';
import DarkModeDiagram from './003-hosting-model-diagram-dark.png';

# Hosting Model

## Diagram

The following diagram describes the architecture for self-hosting the Project KONGOR services on a local server behind a public VPS.

<ThemedImage
  alt = "Hosting Model Diagram"
  sources = {{ light: LightModeDiagram, dark: DarkModeDiagram }}
/>

Use `right-click` followed by `Save Link As ...` to download the diagram [source file](./003-hosting-model-diagram.excalidraw), which can be imported for editing in [excalidraw](https://excalidraw.com/).

## How It Works

The hosting model uses a multi-layered approach to securely expose self-hosted services to the public internet:

### Application Traffic Flow

1. **Cloudflare Layer**: User requests first hit Cloudflare with proxy enabled, which handles SSL termination, DDoS protection, and CDN caching. Cloudflare also hides the VPS's real IP address, adding an extra security layer.

2. **VPS Gateway**: Cloudflare forwards the request to the VPS, which acts as a reverse-proxy. The VPS provides a stable public endpoint with professional hosting infrastructure.

3. **Tailscale VPN**: The VPS connects to the physical server through a Tailscale VPN tunnel. This creates a secure, encrypted connection between the VPS and your local infrastructure without requiring port forwarding or exposing your home IP address.

4. **Physical Server**: The actual services run on your local infrastructure, which handles the heavy lifting while maintaining complete control, privacy, and lower operational costs.

### Resource Traffic Tunnelling

In addition to the main reverse-proxy flow, the architecture also includes specialized components for handling resource traffic through the Pangolin tunnelling system:

- **Newt**: A WireGuard tunnel client and TCP/UDP proxy running on the physical server. Newt manages resource traffic (such as game assets, static files, or media content) and tunnels it through an encrypted WireGuard connection to the VPS.

- **Gerbil**: A WireGuard interface management server running on the VPS. Gerbil receives the tunnelled resource traffic from Newt and serves it to clients through the VPS's public endpoint.

- **Pangolin**: The central control plane that manages the configuration and coordination between Newt and Gerbil, providing identity-aware access control and routing.

This dual-path approach separates API/application traffic (routed through Tailscale) from resource traffic (routed through Pangolin/Newt/Gerbil), optimizing performance and bandwidth usage across the infrastructure.

This architecture combines the reliability and security of cloud services (Cloudflare + VPS) with the benefits of self-hosting, all connected through secure VPN tunnels.

## Additional Notes

- Cloudflare is not mandatory, but it is highly recommended, as it provides SSL termination, DDoS protection, CDN caching, and IP obfuscation for free.
- Renting a VPS may sound costly, but in fact it is not. The machine itself only acts as a public gateway, and does not need to be powerful on hardware resources. Numerous hosting providers offer VPS solutions with sufficient resources for this type of setup for a very modest amount of currency units.
