"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AkairoError_1 = __importDefault(require("../../util/AkairoError"));
const AkairoModule_1 = __importDefault(require("../AkairoModule"));
const Argument_1 = __importDefault(require("./arguments/Argument"));
const ArgumentRunner_1 = __importDefault(require("./arguments/ArgumentRunner"));
const ContentParser_1 = __importDefault(require("./ContentParser"));
/**
 * Represents a command.
 * @param id - Command ID.
 * @param options - Options for the command.
 */
class Command extends AkairoModule_1.default {
    constructor(id, options) {
        super(id, { category: options.category });
        const { onlyNsfw = false, aliases = [], args = this._args || [], quoted = true, separator, channel = null, ownerOnly = false, superUserOnly = false, editable = true, typing = false, cooldown = null, ratelimit = 1, argumentDefaults = {}, description = "", prefix = this.prefix, clientPermissions = this.clientPermissions, userPermissions = this.userPermissions, regex = this.regex, 
        // @ts-expect-error
        condition = this.condition || (() => false), before = this.before || (() => undefined), lock, ignoreCooldown, ignorePermissions, flags = [], optionFlags = [], slash = false, slashOptions, slashEphemeral = false, slashGuilds = [] } = options;
        this.aliases = aliases;
        const { flagWords, optionFlagWords } = Array.isArray(args)
            ? ContentParser_1.default.getFlags(args)
            : { flagWords: flags, optionFlagWords: optionFlags };
        this.contentParser = new ContentParser_1.default({
            flagWords,
            optionFlagWords,
            quoted,
            separator
        });
        this.argumentRunner = new ArgumentRunner_1.default(this);
        this.argumentGenerator = Array.isArray(args)
            ? ArgumentRunner_1.default.fromArguments(
            // @ts-expect-error
            args.map(arg => [arg.id, new Argument_1.default(this, arg)]))
            : args.bind(this);
        this.onlyNsfw = Boolean(onlyNsfw);
        this.channel = channel;
        this.ownerOnly = Boolean(ownerOnly);
        this.superUserOnly = Boolean(superUserOnly);
        this.editable = Boolean(editable);
        this.typing = Boolean(typing);
        this.cooldown = cooldown;
        this.ratelimit = ratelimit;
        this.argumentDefaults = argumentDefaults;
        this.description = Array.isArray(description)
            ? description.join("\n")
            : description;
        this.prefix = typeof prefix === "function" ? prefix.bind(this) : prefix;
        this.clientPermissions =
            typeof clientPermissions === "function"
                ? clientPermissions.bind(this)
                : clientPermissions;
        this.userPermissions =
            typeof userPermissions === "function"
                ? userPermissions.bind(this)
                : userPermissions;
        this.regex = typeof regex === "function" ? regex.bind(this) : regex;
        this.condition = condition.bind(this);
        this.before = before.bind(this);
        this.lock = lock;
        if (typeof lock === "string") {
            this.lock = {
                guild: (message) => message.guild && message.guild.id,
                channel: (message) => message.channel.id,
                user: (message) => message.author.id
            }[lock];
        }
        if (this.lock) {
            this.locker = new Set();
        }
        this.ignoreCooldown =
            typeof ignoreCooldown === "function"
                ? ignoreCooldown.bind(this)
                : ignoreCooldown;
        this.ignorePermissions =
            typeof ignorePermissions === "function"
                ? ignorePermissions.bind(this)
                : ignorePermissions;
        this.slashOptions = slashOptions;
        this.slashEphemeral = slashEphemeral;
        this.slash = slash;
        this.slashGuilds = slashGuilds;
    }
    /**
     * Command names.
     */
    aliases;
    /**
     * Default prompt options.
     */
    argumentDefaults;
    /**
     * Usable only in this channel type.
     */
    channel;
    /**
     * Permissions required to run command by the client.
     */
    clientPermissions;
    /**
     * Cooldown in milliseconds.
     */
    cooldown;
    /**
     * Description of the command.
     */
    description;
    /**
     * Whether or not this command can be ran by an edit.
     */
    editable;
    /**
     * ID of user(s) to ignore cooldown or a function to ignore.
     */
    ignoreCooldown;
    /**
     * ID of user(s) to ignore `userPermissions` checks or a function to ignore.
     */
    ignorePermissions;
    /**
     * The key supplier for the locker.
     */
    lock;
    /**
     * Stores the current locks.
     */
    locker;
    /**
     * Whether or not the command can only be run in  NSFW channels.
     */
    onlyNsfw;
    /**
     * Usable only by the client owner.
     */
    ownerOnly;
    /**
     * Command prefix overwrite.
     */
    prefix;
    /**
     * Whether or not to consider quotes.
     */
    quoted;
    /**
     * Uses allowed before cooldown.
     */
    ratelimit;
    /**
     * The regex trigger for this command.
     */
    regex;
    /**
     * Mark command as slash command and set information.
     */
    slash;
    /**
     * Whether slash command responses for this command should be ephemeral or not.
     */
    slashEphemeral;
    /**
     * Assign slash commands to Specific guilds. This option will make the commands do not register globally, but only to the chosen servers.
     */
    slashGuilds;
    /**
     * Options for using the slash command.
     */
    slashOptions;
    /**
     * Whether or not to allow client superUsers(s) only.
     */
    superUserOnly;
    /**
     * Whether or not to type during command execution.
     */
    typing;
    /**
     * Permissions required to run command by the user.
     */
    userPermissions;
    /**
     * Argument options or generator.
     */
    _args;
    /**
     * The content parser.
     */
    contentParser;
    /**
     * The argument runner.
     */
    argumentRunner;
    /**
     * Generator for arguments.
     */
    argumentGenerator;
    // eslint-disable-next-line func-names, @typescript-eslint/no-unused-vars
    exec(message, args) {
        throw new AkairoError_1.default("NOT_IMPLEMENTED", this.constructor.name, "exec");
    }
    /**
     * Runs before argument parsing and execution.
     * @param message - Message being handled.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    before(message) { }
    /**
     * Checks if the command should be ran by using an arbitrary condition.
     * @param message - Message being handled.
     */
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    condition(message) { }
    /**
     * Execute the slash command
     * @param message - Message for slash command
     * @param args - Slash command options
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,  func-names
    execSlash(message, ...args) {
        if (this.slash) {
            throw new AkairoError_1.default("NOT_IMPLEMENTED", this.constructor.name, "execSlash");
        }
    }
    /**
     * Parses content using the command's arguments.
     * @param message - Message to use.
     * @param content - String to parse.
     */
    parse(message, content) {
        const parsed = this.contentParser.parse(content);
        return this.argumentRunner.run(message, parsed, this.argumentGenerator);
    }
    /**
     * Reloads the command.
     */
    reload() {
        return super.reload();
    }
    /**
     * Removes the command.
     */
    remove() {
        return super.remove();
    }
}
exports.default = Command;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zdHJ1Y3QvY29tbWFuZHMvQ29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLHlFQUFpRDtBQUlqRCxtRUFBb0U7QUFDcEUsb0VBRzhCO0FBQzlCLGdGQUVvQztBQUtwQyxvRUFBcUU7QUFHckU7Ozs7R0FJRztBQUNILE1BQThCLE9BQVEsU0FBUSxzQkFBWTtJQUN6RCxZQUFZLEVBQVUsRUFBRSxPQUF1QjtRQUM5QyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sRUFDTCxRQUFRLEdBQUcsS0FBSyxFQUNoQixPQUFPLEdBQUcsRUFBRSxFQUNaLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsRUFDdkIsTUFBTSxHQUFHLElBQUksRUFDYixTQUFTLEVBQ1QsT0FBTyxHQUFHLElBQUksRUFDZCxTQUFTLEdBQUcsS0FBSyxFQUNqQixhQUFhLEdBQUcsS0FBSyxFQUNyQixRQUFRLEdBQUcsSUFBSSxFQUNmLE1BQU0sR0FBRyxLQUFLLEVBQ2QsUUFBUSxHQUFHLElBQUksRUFDZixTQUFTLEdBQUcsQ0FBQyxFQUNiLGdCQUFnQixHQUFHLEVBQUUsRUFDckIsV0FBVyxHQUFHLEVBQUUsRUFDaEIsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQ3BCLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFDMUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQ3RDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSztRQUNsQixtQkFBbUI7UUFDbkIsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFDM0MsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUs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QUksQ0FBQyxPQUFnQyxFQUFFLElBQVM7UUFDdEQsTUFBTSxJQUFJLHFCQUFXLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOzs7T0FHRztJQUNILDZEQUE2RDtJQUN0RCxNQUFNLENBQUMsT0FBZ0IsSUFBUSxDQUFDO0lBRXZDOzs7T0FHRztJQUNILGFBQWE7SUFDYiw2REFBNkQ7SUFDdEQsU0FBUyxDQUFDLE9BQWdCLElBQStCLENBQUM7SUFFakU7Ozs7T0FJRztJQUNILDBFQUEwRTtJQUNuRSxTQUFTLENBQUMsT0FBc0IsRUFBRSxHQUFHLElBQVc7UUFDdEQsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsTUFBTSxJQUFJLHFCQUFXLENBQ3BCLGlCQUFpQixFQUNqQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFDckIsV0FBVyxDQUNYLENBQUM7U0FDRjtJQUNGLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLE9BQWdCLEVBQUUsT0FBZTtRQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOztPQUVHO0lBQ2EsTUFBTTtRQUNyQixPQUFPLEtBQUssQ0FBQyxNQUFNLEVBQWEsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7O09BRUc7SUFDYSxNQUFNO1FBQ3JCLE9BQU8sS0FBSyxDQUFDLE1BQU0sRUFBYSxDQUFDO0lBQ2xDLENBQUM7Q0FDRDtBQWhYRCwwQkFnWEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRNZXNzYWdlLFxuXHRQZXJtaXNzaW9uUmVzb2x2YWJsZSxcblx0U25vd2ZsYWtlLFxuXHRBcHBsaWNhdGlvbkNvbW1hbmRPcHRpb25EYXRhXG59IGZyb20gXCJkaXNjb3JkLmpzXCI7XG5pbXBvcnQgQWthaXJvRXJyb3IgZnJvbSBcIi4uLy4uL3V0aWwvQWthaXJvRXJyb3JcIjtcbmltcG9ydCBBa2Fpcm9NZXNzYWdlIGZyb20gXCIuLi8uLi91dGlsL0FrYWlyb01lc3NhZ2VcIjtcbmltcG9ydCBDYXRlZ29yeSBmcm9tIFwiLi4vLi4vdXRpbC9DYXRlZ29yeVwiO1xuaW1wb3J0IEFrYWlyb0NsaWVudCBmcm9tIFwiLi4vQWthaXJvQ2xpZW50XCI7XG5pbXBvcnQgQWthaXJvTW9kdWxlLCB7IEFrYWlyb01vZHVsZU9wdGlvbnMgfSBmcm9tIFwiLi4vQWthaXJvTW9kdWxlXCI7XG5pbXBvcnQgQXJndW1lbnQsIHtcblx0QXJndW1lbnRPcHRpb25zLFxuXHREZWZhdWx0QXJndW1lbnRPcHRpb25zXG59IGZyb20gXCIuL2FyZ3VtZW50cy9Bcmd1bWVudFwiO1xuaW1wb3J0IEFyZ3VtZW50UnVubmVyLCB7XG5cdEFyZ3VtZW50UnVubmVyU3RhdGVcbn0gZnJvbSBcIi4vYXJndW1lbnRzL0FyZ3VtZW50UnVubmVyXCI7XG5pbXBvcnQgQ29tbWFuZEhhbmRsZXIsIHtcblx0SWdub3JlQ2hlY2tQcmVkaWNhdGUsXG5cdFByZWZpeFN1cHBsaWVyXG59IGZyb20gXCIuL0NvbW1hbmRIYW5kbGVyXCI7XG5pbXBvcnQgQ29udGVudFBhcnNlciwgeyBDb250ZW50UGFyc2VyUmVzdWx0IH0gZnJvbSBcIi4vQ29udGVudFBhcnNlclwiO1xuaW1wb3J0IEZsYWcgZnJvbSBcIi4vRmxhZ1wiO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBjb21tYW5kLlxuICogQHBhcmFtIGlkIC0gQ29tbWFuZCBJRC5cbiAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIGNvbW1hbmQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIENvbW1hbmQgZXh0ZW5kcyBBa2Fpcm9Nb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBvcHRpb25zOiBDb21tYW5kT3B0aW9ucykge1xuXHRcdHN1cGVyKGlkLCB7IGNhdGVnb3J5OiBvcHRpb25zLmNhdGVnb3J5IH0pO1xuXG5cdFx0Y29uc3Qge1xuXHRcdFx0b25seU5zZncgPSBmYWxzZSxcblx0XHRcdGFsaWFzZXMgPSBbXSxcblx0XHRcdGFyZ3MgPSB0aGlzLl9hcmdzIHx8IFtdLFxuXHRcdFx0cXVvdGVkID0gdHJ1ZSxcblx0XHRcdHNlcGFyYXRvcixcblx0XHRcdGNoYW5uZWwgPSBudWxsLFxuXHRcdFx0b3duZXJPbmx5ID0gZmFsc2UsXG5cdFx0XHRzdXBlclVzZXJPbmx5ID0gZmFsc2UsXG5cdFx0XHRlZGl0YWJsZSA9IHRydWUsXG5cdFx0XHR0eXBpbmcgPSBmYWxzZSxcblx0XHRcdGNvb2xkb3duID0gbnVsbCxcblx0XHRcdHJhdGVsaW1pdCA9IDEsXG5cdFx0XHRhcmd1bWVudERlZmF1bHRzID0ge30sXG5cdFx0XHRkZXNjcmlwdGlvbiA9IFwiXCIsXG5cdFx0XHRwcmVmaXggPSB0aGlzLnByZWZpeCxcblx0XHRcdGNsaWVudFBlcm1pc3Npb25zID0gdGhpcy5jbGllbnRQZXJtaXNzaW9ucyxcblx0XHRcdHVzZXJQZXJtaXNzaW9ucyA9IHRoaXMudXNlclBlcm1pc3Npb25zLFxuXHRcdFx0cmVnZXggPSB0aGlzLnJlZ2V4LFxuXHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvclxuXHRcdFx0Y29uZGl0aW9uID0gdGhpcy5jb25kaXRpb24gfHwgKCgpID0+IGZhbHNlKSxcblx0XHRcdGJlZm9yZSA9IHRoaXMuYmVmb3JlIHx8ICgoKSA9PiB1bmRlZmluZWQpLFxuXHRcdFx0bG9jayxcblx0XHRcdGlnbm9yZUNvb2xkb3duLFxuXHRcdFx0aWdub3JlUGVybWlzc2lvbnMsXG5cdFx0XHRmbGFncyA9IFtdLFxuXHRcdFx0b3B0aW9uRmxhZ3MgPSBbXSxcblx0XHRcdHNsYXNoID0gZmFsc2UsXG5cdFx0XHRzbGFzaE9wdGlvbnMsXG5cdFx0XHRzbGFzaEVwaGVtZXJhbCA9IGZhbHNlLFxuXHRcdFx0c2xhc2hHdWlsZHMgPSBbXVxuXHRcdH06IENvbW1hbmRPcHRpb25zID0gb3B0aW9ucztcblxuXHRcdHRoaXMuYWxpYXNlcyA9IGFsaWFzZXM7XG5cblx0XHRjb25zdCB7IGZsYWdXb3Jkcywgb3B0aW9uRmxhZ1dvcmRzIH0gPSBBcnJheS5pc0FycmF5KGFyZ3MpXG5cdFx0XHQ/IENvbnRlbnRQYXJzZXIuZ2V0RmxhZ3MoYXJncylcblx0XHRcdDogeyBmbGFnV29yZHM6IGZsYWdzLCBvcHRpb25GbGFnV29yZHM6IG9wdGlvbkZsYWdzIH07XG5cblx0XHR0aGlzLmNvbnRlbnRQYXJzZXIgPSBuZXcgQ29udGVudFBhcnNlcih7XG5cdFx0XHRmbGFnV29yZHMsXG5cdFx0XHRvcHRpb25GbGFnV29yZHMsXG5cdFx0XHRxdW90ZWQsXG5cdFx0XHRzZXBhcmF0b3Jcblx0XHR9KTtcblxuXHRcdHRoaXMuYXJndW1lbnRSdW5uZXIgPSBuZXcgQXJndW1lbnRSdW5uZXIodGhpcyk7XG5cdFx0dGhpcy5hcmd1bWVudEdlbmVyYXRvciA9IEFycmF5LmlzQXJyYXkoYXJncylcblx0XHRcdD8gQXJndW1lbnRSdW5uZXIuZnJvbUFyZ3VtZW50cyhcblx0XHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yXG5cdFx0XHRcdFx0YXJncy5tYXAoYXJnID0+IFthcmcuaWQsIG5ldyBBcmd1bWVudCh0aGlzLCBhcmcpXSlcblx0XHRcdCAgKVxuXHRcdFx0OiBhcmdzLmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLm9ubHlOc2Z3ID0gQm9vbGVhbihvbmx5TnNmdyk7XG5cblx0XHR0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuXG5cdFx0dGhpcy5vd25lck9ubHkgPSBCb29sZWFuKG93bmVyT25seSk7XG5cblx0XHR0aGlzLnN1cGVyVXNlck9ubHkgPSBCb29sZWFuKHN1cGVyVXNlck9ubHkpO1xuXG5cdFx0dGhpcy5lZGl0YWJsZSA9IEJvb2xlYW4oZWRpdGFibGUpO1xuXG5cdFx0dGhpcy50eXBpbmcgPSBCb29sZWFuKHR5cGluZyk7XG5cblx0XHR0aGlzLmNvb2xkb3duID0gY29vbGRvd247XG5cblx0XHR0aGlzLnJhdGVsaW1pdCA9IHJhdGVsaW1pdDtcblxuXHRcdHRoaXMuYXJndW1lbnREZWZhdWx0cyA9IGFyZ3VtZW50RGVmYXVsdHM7XG5cblx0XHR0aGlzLmRlc2NyaXB0aW9uID0gQXJyYXkuaXNBcnJheShkZXNjcmlwdGlvbilcblx0XHRcdD8gZGVzY3JpcHRpb24uam9pbihcIlxcblwiKVxuXHRcdFx0OiBkZXNjcmlwdGlvbjtcblxuXHRcdHRoaXMucHJlZml4ID0gdHlwZW9mIHByZWZpeCA9PT0gXCJmdW5jdGlvblwiID8gcHJlZml4LmJpbmQodGhpcykgOiBwcmVmaXg7XG5cblx0XHR0aGlzLmNsaWVudFBlcm1pc3Npb25zID1cblx0XHRcdHR5cGVvZiBjbGllbnRQZXJtaXNzaW9ucyA9PT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdD8gY2xpZW50UGVybWlzc2lvbnMuYmluZCh0aGlzKVxuXHRcdFx0XHQ6IGNsaWVudFBlcm1pc3Npb25zO1xuXG5cdFx0dGhpcy51c2VyUGVybWlzc2lvbnMgPVxuXHRcdFx0dHlwZW9mIHVzZXJQZXJtaXNzaW9ucyA9PT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdD8gdXNlclBlcm1pc3Npb25zLmJpbmQodGhpcylcblx0XHRcdFx0OiB1c2VyUGVybWlzc2lvbnM7XG5cblx0XHR0aGlzLnJlZ2V4ID0gdHlwZW9mIHJlZ2V4ID09PSBcImZ1bmN0aW9uXCIgPyByZWdleC5iaW5kKHRoaXMpIDogcmVnZXg7XG5cblx0XHR0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbi5iaW5kKHRoaXMpO1xuXG5cdFx0dGhpcy5iZWZvcmUgPSBiZWZvcmUuYmluZCh0aGlzKTtcblxuXHRcdHRoaXMubG9jayA9IGxvY2s7XG5cblx0XHRpZiAodHlwZW9mIGxvY2sgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHRoaXMubG9jayA9IHtcblx0XHRcdFx0Z3VpbGQ6IChtZXNzYWdlOiBNZXNzYWdlKSA9PiBtZXNzYWdlLmd1aWxkICYmIG1lc3NhZ2UuZ3VpbGQuaWQsXG5cdFx0XHRcdGNoYW5uZWw6IChtZXNzYWdlOiBNZXNzYWdlKSA9PiBtZXNzYWdlLmNoYW5uZWwuaWQsXG5cdFx0XHRcdHVzZXI6IChtZXNzYWdlOiBNZXNzYWdlKSA9PiBtZXNzYWdlLmF1dGhvci5pZFxuXHRcdFx0fVtsb2NrXTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5sb2NrKSB7XG5cdFx0XHR0aGlzLmxvY2tlciA9IG5ldyBTZXQoKTtcblx0XHR9XG5cblx0XHR0aGlzLmlnbm9yZUNvb2xkb3duID1cblx0XHRcdHR5cGVvZiBpZ25vcmVDb29sZG93biA9PT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdD8gaWdub3JlQ29vbGRvd24uYmluZCh0aGlzKVxuXHRcdFx0XHQ6IGlnbm9yZUNvb2xkb3duO1xuXG5cdFx0dGhpcy5pZ25vcmVQZXJtaXNzaW9ucyA9XG5cdFx0XHR0eXBlb2YgaWdub3JlUGVybWlzc2lvbnMgPT09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHQ/IGlnbm9yZVBlcm1pc3Npb25zLmJpbmQodGhpcylcblx0XHRcdFx0OiBpZ25vcmVQZXJtaXNzaW9ucztcblxuXHRcdHRoaXMuc2xhc2hPcHRpb25zID0gc2xhc2hPcHRpb25zO1xuXG5cdFx0dGhpcy5zbGFzaEVwaGVtZXJhbCA9IHNsYXNoRXBoZW1lcmFsO1xuXG5cdFx0dGhpcy5zbGFzaCA9IHNsYXNoO1xuXG5cdFx0dGhpcy5zbGFzaEd1aWxkcyA9IHNsYXNoR3VpbGRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbW1hbmQgbmFtZXMuXG5cdCAqL1xuXHRwdWJsaWMgYWxpYXNlczogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgcHJvbXB0IG9wdGlvbnMuXG5cdCAqL1xuXHRwdWJsaWMgYXJndW1lbnREZWZhdWx0czogRGVmYXVsdEFyZ3VtZW50T3B0aW9ucztcblxuXHQvKipcblx0ICogQ2F0ZWdvcnkgdGhlIGNvbW1hbmQgYmVsb25ncyB0by5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNhdGVnb3J5OiBDYXRlZ29yeTxzdHJpbmcsIENvbW1hbmQ+O1xuXG5cdC8qKlxuXHQgKiBVc2FibGUgb25seSBpbiB0aGlzIGNoYW5uZWwgdHlwZS5cblx0ICovXG5cdHB1YmxpYyBjaGFubmVsPzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgQWthaXJvIGNsaWVudC5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNsaWVudDogQWthaXJvQ2xpZW50O1xuXG5cdC8qKlxuXHQgKiBQZXJtaXNzaW9ucyByZXF1aXJlZCB0byBydW4gY29tbWFuZCBieSB0aGUgY2xpZW50LlxuXHQgKi9cblx0cHVibGljIGNsaWVudFBlcm1pc3Npb25zOlxuXHRcdHwgUGVybWlzc2lvblJlc29sdmFibGVcblx0XHR8IFBlcm1pc3Npb25SZXNvbHZhYmxlW11cblx0XHR8IE1pc3NpbmdQZXJtaXNzaW9uU3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIENvb2xkb3duIGluIG1pbGxpc2Vjb25kcy5cblx0ICovXG5cdHB1YmxpYyBjb29sZG93bj86IG51bWJlcjtcblxuXHQvKipcblx0ICogRGVzY3JpcHRpb24gb2YgdGhlIGNvbW1hbmQuXG5cdCAqL1xuXHRwdWJsaWMgZGVzY3JpcHRpb246IGFueTtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdGhpcyBjb21tYW5kIGNhbiBiZSByYW4gYnkgYW4gZWRpdC5cblx0ICovXG5cdHB1YmxpYyBlZGl0YWJsZTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhlIGZpbGVwYXRoLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgZmlsZXBhdGg6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIGhhbmRsZXIuXG5cdCAqL1xuXHRwdWJsaWMgZGVjbGFyZSBoYW5kbGVyOiBDb21tYW5kSGFuZGxlcjtcblxuXHQvKipcblx0ICogVGhlIElEIG9mIHRoZSBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgaWQ6IHN0cmluZztcblxuXHQvKipcblx0ICogSUQgb2YgdXNlcihzKSB0byBpZ25vcmUgY29vbGRvd24gb3IgYSBmdW5jdGlvbiB0byBpZ25vcmUuXG5cdCAqL1xuXHRwdWJsaWMgaWdub3JlQ29vbGRvd24/OiBTbm93Zmxha2UgfCBTbm93Zmxha2VbXSB8IElnbm9yZUNoZWNrUHJlZGljYXRlO1xuXG5cdC8qKlxuXHQgKiBJRCBvZiB1c2VyKHMpIHRvIGlnbm9yZSBgdXNlclBlcm1pc3Npb25zYCBjaGVja3Mgb3IgYSBmdW5jdGlvbiB0byBpZ25vcmUuXG5cdCAqL1xuXHRwdWJsaWMgaWdub3JlUGVybWlzc2lvbnM/OiBTbm93Zmxha2UgfCBTbm93Zmxha2VbXSB8IElnbm9yZUNoZWNrUHJlZGljYXRlO1xuXG5cdC8qKlxuXHQgKiBUaGUga2V5IHN1cHBsaWVyIGZvciB0aGUgbG9ja2VyLlxuXHQgKi9cblx0cHVibGljIGxvY2s/OiBLZXlTdXBwbGllciB8IFwiY2hhbm5lbFwiIHwgXCJndWlsZFwiIHwgXCJ1c2VyXCI7XG5cblx0LyoqXG5cdCAqIFN0b3JlcyB0aGUgY3VycmVudCBsb2Nrcy5cblx0ICovXG5cdHB1YmxpYyBsb2NrZXI/OiBTZXQ8c3RyaW5nPjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdGhlIGNvbW1hbmQgY2FuIG9ubHkgYmUgcnVuIGluICBOU0ZXIGNoYW5uZWxzLlxuXHQgKi9cblx0cHVibGljIG9ubHlOc2Z3OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBVc2FibGUgb25seSBieSB0aGUgY2xpZW50IG93bmVyLlxuXHQgKi9cblx0cHVibGljIG93bmVyT25seTogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQ29tbWFuZCBwcmVmaXggb3ZlcndyaXRlLlxuXHQgKi9cblx0cHVibGljIHByZWZpeD86IHN0cmluZyB8IHN0cmluZ1tdIHwgUHJlZml4U3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIGNvbnNpZGVyIHF1b3Rlcy5cblx0ICovXG5cdHB1YmxpYyBxdW90ZWQ6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFVzZXMgYWxsb3dlZCBiZWZvcmUgY29vbGRvd24uXG5cdCAqL1xuXHRwdWJsaWMgcmF0ZWxpbWl0OiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIFRoZSByZWdleCB0cmlnZ2VyIGZvciB0aGlzIGNvbW1hbmQuXG5cdCAqL1xuXHRwdWJsaWMgcmVnZXg6IFJlZ0V4cCB8IFJlZ2V4U3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIE1hcmsgY29tbWFuZCBhcyBzbGFzaCBjb21tYW5kIGFuZCBzZXQgaW5mb3JtYXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgc2xhc2g/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIHNsYXNoIGNvbW1hbmQgcmVzcG9uc2VzIGZvciB0aGlzIGNvbW1hbmQgc2hvdWxkIGJlIGVwaGVtZXJhbCBvciBub3QuXG5cdCAqL1xuXHRwdWJsaWMgc2xhc2hFcGhlbWVyYWw/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBBc3NpZ24gc2xhc2ggY29tbWFuZHMgdG8gU3BlY2lmaWMgZ3VpbGRzLiBUaGlzIG9wdGlvbiB3aWxsIG1ha2UgdGhlIGNvbW1hbmRzIGRvIG5vdCByZWdpc3RlciBnbG9iYWxseSwgYnV0IG9ubHkgdG8gdGhlIGNob3NlbiBzZXJ2ZXJzLlxuXHQgKi9cblx0cHVibGljIHNsYXNoR3VpbGRzPzogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIE9wdGlvbnMgZm9yIHVzaW5nIHRoZSBzbGFzaCBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIHNsYXNoT3B0aW9ucz86IEFwcGxpY2F0aW9uQ29tbWFuZE9wdGlvbkRhdGFbXTtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gYWxsb3cgY2xpZW50IHN1cGVyVXNlcnMocykgb25seS5cblx0ICovXG5cdHB1YmxpYyBzdXBlclVzZXJPbmx5OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byB0eXBlIGR1cmluZyBjb21tYW5kIGV4ZWN1dGlvbi5cblx0ICovXG5cdHB1YmxpYyB0eXBpbmc6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFBlcm1pc3Npb25zIHJlcXVpcmVkIHRvIHJ1biBjb21tYW5kIGJ5IHRoZSB1c2VyLlxuXHQgKi9cblx0cHVibGljIHVzZXJQZXJtaXNzaW9uczpcblx0XHR8IFBlcm1pc3Npb25SZXNvbHZhYmxlXG5cdFx0fCBQZXJtaXNzaW9uUmVzb2x2YWJsZVtdXG5cdFx0fCBNaXNzaW5nUGVybWlzc2lvblN1cHBsaWVyO1xuXG5cdC8qKlxuXHQgKiBBcmd1bWVudCBvcHRpb25zIG9yIGdlbmVyYXRvci5cblx0ICovXG5cdHB1YmxpYyBfYXJnczogQXJndW1lbnRPcHRpb25zW10gfCBBcmd1bWVudEdlbmVyYXRvcjtcblxuXHQvKipcblx0ICogVGhlIGNvbnRlbnQgcGFyc2VyLlxuXHQgKi9cblx0cHVibGljIGNvbnRlbnRQYXJzZXI6IENvbnRlbnRQYXJzZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBhcmd1bWVudCBydW5uZXIuXG5cdCAqL1xuXHRwdWJsaWMgYXJndW1lbnRSdW5uZXI6IEFyZ3VtZW50UnVubmVyO1xuXG5cdC8qKlxuXHQgKiBHZW5lcmF0b3IgZm9yIGFyZ3VtZW50cy5cblx0ICovXG5cdHB1YmxpYyBhcmd1bWVudEdlbmVyYXRvcjogQXJndW1lbnRHZW5lcmF0b3I7XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGVzIHRoZSBjb21tYW5kLlxuXHQgKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdGhhdCB0cmlnZ2VyZWQgdGhlIGNvbW1hbmQuXG5cdCAqIEBwYXJhbSBhcmdzIC0gRXZhbHVhdGVkIGFyZ3VtZW50cy5cblx0ICovXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzLCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0cHVibGljIGV4ZWMobWVzc2FnZTogTWVzc2FnZSwgYXJnczogYW55KTogYW55O1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lcywgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdHB1YmxpYyBleGVjKG1lc3NhZ2U6IE1lc3NhZ2UgfCBBa2Fpcm9NZXNzYWdlLCBhcmdzOiBhbnkpOiBhbnkge1xuXHRcdHRocm93IG5ldyBBa2Fpcm9FcnJvcihcIk5PVF9JTVBMRU1FTlRFRFwiLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIFwiZXhlY1wiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW5zIGJlZm9yZSBhcmd1bWVudCBwYXJzaW5nIGFuZCBleGVjdXRpb24uXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSBiZWluZyBoYW5kbGVkLlxuXHQgKi9cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHRwdWJsaWMgYmVmb3JlKG1lc3NhZ2U6IE1lc3NhZ2UpOiBhbnkge31cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBjb21tYW5kIHNob3VsZCBiZSByYW4gYnkgdXNpbmcgYW4gYXJiaXRyYXJ5IGNvbmRpdGlvbi5cblx0ICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIGJlaW5nIGhhbmRsZWQuXG5cdCAqL1xuXHQvLyBAdHMtaWdub3JlXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0cHVibGljIGNvbmRpdGlvbihtZXNzYWdlOiBNZXNzYWdlKTogYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj4ge31cblxuXHQvKipcblx0ICogRXhlY3V0ZSB0aGUgc2xhc2ggY29tbWFuZFxuXHQgKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgZm9yIHNsYXNoIGNvbW1hbmRcblx0ICogQHBhcmFtIGFyZ3MgLSBTbGFzaCBjb21tYW5kIG9wdGlvbnNcblx0ICovXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMsICBmdW5jLW5hbWVzXG5cdHB1YmxpYyBleGVjU2xhc2gobWVzc2FnZTogQWthaXJvTWVzc2FnZSwgLi4uYXJnczogYW55W10pOiBhbnkge1xuXHRcdGlmICh0aGlzLnNsYXNoKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWthaXJvRXJyb3IoXG5cdFx0XHRcdFwiTk9UX0lNUExFTUVOVEVEXCIsXG5cdFx0XHRcdHRoaXMuY29uc3RydWN0b3IubmFtZSxcblx0XHRcdFx0XCJleGVjU2xhc2hcIlxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIGNvbnRlbnQgdXNpbmcgdGhlIGNvbW1hbmQncyBhcmd1bWVudHMuXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0byB1c2UuXG5cdCAqIEBwYXJhbSBjb250ZW50IC0gU3RyaW5nIHRvIHBhcnNlLlxuXHQgKi9cblx0cHVibGljIHBhcnNlKG1lc3NhZ2U6IE1lc3NhZ2UsIGNvbnRlbnQ6IHN0cmluZyk6IFByb21pc2U8RmxhZyB8IGFueT4ge1xuXHRcdGNvbnN0IHBhcnNlZCA9IHRoaXMuY29udGVudFBhcnNlci5wYXJzZShjb250ZW50KTtcblx0XHRyZXR1cm4gdGhpcy5hcmd1bWVudFJ1bm5lci5ydW4obWVzc2FnZSwgcGFyc2VkLCB0aGlzLmFyZ3VtZW50R2VuZXJhdG9yKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWxvYWRzIHRoZSBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIHJlbG9hZCgpOiBDb21tYW5kIHtcblx0XHRyZXR1cm4gc3VwZXIucmVsb2FkKCkgYXMgQ29tbWFuZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIHRoZSBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIHJlbW92ZSgpOiBDb21tYW5kIHtcblx0XHRyZXR1cm4gc3VwZXIucmVtb3ZlKCkgYXMgQ29tbWFuZDtcblx0fVxufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gdXNlIGZvciBjb21tYW5kIGV4ZWN1dGlvbiBiZWhhdmlvci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21tYW5kT3B0aW9ucyBleHRlbmRzIEFrYWlyb01vZHVsZU9wdGlvbnMge1xuXHQvKipcblx0ICogQ29tbWFuZCBuYW1lcy5cblx0ICovXG5cdGFsaWFzZXM/OiBzdHJpbmdbXTtcblxuXHQvKipcblx0ICogQXJndW1lbnQgb3B0aW9ucyBvciBnZW5lcmF0b3IuXG5cdCAqL1xuXHRhcmdzPzogQXJndW1lbnRPcHRpb25zW10gfCBBcmd1bWVudEdlbmVyYXRvcjtcblxuXHQvKipcblx0ICogVGhlIGRlZmF1bHQgYXJndW1lbnQgb3B0aW9ucy5cblx0ICovXG5cdGFyZ3VtZW50RGVmYXVsdHM/OiBEZWZhdWx0QXJndW1lbnRPcHRpb25zO1xuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byBydW4gYmVmb3JlIGFyZ3VtZW50IHBhcnNpbmcgYW5kIGV4ZWN1dGlvbi5cblx0ICovXG5cdGJlZm9yZT86IEJlZm9yZUFjdGlvbjtcblxuXHQvKipcblx0ICogUmVzdHJpY3RzIGNoYW5uZWwgdG8gZWl0aGVyICdndWlsZCcgb3IgJ2RtJy5cblx0ICovXG5cdGNoYW5uZWw/OiBcImd1aWxkXCIgfCBcImRtXCI7XG5cblx0LyoqXG5cdCAqIFBlcm1pc3Npb25zIHJlcXVpcmVkIGJ5IHRoZSBjbGllbnQgdG8gcnVuIHRoaXMgY29tbWFuZC5cblx0ICovXG5cdGNsaWVudFBlcm1pc3Npb25zPzpcblx0XHR8IFBlcm1pc3Npb25SZXNvbHZhYmxlXG5cdFx0fCBQZXJtaXNzaW9uUmVzb2x2YWJsZVtdXG5cdFx0fCBNaXNzaW5nUGVybWlzc2lvblN1cHBsaWVyO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byBydW4gb24gbWVzc2FnZXMgdGhhdCBhcmUgbm90IGRpcmVjdGx5IGNvbW1hbmRzLlxuXHQgKi9cblx0Y29uZGl0aW9uPzogRXhlY3V0aW9uUHJlZGljYXRlO1xuXG5cdC8qKlxuXHQgKiBUaGUgY29tbWFuZCBjb29sZG93biBpbiBtaWxsaXNlY29uZHMuXG5cdCAqL1xuXHRjb29sZG93bj86IG51bWJlcjtcblxuXHQvKipcblx0ICogRGVzY3JpcHRpb24gb2YgdGhlIGNvbW1hbmQuXG5cdCAqL1xuXHRkZXNjcmlwdGlvbj86IHN0cmluZyB8IGFueSB8IGFueVtdO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCBtZXNzYWdlIGVkaXRzIHdpbGwgcnVuIHRoaXMgY29tbWFuZC5cblx0ICovXG5cdGVkaXRhYmxlPzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogRmxhZ3MgdG8gdXNlIHdoZW4gdXNpbmcgYW4gQXJndW1lbnRHZW5lcmF0b3Jcblx0ICovXG5cdGZsYWdzPzogc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIElEIG9mIHVzZXIocykgdG8gaWdub3JlIGNvb2xkb3duIG9yIGEgZnVuY3Rpb24gdG8gaWdub3JlLlxuXHQgKi9cblx0aWdub3JlQ29vbGRvd24/OiBTbm93Zmxha2UgfCBTbm93Zmxha2VbXSB8IElnbm9yZUNoZWNrUHJlZGljYXRlO1xuXG5cdC8qKlxuXHQgKiBJRCBvZiB1c2VyKHMpIHRvIGlnbm9yZSBgdXNlclBlcm1pc3Npb25zYCBjaGVja3Mgb3IgYSBmdW5jdGlvbiB0byBpZ25vcmUuXG5cdCAqL1xuXHRpZ25vcmVQZXJtaXNzaW9ucz86IFNub3dmbGFrZSB8IFNub3dmbGFrZVtdIHwgSWdub3JlQ2hlY2tQcmVkaWNhdGU7XG5cblx0LyoqXG5cdCAqIFRoZSBrZXkgdHlwZSBvciBrZXkgZ2VuZXJhdG9yIGZvciB0aGUgbG9ja2VyLiBJZiBsb2NrIGlzIGEgc3RyaW5nLCBpdCdzIGV4cGVjdGVkIG9uZSBvZiAnZ3VpbGQnLCAnY2hhbm5lbCcsIG9yICd1c2VyJ1xuXHQgKi9cblx0bG9jaz86IEtleVN1cHBsaWVyIHwgXCJndWlsZFwiIHwgXCJjaGFubmVsXCIgfCBcInVzZXJcIjtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gb25seSBhbGxvdyB0aGUgY29tbWFuZCB0byBiZSBydW4gaW4gTlNGVyBjaGFubmVscy5cblx0ICovXG5cdG9ubHlOc2Z3PzogYm9vbGVhbjtcblxuXHQvKipcblx0ICogT3B0aW9uIGZsYWdzIHRvIHVzZSB3aGVuIHVzaW5nIGFuIEFyZ3VtZW50R2VuZXJhdG9yLlxuXHQgKi9cblx0b3B0aW9uRmxhZ3M/OiBzdHJpbmdbXTtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gYWxsb3cgY2xpZW50IG93bmVyKHMpIG9ubHkuXG5cdCAqL1xuXHRvd25lck9ubHk/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBUaGUgcHJlZml4KGVzKSB0byBvdmVyd3JpdGUgdGhlIGdsb2JhbCBvbmUgZm9yIHRoaXMgY29tbWFuZC5cblx0ICovXG5cdHByZWZpeD86IHN0cmluZyB8IHN0cmluZ1tdIHwgUHJlZml4U3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgb3Igbm90IHRvIGNvbnNpZGVyIHF1b3Rlcy5cblx0ICovXG5cdHF1b3RlZD86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEFtb3VudCBvZiBjb21tYW5kIHVzZXMgYWxsb3dlZCB1bnRpbCBjb29sZG93bi5cblx0ICovXG5cdHJhdGVsaW1pdD86IG51bWJlcjtcblxuXHQvKipcblx0ICogQSByZWdleCB0byBtYXRjaCBpbiBtZXNzYWdlcyB0aGF0IGFyZSBub3QgZGlyZWN0bHkgY29tbWFuZHMuIFRoZSBhcmdzIG9iamVjdCB3aWxsIGhhdmUgYG1hdGNoYCBhbmQgYG1hdGNoZXNgIHByb3BlcnRpZXMuXG5cdCAqL1xuXHRyZWdleD86IFJlZ0V4cCB8IFJlZ2V4U3VwcGxpZXI7XG5cblx0LyoqXG5cdCAqIEN1c3RvbSBzZXBhcmF0b3IgZm9yIGFyZ3VtZW50IGlucHV0LlxuXHQgKi9cblx0c2VwYXJhdG9yPzogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBNYXJrIGNvbW1hbmQgYXMgc2xhc2ggY29tbWFuZCBhbmQgc2V0IGluZm9ybWF0aW9uLlxuXHQgKi9cblx0c2xhc2g/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIHNsYXNoIGNvbW1hbmQgcmVzcG9uc2VzIGZvciB0aGlzIGNvbW1hbmQgc2hvdWxkIGJlIGVwaGVtZXJhbCBvciBub3QuXG5cdCAqL1xuXHRzbGFzaEVwaGVtZXJhbD86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEFzc2lnbiBzbGFzaCBjb21tYW5kcyB0byBTcGVjaWZpYyBndWlsZHMuIFRoaXMgb3B0aW9uIHdpbGwgbWFrZSB0aGUgY29tbWFuZHMgZG8gbm90IHJlZ2lzdGVyIGdsb2JhbGx5LCBidXQgb25seSB0byB0aGUgY2hvc2VuIHNlcnZlcnMuXG5cdCAqL1xuXHRzbGFzaEd1aWxkcz86IHN0cmluZ1tdO1xuXG5cdC8qKlxuXHQgKiBPcHRpb25zIGZvciB1c2luZyB0aGUgc2xhc2ggY29tbWFuZC5cblx0ICovXG5cdHNsYXNoT3B0aW9ucz86IEFwcGxpY2F0aW9uQ29tbWFuZE9wdGlvbkRhdGFbXTtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdG8gYWxsb3cgY2xpZW50IHN1cGVyVXNlcnMocykgb25seS5cblx0ICovXG5cdHN1cGVyVXNlck9ubHk/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIG9yIG5vdCB0byB0eXBlIGluIGNoYW5uZWwgZHVyaW5nIGV4ZWN1dGlvbi5cblx0ICovXG5cdHR5cGluZz86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFBlcm1pc3Npb25zIHJlcXVpcmVkIGJ5IHRoZSB1c2VyIHRvIHJ1biB0aGlzIGNvbW1hbmQuXG5cdCAqL1xuXHR1c2VyUGVybWlzc2lvbnM/OlxuXHRcdHwgUGVybWlzc2lvblJlc29sdmFibGVcblx0XHR8IFBlcm1pc3Npb25SZXNvbHZhYmxlW11cblx0XHR8IE1pc3NpbmdQZXJtaXNzaW9uU3VwcGxpZXI7XG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0byBydW4gYmVmb3JlIGFyZ3VtZW50IHBhcnNpbmcgYW5kIGV4ZWN1dGlvbi5cbiAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0aGF0IHRyaWdnZXJlZCB0aGUgY29tbWFuZC5cbiAqL1xuZXhwb3J0IHR5cGUgQmVmb3JlQWN0aW9uID0gKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IGFueTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHVzZWQgdG8gc3VwcGx5IHRoZSBrZXkgZm9yIHRoZSBsb2NrZXIuXG4gKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdGhhdCB0cmlnZ2VyZWQgdGhlIGNvbW1hbmQuXG4gKiBAcGFyYW0gYXJncyAtIEV2YWx1YXRlZCBhcmd1bWVudHMuXG4gKi9cbmV4cG9ydCB0eXBlIEtleVN1cHBsaWVyID0gKG1lc3NhZ2U6IE1lc3NhZ2UsIGFyZ3M6IGFueSkgPT4gc3RyaW5nO1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdXNlZCB0byBjaGVjayBpZiB0aGUgY29tbWFuZCBzaG91bGQgcnVuIGFyYml0cmFyaWx5LlxuICogQHBhcmFtIG1lc3NhZ2UgLSBNZXNzYWdlIHRvIGNoZWNrLlxuICovXG5leHBvcnQgdHlwZSBFeGVjdXRpb25QcmVkaWNhdGUgPSAobWVzc2FnZTogTWVzc2FnZSkgPT4gYm9vbGVhbjtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgYSBtZXNzYWdlIGhhcyBwZXJtaXNzaW9ucyBmb3IgdGhlIGNvbW1hbmQuXG4gKiBBIG5vbi1udWxsIHJldHVybiB2YWx1ZSBzaWduaWZpZXMgdGhlIHJlYXNvbiBmb3IgbWlzc2luZyBwZXJtaXNzaW9ucy5cbiAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0aGF0IHRyaWdnZXJlZCB0aGUgY29tbWFuZC5cbiAqL1xuZXhwb3J0IHR5cGUgTWlzc2luZ1Blcm1pc3Npb25TdXBwbGllciA9IChcblx0bWVzc2FnZTogTWVzc2FnZVxuKSA9PiBQcm9taXNlPGFueT4gfCBhbnk7XG5cbi8qKlxuICogQSBmdW5jdGlvbiB1c2VkIHRvIHJldHVybiBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSB0byBnZXQgcmVnZXggZm9yLlxuICovXG5leHBvcnQgdHlwZSBSZWdleFN1cHBsaWVyID0gKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IFJlZ0V4cDtcblxuLyoqXG4gKiBHZW5lcmF0b3IgZm9yIGFyZ3VtZW50cy5cbiAqIFdoZW4geWllbGRpbmcgYXJndW1lbnQgb3B0aW9ucywgdGhhdCBhcmd1bWVudCBpcyByYW4gYW5kIHRoZSByZXN1bHQgb2YgdGhlIHByb2Nlc3NpbmcgaXMgZ2l2ZW4uXG4gKiBUaGUgbGFzdCB2YWx1ZSB3aGVuIHRoZSBnZW5lcmF0b3IgaXMgZG9uZSBpcyB0aGUgcmVzdWx0aW5nIGBhcmdzYCBmb3IgdGhlIGNvbW1hbmQncyBgZXhlY2AuXG4gKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdGhhdCB0cmlnZ2VyZWQgdGhlIGNvbW1hbmQuXG4gKiBAcGFyYW0gcGFyc2VkIC0gUGFyc2VkIGNvbnRlbnQuXG4gKiBAcGFyYW0gc3RhdGUgLSBBcmd1bWVudCBwcm9jZXNzaW5nIHN0YXRlLlxuICovXG5leHBvcnQgdHlwZSBBcmd1bWVudEdlbmVyYXRvciA9IChcblx0bWVzc2FnZTogTWVzc2FnZSxcblx0cGFyc2VkOiBDb250ZW50UGFyc2VyUmVzdWx0LFxuXHRzdGF0ZTogQXJndW1lbnRSdW5uZXJTdGF0ZVxuKSA9PiBJdGVyYWJsZUl0ZXJhdG9yPEFyZ3VtZW50T3B0aW9ucyB8IEZsYWc+O1xuIl19