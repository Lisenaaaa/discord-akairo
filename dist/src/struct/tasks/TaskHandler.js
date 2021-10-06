"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AkairoError_1 = __importDefault(require("../../util/AkairoError"));
const AkairoHandler_1 = __importDefault(require("../AkairoHandler"));
const Task_1 = __importDefault(require("./Task"));
/**
 * Loads tasks.
 * @param client - The Akairo client.
 * @param options - Options.
 */
class TaskHandler extends AkairoHandler_1.default {
    constructor(client, { directory, classToHandle = Task_1.default, extensions = [".js", ".ts"], automateCategories, loadFilter }) {
        if (!(classToHandle.prototype instanceof Task_1.default || classToHandle === Task_1.default)) {
            throw new AkairoError_1.default("INVALID_CLASS_TO_HANDLE", classToHandle.name, Task_1.default.name);
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
     * @param task - Module to use.
     */
    deregister(task) {
        return super.deregister(task);
    }
    /**
     * Finds a category by name.
     * @param name - Name to find with.
     */
    findCategory(name) {
        return super.findCategory(name);
    }
    /**
     * Loads a task.
     * @param thing - Module or path to module.
     */
    load(thing, isReload) {
        return super.load(thing, isReload);
    }
    /**
     * Reads all tasks from the directory and loads them.
     * @param directory - Directory to load from. Defaults to the directory passed in the constructor.
     * @param filter - Filter for files, where true means it should be loaded.
     */
    loadAll(directory, filter) {
        return super.loadAll(directory, filter);
    }
    /**
     * Registers a task.
     * @param task - Task to use.
     * @param filepath - Filepath of task.
     */
    register(task, filepath) {
        return super.register(task, filepath);
    }
    /**
     * Reloads a task.
     * @param id - ID of the task.
     */
    reload(id) {
        return super.reload(id);
    }
    /**
     * Reloads all tasks.
     */
    reloadAll() {
        return super.reloadAll();
    }
    /**
     * Removes a task.
     * @param id - ID of the task.
     */
    remove(id) {
        return super.remove(id);
    }
    /**
     * Removes all tasks.
     */
    removeAll() {
        return super.removeAll();
    }
    /**
     * Start all tasks.
     */
    startAll() {
        this.client.once("ready", () => {
            this.modules.forEach(module => {
                if (!(module instanceof Task_1.default))
                    return;
                if (module.runOnStart)
                    module.exec();
                if (module.delay) {
                    setInterval(() => {
                        module.exec();
                    }, Number(module.delay));
                }
            });
        });
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
}
exports.default = TaskHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFza0hhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc3RydWN0L3Rhc2tzL1Rhc2tIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEseUVBQWlEO0FBR2pELHFFQUFzRjtBQUN0RixrREFBMEI7QUFFMUI7Ozs7R0FJRztBQUNILE1BQXFCLFdBQVksU0FBUSx1QkFBYTtJQUNyRCxZQUNDLE1BQW9CLEVBQ3BCLEVBQ0MsU0FBUyxFQUNULGFBQWEsR0FBRyxjQUFJLEVBQ3BCLFVBQVUsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFDM0Isa0JBQWtCLEVBQ2xCLFVBQVUsRUFDWTtRQUV2QixJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsU0FBUyxZQUFZLGNBQUksSUFBSSxhQUFhLEtBQUssY0FBSSxDQUFDLEVBQUU7WUFDekUsTUFBTSxJQUFJLHFCQUFXLENBQUMseUJBQXlCLEVBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEY7UUFFRCxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2IsU0FBUztZQUNULGFBQWE7WUFDYixVQUFVO1lBQ1Ysa0JBQWtCO1lBQ2xCLFVBQVU7U0FDVixDQUFDLENBQUM7SUFDSixDQUFDO0lBMkJEOzs7T0FHRztJQUNhLFVBQVUsQ0FBQyxJQUFVO1FBQ3BDLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQ7OztPQUdHO0lBQ2EsWUFBWSxDQUFDLElBQVk7UUFDeEMsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBMkIsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ2EsSUFBSSxDQUFDLEtBQW9CLEVBQUUsUUFBa0I7UUFDNUQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQWtCLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7O09BSUc7SUFDYSxPQUFPLENBQUMsU0FBa0IsRUFBRSxNQUFzQjtRQUNqRSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBeUIsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNhLFFBQVEsQ0FBQyxJQUFVLEVBQUUsUUFBaUI7UUFDckQsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ2EsTUFBTSxDQUFDLEVBQVU7UUFDaEMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBa0IsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7O09BRUc7SUFDYSxTQUFTO1FBQ3hCLE9BQU8sS0FBSyxDQUFDLFNBQVMsRUFBMEIsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ2EsTUFBTSxDQUFDLEVBQVU7UUFDaEMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBUyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7T0FFRztJQUNhLFNBQVM7UUFDeEIsT0FBTyxLQUFLLENBQUMsU0FBUyxFQUFpQixDQUFDO0lBQ3pDLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUM3QixJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksY0FBSSxDQUFDO29CQUFFLE9BQU87Z0JBQ3RDLElBQUksTUFBTSxDQUFDLFVBQVU7b0JBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNyQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7b0JBQ2pCLFdBQVcsQ0FBQyxHQUFHLEVBQUU7d0JBQ2hCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZixDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjtZQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRWUsRUFBRSxDQUNqQixLQUFRLEVBQ1IsUUFBOEQ7UUFFOUQsT0FBTyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ2UsSUFBSSxDQUNuQixLQUFRLEVBQ1IsUUFBOEQ7UUFFOUQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0Q7QUF0SkQsOEJBc0pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXdhaXRhYmxlLCBDb2xsZWN0aW9uIH0gZnJvbSBcImRpc2NvcmQuanNcIjtcbmltcG9ydCB7IFRhc2tIYW5kbGVyRXZlbnRzIH0gZnJvbSBcIi4uLy4uL3R5cGluZ3MvZXZlbnRzXCI7XG5pbXBvcnQgQWthaXJvRXJyb3IgZnJvbSBcIi4uLy4uL3V0aWwvQWthaXJvRXJyb3JcIjtcbmltcG9ydCBDYXRlZ29yeSBmcm9tIFwiLi4vLi4vdXRpbC9DYXRlZ29yeVwiO1xuaW1wb3J0IEFrYWlyb0NsaWVudCBmcm9tIFwiLi4vQWthaXJvQ2xpZW50XCI7XG5pbXBvcnQgQWthaXJvSGFuZGxlciwgeyBBa2Fpcm9IYW5kbGVyT3B0aW9ucywgTG9hZFByZWRpY2F0ZSB9IGZyb20gXCIuLi9Ba2Fpcm9IYW5kbGVyXCI7XG5pbXBvcnQgVGFzayBmcm9tIFwiLi9UYXNrXCI7XG5cbi8qKlxuICogTG9hZHMgdGFza3MuXG4gKiBAcGFyYW0gY2xpZW50IC0gVGhlIEFrYWlybyBjbGllbnQuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhc2tIYW5kbGVyIGV4dGVuZHMgQWthaXJvSGFuZGxlciB7XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihcblx0XHRjbGllbnQ6IEFrYWlyb0NsaWVudCxcblx0XHR7XG5cdFx0XHRkaXJlY3RvcnksXG5cdFx0XHRjbGFzc1RvSGFuZGxlID0gVGFzayxcblx0XHRcdGV4dGVuc2lvbnMgPSBbXCIuanNcIiwgXCIudHNcIl0sXG5cdFx0XHRhdXRvbWF0ZUNhdGVnb3JpZXMsXG5cdFx0XHRsb2FkRmlsdGVyXG5cdFx0fTogQWthaXJvSGFuZGxlck9wdGlvbnNcblx0KSB7XG5cdFx0aWYgKCEoY2xhc3NUb0hhbmRsZS5wcm90b3R5cGUgaW5zdGFuY2VvZiBUYXNrIHx8IGNsYXNzVG9IYW5kbGUgPT09IFRhc2spKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWthaXJvRXJyb3IoXCJJTlZBTElEX0NMQVNTX1RPX0hBTkRMRVwiLCBjbGFzc1RvSGFuZGxlLm5hbWUsIFRhc2submFtZSk7XG5cdFx0fVxuXG5cdFx0c3VwZXIoY2xpZW50LCB7XG5cdFx0XHRkaXJlY3RvcnksXG5cdFx0XHRjbGFzc1RvSGFuZGxlLFxuXHRcdFx0ZXh0ZW5zaW9ucyxcblx0XHRcdGF1dG9tYXRlQ2F0ZWdvcmllcyxcblx0XHRcdGxvYWRGaWx0ZXJcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYXRlZ29yaWVzLCBtYXBwZWQgYnkgSUQgdG8gQ2F0ZWdvcnkuXG5cdCAqL1xuXHRwdWJsaWMgZGVjbGFyZSBjYXRlZ29yaWVzOiBDb2xsZWN0aW9uPHN0cmluZywgQ2F0ZWdvcnk8c3RyaW5nLCBUYXNrPj47XG5cblx0LyoqXG5cdCAqIENsYXNzIHRvIGhhbmRsZS5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNsYXNzVG9IYW5kbGU6IHR5cGVvZiBUYXNrO1xuXG5cdC8qKlxuXHQgKiBUaGUgQWthaXJvIGNsaWVudFxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgY2xpZW50OiBBa2Fpcm9DbGllbnQ7XG5cblx0LyoqXG5cdCAqIERpcmVjdG9yeSB0byB0YXNrcy5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGRpcmVjdG9yeTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUYXNrcyBsb2FkZWQsIG1hcHBlZCBieSBJRCB0byB0YXNrLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgbW9kdWxlczogQ29sbGVjdGlvbjxzdHJpbmcsIFRhc2s+O1xuXG5cdC8qKlxuXHQgKiBEZXJlZ2lzdGVycyBhIG1vZHVsZS5cblx0ICogQHBhcmFtIHRhc2sgLSBNb2R1bGUgdG8gdXNlLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIGRlcmVnaXN0ZXIodGFzazogVGFzayk6IHZvaWQge1xuXHRcdHJldHVybiBzdXBlci5kZXJlZ2lzdGVyKHRhc2spO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIGEgY2F0ZWdvcnkgYnkgbmFtZS5cblx0ICogQHBhcmFtIG5hbWUgLSBOYW1lIHRvIGZpbmQgd2l0aC5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSBmaW5kQ2F0ZWdvcnkobmFtZTogc3RyaW5nKTogQ2F0ZWdvcnk8c3RyaW5nLCBUYXNrPiB7XG5cdFx0cmV0dXJuIHN1cGVyLmZpbmRDYXRlZ29yeShuYW1lKSBhcyBDYXRlZ29yeTxzdHJpbmcsIFRhc2s+O1xuXHR9XG5cblx0LyoqXG5cdCAqIExvYWRzIGEgdGFzay5cblx0ICogQHBhcmFtIHRoaW5nIC0gTW9kdWxlIG9yIHBhdGggdG8gbW9kdWxlLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIGxvYWQodGhpbmc6IHN0cmluZyB8IFRhc2ssIGlzUmVsb2FkPzogYm9vbGVhbik6IFByb21pc2U8VGFzaz4ge1xuXHRcdHJldHVybiBzdXBlci5sb2FkKHRoaW5nLCBpc1JlbG9hZCkgYXMgUHJvbWlzZTxUYXNrPjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWFkcyBhbGwgdGFza3MgZnJvbSB0aGUgZGlyZWN0b3J5IGFuZCBsb2FkcyB0aGVtLlxuXHQgKiBAcGFyYW0gZGlyZWN0b3J5IC0gRGlyZWN0b3J5IHRvIGxvYWQgZnJvbS4gRGVmYXVsdHMgdG8gdGhlIGRpcmVjdG9yeSBwYXNzZWQgaW4gdGhlIGNvbnN0cnVjdG9yLlxuXHQgKiBAcGFyYW0gZmlsdGVyIC0gRmlsdGVyIGZvciBmaWxlcywgd2hlcmUgdHJ1ZSBtZWFucyBpdCBzaG91bGQgYmUgbG9hZGVkLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIGxvYWRBbGwoZGlyZWN0b3J5Pzogc3RyaW5nLCBmaWx0ZXI/OiBMb2FkUHJlZGljYXRlKTogUHJvbWlzZTxUYXNrSGFuZGxlcj4ge1xuXHRcdHJldHVybiBzdXBlci5sb2FkQWxsKGRpcmVjdG9yeSwgZmlsdGVyKSBhcyBQcm9taXNlPFRhc2tIYW5kbGVyPjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgYSB0YXNrLlxuXHQgKiBAcGFyYW0gdGFzayAtIFRhc2sgdG8gdXNlLlxuXHQgKiBAcGFyYW0gZmlsZXBhdGggLSBGaWxlcGF0aCBvZiB0YXNrLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIHJlZ2lzdGVyKHRhc2s6IFRhc2ssIGZpbGVwYXRoPzogc3RyaW5nKTogdm9pZCB7XG5cdFx0cmV0dXJuIHN1cGVyLnJlZ2lzdGVyKHRhc2ssIGZpbGVwYXRoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWxvYWRzIGEgdGFzay5cblx0ICogQHBhcmFtIGlkIC0gSUQgb2YgdGhlIHRhc2suXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVsb2FkKGlkOiBzdHJpbmcpOiBQcm9taXNlPFRhc2s+IHtcblx0XHRyZXR1cm4gc3VwZXIucmVsb2FkKGlkKSBhcyBQcm9taXNlPFRhc2s+O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbG9hZHMgYWxsIHRhc2tzLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIHJlbG9hZEFsbCgpOiBQcm9taXNlPFRhc2tIYW5kbGVyPiB7XG5cdFx0cmV0dXJuIHN1cGVyLnJlbG9hZEFsbCgpIGFzIFByb21pc2U8VGFza0hhbmRsZXI+O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYSB0YXNrLlxuXHQgKiBAcGFyYW0gaWQgLSBJRCBvZiB0aGUgdGFzay5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZW1vdmUoaWQ6IHN0cmluZyk6IFRhc2sge1xuXHRcdHJldHVybiBzdXBlci5yZW1vdmUoaWQpIGFzIFRhc2s7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgdGFza3MuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVtb3ZlQWxsKCk6IFRhc2tIYW5kbGVyIHtcblx0XHRyZXR1cm4gc3VwZXIucmVtb3ZlQWxsKCkgYXMgVGFza0hhbmRsZXI7XG5cdH1cblxuXHQvKipcblx0ICogU3RhcnQgYWxsIHRhc2tzLlxuXHQgKi9cblx0cHVibGljIHN0YXJ0QWxsKCk6IHZvaWQge1xuXHRcdHRoaXMuY2xpZW50Lm9uY2UoXCJyZWFkeVwiLCAoKSA9PiB7XG5cdFx0XHR0aGlzLm1vZHVsZXMuZm9yRWFjaChtb2R1bGUgPT4ge1xuXHRcdFx0XHRpZiAoIShtb2R1bGUgaW5zdGFuY2VvZiBUYXNrKSkgcmV0dXJuO1xuXHRcdFx0XHRpZiAobW9kdWxlLnJ1bk9uU3RhcnQpIG1vZHVsZS5leGVjKCk7XG5cdFx0XHRcdGlmIChtb2R1bGUuZGVsYXkpIHtcblx0XHRcdFx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRtb2R1bGUuZXhlYygpO1xuXHRcdFx0XHRcdH0sIE51bWJlcihtb2R1bGUuZGVsYXkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgb3ZlcnJpZGUgb248SyBleHRlbmRzIGtleW9mIFRhc2tIYW5kbGVyRXZlbnRzPihcblx0XHRldmVudDogSyxcblx0XHRsaXN0ZW5lcjogKC4uLmFyZ3M6IFRhc2tIYW5kbGVyRXZlbnRzW0tdW10pID0+IEF3YWl0YWJsZTx2b2lkPlxuXHQpOiB0aGlzIHtcblx0XHRyZXR1cm4gc3VwZXIub24oZXZlbnQsIGxpc3RlbmVyKTtcblx0fVxuXHRwdWJsaWMgb3ZlcnJpZGUgb25jZTxLIGV4dGVuZHMga2V5b2YgVGFza0hhbmRsZXJFdmVudHM+KFxuXHRcdGV2ZW50OiBLLFxuXHRcdGxpc3RlbmVyOiAoLi4uYXJnczogVGFza0hhbmRsZXJFdmVudHNbS11bXSkgPT4gQXdhaXRhYmxlPHZvaWQ+XG5cdCk6IHRoaXMge1xuXHRcdHJldHVybiBzdXBlci5vbmNlKGV2ZW50LCBsaXN0ZW5lcik7XG5cdH1cbn1cbiJdfQ==