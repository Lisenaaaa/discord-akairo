"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/**
 * A command interaction represented as a message.
 * @param client - AkairoClient
 * @param interaction - CommandInteraction
 * @param command - The command of the interaction
 */
class AkairoMessage extends discord_js_1.Base {
    constructor(client, interaction) {
        super(client);
        this.author = interaction.user;
        this.applicationId = interaction.applicationId;
        this.channelId = interaction.channelId;
        this.content = `${interaction.command.type === "CHAT_INPUT" ? "/" : ""}${interaction.commandName}`;
        this.createdTimestamp = interaction.createdTimestamp;
        this.guildId = interaction.guildId;
        this.id = interaction.id;
        this.interaction = interaction;
        this.member = interaction.member;
        this.partial = false;
        if (interaction.command?.type === "CHAT_INPUT") {
            if (interaction.options["_group"])
                this.content += `group: ${interaction.options["_group"]}`;
            if (interaction.options["_subcommand"])
                this.content += `subcommand: ${interaction.options["_subcommand"]}`;
            for (const option of interaction.options["_hoistedOptions"]) {
                if (["SUB_COMMAND", "SUB_COMMAND_GROUP"].includes(option.type))
                    continue;
                this.content += ` ${option.name}: ${interaction.options.get(option.name, false)?.value}`;
            }
        }
        else if (interaction.command?.type === "MESSAGE") {
            this.content += ` message: ${interaction.options.getMessage("message").id}`;
        }
        else if (interaction.command?.type === "USER") {
            this.content += ` message: ${interaction.options.getUser("user").id}`;
        }
    }
    /**
     * The author of the interaction.
     */
    author;
    /**
     * The application's id
     */
    applicationId;
    /**
     * The channel that the interaction was sent in.
     */
    get channel() {
        return this.interaction.channel;
    }
    /**
     * The id of the channel this interaction was sent in
     */
    channelId;
    /**
     * The message contents with all mentions replaced by the equivalent text.
     * If mentions cannot be resolved to a name, the relevant mention in the message content will not be converted.
     */
    get cleanContent() {
        return this.content != null ? discord_js_1.Util.cleanContent(this.content, this.channel) : null;
    }
    /**
     * The command name and arguments represented as a string.
     */
    content;
    /**
     * The time the message was sent at
     */
    get createdAt() {
        return this.interaction.createdAt;
    }
    /**
     * The timestamp the interaction was sent at.
     */
    createdTimestamp;
    /**
     * The guild the interaction was sent in (if in a guild channel).
     */
    get guild() {
        return this.interaction.guild;
    }
    guildId;
    /**
     * The ID of the interaction.
     */
    id;
    /**
     * The command interaction.
     */
    interaction;
    /**
     * Represents the author of the interaction as a guild member.
     * Only available if the interaction comes from a guild where the author is still a member.
     */
    member;
    /**
     * Whether or not this message is a partial
     */
    partial;
    /**
     * Utilities for command responding.
     */
    util;
    /**
     * The url to jump to this message
     */
    get url() {
        return this.interaction.ephemeral
            ? null
            : `https://discord.com/channels/${this.guild ? this.guild.id : "@me"}/${this.channel?.id}/${this.id}`;
    }
    /**
     * Deletes the reply to the command.
     */
    delete() {
        return this.interaction.deleteReply();
    }
    /**
     * Replies or edits the reply of the slash command.
     * @param options The options to edit the reply.
     */
    reply(options) {
        return this.util.reply(options);
    }
}
exports.default = AkairoMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWthaXJvTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL0FrYWlyb01lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyQ0FZb0I7QUFJcEI7Ozs7O0dBS0c7QUFDSCxNQUFxQixhQUFjLFNBQVEsaUJBQUk7SUFDOUMsWUFBbUIsTUFBb0IsRUFBRSxXQUErQjtRQUN2RSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsV0FBVyxDQUFDLE9BQVEsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLEVBQUUsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQXdELENBQUM7UUFDbkYsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFckIsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksS0FBSyxZQUFZLEVBQUU7WUFDL0MsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztnQkFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLFVBQVUs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QyxPQUEwRDtRQUN0RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDRDtBQXRJRCxnQ0FzSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElJbnRlcmFjdGlvbkd1aWxkTWVtYmVyLCBBUElNZXNzYWdlIH0gZnJvbSBcImRpc2NvcmQtYXBpLXR5cGVzL3Y5XCI7XG5pbXBvcnQge1xuXHRCYXNlLFxuXHRDb21tYW5kSW50ZXJhY3Rpb24sXG5cdEd1aWxkLFxuXHRHdWlsZE1lbWJlcixcblx0SW50ZXJhY3Rpb25SZXBseU9wdGlvbnMsXG5cdE1lc3NhZ2UsXG5cdE1lc3NhZ2VQYXlsb2FkLFxuXHRTbm93Zmxha2UsXG5cdFRleHRCYXNlZENoYW5uZWxzLFxuXHRVc2VyLFxuXHRVdGlsXG59IGZyb20gXCJkaXNjb3JkLmpzXCI7XG5pbXBvcnQgQWthaXJvQ2xpZW50IGZyb20gXCIuLi9zdHJ1Y3QvQWthaXJvQ2xpZW50XCI7XG5pbXBvcnQgQ29tbWFuZFV0aWwgZnJvbSBcIi4uL3N0cnVjdC9jb21tYW5kcy9Db21tYW5kVXRpbFwiO1xuXG4vKipcbiAqIEEgY29tbWFuZCBpbnRlcmFjdGlvbiByZXByZXNlbnRlZCBhcyBhIG1lc3NhZ2UuXG4gKiBAcGFyYW0gY2xpZW50IC0gQWthaXJvQ2xpZW50XG4gKiBAcGFyYW0gaW50ZXJhY3Rpb24gLSBDb21tYW5kSW50ZXJhY3Rpb25cbiAqIEBwYXJhbSBjb21tYW5kIC0gVGhlIGNvbW1hbmQgb2YgdGhlIGludGVyYWN0aW9uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFrYWlyb01lc3NhZ2UgZXh0ZW5kcyBCYXNlIHtcblx0cHVibGljIGNvbnN0cnVjdG9yKGNsaWVudDogQWthaXJvQ2xpZW50LCBpbnRlcmFjdGlvbjogQ29tbWFuZEludGVyYWN0aW9uKSB7XG5cdFx0c3VwZXIoY2xpZW50KTtcblxuXHRcdHRoaXMuYXV0aG9yID0gaW50ZXJhY3Rpb24udXNlcjtcblx0XHR0aGlzLmFwcGxpY2F0aW9uSWQgPSBpbnRlcmFjdGlvbi5hcHBsaWNhdGlvbklkO1xuXHRcdHRoaXMuY2hhbm5lbElkID0gaW50ZXJhY3Rpb24uY2hhbm5lbElkO1xuXHRcdHRoaXMuY29udGVudCA9IGAke2ludGVyYWN0aW9uLmNvbW1hbmQhLnR5cGUgPT09IFwiQ0hBVF9JTlBVVFwiID8gXCIvXCIgOiBcIlwifSR7aW50ZXJhY3Rpb24uY29tbWFuZE5hbWV9YDtcblx0XHR0aGlzLmNyZWF0ZWRUaW1lc3RhbXAgPSBpbnRlcmFjdGlvbi5jcmVhdGVkVGltZXN0YW1wO1xuXHRcdHRoaXMuZ3VpbGRJZCA9IGludGVyYWN0aW9uLmd1aWxkSWQ7XG5cdFx0dGhpcy5pZCA9IGludGVyYWN0aW9uLmlkO1xuXHRcdHRoaXMuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcblx0XHR0aGlzLm1lbWJlciA9IGludGVyYWN0aW9uLm1lbWJlciBhcyBBUElJbnRlcmFjdGlvbkd1aWxkTWVtYmVyIHwgR3VpbGRNZW1iZXIgfCBudWxsO1xuXHRcdHRoaXMucGFydGlhbCA9IGZhbHNlO1xuXG5cdFx0aWYgKGludGVyYWN0aW9uLmNvbW1hbmQ/LnR5cGUgPT09IFwiQ0hBVF9JTlBVVFwiKSB7XG5cdFx0XHRpZiAoaW50ZXJhY3Rpb24ub3B0aW9uc1tcIl9ncm91cFwiXSkgdGhpcy5jb250ZW50ICs9IGBncm91cDogJHtpbnRlcmFjdGlvbi5vcHRpb25zW1wiX2dyb3VwXCJdfWA7XG5cdFx0XHRpZiAoaW50ZXJhY3Rpb24ub3B0aW9uc1tcIl9zdWJjb21tYW5kXCJdKSB0aGlzLmNvbnRlbnQgKz0gYHN1YmNvbW1hbmQ6ICR7aW50ZXJhY3Rpb24ub3B0aW9uc1tcIl9zdWJjb21tYW5kXCJdfWA7XG5cdFx0XHRmb3IgKGNvbnN0IG9wdGlvbiBvZiBpbnRlcmFjdGlvbi5vcHRpb25zW1wiX2hvaXN0ZWRPcHRpb25zXCJdKSB7XG5cdFx0XHRcdGlmIChbXCJTVUJfQ09NTUFORFwiLCBcIlNVQl9DT01NQU5EX0dST1VQXCJdLmluY2x1ZGVzKG9wdGlvbi50eXBlKSkgY29udGludWU7XG5cdFx0XHRcdHRoaXMuY29udGVudCArPSBgICR7b3B0aW9uLm5hbWV9OiAke2ludGVyYWN0aW9uLm9wdGlvbnMuZ2V0KG9wdGlvbi5uYW1lLCBmYWxzZSk/LnZhbHVlfWA7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChpbnRlcmFjdGlvbi5jb21tYW5kPy50eXBlID09PSBcIk1FU1NBR0VcIikge1xuXHRcdFx0dGhpcy5jb250ZW50ICs9IGAgbWVzc2FnZTogJHtpbnRlcmFjdGlvbi5vcHRpb25zLmdldE1lc3NhZ2UoXCJtZXNzYWdlXCIpIS5pZH1gO1xuXHRcdH0gZWxzZSBpZiAoaW50ZXJhY3Rpb24uY29tbWFuZD8udHlwZSA9PT0gXCJVU0VSXCIpIHtcblx0XHRcdHRoaXMuY29udGVudCArPSBgIG1lc3NhZ2U6ICR7aW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRVc2VyKFwidXNlclwiKSEuaWR9YDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGF1dGhvciBvZiB0aGUgaW50ZXJhY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgYXV0aG9yOiBVc2VyO1xuXG5cdC8qKlxuXHQgKiBUaGUgYXBwbGljYXRpb24ncyBpZFxuXHQgKi9cblx0cHVibGljIGFwcGxpY2F0aW9uSWQ6IFNub3dmbGFrZTtcblxuXHQvKipcblx0ICogVGhlIGNoYW5uZWwgdGhhdCB0aGUgaW50ZXJhY3Rpb24gd2FzIHNlbnQgaW4uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGNoYW5uZWwoKTogVGV4dEJhc2VkQ2hhbm5lbHMgfCBudWxsIHtcblx0XHRyZXR1cm4gdGhpcy5pbnRlcmFjdGlvbi5jaGFubmVsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBpZCBvZiB0aGUgY2hhbm5lbCB0aGlzIGludGVyYWN0aW9uIHdhcyBzZW50IGluXG5cdCAqL1xuXHRwdWJsaWMgY2hhbm5lbElkOiBTbm93Zmxha2UgfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBUaGUgbWVzc2FnZSBjb250ZW50cyB3aXRoIGFsbCBtZW50aW9ucyByZXBsYWNlZCBieSB0aGUgZXF1aXZhbGVudCB0ZXh0LlxuXHQgKiBJZiBtZW50aW9ucyBjYW5ub3QgYmUgcmVzb2x2ZWQgdG8gYSBuYW1lLCB0aGUgcmVsZXZhbnQgbWVudGlvbiBpbiB0aGUgbWVzc2FnZSBjb250ZW50IHdpbGwgbm90IGJlIGNvbnZlcnRlZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgY2xlYW5Db250ZW50KCk6IHN0cmluZyB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLmNvbnRlbnQgIT0gbnVsbCA/IFV0aWwuY2xlYW5Db250ZW50KHRoaXMuY29udGVudCwgdGhpcy5jaGFubmVsISkgOiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjb21tYW5kIG5hbWUgYW5kIGFyZ3VtZW50cyByZXByZXNlbnRlZCBhcyBhIHN0cmluZy5cblx0ICovXG5cdHB1YmxpYyBjb250ZW50OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSB0aW1lIHRoZSBtZXNzYWdlIHdhcyBzZW50IGF0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGNyZWF0ZWRBdCgpOiBEYXRlIHtcblx0XHRyZXR1cm4gdGhpcy5pbnRlcmFjdGlvbi5jcmVhdGVkQXQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRpbWVzdGFtcCB0aGUgaW50ZXJhY3Rpb24gd2FzIHNlbnQgYXQuXG5cdCAqL1xuXHRwdWJsaWMgY3JlYXRlZFRpbWVzdGFtcDogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgZ3VpbGQgdGhlIGludGVyYWN0aW9uIHdhcyBzZW50IGluIChpZiBpbiBhIGd1aWxkIGNoYW5uZWwpLlxuXHQgKi9cblx0cHVibGljIGdldCBndWlsZCgpOiBHdWlsZCB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLmludGVyYWN0aW9uLmd1aWxkO1xuXHR9XG5cblx0cHVibGljIGd1aWxkSWQ6IFNub3dmbGFrZSB8IG51bGw7XG5cblx0LyoqXG5cdCAqIFRoZSBJRCBvZiB0aGUgaW50ZXJhY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgaWQ6IFNub3dmbGFrZTtcblxuXHQvKipcblx0ICogVGhlIGNvbW1hbmQgaW50ZXJhY3Rpb24uXG5cdCAqL1xuXHRwdWJsaWMgaW50ZXJhY3Rpb246IENvbW1hbmRJbnRlcmFjdGlvbjtcblxuXHQvKipcblx0ICogUmVwcmVzZW50cyB0aGUgYXV0aG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBhcyBhIGd1aWxkIG1lbWJlci5cblx0ICogT25seSBhdmFpbGFibGUgaWYgdGhlIGludGVyYWN0aW9uIGNvbWVzIGZyb20gYSBndWlsZCB3aGVyZSB0aGUgYXV0aG9yIGlzIHN0aWxsIGEgbWVtYmVyLlxuXHQgKi9cblx0cHVibGljIG1lbWJlcjogR3VpbGRNZW1iZXIgfCBBUElJbnRlcmFjdGlvbkd1aWxkTWVtYmVyIHwgbnVsbDtcblxuXHQvKipcblx0ICogV2hldGhlciBvciBub3QgdGhpcyBtZXNzYWdlIGlzIGEgcGFydGlhbFxuXHQgKi9cblx0cHVibGljIHJlYWRvbmx5IHBhcnRpYWw6IGZhbHNlO1xuXG5cdC8qKlxuXHQgKiBVdGlsaXRpZXMgZm9yIGNvbW1hbmQgcmVzcG9uZGluZy5cblx0ICovXG5cdHB1YmxpYyB1dGlsITogQ29tbWFuZFV0aWw7XG5cblx0LyoqXG5cdCAqIFRoZSB1cmwgdG8ganVtcCB0byB0aGlzIG1lc3NhZ2Vcblx0ICovXG5cdHB1YmxpYyBnZXQgdXJsKCk6IHN0cmluZyB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLmludGVyYWN0aW9uLmVwaGVtZXJhbFxuXHRcdFx0PyBudWxsXG5cdFx0XHQ6IGBodHRwczovL2Rpc2NvcmQuY29tL2NoYW5uZWxzLyR7dGhpcy5ndWlsZCA/IHRoaXMuZ3VpbGQuaWQgOiBcIkBtZVwifS8ke3RoaXMuY2hhbm5lbD8uaWR9LyR7dGhpcy5pZH1gO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlbGV0ZXMgdGhlIHJlcGx5IHRvIHRoZSBjb21tYW5kLlxuXHQgKi9cblx0cHVibGljIGRlbGV0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gdGhpcy5pbnRlcmFjdGlvbi5kZWxldGVSZXBseSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlcGxpZXMgb3IgZWRpdHMgdGhlIHJlcGx5IG9mIHRoZSBzbGFzaCBjb21tYW5kLlxuXHQgKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0byBlZGl0IHRoZSByZXBseS5cblx0ICovXG5cdHB1YmxpYyByZXBseShvcHRpb25zOiBzdHJpbmcgfCBNZXNzYWdlUGF5bG9hZCB8IEludGVyYWN0aW9uUmVwbHlPcHRpb25zKTogUHJvbWlzZTxNZXNzYWdlIHwgQVBJTWVzc2FnZT4ge1xuXHRcdHJldHVybiB0aGlzLnV0aWwucmVwbHkob3B0aW9ucyk7XG5cdH1cbn1cbiJdfQ==