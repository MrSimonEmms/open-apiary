# Open Apiary

> An application to enable beekeepers to keep track of their records and maintain
> healthy apiaries.

# Requirements

@todo

# Getting Started

@todo

# Contributing

See the [Contributing Guidelines](CONTRIBUTING.md).

For development, use [Docker Compose](https://docs.docker.com/compose/install)
to run the whole stack.

In the root of your repo, run `docker-compose up`. This will run the development
stack and initialise test data sets. Once it's loaded, navigate to 
[localhost:9999](http://localhost:9999).

# Applications

## Client

- [Documentation](client)

The front-end application. This is written in TypeScript using the [NuxtJS
framework](https://nuxtjs.org).

## Server

- [Documentation](server)

The back-end API. This is written in TypeScript using the
[NestJS framework](https://nestjs.com).

## Branches

### master

This is the mainline. Anything that goes in here is considered production-ready.
Any live bugfixes should originate from here.

Anything that gets pushed into here will use [Semantic Release](https://semantic-release.gitbook.io)
to generate a new version number. It is mandatory that you **MUST** use the
[git message convention](https://semantic-release.gitbook.io/semantic-release/#how-does-it-work).

### develop

The development mainline. This is considered a release candidate - that's to say
that anything in here should be considered ready for release and is pending
promotion to the `master` branch.

All pull requests must be made against this branch in the first instance. From
there, they will be pulled into the `master` branch as appropriate.

### feature/bugfix

Any development should be done in a branch that begins either `feature/` or
`bugfix/` and a pull request made.
