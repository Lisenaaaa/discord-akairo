"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AkairoError_1 = __importDefault(require("../../util/AkairoError"));
const Util_1 = __importDefault(require("../../util/Util"));
const AkairoHandler_1 = __importDefault(require("../AkairoHandler"));
const Inhibitor_1 = __importDefault(require("./Inhibitor"));
/**
 * Loads inhibitors and checks messages.
 * @param client - The Akairo client.
 * @param options - Options.
 */
class InhibitorHandler extends AkairoHandler_1.default {
    constructor(client, { directory, classToHandle = Inhibitor_1.default, extensions = [".js", ".ts"], automateCategories, loadFilter } = {}) {
        if (!(classToHandle.prototype instanceof Inhibitor_1.default || classToHandle === Inhibitor_1.default)) {
            throw new AkairoError_1.default("INVALID_CLASS_TO_HANDLE", classToHandle.name, Inhibitor_1.default.name);
        }
        super(client, {
            directory,
            classToHandle,
            extensions,
            automateCategories,
            loadFilter
        });
    }
    /**
     * Deregisters a module.
     * @param inhibitor - Module to use.
     */
    deregister(inhibitor) {
        return super.deregister(inhibitor);
    }
    /**
     * Finds a category by name.
     * @param name - Name to find with.
     */
    findCategory(name) {
        return super.findCategory(name);
    }
    /**
     * Loads an inhibitor.
     * @param thing - Module or path to module.
     */
    load(thing) {
        return super.load(thing);
    }
    /**
     * Reads all inhibitors from the directory and loads them.
     * @param directory - Directory to load from. Defaults to the directory passed in the constructor.
     * @param filter - Filter for files, where true means it should be loaded.
     */
    loadAll(directory, filter) {
        return super.loadAll(directory, filter);
    }
    /**
     * Registers a module.
     * @param inhibitor - Module to use.
     * @param filepath - Filepath of module.
     */
    register(inhibitor, filepath) {
        return super.register(inhibitor, filepath);
    }
    /**
     * Reloads an inhibitor.
     * @param id - ID of the inhibitor.
     */
    reload(id) {
        return super.reload(id);
    }
    /**
     * Reloads all inhibitors.
     */
    reloadAll() {
        return super.reloadAll();
    }
    /**
     * Removes an inhibitor.
     * @param {string} id - ID of the inhibitor.
     */
    remove(id) {
        return super.remove(id);
    }
    /**
     * Removes all inhibitors.
     */
    removeAll() {
        return super.removeAll();
    }
    /**
     * Tests inhibitors against the message.
     * Returns the reason if blocked.
     * @param type - Type of inhibitor, 'all', 'pre', or 'post'.
     * @param message - Message to test.
     * @param command - Command to use.
     */
    async test(type, message, command) {
        if (!this.modules.size)
            return null;
        const inhibitors = this.modules.filter(i => i.type === type);
        if (!inhibitors.size)
            return null;
        const promises = [];
        for (const inhibitor of inhibitors.values()) {
            promises.push((async () => {
                let inhibited = inhibitor.exec(message, command);
                if (Util_1.default.isPromise(inhibited))
                    inhibited = await inhibited;
                if (inhibited)
                    return inhibitor;
                return null;
            })());
        }
        const inhibitedInhibitors = (await Promise.all(promises)).filter(r => r);
        if (!inhibitedInhibitors.length)
            return null;
        inhibitedInhibitors.sort((a, b) => b.priority - a.priority);
        return inhibitedInhibitors[0].reason;
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
}
exports.default = InhibitorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9ySGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zdHJ1Y3QvaW5oaWJpdG9ycy9JbmhpYml0b3JIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0EseUVBQWlEO0FBRWpELDJEQUFtQztBQUVuQyxxRUFBc0Y7QUFFdEYsNERBQW9DO0FBRXBDOzs7O0dBSUc7QUFDSCxNQUFxQixnQkFBaUIsU0FBUSx1QkFBYTtJQUMxRCxZQUNDLE1BQW9CLEVBQ3BCLEVBQ0MsU0FBUyxFQUNULGFBQWEsR0FBRyxtQkFBUyxFQUN6QixVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQzNCLGtCQUFrQixFQUNsQixVQUFVLEtBQ2UsRUFBRTtRQUU1QixJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsU0FBUyxZQUFZLG1CQUFTLElBQUksYUFBYSxLQUFLLG1CQUFTLENBQUMsRUFBRTtZQUNuRixNQUFNLElBQUkscUJBQVcsQ0FBQyx5QkFBeUIsRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLG1CQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckY7UUFFRCxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2IsU0FBUztZQUNULGFBQWE7WUFDYixVQUFVO1lBQ1Ysa0JBQWtCO1lBQ2xCLFVBQVU7U0FDVixDQUFDLENBQUM7SUFDSixDQUFDO0lBMkJEOzs7T0FHRztJQUNhLFVBQVUsQ0FBQyxTQUFvQjtRQUM5QyxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7T0FHRztJQUNhLFlBQVksQ0FBQyxJQUFZO1FBQ3hDLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQWdDLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7T0FHRztJQUNhLElBQUksQ0FBQyxLQUF5QjtRQUM3QyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxD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aXRhYmxlLCBDb2xsZWN0aW9uLCBNZXNzYWdlIH0gZnJvbSBcImRpc2NvcmQuanNcIjtcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSBcIi4uLy4uXCI7XG5pbXBvcnQgeyBJbmhpYml0b3JIYW5kbGVyRXZlbnRzIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvZXZlbnRzXCI7XG5pbXBvcnQgQWthaXJvRXJyb3IgZnJvbSBcIi4uLy4uL3V0aWwvQWthaXJvRXJyb3JcIjtcbmltcG9ydCBBa2Fpcm9NZXNzYWdlIGZyb20gXCIuLi8uLi91dGlsL0FrYWlyb01lc3NhZ2VcIjtcbmltcG9ydCBVdGlsIGZyb20gXCIuLi8uLi91dGlsL1V0aWxcIjtcbmltcG9ydCBBa2Fpcm9DbGllbnQgZnJvbSBcIi4uL0FrYWlyb0NsaWVudFwiO1xuaW1wb3J0IEFrYWlyb0hhbmRsZXIsIHsgQWthaXJvSGFuZGxlck9wdGlvbnMsIExvYWRQcmVkaWNhdGUgfSBmcm9tIFwiLi4vQWthaXJvSGFuZGxlclwiO1xuaW1wb3J0IENvbW1hbmQgZnJvbSBcIi4uL2NvbW1hbmRzL0NvbW1hbmRcIjtcbmltcG9ydCBJbmhpYml0b3IgZnJvbSBcIi4vSW5oaWJpdG9yXCI7XG5cbi8qKlxuICogTG9hZHMgaW5oaWJpdG9ycyBhbmQgY2hlY2tzIG1lc3NhZ2VzLlxuICogQHBhcmFtIGNsaWVudCAtIFRoZSBBa2Fpcm8gY2xpZW50LlxuICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmhpYml0b3JIYW5kbGVyIGV4dGVuZHMgQWthaXJvSGFuZGxlciB7XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihcblx0XHRjbGllbnQ6IEFrYWlyb0NsaWVudCxcblx0XHR7XG5cdFx0XHRkaXJlY3RvcnksXG5cdFx0XHRjbGFzc1RvSGFuZGxlID0gSW5oaWJpdG9yLFxuXHRcdFx0ZXh0ZW5zaW9ucyA9IFtcIi5qc1wiLCBcIi50c1wiXSxcblx0XHRcdGF1dG9tYXRlQ2F0ZWdvcmllcyxcblx0XHRcdGxvYWRGaWx0ZXJcblx0XHR9OiBBa2Fpcm9IYW5kbGVyT3B0aW9ucyA9IHt9XG5cdCkge1xuXHRcdGlmICghKGNsYXNzVG9IYW5kbGUucHJvdG90eXBlIGluc3RhbmNlb2YgSW5oaWJpdG9yIHx8IGNsYXNzVG9IYW5kbGUgPT09IEluaGliaXRvcikpIHtcblx0XHRcdHRocm93IG5ldyBBa2Fpcm9FcnJvcihcIklOVkFMSURfQ0xBU1NfVE9fSEFORExFXCIsIGNsYXNzVG9IYW5kbGUubmFtZSwgSW5oaWJpdG9yLm5hbWUpO1xuXHRcdH1cblxuXHRcdHN1cGVyKGNsaWVudCwge1xuXHRcdFx0ZGlyZWN0b3J5LFxuXHRcdFx0Y2xhc3NUb0hhbmRsZSxcblx0XHRcdGV4dGVuc2lvbnMsXG5cdFx0XHRhdXRvbWF0ZUNhdGVnb3JpZXMsXG5cdFx0XHRsb2FkRmlsdGVyXG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2F0ZWdvcmllcywgbWFwcGVkIGJ5IElEIHRvIENhdGVnb3J5LlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgY2F0ZWdvcmllczogQ29sbGVjdGlvbjxzdHJpbmcsIENhdGVnb3J5PHN0cmluZywgSW5oaWJpdG9yPj47XG5cblx0LyoqXG5cdCAqIENsYXNzIHRvIGhhbmRsZS5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNsYXNzVG9IYW5kbGU6IHR5cGVvZiBJbmhpYml0b3I7XG5cblx0LyoqXG5cdCAqIFRoZSBBa2Fpcm8gY2xpZW50LlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgY2xpZW50OiBBa2Fpcm9DbGllbnQ7XG5cblx0LyoqXG5cdCAqIERpcmVjdG9yeSB0byBpbmhpYml0b3JzLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgZGlyZWN0b3J5OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEluaGliaXRvcnMgbG9hZGVkLCBtYXBwZWQgYnkgSUQgdG8gSW5oaWJpdG9yLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgbW9kdWxlczogQ29sbGVjdGlvbjxzdHJpbmcsIEluaGliaXRvcj47XG5cblx0LyoqXG5cdCAqIERlcmVnaXN0ZXJzIGEgbW9kdWxlLlxuXHQgKiBAcGFyYW0gaW5oaWJpdG9yIC0gTW9kdWxlIHRvIHVzZS5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSBkZXJlZ2lzdGVyKGluaGliaXRvcjogSW5oaWJpdG9yKTogdm9pZCB7XG5cdFx0cmV0dXJuIHN1cGVyLmRlcmVnaXN0ZXIoaW5oaWJpdG9yKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kcyBhIGNhdGVnb3J5IGJ5IG5hbWUuXG5cdCAqIEBwYXJhbSBuYW1lIC0gTmFtZSB0byBmaW5kIHdpdGguXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgZmluZENhdGVnb3J5KG5hbWU6IHN0cmluZyk6IENhdGVnb3J5PHN0cmluZywgSW5oaWJpdG9yPiB7XG5cdFx0cmV0dXJuIHN1cGVyLmZpbmRDYXRlZ29yeShuYW1lKSBhcyBDYXRlZ29yeTxzdHJpbmcsIEluaGliaXRvcj47XG5cdH1cblxuXHQvKipcblx0ICogTG9hZHMgYW4gaW5oaWJpdG9yLlxuXHQgKiBAcGFyYW0gdGhpbmcgLSBNb2R1bGUgb3IgcGF0aCB0byBtb2R1bGUuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgbG9hZCh0aGluZzogc3RyaW5nIHwgSW5oaWJpdG9yKTogUHJvbWlzZTxJbmhpYml0b3I+IHtcblx0XHRyZXR1cm4gc3VwZXIubG9hZCh0aGluZykgYXMgUHJvbWlzZTxJbmhpYml0b3I+O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlYWRzIGFsbCBpbmhpYml0b3JzIGZyb20gdGhlIGRpcmVjdG9yeSBhbmQgbG9hZHMgdGhlbS5cblx0ICogQHBhcmFtIGRpcmVjdG9yeSAtIERpcmVjdG9yeSB0byBsb2FkIGZyb20uIERlZmF1bHRzIHRvIHRoZSBkaXJlY3RvcnkgcGFzc2VkIGluIHRoZSBjb25zdHJ1Y3Rvci5cblx0ICogQHBhcmFtIGZpbHRlciAtIEZpbHRlciBmb3IgZmlsZXMsIHdoZXJlIHRydWUgbWVhbnMgaXQgc2hvdWxkIGJlIGxvYWRlZC5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSBsb2FkQWxsKGRpcmVjdG9yeT86IHN0cmluZywgZmlsdGVyPzogTG9hZFByZWRpY2F0ZSk6IFByb21pc2U8SW5oaWJpdG9ySGFuZGxlcj4ge1xuXHRcdHJldHVybiBzdXBlci5sb2FkQWxsKGRpcmVjdG9yeSwgZmlsdGVyKSBhcyBQcm9taXNlPEluaGliaXRvckhhbmRsZXI+O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVycyBhIG1vZHVsZS5cblx0ICogQHBhcmFtIGluaGliaXRvciAtIE1vZHVsZSB0byB1c2UuXG5cdCAqIEBwYXJhbSBmaWxlcGF0aCAtIEZpbGVwYXRoIG9mIG1vZHVsZS5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZWdpc3RlcihpbmhpYml0b3I6IEluaGliaXRvciwgZmlsZXBhdGg/OiBzdHJpbmcpOiB2b2lkIHtcblx0XHRyZXR1cm4gc3VwZXIucmVnaXN0ZXIoaW5oaWJpdG9yLCBmaWxlcGF0aCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVsb2FkcyBhbiBpbmhpYml0b3IuXG5cdCAqIEBwYXJhbSBpZCAtIElEIG9mIHRoZSBpbmhpYml0b3IuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVsb2FkKGlkOiBzdHJpbmcpOiBQcm9taXNlPEluaGliaXRvcj4ge1xuXHRcdHJldHVybiBzdXBlci5yZWxvYWQoaWQpIGFzIFByb21pc2U8SW5oaWJpdG9yPjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWxvYWRzIGFsbCBpbmhpYml0b3JzLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIHJlbG9hZEFsbCgpOiBQcm9taXNlPEluaGliaXRvckhhbmRsZXI+IHtcblx0XHRyZXR1cm4gc3VwZXIucmVsb2FkQWxsKCkgYXMgUHJvbWlzZTxJbmhpYml0b3JIYW5kbGVyPjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGFuIGluaGliaXRvci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gSUQgb2YgdGhlIGluaGliaXRvci5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZW1vdmUoaWQ6IHN0cmluZyk6IEluaGliaXRvciB7XG5cdFx0cmV0dXJuIHN1cGVyLnJlbW92ZShpZCkgYXMgSW5oaWJpdG9yO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYWxsIGluaGliaXRvcnMuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVtb3ZlQWxsKCk6IEluaGliaXRvckhhbmRsZXIge1xuXHRcdHJldHVybiBzdXBlci5yZW1vdmVBbGwoKSBhcyBJbmhpYml0b3JIYW5kbGVyO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIGluaGliaXRvcnMgYWdhaW5zdCB0aGUgbWVzc2FnZS5cblx0ICogUmV0dXJucyB0aGUgcmVhc29uIGlmIGJsb2NrZWQuXG5cdCAqIEBwYXJhbSB0eXBlIC0gVHlwZSBvZiBpbmhpYml0b3IsICdhbGwnLCAncHJlJywgb3IgJ3Bvc3QnLlxuXHQgKiBAcGFyYW0gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gdGVzdC5cblx0ICogQHBhcmFtIGNvbW1hbmQgLSBDb21tYW5kIHRvIHVzZS5cblx0ICovXG5cdHB1YmxpYyBhc3luYyB0ZXN0KFxuXHRcdHR5cGU6IFwiYWxsXCIgfCBcInByZVwiIHwgXCJwb3N0XCIsXG5cdFx0bWVzc2FnZTogTWVzc2FnZSB8IEFrYWlyb01lc3NhZ2UsXG5cdFx0Y29tbWFuZD86IENvbW1hbmRcblx0KTogUHJvbWlzZTxzdHJpbmcgfCBudWxsIHwgdm9pZD4ge1xuXHRcdGlmICghdGhpcy5tb2R1bGVzLnNpemUpIHJldHVybiBudWxsO1xuXG5cdFx0Y29uc3QgaW5oaWJpdG9ycyA9IHRoaXMubW9kdWxlcy5maWx0ZXIoaSA9PiBpLnR5cGUgPT09IHR5cGUpO1xuXHRcdGlmICghaW5oaWJpdG9ycy5zaXplKSByZXR1cm4gbnVsbDtcblxuXHRcdGNvbnN0IHByb21pc2VzID0gW107XG5cblx0XHRmb3IgKGNvbnN0IGluaGliaXRvciBvZiBpbmhpYml0b3JzLnZhbHVlcygpKSB7XG5cdFx0XHRwcm9taXNlcy5wdXNoKFxuXHRcdFx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdGxldCBpbmhpYml0ZWQgPSBpbmhpYml0b3IuZXhlYyhtZXNzYWdlLCBjb21tYW5kKTtcblx0XHRcdFx0XHRpZiAoVXRpbC5pc1Byb21pc2UoaW5oaWJpdGVkKSkgaW5oaWJpdGVkID0gYXdhaXQgaW5oaWJpdGVkO1xuXHRcdFx0XHRcdGlmIChpbmhpYml0ZWQpIHJldHVybiBpbmhpYml0b3I7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH0pKClcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5oaWJpdGVkSW5oaWJpdG9ycyA9IChhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcykpLmZpbHRlcihyID0+IHIpIGFzIEluaGliaXRvcltdO1xuXHRcdGlmICghaW5oaWJpdGVkSW5oaWJpdG9ycy5sZW5ndGgpIHJldHVybiBudWxsO1xuXG5cdFx0aW5oaWJpdGVkSW5oaWJpdG9ycy5zb3J0KChhLCBiKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eSk7XG5cdFx0cmV0dXJuIGluaGliaXRlZEluaGliaXRvcnNbMF0ucmVhc29uO1xuXHR9XG5cblx0cHVibGljIG92ZXJyaWRlIG9uPEsgZXh0ZW5kcyBrZXlvZiBJbmhpYml0b3JIYW5kbGVyRXZlbnRzPihcblx0XHRldmVudDogSyxcblx0XHRsaXN0ZW5lcjogKC4uLmFyZ3M6IEluaGliaXRvckhhbmRsZXJFdmVudHNbS11bXSkgPT4gQXdhaXRhYmxlPHZvaWQ+XG5cdCk6IHRoaXMge1xuXHRcdHJldHVybiBzdXBlci5vbihldmVudCwgbGlzdGVuZXIpO1xuXHR9XG5cdHB1YmxpYyBvdmVycmlkZSBvbmNlPEsgZXh0ZW5kcyBrZXlvZiBJbmhpYml0b3JIYW5kbGVyRXZlbnRzPihcblx0XHRldmVudDogSyxcblx0XHRsaXN0ZW5lcjogKC4uLmFyZ3M6IEluaGliaXRvckhhbmRsZXJFdmVudHNbS11bXSkgPT4gQXdhaXRhYmxlPHZvaWQ+XG5cdCk6IHRoaXMge1xuXHRcdHJldHVybiBzdXBlci5vbmNlKGV2ZW50LCBsaXN0ZW5lcik7XG5cdH1cbn1cbiJdfQ==