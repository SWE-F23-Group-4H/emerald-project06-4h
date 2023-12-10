# CaSMM

> Computation and Science Modeling through Making

Cloud-based programming interface

![Deploy Staging](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Staging/badge.svg)
![Deploy Production](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Production/badge.svg)

<br/>

## Application

### `client` 
[client](/client#client) is the frontend of the application. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

### `server`

[server](/server#server) is the web server and application server. It is powered by [Node](https://nodejs.org/en/) and [Strapi](https://docs-v3.strapi.io/developer-docs/latest/getting-started/introduction.html).

### `compile`

  [compile](/compile#compile) is an arduino compiler service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

<br/>

## Environments

> The project is divided into three conceptual environments.

### Development
#### Structure

The development environment is composed of five servers. The first one is run with the [Create React App](https://create-react-app.dev/docs/getting-started/) dev server. The later four are containerized with docker and run with [docker compose](https://docs.docker.com/compose/).

* `casmm-client-dev` - localhost:3000

* `casmm-server-dev` - localhost:1337/admin

* `casmm-compile-dev` 

* `casmm-db-dev` - localhost:5432

  > The first time the db is started, the [init_db.sh](/scripts/init_db.sh) script will run and seed the database with an environment specific dump. Read about Postgres initialization scripts [here](https://github.com/docker-library/docs/blob/master/postgres/README.md#initialization-scripts). To see how to create this dump, look [here](https://github.com/DavidMagda/CaSMM_fork_2023/blob/develop/scripts/readme.md).

* `casmm-compile_queue-dev`

#### Running

`casmm-client-dev`

1. Follow the [client](/client#setup) setup
2. Run `yarn start` from `/client`

`casmm-server-dev`, `casmm-compile-dev`, `casmm-db-dev`, and `casmm-compile_queue-dev`

1. Install [docker](https://docs.docker.com/get-docker/)

2. Run `docker compose up` from `/`

   > Grant permission to the **scripts** and **server** directories if you are prompted
   

### Staging

#### Structure

The staging environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm-staging` - [casmm-staging.herokuapp.com](https://casmm-staging.herokuapp.com/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm-staging` is automatically built from the latest commits to branches matching `release/v[0-9].[0-9]`. Heroku runs the container orchestration from there.

### Production

#### Structure

The production environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm` - [www.casmm.org](https://www.casmm.org/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm` is automatically built from the latest commits to `master`. Heroku runs the container orchestration from there.

<br/>

## Maintenance

All three components of the application have their own dependencies managed in their respective `package.json` files. Run `npm outdated` in each folder to see what packages have new releases. Before updating a package (especially new major versions), ensure that there are no breaking changes. Avoid updating all of the packages at once by running `npm update` because it could lead to breaking changes. 

### Strapi

This is by far the largest and most important dependency we have. Staying up to date with its [releases](https://github.com/strapi/strapi/releases) is important for bug/security fixes and new features. When it comes to actually upgrading Strapi make sure to follow the [migration guides](https://docs-v3.strapi.io/developer-docs/latest/update-migration-guides/migration-guides.html#v3-guides)!

<br/>

## CI/CD

All of the deployments and releases are handled automatically with [GitHub Actions](https://docs.github.com/en/actions). The workflows implement custom [Actions](https://github.com/STEM-C/CaSMM/actions) that live in the [auto](https://github.com/STEM-C/auto) repo.

<br/>

## Contributing

### Git Flow 

> We will follow this git flow for the most part — instead of individual release branches, we will have one to streamline staging deployment 

![Git Flow](https://nvie.com/img/git-model@2x.png)

### Branches

#### Protected

> Locked for direct commits — all commits must be made from a non-protected branch and submitted via a pull request with one approving review

- **master** - Production application

#### Non-protected

> Commits can be made directly to the branch

- **release** - Staging application
- **develop** - Working version of the application
- **feature/<`scaffold`>-<`feature-name`>** - Based off of develop
  - ex. **feature/cms-strapi**
- **hotfix/<`scaffold`>-<`fix-name`>** - Based off of master
  - ex. **hotfix/client-cors**

### Pull Requests

Before submitting a pull request, rebase the feature branch into the target branch to resolve any merge conflicts.

- PRs to **master** should squash and merge
- PRs to all other branches should create a merge commit

## Custom Blocks

> As of 12/09/23, **blockly_dev** and **code_injectionv2** have been merged into **develop**

- **blockly_dev** - Directly create Blockly blocks using the [ArduBlockly Factory](https://ardublockly.ymtech.education/ardublockly/blockfactory/index.html)
- **code_injectionv2** - Inject C code into existing blocks
- **develop** - Minimaum viable product

### Creating Custom Blocks in CaSSM

> An unauthorized user cannot access or create Custom blocks
> Users with the `Mentor` role assignment can create Custom blocks within workspaces and lessons
> Users with the `Student` role assignment can only access Custom blocks within assigned workspaces and lessons

1. To create a custom block, sign into a user account with the `Mentor` role and navigate to a lesson
2. Click the 'plus' button to open the Custom block creation form
<img width="1680" alt="Creating Custom Blocks" src="https://github.com/SWE-F23-Group-4H/emerald-project06-4h/assets/100671205/4a2ba137-c35d-449c-9f99-d2360c718c40">

3. Using the [ArduBlockly Factory](https://ardublockly.ymtech.education/ardublockly/blockfactory/index.html), copy and paste the JavaScript code stubs and Blockly definitions into the form. Note that blocks names should not contain spaces.
<img width="1680" alt="Creating Custom Blocks" src="https://github.com/SWE-F23-Group-4H/emerald-project06-4h/assets/100671205/349d30eb-31ac-4acc-9791-29f40f7c1c26">

4. Once clicking `Create Block`, the form will reset and remain open if you wish to create additional Custom blocks. Blocks will automatically be added to the database with the given parameters.

> Currently, you will have to exit the lesson and enter it again to access newly created Custom blocks. Make sure to enable the Custom category in the right sidepane so that Custom blocks are accessible within student workspaces

## Outstanding Work

### UI Bugs

> When opening the Block creation form, certain react elements will not resize properly due to improperly modified react states
> This can simply be rectified by clicking on the screen a few times

### Sandbox Style Block Creation

> Our original plan was to implement a sandbox-style Custom block creator such as what is seen in the ArduBlockly Generator linked above. Given more time, this is still something we would like to implement to avoid relying on third-party applications to generate blocks. Unfortunately, implementing this feature proved to be more difficult than anticipated and was abandoned in favor of the existing form.

### Add User ID and Workspace ID to Block entries in Strapi

> Curently, the Custom category is shared amongst all users and workspaces. We planned to add a workspace_id and user_id field to the Block schema in Strapi to allow us to render Custom blocks specific for each lesson or workspace but had no time to complete this feature.

