---
sidebar_position: 3
id: email-service
title: Email Service
description: Infrastructure Email Service
slug: ./email-service
---

# Email Service

NEXUS sends emails for account-related tasks, such as verifying email addresses and resetting forgotten passwords. In development, these emails are caught by Mailpit and never leave the machine, but in production they need to go out through a real email service. This is the only external service which NEXUS depends on, and without it, players are not able to register or verify their email addresses, or reset their passwords.

## Choosing A Provider

Any email provider which offers SMTP with STARTTLS works, since NEXUS only needs a host, a port, a user name, and a password. We use Amazon SES, which is cheap and reliable, but there are many alternatives, such as Mailgun, SendGrid, Postmark, Brevo, or the SMTP relay of an existing email host.

Whichever provider is used, the following needs to be in place:

- the sending domain is verified with the provider, so that emails sent from `project@kongor.net` are accepted and not marked as spam
- the DNS records which the provider asks for, usually for DKIM, SPF, and DMARC, are added to the domain
- the account is allowed to send to any address, since some providers start new accounts in a restricted mode
- SMTP credentials have been created for NEXUS

## Amazon SES

The following steps describe how we set up Amazon SES. Other providers follow a similar process, but the names and screens differ.

1. **Verify The Domain**: in the Amazon SES console, pick a region (we use `eu-west-2`, London) and create a domain identity for `kongor.net`, with Easy DKIM turned on. SES then lists three CNAME records for DKIM.
2. **Set A Custom MAIL FROM Domain**: on the same identity, set a custom MAIL FROM domain (we use `project.kongor.net`). SES then lists an MX record and an SPF TXT record for it. This step is optional, but it helps with deliverability, since the emails then pass SPF for our own domain.
3. **Add The DNS Records**: add the records from the previous two steps to Cloudflare, plus a DMARC record. All of them must be set to DNS only.
4. **Request Production Access**: new SES accounts start in the sandbox, where emails can only be sent to verified addresses. Request production access from the SES console, explaining what the emails are for.
5. **Create SMTP Credentials**: in the SES console, under SMTP settings, create a set of SMTP credentials. These are shown only once, so copy them somewhere safe.

The DNS records end up looking similar to the following, with the DKIM tokens and the region coming from the SES console:

<div align="center">
    | Type  | Name                    | Content                                          | Proxy Status |
    |:-----:|:-----------------------:|:------------------------------------------------:|:------------:|
    | CNAME | `{token1}._domainkey`   | `{token1}.dkim.amazonses.com`                    | DNS Only     |
    | CNAME | `{token2}._domainkey`   | `{token2}.dkim.amazonses.com`                    | DNS Only     |
    | CNAME | `{token3}._domainkey`   | `{token3}.dkim.amazonses.com`                    | DNS Only     |
    | MX    | `project`               | `10 feedback-smtp.eu-west-2.amazonses.com`       | DNS Only     |
    | TXT   | `project`               | `"v=spf1 include:amazonses.com ~all"`            | DNS Only     |
    | TXT   | `_dmarc`                | `"v=DMARC1; p=none;"`                            | DNS Only     |
</div>

:::tip
    A DMARC policy of `p=none` only monitors, and does not reject anything. Once emails have been going out without problems for a while, it can be tightened to `p=quarantine` or `p=reject`.
:::

## Configuring NEXUS

NEXUS reads the SMTP settings from four parameters, which are described in the [Set Up Environment](/docs/services/self-hosting-locally/set-up-environment) section. For Amazon SES, they look like the following:

<div align="center">
    | Parameter       | Value                                         |
    |:---------------:|:---------------------------------------------:|
    | `smtp-host`     | `email-smtp.eu-west-2.amazonaws.com`          |
    | `smtp-port`     | `587`                                         |
    | `smtp-username` | the SMTP user name from the SES console       |
    | `smtp-password` | the SMTP password from the SES console        |
</div>

The sender name and address (`Project KONGOR` and `project@kongor.net`) are set in the web portal API's production settings, and the address needs to be on the verified domain.

:::tip[VERIFICATION]
    Start NEXUS with the production profile, register an email address through the [user portal](https://portal.kongor.net), and check that the verification email arrives, and that it does not land in the spam folder.
:::
