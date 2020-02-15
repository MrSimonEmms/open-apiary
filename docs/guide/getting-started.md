# Getting Started

::: warning COMPATIBILITY NOTE
Open Apiary is only tested with NodeJS 12 and above. 
 
It may work on lower 
versions, but bug requests caused by lower versions are unlikely to be fixed.
:::

This is purely so you can get the application running so you test it out. Please
see the [deployment](./deployment/) section for details on how to get it running
and deployed to the internet.

> This will run the application with a SQLite database. SQLite is a fully-functioning
> database that runs off a single file.

## Install NodeJS

> This is an overview of NodeJS installation. If you need further information on
> installing NodeJS, please see [their documentation](https://nodejs.org/en/download/).

Open Apiary is written in NodeJS. NodeJS is a general purpose language that is 
designed to build scalable applications.

If you already have NodeJS v12 or greater installed, skip this step.

### For Windows Users

Download the Windows Installer (.msi) from the 
[NodeJS](https://nodejs.org/en/download/) website and install by double clicking
on the downloaded file. This will add a NodeJS Command Line entry to your start
menu. Any commands on these instructions should be written in there.

### For Mac/Linux Users

It is recommended that you use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
on a Mac/Linux machine. One you've install the nvm binary, you will need to
install the long-term support (LTS) version of NodeJS.

```shell script
nvm install --lts
```

## Install Open Apiary

[Download the latest version of Open Apiary](https://github.com/MrSimonEmms/open-apiary/releases).

Once downloaded, extract the contents of the zip file (right click and extract)
and place it somewhere on your computer. Once you've done that, from the root of
the extracted directory install the NodeJS dependencies:

```shell script
npm install --production
```

> The BCrypt and SQLite3 packages will be compiled as part of this process. This
> requires g++, make and python to be installed. For Ubuntu machines,
> run `sudo apt-get install g++ make python`.

## Set your configuration

You will need to set some configuration parameters in order to run the 
application. Create a file in the root of your extracted folder called
`config.json` and with the following configuration.

```json
{
  "db": {
    "type": "sqlite",
    "database": "./db.sql"
  },
  "jwt": {
    "secret": "some-secret"  
  } 
}
```

Let's understand what we're doing here:

- **db.type**: this is setting the database type as SQLite
- **db.database**: this is the file that will be used as the SQLite database source
- **jwt.secret**: the application uses [JSON Web Tokens](https://jwt.io) to store
sensitive data such as authentication tokens. In order to preserve the integrity
of your application, please put a random string of data of [at least 16 characters](https://passwordsgenerator.net).
For testing purposes, `some-secret` is fine but should never be used when
[deployed](./deployment/).

## Run

You should now have everything set up and you're ready for it to run. In your
terminal, type `npm start`. After a few seconds, you should see logs in your
terminal. When you see `Nest application successfully started`, you can load up
[localhost:3000](http://localhost:3000) in your browser.

Assuming everything has been successful, you should see the setup page.

::: warning Database
In the folder where you extracted all the files, you should also see a new file
called `db.sql`. This is the database that's been created by Open Apiary - in 
later chapters, we'll discuss how to back this up.
:::
