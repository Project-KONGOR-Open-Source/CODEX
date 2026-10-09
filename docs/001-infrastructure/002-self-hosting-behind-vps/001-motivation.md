---
sidebar_position: 1
id: motivation
title: Motivation
description: Self-Hosting Behind VPS Motivation
slug: ./motivation
---

# Motivation

### Public Gateway For Locally-Hosted Services

Hosting services on local hardware gives full control over the machine and its resources, but exposing that machine directly to the internet brings real risks and limitations. Putting a Virtual Private Server (VPS) in front of it as a public-facing gateway adds a layer of security and privacy between the local network and the rest of the internet. The services keep running at home, while the job of being publicly reachable is handed off to a small, isolated server which is easy to harden and easy to replace.

### Security Benefits

A VPS gateway changes the attack surface. Instead of exposing the home network's public IP address and forwarding ports to internal machines, all incoming traffic ends at the VPS. Potential attackers only ever see the VPS, and never the machines behind it. The home lab connects out to the VPS through an encrypted tunnel, so no inbound ports need to be opened on the home router, which rules out port scanning and direct exploitation attempts against the home network. If the VPS is ever compromised, it only has access to the services exposed through the tunnel, not to the rest of the home network, and it can be wiped and rebuilt without touching the home lab.

### Anonymity And Privacy

When services are hosted directly from a home network, every connection reveals the residential IP address, which can be geolocated and tied back to an internet service provider account. For anyone who prefers to keep their physical location private, or who simply wants to avoid doxxing or harassment, this is a real concern. Routing traffic through a VPS keeps the residential IP address hidden from everyone. Players only see the VPS's IP address, which belongs to a data centre in a location of your choosing.

### Cost Efficiency

This approach is also cheap. A VPS which only forwards traffic does not need much power, and small instances can be rented for a few currency units per month from providers like Hostinger, IONOS, Hetzner, or DigitalOcean. The heavy lifting happens on the home lab, which might be repurposed hardware or an old server, so there are no monthly fees based on CPU, memory, or storage usage. Bandwidth also goes through the residential connection, which avoids the egress fees that cloud providers often charge.

### Where Cloudflare Fits In

Cloudflare manages the domain's DNS records and hosts the CDN, which the launchers use to keep the game client and match server distributions up to date.

The DNS records for the hosts handled by the VPS are set to DNS-only rather than proxied. The chat server and the match servers need raw TCP and UDP ports, which Cloudflare's proxy does not forward on its standard plans, and the VPS already takes care of TLS certificates for the HTTP hosts. Proxying can still be turned on for hosts which only serve HTTP traffic, such as the user portal, in order to get Cloudflare's DDoS protection, firewall, and caching in front of them, but this is optional.

The CDN is a different story. It carries the heaviest traffic, so it lives in Cloudflare's object storage behind Cloudflare's own proxy, which keeps that traffic off both the VPS and the home connection.
