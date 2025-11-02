---
sidebar_position: 2
id: tooling-and-terminology
title: Tooling And Terminology
description: Self-Hosting Behind VPS Tooling And Terminology
slug: ./tooling-and-terminology
---

# Tooling And Terminology

## Terminology

### VPS (Virtual Private Server)

A Virtual Private Server is a virtualised server instance that runs on physical hardware in a data center. Unlike shared hosting, a VPS provides dedicated resources (CPU, RAM, storage) and root access, allowing full control over the operating system and installed software. VPS instances are cost-effective alternatives to dedicated servers, offering professional hosting infrastructure with public IP addresses, high-bandwidth connections, and reliable uptime guarantees. In this architecture, the VPS serves as the public-facing gateway that sits between the internet and the local infrastructure.

### Reverse-Proxy

A reverse-proxy is a server that sits in front of back-end services and forwards client requests to those services. Unlike a forward-proxy (which acts on behalf of clients), a reverse-proxy acts on behalf of servers. It intercepts incoming requests, routes them to the appropriate back-end service, and returns the server's response to the client. Reverse-proxies provide several benefits including load balancing, SSL/TLS termination, request routing based on hostnames or paths, caching, and additional security by hiding the back-end infrastructure. Common reverse-proxy software includes Traefik, Nginx, Caddy, and HAProxy.

### SSL/TLS (Secure Sockets Layer / Transport Layer Security)

SSL and its successor, TLS, are cryptographic protocols that provide secure communication over computer networks. TLS is the modern standard, though the term SSL is still commonly used. These protocols encrypt data transmitted between clients (browsers) and servers, preventing eavesdropping and tampering. SSL/TLS certificates verify the identity of websites and enable the HTTPS protocol. The certificates are issued by Certificate Authorities (CAs) or can be obtained for free through services like Let's Encrypt. SSL/TLS termination refers to the process of decrypting encrypted traffic at a proxy or load balancer before forwarding it to back-end services.

### VPN (Virtual Private Network)

A Virtual Private Network creates an encrypted tunnel between two or more devices over the internet, allowing them to communicate as if they were on the same local network. VPNs provide privacy, security, and the ability to access resources across network boundaries without exposing services directly to the internet. In this architecture, VPNs (specifically Tailscale and WireGuard) enable secure communication between the VPS gateway and the local physical server without requiring port forwarding or exposing the home network's public IP address.

### WireGuard

WireGuard is a modern, lightweight VPN protocol designed for simplicity, speed, and security. It uses state-of-the-art cryptography and has a significantly smaller codebase compared to older VPN protocols like OpenVPN or IPSec, making it easier to audit and more performant. WireGuard operates at the kernel level, providing near-native network performance with minimal overhead. It's the underlying protocol used by both Tailscale and the Pangolin tunnelling components (Newt and Gerbil) in this architecture.

### Tunnel

In networking, a tunnel encapsulates one network protocol within another, allowing data to be transmitted securely across untrusted networks. Tunnelling creates a virtual point-to-point connection by wrapping packets in an additional layer of encryption and routing information. This architecture uses multiple tunnelling technologies: Tailscale creates encrypted tunnels for application traffic, while Pangolin/Newt/Gerbil create WireGuard tunnels specifically for resource traffic.

### Port Forwarding

Port forwarding (also known as port mapping) is a network address translation (NAT) technique that redirects communication requests from one IP address and port number combination to another. In home networking, port forwarding is traditionally used to make local services accessible from the internet by configuring the router to forward incoming traffic on specific ports to internal devices. However, port forwarding has significant drawbacks: it exposes the home network's public IP address, requires manual router configuration, creates potential security vulnerabilities by opening inbound firewall ports, and can be difficult to maintain when IP addresses change or multiple services need exposure. This architecture deliberately avoids port forwarding by using VPN tunnels (Tailscale and WireGuard), which establish outbound connections from the local server to the VPS, eliminating the need to open any inbound ports on the home network while maintaining full connectivity.

### CDN (Content Delivery Network)

A Content Delivery Network is a geographically distributed network of servers that cache and deliver content to users from locations closest to them. CDNs reduce latency, improve load times, and decrease bandwidth costs by serving cached copies of static assets (images, CSS, JavaScript, videos) from edge servers rather than the origin server. Cloudflare's CDN automatically caches eligible content and serves it from their global network of data centers.

### DDoS (Distributed Denial Of Service)

A Distributed Denial Of Service attack attempts to overwhelm a server, service, or network with excessive traffic from multiple sources, rendering it unavailable to legitimate users. DDoS attacks can consume bandwidth, exhaust server resources, or exploit application vulnerabilities. Protection typically requires filtering malicious traffic before it reaches the target infrastructure. Cloudflare provides DDoS mitigation by absorbing and filtering attack traffic at their edge network before it reaches the VPS or local infrastructure.

### WAF (Web Application Firewall)

A Web Application Firewall monitors, filters, and blocks HTTP/HTTPS traffic to and from web applications. Unlike traditional firewalls that operate at the network layer, WAFs understand application-layer protocols and can detect and prevent attacks like SQL injection, cross-site scripting (XSS), and other OWASP Top 10 vulnerabilities. Cloudflare includes a WAF that can be configured with rules to protect against common attack patterns and malicious bot traffic.

### Gateway

In networking, a gateway is a node that serves as an entry and exit point between different networks. It routes traffic, performs protocol translations, and can enforce security policies. In this architecture, the VPS functions as a gateway between the public internet and the private local infrastructure, controlling all inbound and outbound traffic flow.

### Mesh Network

A mesh network topology where each node connects to multiple other nodes, creating redundant paths for data transmission. Unlike traditional hub-and-spoke models, mesh networks provide better reliability and can route around failures. Tailscale creates a mesh VPN where devices can communicate peer-to-peer or through relay servers, automatically handling NAT traversal and firewall issues.

## Tooling

### Cloudflare

**Purpose**: Global CDN and security platform that provides the first layer of protection and performance optimisation.

**Key Features**:
- free SSL/TLS certificates with automatic renewal
- DDoS protection and traffic filtering
- Web Application Firewall (WAF)
- CDN caching for improved performance
- DNS management
- IP address obfuscation (proxy mode hides the VPS IP)
- analytics and traffic insights

**Link**: [https://www.cloudflare.com](https://www.cloudflare.com)

### Docker

**Purpose**: Containerisation platform for packaging, deploying, and running applications in isolated environments.

**Key Features**:
- container orchestration and management
- consistent environments across development and production
- image-based deployments with version control
- resource isolation and efficient utilisation
- Docker Compose for multi-container applications
- portable and reproducible application deployments

**Use Case**: Docker is used to containerise services running on the physical server, making deployment and management more efficient and consistent. Traefik can automatically discover and route traffic to Docker containers through labels.

**Link**: [https://www.docker.com](https://www.docker.com)

### Pangolin

**Purpose**: Central control plane that manages the resource traffic tunnelling infrastructure between the physical server and VPS.

**Key Features**:
- identity-aware access control
- configuration management for Newt and Gerbil
- coordination of WireGuard tunnel establishment
- routing policies for resource traffic
- separation of resource traffic from application traffic

**Link**: [https://pangolin.net](https://pangolin.net)

#### Traefik

**Purpose**: Modern reverse-proxy and load balancer that runs on the VPS and physical server to route HTTP/HTTPS traffic.

**Key Features**:
- automatic service discovery (especially with Docker)
- dynamic configuration updates without restarts
- Let's Encrypt integration for automatic SSL certificates
- middleware support for authentication, rate limiting, etc.
- WebSocket support
- multiple back-end support (Docker, Kubernetes, file-based)

**Link**: [https://traefik.io](https://traefik.io)

#### Newt

**Purpose**: WireGuard tunnel client and TCP/UDP proxy that runs on the physical server to handle resource traffic.

**Key Features**:
- WireGuard tunnel client for encrypted connections
- TCP/UDP proxy for forwarding resource traffic
- tunnels resource traffic (game assets, static files, media) to the VPS
- managed by the Pangolin control plane
- optimised for high-throughput resource delivery

**Link**: [https://github.com/fosrl/newt](https://github.com/fosrl/newt)

#### Gerbil

**Purpose**: WireGuard interface management server that runs on the VPS to receive and serve tunnelled resource traffic.

**Key Features**:
- WireGuard interface management
- receives tunnelled traffic from Newt
- serves resource traffic through the VPS's public endpoint
- coordinated by Pangolin for routing configuration
- provides the public-facing endpoint for resource delivery

**Link**: [https://github.com/fosrl/gerbil](https://github.com/fosrl/gerbil)

### Tailscale

**Purpose**: Zero-configuration VPN service that creates secure, encrypted connections between the VPS and physical server for application traffic.

**Key Features**:
- automatic mesh VPN with NAT traversal
- no port forwarding required
- easy device authentication and management
- access control lists (ACLs) for security policies
- built on WireGuard for performance and security
- peer-to-peer connections when possible, relay servers when needed
- single sign-on (SSO) integration with identity providers

**Use Case**: Tailscale eliminates the need to expose the local network's public IP or open inbound firewall ports. The VPS and physical server communicate through the Tailscale network as if they were on the same LAN, providing a secure channel for reverse-proxy traffic.

**Link**: [https://tailscale.com](https://tailscale.com)

#### WireGuard (Protocol)

**Purpose**: Underlying VPN protocol used by both Tailscale and the Pangolin components (Newt/Gerbil).

**Key Features**:
- modern cryptography (ChaCha20, Poly1305, Curve25519)
- minimal codebase (~4,000 lines) for security and auditability
- kernel-level implementation for performance
- simple configuration compared to IPSec or OpenVPN
- fast handshake and connection establishment
- low overhead and high throughput
- built into the Linux kernel (5.6+)

**Link**: [https://www.wireguard.com](https://www.wireguard.com)
