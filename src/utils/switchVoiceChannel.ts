import AxeDoo from "../AxeDoo";
import { ChannelType, Guild } from "discord.js";
import { joinVoiceChannel, createAudioPlayer } from "@discordjs/voice";

export default async function switchVoiceChannel(guildId: string, newChannelId: string, guild: Guild) {
  const existingState = AxeDoo.activeStates.get(guildId);

  if (existingState) {
    existingState.player.stop();
    existingState.connection.destroy();
    AxeDoo.activeStates.delete(guildId);
  }

  const voiceChannel = guild.channels.cache.get(newChannelId);
  if (
    !voiceChannel ||
    (voiceChannel.type !== ChannelType.GuildVoice && voiceChannel.type !== ChannelType.GuildStageVoice)
  ) {
    return;
  }

  const connection = joinVoiceChannel({
    channelId: newChannelId,
    guildId: guildId,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false
  });

  const player = createAudioPlayer();
  connection.subscribe(player);

  AxeDoo.activeStates.set(guildId, {
    connection,
    player,
    voiceChannelId: voiceChannel.id,
    queue: [],
    isPlaying: false
  });
}
