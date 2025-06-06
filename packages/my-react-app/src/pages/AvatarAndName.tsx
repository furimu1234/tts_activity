import React from 'react';
import { DiscordAPI, RequestType } from '../DiscordAPI';
import ReactJsonView from '../components/ReactJsonView';
import { discordSdk } from '../discord';
import { authStore } from '../store/authStore';
import { getUserAvatarUrl } from '../utils/getUserAvatarUrl';
import { getUserDisplayName } from '../utils/getUserDisplayName';

interface GuildsMembersRead {
	roles: string[];
	nick: string | null;
	avatar: string | null;
	premium_since: string | null;
	joined_at: string;
	is_pending: boolean;
	pending: boolean;
	communication_disabled_until: string | null;
	user: {
		id: string;
		username: string;
		avatar: string | null;
		discriminator: string;
		public_flags: number;
	};
	mute: boolean;
	deaf: boolean;
}

export default function AvatarAndName() {
	const auth = authStore.getState();
	const [guildMember, setGuildMember] =
		React.useState<GuildsMembersRead | null>(null);

	React.useEffect(() => {
		if (auth == null) {
			return;
		}
		// We store this in the auth object, but fetching it again to keep relevant patterns in one area
		DiscordAPI.request<GuildsMembersRead>(
			{
				method: RequestType.GET,
				endpoint: `/users/@me/guilds/${discordSdk.guildId}/member`,
			},
			auth.access_token,
		).then((reply) => {
			setGuildMember(reply);
		});
	}, [auth]);

	if (!auth) {
		return <></>;
	}

	// Note: instead of doing this here, your app's server could retrieve this
	// data by using the user's OAuth token

	const userAvatarUrl = getUserAvatarUrl({
		guildMember: null,
		user: auth.user,
	});

	// Get the user's guild-specific avatar url
	// If none, fall back to the user profile avatar
	// If no main avatar, use a default avatar
	const guildAvatarUrl = getUserAvatarUrl({
		guildMember,
		user: auth.user,
	});

	// Get the user's guild nickname. If none set, fall back to global_name, or username
	// Note - this name is note guaranteed to be unique
	const name = getUserDisplayName({ guildMember, user: auth.user });

	return (
		<div style={{ padding: 32, overflowX: 'auto' }}>
			<div>
				<h1>User Avatar and Name</h1>
				<div>
					Check out more info on fetching discord-specific CDN assets{' '}
					<a
						href={
							'https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints'
						}
						onClick={(e) => {
							e.preventDefault();
							discordSdk.commands.openExternalLink({
								url: 'https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints',
							});
						}}
					>
						here
					</a>
					.
				</div>
				<br />
				<br />
				<div>
					<p>User avatar, global name, and username</p>
					<img alt="avatar" src={userAvatarUrl} />
					<p>User Avatar url: "{userAvatarUrl}"</p>
					<p>Global Name: "{auth.user.global_name}"</p>
					<p>Unique username: "{auth.user.username}"</p>
				</div>
				<br />
				<br />
				<div>
					<p>Guild-specific user avatar and nickname</p>
					{guildMember == null ? (
						<p>...loading</p>
					) : (
						<>
							<img alt="avatar" src={guildAvatarUrl} />
							<p>Guild Member Avatar url: "{guildAvatarUrl}"</p>
							<p>Guild nickname: "{name}"</p>
						</>
					)}
				</div>
			</div>
			{guildMember == null ? null : (
				<>
					<br />
					<div>
						API response from{' '}
						{`/api/users/@me/guilds/${discordSdk.guildId}/member`}
					</div>
					<ReactJsonView src={guildMember} />
				</>
			)}
		</div>
	);
}
