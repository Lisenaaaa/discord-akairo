"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const lodash_1 = __importDefault(require("lodash"));
const AkairoError_1 = __importDefault(require("../../util/AkairoError"));
const AkairoMessage_1 = __importDefault(require("../../util/AkairoMessage"));
const Constants_1 = require("../../util/Constants");
const Util_1 = __importDefault(require("../../util/Util"));
const AkairoHandler_1 = __importDefault(require("../AkairoHandler"));
const ContextMenuCommandHandler_1 = __importDefault(require("../contextMenuCommands/ContextMenuCommandHandler"));
const TypeResolver_1 = __importDefault(require("./arguments/TypeResolver"));
const Command_1 = __importDefault(require("./Command"));
const CommandUtil_1 = __importDefault(require("./CommandUtil"));
const Flag_1 = __importDefault(require("./Flag"));
/**
 * Loads commands and handles messages.
 * @param client - The Akairo client.
 * @param options - Options.
 */
class CommandHandler extends AkairoHandler_1.default {
    constructor(client, { directory, classToHandle = Command_1.default, extensions = [".js", ".ts"], automateCategories, loadFilter, blockClient = true, blockBots = true, fetchMembers = false, handleEdits = false, storeMessages = false, commandUtil, commandUtilLifetime = 3e5, commandUtilSweepInterval = 3e5, defaultCooldown = 0, ignoreCooldown = client.ownerID, ignorePermissions = [], argumentDefaults = {}, prefix = "!", allowMention = true, aliasReplacement, autoDefer = false, typing = false, autoRegisterSlashCommands = false, execSlash = false, skipBuiltInPostInhibitors = false, useSlashPermissions = false } = {}) {
        if (!(classToHandle.prototype instanceof Command_1.default || classToHandle === Command_1.default)) {
            throw new AkairoError_1.default("INVALID_CLASS_TO_HANDLE", classToHandle.name, Command_1.default.name);
        }
        super(client, {
            directory,
            classToHandle,
            extensions,
            automateCategories,
            loadFilter
        });
        this.autoRegisterSlashCommands = autoRegisterSlashCommands;
        this.typing = typing;
        this.autoDefer = autoDefer;
        this.resolver = new TypeResolver_1.default(this);
        this.aliases = new discord_js_1.Collection();
        this.aliasReplacement = aliasReplacement;
        this.prefixes = new discord_js_1.Collection();
        this.blockClient = Boolean(blockClient);
        this.blockBots = Boolean(blockBots);
        this.fetchMembers = Boolean(fetchMembers);
        this.handleEdits = Boolean(handleEdits);
        this.storeMessages = Boolean(storeMessages);
        this.commandUtil = Boolean(commandUtil);
        if ((this.handleEdits || this.storeMessages) && !this.commandUtil)
            throw new AkairoError_1.default("COMMAND_UTIL_EXPLICIT");
        this.commandUtilLifetime = commandUtilLifetime;
        this.commandUtilSweepInterval = commandUtilSweepInterval;
        if (this.commandUtilSweepInterval > 0)
            setInterval(() => this.sweepCommandUtil(), this.commandUtilSweepInterval).unref();
        this.commandUtils = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.defaultCooldown = defaultCooldown;
        this.ignoreCooldown = typeof ignoreCooldown === "function" ? ignoreCooldown.bind(this) : ignoreCooldown;
        this.ignorePermissions = typeof ignorePermissions === "function" ? ignorePermissions.bind(this) : ignorePermissions;
        this.prompts = new discord_js_1.Collection();
        this.argumentDefaults = Util_1.default.deepAssign({
            prompt: {
                start: "",
                retry: "",
                timeout: "",
                ended: "",
                cancel: "",
                retries: 1,
                time: 30000,
                cancelWord: "cancel",
                stopWord: "stop",
                optional: false,
                infinite: false,
                limit: Infinity,
                breakout: true
            }
        }, argumentDefaults);
        this.prefix = typeof prefix === "function" ? prefix.bind(this) : prefix;
        this.allowMention = typeof allowMention === "function" ? allowMention.bind(this) : Boolean(allowMention);
        this.inhibitorHandler = null;
        this.autoDefer = Boolean(autoDefer);
        this.execSlash = Boolean(execSlash);
        this.skipBuiltInPostInhibitors = Boolean(skipBuiltInPostInhibitors);
        this.useSlashPermissions = Boolean(useSlashPermissions);
        this.setup();
    }
    /**
     * Collection of command aliases.
     */
    aliases;
    /**
     * Regular expression to automatically make command aliases for.
     */
    aliasReplacement;
    /**
     * Whether or not mentions are allowed for prefixing.
     */
    allowMention;
    /**
     * Default argument options.
     */
    argumentDefaults;
    /**
     * Automatically defer messages "BotName is thinking".
     */
    autoDefer;
    /**
     * Specify whether to register all slash commands when starting the client
     */
    autoRegisterSlashCommands;
    /**
     * Whether or not to block bots.
     */
    blockBots;
    /**
     * Whether or not to block self.
     */
    blockClient;
    /**
     * Whether or not `message.util` is assigned.
     */
    commandUtil;
    /**
     * Milliseconds a message should exist for before its command util instance is marked for removal.
     */
    commandUtilLifetime;
    /**
     * Collection of CommandUtils.
     */
    commandUtils;
    /**
     * Time interval in milliseconds for sweeping command util instances.
     */
    commandUtilSweepInterval;
    /**
     * Collection of cooldowns.
     * <info>The elements in the collection are objects with user IDs as keys
     * and {@link CooldownData} objects as values</info>
     */
    cooldowns;
    /**
     * Default cooldown for commands.
     */
    defaultCooldown;
    /**
     * Whether or not to use execSlash for slash commands.
     */
    execSlash;
    /**
     * Whether or not members are fetched on each message author from a guild.
     */
    fetchMembers;
    /**
     * Whether or not edits are handled.
     */
    handleEdits;
    /**
     * ID of user(s) to ignore cooldown or a function to ignore.
     */
    ignoreCooldown;
    /**
     * ID of user(s) to ignore `userPermissions` checks or a function to ignore.
     */
    ignorePermissions;
    /**
     * Inhibitor handler to use.
     */
    inhibitorHandler;
    /**
     * The prefix(es) for command parsing.
     */
    prefix;
    /**
     * Collection of prefix overwrites to commands.
     */
    prefixes;
    /**
     * Collection of sets of ongoing argument prompts.
     */
    prompts;
    /**
     * The type resolver.
     */
    resolver;
    /**
     * Whether or not to store messages in CommandUtil.
     */
    storeMessages;
    /**
     * Show "BotName is typing" information message on the text channels when a command is running.
     */
    typing;
    /**
     * Whether or not to skip built in reasons post type inhibitors so you can make custom ones.
     */
    skipBuiltInPostInhibitors;
    /**
     * Use slash command permissions for owner only commands
     * Warning: this is experimental
     */
    useSlashPermissions;
    /**
     * Set up the command handler
     */
    setup() {
        this.client.once("ready", () => {
            if (this.autoRegisterSlashCommands)
                this.registerInteractionCommands().then(() => {
                    if (this.useSlashPermissions)
                        this.updateInteractionPermissions(this.client.ownerID /*  this.client.superUserID */);
                });
            this.client.on("messageCreate", async (m) => {
                if (m.partial)
                    await m.fetch();
                this.handle(m);
            });
            if (this.handleEdits) {
                this.client.on("messageUpdate", async (o, m) => {
                    if (o.partial)
                        await o.fetch();
                    if (m.partial)
                        await m.fetch();
                    if (o.content === m.content)
                        return;
                    if (this.handleEdits)
                        this.handle(m);
                });
            }
            this.client.on("interactionCreate", i => {
                if (!i.isCommand())
                    return;
                this.handleSlash(i);
            });
        });
    }
    /**
     * Registers interaction commands.
     */
    async registerInteractionCommands() {
        const parsedSlashCommands = [];
        const guildSlashCommandsParsed = new discord_js_1.Collection();
        const parseDescriptionCommand = (description) => {
            if (typeof description === "object") {
                if (typeof description.content === "function")
                    return description.content();
                if (typeof description.content === "string")
                    return description.content;
            }
            return description;
        };
        for (const [, data] of this.modules) {
            if (!data.slash)
                continue;
            parsedSlashCommands.push({
                name: data.aliases[0]?.toLowerCase() || data.id?.toLowerCase(),
                description: parseDescriptionCommand(data.description) || "No description provided.",
                options: data.slashOptions,
                guilds: data.slashGuilds ?? [],
                defaultPermission: !(data.ownerOnly || /* data.superUserOnly || */ false),
                type: "CHAT_INPUT"
            });
        }
        let contextCommandHandler;
        for (const key in this.client) {
            if (this.client[key] instanceof ContextMenuCommandHandler_1.default) {
                contextCommandHandler = this.client[key];
                break;
            }
        }
        if (contextCommandHandler) {
            for (const [, data] of contextCommandHandler.modules) {
                parsedSlashCommands.push({
                    name: data.name,
                    guilds: data.guilds ?? [],
                    defaultPermission: this.useSlashPermissions ? !(data.ownerOnly || /* data.superUserOnly || */ false) : true,
                    type: data.type
                });
            }
        }
        /* Global */
        const slashCommandsApp = parsedSlashCommands
            .filter(({ guilds }) => !guilds.length)
            .map(({ name, description, options, defaultPermission, type }) => {
            return { name, description, options, defaultPermission, type };
        });
        const currentGlobalCommands = (await this.client.application?.commands.fetch()).map(value1 => ({
            name: value1.name,
            description: value1.description,
            options: value1.options,
            defaultPermission: value1.defaultPermission,
            type: value1.type
        }));
        if (!lodash_1.default.isEqual(currentGlobalCommands, slashCommandsApp)) {
            await this.client.application?.commands.set(slashCommandsApp);
        }
        /* Guilds */
        for (const { name, description, options, guilds, defaultPermission, type } of parsedSlashCommands) {
            for (const guildId of guilds) {
                guildSlashCommandsParsed.set(guildId, [
                    ...(guildSlashCommandsParsed.get(guildId) ?? []),
                    { name, description: description, options: options, defaultPermission, type }
                ]);
            }
        }
        if (guildSlashCommandsParsed.size) {
            guildSlashCommandsParsed.each(async (value, key) => {
                const guild = this.client.guilds.cache.get(key);
                if (!guild)
                    return;
                const currentGuildCommands = (await guild.commands.fetch()).map(value1 => ({
                    name: value1.name,
                    description: value1.description,
                    options: value1.options,
                    defaultPermission: value1.defaultPermission,
                    type: value1.type
                }));
                if (!lodash_1.default.isEqual(currentGuildCommands, value)) {
                    await guild.commands.set(value);
                }
            });
        }
    }
    /**
     * updates interaction permissions
     */
    async updateInteractionPermissions(owners /* superUsers: Snowflake | Snowflake[] */) {
        const mapCom = (value) => {
            const command = this.modules.find(mod => mod.aliases[0] === value.name);
            let allowedUsers = [];
            /* if (command.superUserOnly) allowedUsers.push(...Util.intoArray(superUsers)); */
            if (command?.ownerOnly)
                allowedUsers.push(...Util_1.default.intoArray(owners));
            allowedUsers = [...new Set(allowedUsers)]; // remove duplicates
            return {
                id: value.id,
                permissions: allowedUsers.map(u => ({
                    id: u,
                    type: "USER",
                    permission: true
                }))
            };
        };
        const globalCommands = (await this.client.application?.commands.fetch())?.filter(value => Boolean(this.modules.find(mod => mod.aliases[0] === value.name)));
        const fullPermissions = globalCommands
            ?.filter(value => !value.defaultPermission)
            .filter(value => Boolean(this.modules.find(mod => mod.aliases[0] === value.name)))
            .map(value => mapCom(value));
        const promises = this.client.guilds.cache.map(async (guild) => {
            const perms = new Array(...(fullPermissions ?? []));
            await guild.commands.fetch();
            if (guild.commands.cache.size)
                perms.push(...guild.commands.cache.filter(value => !value.defaultPermission).map(value => mapCom(value)));
            if (guild.available)
                return guild.commands.permissions.set({
                    fullPermissions: perms
                });
            // Return empty promise if guild is unavailable
            return Promise.resolve();
        });
        try {
            await Promise.all(promises);
        }
        catch (e) {
            /* eslint-disable no-console */
            console.debug(promises);
            console.debug(globalCommands);
            console.debug(fullPermissions);
            /* eslint-enable no-console */
            throw e;
        }
    }
    /**
     * Registers a module.
     * @param command - Module to use.
     * @param filepath - Filepath of module.
     */
    register(command, filepath) {
        super.register(command, filepath);
        for (let alias of command.aliases) {
            const conflict = this.aliases.get(alias.toLowerCase());
            if (conflict)
                throw new AkairoError_1.default("ALIAS_CONFLICT", alias, command.id, conflict);
            alias = alias.toLowerCase();
            this.aliases.set(alias, command.id);
            if (this.aliasReplacement) {
                const replacement = alias.replace(this.aliasReplacement, "");
                if (replacement !== alias) {
                    const replacementConflict = this.aliases.get(replacement);
                    if (replacementConflict)
                        throw new AkairoError_1.default("ALIAS_CONFLICT", replacement, command.id, replacementConflict);
                    this.aliases.set(replacement, command.id);
                }
            }
        }
        if (command.prefix != null) {
            let newEntry = false;
            if (Array.isArray(command.prefix)) {
                for (const prefix of command.prefix) {
                    const prefixes = this.prefixes.get(prefix);
                    if (prefixes) {
                        prefixes.add(command.id);
                    }
                    else {
                        this.prefixes.set(prefix, new Set([command.id]));
                        newEntry = true;
                    }
                }
            }
            else {
                const prefixes = this.prefixes.get(command.prefix);
                if (prefixes) {
                    prefixes.add(command.id);
                }
                else {
                    this.prefixes.set(command.prefix, new Set([command.id]));
                    newEntry = true;
                }
            }
            if (newEntry) {
                this.prefixes = this.prefixes.sort((aVal, bVal, aKey, bKey) => Util_1.default.prefixCompare(aKey, bKey));
            }
        }
    }
    /**
     * Deregisters a module.
     * @param command - Module to use.
     */
    deregister(command) {
        for (let alias of command.aliases) {
            alias = alias.toLowerCase();
            this.aliases.delete(alias);
            if (this.aliasReplacement) {
                const replacement = alias.replace(this.aliasReplacement, "");
                if (replacement !== alias)
                    this.aliases.delete(replacement);
            }
        }
        if (command.prefix != null) {
            if (Array.isArray(command.prefix)) {
                for (const prefix of command.prefix) {
                    const prefixes = this.prefixes.get(prefix);
                    if (prefixes?.size === 1) {
                        this.prefixes.delete(prefix);
                    }
                    else {
                        prefixes?.delete(prefix);
                    }
                }
            }
            else {
                const prefixes = this.prefixes.get(command.prefix);
                if (prefixes?.size === 1) {
                    this.prefixes.delete(command.prefix);
                }
                else {
                    prefixes?.delete(command.prefix);
                }
            }
        }
        super.deregister(command);
    }
    /**
     * Handles a message.
     * @param message - Message to handle.
     */
    async handle(message) {
        try {
            if (this.fetchMembers && message.guild && !message.member && !message.webhookId) {
                await message.guild.members.fetch(message.author);
            }
            if (await this.runAllTypeInhibitors(message)) {
                return false;
            }
            if (this.commandUtil) {
                if (this.commandUtils.has(message.id)) {
                    message.util = this.commandUtils.get(message.id);
                }
                else {
                    message.util = new CommandUtil_1.default(this, message);
                    this.commandUtils.set(message.id, message.util);
                }
            }
            if (await this.runPreTypeInhibitors(message)) {
                return false;
            }
            let parsed = await this.parseCommand(message);
            if (!parsed.command) {
                const overParsed = await this.parseCommandOverwrittenPrefixes(message);
                if (overParsed.command || (parsed.prefix == null && overParsed.prefix != null)) {
                    parsed = overParsed;
                }
            }
            if (this.commandUtil) {
                message.util.parsed = parsed;
            }
            let ran;
            if (!parsed.command) {
                ran = await this.handleRegexAndConditionalCommands(message);
            }
            else {
                ran = await this.handleDirectCommand(message, parsed.content, parsed.command);
            }
            if (ran === false) {
                this.emit(Constants_1.CommandHandlerEvents.MESSAGE_INVALID, message);
                return false;
            }
            return ran;
        }
        catch (err) {
            this.emitError(err, message);
            return null;
        }
    }
    /**
     * Handles a slash command.
     * @param interaction - Interaction to handle.
     */
    // eslint-disable-next-line complexity
    async handleSlash(interaction) {
        const command = this.findCommand(interaction.commandName);
        if (!command) {
            this.emit(Constants_1.CommandHandlerEvents.SLASH_NOT_FOUND, interaction);
            return false;
        }
        const message = new AkairoMessage_1.default(this.client, interaction);
        try {
            if (this.fetchMembers && message.guild && !message.member) {
                await message.guild.members.fetch(message.author);
            }
            if (await this.runAllTypeInhibitors(message, true)) {
                return false;
            }
            if (this.commandUtil) {
                if (this.commandUtils.has(message.id)) {
                    message.util = this.commandUtils.get(message.id);
                }
                else {
                    message.util = new CommandUtil_1.default(this, message);
                    this.commandUtils.set(message.id, message.util);
                }
            }
            if (await this.runPreTypeInhibitors(message)) {
                return false;
            }
            let parsed = await this.parseCommand(message);
            if (!parsed.command) {
                const overParsed = await this.parseCommandOverwrittenPrefixes(message);
                if (overParsed.command || (parsed.prefix == null && overParsed.prefix != null)) {
                    parsed = overParsed;
                }
            }
            if (this.commandUtil) {
                message.util.parsed = parsed;
            }
            if (await this.runPostTypeInhibitors(message, command)) {
                return false;
            }
            const convertedOptions = {};
            interaction.options.data.forEach(option => {
                switch (option.type) {
                    case "STRING":
                        convertedOptions[option.name] = option.value;
                        break;
                    case "INTEGER":
                        convertedOptions[option.name] = option.value;
                        break;
                    case "BOOLEAN":
                        convertedOptions[option.name] = option.value;
                        break;
                    case "NUMBER":
                        convertedOptions[option.name] = option.value;
                        break;
                    case "USER":
                        convertedOptions[option.name] = { user: option.user, member: option.member };
                        break;
                    case "CHANNEL":
                        convertedOptions[option.name] = option.channel;
                        break;
                    case "ROLE":
                        convertedOptions[option.name] = option.role;
                        break;
                    case "MENTIONABLE":
                        convertedOptions[option.name] = option.role ? option.role : { user: option.user, member: option.member };
                        break;
                    case "SUB_COMMAND":
                        convertedOptions["subcommand"] = option.name;
                        option.options?.forEach(subOption => {
                            switch (subOption.type) {
                                case "STRING":
                                    convertedOptions[subOption.name] = subOption.value;
                                    break;
                                case "INTEGER":
                                    convertedOptions[subOption.name] = subOption.value;
                                    break;
                                case "BOOLEAN":
                                    convertedOptions[subOption.name] = subOption.value;
                                    break;
                                case "NUMBER":
                                    convertedOptions[subOption.name] = subOption.value;
                                    break;
                                case "USER":
                                    convertedOptions[subOption.name] = { user: subOption.user, member: subOption.member };
                                    break;
                                case "CHANNEL":
                                    convertedOptions[subOption.name] = subOption.channel;
                                    break;
                                case "ROLE":
                                    convertedOptions[subOption.name] = subOption.role;
                                    break;
                                case "MENTIONABLE":
                                    convertedOptions[subOption.name] = subOption.role ? subOption.role : { user: subOption.user, member: subOption.member };
                                    break;
                            }
                        });
                        break;
                    case "SUB_COMMAND_GROUP": {
                        convertedOptions['subcommandGroup'] = option.name;
                        // @ts-ignore
                        const options = option.options[0].options;
                        convertedOptions["subcommand"] = option.options[0].name;
                        // @ts-ignore
                        options.forEach(subOption => {
                            switch (subOption.type) {
                                case "STRING":
                                    convertedOptions[subOption.name] = subOption.value;
                                    break;
                                case "INTEGER":
                                    convertedOptions[subOption.name] = subOption.value;
                                    break;
                                case "BOOLEAN":
                                    convertedOptions[subOption.name] = subOption.value;
                                    break;
                                case "NUMBER":
                                    convertedOptions[subOption.name] = subOption.value;
                                    break;
                                case "USER":
                                    convertedOptions[subOption.name] = { user: subOption.user, member: subOption.member };
                                    break;
                                case "CHANNEL":
                                    convertedOptions[subOption.name] = subOption.channel;
                                    break;
                                case "ROLE":
                                    convertedOptions[subOption.name] = subOption.role;
                                    break;
                                case "MENTIONABLE":
                                    convertedOptions[subOption.name] = subOption.role ? subOption.role : { user: subOption.user, member: subOption.member };
                                    break;
                            }
                        });
                        break;
                    }
                }
                // convertedOptions[option.name] = option
            });
            let key;
            try {
                if (command.lock)
                    key = command.lock(message, convertedOptions);
                if (Util_1.default.isPromise(key))
                    key = await key;
                if (key) {
                    if (command.locker?.has(key)) {
                        key = null;
                        this.emit(Constants_1.CommandHandlerEvents.COMMAND_LOCKED, message, command);
                        return true;
                    }
                    command.locker?.add(key);
                }
            }
            catch (err) {
                this.emitError(err, message, command);
            }
            finally {
                if (key)
                    command.locker?.delete(key);
            }
            if (this.autoDefer || command.slashEphemeral) {
                await interaction.deferReply({ ephemeral: command.slashEphemeral });
            }
            try {
                this.emit(Constants_1.CommandHandlerEvents.SLASH_STARTED, message, command, convertedOptions);
                const ret = Object.getOwnPropertyNames(Object.getPrototypeOf(command)).includes("execSlash") || this.execSlash
                    ? await command.execSlash(message, convertedOptions)
                    : await command.exec(message, convertedOptions);
                this.emit(Constants_1.CommandHandlerEvents.SLASH_FINISHED, message, command, convertedOptions, ret);
                return true;
            }
            catch (err) {
                this.emit(Constants_1.CommandHandlerEvents.SLASH_ERROR, err, message, command);
                return false;
            }
        }
        catch (err) {
            this.emitError(err, message, command);
            return null;
        }
    }
    /**
     * Handles normal commands.
     * @param message - Message to handle.
     * @param content - Content of message without command.
     * @param command - Command instance.
     * @param ignore - Ignore inhibitors and other checks.
     */
    async handleDirectCommand(message, content, command, ignore = false) {
        let key;
        try {
            if (!ignore) {
                if (message.editedTimestamp && !command.editable)
                    return false;
                if (await this.runPostTypeInhibitors(message, command))
                    return false;
            }
            const before = command.before(message);
            if (Util_1.default.isPromise(before))
                await before;
            const args = await command.parse(message, content);
            if (Flag_1.default.is(args, "cancel")) {
                this.emit(Constants_1.CommandHandlerEvents.COMMAND_CANCELLED, message, command);
                return true;
            }
            else if (Flag_1.default.is(args, "retry")) {
                this.emit(Constants_1.CommandHandlerEvents.COMMAND_BREAKOUT, message, command, args.message);
                return this.handle(args.message);
            }
            else if (Flag_1.default.is(args, "continue")) {
                const continueCommand = this.modules.get(args.command);
                return this.handleDirectCommand(message, args.rest, continueCommand, args.ignore);
            }
            if (!ignore) {
                if (command.lock)
                    key = command.lock(message, args);
                if (Util_1.default.isPromise(key))
                    key = await key;
                if (key) {
                    if (command.locker?.has(key)) {
                        key = null;
                        this.emit(Constants_1.CommandHandlerEvents.COMMAND_LOCKED, message, command);
                        return true;
                    }
                    command.locker?.add(key);
                }
            }
            await this.runCommand(message, command, args);
            return true;
        }
        catch (err) {
            this.emitError(err, message, command);
            return null;
        }
        finally {
            if (key)
                command.locker?.delete(key);
        }
    }
    /**
     * Handles regex and conditional commands.
     * @param message - Message to handle.
     */
    async handleRegexAndConditionalCommands(message) {
        const ran1 = await this.handleRegexCommands(message);
        const ran2 = await this.handleConditionalCommands(message);
        return ran1 || ran2;
    }
    /**
     * Handles regex commands.
     * @param message - Message to handle.
     */
    async handleRegexCommands(message) {
        const hasRegexCommands = [];
        for (const command of this.modules.values()) {
            if (message.editedTimestamp ? command.editable : true) {
                const regex = typeof command.regex === "function" ? command.regex(message) : command.regex;
                if (regex)
                    hasRegexCommands.push({ command, regex });
            }
        }
        const matchedCommands = [];
        for (const entry of hasRegexCommands) {
            const match = message.content.match(entry.regex);
            if (!match)
                continue;
            const matches = [];
            if (entry.regex.global) {
                let matched;
                while ((matched = entry.regex.exec(message.content)) != null) {
                    matches.push(matched);
                }
            }
            matchedCommands.push({ command: entry.command, match, matches });
        }
        if (!matchedCommands.length) {
            return false;
        }
        const promises = [];
        for (const { command, match, matches } of matchedCommands) {
            promises.push((async () => {
                try {
                    if (await this.runPostTypeInhibitors(message, command))
                        return;
                    const before = command.before(message);
                    if (Util_1.default.isPromise(before))
                        await before;
                    await this.runCommand(message, command, { match, matches });
                }
                catch (err) {
                    this.emitError(err, message, command);
                }
            })());
        }
        await Promise.all(promises);
        return true;
    }
    /**
     * Handles conditional commands.
     * @param message - Message to handle.
     */
    async handleConditionalCommands(message) {
        const trueCommands = [];
        const filterPromises = [];
        for (const command of this.modules.values()) {
            if (message.editedTimestamp && !command.editable)
                continue;
            filterPromises.push((async () => {
                let cond = command.condition(message);
                if (Util_1.default.isPromise(cond))
                    cond = await cond;
                if (cond)
                    trueCommands.push(command);
            })());
        }
        await Promise.all(filterPromises);
        if (!trueCommands.length) {
            return false;
        }
        const promises = [];
        for (const command of trueCommands) {
            promises.push((async () => {
                try {
                    if (await this.runPostTypeInhibitors(message, command))
                        return;
                    const before = command.before(message);
                    if (Util_1.default.isPromise(before))
                        await before;
                    await this.runCommand(message, command, {});
                }
                catch (err) {
                    this.emitError(err, message, command);
                }
            })());
        }
        await Promise.all(promises);
        return true;
    }
    /**
     * Runs inhibitors with the all type.
     * @param message - Message to handle.
     * @param slash - Whether or not the command should is a slash command.
     */
    async runAllTypeInhibitors(message, slash = false) {
        const reason = this.inhibitorHandler ? await this.inhibitorHandler.test("all", message) : null;
        if (reason != null) {
            this.emit(Constants_1.CommandHandlerEvents.MESSAGE_BLOCKED, message, reason);
        }
        else if (!message.author) {
            this.emit(Constants_1.CommandHandlerEvents.MESSAGE_BLOCKED, message, Constants_1.BuiltInReasons.AUTHOR_NOT_FOUND);
        }
        else if (this.blockClient && message.author.id === this.client.user?.id) {
            this.emit(Constants_1.CommandHandlerEvents.MESSAGE_BLOCKED, message, Constants_1.BuiltInReasons.CLIENT);
        }
        else if (this.blockBots && message.author.bot) {
            this.emit(Constants_1.CommandHandlerEvents.MESSAGE_BLOCKED, message, Constants_1.BuiltInReasons.BOT);
        }
        else if (!slash && this.hasPrompt(message.channel, message.author)) {
            this.emit(Constants_1.CommandHandlerEvents.IN_PROMPT, message);
        }
        else {
            return false;
        }
        return true;
    }
    /**
     * Runs inhibitors with the pre type.
     * @param message - Message to handle.
     */
    async runPreTypeInhibitors(message) {
        const reason = this.inhibitorHandler ? await this.inhibitorHandler.test("pre", message) : null;
        if (reason != null) {
            this.emit(Constants_1.CommandHandlerEvents.MESSAGE_BLOCKED, message, reason);
        }
        else {
            return false;
        }
        return true;
    }
    /**
     * Runs inhibitors with the post type.
     * @param message - Message to handle.
     * @param command - Command to handle.
     * @param slash - Whether or not the command should is a slash command.
     */
    async runPostTypeInhibitors(message, command, slash = false) {
        const event = slash ? Constants_1.CommandHandlerEvents.SLASH_BLOCKED : Constants_1.CommandHandlerEvents.COMMAND_BLOCKED;
        if (!this.skipBuiltInPostInhibitors) {
            if (command.ownerOnly) {
                const isOwner = this.client.isOwner(message.author);
                if (!isOwner) {
                    this.emit(event, message, command, Constants_1.BuiltInReasons.OWNER);
                    return true;
                }
            }
            if (command.superUserOnly) {
                const isSuperUser = this.client.isSuperUser(message.author);
                if (!isSuperUser) {
                    this.emit(event, message, command, Constants_1.BuiltInReasons.SUPER_USER);
                    return true;
                }
            }
            if (command.channel === "guild" && !message.guild) {
                this.emit(event, message, command, Constants_1.BuiltInReasons.GUILD);
                return true;
            }
            if (command.channel === "dm" && message.guild) {
                this.emit(event, message, command, Constants_1.BuiltInReasons.DM);
                return true;
            }
            if (command.onlyNsfw && !message.channel?.["nsfw"]) {
                this.emit(event, message, command, Constants_1.BuiltInReasons.NOT_NSFW);
                return true;
            }
        }
        if (!this.skipBuiltInPostInhibitors) {
            if (await this.runPermissionChecks(message, command, slash)) {
                return true;
            }
        }
        const reason = this.inhibitorHandler ? await this.inhibitorHandler.test("post", message, command) : null;
        if (this.skipBuiltInPostInhibitors) {
            if (await this.runPermissionChecks(message, command, slash)) {
                return true;
            }
        }
        if (reason != null) {
            this.emit(event, message, command, reason);
            return true;
        }
        if (this.runCooldowns(message, command)) {
            return true;
        }
        return false;
    }
    /**
     * Runs permission checks.
     * @param message - Message that called the command.
     * @param command - Command to cooldown.
     * @param slash - Whether or not the command is a slash command.
     */
    async runPermissionChecks(message, command, slash = false) {
        if (command.clientPermissions) {
            if (typeof command.clientPermissions === "function") {
                let missing = command.clientPermissions(message);
                if (Util_1.default.isPromise(missing))
                    missing = await missing;
                if (missing != null) {
                    this.emit(slash ? Constants_1.CommandHandlerEvents.SLASH_MISSING_PERMISSIONS : Constants_1.CommandHandlerEvents.MISSING_PERMISSIONS, message, command, "client", missing);
                    return true;
                }
            }
            else if (message.guild) {
                if (message.channel?.type === "DM")
                    return false;
                const missing = message.channel?.permissionsFor(message.guild.me)?.missing(command.clientPermissions);
                if (missing?.length) {
                    this.emit(slash ? Constants_1.CommandHandlerEvents.SLASH_MISSING_PERMISSIONS : Constants_1.CommandHandlerEvents.MISSING_PERMISSIONS, message, command, "client", missing);
                    return true;
                }
            }
        }
        if (command.userPermissions) {
            const ignorer = command.ignorePermissions || this.ignorePermissions;
            const isIgnored = Array.isArray(ignorer)
                ? ignorer.includes(message.author.id)
                : typeof ignorer === "function"
                    ? ignorer(message, command)
                    : message.author.id === ignorer;
            if (!isIgnored) {
                if (typeof command.userPermissions === "function") {
                    let missing = command.userPermissions(message);
                    if (Util_1.default.isPromise(missing))
                        missing = await missing;
                    if (missing != null) {
                        this.emit(slash ? Constants_1.CommandHandlerEvents.SLASH_MISSING_PERMISSIONS : Constants_1.CommandHandlerEvents.MISSING_PERMISSIONS, message, command, "user", missing);
                        return true;
                    }
                }
                else if (message.guild) {
                    if (message.channel?.type === "DM")
                        return false;
                    const missing = message.channel?.permissionsFor(message.author)?.missing(command.userPermissions);
                    if (missing?.length) {
                        this.emit(slash ? Constants_1.CommandHandlerEvents.SLASH_MISSING_PERMISSIONS : Constants_1.CommandHandlerEvents.MISSING_PERMISSIONS, message, command, "user", missing);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Runs cooldowns and checks if a user is under cooldown.
     * @param message - Message that called the command.
     * @param command - Command to cooldown.
     */
    runCooldowns(message, command) {
        const id = message.author?.id;
        const ignorer = command.ignoreCooldown || this.ignoreCooldown;
        const isIgnored = Array.isArray(ignorer)
            ? ignorer.includes(id)
            : typeof ignorer === "function"
                ? ignorer(message, command)
                : id === ignorer;
        if (isIgnored)
            return false;
        const time = command.cooldown != null ? command.cooldown : this.defaultCooldown;
        if (!time)
            return false;
        const endTime = message.createdTimestamp + time;
        if (!this.cooldowns.has(id))
            this.cooldowns.set(id, {});
        if (!this.cooldowns.get(id)[command.id]) {
            this.cooldowns.get(id)[command.id] = {
                timer: setTimeout(() => {
                    if (this.cooldowns.get(id)[command.id]) {
                        clearTimeout(this.cooldowns.get(id)[command.id].timer);
                    }
                    this.cooldowns.get(id)[command.id] = null;
                    if (!Object.keys(this.cooldowns.get(id)).length) {
                        this.cooldowns.delete(id);
                    }
                }, time).unref(),
                end: endTime,
                uses: 0
            };
        }
        const entry = this.cooldowns.get(id)[command.id];
        if (entry.uses >= command.ratelimit) {
            const end = this.cooldowns.get(id)[command.id].end;
            const diff = end - message.createdTimestamp;
            this.emit(Constants_1.CommandHandlerEvents.COOLDOWN, message, command, diff);
            return true;
        }
        entry.uses++;
        return false;
    }
    /**
     * Runs a command.
     * @param message - Message to handle.
     * @param command - Command to handle.
     * @param args - Arguments to use.
     */
    async runCommand(message, command, args) {
        if (!command || !message) {
            this.emit(Constants_1.CommandHandlerEvents.COMMAND_INVALID, message, command);
            return;
        }
        if (command.typing || this.typing) {
            message.channel.sendTyping();
        }
        this.emit(Constants_1.CommandHandlerEvents.COMMAND_STARTED, message, command, args);
        const ret = await command.exec(message, args);
        this.emit(Constants_1.CommandHandlerEvents.COMMAND_FINISHED, message, command, args, ret);
    }
    /**
     * Parses the command and its argument list.
     * @param message - Message that called the command.
     */
    async parseCommand(message) {
        const allowMention = await Util_1.default.intoCallable(this.prefix)(message);
        let prefixes = Util_1.default.intoArray(allowMention);
        if (allowMention) {
            const mentions = [`<@${this.client.user?.id}>`, `<@!${this.client.user?.id}>`];
            prefixes = [...mentions, ...prefixes];
        }
        prefixes.sort(Util_1.default.prefixCompare);
        return this.parseMultiplePrefixes(message, prefixes.map(p => [p, null]));
    }
    /**
     * Parses the command and its argument list using prefix overwrites.
     * @param message - Message that called the command.
     */
    async parseCommandOverwrittenPrefixes(message) {
        if (!this.prefixes.size) {
            return {};
        }
        const promises = this.prefixes.map(async (cmds, provider) => {
            const prefixes = Util_1.default.intoArray(await Util_1.default.intoCallable(provider)(message));
            return prefixes.map(p => [p, cmds]);
        });
        const pairs = Util_1.default.flatMap(await Promise.all(promises), (x) => x);
        pairs.sort(([a], [b]) => Util_1.default.prefixCompare(a, b));
        return this.parseMultiplePrefixes(message, pairs);
    }
    /**
     * Runs parseWithPrefix on multiple prefixes and returns the best parse.
     * @param message - Message to parse.
     * @param pairs - Pairs of prefix to associated commands. That is, `[string, Set<string> | null][]`.
     */
    parseMultiplePrefixes(message, pairs) {
        const parses = pairs.map(([prefix, cmds]) => this.parseWithPrefix(message, prefix, cmds));
        const result = parses.find(parsed => parsed.command);
        if (result) {
            return result;
        }
        const guess = parses.find(parsed => parsed.prefix != null);
        if (guess) {
            return guess;
        }
        return {};
    }
    /**
     * Tries to parse a message with the given prefix and associated commands.
     * Associated commands refer to when a prefix is used in prefix overrides.
     * @param message - Message to parse.
     * @param prefix - Prefix to use.
     * @param associatedCommands - Associated commands.
     */
    parseWithPrefix(message, prefix, associatedCommands = null) {
        const lowerContent = message.content.toLowerCase();
        if (!lowerContent.startsWith(prefix.toLowerCase())) {
            return {};
        }
        const endOfPrefix = lowerContent.indexOf(prefix.toLowerCase()) + prefix.length;
        const startOfArgs = message.content.slice(endOfPrefix).search(/\S/) + prefix.length;
        const alias = message.content.slice(startOfArgs).split(/\s{1,}|\n{1,}/)[0];
        const command = this.findCommand(alias);
        const content = message.content.slice(startOfArgs + alias.length + 1).trim();
        const afterPrefix = message.content.slice(prefix.length).trim();
        if (!command) {
            return { prefix, alias, content, afterPrefix };
        }
        if (associatedCommands == null) {
            if (command.prefix != null) {
                return { prefix, alias, content, afterPrefix };
            }
        }
        else if (!associatedCommands.has(command.id)) {
            return { prefix, alias, content, afterPrefix };
        }
        return { command, prefix, alias, content, afterPrefix };
    }
    /**
     * Handles errors from the handling.
     * @param err - The error.
     * @param message - Message that called the command.
     * @param command - Command that errored.
     */
    emitError(err, message, command) {
        if (this.listenerCount(Constants_1.CommandHandlerEvents.ERROR)) {
            this.emit(Constants_1.CommandHandlerEvents.ERROR, err, message, command);
            return;
        }
        throw err;
    }
    /**
     * Sweep command util instances from cache and returns amount sweeped.
     * @param lifetime - Messages older than this will have their command util instance sweeped. This is in milliseconds and defaults to the `commandUtilLifetime` option.
     */
    sweepCommandUtil(lifetime = this.commandUtilLifetime) {
        let count = 0;
        for (const commandUtil of this.commandUtils.values()) {
            const now = Date.now();
            const message = commandUtil.message;
            if (now - (message.editedTimestamp || message.createdTimestamp) > lifetime) {
                count++;
                this.commandUtils.delete(message.id);
            }
        }
        return count;
    }
    /**
     * Adds an ongoing prompt in order to prevent command usage in the channel.
     * @param channel - Channel to add to.
     * @param user - User to add.
     */
    addPrompt(channel, user) {
        let users = this.prompts.get(channel.id);
        if (!users)
            this.prompts.set(channel.id, new Set());
        users = this.prompts.get(channel.id);
        users?.add(user.id);
    }
    /**
     * Removes an ongoing prompt.
     * @param channel - Channel to remove from.
     * @param user - User to remove.
     */
    removePrompt(channel, user) {
        const users = this.prompts.get(channel.id);
        if (!users)
            return;
        users.delete(user.id);
        if (!users.size)
            this.prompts.delete(user.id);
    }
    /**
     * Checks if there is an ongoing prompt.
     * @param channel - Channel to check.
     * @param user - User to check.
     */
    hasPrompt(channel, user) {
        const users = this.prompts.get(channel.id);
        if (!users)
            return false;
        return users.has(user.id);
    }
    /**
     * Finds a command by alias.
     * @param name - Alias to find with.
     */
    findCommand(name) {
        return this.modules.get(this.aliases.get(name.toLowerCase()));
    }
    /**
     * Set the inhibitor handler to use.
     * @param inhibitorHandler - The inhibitor handler.
     */
    useInhibitorHandler(inhibitorHandler) {
        this.inhibitorHandler = inhibitorHandler;
        this.resolver.inhibitorHandler = inhibitorHandler;
        return this;
    }
    /**
     * Set the listener handler to use.
     * @param listenerHandler - The listener handler.
     */
    useListenerHandler(listenerHandler) {
        this.resolver.listenerHandler = listenerHandler;
        return this;
    }
    /**
     * Loads a command.
     * @param thing - Module or path to module.
     */
    load(thing) {
        return super.load(thing);
    }
    /**
     * Reads all commands from the directory and loads them.
     * @param directory - Directory to load from. Defaults to the directory passed in the constructor.
     * @param filter - Filter for files, where true means it should be loaded.
     */
    loadAll(directory, filter) {
        return super.loadAll(directory, filter);
    }
    /**
     * Removes a command.
     * @param id - ID of the command.
     */
    remove(id) {
        return super.remove(id);
    }
    /**
     * Removes all commands.
     */
    removeAll() {
        return super.removeAll();
    }
    /**
     * Reloads a command.
     * @param id - ID of the command.
     */
    reload(id) {
        return super.reload(id);
    }
    /**
     * Reloads all commands.
     */
    reloadAll() {
        return super.reloadAll();
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc3RydWN0L2NvbW1hbmRzL0NvbW1hbmRIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkNBYW9CO0FBQ3BCLG9EQUF1QjtBQUV2Qix5RUFBaUQ7QUFDakQsNkVBQXFEO0FBRXJELG9EQUE0RTtBQUM1RSwyREFBbUM7QUFFbkMscUVBQXNGO0FBRXRGLGlIQUF5RjtBQUl6Riw0RUFBb0Q7QUFDcEQsd0RBQWlEO0FBQ2pELGdFQUF3QztBQUN4QyxrREFBMEI7QUFFMUI7Ozs7R0FJRztBQUNILE1BQXFCLGNBQWUsU0FBUSx1QkFBYTtJQUN4RCxZQUNDLE1BQW9CLEVBQ3BCLEVBQ0MsU0FBUyxFQUNULGFBQWEsR0FBRyxpQkFBTyxFQUN2QixVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQzNCLGtCQUFrQixFQUNsQixVQUFVLEVBQ1YsV0FBVyxHQUFHLElBQUksRUFDbEIsU0FBUyxHQUFHLElBQUksRUFDaEIsWUFBWSxHQUFHLEtBQUssRUFDcEIsV0FBVyxHQUFHLEtBQUssRUFDbkIsYUFBYSxHQUFHLEtBQUssRUFDckIsV0FBVyxFQUNYLG1CQUFtQixHQUFHLEdBQUcsRUFDekIsd0JBQXdCLEdBQUcsR0FBRyxFQUM5QixlQUFlLEdBQUcsQ0FBQyxFQUNuQixjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFDL0IsaUJBQWlCLEdBQUcsRUFBRSxFQUN0QixnQkFBZ0IsR0FBRyxFQUFFLEVBQ3JCLE1BQU0sR0FBRyxHQUFHLEVBQ1osWUFBWSxHQUFHLElBQUksRUFDbkIsZ0JBQWdCLEVBQ2hCLFNBQVMsR0FBRyxLQUFLLEVBQ2pCLE1BQU0sR0FBRyxLQUFLLEVBQ2QseUJBQXlCLEdBQUcsS0FBSyxFQUNqQyxTQUFTLEdBQUcsS0FBSyxFQUNqQix5QkFBeUIsR0FBRyxLQUFLLEVBQ2pDLG1CQUFtQixHQUFH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LE1BQU0sQ0FBQyxFQUFVO1FBQ2hDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQVksQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDYSxTQUFTO1FBQ3hCLE9BQU8sS0FBSyxDQUFDLFNBQVMsRUFBb0IsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ2EsTUFBTSxDQUFDLEVBQVU7UUFDaEMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBcUIsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7O09BRUc7SUFDYSxTQUFTO1FBQ3hCLE9BQU8sS0FBSyxDQUFDLFNBQVMsRUFBNkIsQ0FBQztJQUNyRCxDQUFDO0lBRWUsRUFBRSxDQUNqQixLQUFRLEVBQ1IsUUFBcUU7UUFFckUsT0FBTyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ2UsSUFBSSxDQUNuQixLQUFRLEVBQ1IsUUFBcUU7UUFFckUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0Q7QUEzK0NELGlDQTIrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBcHBsaWNhdGlvbkNvbW1hbmQsXG5cdEFwcGxpY2F0aW9uQ29tbWFuZE9wdGlvbkRhdGEsXG5cdEF3YWl0YWJsZSxcblx0Q29sbGVjdGlvbixcblx0Q29tbWFuZEludGVyYWN0aW9uLFxuXHRHdWlsZEFwcGxpY2F0aW9uQ29tbWFuZFBlcm1pc3Npb25EYXRhLFxuXHRHdWlsZFJlc29sdmFibGUsXG5cdE1lc3NhZ2UsXG5cdFNub3dmbGFrZSxcblx0VGV4dEJhc2VkQ2hhbm5lbHMsXG5cdFRleHRDaGFubmVsLFxuXHRVc2VyXG59IGZyb20gXCJkaXNjb3JkLmpzXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBDb21tYW5kSGFuZGxlckV2ZW50cyBhcyBDb21tYW5kSGFuZGxlckV2ZW50c1R5cGUgfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9ldmVudHNcIjtcbmltcG9ydCBBa2Fpcm9FcnJvciBmcm9tIFwiLi4vLi4vdXRpbC9Ba2Fpcm9FcnJvclwiO1xuaW1wb3J0IEFrYWlyb01lc3NhZ2UgZnJvbSBcIi4uLy4uL3V0aWwvQWthaXJvTWVzc2FnZVwiO1xuaW1wb3J0IENhdGVnb3J5IGZyb20gXCIuLi8uLi91dGlsL0NhdGVnb3J5XCI7XG5pbXBvcnQgeyBCdWlsdEluUmVhc29ucywgQ29tbWFuZEhhbmRsZXJFdmVudHMgfSBmcm9tIFwiLi4vLi4vdXRpbC9Db25zdGFudHNcIjtcbmltcG9ydCBVdGlsIGZyb20gXCIuLi8uLi91dGlsL1V0aWxcIjtcbmltcG9ydCBBa2Fpcm9DbGllbnQgZnJvbSBcIi4uL0FrYWlyb0NsaWVudFwiO1xuaW1wb3J0IEFrYWlyb0hhbmRsZXIsIHsgQWthaXJvSGFuZGxlck9wdGlvbnMsIExvYWRQcmVkaWNhdGUgfSBmcm9tIFwiLi4vQWthaXJvSGFuZGxlclwiO1xuaW1wb3J0IEFrYWlyb01vZHVsZSBmcm9tIFwiLi4vQWthaXJvTW9kdWxlXCI7XG5pbXBvcnQgQ29udGV4dE1lbnVDb21tYW5kSGFuZGxlciBmcm9tIFwiLi4vY29udGV4dE1lbnVDb21tYW5kcy9Db250ZXh0TWVudUNvbW1hbmRIYW5kbGVyXCI7XG5pbXBvcnQgSW5oaWJpdG9ySGFuZGxlciBmcm9tIFwiLi4vaW5oaWJpdG9ycy9JbmhpYml0b3JIYW5kbGVyXCI7XG5pbXBvcnQgTGlzdGVuZXJIYW5kbGVyIGZyb20gXCIuLi9saXN0ZW5lcnMvTGlzdGVuZXJIYW5kbGVyXCI7XG5pbXBvcnQgeyBEZWZhdWx0QXJndW1lbnRPcHRpb25zIH0gZnJvbSBcIi4vYXJndW1lbnRzL0FyZ3VtZW50XCI7XG5pbXBvcnQgVHlwZVJlc29sdmVyIGZyb20gXCIuL2FyZ3VtZW50cy9UeXBlUmVzb2x2ZXJcIjtcbmltcG9ydCBDb21tYW5kLCB7IEtleVN1cHBsaWVyIH0gZnJvbSBcIi4vQ29tbWFuZFwiO1xuaW1wb3J0IENvbW1hbmRVdGlsIGZyb20gXCIuL0NvbW1hbmRVdGlsXCI7XG5pbXBvcnQgRmxhZyBmcm9tIFwiLi9GbGFnXCI7XG5cbi8qKlxuICogTG9hZHMgY29tbWFuZHMgYW5kIGhhbmRsZXMgbWVzc2FnZXMuXG4gKiBAcGFyYW0gY2xpZW50IC0gVGhlIEFrYWlybyBjbGllbnQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRIYW5kbGVyIGV4dGVuZHMgQWthaXJvSGFuZGxlciB7XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihcblx0XHRjbGllbnQ6IEFrYWlyb0NsaWVudCxcblx0XHR7XG5cdFx0XHRkaXJlY3RvcnksXG5cdFx0XHRjbGFzc1RvSGFuZGxlID0gQ29tbWFuZCxcblx0XHRcdGV4dGVuc2lvbnMgPSBbXCIuanNcIiwgXCIudHNcIl0sXG5cdFx0XHRhdXRvbWF0ZUNhdGVnb3JpZXMsXG5cdFx0XHRsb2FkRmlsdGVyLFxuXHRcdFx0YmxvY2tDbGllbnQgPSB0cnVlLFxuXHRcdFx0YmxvY2tCb3RzID0gdHJ1ZSxcblx0XHRcdGZldGNoTWVtYmVycyA9IGZhbHNlLFxuXHRcdFx0aGFuZGxlRWRpdHMgPSBmYWxzZSxcblx0XHRcdHN0b3JlTWVzc2FnZXMgPSBmYWxzZSxcblx0XHRcdGNvbW1hbmRVdGlsLFxuXHRcdFx0Y29tbWFuZFV0aWxMaWZldGltZSA9IDNlNSxcblx0XHRcdGNvbW1hbmRVdGlsU3dlZXBJbnRlcnZhbCA9IDNlNSxcblx0XHRcdGRlZmF1bHRDb29sZG93biA9IDAsXG5cdFx0XHRpZ25vcmVDb29sZG93biA9IGNsaWVudC5vd25lcklELFxuXHRcdFx0aWdub3JlUGVybWlzc2lvbnMgPSBbXSxcblx0XHRcdGFyZ3VtZW50RGVmYXVsdHMgPSB7fSxcblx0XHRcdHByZWZpeCA9IFwiIVwiLFxuXHRcdFx0YWxsb3dNZW50aW9uID0gdHJ1ZSxcblx0XHRcdGFsaWFzUmVwbGFjZW1lbnQsXG5cdFx0XHRhdXRvRGVmZXIgPSBmYWxzZSxcblx0XHRcdHR5cGluZyA9IGZhbHNlLFxuXHRcdFx0YXV0b1JlZ2lzdGVyU2xhc2hDb21tYW5kcyA9IGZhbHNlLFxuXHRcdFx0ZXhlY1NsYXNoID0gZmFsc2UsXG5cdFx0XHRza2lwQnVpbHRJblBvc3RJbmhpYml0b3JzID0gZmFsc2UsXG5cdFx0XHR1c2VTbGFzaFBlcm1pc3Npb25zID0gZmFsc2Vcblx0XHR9OiBDb21tYW5kSGFuZGxlck9wdGlvbnMgPSB7fVxuXHQpIHtcblx0XHRpZiAoIShjbGFzc1RvSGFuZGxlLnByb3RvdHlwZSBpbnN0YW5jZW9mIENvbW1hbmQgfHwgY2xhc3NUb0hhbmRsZSA9PT0gQ29tbWFuZCkpIHtcblx0XHRcdHRocm93IG5ldyBBa2Fpcm9FcnJvcihcIklOVkFMSURfQ0xBU1NfVE9fSEFORExFXCIsIGNsYXNzVG9IYW5kbGUubmFtZSwgQ29tbWFuZC5uYW1lKTtcblx0XHR9XG5cblx0XHRzdXBlcihjbGllbnQsIHtcblx0XHRcdGRpcmVjdG9yeSxcblx0XHRcdGNsYXNzVG9IYW5kbGUsXG5cdFx0XHRleHRlbnNpb25zLFxuXHRcdFx0YXV0b21hdGVDYXRlZ29yaWVzLFxuXHRcdFx0bG9hZEZpbHRlclxuXHRcdH0pO1xuXG5cdFx0dGhpcy5hdXRvUmVnaXN0ZXJTbGFzaENvbW1hbmRzID0gYXV0b1JlZ2lzdGVyU2xhc2hDb21tYW5kcztcblx0XHR0aGlzLnR5cGluZyA9IHR5cGluZztcblx0XHR0aGlzLmF1dG9EZWZlciA9IGF1dG9EZWZlcjtcblx0XHR0aGlzLnJlc29sdmVyID0gbmV3IFR5cGVSZXNvbHZlcih0aGlzKTtcblx0XHR0aGlzLmFsaWFzZXMgPSBuZXcgQ29sbGVjdGlvbigpO1xuXHRcdHRoaXMuYWxpYXNSZXBsYWNlbWVudCA9IGFsaWFzUmVwbGFjZW1lbnQ7XG5cdFx0dGhpcy5wcmVmaXhlcyA9IG5ldyBDb2xsZWN0aW9uKCk7XG5cdFx0dGhpcy5ibG9ja0NsaWVudCA9IEJvb2xlYW4oYmxvY2tDbGllbnQpO1xuXHRcdHRoaXMuYmxvY2tCb3RzID0gQm9vbGVhbihibG9ja0JvdHMpO1xuXHRcdHRoaXMuZmV0Y2hNZW1iZXJzID0gQm9vbGVhbihmZXRjaE1lbWJlcnMpO1xuXHRcdHRoaXMuaGFuZGxlRWRpdHMgPSBCb29sZWFuKGhhbmRsZUVkaXRzKTtcblx0XHR0aGlzLnN0b3JlTWVzc2FnZXMgPSBCb29sZWFuKHN0b3JlTWVzc2FnZXMpO1xuXHRcdHRoaXMuY29tbWFuZFV0aWwgPSBCb29sZWFuKGNvbW1hbmRVdGlsKTtcblx0XHRpZiAoKHRoaXMuaGFuZGxlRWRpdHMgfHwgdGhpcy5zdG9yZU1lc3NhZ2VzKSAmJiAhdGhpcy5jb21tYW5kVXRpbCkgdGhyb3cgbmV3IEFrYWlyb0Vycm9yKFwiQ09NTUFORF9VVElMX0VYUExJQ0lUXCIpO1xuXHRcdHRoaXMuY29tbWFuZFV0aWxMaWZldGltZSA9IGNvbW1hbmRVdGlsTGlmZXRpbWU7XG5cdFx0dGhpcy5jb21tYW5kVXRpbFN3ZWVwSW50ZXJ2YWwgPSBjb21tYW5kVXRpbFN3ZWVwSW50ZXJ2YWw7XG5cdFx0aWYgKHRoaXMuY29tbWFuZFV0aWxTd2VlcEludGVydmFsID4gMClcblx0XHRcdHNldEludGVydmFsKCgpID0+IHRoaXMuc3dlZXBDb21tYW5kVXRpbCgpLCB0aGlzLmNvbW1hbmRVdGlsU3dlZXBJbnRlcnZhbCkudW5yZWYoKTtcblx0XHR0aGlzLmNvbW1hbmRVdGlscyA9IG5ldyBDb2xsZWN0aW9uKCk7XG5cdFx0dGhpcy5jb29sZG93bnMgPSBuZXcgQ29sbGVjdGlvbigpO1xuXHRcdHRoaXMuZGVmYXVsdENvb2xkb3duID0gZGVmYXVsdENvb2xkb3duO1xuXHRcdHRoaXMuaWdub3JlQ29vbGRvd24gPSB0eXBlb2YgaWdub3JlQ29vbGRvd24gPT09IFwiZnVuY3Rpb25cIiA/IGlnbm9yZUNvb2xkb3duLmJpbmQodGhpcykgOiBpZ25vcmVDb29sZG93bjtcblx0XHR0aGlzLmlnbm9yZVBlcm1pc3Npb25zID0gdHlwZW9mIGlnbm9yZVBlcm1pc3Npb25zID09PSBcImZ1bmN0aW9uXCIgPyBpZ25vcmVQZXJtaXNzaW9ucy5iaW5kKHRoaXMpIDogaWdub3JlUGVybWlzc2lvbnM7XG5cdFx0dGhpcy5wcm9tcHRzID0gbmV3IENvbGxlY3Rpb24oKTtcblx0XHR0aGlzLmFyZ3VtZW50RGVmYXVsdHMgPSBVdGlsLmRlZXBBc3NpZ24oXG5cdFx0XHR7XG5cdFx0XHRcdHByb21wdDoge1xuXHRcdFx0XHRcdHN0YXJ0OiBcIlwiLFxuXHRcdFx0XHRcdHJldHJ5OiBcIlwiLFxuXHRcdFx0XHRcdHRpbWVvdXQ6IFwiXCIsXG5cdFx0XHRcdFx0ZW5kZWQ6IFwiXCIsXG5cdFx0XHRcdFx0Y2FuY2VsOiBcIlwiLFxuXHRcdFx0XHRcdHJldHJpZXM6IDEsXG5cdFx0XHRcdFx0dGltZTogMzAwMDAsXG5cdFx0XHRcdFx0Y2FuY2VsV29yZDogXCJjYW5jZWxcIixcblx0XHRcdFx0XHRzdG9wV29yZDogXCJzdG9wXCIsXG5cdFx0XHRcdFx0b3B0aW9uYWw6IGZhbHNlLFxuXHRcdFx0XHRcdGluZmluaXRlOiBmYWxzZSxcblx0XHRcdFx0XHRsaW1pdDogSW5maW5pdHksXG5cdFx0XHRcdFx0YnJlYWtvdXQ6IHRydWVcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGFyZ3VtZW50RGVmYXVsdHNcblx0XHQpO1xuXHRcdHRoaXMucHJlZml4ID0gdHlwZW9mIHByZWZpeCA9PT0gXCJmdW5jdGlvblwiID8gcHJlZml4LmJpbmQodGhpcykgOiBwcmVmaXg7XG5cdFx0dGhpcy5hbGxvd01lbnRpb24gPSB0eXBlb2YgYWxsb3dNZW50aW9uID09PSBcImZ1bmN0aW9uXCIgPyBhbGxvd01lbnRpb24uYmluZCh0aGlzKSA6IEJvb2xlYW4oYWxsb3dNZW50aW9uKTtcblx0XHR0aGlzLmluaGliaXRvckhhbmRsZXIgPSBudWxsO1xuXHRcdHRoaXMuYXV0b0RlZmVyID0gQm9vbGVhbihhdXRvRGVmZXIpO1xuXHRcdHRoaXMuZXhlY1NsYXNoID0gQm9vbGVhbihleGVjU2xhc2gpO1xuXHRcdHRoaXMuc2tpcEJ1aWx0SW5Qb3N0SW5oaWJpdG9ycyA9IEJvb2xlYW4oc2tpcEJ1aWx0SW5Qb3N0SW5oaWJpdG9ycyk7XG5cdFx0dGhpcy51c2VTbGFzaFBlcm1pc3Npb25zID0gQm9vbGVhbih1c2VTbGFzaFBlcm1pc3Npb25zKTtcblx0XHR0aGlzLnNldHVwKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29sbGVjdGlvbiBvZiBjb21tYW5kIGFsaWFzZXMuXG5cdCAqL1xuXHRwdWJsaWMgYWxpYXNlczogQ29sbGVjdGlvbjxzdHJpbmcsIHN0cmluZz47XG5cblx0LyoqXG5cdCAqIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byBhdXRvbWF0aWNhbGx5IG1ha2UgY29tbWFuZCBhbGlhc2VzIGZvci5cblx0ICovXG5cdHB1YmxpYyBhbGlhc1JlcGxhY2VtZW50PzogUmVnRXhwO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCBtZW50aW9ucyBhcmUgYWxsb3dlZCBmb3IgcHJlZml4aW5nLlxuXHQgKi9cblx0cHVibGljIGFsbG93TWVudGlvbjogYm9vbGVhbiB8IE1lbnRpb25QcmVmaXhQcmVkaWNhdGU7XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgYXJndW1lbnQgb3B0aW9ucy5cblx0ICovXG5cdHB1YmxpYyBhcmd1bWVudERlZmF1bHRzOiBEZWZhdWx0QXJndW1lbnRPcHRpb25zO1xuXG5cdC8qKlxuXHQgKiBBdXRvbWF0aWNhbGx5IGRlZmVyIG1lc3NhZ2VzIFwiQm90TmFtZSBpcyB0aGlua2luZ1wiLlxuXHQgKi9cblx0cHVibGljIGF1dG9EZWZlcjogYm9vbGVhbjtcblxuXHQvKipcblx0ICogU3BlY2lmeSB3aGV0aGVyIHRvIHJlZ2lzdGVyIGFsbCBzbGFzaCBjb21tYW5kcyB3aGVuIHN0YXJ0aW5nIHRoZSBjbGllbnRcblx0ICovXG5cdHB1YmxpYyBhdXRvUmVnaXN0ZXJTbGFzaENvbW1hbmRzOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byBibG9jayBib3RzLlxuXHQgKi9cblx0cHVibGljIGJsb2NrQm90czogYm9vbGVhbjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gYmxvY2sgc2VsZi5cblx0ICovXG5cdHB1YmxpYyBibG9ja0NsaWVudDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQ2F0ZWdvcmllcywgbWFwcGVkIGJ5IElEIHRvIENhdGVnb3J5LlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgY2F0ZWdvcmllczogQ29sbGVjdGlvbjxzdHJpbmcsIENhdGVnb3J5PHN0cmluZywgQ29tbWFuZD4+O1xuXG5cdC8qKlxuXHQgKiBDbGFzcyB0byBoYW5kbGVcblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNsYXNzVG9IYW5kbGU6IHR5cGVvZiBDb21tYW5kO1xuXG5cdC8qKlxuXHQgKiBUaGUgQWthaXJvIGNsaWVudC5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNsaWVudDogQWthaXJvQ2xpZW50O1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCBgbWVzc2FnZS51dGlsYCBpcyBhc3NpZ25lZC5cblx0ICovXG5cdHB1YmxpYyBjb21tYW5kVXRpbDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogTWlsbGlzZWNvbmRzIGEgbWVzc2FnZSBzaG91bGQgZXhpc3QgZm9yIGJlZm9yZSBpdHMgY29tbWFuZCB1dGlsIGluc3RhbmNlIGlzIG1hcmtlZCBmb3IgcmVtb3ZhbC5cblx0ICovXG5cdHB1YmxpYyBjb21tYW5kVXRpbExpZmV0aW1lOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIENvbGxlY3Rpb24gb2YgQ29tbWFuZFV0aWxzLlxuXHQgKi9cblx0cHVibGljIGNvbW1hbmRVdGlsczogQ29sbGVjdGlvbjxzdHJpbmcsIENvbW1hbmRVdGlsPjtcblxuXHQvKipcblx0ICogVGltZSBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMgZm9yIHN3ZWVwaW5nIGNvbW1hbmQgdXRpbCBpbnN0YW5jZXMuXG5cdCAqL1xuXHRwdWJsaWMgY29tbWFuZFV0aWxTd2VlcEludGVydmFsOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIENvbGxlY3Rpb24gb2YgY29vbGRvd25zLlxuXHQgKiA8aW5mbz5UaGUgZWxlbWVudHMgaW4gdGhlIGNvbGxlY3Rpb24gYXJlIG9iamVjdHMgd2l0aCB1c2VyIElEcyBhcyBrZXlzXG5cdCAqIGFuZCB7QGxpbmsgQ29vbGRvd25EYXRhfSBvYmplY3RzIGFzIHZhbHVlczwvaW5mbz5cblx0ICovXG5cdHB1YmxpYyBjb29sZG93bnM6IENvbGxlY3Rpb248c3RyaW5nLCB7IFtpZDogc3RyaW5nXTogQ29vbGRvd25EYXRhIH0+O1xuXG5cdC8qKlxuXHQgKiBEZWZhdWx0IGNvb2xkb3duIGZvciBjb21tYW5kcy5cblx0ICovXG5cdHB1YmxpYyBkZWZhdWx0Q29vbGRvd246IG51bWJlcjtcblxuXHQvKipcblx0ICogRGlyZWN0b3J5IHRvIGNvbW1hbmRzLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgZGlyZWN0b3J5OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIHVzZSBleGVjU2xhc2ggZm9yIHNsYXNoIGNvbW1hbmRzLlxuXHQgKi9cblx0cHVibGljIGV4ZWNTbGFzaDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgbWVtYmVycyBhcmUgZmV0Y2hlZCBvbiBlYWNoIG1lc3NhZ2UgYXV0aG9yIGZyb20gYSBndWlsZC5cblx0ICovXG5cdHB1YmxpYyBmZXRjaE1lbWJlcnM6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IGVkaXRzIGFyZSBoYW5kbGVkLlxuXHQgKi9cblx0cHVibGljIGhhbmRsZUVkaXRzOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBJRCBvZiB1c2VyKHMpIHRvIGlnbm9yZSBjb29sZG93biBvciBhIGZ1bmN0aW9uIHRvIGlnbm9yZS5cblx0ICovXG5cdHB1YmxpYyBpZ25vcmVDb29sZG93bjogU25vd2ZsYWtlIHwgU25vd2ZsYWtlW10gfCBJZ25vcmVDaGVja1ByZWRpY2F0ZTtcblxuXHQvKipcblx0ICogSUQgb2YgdXNlcihzKSB0byBpZ25vcmUgYHVzZXJQZXJtaXNzaW9uc2AgY2hlY2tzIG9yIGEgZnVuY3Rpb24gdG8gaWdub3JlLlxuXHQgKi9cblx0cHVibGljIGlnbm9yZVBlcm1pc3Npb25zOiBTbm93Zmxha2UgfCBTbm93Zmxha2VbXSB8IElnbm9yZUNoZWNrUHJlZGljYXRlO1xuXG5cdC8qKlxuXHQgKiBJbmhpYml0b3IgaGFuZGxlciB0byB1c2UuXG5cdCAqL1xuXHRwdWJsaWMgaW5oaWJpdG9ySGFuZGxlcjogSW5oaWJpdG9ySGFuZGxlciB8IG51bGw7XG5cblx0LyoqXG5cdCAqIENvbW1hbmRzIGxvYWRlZCwgbWFwcGVkIGJ5IElEIHRvIENvbW1hbmQuXG5cdCAqL1xuXHRwdWJsaWMgZGVjbGFyZSBtb2R1bGVzOiBDb2xsZWN0aW9uPHN0cmluZywgQ29tbWFuZD47XG5cblx0LyoqXG5cdCAqIFRoZSBwcmVmaXgoZXMpIGZvciBjb21tYW5kIHBhcnNpbmcuXG5cdCAqL1xuXHRwdWJsaWMgcHJlZml4OiBzdHJpbmcgfCBzdHJpbmdbXSB8IFByZWZpeFN1cHBsaWVyO1xuXG5cdC8qKlxuXHQgKiBDb2xsZWN0aW9uIG9mIHByZWZpeCBvdmVyd3JpdGVzIHRvIGNvbW1hbmRzLlxuXHQgKi9cblx0cHVibGljIHByZWZpeGVzOiBDb2xsZWN0aW9uPHN0cmluZyB8IFByZWZpeFN1cHBsaWVyLCBTZXQ8c3RyaW5nPj47XG5cblx0LyoqXG5cdCAqIENvbGxlY3Rpb24gb2Ygc2V0cyBvZiBvbmdvaW5nIGFyZ3VtZW50IHByb21wdHMuXG5cdCAqL1xuXHRwdWJsaWMgcHJvbXB0czogQ29sbGVjdGlvbjxzdHJpbmcsIFNldDxzdHJpbmc+PjtcblxuXHQvKipcblx0ICogVGhlIHR5cGUgcmVzb2x2ZXIuXG5cdCAqL1xuXHRwdWJsaWMgcmVzb2x2ZXI6IFR5cGVSZXNvbHZlcjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gc3RvcmUgbWVzc2FnZXMgaW4gQ29tbWFuZFV0aWwuXG5cdCAqL1xuXHRwdWJsaWMgc3RvcmVNZXNzYWdlczogYm9vbGVhbjtcblxuXHQvKipcblx0ICogU2hvdyBcIkJvdE5hbWUgaXMgdHlwaW5nXCIgaW5mb3JtYXRpb24gbWVzc2FnZSBvbiB0aGUgdGV4dCBjaGFubmVscyB3aGVuIGEgY29tbWFuZCBpcyBydW5uaW5nLlxuXHQgKi9cblx0cHVibGljIHR5cGluZzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gc2tpcCBidWlsdCBpbiByZWFzb25zIHBvc3QgdHlwZSBpbmhpYml0b3JzIHNvIHlvdSBjYW4gbWFrZSBjdXN0b20gb25lcy5cblx0ICovXG5cdHB1YmxpYyBza2lwQnVpbHRJblBvc3RJbmhpYml0b3JzOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBVc2Ugc2xhc2ggY29tbWFuZCBwZXJtaXNzaW9ucyBmb3Igb3duZXIgb25seSBjb21tYW5kc1xuXHQgKiBXYXJuaW5nOiB0aGlzIGlzIGV4cGVyaW1lbnRhbFxuXHQgKi9cblx0cHVibGljIHVzZVNsYXNoUGVybWlzc2lvbnM6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFNldCB1cCB0aGUgY29tbWFuZCBoYW5kbGVyXG5cdCAqL1xuXHRwcm90ZWN0ZWQgc2V0dXAoKSB7XG5cdFx0dGhpcy5jbGllbnQub25jZShcInJlYWR5XCIsICgpID0+IHtcblx0XHRcdGlmICh0aGlzLmF1dG9SZWdpc3RlclNsYXNoQ29tbWFuZHMpXG5cdFx0XHRcdHRoaXMucmVnaXN0ZXJJbnRlcmFjdGlvbkNvbW1hbmRzKCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMudXNlU2xhc2hQZXJtaXNzaW9ucylcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlSW50ZXJhY3Rpb25QZXJtaXNzaW9ucyh0aGlzLmNsaWVudC5vd25lcklEIC8qICB0aGlzLmNsaWVudC5zdXBlclVzZXJJRCAqLyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLmNsaWVudC5vbihcIm1lc3NhZ2VDcmVhdGVcIiwgYXN5bmMgbSA9PiB7XG5cdFx0XHRcdGlmIChtLnBhcnRpYWwpIGF3YWl0IG0uZmV0Y2goKTtcblxuXHRcdFx0XHR0aGlzLmhhbmRsZShtKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAodGhpcy5oYW5kbGVFZGl0cykge1xuXHRcdFx0XHR0aGlzLmNsaWVudC5vbihcIm1lc3NhZ2VVcGRhdGVcIiwgYXN5bmMgKG8sIG0pID0+IHtcblx0XHRcdFx0XHRpZiAoby5wYXJ0aWFsKSBhd2FpdCBvLmZldGNoKCk7XG5cdFx0XHRcdFx0aWYgKG0ucGFydGlhbCkgYXdhaXQgbS5mZXRjaCgpO1xuXHRcdFx0XHRcdGlmIChvLmNvbnRlbnQgPT09IG0uY29udGVudCkgcmV0dXJuO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuaGFuZGxlRWRpdHMpIHRoaXMuaGFuZGxlKG0gYXMgTWVzc2FnZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5jbGllbnQub24oXCJpbnRlcmFjdGlvbkNyZWF0ZVwiLCBpID0+IHtcblx0XHRcdFx0aWYgKCFpLmlzQ29tbWFuZCgpKSByZXR1cm47XG5cdFx0XHRcdHRoaXMuaGFuZGxlU2xhc2goaSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgaW50ZXJhY3Rpb24gY29tbWFuZHMuXG5cdCAqL1xuXHRwcm90ZWN0ZWQgYXN5bmMgcmVnaXN0ZXJJbnRlcmFjdGlvbkNvbW1hbmRzKCkge1xuXHRcdGNvbnN0IHBhcnNlZFNsYXNoQ29tbWFuZHM6IHtcblx0XHRcdG5hbWU6IHN0cmluZztcblx0XHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXHRcdFx0b3B0aW9ucz86IEFwcGxpY2F0aW9uQ29tbWFuZE9wdGlvbkRhdGFbXTtcblx0XHRcdGd1aWxkczogU25vd2ZsYWtlW107XG5cdFx0XHRkZWZhdWx0UGVybWlzc2lvbjogYm9vbGVhbjtcblx0XHRcdHR5cGU6IFwiQ0hBVF9JTlBVVFwiIHwgXCJNRVNTQUdFXCIgfCBcIlVTRVJcIjtcblx0XHR9W10gPSBbXTtcblx0XHRjb25zdCBndWlsZFNsYXNoQ29tbWFuZHNQYXJzZWQ6IENvbGxlY3Rpb248XG5cdFx0XHRTbm93Zmxha2UsXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6IHN0cmluZztcblx0XHRcdFx0ZGVzY3JpcHRpb246IHN0cmluZztcblx0XHRcdFx0b3B0aW9uczogQXBwbGljYXRpb25Db21tYW5kT3B0aW9uRGF0YVtdO1xuXHRcdFx0XHRkZWZhdWx0UGVybWlzc2lvbjogYm9vbGVhbjtcblx0XHRcdFx0dHlwZTogXCJDSEFUX0lOUFVUXCIgfCBcIk1FU1NBR0VcIiB8IFwiVVNFUlwiO1xuXHRcdFx0fVtdXG5cdFx0PiA9IG5ldyBDb2xsZWN0aW9uKCk7XG5cdFx0Y29uc3QgcGFyc2VEZXNjcmlwdGlvbkNvbW1hbmQgPSAoZGVzY3JpcHRpb246IHsgY29udGVudDogKCkgPT4gYW55IH0pID0+IHtcblx0XHRcdGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBkZXNjcmlwdGlvbi5jb250ZW50ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBkZXNjcmlwdGlvbi5jb250ZW50KCk7XG5cdFx0XHRcdGlmICh0eXBlb2YgZGVzY3JpcHRpb24uY29udGVudCA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIGRlc2NyaXB0aW9uLmNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZGVzY3JpcHRpb247XG5cdFx0fTtcblxuXHRcdGZvciAoY29uc3QgWywgZGF0YV0gb2YgdGhpcy5tb2R1bGVzKSB7XG5cdFx0XHRpZiAoIWRhdGEuc2xhc2gpIGNvbnRpbnVlO1xuXHRcdFx0cGFyc2VkU2xhc2hDb21tYW5kcy5wdXNoKHtcblx0XHRcdFx0bmFtZTogZGF0YS5hbGlhc2VzWzBdPy50b0xvd2VyQ2FzZSgpIHx8IGRhdGEuaWQ/LnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBwYXJzZURlc2NyaXB0aW9uQ29tbWFuZChkYXRhLmRlc2NyaXB0aW9uKSB8fCBcIk5vIGRlc2NyaXB0aW9uIHByb3ZpZGVkLlwiLFxuXHRcdFx0XHRvcHRpb25zOiBkYXRhLnNsYXNoT3B0aW9ucyxcblx0XHRcdFx0Z3VpbGRzOiBkYXRhLnNsYXNoR3VpbGRzID8/IFtdLFxuXHRcdFx0XHRkZWZhdWx0UGVybWlzc2lvbjogIShkYXRhLm93bmVyT25seSB8fCAvKiBkYXRhLnN1cGVyVXNlck9ubHkgfHwgKi8gZmFsc2UpLFxuXHRcdFx0XHR0eXBlOiBcIkNIQVRfSU5QVVRcIlxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0bGV0IGNvbnRleHRDb21tYW5kSGFuZGxlcjogQ29udGV4dE1lbnVDb21tYW5kSGFuZGxlciB8IHVuZGVmaW5lZDtcblx0XHRmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmNsaWVudCkge1xuXHRcdFx0aWYgKHRoaXMuY2xpZW50W2tleSBhcyBrZXlvZiBBa2Fpcm9DbGllbnRdIGluc3RhbmNlb2YgQ29udGV4dE1lbnVDb21tYW5kSGFuZGxlcikge1xuXHRcdFx0XHRjb250ZXh0Q29tbWFuZEhhbmRsZXIgPSB0aGlzLmNsaWVudFtrZXkgYXMga2V5b2YgQWthaXJvQ2xpZW50XSBhcyB1bmtub3duIGFzXG5cdFx0XHRcdFx0fCBDb250ZXh0TWVudUNvbW1hbmRIYW5kbGVyXG5cdFx0XHRcdFx0fCB1bmRlZmluZWQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoY29udGV4dENvbW1hbmRIYW5kbGVyKSB7XG5cdFx0XHRmb3IgKGNvbnN0IFssIGRhdGFdIG9mIGNvbnRleHRDb21tYW5kSGFuZGxlci5tb2R1bGVzKSB7XG5cdFx0XHRcdHBhcnNlZFNsYXNoQ29tbWFuZHMucHVzaCh7XG5cdFx0XHRcdFx0bmFtZTogZGF0YS5uYW1lLFxuXHRcdFx0XHRcdGd1aWxkczogZGF0YS5ndWlsZHMgPz8gW10sXG5cdFx0XHRcdFx0ZGVmYXVsdFBlcm1pc3Npb246IHRoaXMudXNlU2xhc2hQZXJtaXNzaW9ucyA/ICEoZGF0YS5vd25lck9ubHkgfHwgLyogZGF0YS5zdXBlclVzZXJPbmx5IHx8ICovIGZhbHNlKSA6IHRydWUsXG5cdFx0XHRcdFx0dHlwZTogZGF0YS50eXBlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qIEdsb2JhbCAqL1xuXHRcdGNvbnN0IHNsYXNoQ29tbWFuZHNBcHAgPSBwYXJzZWRTbGFzaENvbW1hbmRzXG5cdFx0XHQuZmlsdGVyKCh7IGd1aWxkcyB9KSA9PiAhZ3VpbGRzLmxlbmd0aClcblx0XHRcdC5tYXAoKHsgbmFtZSwgZGVzY3JpcHRpb24sIG9wdGlvbnMsIGRlZmF1bHRQZXJtaXNzaW9uLCB0eXBlIH0pID0+IHtcblx0XHRcdFx0cmV0dXJuIHsgbmFtZSwgZGVzY3JpcHRpb24sIG9wdGlvbnMsIGRlZmF1bHRQZXJtaXNzaW9uLCB0eXBlIH07XG5cdFx0XHR9KTtcblx0XHRjb25zdCBjdXJyZW50R2xvYmFsQ29tbWFuZHMgPSAoYXdhaXQgdGhpcy5jbGllbnQuYXBwbGljYXRpb24/LmNvbW1hbmRzLmZldGNoKCkpIS5tYXAodmFsdWUxID0+ICh7XG5cdFx0XHRuYW1lOiB2YWx1ZTEubmFtZSxcblx0XHRcdGRlc2NyaXB0aW9uOiB2YWx1ZTEuZGVzY3JpcHRpb24sXG5cdFx0XHRvcHRpb25zOiB2YWx1ZTEub3B0aW9ucyxcblx0XHRcdGRlZmF1bHRQZXJtaXNzaW9uOiB2YWx1ZTEuZGVmYXVsdFBlcm1pc3Npb24sXG5cdFx0XHR0eXBlOiB2YWx1ZTEudHlwZVxuXHRcdH0pKTtcblxuXHRcdGlmICghXy5pc0VxdWFsKGN1cnJlbnRHbG9iYWxDb21tYW5kcywgc2xhc2hDb21tYW5kc0FwcCkpIHtcblx0XHRcdGF3YWl0IHRoaXMuY2xpZW50LmFwcGxpY2F0aW9uPy5jb21tYW5kcy5zZXQoXG5cdFx0XHRcdHNsYXNoQ29tbWFuZHNBcHAgYXMge1xuXHRcdFx0XHRcdG5hbWU6IHN0cmluZztcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogc3RyaW5nO1xuXHRcdFx0XHRcdG9wdGlvbnM6IEFwcGxpY2F0aW9uQ29tbWFuZE9wdGlvbkRhdGFbXSB8IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRkZWZhdWx0UGVybWlzc2lvbjogYm9vbGVhbjtcblx0XHRcdFx0XHR0eXBlOiBcIkNIQVRfSU5QVVRcIiB8IFwiTUVTU0FHRVwiIHwgXCJVU0VSXCI7XG5cdFx0XHRcdH1bXVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvKiBHdWlsZHMgKi9cblx0XHRmb3IgKGNvbnN0IHsgbmFtZSwgZGVzY3JpcHRpb24sIG9wdGlvbnMsIGd1aWxkcywgZGVmYXVsdFBlcm1pc3Npb24sIHR5cGUgfSBvZiBwYXJzZWRTbGFzaENvbW1hbmRzKSB7XG5cdFx0XHRmb3IgKGNvbnN0IGd1aWxkSWQgb2YgZ3VpbGRzKSB7XG5cdFx0XHRcdGd1aWxkU2xhc2hDb21tYW5kc1BhcnNlZC5zZXQoZ3VpbGRJZCwgW1xuXHRcdFx0XHRcdC4uLihndWlsZFNsYXNoQ29tbWFuZHNQYXJzZWQuZ2V0KGd1aWxkSWQpID8/IFtdKSxcblx0XHRcdFx0XHR7IG5hbWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiEsIG9wdGlvbnM6IG9wdGlvbnMhLCBkZWZhdWx0UGVybWlzc2lvbiwgdHlwZSB9XG5cdFx0XHRcdF0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoZ3VpbGRTbGFzaENvbW1hbmRzUGFyc2VkLnNpemUpIHtcblx0XHRcdGd1aWxkU2xhc2hDb21tYW5kc1BhcnNlZC5lYWNoKGFzeW5jICh2YWx1ZSwga2V5KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGd1aWxkID0gdGhpcy5jbGllbnQuZ3VpbGRzLmNhY2hlLmdldChrZXkpO1xuXHRcdFx0XHRpZiAoIWd1aWxkKSByZXR1cm47XG5cblx0XHRcdFx0Y29uc3QgY3VycmVudEd1aWxkQ29tbWFuZHMgPSAoYXdhaXQgZ3VpbGQuY29tbWFuZHMuZmV0Y2goKSkubWFwKHZhbHVlMSA9PiAoe1xuXHRcdFx0XHRcdG5hbWU6IHZhbHVlMS5uYW1lLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiB2YWx1ZTEuZGVzY3JpcHRpb24sXG5cdFx0XHRcdFx0b3B0aW9uczogdmFsdWUxLm9wdGlvbnMsXG5cdFx0XHRcdFx0ZGVmYXVsdFBlcm1pc3Npb246IHZhbHVlMS5kZWZhdWx0UGVybWlzc2lvbixcblx0XHRcdFx0XHR0eXBlOiB2YWx1ZTEudHlwZVxuXHRcdFx0XHR9KSk7XG5cblx0XHRcdFx0aWYgKCFfLmlzRXF1YWwoY3VycmVudEd1aWxkQ29tbWFuZHMsIHZhbHVlKSkge1xuXHRcdFx0XHRcdGF3YWl0IGd1aWxkLmNvbW1hbmRzLnNldCh2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiB1cGRhdGVzIGludGVyYWN0aW9uIHBlcm1pc3Npb25zXG5cdCAqL1xuXHRwcm90ZWN0ZWQgYXN5bmMgdXBkYXRlSW50ZXJhY3Rpb25QZXJtaXNzaW9ucyhcblx0XHRvd25lcnM6IFNub3dmbGFrZSB8IFNub3dmbGFrZVtdIC8qIHN1cGVyVXNlcnM6IFNub3dmbGFrZSB8IFNub3dmbGFrZVtdICovXG5cdCkge1xuXHRcdGNvbnN0IG1hcENvbSA9IChcblx0XHRcdHZhbHVlOiBBcHBsaWNhdGlvbkNvbW1hbmQ8e1xuXHRcdFx0XHRndWlsZDogR3VpbGRSZXNvbHZhYmxlO1xuXHRcdFx0fT5cblx0XHQpOiB7IGlkOiBzdHJpbmc7IHBlcm1pc3Npb25zOiB7IGlkOiBzdHJpbmc7IHR5cGU6IFwiVVNFUlwiOyBwZXJtaXNzaW9uOiBib29sZWFuIH1bXSB9ID0+IHtcblx0XHRcdGNvbnN0IGNvbW1hbmQgPSB0aGlzLm1vZHVsZXMuZmluZChtb2QgPT4gbW9kLmFsaWFzZXNbMF0gPT09IHZhbHVlLm5hbWUpO1xuXHRcdFx0bGV0IGFsbG93ZWRVc2Vyczogc3RyaW5nW10gPSBbXTtcblx0XHRcdC8qIGlmIChjb21tYW5kLnN1cGVyVXNlck9ubHkpIGFsbG93ZWRVc2Vycy5wdXNoKC4uLlV0aWwuaW50b0FycmF5KHN1cGVyVXNlcnMpKTsgKi9cblx0XHRcdGlmIChjb21tYW5kPy5vd25lck9ubHkpIGFsbG93ZWRVc2Vycy5wdXNoKC4uLlV0aWwuaW50b0FycmF5KG93bmVycykpO1xuXHRcdFx0YWxsb3dlZFVzZXJzID0gWy4uLm5ldyBTZXQoYWxsb3dlZFVzZXJzKV07IC8vIHJlbW92ZSBkdXBsaWNhdGVzXG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiB2YWx1ZS5pZCxcblx0XHRcdFx0cGVybWlzc2lvbnM6IGFsbG93ZWRVc2Vycy5tYXAodSA9PiAoe1xuXHRcdFx0XHRcdGlkOiB1LFxuXHRcdFx0XHRcdHR5cGU6IFwiVVNFUlwiLFxuXHRcdFx0XHRcdHBlcm1pc3Npb246IHRydWVcblx0XHRcdFx0fSkpXG5cdFx0XHR9O1xuXHRcdH07XG5cblx0XHRjb25zdCBnbG9iYWxDb21tYW5kcyA9IChhd2FpdCB0aGlzLmNsaWVudC5hcHBsaWNhdGlvbj8uY29tbWFuZHMuZmV0Y2goKSk/LmZpbHRlcih2YWx1ZSA9PlxuXHRcdFx0Qm9vbGVhbih0aGlzLm1vZHVsZXMuZmluZChtb2QgPT4gbW9kLmFsaWFzZXNbMF0gPT09IHZhbHVlLm5hbWUpKVxuXHRcdCk7XG5cdFx0Y29uc3QgZnVsbFBlcm1pc3Npb25zOiBHdWlsZEFwcGxpY2F0aW9uQ29tbWFuZFBlcm1pc3Npb25EYXRhW10gfCB1bmRlZmluZWQgPSBnbG9iYWxDb21tYW5kc1xuXHRcdFx0Py5maWx0ZXIodmFsdWUgPT4gIXZhbHVlLmRlZmF1bHRQZXJtaXNzaW9uKVxuXHRcdFx0LmZpbHRlcih2YWx1ZSA9PiBCb29sZWFuKHRoaXMubW9kdWxlcy5maW5kKG1vZCA9PiBtb2QuYWxpYXNlc1swXSA9PT0gdmFsdWUubmFtZSkpKVxuXHRcdFx0Lm1hcCh2YWx1ZSA9PiBtYXBDb20odmFsdWUpKTtcblxuXHRcdGNvbnN0IHByb21pc2VzID0gdGhpcy5jbGllbnQuZ3VpbGRzLmNhY2hlLm1hcChhc3luYyBndWlsZCA9PiB7XG5cdFx0XHRjb25zdCBwZXJtcyA9IG5ldyBBcnJheSguLi4oZnVsbFBlcm1pc3Npb25zID8/IFtdKSk7XG5cdFx0XHRhd2FpdCBndWlsZC5jb21tYW5kcy5mZXRjaCgpO1xuXHRcdFx0aWYgKGd1aWxkLmNvbW1hbmRzLmNhY2hlLnNpemUpXG5cdFx0XHRcdHBlcm1zLnB1c2goLi4uZ3VpbGQuY29tbWFuZHMuY2FjaGUuZmlsdGVyKHZhbHVlID0+ICF2YWx1ZS5kZWZhdWx0UGVybWlzc2lvbikubWFwKHZhbHVlID0+IG1hcENvbSh2YWx1ZSkpKTtcblx0XHRcdGlmIChndWlsZC5hdmFpbGFibGUpXG5cdFx0XHRcdHJldHVybiBndWlsZC5jb21tYW5kcy5wZXJtaXNzaW9ucy5zZXQoe1xuXHRcdFx0XHRcdGZ1bGxQZXJtaXNzaW9uczogcGVybXNcblx0XHRcdFx0fSk7XG5cdFx0XHQvLyBSZXR1cm4gZW1wdHkgcHJvbWlzZSBpZiBndWlsZCBpcyB1bmF2YWlsYWJsZVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHRcdHRyeSB7XG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXHRcdFx0Y29uc29sZS5kZWJ1Zyhwcm9taXNlcyk7XG5cdFx0XHRjb25zb2xlLmRlYnVnKGdsb2JhbENvbW1hbmRzKTtcblx0XHRcdGNvbnNvbGUuZGVidWcoZnVsbFBlcm1pc3Npb25zKTtcblx0XHRcdC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIGEgbW9kdWxlLlxuXHQgKiBAcGFyYW0gY29tbWFuZCAtIE1vZHVsZSB0byB1c2UuXG5cdCAqIEBwYXJhbSBmaWxlcGF0aCAtIEZpbGVwYXRoIG9mIG1vZHVsZS5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZWdpc3Rlcihjb21tYW5kOiBDb21tYW5kLCBmaWxlcGF0aD86IHN0cmluZyk6IHZvaWQge1xuXHRcdHN1cGVyLnJlZ2lzdGVyKGNvbW1hbmQsIGZpbGVwYXRoKTtcblxuXHRcdGZvciAobGV0IGFsaWFzIG9mIGNvbW1hbmQuYWxpYXNlcykge1xuXHRcdFx0Y29uc3QgY29uZmxpY3QgPSB0aGlzLmFsaWFzZXMuZ2V0KGFsaWFzLnRvTG93ZXJDYXNlKCkpO1xuXHRcdFx0aWYgKGNvbmZsaWN0KSB0aHJvdyBuZXcgQWthaXJvRXJyb3IoXCJBTElBU19DT05GTElDVFwiLCBhbGlhcywgY29tbWFuZC5pZCwgY29uZmxpY3QpO1xuXG5cdFx0XHRhbGlhcyA9IGFsaWFzLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR0aGlzLmFsaWFzZXMuc2V0KGFsaWFzLCBjb21tYW5kLmlkKTtcblx0XHRcdGlmICh0aGlzLmFsaWFzUmVwbGFjZW1lbnQpIHtcblx0XHRcdFx0Y29uc3QgcmVwbGFjZW1lbnQgPSBhbGlhcy5yZXBsYWNlKHRoaXMuYWxpYXNSZXBsYWNlbWVudCwgXCJcIik7XG5cblx0XHRcdFx0aWYgKHJlcGxhY2VtZW50ICE9PSBhbGlhcykge1xuXHRcdFx0XHRcdGNvbnN0IHJlcGxhY2VtZW50Q29uZmxpY3QgPSB0aGlzLmFsaWFzZXMuZ2V0KHJlcGxhY2VtZW50KTtcblx0XHRcdFx0XHRpZiAocmVwbGFjZW1lbnRDb25mbGljdClcblx0XHRcdFx0XHRcdHRocm93IG5ldyBBa2Fpcm9FcnJvcihcIkFMSUFTX0NPTkZMSUNUXCIsIHJlcGxhY2VtZW50LCBjb21tYW5kLmlkLCByZXBsYWNlbWVudENvbmZsaWN0KTtcblx0XHRcdFx0XHR0aGlzLmFsaWFzZXMuc2V0KHJlcGxhY2VtZW50LCBjb21tYW5kLmlkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChjb21tYW5kLnByZWZpeCAhPSBudWxsKSB7XG5cdFx0XHRsZXQgbmV3RW50cnkgPSBmYWxzZTtcblxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoY29tbWFuZC5wcmVmaXgpKSB7XG5cdFx0XHRcdGZvciAoY29uc3QgcHJlZml4IG9mIGNvbW1hbmQucHJlZml4KSB7XG5cdFx0XHRcdFx0Y29uc3QgcHJlZml4ZXMgPSB0aGlzLnByZWZpeGVzLmdldChwcmVmaXgpO1xuXHRcdFx0XHRcdGlmIChwcmVmaXhlcykge1xuXHRcdFx0XHRcdFx0cHJlZml4ZXMuYWRkKGNvbW1hbmQuaWQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChwcmVmaXgsIG5ldyBTZXQoW2NvbW1hbmQuaWRdKSk7XG5cdFx0XHRcdFx0XHRuZXdFbnRyeSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBwcmVmaXhlcyA9IHRoaXMucHJlZml4ZXMuZ2V0KGNvbW1hbmQucHJlZml4KTtcblx0XHRcdFx0aWYgKHByZWZpeGVzKSB7XG5cdFx0XHRcdFx0cHJlZml4ZXMuYWRkKGNvbW1hbmQuaWQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KGNvbW1hbmQucHJlZml4LCBuZXcgU2V0KFtjb21tYW5kLmlkXSkpO1xuXHRcdFx0XHRcdG5ld0VudHJ5ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV3RW50cnkpIHtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcyA9IHRoaXMucHJlZml4ZXMuc29ydCgoYVZhbCwgYlZhbCwgYUtleSwgYktleSkgPT4gVXRpbC5wcmVmaXhDb21wYXJlKGFLZXksIGJLZXkpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRGVyZWdpc3RlcnMgYSBtb2R1bGUuXG5cdCAqIEBwYXJhbSBjb21tYW5kIC0gTW9kdWxlIHRvIHVzZS5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSBkZXJlZ2lzdGVyKGNvbW1hbmQ6IENvbW1hbmQpOiB2b2lkIHtcblx0XHRmb3IgKGxldCBhbGlhcyBvZiBjb21tYW5kLmFsaWFzZXMpIHtcblx0XHRcdGFsaWFzID0gYWxpYXMudG9Mb3dlckNhc2UoKTtcblx0XHRcdHRoaXMuYWxpYXNlcy5kZWxldGUoYWxpYXMpO1xuXG5cdFx0XHRpZiAodGhpcy5hbGlhc1JlcGxhY2VtZW50KSB7XG5cdFx0XHRcdGNvbnN0IHJlcGxhY2VtZW50ID0gYWxpYXMucmVwbGFjZSh0aGlzLmFsaWFzUmVwbGFjZW1lbnQsIFwiXCIpO1xuXHRcdFx0XHRpZiAocmVwbGFjZW1lbnQgIT09IGFsaWFzKSB0aGlzLmFsaWFzZXMuZGVsZXRlKHJlcGxhY2VtZW50KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoY29tbWFuZC5wcmVmaXggIT0gbnVsbCkge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoY29tbWFuZC5wcmVmaXgpKSB7XG5cdFx0XHRcdGZvciAoY29uc3QgcHJlZml4IG9mIGNvbW1hbmQucHJlZml4KSB7XG5cdFx0XHRcdFx0Y29uc3QgcHJlZml4ZXMgPSB0aGlzLnByZWZpeGVzLmdldChwcmVmaXgpO1xuXHRcdFx0XHRcdGlmIChwcmVmaXhlcz8uc2l6ZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0dGhpcy5wcmVmaXhlcy5kZWxldGUocHJlZml4KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cHJlZml4ZXM/LmRlbGV0ZShwcmVmaXgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcHJlZml4ZXMgPSB0aGlzLnByZWZpeGVzLmdldChjb21tYW5kLnByZWZpeCk7XG5cdFx0XHRcdGlmIChwcmVmaXhlcz8uc2l6ZSA9PT0gMSkge1xuXHRcdFx0XHRcdHRoaXMucHJlZml4ZXMuZGVsZXRlKGNvbW1hbmQucHJlZml4KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcmVmaXhlcz8uZGVsZXRlKGNvbW1hbmQucHJlZml4IGFzIHN0cmluZyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRzdXBlci5kZXJlZ2lzdGVyKGNvbW1hbmQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgYSBtZXNzYWdlLlxuXHQgKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gaGFuZGxlLlxuXHQgKi9cblx0cHVibGljIGFzeW5jIGhhbmRsZShtZXNzYWdlOiBNZXNzYWdlKTogUHJvbWlzZTxib29sZWFuIHwgbnVsbD4ge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAodGhpcy5mZXRjaE1lbWJlcnMgJiYgbWVzc2FnZS5ndWlsZCAmJiAhbWVzc2FnZS5tZW1iZXIgJiYgIW1lc3NhZ2Uud2ViaG9va0lkKSB7XG5cdFx0XHRcdGF3YWl0IG1lc3NhZ2UuZ3VpbGQubWVtYmVycy5mZXRjaChtZXNzYWdlLmF1dGhvcik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhd2FpdCB0aGlzLnJ1bkFsbFR5cGVJbmhpYml0b3JzKG1lc3NhZ2UpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuY29tbWFuZFV0aWwpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29tbWFuZFV0aWxzLmhhcyhtZXNzYWdlLmlkKSkge1xuXHRcdFx0XHRcdG1lc3NhZ2UudXRpbCA9IHRoaXMuY29tbWFuZFV0aWxzLmdldChtZXNzYWdlLmlkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZXNzYWdlLnV0aWwgPSBuZXcgQ29tbWFuZFV0aWwodGhpcywgbWVzc2FnZSk7XG5cdFx0XHRcdFx0dGhpcy5jb21tYW5kVXRpbHMuc2V0KG1lc3NhZ2UuaWQsIG1lc3NhZ2UudXRpbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGF3YWl0IHRoaXMucnVuUHJlVHlwZUluaGliaXRvcnMobWVzc2FnZSkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgcGFyc2VkID0gYXdhaXQgdGhpcy5wYXJzZUNvbW1hbmQobWVzc2FnZSk7XG5cdFx0XHRpZiAoIXBhcnNlZC5jb21tYW5kKSB7XG5cdFx0XHRcdGNvbnN0IG92ZXJQYXJzZWQgPSBhd2FpdCB0aGlzLnBhcnNlQ29tbWFuZE92ZXJ3cml0dGVuUHJlZml4ZXMobWVzc2FnZSk7XG5cdFx0XHRcdGlmIChvdmVyUGFyc2VkLmNvbW1hbmQgfHwgKHBhcnNlZC5wcmVmaXggPT0gbnVsbCAmJiBvdmVyUGFyc2VkLnByZWZpeCAhPSBudWxsKSkge1xuXHRcdFx0XHRcdHBhcnNlZCA9IG92ZXJQYXJzZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuY29tbWFuZFV0aWwpIHtcblx0XHRcdFx0bWVzc2FnZS51dGlsIS5wYXJzZWQgPSBwYXJzZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGxldCByYW47XG5cdFx0XHRpZiAoIXBhcnNlZC5jb21tYW5kKSB7XG5cdFx0XHRcdHJhbiA9IGF3YWl0IHRoaXMuaGFuZGxlUmVnZXhBbmRDb25kaXRpb25hbENvbW1hbmRzKG1lc3NhZ2UpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmFuID0gYXdhaXQgdGhpcy5oYW5kbGVEaXJlY3RDb21tYW5kKG1lc3NhZ2UsIHBhcnNlZC5jb250ZW50ISwgcGFyc2VkLmNvbW1hbmQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocmFuID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLmVtaXQoQ29tbWFuZEhhbmRsZXJFdmVudHMuTUVTU0FHRV9JTlZBTElELCBtZXNzYWdlKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmFuO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0dGhpcy5lbWl0RXJyb3IoZXJyLCBtZXNzYWdlKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGEgc2xhc2ggY29tbWFuZC5cblx0ICogQHBhcmFtIGludGVyYWN0aW9uIC0gSW50ZXJhY3Rpb24gdG8gaGFuZGxlLlxuXHQgKi9cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcblx0cHVibGljIGFzeW5jIGhhbmRsZVNsYXNoKGludGVyYWN0aW9uOiBDb21tYW5kSW50ZXJhY3Rpb24pOiBQcm9taXNlPGJvb2xlYW4gfCBudWxsPiB7XG5cdFx0Y29uc3QgY29tbWFuZCA9IHRoaXMuZmluZENvbW1hbmQoaW50ZXJhY3Rpb24uY29tbWFuZE5hbWUpO1xuXG5cdFx0aWYgKCFjb21tYW5kKSB7XG5cdFx0XHR0aGlzLmVtaXQoQ29tbWFuZEhhbmRsZXJFdmVudHMuU0xBU0hfTk9UX0ZPVU5ELCBpbnRlcmFjdGlvbik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbWVzc2FnZSA9IG5ldyBBa2Fpcm9NZXNzYWdlKHRoaXMuY2xpZW50LCBpbnRlcmFjdGlvbik7XG5cblx0XHR0cnkge1xuXHRcdFx0aWYgKHRoaXMuZmV0Y2hNZW1iZXJzICYmIG1lc3NhZ2UuZ3VpbGQgJiYgIW1lc3NhZ2UubWVtYmVyKSB7XG5cdFx0XHRcdGF3YWl0IG1lc3NhZ2UuZ3VpbGQubWVtYmVycy5mZXRjaChtZXNzYWdlLmF1dGhvcik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhd2FpdCB0aGlzLnJ1bkFsbFR5cGVJbmhpYml0b3JzKG1lc3NhZ2UsIHRydWUpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuY29tbWFuZFV0aWwpIHtcblx0XHRcdFx0aWYgKHRoaXMuY29tbWFuZFV0aWxzLmhhcyhtZXNzYWdlLmlkKSkge1xuXHRcdFx0XHRcdG1lc3NhZ2UudXRpbCA9IHRoaXMuY29tbWFuZFV0aWxzLmdldChtZXNzYWdlLmlkKSE7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVzc2FnZS51dGlsID0gbmV3IENvbW1hbmRVdGlsKHRoaXMsIG1lc3NhZ2UpO1xuXHRcdFx0XHRcdHRoaXMuY29tbWFuZFV0aWxzLnNldChtZXNzYWdlLmlkLCBtZXNzYWdlLnV0aWwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhd2FpdCB0aGlzLnJ1blByZVR5cGVJbmhpYml0b3JzKG1lc3NhZ2UpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHBhcnNlZCA9IGF3YWl0IHRoaXMucGFyc2VDb21tYW5kKG1lc3NhZ2UpO1xuXHRcdFx0aWYgKCFwYXJzZWQuY29tbWFuZCkge1xuXHRcdFx0XHRjb25zdCBvdmVyUGFyc2VkID0gYXdhaXQgdGhpcy5wYXJzZUNvbW1hbmRPdmVyd3JpdHRlblByZWZpeGVzKG1lc3NhZ2UpO1xuXHRcdFx0XHRpZiAob3ZlclBhcnNlZC5jb21tYW5kIHx8IChwYXJzZWQucHJlZml4ID09IG51bGwgJiYgb3ZlclBhcnNlZC5wcmVmaXggIT0gbnVsbCkpIHtcblx0XHRcdFx0XHRwYXJzZWQgPSBvdmVyUGFyc2VkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmNvbW1hbmRVdGlsKSB7XG5cdFx0XHRcdG1lc3NhZ2UudXRpbC5wYXJzZWQgPSBwYXJzZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhd2FpdCB0aGlzLnJ1blBvc3RUeXBlSW5oaWJpdG9ycyhtZXNzYWdlLCBjb21tYW5kKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBjb252ZXJ0ZWRPcHRpb25zOiBhbnkgPSB7fTtcblx0XHRcdGludGVyYWN0aW9uLm9wdGlvbnMuZGF0YS5mb3JFYWNoKG9wdGlvbiA9PiB7XG5cdFx0XHRcdHN3aXRjaCAob3B0aW9uLnR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIFwiU1RSSU5HXCI6XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW29wdGlvbi5uYW1lXSA9IG9wdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJJTlRFR0VSXCI6XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW29wdGlvbi5uYW1lXSA9IG9wdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJCT09MRUFOXCI6XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW29wdGlvbi5uYW1lXSA9IG9wdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJOVU1CRVJcIjpcblx0XHRcdFx0XHRcdGNvbnZlcnRlZE9wdGlvbnNbb3B0aW9uLm5hbWVdID0gb3B0aW9uLnZhbHVlO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIlVTRVJcIjpcblx0XHRcdFx0XHRcdGNvbnZlcnRlZE9wdGlvbnNbb3B0aW9uLm5hbWVdID0geyB1c2VyOiBvcHRpb24udXNlciwgbWVtYmVyOiBvcHRpb24ubWVtYmVyIH07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiQ0hBTk5FTFwiOlxuXHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tvcHRpb24ubmFtZV0gPSBvcHRpb24uY2hhbm5lbDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJST0xFXCI6XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW29wdGlvbi5uYW1lXSA9IG9wdGlvbi5yb2xlO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIk1FTlRJT05BQkxFXCI6XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW29wdGlvbi5uYW1lXSA9IG9wdGlvbi5yb2xlID8gb3B0aW9uLnJvbGUgOiB7IHVzZXI6IG9wdGlvbi51c2VyLCBtZW1iZXI6IG9wdGlvbi5tZW1iZXIgfTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJTVUJfQ09NTUFORFwiOlxuXHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tcInN1YmNvbW1hbmRcIl0gPSBvcHRpb24ubmFtZTtcblx0XHRcdFx0XHRcdG9wdGlvbi5vcHRpb25zPy5mb3JFYWNoKHN1Yk9wdGlvbiA9PiB7XG5cdFx0XHRcdFx0XHRcdHN3aXRjaCAoc3ViT3B0aW9uLnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiU1RSSU5HXCI6XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW3N1Yk9wdGlvbi5uYW1lXSA9IHN1Yk9wdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJJTlRFR0VSXCI6XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW3N1Yk9wdGlvbi5uYW1lXSA9IHN1Yk9wdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJCT09MRUFOXCI6XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW3N1Yk9wdGlvbi5uYW1lXSA9IHN1Yk9wdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJOVU1CRVJcIjpcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnZlcnRlZE9wdGlvbnNbc3ViT3B0aW9uLm5hbWVdID0gc3ViT3B0aW9uLnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBcIlVTRVJcIjpcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnZlcnRlZE9wdGlvbnNbc3ViT3B0aW9uLm5hbWVdID0geyB1c2VyOiBzdWJPcHRpb24udXNlciwgbWVtYmVyOiBzdWJPcHRpb24ubWVtYmVyIH07XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiQ0hBTk5FTFwiOlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tzdWJPcHRpb24ubmFtZV0gPSBzdWJPcHRpb24uY2hhbm5lbDtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJST0xFXCI6XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW3N1Yk9wdGlvbi5uYW1lXSA9IHN1Yk9wdGlvbi5yb2xlO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBcIk1FTlRJT05BQkxFXCI6XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW3N1Yk9wdGlvbi5uYW1lXSA9IHN1Yk9wdGlvbi5yb2xlID8gc3ViT3B0aW9uLnJvbGUgOiB7IHVzZXI6IHN1Yk9wdGlvbi51c2VyLCBtZW1iZXI6IHN1Yk9wdGlvbi5tZW1iZXIgfTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIlNVQl9DT01NQU5EX0dST1VQXCI6e1xuXHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1snc3ViY29tbWFuZEdyb3VwJ10gPSBvcHRpb24ubmFtZVxuXG5cdFx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0XHRjb25zdCBvcHRpb25zID0gb3B0aW9uLm9wdGlvbnNbMF0ub3B0aW9ucztcblxuXHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tcInN1YmNvbW1hbmRcIl0gPSAob3B0aW9uLm9wdGlvbnMgYXMgeyBuYW1lOiBzdHJpbmc7IHR5cGU6IHN0cmluZyB9W10pWzBdLm5hbWU7XG5cblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdG9wdGlvbnMuZm9yRWFjaChzdWJPcHRpb24gPT4ge1xuXHRcdFx0XHRcdFx0XHRzd2l0Y2ggKHN1Yk9wdGlvbi50eXBlKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBcIlNUUklOR1wiOlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tzdWJPcHRpb24ubmFtZV0gPSBzdWJPcHRpb24udmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiSU5URUdFUlwiOlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tzdWJPcHRpb24ubmFtZV0gPSBzdWJPcHRpb24udmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiQk9PTEVBTlwiOlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tzdWJPcHRpb24ubmFtZV0gPSBzdWJPcHRpb24udmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiTlVNQkVSXCI6XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW3N1Yk9wdGlvbi5uYW1lXSA9IHN1Yk9wdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJVU0VSXCI6XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZWRPcHRpb25zW3N1Yk9wdGlvbi5uYW1lXSA9IHsgdXNlcjogc3ViT3B0aW9uLnVzZXIsIG1lbWJlcjogc3ViT3B0aW9uLm1lbWJlciB9O1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSBcIkNIQU5ORUxcIjpcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnZlcnRlZE9wdGlvbnNbc3ViT3B0aW9uLm5hbWVdID0gc3ViT3B0aW9uLmNoYW5uZWw7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlIFwiUk9MRVwiOlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tzdWJPcHRpb24ubmFtZV0gPSBzdWJPcHRpb24ucm9sZTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgXCJNRU5USU9OQUJMRVwiOlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udmVydGVkT3B0aW9uc1tzdWJPcHRpb24ubmFtZV0gPSBzdWJPcHRpb24ucm9sZSA/IHN1Yk9wdGlvbi5yb2xlIDogeyB1c2VyOiBzdWJPcHRpb24udXNlciwgbWVtYmVyOiBzdWJPcHRpb24ubWVtYmVyIH07XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdGJyZWFrfVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGNvbnZlcnRlZE9wdGlvbnNbb3B0aW9uLm5hbWVdID0gb3B0aW9uXG5cdFx0XHR9KTtcblxuXHRcdFx0bGV0IGtleTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChjb21tYW5kLmxvY2spIGtleSA9IChjb21tYW5kLmxvY2sgYXMgS2V5U3VwcGxpZXIpKG1lc3NhZ2UsIGNvbnZlcnRlZE9wdGlvbnMpO1xuXHRcdFx0XHRpZiAoVXRpbC5pc1Byb21pc2Uoa2V5KSkga2V5ID0gYXdhaXQga2V5O1xuXHRcdFx0XHRpZiAoa2V5KSB7XG5cdFx0XHRcdFx0aWYgKGNvbW1hbmQubG9ja2VyPy5oYXMoa2V5KSkge1xuXHRcdFx0XHRcdFx0a2V5ID0gbnVsbDtcblx0XHRcdFx0XHRcdHRoaXMuZW1pdChDb21tYW5kSGFuZGxlckV2ZW50cy5DT01NQU5EX0xPQ0tFRCwgbWVzc2FnZSwgY29tbWFuZCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29tbWFuZC5sb2NrZXI/LmFkZChrZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0dGhpcy5lbWl0RXJyb3IoZXJyLCBtZXNzYWdlLCBjb21tYW5kKTtcblx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdGlmIChrZXkpIGNvbW1hbmQubG9ja2VyPy5kZWxldGUoa2V5KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuYXV0b0RlZmVyIHx8IGNvbW1hbmQuc2xhc2hFcGhlbWVyYWwpIHtcblx0XHRcdFx0YXdhaXQgaW50ZXJhY3Rpb24uZGVmZXJSZXBseSh7IGVwaGVtZXJhbDogY29tbWFuZC5zbGFzaEVwaGVtZXJhbCB9KTtcblx0XHRcdH1cblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLlNMQVNIX1NUQVJURUQsIG1lc3NhZ2UsIGNvbW1hbmQsIGNvbnZlcnRlZE9wdGlvbnMpO1xuXHRcdFx0XHRjb25zdCByZXQgPVxuXHRcdFx0XHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE9iamVjdC5nZXRQcm90b3R5cGVPZihjb21tYW5kKSkuaW5jbHVkZXMoXCJleGVjU2xhc2hcIikgfHwgdGhpcy5leGVjU2xhc2hcblx0XHRcdFx0XHRcdD8gYXdhaXQgY29tbWFuZC5leGVjU2xhc2gobWVzc2FnZSwgY29udmVydGVkT3B0aW9ucylcblx0XHRcdFx0XHRcdDogYXdhaXQgY29tbWFuZC5leGVjKG1lc3NhZ2UsIGNvbnZlcnRlZE9wdGlvbnMpO1xuXHRcdFx0XHR0aGlzLmVtaXQoQ29tbWFuZEhhbmRsZXJFdmVudHMuU0xBU0hfRklOSVNIRUQsIG1lc3NhZ2UsIGNvbW1hbmQsIGNvbnZlcnRlZE9wdGlvbnMsIHJldCk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdHRoaXMuZW1pdChDb21tYW5kSGFuZGxlckV2ZW50cy5TTEFTSF9FUlJPUiwgZXJyLCBtZXNzYWdlLCBjb21tYW5kKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0dGhpcy5lbWl0RXJyb3IoZXJyLCBtZXNzYWdlLCBjb21tYW5kKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxuXHQvKipcblx0ICogSGFuZGxlcyBub3JtYWwgY29tbWFuZHMuXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0byBoYW5kbGUuXG5cdCAqIEBwYXJhbSBjb250ZW50IC0gQ29udGVudCBvZiBtZXNzYWdlIHdpdGhvdXQgY29tbWFuZC5cblx0ICogQHBhcmFtIGNvbW1hbmQgLSBDb21tYW5kIGluc3RhbmNlLlxuXHQgKiBAcGFyYW0gaWdub3JlIC0gSWdub3JlIGluaGliaXRvcnMgYW5kIG90aGVyIGNoZWNrcy5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBoYW5kbGVEaXJlY3RDb21tYW5kKFxuXHRcdG1lc3NhZ2U6IE1lc3NhZ2UsXG5cdFx0Y29udGVudDogc3RyaW5nLFxuXHRcdGNvbW1hbmQ6IENvbW1hbmQsXG5cdFx0aWdub3JlOiBib29sZWFuID0gZmFsc2Vcblx0KTogUHJvbWlzZTxib29sZWFuIHwgbnVsbD4ge1xuXHRcdGxldCBrZXk7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghaWdub3JlKSB7XG5cdFx0XHRcdGlmIChtZXNzYWdlLmVkaXRlZFRpbWVzdGFtcCAmJiAhY29tbWFuZC5lZGl0YWJsZSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZiAoYXdhaXQgdGhpcy5ydW5Qb3N0VHlwZUluaGliaXRvcnMobWVzc2FnZSwgY29tbWFuZCkpIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGJlZm9yZSA9IGNvbW1hbmQuYmVmb3JlKG1lc3NhZ2UpO1xuXHRcdFx0aWYgKFV0aWwuaXNQcm9taXNlKGJlZm9yZSkpIGF3YWl0IGJlZm9yZTtcblxuXHRcdFx0Y29uc3QgYXJncyA9IGF3YWl0IGNvbW1hbmQucGFyc2UobWVzc2FnZSwgY29udGVudCk7XG5cdFx0XHRpZiAoRmxhZy5pcyhhcmdzLCBcImNhbmNlbFwiKSkge1xuXHRcdFx0XHR0aGlzLmVtaXQoQ29tbWFuZEhhbmRsZXJFdmVudHMuQ09NTUFORF9DQU5DRUxMRUQsIG1lc3NhZ2UsIGNvbW1hbmQpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoRmxhZy5pcyhhcmdzLCBcInJldHJ5XCIpKSB7XG5cdFx0XHRcdHRoaXMuZW1pdChDb21tYW5kSGFuZGxlckV2ZW50cy5DT01NQU5EX0JSRUFLT1VULCBtZXNzYWdlLCBjb21tYW5kLCBhcmdzLm1lc3NhZ2UpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGUoYXJncy5tZXNzYWdlKTtcblx0XHRcdH0gZWxzZSBpZiAoRmxhZy5pcyhhcmdzLCBcImNvbnRpbnVlXCIpKSB7XG5cdFx0XHRcdGNvbnN0IGNvbnRpbnVlQ29tbWFuZCA9IHRoaXMubW9kdWxlcy5nZXQoYXJncy5jb21tYW5kKSE7XG5cdFx0XHRcdHJldHVybiB0aGlzLmhhbmRsZURpcmVjdENvbW1hbmQobWVzc2FnZSwgYXJncy5yZXN0LCBjb250aW51ZUNvbW1hbmQsIGFyZ3MuaWdub3JlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFpZ25vcmUpIHtcblx0XHRcdFx0aWYgKGNvbW1hbmQubG9jaykga2V5ID0gKGNvbW1hbmQubG9jayBhcyBLZXlTdXBwbGllcikobWVzc2FnZSwgYXJncyk7XG5cdFx0XHRcdGlmIChVdGlsLmlzUHJvbWlzZShrZXkpKSBrZXkgPSBhd2FpdCBrZXk7XG5cdFx0XHRcdGlmIChrZXkpIHtcblx0XHRcdFx0XHRpZiAoY29tbWFuZC5sb2NrZXI/LmhhcyhrZXkpKSB7XG5cdFx0XHRcdFx0XHRrZXkgPSBudWxsO1xuXHRcdFx0XHRcdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLkNPTU1BTkRfTE9DS0VELCBtZXNzYWdlLCBjb21tYW5kKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbW1hbmQubG9ja2VyPy5hZGQoa2V5KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCB0aGlzLnJ1bkNvbW1hbmQobWVzc2FnZSwgY29tbWFuZCwgYXJncyk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHRoaXMuZW1pdEVycm9yKGVyciwgbWVzc2FnZSwgY29tbWFuZCk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0aWYgKGtleSkgY29tbWFuZC5sb2NrZXI/LmRlbGV0ZShrZXkpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIHJlZ2V4IGFuZCBjb25kaXRpb25hbCBjb21tYW5kcy5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGhhbmRsZS5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBoYW5kbGVSZWdleEFuZENvbmRpdGlvbmFsQ29tbWFuZHMobWVzc2FnZTogTWVzc2FnZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRcdGNvbnN0IHJhbjEgPSBhd2FpdCB0aGlzLmhhbmRsZVJlZ2V4Q29tbWFuZHMobWVzc2FnZSk7XG5cdFx0Y29uc3QgcmFuMiA9IGF3YWl0IHRoaXMuaGFuZGxlQ29uZGl0aW9uYWxDb21tYW5kcyhtZXNzYWdlKTtcblx0XHRyZXR1cm4gcmFuMSB8fCByYW4yO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgcmVnZXggY29tbWFuZHMuXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0byBoYW5kbGUuXG5cdCAqL1xuXHRwdWJsaWMgYXN5bmMgaGFuZGxlUmVnZXhDb21tYW5kcyhtZXNzYWdlOiBNZXNzYWdlKTogUHJvbWlzZTxib29sZWFuPiB7XG5cdFx0Y29uc3QgaGFzUmVnZXhDb21tYW5kcyA9IFtdO1xuXHRcdGZvciAoY29uc3QgY29tbWFuZCBvZiB0aGlzLm1vZHVsZXMudmFsdWVzKCkpIHtcblx0XHRcdGlmIChtZXNzYWdlLmVkaXRlZFRpbWVzdGFtcCA/IGNvbW1hbmQuZWRpdGFibGUgOiB0cnVlKSB7XG5cdFx0XHRcdGNvbnN0IHJlZ2V4ID0gdHlwZW9mIGNvbW1hbmQucmVnZXggPT09IFwiZnVuY3Rpb25cIiA/IGNvbW1hbmQucmVnZXgobWVzc2FnZSkgOiBjb21tYW5kLnJlZ2V4O1xuXHRcdFx0XHRpZiAocmVnZXgpIGhhc1JlZ2V4Q29tbWFuZHMucHVzaCh7IGNvbW1hbmQsIHJlZ2V4IH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IG1hdGNoZWRDb21tYW5kcyA9IFtdO1xuXHRcdGZvciAoY29uc3QgZW50cnkgb2YgaGFzUmVnZXhDb21tYW5kcykge1xuXHRcdFx0Y29uc3QgbWF0Y2ggPSBtZXNzYWdlLmNvbnRlbnQubWF0Y2goZW50cnkucmVnZXgpO1xuXHRcdFx0aWYgKCFtYXRjaCkgY29udGludWU7XG5cblx0XHRcdGNvbnN0IG1hdGNoZXMgPSBbXTtcblxuXHRcdFx0aWYgKGVudHJ5LnJlZ2V4Lmdsb2JhbCkge1xuXHRcdFx0XHRsZXQgbWF0Y2hlZDtcblxuXHRcdFx0XHR3aGlsZSAoKG1hdGNoZWQgPSBlbnRyeS5yZWdleC5leGVjKG1lc3NhZ2UuY29udGVudCkpICE9IG51bGwpIHtcblx0XHRcdFx0XHRtYXRjaGVzLnB1c2gobWF0Y2hlZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0bWF0Y2hlZENvbW1hbmRzLnB1c2goeyBjb21tYW5kOiBlbnRyeS5jb21tYW5kLCBtYXRjaCwgbWF0Y2hlcyB9KTtcblx0XHR9XG5cblx0XHRpZiAoIW1hdGNoZWRDb21tYW5kcy5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRjb25zdCBwcm9taXNlcyA9IFtdO1xuXHRcdGZvciAoY29uc3QgeyBjb21tYW5kLCBtYXRjaCwgbWF0Y2hlcyB9IG9mIG1hdGNoZWRDb21tYW5kcykge1xuXHRcdFx0cHJvbWlzZXMucHVzaChcblx0XHRcdFx0KGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKGF3YWl0IHRoaXMucnVuUG9zdFR5cGVJbmhpYml0b3JzKG1lc3NhZ2UsIGNvbW1hbmQpKSByZXR1cm47XG5cblx0XHRcdFx0XHRcdGNvbnN0IGJlZm9yZSA9IGNvbW1hbmQuYmVmb3JlKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0aWYgKFV0aWwuaXNQcm9taXNlKGJlZm9yZSkpIGF3YWl0IGJlZm9yZTtcblxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5ydW5Db21tYW5kKG1lc3NhZ2UsIGNvbW1hbmQsIHsgbWF0Y2gsIG1hdGNoZXMgfSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVtaXRFcnJvcihlcnIsIG1lc3NhZ2UsIGNvbW1hbmQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkoKVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBjb25kaXRpb25hbCBjb21tYW5kcy5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGhhbmRsZS5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBoYW5kbGVDb25kaXRpb25hbENvbW1hbmRzKG1lc3NhZ2U6IE1lc3NhZ2UpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRjb25zdCB0cnVlQ29tbWFuZHM6IENvbW1hbmRbXSA9IFtdO1xuXG5cdFx0Y29uc3QgZmlsdGVyUHJvbWlzZXMgPSBbXTtcblx0XHRmb3IgKGNvbnN0IGNvbW1hbmQgb2YgdGhpcy5tb2R1bGVzLnZhbHVlcygpKSB7XG5cdFx0XHRpZiAobWVzc2FnZS5lZGl0ZWRUaW1lc3RhbXAgJiYgIWNvbW1hbmQuZWRpdGFibGUpIGNvbnRpbnVlO1xuXHRcdFx0ZmlsdGVyUHJvbWlzZXMucHVzaChcblx0XHRcdFx0KGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRsZXQgY29uZCA9IGNvbW1hbmQuY29uZGl0aW9uKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdGlmIChVdGlsLmlzUHJvbWlzZShjb25kKSkgY29uZCA9IGF3YWl0IGNvbmQ7XG5cdFx0XHRcdFx0aWYgKGNvbmQpIHRydWVDb21tYW5kcy5wdXNoKGNvbW1hbmQpO1xuXHRcdFx0XHR9KSgpXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGF3YWl0IFByb21pc2UuYWxsKGZpbHRlclByb21pc2VzKTtcblxuXHRcdGlmICghdHJ1ZUNvbW1hbmRzLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGNvbnN0IHByb21pc2VzID0gW107XG5cdFx0Zm9yIChjb25zdCBjb21tYW5kIG9mIHRydWVDb21tYW5kcykge1xuXHRcdFx0cHJvbWlzZXMucHVzaChcblx0XHRcdFx0KGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKGF3YWl0IHRoaXMucnVuUG9zdFR5cGVJbmhpYml0b3JzKG1lc3NhZ2UsIGNvbW1hbmQpKSByZXR1cm47XG5cdFx0XHRcdFx0XHRjb25zdCBiZWZvcmUgPSBjb21tYW5kLmJlZm9yZShtZXNzYWdlKTtcblx0XHRcdFx0XHRcdGlmIChVdGlsLmlzUHJvbWlzZShiZWZvcmUpKSBhd2FpdCBiZWZvcmU7XG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnJ1bkNvbW1hbmQobWVzc2FnZSwgY29tbWFuZCwge30pO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdFx0dGhpcy5lbWl0RXJyb3IoZXJyLCBtZXNzYWdlLCBjb21tYW5kKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pKClcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJ1bnMgaW5oaWJpdG9ycyB3aXRoIHRoZSBhbGwgdHlwZS5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGhhbmRsZS5cblx0ICogQHBhcmFtIHNsYXNoIC0gV2hldGhlciBvciBub3QgdGhlIGNvbW1hbmQgc2hvdWxkIGlzIGEgc2xhc2ggY29tbWFuZC5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBydW5BbGxUeXBlSW5oaWJpdG9ycyhtZXNzYWdlOiBNZXNzYWdlIHwgQWthaXJvTWVzc2FnZSwgc2xhc2g6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRcdGNvbnN0IHJlYXNvbiA9IHRoaXMuaW5oaWJpdG9ySGFuZGxlciA/IGF3YWl0IHRoaXMuaW5oaWJpdG9ySGFuZGxlci50ZXN0KFwiYWxsXCIsIG1lc3NhZ2UpIDogbnVsbDtcblxuXHRcdGlmIChyZWFzb24gIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLk1FU1NBR0VfQkxPQ0tFRCwgbWVzc2FnZSwgcmVhc29uKTtcblx0XHR9IGVsc2UgaWYgKCFtZXNzYWdlLmF1dGhvcikge1xuXHRcdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLk1FU1NBR0VfQkxPQ0tFRCwgbWVzc2FnZSwgQnVpbHRJblJlYXNvbnMuQVVUSE9SX05PVF9GT1VORCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLmJsb2NrQ2xpZW50ICYmIG1lc3NhZ2UuYXV0aG9yLmlkID09PSB0aGlzLmNsaWVudC51c2VyPy5pZCkge1xuXHRcdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLk1FU1NBR0VfQkxPQ0tFRCwgbWVzc2FnZSwgQnVpbHRJblJlYXNvbnMuQ0xJRU5UKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuYmxvY2tCb3RzICYmIG1lc3NhZ2UuYXV0aG9yLmJvdCkge1xuXHRcdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLk1FU1NBR0VfQkxPQ0tFRCwgbWVzc2FnZSwgQnVpbHRJblJlYXNvbnMuQk9UKTtcblx0XHR9IGVsc2UgaWYgKCFzbGFzaCAmJiB0aGlzLmhhc1Byb21wdChtZXNzYWdlLmNoYW5uZWwhLCBtZXNzYWdlLmF1dGhvcikpIHtcblx0XHRcdHRoaXMuZW1pdChDb21tYW5kSGFuZGxlckV2ZW50cy5JTl9QUk9NUFQsIG1lc3NhZ2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogUnVucyBpbmhpYml0b3JzIHdpdGggdGhlIHByZSB0eXBlLlxuXHQgKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gaGFuZGxlLlxuXHQgKi9cblx0cHVibGljIGFzeW5jIHJ1blByZVR5cGVJbmhpYml0b3JzKG1lc3NhZ2U6IE1lc3NhZ2UgfCBBa2Fpcm9NZXNzYWdlKTogUHJvbWlzZTxib29sZWFuPiB7XG5cdFx0Y29uc3QgcmVhc29uID0gdGhpcy5pbmhpYml0b3JIYW5kbGVyID8gYXdhaXQgdGhpcy5pbmhpYml0b3JIYW5kbGVyLnRlc3QoXCJwcmVcIiwgbWVzc2FnZSkgOiBudWxsO1xuXG5cdFx0aWYgKHJlYXNvbiAhPSBudWxsKSB7XG5cdFx0XHR0aGlzLmVtaXQoQ29tbWFuZEhhbmRsZXJFdmVudHMuTUVTU0FHRV9CTE9DS0VELCBtZXNzYWdlLCByZWFzb24pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogUnVucyBpbmhpYml0b3JzIHdpdGggdGhlIHBvc3QgdHlwZS5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGhhbmRsZS5cblx0ICogQHBhcmFtIGNvbW1hbmQgLSBDb21tYW5kIHRvIGhhbmRsZS5cblx0ICogQHBhcmFtIHNsYXNoIC0gV2hldGhlciBvciBub3QgdGhlIGNvbW1hbmQgc2hvdWxkIGlzIGEgc2xhc2ggY29tbWFuZC5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBydW5Qb3N0VHlwZUluaGliaXRvcnMoXG5cdFx0bWVzc2FnZTogTWVzc2FnZSB8IEFrYWlyb01lc3NhZ2UsXG5cdFx0Y29tbWFuZDogQ29tbWFuZCxcblx0XHRzbGFzaDogYm9vbGVhbiA9IGZhbHNlXG5cdCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRcdGNvbnN0IGV2ZW50ID0gc2xhc2ggPyBDb21tYW5kSGFuZGxlckV2ZW50cy5TTEFTSF9CTE9DS0VEIDogQ29tbWFuZEhhbmRsZXJFdmVudHMuQ09NTUFORF9CTE9DS0VEO1xuXG5cdFx0aWYgKCF0aGlzLnNraXBCdWlsdEluUG9zdEluaGliaXRvcnMpIHtcblx0XHRcdGlmIChjb21tYW5kLm93bmVyT25seSkge1xuXHRcdFx0XHRjb25zdCBpc093bmVyID0gdGhpcy5jbGllbnQuaXNPd25lcihtZXNzYWdlLmF1dGhvcik7XG5cdFx0XHRcdGlmICghaXNPd25lcikge1xuXHRcdFx0XHRcdHRoaXMuZW1pdChldmVudCwgbWVzc2FnZSwgY29tbWFuZCwgQnVpbHRJblJlYXNvbnMuT1dORVIpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb21tYW5kLnN1cGVyVXNlck9ubHkpIHtcblx0XHRcdFx0Y29uc3QgaXNTdXBlclVzZXIgPSB0aGlzLmNsaWVudC5pc1N1cGVyVXNlcihtZXNzYWdlLmF1dGhvcik7XG5cdFx0XHRcdGlmICghaXNTdXBlclVzZXIpIHtcblx0XHRcdFx0XHR0aGlzLmVtaXQoZXZlbnQsIG1lc3NhZ2UsIGNvbW1hbmQsIEJ1aWx0SW5SZWFzb25zLlNVUEVSX1VTRVIpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb21tYW5kLmNoYW5uZWwgPT09IFwiZ3VpbGRcIiAmJiAhbWVzc2FnZS5ndWlsZCkge1xuXHRcdFx0XHR0aGlzLmVtaXQoZXZlbnQsIG1lc3NhZ2UsIGNvbW1hbmQsIEJ1aWx0SW5SZWFzb25zLkdVSUxEKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb21tYW5kLmNoYW5uZWwgPT09IFwiZG1cIiAmJiBtZXNzYWdlLmd1aWxkKSB7XG5cdFx0XHRcdHRoaXMuZW1pdChldmVudCwgbWVzc2FnZSwgY29tbWFuZCwgQnVpbHRJblJlYXNvbnMuRE0pO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbW1hbmQub25seU5zZncgJiYgIShtZXNzYWdlLmNoYW5uZWwgYXMgVGV4dENoYW5uZWwpPy5bXCJuc2Z3XCJdKSB7XG5cdFx0XHRcdHRoaXMuZW1pdChldmVudCwgbWVzc2FnZSwgY29tbWFuZCwgQnVpbHRJblJlYXNvbnMuTk9UX05TRlcpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuc2tpcEJ1aWx0SW5Qb3N0SW5oaWJpdG9ycykge1xuXHRcdFx0aWYgKGF3YWl0IHRoaXMucnVuUGVybWlzc2lvbkNoZWNrcyhtZXNzYWdlLCBjb21tYW5kLCBzbGFzaCkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVhc29uID0gdGhpcy5pbmhpYml0b3JIYW5kbGVyID8gYXdhaXQgdGhpcy5pbmhpYml0b3JIYW5kbGVyLnRlc3QoXCJwb3N0XCIsIG1lc3NhZ2UsIGNvbW1hbmQpIDogbnVsbDtcblxuXHRcdGlmICh0aGlzLnNraXBCdWlsdEluUG9zdEluaGliaXRvcnMpIHtcblx0XHRcdGlmIChhd2FpdCB0aGlzLnJ1blBlcm1pc3Npb25DaGVja3MobWVzc2FnZSwgY29tbWFuZCwgc2xhc2gpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChyZWFzb24gIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5lbWl0KGV2ZW50LCBtZXNzYWdlLCBjb21tYW5kLCByZWFzb24pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucnVuQ29vbGRvd25zKG1lc3NhZ2UsIGNvbW1hbmQpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogUnVucyBwZXJtaXNzaW9uIGNoZWNrcy5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRoYXQgY2FsbGVkIHRoZSBjb21tYW5kLlxuXHQgKiBAcGFyYW0gY29tbWFuZCAtIENvbW1hbmQgdG8gY29vbGRvd24uXG5cdCAqIEBwYXJhbSBzbGFzaCAtIFdoZXRoZXIgb3Igbm90IHRoZSBjb21tYW5kIGlzIGEgc2xhc2ggY29tbWFuZC5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBydW5QZXJtaXNzaW9uQ2hlY2tzKFxuXHRcdG1lc3NhZ2U6IE1lc3NhZ2UgfCBBa2Fpcm9NZXNzYWdlLFxuXHRcdGNvbW1hbmQ6IENvbW1hbmQsXG5cdFx0c2xhc2g6IGJvb2xlYW4gPSBmYWxzZVxuXHQpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRpZiAoY29tbWFuZC5jbGllbnRQZXJtaXNzaW9ucykge1xuXHRcdFx0aWYgKHR5cGVvZiBjb21tYW5kLmNsaWVudFBlcm1pc3Npb25zID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0bGV0IG1pc3NpbmcgPSBjb21tYW5kLmNsaWVudFBlcm1pc3Npb25zKG1lc3NhZ2UpO1xuXHRcdFx0XHRpZiAoVXRpbC5pc1Byb21pc2UobWlzc2luZykpIG1pc3NpbmcgPSBhd2FpdCBtaXNzaW5nO1xuXG5cdFx0XHRcdGlmIChtaXNzaW5nICE9IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLmVtaXQoXG5cdFx0XHRcdFx0XHRzbGFzaCA/IENvbW1hbmRIYW5kbGVyRXZlbnRzLlNMQVNIX01JU1NJTkdfUEVSTUlTU0lPTlMgOiBDb21tYW5kSGFuZGxlckV2ZW50cy5NSVNTSU5HX1BFUk1JU1NJT05TLFxuXHRcdFx0XHRcdFx0bWVzc2FnZSxcblx0XHRcdFx0XHRcdGNvbW1hbmQsXG5cdFx0XHRcdFx0XHRcImNsaWVudFwiLFxuXHRcdFx0XHRcdFx0bWlzc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAobWVzc2FnZS5ndWlsZCkge1xuXHRcdFx0XHRpZiAobWVzc2FnZS5jaGFubmVsPy50eXBlID09PSBcIkRNXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0Y29uc3QgbWlzc2luZyA9IG1lc3NhZ2UuY2hhbm5lbD8ucGVybWlzc2lvbnNGb3IobWVzc2FnZS5ndWlsZC5tZSEpPy5taXNzaW5nKGNvbW1hbmQuY2xpZW50UGVybWlzc2lvbnMpO1xuXHRcdFx0XHRpZiAobWlzc2luZz8ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dGhpcy5lbWl0KFxuXHRcdFx0XHRcdFx0c2xhc2ggPyBDb21tYW5kSGFuZGxlckV2ZW50cy5TTEFTSF9NSVNTSU5HX1BFUk1JU1NJT05TIDogQ29tbWFuZEhhbmRsZXJFdmVudHMuTUlTU0lOR19QRVJNSVNTSU9OUyxcblx0XHRcdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRjb21tYW5kLFxuXHRcdFx0XHRcdFx0XCJjbGllbnRcIixcblx0XHRcdFx0XHRcdG1pc3Npbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGNvbW1hbmQudXNlclBlcm1pc3Npb25zKSB7XG5cdFx0XHRjb25zdCBpZ25vcmVyID0gY29tbWFuZC5pZ25vcmVQZXJtaXNzaW9ucyB8fCB0aGlzLmlnbm9yZVBlcm1pc3Npb25zO1xuXHRcdFx0Y29uc3QgaXNJZ25vcmVkID0gQXJyYXkuaXNBcnJheShpZ25vcmVyKVxuXHRcdFx0XHQ/IGlnbm9yZXIuaW5jbHVkZXMobWVzc2FnZS5hdXRob3IuaWQpXG5cdFx0XHRcdDogdHlwZW9mIGlnbm9yZXIgPT09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHQ/IGlnbm9yZXIobWVzc2FnZSwgY29tbWFuZClcblx0XHRcdFx0OiBtZXNzYWdlLmF1dGhvci5pZCA9PT0gaWdub3JlcjtcblxuXHRcdFx0aWYgKCFpc0lnbm9yZWQpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBjb21tYW5kLnVzZXJQZXJtaXNzaW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0bGV0IG1pc3NpbmcgPSBjb21tYW5kLnVzZXJQZXJtaXNzaW9ucyhtZXNzYWdlKTtcblx0XHRcdFx0XHRpZiAoVXRpbC5pc1Byb21pc2UobWlzc2luZykpIG1pc3NpbmcgPSBhd2FpdCBtaXNzaW5nO1xuXG5cdFx0XHRcdFx0aWYgKG1pc3NpbmcgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dGhpcy5lbWl0KFxuXHRcdFx0XHRcdFx0XHRzbGFzaCA/IENvbW1hbmRIYW5kbGVyRXZlbnRzLlNMQVNIX01JU1NJTkdfUEVSTUlTU0lPTlMgOiBDb21tYW5kSGFuZGxlckV2ZW50cy5NSVNTSU5HX1BFUk1JU1NJT05TLFxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRcdFx0XHRjb21tYW5kLFxuXHRcdFx0XHRcdFx0XHRcInVzZXJcIixcblx0XHRcdFx0XHRcdFx0bWlzc2luZ1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChtZXNzYWdlLmd1aWxkKSB7XG5cdFx0XHRcdFx0aWYgKG1lc3NhZ2UuY2hhbm5lbD8udHlwZSA9PT0gXCJETVwiKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0Y29uc3QgbWlzc2luZyA9IG1lc3NhZ2UuY2hhbm5lbD8ucGVybWlzc2lvbnNGb3IobWVzc2FnZS5hdXRob3IpPy5taXNzaW5nKGNvbW1hbmQudXNlclBlcm1pc3Npb25zKTtcblx0XHRcdFx0XHRpZiAobWlzc2luZz8ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmVtaXQoXG5cdFx0XHRcdFx0XHRcdHNsYXNoID8gQ29tbWFuZEhhbmRsZXJFdmVudHMuU0xBU0hfTUlTU0lOR19QRVJNSVNTSU9OUyA6IENvbW1hbmRIYW5kbGVyRXZlbnRzLk1JU1NJTkdfUEVSTUlTU0lPTlMsXG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRcdGNvbW1hbmQsXG5cdFx0XHRcdFx0XHRcdFwidXNlclwiLFxuXHRcdFx0XHRcdFx0XHRtaXNzaW5nXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJ1bnMgY29vbGRvd25zIGFuZCBjaGVja3MgaWYgYSB1c2VyIGlzIHVuZGVyIGNvb2xkb3duLlxuXHQgKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdGhhdCBjYWxsZWQgdGhlIGNvbW1hbmQuXG5cdCAqIEBwYXJhbSBjb21tYW5kIC0gQ29tbWFuZCB0byBjb29sZG93bi5cblx0ICovXG5cdHB1YmxpYyBydW5Db29sZG93bnMobWVzc2FnZTogTWVzc2FnZSB8IEFrYWlyb01lc3NhZ2UsIGNvbW1hbmQ6IENvbW1hbmQpOiBib29sZWFuIHtcblx0XHRjb25zdCBpZCA9IG1lc3NhZ2UuYXV0aG9yPy5pZDtcblx0XHRjb25zdCBpZ25vcmVyID0gY29tbWFuZC5pZ25vcmVDb29sZG93biB8fCB0aGlzLmlnbm9yZUNvb2xkb3duO1xuXHRcdGNvbnN0IGlzSWdub3JlZCA9IEFycmF5LmlzQXJyYXkoaWdub3Jlcilcblx0XHRcdD8gaWdub3Jlci5pbmNsdWRlcyhpZClcblx0XHRcdDogdHlwZW9mIGlnbm9yZXIgPT09IFwiZnVuY3Rpb25cIlxuXHRcdFx0PyBpZ25vcmVyKG1lc3NhZ2UsIGNvbW1hbmQpXG5cdFx0XHQ6IGlkID09PSBpZ25vcmVyO1xuXG5cdFx0aWYgKGlzSWdub3JlZCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0Y29uc3QgdGltZSA9IGNvbW1hbmQuY29vbGRvd24gIT0gbnVsbCA/IGNvbW1hbmQuY29vbGRvd24gOiB0aGlzLmRlZmF1bHRDb29sZG93bjtcblx0XHRpZiAoIXRpbWUpIHJldHVybiBmYWxzZTtcblxuXHRcdGNvbnN0IGVuZFRpbWUgPSBtZXNzYWdlLmNyZWF0ZWRUaW1lc3RhbXAgKyB0aW1lO1xuXG5cdFx0aWYgKCF0aGlzLmNvb2xkb3ducy5oYXMoaWQpKSB0aGlzLmNvb2xkb3ducy5zZXQoaWQsIHt9KTtcblxuXHRcdGlmICghdGhpcy5jb29sZG93bnMuZ2V0KGlkKSFbY29tbWFuZC5pZF0pIHtcblx0XHRcdHRoaXMuY29vbGRvd25zLmdldChpZCkhW2NvbW1hbmQuaWRdID0ge1xuXHRcdFx0XHR0aW1lcjogc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuY29vbGRvd25zLmdldChpZCkhW2NvbW1hbmQuaWRdKSB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy5jb29sZG93bnMuZ2V0KGlkKSFbY29tbWFuZC5pZF0udGltZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLmNvb2xkb3ducy5nZXQoaWQpIVtjb21tYW5kLmlkXSA9IG51bGwhO1xuXG5cdFx0XHRcdFx0aWYgKCFPYmplY3Qua2V5cyh0aGlzLmNvb2xkb3ducy5nZXQoaWQpISkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmNvb2xkb3ducy5kZWxldGUoaWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGltZSkudW5yZWYoKSxcblx0XHRcdFx0ZW5kOiBlbmRUaW1lLFxuXHRcdFx0XHR1c2VzOiAwXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNvbnN0IGVudHJ5ID0gdGhpcy5jb29sZG93bnMuZ2V0KGlkKSFbY29tbWFuZC5pZF07XG5cblx0XHRpZiAoZW50cnkudXNlcyA+PSBjb21tYW5kLnJhdGVsaW1pdCkge1xuXHRcdFx0Y29uc3QgZW5kID0gdGhpcy5jb29sZG93bnMuZ2V0KGlkKSFbY29tbWFuZC5pZF0uZW5kO1xuXHRcdFx0Y29uc3QgZGlmZiA9IGVuZCAtIG1lc3NhZ2UuY3JlYXRlZFRpbWVzdGFtcDtcblxuXHRcdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLkNPT0xET1dOLCBtZXNzYWdlLCBjb21tYW5kLCBkaWZmKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGVudHJ5LnVzZXMrKztcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogUnVucyBhIGNvbW1hbmQuXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0byBoYW5kbGUuXG5cdCAqIEBwYXJhbSBjb21tYW5kIC0gQ29tbWFuZCB0byBoYW5kbGUuXG5cdCAqIEBwYXJhbSBhcmdzIC0gQXJndW1lbnRzIHRvIHVzZS5cblx0ICovXG5cdHB1YmxpYyBhc3luYyBydW5Db21tYW5kKG1lc3NhZ2U6IE1lc3NhZ2UsIGNvbW1hbmQ6IENvbW1hbmQsIGFyZ3M6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuXHRcdGlmICghY29tbWFuZCB8fCAhbWVzc2FnZSkge1xuXHRcdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLkNPTU1BTkRfSU5WQUxJRCwgbWVzc2FnZSwgY29tbWFuZCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmIChjb21tYW5kLnR5cGluZyB8fCB0aGlzLnR5cGluZykge1xuXHRcdFx0bWVzc2FnZS5jaGFubmVsLnNlbmRUeXBpbmcoKTtcblx0XHR9XG5cblx0XHR0aGlzLmVtaXQoQ29tbWFuZEhhbmRsZXJFdmVudHMuQ09NTUFORF9TVEFSVEVELCBtZXNzYWdlLCBjb21tYW5kLCBhcmdzKTtcblx0XHRjb25zdCByZXQgPSBhd2FpdCBjb21tYW5kLmV4ZWMobWVzc2FnZSwgYXJncyk7XG5cdFx0dGhpcy5lbWl0KENvbW1hbmRIYW5kbGVyRXZlbnRzLkNPTU1BTkRfRklOSVNIRUQsIG1lc3NhZ2UsIGNvbW1hbmQsIGFyZ3MsIHJldCk7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSBjb21tYW5kIGFuZCBpdHMgYXJndW1lbnQgbGlzdC5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRoYXQgY2FsbGVkIHRoZSBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIGFzeW5jIHBhcnNlQ29tbWFuZChtZXNzYWdlOiBNZXNzYWdlIHwgQWthaXJvTWVzc2FnZSk6IFByb21pc2U8UGFyc2VkQ29tcG9uZW50RGF0YT4ge1xuXHRcdGNvbnN0IGFsbG93TWVudGlvbiA9IGF3YWl0IFV0aWwuaW50b0NhbGxhYmxlKHRoaXMucHJlZml4KShtZXNzYWdlKTtcblx0XHRsZXQgcHJlZml4ZXMgPSBVdGlsLmludG9BcnJheShhbGxvd01lbnRpb24pO1xuXHRcdGlmIChhbGxvd01lbnRpb24pIHtcblx0XHRcdGNvbnN0IG1lbnRpb25zID0gW2A8QCR7dGhpcy5jbGllbnQudXNlcj8uaWR9PmAsIGA8QCEke3RoaXMuY2xpZW50LnVzZXI/LmlkfT5gXTtcblx0XHRcdHByZWZpeGVzID0gWy4uLm1lbnRpb25zLCAuLi5wcmVmaXhlc107XG5cdFx0fVxuXG5cdFx0cHJlZml4ZXMuc29ydChVdGlsLnByZWZpeENvbXBhcmUpO1xuXHRcdHJldHVybiB0aGlzLnBhcnNlTXVsdGlwbGVQcmVmaXhlcyhcblx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRwcmVmaXhlcy5tYXAocCA9PiBbcCwgbnVsbF0pXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgdGhlIGNvbW1hbmQgYW5kIGl0cyBhcmd1bWVudCBsaXN0IHVzaW5nIHByZWZpeCBvdmVyd3JpdGVzLlxuXHQgKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdGhhdCBjYWxsZWQgdGhlIGNvbW1hbmQuXG5cdCAqL1xuXHRwdWJsaWMgYXN5bmMgcGFyc2VDb21tYW5kT3ZlcndyaXR0ZW5QcmVmaXhlcyhtZXNzYWdlOiBNZXNzYWdlIHwgQWthaXJvTWVzc2FnZSk6IFByb21pc2U8UGFyc2VkQ29tcG9uZW50RGF0YT4ge1xuXHRcdGlmICghdGhpcy5wcmVmaXhlcy5zaXplKSB7XG5cdFx0XHRyZXR1cm4ge307XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJvbWlzZXMgPSB0aGlzLnByZWZpeGVzLm1hcChhc3luYyAoY21kcywgcHJvdmlkZXIpID0+IHtcblx0XHRcdGNvbnN0IHByZWZpeGVzID0gVXRpbC5pbnRvQXJyYXkoYXdhaXQgVXRpbC5pbnRvQ2FsbGFibGUocHJvdmlkZXIpKG1lc3NhZ2UpKTtcblx0XHRcdHJldHVybiBwcmVmaXhlcy5tYXAocCA9PiBbcCwgY21kc10pO1xuXHRcdH0pO1xuXG5cdFx0Y29uc3QgcGFpcnMgPSBVdGlsLmZsYXRNYXAoYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpLCAoeDogYW55KSA9PiB4KTtcblx0XHRwYWlycy5zb3J0KChbYV06IGFueSwgW2JdOiBhbnkpID0+IFV0aWwucHJlZml4Q29tcGFyZShhLCBiKSk7XG5cdFx0cmV0dXJuIHRoaXMucGFyc2VNdWx0aXBsZVByZWZpeGVzKG1lc3NhZ2UsIHBhaXJzIGFzIFtzdHJpbmcsIFNldDxzdHJpbmc+XVtdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW5zIHBhcnNlV2l0aFByZWZpeCBvbiBtdWx0aXBsZSBwcmVmaXhlcyBhbmQgcmV0dXJucyB0aGUgYmVzdCBwYXJzZS5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIHBhcnNlLlxuXHQgKiBAcGFyYW0gcGFpcnMgLSBQYWlycyBvZiBwcmVmaXggdG8gYXNzb2NpYXRlZCBjb21tYW5kcy4gVGhhdCBpcywgYFtzdHJpbmcsIFNldDxzdHJpbmc+IHwgbnVsbF1bXWAuXG5cdCAqL1xuXHRwdWJsaWMgcGFyc2VNdWx0aXBsZVByZWZpeGVzKFxuXHRcdG1lc3NhZ2U6IE1lc3NhZ2UgfCBBa2Fpcm9NZXNzYWdlLFxuXHRcdHBhaXJzOiBbc3RyaW5nLCBTZXQ8c3RyaW5nPiB8IG51bGxdW11cblx0KTogUGFyc2VkQ29tcG9uZW50RGF0YSB7XG5cdFx0Y29uc3QgcGFyc2VzID0gcGFpcnMubWFwKChbcHJlZml4LCBjbWRzXSkgPT4gdGhpcy5wYXJzZVdpdGhQcmVmaXgobWVzc2FnZSwgcHJlZml4LCBjbWRzKSk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gcGFyc2VzLmZpbmQocGFyc2VkID0+IHBhcnNlZC5jb21tYW5kKTtcblx0XHRpZiAocmVzdWx0KSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGNvbnN0IGd1ZXNzID0gcGFyc2VzLmZpbmQocGFyc2VkID0+IHBhcnNlZC5wcmVmaXggIT0gbnVsbCk7XG5cdFx0aWYgKGd1ZXNzKSB7XG5cdFx0XHRyZXR1cm4gZ3Vlc3M7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyaWVzIHRvIHBhcnNlIGEgbWVzc2FnZSB3aXRoIHRoZSBnaXZlbiBwcmVmaXggYW5kIGFzc29jaWF0ZWQgY29tbWFuZHMuXG5cdCAqIEFzc29jaWF0ZWQgY29tbWFuZHMgcmVmZXIgdG8gd2hlbiBhIHByZWZpeCBpcyB1c2VkIGluIHByZWZpeCBvdmVycmlkZXMuXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0byBwYXJzZS5cblx0ICogQHBhcmFtIHByZWZpeCAtIFByZWZpeCB0byB1c2UuXG5cdCAqIEBwYXJhbSBhc3NvY2lhdGVkQ29tbWFuZHMgLSBBc3NvY2lhdGVkIGNvbW1hbmRzLlxuXHQgKi9cblx0cHVibGljIHBhcnNlV2l0aFByZWZpeChcblx0XHRtZXNzYWdlOiBNZXNzYWdlIHwgQWthaXJvTWVzc2FnZSxcblx0XHRwcmVmaXg6IHN0cmluZyxcblx0XHRhc3NvY2lhdGVkQ29tbWFuZHM6IFNldDxzdHJpbmc+IHwgbnVsbCA9IG51bGxcblx0KTogUGFyc2VkQ29tcG9uZW50RGF0YSB7XG5cdFx0Y29uc3QgbG93ZXJDb250ZW50ID0gbWVzc2FnZS5jb250ZW50LnRvTG93ZXJDYXNlKCk7XG5cdFx0aWYgKCFsb3dlckNvbnRlbnQuc3RhcnRzV2l0aChwcmVmaXgudG9Mb3dlckNhc2UoKSkpIHtcblx0XHRcdHJldHVybiB7fTtcblx0XHR9XG5cblx0XHRjb25zdCBlbmRPZlByZWZpeCA9IGxvd2VyQ29udGVudC5pbmRleE9mKHByZWZpeC50b0xvd2VyQ2FzZSgpKSArIHByZWZpeC5sZW5ndGg7XG5cdFx0Y29uc3Qgc3RhcnRPZkFyZ3MgPSBtZXNzYWdlLmNvbnRlbnQuc2xpY2UoZW5kT2ZQcmVmaXgpLnNlYXJjaCgvXFxTLykgKyBwcmVmaXgubGVuZ3RoO1xuXHRcdGNvbnN0IGFsaWFzID0gbWVzc2FnZS5jb250ZW50LnNsaWNlKHN0YXJ0T2ZBcmdzKS5zcGxpdCgvXFxzezEsfXxcXG57MSx9LylbMF07XG5cdFx0Y29uc3QgY29tbWFuZCA9IHRoaXMuZmluZENvbW1hbmQoYWxpYXMpO1xuXHRcdGNvbnN0IGNvbnRlbnQgPSBtZXNzYWdlLmNvbnRlbnQuc2xpY2Uoc3RhcnRPZkFyZ3MgKyBhbGlhcy5sZW5ndGggKyAxKS50cmltKCk7XG5cdFx0Y29uc3QgYWZ0ZXJQcmVmaXggPSBtZXNzYWdlLmNvbnRlbnQuc2xpY2UocHJlZml4Lmxlbmd0aCkudHJpbSgpO1xuXG5cdFx0aWYgKCFjb21tYW5kKSB7XG5cdFx0XHRyZXR1cm4geyBwcmVmaXgsIGFsaWFzLCBjb250ZW50LCBhZnRlclByZWZpeCB9O1xuXHRcdH1cblxuXHRcdGlmIChhc3NvY2lhdGVkQ29tbWFuZHMgPT0gbnVsbCkge1xuXHRcdFx0aWYgKGNvbW1hbmQucHJlZml4ICE9IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIHsgcHJlZml4LCBhbGlhcywgY29udGVudCwgYWZ0ZXJQcmVmaXggfTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCFhc3NvY2lhdGVkQ29tbWFuZHMuaGFzKGNvbW1hbmQuaWQpKSB7XG5cdFx0XHRyZXR1cm4geyBwcmVmaXgsIGFsaWFzLCBjb250ZW50LCBhZnRlclByZWZpeCB9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7IGNvbW1hbmQsIHByZWZpeCwgYWxpYXMsIGNvbnRlbnQsIGFmdGVyUHJlZml4IH07XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBlcnJvcnMgZnJvbSB0aGUgaGFuZGxpbmcuXG5cdCAqIEBwYXJhbSBlcnIgLSBUaGUgZXJyb3IuXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0aGF0IGNhbGxlZCB0aGUgY29tbWFuZC5cblx0ICogQHBhcmFtIGNvbW1hbmQgLSBDb21tYW5kIHRoYXQgZXJyb3JlZC5cblx0ICovXG5cdHB1YmxpYyBlbWl0RXJyb3IoZXJyOiBFcnJvciwgbWVzc2FnZTogTWVzc2FnZSB8IEFrYWlyb01lc3NhZ2UsIGNvbW1hbmQ/OiBDb21tYW5kIHwgQWthaXJvTW9kdWxlKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMubGlzdGVuZXJDb3VudChDb21tYW5kSGFuZGxlckV2ZW50cy5FUlJPUikpIHtcblx0XHRcdHRoaXMuZW1pdChDb21tYW5kSGFuZGxlckV2ZW50cy5FUlJPUiwgZXJyLCBtZXNzYWdlLCBjb21tYW5kKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aHJvdyBlcnI7XG5cdH1cblxuXHQvKipcblx0ICogU3dlZXAgY29tbWFuZCB1dGlsIGluc3RhbmNlcyBmcm9tIGNhY2hlIGFuZCByZXR1cm5zIGFtb3VudCBzd2VlcGVkLlxuXHQgKiBAcGFyYW0gbGlmZXRpbWUgLSBNZXNzYWdlcyBvbGRlciB0aGFuIHRoaXMgd2lsbCBoYXZlIHRoZWlyIGNvbW1hbmQgdXRpbCBpbnN0YW5jZSBzd2VlcGVkLiBUaGlzIGlzIGluIG1pbGxpc2Vjb25kcyBhbmQgZGVmYXVsdHMgdG8gdGhlIGBjb21tYW5kVXRpbExpZmV0aW1lYCBvcHRpb24uXG5cdCAqL1xuXHRwdWJsaWMgc3dlZXBDb21tYW5kVXRpbChsaWZldGltZTogbnVtYmVyID0gdGhpcy5jb21tYW5kVXRpbExpZmV0aW1lKTogbnVtYmVyIHtcblx0XHRsZXQgY291bnQgPSAwO1xuXHRcdGZvciAoY29uc3QgY29tbWFuZFV0aWwgb2YgdGhpcy5jb21tYW5kVXRpbHMudmFsdWVzKCkpIHtcblx0XHRcdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHRjb25zdCBtZXNzYWdlID0gY29tbWFuZFV0aWwubWVzc2FnZTtcblx0XHRcdGlmIChub3cgLSAoKG1lc3NhZ2UgYXMgTWVzc2FnZSkuZWRpdGVkVGltZXN0YW1wIHx8IG1lc3NhZ2UuY3JlYXRlZFRpbWVzdGFtcCkgPiBsaWZldGltZSkge1xuXHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHR0aGlzLmNvbW1hbmRVdGlscy5kZWxldGUobWVzc2FnZS5pZCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvdW50O1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYW4gb25nb2luZyBwcm9tcHQgaW4gb3JkZXIgdG8gcHJldmVudCBjb21tYW5kIHVzYWdlIGluIHRoZSBjaGFubmVsLlxuXHQgKiBAcGFyYW0gY2hhbm5lbCAtIENoYW5uZWwgdG8gYWRkIHRvLlxuXHQgKiBAcGFyYW0gdXNlciAtIFVzZXIgdG8gYWRkLlxuXHQgKi9cblx0cHVibGljIGFkZFByb21wdChjaGFubmVsOiBUZXh0QmFzZWRDaGFubmVscywgdXNlcjogVXNlcik6IHZvaWQge1xuXHRcdGxldCB1c2VycyA9IHRoaXMucHJvbXB0cy5nZXQoY2hhbm5lbC5pZCk7XG5cdFx0aWYgKCF1c2VycykgdGhpcy5wcm9tcHRzLnNldChjaGFubmVsLmlkLCBuZXcgU2V0KCkpO1xuXHRcdHVzZXJzID0gdGhpcy5wcm9tcHRzLmdldChjaGFubmVsLmlkKTtcblx0XHR1c2Vycz8uYWRkKHVzZXIuaWQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYW4gb25nb2luZyBwcm9tcHQuXG5cdCAqIEBwYXJhbSBjaGFubmVsIC0gQ2hhbm5lbCB0byByZW1vdmUgZnJvbS5cblx0ICogQHBhcmFtIHVzZXIgLSBVc2VyIHRvIHJlbW92ZS5cblx0ICovXG5cdHB1YmxpYyByZW1vdmVQcm9tcHQoY2hhbm5lbDogVGV4dEJhc2VkQ2hhbm5lbHMsIHVzZXI6IFVzZXIpOiB2b2lkIHtcblx0XHRjb25zdCB1c2VycyA9IHRoaXMucHJvbXB0cy5nZXQoY2hhbm5lbC5pZCk7XG5cdFx0aWYgKCF1c2VycykgcmV0dXJuO1xuXHRcdHVzZXJzLmRlbGV0ZSh1c2VyLmlkKTtcblx0XHRpZiAoIXVzZXJzLnNpemUpIHRoaXMucHJvbXB0cy5kZWxldGUodXNlci5pZCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZXJlIGlzIGFuIG9uZ29pbmcgcHJvbXB0LlxuXHQgKiBAcGFyYW0gY2hhbm5lbCAtIENoYW5uZWwgdG8gY2hlY2suXG5cdCAqIEBwYXJhbSB1c2VyIC0gVXNlciB0byBjaGVjay5cblx0ICovXG5cdHB1YmxpYyBoYXNQcm9tcHQoY2hhbm5lbDogVGV4dEJhc2VkQ2hhbm5lbHMsIHVzZXI6IFVzZXIpOiBib29sZWFuIHtcblx0XHRjb25zdCB1c2VycyA9IHRoaXMucHJvbXB0cy5nZXQoY2hhbm5lbC5pZCk7XG5cdFx0aWYgKCF1c2VycykgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB1c2Vycy5oYXModXNlci5pZCk7XG5cdH1cblxuXHQvKipcblx0ICogRmluZHMgYSBjb21tYW5kIGJ5IGFsaWFzLlxuXHQgKiBAcGFyYW0gbmFtZSAtIEFsaWFzIHRvIGZpbmQgd2l0aC5cblx0ICovXG5cdHB1YmxpYyBmaW5kQ29tbWFuZChuYW1lOiBzdHJpbmcpOiBDb21tYW5kIHtcblx0XHRyZXR1cm4gdGhpcy5tb2R1bGVzLmdldCh0aGlzLmFsaWFzZXMuZ2V0KG5hbWUudG9Mb3dlckNhc2UoKSkhKSE7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBpbmhpYml0b3IgaGFuZGxlciB0byB1c2UuXG5cdCAqIEBwYXJhbSBpbmhpYml0b3JIYW5kbGVyIC0gVGhlIGluaGliaXRvciBoYW5kbGVyLlxuXHQgKi9cblx0cHVibGljIHVzZUluaGliaXRvckhhbmRsZXIoaW5oaWJpdG9ySGFuZGxlcjogSW5oaWJpdG9ySGFuZGxlcik6IENvbW1hbmRIYW5kbGVyIHtcblx0XHR0aGlzLmluaGliaXRvckhhbmRsZXIgPSBpbmhpYml0b3JIYW5kbGVyO1xuXHRcdHRoaXMucmVzb2x2ZXIuaW5oaWJpdG9ySGFuZGxlciA9IGluaGliaXRvckhhbmRsZXI7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIGxpc3RlbmVyIGhhbmRsZXIgdG8gdXNlLlxuXHQgKiBAcGFyYW0gbGlzdGVuZXJIYW5kbGVyIC0gVGhlIGxpc3RlbmVyIGhhbmRsZXIuXG5cdCAqL1xuXHRwdWJsaWMgdXNlTGlzdGVuZXJIYW5kbGVyKGxpc3RlbmVySGFuZGxlcjogTGlzdGVuZXJIYW5kbGVyKTogQ29tbWFuZEhhbmRsZXIge1xuXHRcdHRoaXMucmVzb2x2ZXIubGlzdGVuZXJIYW5kbGVyID0gbGlzdGVuZXJIYW5kbGVyO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogTG9hZHMgYSBjb21tYW5kLlxuXHQgKiBAcGFyYW0gdGhpbmcgLSBNb2R1bGUgb3IgcGF0aCB0byBtb2R1bGUuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgbG9hZCh0aGluZzogc3RyaW5nIHwgQ29tbWFuZCk6IFByb21pc2U8Q29tbWFuZD4ge1xuXHRcdHJldHVybiBzdXBlci5sb2FkKHRoaW5nKSBhcyBQcm9taXNlPENvbW1hbmQ+O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlYWRzIGFsbCBjb21tYW5kcyBmcm9tIHRoZSBkaXJlY3RvcnkgYW5kIGxvYWRzIHRoZW0uXG5cdCAqIEBwYXJhbSBkaXJlY3RvcnkgLSBEaXJlY3RvcnkgdG8gbG9hZCBmcm9tLiBEZWZhdWx0cyB0byB0aGUgZGlyZWN0b3J5IHBhc3NlZCBpbiB0aGUgY29uc3RydWN0b3IuXG5cdCAqIEBwYXJhbSBmaWx0ZXIgLSBGaWx0ZXIgZm9yIGZpbGVzLCB3aGVyZSB0cnVlIG1lYW5zIGl0IHNob3VsZCBiZSBsb2FkZWQuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgbG9hZEFsbChkaXJlY3Rvcnk/OiBzdHJpbmcsIGZpbHRlcj86IExvYWRQcmVkaWNhdGUpOiBQcm9taXNlPENvbW1hbmRIYW5kbGVyPiB7XG5cdFx0cmV0dXJuIHN1cGVyLmxvYWRBbGwoZGlyZWN0b3J5LCBmaWx0ZXIpIGFzIFByb21pc2U8Q29tbWFuZEhhbmRsZXI+O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYSBjb21tYW5kLlxuXHQgKiBAcGFyYW0gaWQgLSBJRCBvZiB0aGUgY29tbWFuZC5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZW1vdmUoaWQ6IHN0cmluZyk6IENvbW1hbmQge1xuXHRcdHJldHVybiBzdXBlci5yZW1vdmUoaWQpIGFzIENvbW1hbmQ7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgY29tbWFuZHMuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVtb3ZlQWxsKCk6IENvbW1hbmRIYW5kbGVyIHtcblx0XHRyZXR1cm4gc3VwZXIucmVtb3ZlQWxsKCkgYXMgQ29tbWFuZEhhbmRsZXI7XG5cdH1cblxuXHQvKipcblx0ICogUmVsb2FkcyBhIGNvbW1hbmQuXG5cdCAqIEBwYXJhbSBpZCAtIElEIG9mIHRoZSBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIHJlbG9hZChpZDogc3RyaW5nKTogUHJvbWlzZTxDb21tYW5kPiB7XG5cdFx0cmV0dXJuIHN1cGVyLnJlbG9hZChpZCkgYXMgUHJvbWlzZTxDb21tYW5kPjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWxvYWRzIGFsbCBjb21tYW5kcy5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZWxvYWRBbGwoKTogUHJvbWlzZTxDb21tYW5kSGFuZGxlcj4ge1xuXHRcdHJldHVybiBzdXBlci5yZWxvYWRBbGwoKSBhcyBQcm9taXNlPENvbW1hbmRIYW5kbGVyPjtcblx0fVxuXG5cdHB1YmxpYyBvdmVycmlkZSBvbjxLIGV4dGVuZHMga2V5b2YgQ29tbWFuZEhhbmRsZXJFdmVudHNUeXBlPihcblx0XHRldmVudDogSyxcblx0XHRsaXN0ZW5lcjogKC4uLmFyZ3M6IENvbW1hbmRIYW5kbGVyRXZlbnRzVHlwZVtLXVtdKSA9PiBBd2FpdGFibGU8dm9pZD5cblx0KTogdGhpcyB7XG5cdFx0cmV0dXJuIHN1cGVyLm9uKGV2ZW50LCBsaXN0ZW5lcik7XG5cdH1cblx0cHVibGljIG92ZXJyaWRlIG9uY2U8SyBleHRlbmRzIGtleW9mIENvbW1hbmRIYW5kbGVyRXZlbnRzVHlwZT4oXG5cdFx0ZXZlbnQ6IEssXG5cdFx0bGlzdGVuZXI6ICguLi5hcmdzOiBDb21tYW5kSGFuZGxlckV2ZW50c1R5cGVbS11bXSkgPT4gQXdhaXRhYmxlPHZvaWQ+XG5cdCk6IHRoaXMge1xuXHRcdHJldHVybiBzdXBlci5vbmNlKGV2ZW50LCBsaXN0ZW5lcik7XG5cdH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21tYW5kSGFuZGxlck9wdGlvbnMgZXh0ZW5kcyBBa2Fpcm9IYW5kbGVyT3B0aW9ucyB7XG5cdC8qKlxuXHQgKiBSZWd1bGFyIGV4cHJlc3Npb24gdG8gYXV0b21hdGljYWxseSBtYWtlIGNvbW1hbmQgYWxpYXNlcy5cblx0ICogRm9yIGV4YW1wbGUsIHVzaW5nIGAvLS9nYCB3b3VsZCBtZWFuIHRoYXQgYWxpYXNlcyBjb250YWluaW5nIGAtYCB3b3VsZCBiZSB2YWxpZCB3aXRoIGFuZCB3aXRob3V0IGl0LlxuXHQgKiBTbywgdGhlIGFsaWFzIGBjb21tYW5kLW5hbWVgIGlzIHZhbGlkIGFzIGJvdGggYGNvbW1hbmQtbmFtZWAgYW5kIGBjb21tYW5kbmFtZWAuXG5cdCAqL1xuXHRhbGlhc1JlcGxhY2VtZW50PzogUmVnRXhwO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byBhbGxvdyBtZW50aW9ucyB0byB0aGUgY2xpZW50IHVzZXIgYXMgYSBwcmVmaXguXG5cdCAqL1xuXHRhbGxvd01lbnRpb24/OiBib29sZWFuIHwgTWVudGlvblByZWZpeFByZWRpY2F0ZTtcblxuXHQvKipcblx0ICogRGVmYXVsdCBhcmd1bWVudCBvcHRpb25zLlxuXHQgKi9cblx0YXJndW1lbnREZWZhdWx0cz86IERlZmF1bHRBcmd1bWVudE9wdGlvbnM7XG5cblx0LyoqXG5cdCAqIEF1dG9tYXRpY2FsbHkgZGVmZXIgbWVzc2FnZXMgXCJCb3ROYW1lIGlzIHRoaW5raW5nXCJcblx0ICovXG5cdGF1dG9EZWZlcj86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFNwZWNpZnkgd2hldGhlciB0byByZWdpc3RlciBhbGwgc2xhc2ggY29tbWFuZHMgd2hlbiBzdGFydGluZyB0aGUgY2xpZW50LlxuXHQgKi9cblx0YXV0b1JlZ2lzdGVyU2xhc2hDb21tYW5kcz86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIGJsb2NrIGJvdHMuXG5cdCAqL1xuXHRibG9ja0JvdHM/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byBibG9jayBzZWxmLlxuXHQgKi9cblx0YmxvY2tDbGllbnQ/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byBhc3NpZ24gYG1lc3NhZ2UudXRpbGAuXG5cdCAqL1xuXHRjb21tYW5kVXRpbD86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIE1pbGxpc2Vjb25kcyBhIG1lc3NhZ2Ugc2hvdWxkIGV4aXN0IGZvciBiZWZvcmUgaXRzIGNvbW1hbmQgdXRpbCBpbnN0YW5jZSBpcyBtYXJrZWQgZm9yIHJlbW92YWwuXG5cdCAqIElmIDAsIENvbW1hbmRVdGlsIGluc3RhbmNlcyB3aWxsIG5ldmVyIGJlIHJlbW92ZWQgYW5kIHdpbGwgY2F1c2UgbWVtb3J5IHRvIGluY3JlYXNlIGluZGVmaW5pdGVseS5cblx0ICovXG5cdGNvbW1hbmRVdGlsTGlmZXRpbWU/OiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFRpbWUgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGZvciBzd2VlcGluZyBjb21tYW5kIHV0aWwgaW5zdGFuY2VzLlxuXHQgKiBJZiAwLCBDb21tYW5kVXRpbCBpbnN0YW5jZXMgd2lsbCBuZXZlciBiZSByZW1vdmVkIGFuZCB3aWxsIGNhdXNlIG1lbW9yeSB0byBpbmNyZWFzZSBpbmRlZmluaXRlbHkuXG5cdCAqL1xuXHRjb21tYW5kVXRpbFN3ZWVwSW50ZXJ2YWw/OiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgY29vbGRvd24gZm9yIGNvbW1hbmRzLlxuXHQgKi9cblx0ZGVmYXVsdENvb2xkb3duPzogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCBtZW1iZXJzIGFyZSBmZXRjaGVkIG9uIGVhY2ggbWVzc2FnZSBhdXRob3IgZnJvbSBhIGd1aWxkLlxuXHQgKi9cblx0ZmV0Y2hNZW1iZXJzPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gaGFuZGxlIGVkaXRlZCBtZXNzYWdlcyB1c2luZyBDb21tYW5kVXRpbC5cblx0ICovXG5cdGhhbmRsZUVkaXRzPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogSUQgb2YgdXNlcihzKSB0byBpZ25vcmUgY29vbGRvd24gb3IgYSBmdW5jdGlvbiB0byBpZ25vcmUuIERlZmF1bHRzIHRvIHRoZSBjbGllbnQgb3duZXIocykuXG5cdCAqL1xuXHRpZ25vcmVDb29sZG93bj86IFNub3dmbGFrZSB8IFNub3dmbGFrZVtdIHwgSWdub3JlQ2hlY2tQcmVkaWNhdGU7XG5cblx0LyoqXG5cdCAqIElEIG9mIHVzZXIocykgdG8gaWdub3JlIGB1c2VyUGVybWlzc2lvbnNgIGNoZWNrcyBvciBhIGZ1bmN0aW9uIHRvIGlnbm9yZS5cblx0ICovXG5cdGlnbm9yZVBlcm1pc3Npb25zPzogU25vd2ZsYWtlIHwgU25vd2ZsYWtlW10gfCBJZ25vcmVDaGVja1ByZWRpY2F0ZTtcblxuXHQvKipcblx0ICogVGhlIHByZWZpeChlcykgZm9yIGNvbW1hbmQgcGFyc2luZy5cblx0ICovXG5cdHByZWZpeD86IHN0cmluZyB8IHN0cmluZ1tdIHwgUHJlZml4U3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIHN0b3JlIG1lc3NhZ2VzIGluIENvbW1hbmRVdGlsLlxuXHQgKi9cblx0c3RvcmVNZXNzYWdlcz86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFNob3cgXCJCb3ROYW1lIGlzIHR5cGluZ1wiIGluZm9ybWF0aW9uIG1lc3NhZ2Ugb24gdGhlIHRleHQgY2hhbm5lbHMgd2hlbiBhIGNvbW1hbmQgaXMgcnVubmluZy5cblx0ICovXG5cdHR5cGluZz86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIHVzZSBleGVjU2xhc2ggZm9yIHNsYXNoIGNvbW1hbmRzLlxuXHQgKi9cblx0ZXhlY1NsYXNoPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gc2tpcCBidWlsdCBpbiByZWFzb25zIHBvc3QgdHlwZSBpbmhpYml0b3JzIHNvIHlvdSBjYW4gbWFrZSBjdXN0b20gb25lcy5cblx0ICovXG5cdHNraXBCdWlsdEluUG9zdEluaGliaXRvcnM/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBVc2Ugc2xhc2ggY29tbWFuZCBwZXJtaXNzaW9ucyBmb3Igb3duZXIgb25seSBjb21tYW5kc1xuXHQgKiBXYXJuaW5nOiB0aGlzIGlzIGV4cGVyaW1lbnRhbFxuXHQgKi9cblx0dXNlU2xhc2hQZXJtaXNzaW9ucz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogRGF0YSBmb3IgbWFuYWdpbmcgY29vbGRvd25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvb2xkb3duRGF0YSB7XG5cdC8qKlxuXHQgKiBXaGVuIHRoZSBjb29sZG93biBlbmRzLlxuXHQgKi9cblx0ZW5kOiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFRpbWVvdXQgb2JqZWN0LlxuXHQgKi9cblx0dGltZXI6IE5vZGVKUy5UaW1lcjtcblxuXHQvKipcblx0ICogTnVtYmVyIG9mIHRpbWVzIHRoZSBjb21tYW5kIGhhcyBiZWVuIHVzZWQuXG5cdCAqL1xuXHR1c2VzOiBudW1iZXI7XG59XG5cbi8qKlxuICogVmFyaW91cyBwYXJzZWQgY29tcG9uZW50cyBvZiB0aGUgbWVzc2FnZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJzZWRDb21wb25lbnREYXRhIHtcblx0LyoqXG5cdCAqIFRoZSBjb250ZW50IHRvIHRoZSByaWdodCBvZiB0aGUgcHJlZml4LlxuXHQgKi9cblx0YWZ0ZXJQcmVmaXg/OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBhbGlhcyB1c2VkLlxuXHQgKi9cblx0YWxpYXM/OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBjb21tYW5kIHVzZWQuXG5cdCAqL1xuXHRjb21tYW5kPzogQ29tbWFuZDtcblxuXHQvKipcblx0ICogVGhlIGNvbnRlbnQgdG8gdGhlIHJpZ2h0IG9mIHRoZSBhbGlhcy5cblx0ICovXG5cdGNvbnRlbnQ/OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBwcmVmaXggdXNlZC5cblx0ICovXG5cdHByZWZpeD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB3aGV0aGVyIHRoaXMgbWVzc2FnZSBzaG91bGQgYmUgaWdub3JlZCBmb3IgYSBjZXJ0YWluIGNoZWNrLlxuICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGNoZWNrLlxuICogQHBhcmFtIGNvbW1hbmQgLSBDb21tYW5kIHRvIGNoZWNrLlxuICovXG5leHBvcnQgdHlwZSBJZ25vcmVDaGVja1ByZWRpY2F0ZSA9IChtZXNzYWdlOiBNZXNzYWdlIHwgQWthaXJvTWVzc2FnZSwgY29tbWFuZDogQ29tbWFuZCkgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB3aGV0aGVyIG1lbnRpb25zIGNhbiBiZSB1c2VkIGFzIGEgcHJlZml4LlxuICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIG9wdGlvbiBmb3IuXG4gKi9cbmV4cG9ydCB0eXBlIE1lbnRpb25QcmVmaXhQcmVkaWNhdGUgPSAobWVzc2FnZTogTWVzc2FnZSkgPT4gYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj47XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHByZWZpeChlcykgdG8gdXNlLlxuICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGdldCBwcmVmaXggZm9yLlxuICovXG5leHBvcnQgdHlwZSBQcmVmaXhTdXBwbGllciA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiBzdHJpbmcgfCBzdHJpbmdbXSB8IFByb21pc2U8c3RyaW5nIHwgc3RyaW5nW10+O1xuIl19