# Deployment

In the [Getting Started](./getting-started) section, we discussed how to get the
application up and running so you can try it out. In order to use it in the real
world, you will need to get it set up reliably.

This will get you set up with:
- The Open Apiary application
- A web address with a domain name and an HTTPS certificate
- A backed-up database
- Health-checks to ensure the application is always available

## Deployment Process

Select one of the following ways of deploying. These are in order of easiest to
most challenging.

### PM2

> This is the easiest method and is the recommended approach for most user. It
> will be running with SQLite which, whilst not the most performant, is fine for
> most circumstances.

[PM2](https://pm2.keymetrics.io) is a process manager for NodeJS applications. It
allows you to create a process for your application that will restart when your 
host machine does. This is the recommended way for most people to deploy their
Open Apiary application.

- Install NodeJS. This is the same as found in the
[Getting Started](./getting-started) section.
- [Download the latest version of Open Apiary](https://github.com/MrSimonEmms/open-apiary/releases).
See [Getting Started](./getting-started) for details on which one to choose.
- Inside your application, you will find a file called `pm2.yaml`. This will
configure the application for running. The only thing you need to concern yourself
with at this stage is the environment variable `JWT_SECRET`. Select a random
password of at least 16 characters. Additional options can be found on the
[config](./config) page.
- Run the command `pm2 start pm2.yaml`. This will start the application. After a
few seconds, point your browser to the IP address given to you by your hosting 
provider. You should be able to see the Open Apiary application running. If it's
not, check `pm2 logs` to investigate any problems.
- `pm2 save`. This will save the configuration.
- `pm2 startup`. This will make it run on startup.

### Docker Compose

> Coming soon

### Kubernetes

> Coming soon

## Setting Up HTTPS (SSL)

The easiest way of setting up SSL for your deployed application is to set your
domain name's DNS to CloudFlare. The steps for this are mainly the same as setting
it up with [GitHub Pages](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/).

Steps:
1. Go to [CloudFlare](https://dash.cloudflare.com) and add your domain. Make sure
to set the nameservers for your domain name to point to CloudFlare. This may take
up to 48 hours to promulgate.
2. Enter the domain name page on CloudFlare, select the DNS tab and then 
`Add A Record`. Use the following information:
    - **Type**: `A`
    - **Name**: `open-apiary`. You can set this to anything you want. This will
    set it as a subdomain, eg `open-apiary.example.com`.
    - **IPv4 address**: `<IP address>`. This is the IP address given to you by
    your hosting provider. 
    - **Proxy status**: Ensure that this is set to `Proxied`
3. In the SSL tab, set the SSL/TLS encryption mode to `Flexible`. In the `Edge
Certificates` tab, also select `Always use HTTPS`.
4. In the Page Rules tab, add a page rule:
    - **URL**: `http://*example.com/*`
    - **Setting**: `Always use HTTPS`

## Backing Up

> Coming soon

## Where Should I Host This?

There are plenty of choices available out there to host it. You can certainly host
it on a machine in your local network, but it is recommended to host it on a cloud
provider. Here are some options, but this list is by no means exhaustive:

- [Scaleway](https://www.scaleway.com/en/virtual-instances/arm-instances) - the
application will run on the lowest powered ARM instances without issue
- [Civo](https://www.civo.com/pricing)
- [DigitalOcean](https://www.digitalocean.com/products/droplets) 
