import { createAudioPlayer } from "@discordjs/voice"

class Session {
  static timeout = 180000

  constructor({ player = createAudioPlayer(), connection }) {
    this.queue = []
    this.playingIndex = 0

    this.player = player
    this.connection = connection
    
    this.timeout = null

    connection.subscribe(player)

    player.on('stateChange', (old, current) => {
      if(old.status !== 'playing') return
      if(current.status !== 'idle') return

      this.playingIndex += 1

      const { playingIndex, queue } = this

      if(!queue[playingIndex]) {
        this.timeout = setTimeout(() => connection.destroy(), Session.timeout)
        return
      }

      player.play(queue[playingIndex].resource)
    })
  }

  play(link) {
    const { queue, playingIndex, player, timeout } =  this

    if(timeout) {
      clearTimeout(timeout)
      this.timeout = null
    }

    const resource = link

    queue.push({ resource })

    // Handle the case where the player is idle
    if(queue.length - 1 === playingIndex) {
      player.play(resource)
      return {
        message: `Playing ...`
      }
    }

    return {
      message: `Added ... to queue`
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

// function getId(name) {
//   return `${name}-${Date.now()}`
// }
