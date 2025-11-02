---
sidebar_position: 1
id: motivation
title: Motivation
description: Self-Hosting Behind VPS Motivation
slug: ./motivation
---

# Motivation

### Public Gateway For Locally-Hosted Services

Hosting services on local infrastructure offers significant advantages in terms of hardware control and resource utilisation, but exposing these services directly to the internet introduces substantial risks and limitations. Using a Virtual Private Server (VPS) as a public-facing gateway creates an essential security and privacy layer between the local network and the broader internet. This architectural pattern, often implemented through reverse-proxies or VPN tunnels, allows you to maintain the benefits of local hosting while delegating the public exposure to a hardened, isolated server environment.

### Security Benefits

From a security perspective, a VPS gateway fundamentally changes the attack surface. Rather than exposing the local network's public IP address and routing ports directly to internal services, all incoming traffic terminates at the VPS. This means potential attackers never see the actual infrastructure, and instead they interact only with the VPS, which can be configured with strict firewall rules, intrusion detection systems, and automated security updates. If the VPS is compromised, the local network remains isolated and protected through the encrypted tunnel connection. Additionally, complete control is maintained over the local network's perimeter, e.g. no inbound ports need to be opened, eliminating common attack vectors like port scanning and direct exploitation attempts. The VPS acts as a sacrificial layer that can be quickly rebuilt or replaced if security incidents occur, without affecting the underlying infrastructure.

### Anonymity And Privacy

Anonymity is another compelling motivation for this architecture. When services are hosted directly from a local network, every connection reveals the residential IP address, which can be geolocated and associated with the internet service provider account. This information leakage can have privacy implications, especially for individuals concerned about doxxing, harassment, or simply preferring to keep their physical location private. By routing traffic through a VPS, the residential IP remains hidden from all external parties. Visitors to the services only see the VPS's IP address, which is typically registered to a data center in a location of the choosing. This separation is particularly valuable for content creators, independent developers, or anyone operating public-facing services who wishes to maintain a degree of operational privacy.

### Cost Efficiency

Cost considerations make this approach surprisingly economical for many use cases. Small VPS instances suitable for acting as reverse-proxies can be obtained for as little as 3-6 currency units per month from providers like Hostinger, IONOS, Hetzner, or DigitalOcean. These minimal specifications are sufficient because the VPS primarily handles TLS termination and traffic forwarding, rather than running the actual services. Meanwhile, the local infrastructure, which might consist of repurposed hardware, older servers, or energy-efficient systems, handles the computational workload without incurring monthly hosting fees based on resource usage. This hybrid approach allows for affordable home electricity rates and existing hardware investments while maintaining professional-grade public accessibility. For bandwidth-intensive applications, the often expensive egress fees charged by cloud providers are avoided, as data transfer happens through the residential connection.

### Enhanced Security With Cloudflare

Layering Cloudflare in front of the VPS gateway (optional, but highly recommended) elevates security even further through multiple complementary mechanisms. Cloudflare's global Content Delivery Network (CDN) absorbs and filters traffic before it ever reaches the VPS, providing robust DDoS protection that would be prohibitively expensive to implement independently. Their Web Application Firewall (WAF) can block common attack patterns, SQL injection attempts, and malicious bot traffic automatically. Cloudflare's proxying service also conceals the VPS's IP address, adding another layer of anonymity, attackers see only Cloudflare's IP addresses, making it significantly harder to target the infrastructure directly. Additionally, Cloudflare handles TLS certificate management through their free SSL/TLS offering, simplifying certificate renewals and ensuring strong encryption standards. Their caching capabilities can reduce load on the VPS and the local infrastructure services, while improving response times for end-users. The combination of Cloudflare's edge network, security features, and the VPS gateway creates a defence-in-depth strategy where multiple independent layers must be bypassed before reaching the actual hosting infrastructure.
