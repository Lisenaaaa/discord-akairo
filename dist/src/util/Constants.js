"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuiltInReasons = exports.ContextCommandHandlerEvents = exports.CommandHandlerEvents = exports.AkairoHandlerEvents = exports.ArgumentTypes = exports.ArgumentMatches = void 0;
var ArgumentMatches;
(function (ArgumentMatches) {
    ArgumentMatches["PHRASE"] = "phrase";
    ArgumentMatches["FLAG"] = "flag";
    ArgumentMatches["OPTION"] = "option";
    ArgumentMatches["REST"] = "rest";
    ArgumentMatches["SEPARATE"] = "separate";
    ArgumentMatches["TEXT"] = "text";
    ArgumentMatches["CONTENT"] = "content";
    ArgumentMatches["REST_CONTENT"] = "restContent";
    ArgumentMatches["NONE"] = "none";
})(ArgumentMatches = exports.ArgumentMatches || (exports.ArgumentMatches = {}));
var ArgumentTypes;
(function (ArgumentTypes) {
    ArgumentTypes["STRING"] = "string";
    ArgumentTypes["LOWERCASE"] = "lowercase";
    ArgumentTypes["UPPERCASE"] = "uppercase";
    ArgumentTypes["CHAR_CODES"] = "charCodes";
    ArgumentTypes["NUMBER"] = "number";
    ArgumentTypes["INTEGER"] = "integer";
    ArgumentTypes["BIGINT"] = "bigint";
    ArgumentTypes["EMOJINT"] = "emojint";
    ArgumentTypes["URL"] = "url";
    ArgumentTypes["DATE"] = "date";
    ArgumentTypes["COLOR"] = "color";
    ArgumentTypes["USER"] = "user";
    ArgumentTypes["USERS"] = "users";
    ArgumentTypes["MEMBER"] = "member";
    ArgumentTypes["MEMBERS"] = "members";
    ArgumentTypes["RELEVANT"] = "relevant";
    ArgumentTypes["RELEVANTS"] = "relevants";
    ArgumentTypes["CHANNEL"] = "channel";
    ArgumentTypes["CHANNELS"] = "channels";
    ArgumentTypes["TEXT_CHANNEL"] = "textChannel";
    ArgumentTypes["TEXT_CHANNELS"] = "textChannels";
    ArgumentTypes["VOICE_CHANNEL"] = "voiceChannel";
    ArgumentTypes["VOICE_CHANNELS"] = "voiceChannels";
    ArgumentTypes["CATEGORY_CHANNEL"] = "categoryChannel";
    ArgumentTypes["CATEGORY_CHANNELS"] = "categoryChannels";
    ArgumentTypes["NEWS_CHANNEL"] = "newsChannel";
    ArgumentTypes["NEWS_CHANNELS"] = "newsChannels";
    ArgumentTypes["STORE_CHANNEL"] = "storeChannel";
    ArgumentTypes["STORE_CHANNELS"] = "storeChannels";
    ArgumentTypes["STAGE_CHANNEL"] = "stageChannel";
    ArgumentTypes["STAGE_CHANNELS"] = "stageChannels";
    ArgumentTypes["THREAD_CHANNEL"] = "threadChannel";
    ArgumentTypes["THREAD_CHANNELS"] = "threadChannels";
    ArgumentTypes["ROLE"] = "role";
    ArgumentTypes["ROLES"] = "roles";
    ArgumentTypes["EMOJI"] = "emoji";
    ArgumentTypes["EMOJIS"] = "emojis";
    ArgumentTypes["GUILD"] = "guild";
    ArgumentTypes["GUILDS"] = "guilds";
    ArgumentTypes["MESSAGE"] = "message";
    ArgumentTypes["GUILD_MESSAGE"] = "guildMessage";
    ArgumentTypes["RELEVANT_MESSAGE"] = "relevantMessage";
    ArgumentTypes["INVITE"] = "invite";
    ArgumentTypes["USER_MENTION"] = "userMention";
    ArgumentTypes["MEMBER_MENTION"] = "memberMention";
    ArgumentTypes["CHANNEL_MENTION"] = "channelMention";
    ArgumentTypes["ROLE_MENTION"] = "roleMention";
    ArgumentTypes["EMOJI_MENTION"] = "emojiMention";
    ArgumentTypes["COMMAND_ALIAS"] = "commandAlias";
    ArgumentTypes["COMMAND"] = "command";
    ArgumentTypes["INHIBITOR"] = "inhibitor";
    ArgumentTypes["LISTENER"] = "listener";
})(ArgumentTypes = exports.ArgumentTypes || (exports.ArgumentTypes = {}));
var AkairoHandlerEvents;
(function (AkairoHandlerEvents) {
    AkairoHandlerEvents["LOAD"] = "load";
    AkairoHandlerEvents["REMOVE"] = "remove";
})(AkairoHandlerEvents = exports.AkairoHandlerEvents || (exports.AkairoHandlerEvents = {}));
var CommandHandlerEvents;
(function (CommandHandlerEvents) {
    CommandHandlerEvents["COMMAND_BLOCKED"] = "commandBlocked";
    CommandHandlerEvents["COMMAND_BREAKOUT"] = "commandBreakout";
    CommandHandlerEvents["COMMAND_CANCELLED"] = "commandCancelled";
    CommandHandlerEvents["COMMAND_FINISHED"] = "commandFinished";
    CommandHandlerEvents["COMMAND_INVALID"] = "commandInvalid";
    CommandHandlerEvents["COMMAND_LOCKED"] = "commandLocked";
    CommandHandlerEvents["COMMAND_STARTED"] = "commandStarted";
    CommandHandlerEvents["COOLDOWN"] = "cooldown";
    CommandHandlerEvents["ERROR"] = "error";
    CommandHandlerEvents["IN_PROMPT"] = "inPrompt";
    CommandHandlerEvents["MESSAGE_BLOCKED"] = "messageBlocked";
    CommandHandlerEvents["MESSAGE_INVALID"] = "messageInvalid";
    CommandHandlerEvents["MISSING_PERMISSIONS"] = "missingPermissions";
    CommandHandlerEvents["SLASH_BLOCKED"] = "slashBlocked";
    CommandHandlerEvents["SLASH_ERROR"] = "slashError";
    CommandHandlerEvents["SLASH_FINISHED"] = "slashFinished";
    CommandHandlerEvents["SLASH_MISSING_PERMISSIONS"] = "slashMissingPermissions";
    CommandHandlerEvents["SLASH_NOT_FOUND"] = "slashNotFound";
    CommandHandlerEvents["SLASH_STARTED"] = "slashStarted";
})(CommandHandlerEvents = exports.CommandHandlerEvents || (exports.CommandHandlerEvents = {}));
var ContextCommandHandlerEvents;
(function (ContextCommandHandlerEvents) {
    ContextCommandHandlerEvents["ERROR"] = "error";
    ContextCommandHandlerEvents["FINISHED"] = "finished";
    ContextCommandHandlerEvents["NOT_FOUND"] = "notFound";
    ContextCommandHandlerEvents["STARTED"] = "started";
    ContextCommandHandlerEvents["BLOCKED"] = "blocked";
})(ContextCommandHandlerEvents = exports.ContextCommandHandlerEvents || (exports.ContextCommandHandlerEvents = {}));
var BuiltInReasons;
(function (BuiltInReasons) {
    BuiltInReasons["CLIENT"] = "client";
    BuiltInReasons["BOT"] = "bot";
    BuiltInReasons["OWNER"] = "owner";
    BuiltInReasons["SUPER_USER"] = "superUser";
    BuiltInReasons["GUILD"] = "guild";
    BuiltInReasons["DM"] = "dm";
    BuiltInReasons["AUTHOR_NOT_FOUND"] = "authorNotFound";
    BuiltInReasons["NOT_NSFW"] = "notNsfw";
})(BuiltInReasons = exports.BuiltInReasons || (exports.BuiltInReasons = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvQ29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQVksZUFVWDtBQVZELFdBQVksZUFBZTtJQUMxQixvQ0FBaUIsQ0FBQTtJQUNqQixnQ0FBYSxDQUFBO0lBQ2Isb0NBQWlCLENBQUE7SUFDakIsZ0NBQWEsQ0FBQTtJQUNiLHdDQUFxQixDQUFBO0lBQ3JCLGdDQUFhLENBQUE7SUFDYixzQ0FBbUIsQ0FBQTtJQUNuQiwrQ0FBNEIsQ0FBQTtJQUM1QixnQ0FBYSxDQUFBO0FBQ2QsQ0FBQyxFQVZXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBVTFCO0FBQ0QsSUFBWSxhQXFEWDtBQXJERCxXQUFZLGFBQWE7SUFDeEIsa0NBQWlCLENBQUE7SUFDakIsd0NBQXVCLENBQUE7SUFDdkIsd0NBQXVCLENBQUE7SUFDdkIseUNBQXdCLENBQUE7SUFDeEIsa0NBQWlCLENBQUE7SUFDakIsb0NBQW1CLENBQUE7SUFDbkIsa0NBQWlCLENBQUE7SUFDakIsb0NBQW1CLENBQUE7SUFDbkIsNEJBQVcsQ0FBQTtJQUNYLDhCQUFhLENBQUE7SUFDYixnQ0FBZSxDQUFBO0lBQ2YsOEJBQWEsQ0FBQTtJQUNiLGdDQUFlLENBQUE7SUFDZixrQ0FBaUIsQ0FBQTtJQUNqQixvQ0FBbUIsQ0FBQTtJQUNuQixzQ0FBcUIsQ0FBQTtJQUNyQix3Q0FBdUIsQ0FBQTtJQUN2QixvQ0FBbUIsQ0FBQTtJQUNuQixzQ0FBcUIsQ0FBQTtJQUNyQiw2Q0FBNEIsQ0FBQTtJQUM1QiwrQ0FBOEIsQ0FBQTtJQUM5QiwrQ0FBOEIsQ0FBQTtJQUM5QixpREFBZ0MsQ0FBQTtJQUNoQyxxREFBb0MsQ0FBQTtJQUNwQyx1REFBc0MsQ0FBQTtJQUN0Qyw2Q0FBNEIsQ0FBQTtJQUM1QiwrQ0FBOEIsQ0FBQTtJQUM5QiwrQ0FBOEIsQ0FBQTtJQUM5QixpREFBZ0MsQ0FBQTtJQUNoQywrQ0FBOEIsQ0FBQTtJQUM5QixpREFBZ0MsQ0FBQTtJQUNoQyxpREFBZ0MsQ0FBQTtJQUNoQyxtREFBa0MsQ0FBQTtJQUNsQyw4QkFBYSxDQUFBO0lBQ2IsZ0NBQWUsQ0FBQTtJQUNmLGdDQUFlLENBQUE7SUFDZixrQ0FBaUIsQ0FBQTtJQUNqQixnQ0FBZSxDQUFBO0lBQ2Ysa0NBQWlCLENBQUE7SUFDakIsb0NBQW1CLENBQUE7SUFDbkIsK0NBQThCLENBQUE7SUFDOUIscURBQW9DLENBQUE7SUFDcEMsa0NBQWlCLENBQUE7SUFDakIsNkNBQTRCLENBQUE7SUFDNUIsaURBQWdDLENBQUE7SUFDaEMsbURBQWtDLENBQUE7SUFDbEMsNkNBQTRCLENBQUE7SUFDNUIsK0NBQThCLENBQUE7SUFDOUIsK0NBQThCLENBQUE7SUFDOUIsb0NBQW1CLENBQUE7SUFDbkIsd0NBQXVCLENBQUE7SUFDdkIsc0NBQXFCLENBQUE7QUFDdEIsQ0FBQyxFQXJEVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQXFEeEI7QUFDRCxJQUFZLG1CQUdYO0FBSEQsV0FBWSxtQkFBbUI7SUFDOUIsb0NBQWEsQ0FBQTtJQUNiLHdDQUFpQixDQUFBO0FBQ2xCLENBQUMsRUFIVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQUc5QjtBQUNELElBQVksb0JBb0JYO0FBcEJELFdBQVksb0JBQW9CO0lBQy9CLDBEQUFrQyxDQUFBO0lBQ2xDLDREQUFvQyxDQUFBO0lBQ3BDLDhEQUFzQyxDQUFBO0lBQ3RDLDREQUFvQyxDQUFBO0lBQ3BDLDBEQUFrQyxDQUFBO0lBQ2xDLHdEQUFnQyxDQUFBO0lBQ2hDLDBEQUFrQyxDQUFBO0lBQ2xDLDZDQUFxQixDQUFBO0lBQ3JCLHVDQUFlLENBQUE7SUFDZiw4Q0FBc0IsQ0FBQTtJQUN0QiwwREFBa0MsQ0FBQTtJQUNsQywwREFBa0MsQ0FBQTtJQUNsQyxrRUFBMEMsQ0FBQTtJQUMxQyxzREFBOEIsQ0FBQTtJQUM5QixrREFBMEIsQ0FBQTtJQUMxQix3REFBZ0MsQ0FBQTtJQUNoQyw2RUFBcUQsQ0FBQTtJQUNyRCx5REFBaUMsQ0FBQTtJQUNqQyxzREFBOEIsQ0FBQTtBQUMvQixDQUFDLEVBcEJXLG9CQUFvQixHQUFwQiw0QkFBb0IsS0FBcEIsNEJBQW9CLFFBb0IvQjtBQUNELElBQVksMkJBTVg7QUFORCxXQUFZLDJCQUEyQjtJQUN0Qyw4Q0FBZSxDQUFBO0lBQ2Ysb0RBQXFCLENBQUE7SUFDckIscURBQXNCLENBQUE7SUFDdEIsa0RBQW1CLENBQUE7SUFDbkIsa0RBQW1CLENBQUE7QUFDcEIsQ0FBQyxFQU5XLDJCQUEyQixHQUEzQixtQ0FBMkIsS0FBM0IsbUNBQTJCLFFBTXRDO0FBQ0QsSUFBWSxjQVNYO0FBVEQsV0FBWSxjQUFjO0lBQ3pCLG1DQUFpQixDQUFBO0lBQ2pCLDZCQUFXLENBQUE7SUFDWCxpQ0FBZSxDQUFBO0lBQ2YsMENBQXdCLENBQUE7SUFDeEIsaUNBQWUsQ0FBQTtJQUNmLDJCQUFTLENBQUE7SUFDVCxxREFBbUMsQ0FBQTtJQUNuQyxzQ0FBb0IsQ0FBQTtBQUNyQixDQUFDLEVBVFcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFTekIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBBcmd1bWVudE1hdGNoZXMge1xuXHRQSFJBU0UgPSBcInBocmFzZVwiLFxuXHRGTEFHID0gXCJmbGFnXCIsXG5cdE9QVElPTiA9IFwib3B0aW9uXCIsXG5cdFJFU1QgPSBcInJlc3RcIixcblx0U0VQQVJBVEUgPSBcInNlcGFyYXRlXCIsXG5cdFRFWFQgPSBcInRleHRcIixcblx0Q09OVEVOVCA9IFwiY29udGVudFwiLFxuXHRSRVNUX0NPTlRFTlQgPSBcInJlc3RDb250ZW50XCIsXG5cdE5PTkUgPSBcIm5vbmVcIlxufVxuZXhwb3J0IGVudW0gQXJndW1lbnRUeXBlcyB7XG5cdFNUUklORyA9IFwic3RyaW5nXCIsXG5cdExPV0VSQ0FTRSA9IFwibG93ZXJjYXNlXCIsXG5cdFVQUEVSQ0FTRSA9IFwidXBwZXJjYXNlXCIsXG5cdENIQVJfQ09ERVMgPSBcImNoYXJDb2Rlc1wiLFxuXHROVU1CRVIgPSBcIm51bWJlclwiLFxuXHRJTlRFR0VSID0gXCJpbnRlZ2VyXCIsXG5cdEJJR0lOVCA9IFwiYmlnaW50XCIsXG5cdEVNT0pJTlQgPSBcImVtb2ppbnRcIixcblx0VVJMID0gXCJ1cmxcIixcblx0REFURSA9IFwiZGF0ZVwiLFxuXHRDT0xPUiA9IFwiY29sb3JcIixcblx0VVNFUiA9IFwidXNlclwiLFxuXHRVU0VSUyA9IFwidXNlcnNcIixcblx0TUVNQkVSID0gXCJtZW1iZXJcIixcblx0TUVNQkVSUyA9IFwibWVtYmVyc1wiLFxuXHRSRUxFVkFOVCA9IFwicmVsZXZhbnRcIixcblx0UkVMRVZBTlRTID0gXCJyZWxldmFudHNcIixcblx0Q0hBTk5FTCA9IFwiY2hhbm5lbFwiLFxuXHRDSEFOTkVMUyA9IFwiY2hhbm5lbHNcIixcblx0VEVYVF9DSEFOTkVMID0gXCJ0ZXh0Q2hhbm5lbFwiLFxuXHRURVhUX0NIQU5ORUxTID0gXCJ0ZXh0Q2hhbm5lbHNcIixcblx0Vk9JQ0VfQ0hBTk5FTCA9IFwidm9pY2VDaGFubmVsXCIsXG5cdFZPSUNFX0NIQU5ORUxTID0gXCJ2b2ljZUNoYW5uZWxzXCIsXG5cdENBVEVHT1JZX0NIQU5ORUwgPSBcImNhdGVnb3J5Q2hhbm5lbFwiLFxuXHRDQVRFR09SWV9DSEFOTkVMUyA9IFwiY2F0ZWdvcnlDaGFubmVsc1wiLFxuXHRORVdTX0NIQU5ORUwgPSBcIm5ld3NDaGFubmVsXCIsXG5cdE5FV1NfQ0hBTk5FTFMgPSBcIm5ld3NDaGFubmVsc1wiLFxuXHRTVE9SRV9DSEFOTkVMID0gXCJzdG9yZUNoYW5uZWxcIixcblx0U1RPUkVfQ0hBTk5FTFMgPSBcInN0b3JlQ2hhbm5lbHNcIixcblx0U1RBR0VfQ0hBTk5FTCA9IFwic3RhZ2VDaGFubmVsXCIsXG5cdFNUQUdFX0NIQU5ORUxTID0gXCJzdGFnZUNoYW5uZWxzXCIsXG5cdFRIUkVBRF9DSEFOTkVMID0gXCJ0aHJlYWRDaGFubmVsXCIsXG5cdFRIUkVBRF9DSEFOTkVMUyA9IFwidGhyZWFkQ2hhbm5lbHNcIixcblx0Uk9MRSA9IFwicm9sZVwiLFxuXHRST0xFUyA9IFwicm9sZXNcIixcblx0RU1PSkkgPSBcImVtb2ppXCIsXG5cdEVNT0pJUyA9IFwiZW1vamlzXCIsXG5cdEdVSUxEID0gXCJndWlsZFwiLFxuXHRHVUlMRFMgPSBcImd1aWxkc1wiLFxuXHRNRVNTQUdFID0gXCJtZXNzYWdlXCIsXG5cdEdVSUxEX01FU1NBR0UgPSBcImd1aWxkTWVzc2FnZVwiLFxuXHRSRUxFVkFOVF9NRVNTQUdFID0gXCJyZWxldmFudE1lc3NhZ2VcIixcblx0SU5WSVRFID0gXCJpbnZpdGVcIixcblx0VVNFUl9NRU5USU9OID0gXCJ1c2VyTWVudGlvblwiLFxuXHRNRU1CRVJfTUVOVElPTiA9IFwibWVtYmVyTWVudGlvblwiLFxuXHRDSEFOTkVMX01FTlRJT04gPSBcImNoYW5uZWxNZW50aW9uXCIsXG5cdFJPTEVfTUVOVElPTiA9IFwicm9sZU1lbnRpb25cIixcblx0RU1PSklfTUVOVElPTiA9IFwiZW1vamlNZW50aW9uXCIsXG5cdENPTU1BTkRfQUxJQVMgPSBcImNvbW1hbmRBbGlhc1wiLFxuXHRDT01NQU5EID0gXCJjb21tYW5kXCIsXG5cdElOSElCSVRPUiA9IFwiaW5oaWJpdG9yXCIsXG5cdExJU1RFTkVSID0gXCJsaXN0ZW5lclwiXG59XG5leHBvcnQgZW51bSBBa2Fpcm9IYW5kbGVyRXZlbnRzIHtcblx0TE9BRCA9IFwibG9hZFwiLFxuXHRSRU1PVkUgPSBcInJlbW92ZVwiXG59XG5leHBvcnQgZW51bSBDb21tYW5kSGFuZGxlckV2ZW50cyB7XG5cdENPTU1BTkRfQkxPQ0tFRCA9IFwiY29tbWFuZEJsb2NrZWRcIixcblx0Q09NTUFORF9CUkVBS09VVCA9IFwiY29tbWFuZEJyZWFrb3V0XCIsXG5cdENPTU1BTkRfQ0FOQ0VMTEVEID0gXCJjb21tYW5kQ2FuY2VsbGVkXCIsXG5cdENPTU1BTkRfRklOSVNIRUQgPSBcImNvbW1hbmRGaW5pc2hlZFwiLFxuXHRDT01NQU5EX0lOVkFMSUQgPSBcImNvbW1hbmRJbnZhbGlkXCIsXG5cdENPTU1BTkRfTE9DS0VEID0gXCJjb21tYW5kTG9ja2VkXCIsXG5cdENPTU1BTkRfU1RBUlRFRCA9IFwiY29tbWFuZFN0YXJ0ZWRcIixcblx0Q09PTERPV04gPSBcImNvb2xkb3duXCIsXG5cdEVSUk9SID0gXCJlcnJvclwiLFxuXHRJTl9QUk9NUFQgPSBcImluUHJvbXB0XCIsXG5cdE1FU1NBR0VfQkxPQ0tFRCA9IFwibWVzc2FnZUJsb2NrZWRcIixcblx0TUVTU0FHRV9JTlZBTElEID0gXCJtZXNzYWdlSW52YWxpZFwiLFxuXHRNSVNTSU5HX1BFUk1JU1NJT05TID0gXCJtaXNzaW5nUGVybWlzc2lvbnNcIixcblx0U0xBU0hfQkxPQ0tFRCA9IFwic2xhc2hCbG9ja2VkXCIsXG5cdFNMQVNIX0VSUk9SID0gXCJzbGFzaEVycm9yXCIsXG5cdFNMQVNIX0ZJTklTSEVEID0gXCJzbGFzaEZpbmlzaGVkXCIsXG5cdFNMQVNIX01JU1NJTkdfUEVSTUlTU0lPTlMgPSBcInNsYXNoTWlzc2luZ1Blcm1pc3Npb25zXCIsXG5cdFNMQVNIX05PVF9GT1VORCA9IFwic2xhc2hOb3RGb3VuZFwiLFxuXHRTTEFTSF9TVEFSVEVEID0gXCJzbGFzaFN0YXJ0ZWRcIlxufVxuZXhwb3J0IGVudW0gQ29udGV4dENvbW1hbmRIYW5kbGVyRXZlbnRzIHtcblx0RVJST1IgPSBcImVycm9yXCIsXG5cdEZJTklTSEVEID0gXCJmaW5pc2hlZFwiLFxuXHROT1RfRk9VTkQgPSBcIm5vdEZvdW5kXCIsXG5cdFNUQVJURUQgPSBcInN0YXJ0ZWRcIixcblx0QkxPQ0tFRCA9IFwiYmxvY2tlZFwiXG59XG5leHBvcnQgZW51bSBCdWlsdEluUmVhc29ucyB7XG5cdENMSUVOVCA9IFwiY2xpZW50XCIsXG5cdEJPVCA9IFwiYm90XCIsXG5cdE9XTkVSID0gXCJvd25lclwiLFxuXHRTVVBFUl9VU0VSID0gXCJzdXBlclVzZXJcIixcblx0R1VJTEQgPSBcImd1aWxkXCIsXG5cdERNID0gXCJkbVwiLFxuXHRBVVRIT1JfTk9UX0ZPVU5EID0gXCJhdXRob3JOb3RGb3VuZFwiLFxuXHROT1RfTlNGVyA9IFwibm90TnNmd1wiXG59XG4iXX0=