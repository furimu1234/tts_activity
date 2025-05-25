import type { memberInfo } from '@tts/db';
import type { GuildMember } from 'discord.js';

export function memberArrayTomemberInfo(members: GuildMember[]): memberInfo {
	return Object.fromEntries(
		members.map((member) => [
			member.id,
			{
				memberDisplayName: member.displayName,
				memberAvatarUrl: member.displayAvatarURL(),
			},
		]),
	);
}
