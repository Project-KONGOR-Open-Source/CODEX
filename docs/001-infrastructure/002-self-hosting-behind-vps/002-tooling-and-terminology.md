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

A Virtual Private Server is a virtualised server running on physical hardware in a data centre. Unlike shared hosting, a VPS comes with its own dedicated resources (CPU, RAM, storage) and root access, so the operating system and everything installed on it is fully under your control. It also comes with a public IP address and a fast, reliable connection. In this setup, the VPS is the public-facing gateway which sits between the internet and the home lab.

### Home Lab

A home lab is one or more machines hosted at home, on the local network. In this setup, the home lab runs the Project KONGOR services and the match servers, and it has no public internet access of its own: nothing on the internet can connect to it directly, and the only way in is through the tunnel to the VPS.

### Reverse-Proxy

A reverse-proxy is a server which sits in front of back-end services and forwards client requests to them. Unlike a forward-proxy, which acts on behalf of clients, a reverse-proxy acts on behalf of servers: it receives incoming requests, routes them to the right back-end service, and returns the response to the client. Reverse-proxies are commonly used for TLS termination, routing by host name or path, load balancing, and hiding the back-end infrastructure. Common examples are Traefik, Nginx, Caddy, and HAProxy.

### SSL/TLS (Secure Sockets Layer / Transport Layer Security)

SSL and its successor, TLS, are the protocols which encrypt traffic between clients and servers, preventing eavesdropping and tampering. TLS is the modern standard, although the term SSL is still widely used. TLS certificates prove the identity of a website and enable HTTPS, and they can be obtained for free from Let's Encrypt. TLS termination means decrypting the traffic at a proxy before forwarding it to the back-end services.

### VPN (Virtual Private Network)

A Virtual Private Network creates an encrypted tunnel between two or more devices over the internet, letting them talk to each other as if they were on the same local network. In this setup, a WireGuard tunnel between the VPS and the home lab plays this role, so that the VPS can reach the home lab services without any ports being forwarded and without the home network's public IP address being exposed.

### WireGuard

WireGuard is a modern, lightweight VPN protocol built for simplicity, speed, and security. It uses modern cryptography and has a much smaller codebase than older protocols like OpenVPN or IPSec, which makes it easier to audit and faster. It is the protocol behind the tunnel which Newt and Gerbil set up between the home lab and the VPS.

### Tunnel

In networking, a tunnel wraps one network protocol inside another, so that data can travel securely across an untrusted network. In this setup, Newt opens a WireGuard tunnel from the home lab to the VPS, and all traffic for the home lab services travels through it.

### Port Forwarding

Port forwarding redirects traffic arriving at the router on a given port to a specific machine on the local network. It is the traditional way of making home services reachable from the internet, but it exposes the home network's public IP address, opens inbound ports on the router, and needs to be maintained by hand as services and IP addresses change. This setup avoids port forwarding entirely: the home lab opens an outbound connection to the VPS, so no inbound ports are ever opened on the home network.

### Site

A site is Pangolin's name for a location which hosts services, such as the home lab. Each site runs its own Newt client, which connects the site to the VPS.

### Resource

A resource is Pangolin's name for a single exposed service. An HTTP resource maps a public sub-domain to a local service (for example `portal.kongor.net` to the user portal), while a raw TCP or UDP resource maps a public port on the VPS to a port on the home lab (for example the chat server port).

### CDN (Content Delivery Network)

A Content Delivery Network is a network of servers spread across the world, which caches content and serves it to users from the location closest to them. This reduces latency, speeds up downloads, and takes load off the origin server. The Project KONGOR game client and match server files are served this way, from Cloudflare.

### DDoS (Distributed Denial Of Service)

A Distributed Denial Of Service attack tries to overwhelm a server or network with traffic from many sources at once, so that it becomes unavailable to legitimate users. Protecting against it usually means filtering the malicious traffic before it reaches the target. Cloudflare does this at its edge for any proxied host.

### WAF (Web Application Firewall)

A Web Application Firewall monitors and filters HTTP/HTTPS traffic to web applications. Unlike traditional firewalls, which operate at the network level, a WAF understands HTTP and can block attacks like SQL injection and cross-site scripting. Cloudflare includes a WAF for proxied hosts.

### Gateway

A gateway is the entry and exit point between two networks. In this setup, the VPS is the gateway between the public internet and the private home lab.

## Tooling

### Cloudflare

**Purpose**: DNS provider and CDN for the Project KONGOR domain.

**Key Features**:
- DNS management
- R2 object storage, which hosts the CDN content
- optional proxying for HTTP hosts, with DDoS protection, a WAF, and caching
- free SSL/TLS certificates for proxied hosts
- analytics and traffic insights

**Link**: [https://www.cloudflare.com](https://www.cloudflare.com)

### Docker

**Purpose**: Containerisation platform for packaging and running applications in isolated environments.

**Key Features**:
- consistent environments across development and production
- image-based deployments which are easy to version and roll back
- resource isolation
- Docker Compose for running multi-container applications

**Use Case**: On the VPS, Pangolin, Gerbil, and Traefik run as a Docker Compose stack. On the home lab, Newt runs as a container, and the Project KONGOR services use Docker for the database, the distributed cache, and the log server.

**Link**: [https://www.docker.com](https://www.docker.com)

### Pangolin

**Purpose**: Self-hosted, tunnelled reverse-proxy with a web dashboard, which runs on the VPS and exposes the home lab services to the internet.

**Key Features**:
- web dashboard for managing sites and resources
- HTTP resources on sub-domains, with automatic Let's Encrypt certificates
- raw TCP and UDP resources on public ports
- identity-aware access control for HTTP resources
- configures Traefik, Gerbil, and Newt, so they don't need to be configured by hand

**Link**: [https://pangolin.net](https://pangolin.net)

#### Traefik

**Purpose**: Reverse-proxy which runs on the VPS and routes the incoming traffic.

**Key Features**:
- routes HTTP/HTTPS traffic by host name, and raw TCP/UDP traffic by entry point (port)
- picks up its routing configuration from Pangolin, without needing restarts
- Let's Encrypt integration for automatic TLS certificates
- middleware support, such as redirects and authentication

**Link**: [https://traefik.io](https://traefik.io)

#### Gerbil

**Purpose**: WireGuard interface manager which runs on the VPS, and the end of the tunnel on the VPS side.

**Key Features**:
- manages the WireGuard interface which Newt connects to
- owns the public ports of the VPS, which Traefik shares
- configured by Pangolin

**Link**: [https://github.com/fosrl/gerbil](https://github.com/fosrl/gerbil)

#### Newt

**Purpose**: Tunnel client which runs on the home lab, and the end of the tunnel on the home lab side.

**Key Features**:
- connects out to the VPS, so nothing on the home network needs to accept inbound connections
- keeps a WebSocket connection to Pangolin for configuration, and a WireGuard connection to Gerbil for the actual traffic
- proxies TCP and UDP traffic from the tunnel to the services on the local network
- configured by Pangolin

**Link**: [https://github.com/fosrl/newt](https://github.com/fosrl/newt)

### WireGuard

**Purpose**: The VPN protocol behind the tunnel between Newt and Gerbil.

**Key Features**:
- modern cryptography (ChaCha20, Poly1305, Curve25519)
- small codebase, which is easy to audit
- simple configuration compared to IPSec or OpenVPN
- fast connection setup, low overhead, and high throughput
- built into the Linux kernel

**Link**: [https://www.wireguard.com](https://www.wireguard.com)
