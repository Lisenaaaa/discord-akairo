import { Message } from "discord.js";
import { Command } from "../../src/index";

export default class EmbedCommand extends Command {
	constructor() {
		super("embed", {
			aliases: ["embed"],
			args: [
				{
					id: "emptyContent",
					match: "flag",
					flag: "-c"
				},
				{
					id: "emptyEmbed",
					match: "flag",
					flag: "-e"
				},
				{
					id: "phrase",
					match: "phrase"
				}
			]
		});
	}

	override exec(message: Message, args: { emptyContent?: boolean; emptyEmbed?: boolean; phrase?: string }) {
		if (args.emptyContent) {
			return message.util!.send({ embeds: [{ description: args.phrase }] });
		}

		if (args.emptyEmbed) {
			return message.util!.send({ content: args.phrase, embeds: [] });
		}

		return message.util!.send({
			content: args.phrase,
			embeds: [{ description: args.phrase }]
		});
	}
}
