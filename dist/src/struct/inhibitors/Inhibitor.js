"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AkairoError_1 = __importDefault(require("../../util/AkairoError"));
const AkairoModule_1 = __importDefault(require("../AkairoModule"));
/**
 * Represents an inhibitor.
 * @param id - Inhibitor ID.
 * @param options - Options for the inhibitor.
 */
class Inhibitor extends AkairoModule_1.default {
    constructor(id, { category, reason = "", type = "post", priority = 0 } = {}) {
        super(id, { category });
        this.reason = reason;
        this.type = type;
        this.priority = priority;
    }
    /**
     * The priority of the inhibitor.
     */
    priority;
    /**
     * Reason emitted when command is inhibited.
     */
    reason;
    /**
     * The type of the inhibitor for when it should run.
     */
    type;
    exec(message, command) {
        throw new AkairoError_1.default("NOT_IMPLEMENTED", this.constructor.name, "exec");
    }
    /* eslint-enable  @typescript-eslint/no-unused-vars */
    /**
     * Reloads the inhibitor.
     */
    reload() {
        return super.reload();
    }
    /**
     * Removes the inhibitor.
     */
    remove() {
        return super.remove();
    }
}
exports.default = Inhibitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N0cnVjdC9pbmhpYml0b3JzL0luaGliaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHlFQUFpRDtBQUlqRCxtRUFBb0U7QUFJcEU7Ozs7R0FJRztBQUNILE1BQThCLFNBQVUsU0FBUSxzQkFBWTtJQUMzRCxZQUFtQixFQUFVLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsTUFBTSxFQUFFLFFBQVEsR0FBRyxDQUFDLEtBQXVCLEVBQUU7UUFDM0csS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDMUIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUSxDQUFTO0lBMkJ4Qjs7T0FFRztJQUNJLE1BQU0sQ0FBUztJQUV0Qjs7T0FFRztJQUNJLElBQUksQ0FBUztJQVliLElBQUksQ0FBQyxPQUFnQyxFQUFFLE9BQWlCO1FBQzlELE1BQU0sSUFBSSxxQkFBVyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFDRCxzREFBc0Q7SUFFdEQ7O09BRUc7SUFDYSxNQUFNO1FBQ3JCLE9BQU8sS0FBSyxDQUFDLE1BQU0sRUFBd0IsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7O09BRUc7SUFDYSxNQUFNO1FBQ3JCLE9BQU8sS0FBSyxDQUFDLE1BQU0sRUFBZSxDQUFDO0lBQ3BDLENBQUM7Q0FDRDtBQS9FRCw0QkErRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSBcImRpc2NvcmQuanNcIjtcbmltcG9ydCBBa2Fpcm9FcnJvciBmcm9tIFwiLi4vLi4vdXRpbC9Ba2Fpcm9FcnJvclwiO1xuaW1wb3J0IEFrYWlyb01lc3NhZ2UgZnJvbSBcIi4uLy4uL3V0aWwvQWthaXJvTWVzc2FnZVwiO1xuaW1wb3J0IENhdGVnb3J5IGZyb20gXCIuLi8uLi91dGlsL0NhdGVnb3J5XCI7XG5pbXBvcnQgQWthaXJvQ2xpZW50IGZyb20gXCIuLi9Ba2Fpcm9DbGllbnRcIjtcbmltcG9ydCBBa2Fpcm9Nb2R1bGUsIHsgQWthaXJvTW9kdWxlT3B0aW9ucyB9IGZyb20gXCIuLi9Ba2Fpcm9Nb2R1bGVcIjtcbmltcG9ydCBDb21tYW5kIGZyb20gXCIuLi9jb21tYW5kcy9Db21tYW5kXCI7XG5pbXBvcnQgSW5oaWJpdG9ySGFuZGxlciBmcm9tIFwiLi9JbmhpYml0b3JIYW5kbGVyXCI7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBpbmhpYml0b3IuXG4gKiBAcGFyYW0gaWQgLSBJbmhpYml0b3IgSUQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgZm9yIHRoZSBpbmhpYml0b3IuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEluaGliaXRvciBleHRlbmRzIEFrYWlyb01vZHVsZSB7XG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCB7IGNhdGVnb3J5LCByZWFzb24gPSBcIlwiLCB0eXBlID0gXCJwb3N0XCIsIHByaW9yaXR5ID0gMCB9OiBJbmhpYml0b3JPcHRpb25zID0ge30pIHtcblx0XHRzdXBlcihpZCwgeyBjYXRlZ29yeSB9KTtcblxuXHRcdHRoaXMucmVhc29uID0gcmVhc29uO1xuXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblxuXHRcdHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgcHJpb3JpdHkgb2YgdGhlIGluaGliaXRvci5cblx0ICovXG5cdHB1YmxpYyBwcmlvcml0eTogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgY2F0ZWdvcnkgdGhlIGluaGliaXRvciBiZWxvbmdzIHRvLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgY2F0ZWdvcnk6IENhdGVnb3J5PHN0cmluZywgSW5oaWJpdG9yPjtcblxuXHQvKipcblx0ICogVGhlIEFrYWlybyBjbGllbnQuXG5cdCAqL1xuXHRwdWJsaWMgZGVjbGFyZSBjbGllbnQ6IEFrYWlyb0NsaWVudDtcblxuXHQvKipcblx0ICogVGhlIGZpbGVwYXRoLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgZmlsZXBhdGg6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIGluaGliaXRvciBoYW5kbGVyLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgaGFuZGxlcjogSW5oaWJpdG9ySGFuZGxlcjtcblxuXHQvKipcblx0ICogVGhlIElEIG9mIHRoaXMgaW5oaWJpdG9yLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgaWQ6IHN0cmluZztcblxuXHQvKipcblx0ICogUmVhc29uIGVtaXR0ZWQgd2hlbiBjb21tYW5kIGlzIGluaGliaXRlZC5cblx0ICovXG5cdHB1YmxpYyByZWFzb246IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIHR5cGUgb2YgdGhlIGluaGliaXRvciBmb3Igd2hlbiBpdCBzaG91bGQgcnVuLlxuXHQgKi9cblx0cHVibGljIHR5cGU6IHN0cmluZztcblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIG1lc3NhZ2Ugc2hvdWxkIGJlIGJsb2NrZWQuXG5cdCAqIEEgcmV0dXJuIHZhbHVlIG9mIHRydWUgd2lsbCBibG9jayB0aGUgbWVzc2FnZS5cblx0ICogSWYgcmV0dXJuaW5nIGEgUHJvbWlzZSwgYSByZXNvbHZlZCB2YWx1ZSBvZiB0cnVlIHdpbGwgYmxvY2sgdGhlIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSBtZXNzYWdlIC0gTWVzc2FnZSBiZWluZyBoYW5kbGVkLlxuXHQgKiBAcGFyYW0gY29tbWFuZCAtIENvbW1hbmQgdG8gY2hlY2suXG5cdCAqL1xuXHQvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cblx0Ly8gcHVibGljIGV4ZWMobWVzc2FnZTogTWVzc2FnZSwgY29tbWFuZD86IENvbW1hbmQpOiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPjtcblx0cHVibGljIGV4ZWMobWVzc2FnZTogTWVzc2FnZSB8IEFrYWlyb01lc3NhZ2UsIGNvbW1hbmQ/OiBDb21tYW5kKTogYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj47XG5cdHB1YmxpYyBleGVjKG1lc3NhZ2U6IE1lc3NhZ2UgfCBBa2Fpcm9NZXNzYWdlLCBjb21tYW5kPzogQ29tbWFuZCk6IGJvb2xlYW4gfCBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHR0aHJvdyBuZXcgQWthaXJvRXJyb3IoXCJOT1RfSU1QTEVNRU5URURcIiwgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBcImV4ZWNcIik7XG5cdH1cblx0LyogZXNsaW50LWVuYWJsZSAgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzICovXG5cblx0LyoqXG5cdCAqIFJlbG9hZHMgdGhlIGluaGliaXRvci5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZWxvYWQoKTogUHJvbWlzZTxJbmhpYml0b3I+IHtcblx0XHRyZXR1cm4gc3VwZXIucmVsb2FkKCkgYXMgUHJvbWlzZTxJbmhpYml0b3I+O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgdGhlIGluaGliaXRvci5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZW1vdmUoKTogSW5oaWJpdG9yIHtcblx0XHRyZXR1cm4gc3VwZXIucmVtb3ZlKCkgYXMgSW5oaWJpdG9yO1xuXHR9XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byB1c2UgZm9yIGluaGliaXRvciBleGVjdXRpb24gYmVoYXZpb3IuXG4gKiBBbHNvIGluY2x1ZGVzIHByb3BlcnRpZXMgZnJvbSBBa2Fpcm9Nb2R1bGVPcHRpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluaGliaXRvck9wdGlvbnMgZXh0ZW5kcyBBa2Fpcm9Nb2R1bGVPcHRpb25zIHtcblx0LyoqXG5cdCAqIFJlYXNvbiBlbWl0dGVkIHdoZW4gY29tbWFuZCBvciBtZXNzYWdlIGlzIGJsb2NrZWQuXG5cdCAqL1xuXHRyZWFzb24/OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIENhbiBiZSAnYWxsJyB0byBydW4gb24gYWxsIG1lc3NhZ2VzLCAncHJlJyB0byBydW4gb24gbWVzc2FnZXMgbm90IGJsb2NrZWQgYnkgdGhlIGJ1aWx0LWluIGluaGliaXRvcnMsIG9yICdwb3N0JyB0byBydW4gb24gbWVzc2FnZXMgdGhhdCBhcmUgY29tbWFuZHMuXG5cdCAqIERlZmF1bHRzIHRvIGBwb3N0YFxuXHQgKi9cblx0dHlwZT86IFwiYWxsXCIgfCBcInByZVwiIHwgXCJwb3N0XCI7XG5cblx0LyoqXG5cdCAqIFByaW9yaXR5IGZvciB0aGUgaW5oaWJpdG9yIGZvciB3aGVuIG1vcmUgdGhhbiBvbmUgaW5oaWJpdG9ycyBibG9jayBhIG1lc3NhZ2UuXG5cdCAqIFRoZSBpbmhpYml0b3Igd2l0aCB0aGUgaGlnaGVzdCBwcmlvcml0eSBpcyB0aGUgb25lIHRoYXQgaXMgdXNlZCBmb3IgdGhlIGJsb2NrIHJlYXNvbi5cblx0ICogRGVmYXVsdHMgdG8gYDBgXG5cdCAqL1xuXHRwcmlvcml0eT86IG51bWJlcjtcbn1cbiJdfQ==