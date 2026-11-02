---
sidebar_position: 3
id: compel
title: COMPEL
description: Utilities COMPEL
slug: ./compel
---

# COMPEL

COMPEL is the Heroes Of Newerth match server launcher for Project KONGOR. It runs on the host machine, keeps the match server distribution up to date, and starts and supervises the match servers. It runs on Windows and Linux, and it ships as a single self-contained executable plus a `COMPEL.json` configuration file.

## What It Does

- keeps the match server distribution up to date from the CDN, synchronising only what has changed, and gives its programs the execute permission on Linux
- checks that the system has everything the match servers need, before it starts the match server manager for the first time
- starts the match server manager, which runs the match servers, and restarts it if it exits unexpectedly
- runs a UDP proxy in front of the match servers, which forwards the public game and voice ports to the match servers, and checks every client with the challenge protocol which the game expects on those ports
- answers the server list pings, so that players can see the match servers and their latency in game
- exposes an HTTP control plane, for health checks and remote management
- checks for new releases, and updates itself

## Installing

Get the latest release for your platform from [GitHub](https://github.com/Project-KONGOR-Open-Source/COMPEL/releases), and extract it into its own directory. Each release comes with a default `COMPEL.json` already in place. Fill in at least the user name and password of the host account, then run COMPEL. On the first run, it sets up the match server distribution in the same directory.

:::warning
    On Windows, COMPEL must be installed in a directory whose full path contains a space, for example `C:\HoN Match Server`. The match server manager starts each match server from an unquoted path, and without a space in it, the match servers start up as game clients instead. COMPEL refuses to start from such a directory. This does not apply on Linux.
:::

COMPEL does not need elevated privileges, but it does need write access to its own directory. The match server manager and the match servers write their logs and replays to a user folder, `HON` on Windows and `.HON` on Linux, in the user's profile or home directory, or in the directory which `RuntimeArtefactsPath` names. COMPEL creates it if it does not exist.

Before it starts the match server manager, COMPEL runs the distribution's prerequisites check, `hon_check`, once. When anything the match servers need from the operating system is missing, it logs what is missing and how to install it, and does not start the manager; it also does not start the manager when the check itself cannot run, and logs why. After installing what was missing, restart COMPEL.

## Configuration

All of the configuration lives in `COMPEL.json`, next to the executable. Every setting comes with its own description in the file, and COMPEL checks all of them on start-up and reports any problems together. The most important ones are the following:

<div align="center">
    | Setting                           | Purpose                                                                   |
    |:---------------------------------:|:-------------------------------------------------------------------------:|
    | `UserName` / `Password`           | credentials of the Project KONGOR account which hosts the match servers   |
    | `Instances`                       | how many match servers to run                                             |
    | `WarmInstancesTarget`             | how many match servers to keep ready, while the rest sleep until needed   |
    | `Gateway`                         | the public address of the match servers, such as `kongor.net`             |
    | `Location`                        | the matchmaking region, such as `EU` or `USE`                             |
    | `ServerNamePrefix`                | the match server name, with the instance number added to the end          |
    | `UseProxy`                        | whether to run the UDP proxy, which is on by default                      |
    | `CDN`                             | the CDN to synchronise from, `cdn.kongor.net` by default                  |
    | `ControlPlaneAuthenticationToken` | the token for the management endpoints, which are disabled if left unset  |
</div>

## Ports

With the proxy on, players connect to public ports which sit 10000 above the ports the match servers actually use, and the proxy forwards the traffic down to them. The ports go up by one for each match server:

<div align="center">
    | Purpose     | Public Port (Proxy On) | Match Server Port | Protocol |
    |:-----------:|:----------------------:|:-----------------:|:--------:|
    | ping        | `21234`                | none              | UDP      |
    | game        | `21235+`               | `11235+`          | UDP      |
    | voice       | `21435+`               | `11435+`          | UDP      |
</div>

With the proxy off, the match server ports are the public ports, and the ping port is `11234`. Either way, the public ports are the ones which need to be reachable from the internet, for example through Pangolin, as described in the [Steps And Configuration](/docs/infrastructure/self-hosting-behind-vps/steps-and-configuration#raw-tcp-and-udp-ports) section.

## Control Plane

COMPEL listens for HTTP requests on port `8080` by default. The `/ping`, `/health`, and `/alive` endpoints are open, and are used for latency and health checks. The management endpoints, which report the status and can trigger a synchronisation, start, stop, or restart match servers, or restart the proxy, all require the `ControlPlaneAuthenticationToken` as a bearer token.

COMPEL logs to the console and to a `COMPEL.log` file next to the executable.
