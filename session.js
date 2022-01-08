import { createAudioPlayer, createAudioResource, StreamType } from "@discordjs/voice"
import ytdl from 'ytdl-core'

class Session {
  static timeout = 2 * 60 * 1000

  constructor({ guild, player = createAudioPlayer(), connection }) {
    this.stale = false

    this.queue = []
    this.playingIndex = 0

    this.player = player
    this.connection = connection

    this.timeout = null

    this.guild = guild

    connection.subscribe(player)

    player.on('stateChange', (old, current) => {
      console.log('Player status', current.status);
      if(old.status !== 'playing') return
      if(current.status !== 'idle') return

      const { playingIndex, queue } = this

      if(!queue[playingIndex + 1]) {
        this.timeout = setTimeout(() => {
          console.log(`Guild '${this.guild}' session exceeded timeout. Disconnecting...`);
          connection.destroy()
          this.stale = true
        }, Session.timeout)
        return
      }

      this.playingIndex += 1
      player.play(queue[this.playingIndex].resource)
    })
  }

  async play(link) {
    if(!link) return

    const { queue, playingIndex, player, timeout } =  this

    if(timeout) {
      clearTimeout(timeout)
      this.timeout = null
    }

    const { resource, title } = await createSongFromLink(link)

    if(!resource) return { message: 'Failed to add song to queue :(' }

    queue.push({ resource })

    // Handle the case where the player is idle
    if(queue.length - 1 === playingIndex) {
      console.log('Playing');
      player.play(resource)
      return {
        message: `Playing ${title}`
      }
    }

    return {
      message: `Added ${title} to queue`
    }
  }

  stop() {
    this.player.stop()

    this.queue = []
    this.playingIndex = 0

    return {
      message: 'Stopping this session\'s queue'
    }
  }

  next() {
    this.player.stop()
    return {
      message: 'Playing next item in queue'
    }
  }
}

export default Session

function createSongFromLink(link) {
  console.log(`Fetching stream for '${link}'`);

  const stream = ytdl(link, {
    filter: "audioonly",
    highWaterMark: 1 << 25,
  })

  return ytdl.getInfo(link)
    .then(res => res.videoDetails.title)
    .then(title => ({
      title,
      resource: createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
      })
    }))
}
