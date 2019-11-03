# EpitechExpressApi2019

## Links

Api url: <https://guarded-headland-50683.herokuapp.com/></br>
Docs: <https://guarded-headland-50683.herokuapp.com/docs/></br>

## Install project

You need npm and nodejs to run this project</br>
See [this tutorial](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/) to install nodejs and npm with [nmv](https://github.com/nvm-sh/nvm)</br>

`npm install`

### Dev config

For development env, run `mv .env.example .env`

### Prod config

For production, run `mv .env.prod.example .env`</br>
This will be automatically executing when deployed

### Start dev mode

`npm run start`

### Lint

`npm run lint`

## Documentation

### Generate api documentation

Install apidoc </br>
`npm install apidoc -g`
</br>
Generate documentation </br>
`npm run doc:build`
</br>
File named apidoc will be generated</br>

If the documentation is build, she will be available at yourDomain/docs

## How to deploy

Here is the step to follow to deploy the webApi

### Install dependancies

`npm install`

### Install Heroku

For Ubuntu: `sudo snap install heroku --classic`</br>
For Other env, see [Heroku documentation](https://devcenter.heroku.com/articles/heroku-cli)

### Login to Heroku

`heroku login`</br>
You need to ask for credentials.

### Push to heroku

`git push heroku master`</br>
This command will deploy the repository master branch to the heroku repository, and will deploy a new version.
</br>
Heroku will automatically run every command found in the `Procfile` file.

### Logs

You can get the heroku log by running `heroku logs --tail`.

### Login to VM

You can log in to the Heroku by running `heroku run bash`

## WebSocket

You can try the websocket with [smart websocket chrome extension](https://chrome.google.com/webstore/detail/smart-websocket-client/omalebghpgejjiaoknljcfmglgbpocdp)</br>

This socket allow you to broadcast message to every connected user.</br>
By default, a rand id is set as name, but you can change it by sending `newName: yourName`</br>
