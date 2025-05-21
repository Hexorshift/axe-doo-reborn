import IEvent from "../interfaces/IEvent";
import AxeDoo from "../AxeDoo";
import switchVoiceChannel from "src/utils/switchVoiceChannel";
import { ChannelType, Events } from "discord.js";

const voiceStateUpdate: IEvent<typeof Events.VoiceStateUpdate> = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState) {
    const userId = newState.id;
    const guildId = newState.guild.id;

    if (!AxeDoo.trackedUserIds.includes(userId)) return;

    const prevChannel = oldState.channelId;
    const newChannel = newState.channelId;

    // Handle user joining, leaving, or switching voice channels
    if (prevChannel !== newChannel) {
      // User joined or switched to a new voice channel
      if (newChannel) {
        const voiceChannel = newState.channel;

        if (
          !voiceChannel ||
          (voiceChannel.type !== ChannelType.GuildVoice && voiceChannel.type !== ChannelType.GuildStageVoice)
        )
          return;

        if (AxeDoo.activeStates.has(guildId)) {
          const state = AxeDoo.activeStates.get(guildId);

          // Move bot if only tracking one user and user switched channels
          if (state && AxeDoo.trackedUserIds.length === 1 && state.voiceChannelId !== voiceChannel.id) {
            await switchVoiceChannel(guildId, voiceChannel.id, newState.guild);
          }
          return;
        }

        // Bot not connected yet, join the voice channel
        await switchVoiceChannel(guildId, voiceChannel.id, newState.guild);
      }
      // User left voice channel (newChannel is null)
      else {
        const state = AxeDoo.activeStates.get(guildId);
        if (!state) return;

        const channel = oldState.guild.channels.cache.get(state.voiceChannelId);

        if (!channel || (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice))
          return;

        const remainingTrackedUsers = channel.members.filter(
          (member) => AxeDoo.trackedUserIds.includes(member.id) && !member.user.bot
        );

        if (remainingTrackedUsers.size === 0) {
          state.player.stop();
          state.connection.destroy();
          AxeDoo.activeStates.delete(guildId);
        }
      }
    }
  }
};

export default voiceStateUpdate;
