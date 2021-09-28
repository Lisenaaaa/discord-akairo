<!-- markdownlint-disable MD041 MD033 MD001 MD026 -->
<div align="center">
  <br />
  <p>
    <a href="https://discord-akairo.github.io"><img src="https://discord-akairo.github.io/static/logo.svg" width="546" alt="discord-akairo" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/discord-akairo"><img src="https://img.shields.io/npm/v/discord-akairo.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord-akairo"><img src="https://img.shields.io/npm/dt/discord-akairo.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://travis-ci.org/discord-akairo/discord-akairo"><img src="https://travis-ci.org/discord-akairo/discord-akairo.svg" alt="Build status" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord-akairo/"><img src="https://nodei.co/npm/discord-akairo.png?downloads=true" alt="npm installnfo" /></a>
  </p>
</div>

### Changes in this fork of akairo

Please see [this file](/docs/general/updates.md) for a list of changes in this fork vs normal akairo.
If you have any questions related to this fork please contact `lis#6969` in the akairo server or join [my discord](https://discord.gg/uUaGtMVkhD).

This is the same as `NotEnoughUpdates/discord-akairo`, but with some small changes to how slashcommand args work, to make them a bit easier to use.
With the type `USER` or `MENTIONABLE`, if you selected a user, instead of the arg just being their ID, it'll now have a `user` and `member` object. For example, `args.example.user`

## Features

#### Completely modular commands, inhibitors, and listeners.

- Reading files recursively from directories.
- Adding, removing, and reloading modules.
- Creating your own handlers and module types.

#### Flexible command handling and creation.

- Command aliases.
- Command throttling and cooldowns.
- Client and user permission checks.
- Running commands on edits and editing previous responses.
- Multiple prefixes and mention prefixes.
- Regular expression and conditional triggers.

#### Complex and highly customizable arguments.

- Support for quoted arguments.
- Arguments based on previous arguments.
- Several ways to match arguments, such as flag arguments.
- Casting input into certain types.
  - Simple types such as string, integer, float, url, date, etc.
  - Discord-related types such as user, member, message, etc.
  - Types that you can add yourself.
  - Asynchronous type casting.
- Prompting for input for arguments.
  - Customizable prompts with embeds, files, etc.
  - Easily include dynamic data such as the incorrect input.
  - Infinite argument prompting.

#### Blocking and monitoring messages with inhibitors.

- Run at various stages of command handling.
  - On all messages.
  - On messages that are from valid users.
  - On messages before commands.

#### Helpful events and modular listeners.

- Events for handlers, such as loading modules.
- Events for various stages of command handling.
- Reloadable listeners to easily separate your event handling.

#### Useful utilities.

- Resolvers for members, users, and others that can filter by name.
- Shortcut methods for making embeds and collections.

## Installation

##### Requires Node 16+ and Discord.js v13.

> Yarn 2.0+ needs to have the version specified due to this [issue](https://github.com/yarnpkg/berry/issues/1816). If you are using yarn 2.0 use the second command.

**discord-akairo**
`yarn add discord-akairo@npm:@notenoughupdates/discord-akairo`
`yarn add discord-akairo@npm:@notenoughupdates/discord-akairo@9.0.0`
`npm i discord-akairo@npm:@notenoughupdates/discord-akairo`

**discord.js fork**
_optional you can use regular discord.js instead if you want_
`yarn add discord.js@npm:@notenoughupdates/discord.js`
`yarn add discord.js@npm:@notenoughupdates/discord.js@13.2.0-dev`
`npm i discord.js@npm:@notenoughupdates/discord.js`

## Links

- [Website](https://discord-akairo.github.io)
- [Repository](https://github.com/discord-akairo/discord-akairo)
- [Changelog](https://github.com/discord-akairo/discord-akairo/releases)
- [Official Akairo Discord](https://discord.gg/arTauDY)
- [This Fork's Discord](https://discord.gg/7FpsYp2c47)

## Contributing

Open an issue or a pull request!  
Everyone is welcome to do so.  
Make sure to run `yarn test` before committing.
