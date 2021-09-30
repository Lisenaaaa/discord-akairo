import {
	AkairoClient,
	CommandHandler,
	ContextMenuCommandHandler,
	InhibitorHandler,
	ListenerHandler,
	TaskHandler
} from "discord-akairo";
import path from "path";

export default class TestClient extends AkairoClient {
	public commandHandler: CommandHandler;
	public inhibitorHandler: InhibitorHandler;
	public listenerHandler: ListenerHandler;
	public taskHandler: TaskHandler;
	public contextMenuCommandHandler: ContextMenuCommandHandler;
	public constructor() {
		super({
			ownerID: ["123992700587343872", "322862723090219008"],
			intents: [
				"DIRECT_MESSAGE_REACTIONS",
				"DIRECT_MESSAGE_REACTIONS",
				"DIRECT_MESSAGE_TYPING",
				"DIRECT_MESSAGES",
				"GUILDS",
				"GUILD_BANS",
				"GUILD_EMOJIS_AND_STICKERS",
				"GUILD_INTEGRATIONS",
				"GUILD_INVITES",
				"GUILD_MEMBERS",
				"GUILD_MESSAGE_REACTIONS",
				"GUILD_MESSAGE_TYPING",
				"GUILD_PRESENCES",
				"GUILD_VOICE_STATES",
				"GUILD_WEBHOOKS"
			]
		});

		this.commandHandler = new CommandHandler(this, {
			directory: path.join(__dirname, "..", "commands"),
			ignoreCooldown: ["132266422679240704"],
			aliasReplacement: /-/g,
			prefix: "!!",
			allowMention: true,
			commandUtil: true,
			commandUtilLifetime: 10000,
			commandUtilSweepInterval: 10000,
			storeMessages: true,
			handleEdits: true,
			argumentDefaults: {
				prompt: {
					start: "What is thing?",
					modifyStart: (msg, text) => `${msg.author}, ${text}\nType \`cancel\` to cancel this command.`,
					retry: "What is thing, again?",
					modifyRetry: (msg, text) => `${msg.author}, ${text}\nType \`cancel\` to cancel this command.`,
					timeout: "Out of time.",
					ended: "No more tries.",
					cancel: "Cancelled.",
					retries: 5
				},
				modifyOtherwise: (msg, text) => `${msg.author}, ${text}`
			}
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: path.join(__dirname, "..", "inhibitors")
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: path.join(__dirname, "..", "listeners")
		});

		this.taskHandler = new TaskHandler(this, {
			directory: path.join(__dirname, "..", "tasks")
		});

		this.contextMenuCommandHandler = new ContextMenuCommandHandler(this, {
			directory: path.join(__dirname, "..", "context-menu-commands")
		});

		this.setup();
	}

	public setup() {
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useTaskHandler(this.taskHandler);
		this.commandHandler.useContextMenuCommandHandler(this.contextMenuCommandHandler);

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
			taskHandler: this.taskHandler,
			contextMenuCommandHandler: this.contextMenuCommandHandler
		});

		this.commandHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
		this.taskHandler.loadAll();
		this.contextMenuCommandHandler.loadAll();

		const resolver = this.commandHandler.resolver;
		resolver.addType("1-10", (_, phrase) => {
			const num = resolver.type("integer")!(_, phrase);
			if (num == null) return null;
			if (num < 1 || num > 10) return null;
			return num;
		});
	}

	public async start(token: string) {
		await this.login(token);
		console.log("Ready!"); // eslint-disable-line no-console
	}
}