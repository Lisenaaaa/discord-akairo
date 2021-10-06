"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AkairoError_1 = __importDefault(require("../../util/AkairoError"));
const Util_1 = __importDefault(require("../../util/Util"));
const AkairoHandler_1 = __importDefault(require("../AkairoHandler"));
const Listener_1 = __importDefault(require("./Listener"));
/**
 * Loads listeners and registers them with EventEmitters.
 * @param client - The Akairo client.
 * @param options - Options.
 */
class ListenerHandler extends AkairoHandler_1.default {
    constructor(client, { directory, classToHandle = Listener_1.default, extensions = [".js", ".ts"], automateCategories, loadFilter } = {}) {
        if (!(classToHandle.prototype instanceof Listener_1.default || classToHandle === Listener_1.default)) {
            throw new AkairoError_1.default("INVALID_CLASS_TO_HANDLE", classToHandle.name, Listener_1.default.name);
        }
        super(client, {
            directory,
            classToHandle,
            extensions,
            automateCategories,
            loadFilter
        });
        this.emitters = new discord_js_1.Collection();
        this.emitters.set("client", this.client);
    }
    /**
     * EventEmitters for use, mapped by name to EventEmitter.
     * By default, 'client' is set to the given client.
     */
    emitters;
    /**
     * Adds a listener to the EventEmitter.
     * @param id - ID of the listener.
     */
    addToEmitter(id) {
        const listener = this.modules.get(id.toString());
        if (!listener)
            throw new AkairoError_1.default("MODULE_NOT_FOUND", this.classToHandle.name, id);
        /**
         * @type {AkairoHandler}
         */
        const emitter = Util_1.default.isEventEmitter(listener.emitter)
            ? listener.emitter
            : this.emitters.get(listener.emitter);
        if (!Util_1.default.isEventEmitter(emitter))
            throw new AkairoError_1.default("INVALID_TYPE", "emitter", "EventEmitter", true);
        emitter[listener.type ?? "on"](listener.event, listener.exec);
        return listener;
    }
    /**
     * Deregisters a module.
     * @param mod - Module to use.
     */
    deregister(listener) {
        this.removeFromEmitter(listener.id);
        super.deregister(listener);
    }
    /**
     * Finds a category by name.
     * @param name - Name to find with.
     */
    findCategory(name) {
        return super.findCategory(name);
    }
    /**
     * Loads a module, can be a module class or a filepath.
     * @param thing - Module class or path to module.
     * @param isReload - Whether this is a reload or not.
     */
    load(thing, isReload) {
        return super.load(thing, isReload);
    }
    /**
     * Reads all listeners from the directory and loads them.
     * @param directory - Directory to load from. Defaults to the directory passed in the constructor.
     * @param filter - Filter for files, where true means it should be loaded.
     */
    loadAll(directory, filter) {
        return super.loadAll(directory, filter);
    }
    /**
     * Registers a module.
     * @param listener - Module to use.
     * @param filepath - Filepath of module.
     */
    register(listener, filepath) {
        super.register(listener, filepath);
        listener.exec = listener.exec.bind(listener);
        this.addToEmitter(listener.id);
    }
    /**
     * Reloads a listener.
     * @param id - ID of the listener.
     */
    reload(id) {
        return super.reload(id);
    }
    /**
     * Reloads all listeners.
     */
    reloadAll() {
        return super.reloadAll();
    }
    /**
     * Removes a listener.
     * @param id - ID of the listener.
     */
    remove(id) {
        return super.remove(id);
    }
    /**
     * Removes all listeners.
     */
    removeAll() {
        return super.removeAll();
    }
    /**
     * Removes a listener from the EventEmitter.
     * @param id - ID of the listener.
     */
    removeFromEmitter(id) {
        const listener = this.modules.get(id.toString());
        if (!listener)
            throw new AkairoError_1.default("MODULE_NOT_FOUND", this.classToHandle.name, id);
        const emitter = Util_1.default.isEventEmitter(listener.emitter)
            ? listener.emitter
            : this.emitters.get(listener.emitter);
        if (!Util_1.default.isEventEmitter(emitter))
            throw new AkairoError_1.default("INVALID_TYPE", "emitter", "EventEmitter", true);
        emitter.removeListener(listener.event, listener.exec);
        return listener;
    }
    /**
     * Sets custom emitters.
     * @param emitters - Emitters to use. The key is the name and value is the emitter.
     */
    setEmitters(emitters) {
        for (const [key, value] of Object.entries(emitters)) {
            if (!Util_1.default.isEventEmitter(value))
                throw new AkairoError_1.default("INVALID_TYPE", key, "EventEmitter", true);
            this.emitters.set(key, value);
        }
        return this;
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
}
exports.default = ListenerHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdGVuZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N0cnVjdC9saXN0ZW5lcnMvTGlzdGVuZXJIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkNBQW1EO0FBR25ELHlFQUFpRDtBQUVqRCwyREFBbUM7QUFFbkMscUVBQXNGO0FBQ3RGLDBEQUFrQztBQUVsQzs7OztHQUlHO0FBQ0gsTUFBcUIsZUFBZ0IsU0FBUSx1QkFBYTtJQUN6RCxZQUNDLE1BQW9CLEVBQ3BCLEVBQ0MsU0FBUyxFQUNULGFBQWEsR0FBRyxrQkFBUSxFQUN4QixVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQzNCLGtCQUFrQixFQUNsQixVQUFVLEtBQ2UsRUFBRTtRQUU1QixJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsU0FBUyxZQUFZLGtCQUFRLElBQUksYUFBYSxLQUFLLGtCQUFRLENBQUMsRUFBRTtZQUNqRixNQUFNLElBQUkscUJBQVcsQ0FBQyx5QkFBeUIsRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEY7UUFFRCxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2IsU0FBUztZQUNULGFBQWE7WUFDYixVQUFVO1lBQ1Ysa0JBQWtCO1lBQ2xCLFVBQVU7U0FDVixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQXNCRDs7O09BR0c7SUFDSSxRQUFRLENBQW1DO0lBT2xEOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxFQUFVO1FBQzdCLE1BQU0sUUFBUSxHQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxR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Y2VzQ29udGVudCI6WyJpbXBvcnQgeyBBd2FpdGFibGUsIENvbGxlY3Rpb24gfSBmcm9tIFwiZGlzY29yZC5qc1wiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5pbXBvcnQgeyBMaXN0ZW5lckhhbmRsZXJFdmVudHMgfSBmcm9tIFwiLi4vLi4vdHlwaW5ncy9ldmVudHNcIjtcbmltcG9ydCBBa2Fpcm9FcnJvciBmcm9tIFwiLi4vLi4vdXRpbC9Ba2Fpcm9FcnJvclwiO1xuaW1wb3J0IENhdGVnb3J5IGZyb20gXCIuLi8uLi91dGlsL0NhdGVnb3J5XCI7XG5pbXBvcnQgVXRpbCBmcm9tIFwiLi4vLi4vdXRpbC9VdGlsXCI7XG5pbXBvcnQgQWthaXJvQ2xpZW50IGZyb20gXCIuLi9Ba2Fpcm9DbGllbnRcIjtcbmltcG9ydCBBa2Fpcm9IYW5kbGVyLCB7IEFrYWlyb0hhbmRsZXJPcHRpb25zLCBMb2FkUHJlZGljYXRlIH0gZnJvbSBcIi4uL0FrYWlyb0hhbmRsZXJcIjtcbmltcG9ydCBMaXN0ZW5lciBmcm9tIFwiLi9MaXN0ZW5lclwiO1xuXG4vKipcbiAqIExvYWRzIGxpc3RlbmVycyBhbmQgcmVnaXN0ZXJzIHRoZW0gd2l0aCBFdmVudEVtaXR0ZXJzLlxuICogQHBhcmFtIGNsaWVudCAtIFRoZSBBa2Fpcm8gY2xpZW50LlxuICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0ZW5lckhhbmRsZXIgZXh0ZW5kcyBBa2Fpcm9IYW5kbGVyIHtcblx0cHVibGljIGNvbnN0cnVjdG9yKFxuXHRcdGNsaWVudDogQWthaXJvQ2xpZW50LFxuXHRcdHtcblx0XHRcdGRpcmVjdG9yeSxcblx0XHRcdGNsYXNzVG9IYW5kbGUgPSBMaXN0ZW5lcixcblx0XHRcdGV4dGVuc2lvbnMgPSBbXCIuanNcIiwgXCIudHNcIl0sXG5cdFx0XHRhdXRvbWF0ZUNhdGVnb3JpZXMsXG5cdFx0XHRsb2FkRmlsdGVyXG5cdFx0fTogQWthaXJvSGFuZGxlck9wdGlvbnMgPSB7fVxuXHQpIHtcblx0XHRpZiAoIShjbGFzc1RvSGFuZGxlLnByb3RvdHlwZSBpbnN0YW5jZW9mIExpc3RlbmVyIHx8IGNsYXNzVG9IYW5kbGUgPT09IExpc3RlbmVyKSkge1xuXHRcdFx0dGhyb3cgbmV3IEFrYWlyb0Vycm9yKFwiSU5WQUxJRF9DTEFTU19UT19IQU5ETEVcIiwgY2xhc3NUb0hhbmRsZS5uYW1lLCBMaXN0ZW5lci5uYW1lKTtcblx0XHR9XG5cblx0XHRzdXBlcihjbGllbnQsIHtcblx0XHRcdGRpcmVjdG9yeSxcblx0XHRcdGNsYXNzVG9IYW5kbGUsXG5cdFx0XHRleHRlbnNpb25zLFxuXHRcdFx0YXV0b21hdGVDYXRlZ29yaWVzLFxuXHRcdFx0bG9hZEZpbHRlclxuXHRcdH0pO1xuXG5cdFx0dGhpcy5lbWl0dGVycyA9IG5ldyBDb2xsZWN0aW9uKCk7XG5cdFx0dGhpcy5lbWl0dGVycy5zZXQoXCJjbGllbnRcIiwgdGhpcy5jbGllbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhdGVnb3JpZXMsIG1hcHBlZCBieSBJRCB0byBDYXRlZ29yeS5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNhdGVnb3JpZXM6IENvbGxlY3Rpb248c3RyaW5nLCBDYXRlZ29yeTxzdHJpbmcsIExpc3RlbmVyPj47XG5cblx0LyoqXG5cdCAqIENsYXNzIHRvIGhhbmRsZS5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNsYXNzVG9IYW5kbGU6IHR5cGVvZiBMaXN0ZW5lcjtcblxuXHQvKipcblx0ICogVGhlIEFrYWlybyBjbGllbnRcblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIGNsaWVudDogQWthaXJvQ2xpZW50O1xuXG5cdC8qKlxuXHQgKiBEaXJlY3RvcnkgdG8gbGlzdGVuZXJzLlxuXHQgKi9cblx0cHVibGljIGRlY2xhcmUgZGlyZWN0b3J5OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEV2ZW50RW1pdHRlcnMgZm9yIHVzZSwgbWFwcGVkIGJ5IG5hbWUgdG8gRXZlbnRFbWl0dGVyLlxuXHQgKiBCeSBkZWZhdWx0LCAnY2xpZW50JyBpcyBzZXQgdG8gdGhlIGdpdmVuIGNsaWVudC5cblx0ICovXG5cdHB1YmxpYyBlbWl0dGVyczogQ29sbGVjdGlvbjxzdHJpbmcsIEV2ZW50RW1pdHRlcj47XG5cblx0LyoqXG5cdCAqIExpc3RlbmVycyBsb2FkZWQsIG1hcHBlZCBieSBJRCB0byBMaXN0ZW5lci5cblx0ICovXG5cdHB1YmxpYyBkZWNsYXJlIG1vZHVsZXM6IENvbGxlY3Rpb248c3RyaW5nLCBMaXN0ZW5lcj47XG5cblx0LyoqXG5cdCAqIEFkZHMgYSBsaXN0ZW5lciB0byB0aGUgRXZlbnRFbWl0dGVyLlxuXHQgKiBAcGFyYW0gaWQgLSBJRCBvZiB0aGUgbGlzdGVuZXIuXG5cdCAqL1xuXHRwdWJsaWMgYWRkVG9FbWl0dGVyKGlkOiBzdHJpbmcpOiBMaXN0ZW5lciB7XG5cdFx0Y29uc3QgbGlzdGVuZXI6IExpc3RlbmVyID0gdGhpcy5tb2R1bGVzLmdldChpZC50b1N0cmluZygpKSE7XG5cdFx0aWYgKCFsaXN0ZW5lcikgdGhyb3cgbmV3IEFrYWlyb0Vycm9yKFwiTU9EVUxFX05PVF9GT1VORFwiLCB0aGlzLmNsYXNzVG9IYW5kbGUubmFtZSwgaWQpO1xuXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge0FrYWlyb0hhbmRsZXJ9XG5cdFx0ICovXG5cdFx0Y29uc3QgZW1pdHRlcjogRXZlbnRFbWl0dGVyID0gVXRpbC5pc0V2ZW50RW1pdHRlcihsaXN0ZW5lci5lbWl0dGVyKVxuXHRcdFx0PyAobGlzdGVuZXIuZW1pdHRlciBhcyBFdmVudEVtaXR0ZXIpXG5cdFx0XHQ6IHRoaXMuZW1pdHRlcnMuZ2V0KGxpc3RlbmVyLmVtaXR0ZXIgYXMgc3RyaW5nKSE7XG5cdFx0aWYgKCFVdGlsLmlzRXZlbnRFbWl0dGVyKGVtaXR0ZXIpKSB0aHJvdyBuZXcgQWthaXJvRXJyb3IoXCJJTlZBTElEX1RZUEVcIiwgXCJlbWl0dGVyXCIsIFwiRXZlbnRFbWl0dGVyXCIsIHRydWUpO1xuXG5cdFx0ZW1pdHRlcltsaXN0ZW5lci50eXBlID8/IFwib25cIl0obGlzdGVuZXIuZXZlbnQsIGxpc3RlbmVyLmV4ZWMpO1xuXHRcdHJldHVybiBsaXN0ZW5lcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXJlZ2lzdGVycyBhIG1vZHVsZS5cblx0ICogQHBhcmFtIG1vZCAtIE1vZHVsZSB0byB1c2UuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgZGVyZWdpc3RlcihsaXN0ZW5lcjogTGlzdGVuZXIpOiB2b2lkIHtcblx0XHR0aGlzLnJlbW92ZUZyb21FbWl0dGVyKGxpc3RlbmVyLmlkKTtcblx0XHRzdXBlci5kZXJlZ2lzdGVyKGxpc3RlbmVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kcyBhIGNhdGVnb3J5IGJ5IG5hbWUuXG5cdCAqIEBwYXJhbSBuYW1lIC0gTmFtZSB0byBmaW5kIHdpdGguXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgZmluZENhdGVnb3J5KG5hbWU6IHN0cmluZyk6IENhdGVnb3J5PHN0cmluZywgTGlzdGVuZXI+IHtcblx0XHRyZXR1cm4gc3VwZXIuZmluZENhdGVnb3J5KG5hbWUpIGFzIENhdGVnb3J5PHN0cmluZywgTGlzdGVuZXI+O1xuXHR9XG5cblx0LyoqXG5cdCAqIExvYWRzIGEgbW9kdWxlLCBjYW4gYmUgYSBtb2R1bGUgY2xhc3Mgb3IgYSBmaWxlcGF0aC5cblx0ICogQHBhcmFtIHRoaW5nIC0gTW9kdWxlIGNsYXNzIG9yIHBhdGggdG8gbW9kdWxlLlxuXHQgKiBAcGFyYW0gaXNSZWxvYWQgLSBXaGV0aGVyIHRoaXMgaXMgYSByZWxvYWQgb3Igbm90LlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIGxvYWQodGhpbmc6IHN0cmluZyB8IExpc3RlbmVyLCBpc1JlbG9hZD86IGJvb2xlYW4pOiBQcm9taXNlPExpc3RlbmVyPiB7XG5cdFx0cmV0dXJuIHN1cGVyLmxvYWQodGhpbmcsIGlzUmVsb2FkKSBhcyBQcm9taXNlPExpc3RlbmVyPjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWFkcyBhbGwgbGlzdGVuZXJzIGZyb20gdGhlIGRpcmVjdG9yeSBhbmQgbG9hZHMgdGhlbS5cblx0ICogQHBhcmFtIGRpcmVjdG9yeSAtIERpcmVjdG9yeSB0byBsb2FkIGZyb20uIERlZmF1bHRzIHRvIHRoZSBkaXJlY3RvcnkgcGFzc2VkIGluIHRoZSBjb25zdHJ1Y3Rvci5cblx0ICogQHBhcmFtIGZpbHRlciAtIEZpbHRlciBmb3IgZmlsZXMsIHdoZXJlIHRydWUgbWVhbnMgaXQgc2hvdWxkIGJlIGxvYWRlZC5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSBsb2FkQWxsKGRpcmVjdG9yeT86IHN0cmluZywgZmlsdGVyPzogTG9hZFByZWRpY2F0ZSk6IFByb21pc2U8TGlzdGVuZXJIYW5kbGVyPiB7XG5cdFx0cmV0dXJuIHN1cGVyLmxvYWRBbGwoZGlyZWN0b3J5LCBmaWx0ZXIpIGFzIFByb21pc2U8TGlzdGVuZXJIYW5kbGVyPjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgYSBtb2R1bGUuXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciAtIE1vZHVsZSB0byB1c2UuXG5cdCAqIEBwYXJhbSBmaWxlcGF0aCAtIEZpbGVwYXRoIG9mIG1vZHVsZS5cblx0ICovXG5cdHB1YmxpYyBvdmVycmlkZSByZWdpc3RlcihsaXN0ZW5lcjogTGlzdGVuZXIsIGZpbGVwYXRoPzogc3RyaW5nKTogdm9pZCB7XG5cdFx0c3VwZXIucmVnaXN0ZXIobGlzdGVuZXIsIGZpbGVwYXRoKTtcblx0XHRsaXN0ZW5lci5leGVjID0gbGlzdGVuZXIuZXhlYy5iaW5kKGxpc3RlbmVyKTtcblx0XHR0aGlzLmFkZFRvRW1pdHRlcihsaXN0ZW5lci5pZCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVsb2FkcyBhIGxpc3RlbmVyLlxuXHQgKiBAcGFyYW0gaWQgLSBJRCBvZiB0aGUgbGlzdGVuZXIuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVsb2FkKGlkOiBzdHJpbmcpOiBQcm9taXNlPExpc3RlbmVyPiB7XG5cdFx0cmV0dXJuIHN1cGVyLnJlbG9hZChpZCkgYXMgUHJvbWlzZTxMaXN0ZW5lcj47XG5cdH1cblxuXHQvKipcblx0ICogUmVsb2FkcyBhbGwgbGlzdGVuZXJzLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIHJlbG9hZEFsbCgpOiBQcm9taXNlPExpc3RlbmVySGFuZGxlcj4ge1xuXHRcdHJldHVybiBzdXBlci5yZWxvYWRBbGwoKSBhcyBQcm9taXNlPExpc3RlbmVySGFuZGxlcj47XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhIGxpc3RlbmVyLlxuXHQgKiBAcGFyYW0gaWQgLSBJRCBvZiB0aGUgbGlzdGVuZXIuXG5cdCAqL1xuXHRwdWJsaWMgb3ZlcnJpZGUgcmVtb3ZlKGlkOiBzdHJpbmcpOiBMaXN0ZW5lciB7XG5cdFx0cmV0dXJuIHN1cGVyLnJlbW92ZShpZCkgYXMgTGlzdGVuZXI7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzLlxuXHQgKi9cblx0cHVibGljIG92ZXJyaWRlIHJlbW92ZUFsbCgpOiBMaXN0ZW5lckhhbmRsZXIge1xuXHRcdHJldHVybiBzdXBlci5yZW1vdmVBbGwoKSBhcyBMaXN0ZW5lckhhbmRsZXI7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gdGhlIEV2ZW50RW1pdHRlci5cblx0ICogQHBhcmFtIGlkIC0gSUQgb2YgdGhlIGxpc3RlbmVyLlxuXHQgKi9cblx0cHVibGljIHJlbW92ZUZyb21FbWl0dGVyKGlkOiBzdHJpbmcpOiBMaXN0ZW5lciB7XG5cdFx0Y29uc3QgbGlzdGVuZXI6IExpc3RlbmVyID0gdGhpcy5tb2R1bGVzLmdldChpZC50b1N0cmluZygpKSE7XG5cdFx0aWYgKCFsaXN0ZW5lcikgdGhyb3cgbmV3IEFrYWlyb0Vycm9yKFwiTU9EVUxFX05PVF9GT1VORFwiLCB0aGlzLmNsYXNzVG9IYW5kbGUubmFtZSwgaWQpO1xuXG5cdFx0Y29uc3QgZW1pdHRlcjogRXZlbnRFbWl0dGVyID0gVXRpbC5pc0V2ZW50RW1pdHRlcihsaXN0ZW5lci5lbWl0dGVyKVxuXHRcdFx0PyAobGlzdGVuZXIuZW1pdHRlciBhcyBFdmVudEVtaXR0ZXIpXG5cdFx0XHQ6IHRoaXMuZW1pdHRlcnMuZ2V0KGxpc3RlbmVyLmVtaXR0ZXIgYXMgc3RyaW5nKSE7XG5cdFx0aWYgKCFVdGlsLmlzRXZlbnRFbWl0dGVyKGVtaXR0ZXIpKSB0aHJvdyBuZXcgQWthaXJvRXJyb3IoXCJJTlZBTElEX1RZUEVcIiwgXCJlbWl0dGVyXCIsIFwiRXZlbnRFbWl0dGVyXCIsIHRydWUpO1xuXG5cdFx0ZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lci5ldmVudCwgbGlzdGVuZXIuZXhlYyk7XG5cdFx0cmV0dXJuIGxpc3RlbmVyO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgY3VzdG9tIGVtaXR0ZXJzLlxuXHQgKiBAcGFyYW0gZW1pdHRlcnMgLSBFbWl0dGVycyB0byB1c2UuIFRoZSBrZXkgaXMgdGhlIG5hbWUgYW5kIHZhbHVlIGlzIHRoZSBlbWl0dGVyLlxuXHQgKi9cblx0c2V0RW1pdHRlcnMoZW1pdHRlcnM6IGFueSk6IExpc3RlbmVySGFuZGxlciB7XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZW1pdHRlcnMpKSB7XG5cdFx0XHRpZiAoIVV0aWwuaXNFdmVudEVtaXR0ZXIodmFsdWUpKSB0aHJvdyBuZXcgQWthaXJvRXJyb3IoXCJJTlZBTElEX1RZUEVcIiwga2V5LCBcIkV2ZW50RW1pdHRlclwiLCB0cnVlKTtcblx0XHRcdHRoaXMuZW1pdHRlcnMuc2V0KGtleSwgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0cHVibGljIG92ZXJyaWRlIG9uPEsgZXh0ZW5kcyBrZXlvZiBMaXN0ZW5lckhhbmRsZXJFdmVudHM+KFxuXHRcdGV2ZW50OiBLLFxuXHRcdGxpc3RlbmVyOiAoLi4uYXJnczogTGlzdGVuZXJIYW5kbGVyRXZlbnRzW0tdW10pID0+IEF3YWl0YWJsZTx2b2lkPlxuXHQpOiB0aGlzIHtcblx0XHRyZXR1cm4gc3VwZXIub24oZXZlbnQsIGxpc3RlbmVyKTtcblx0fVxuXHRwdWJsaWMgb3ZlcnJpZGUgb25jZTxLIGV4dGVuZHMga2V5b2YgTGlzdGVuZXJIYW5kbGVyRXZlbnRzPihcblx0XHRldmVudDogSyxcblx0XHRsaXN0ZW5lcjogKC4uLmFyZ3M6IExpc3RlbmVySGFuZGxlckV2ZW50c1tLXVtdKSA9PiBBd2FpdGFibGU8dm9pZD5cblx0KTogdGhpcyB7XG5cdFx0cmV0dXJuIHN1cGVyLm9uY2UoZXZlbnQsIGxpc3RlbmVyKTtcblx0fVxufVxuIl19