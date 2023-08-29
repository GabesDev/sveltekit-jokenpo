<script lang="ts">
  import User from "$lib/components/User.svelte"
  import { onMount } from "svelte"
  import { users } from "$lib/usersMockup"
  import Chat from "$lib/components/Chat.svelte"

  
  let nusers = users
  let currentUser: User = nusers.find((x) => x.localPlayer)
  
  // Mock
  let generateRandom = () => Math.floor(Math.random() * 3)
  setInterval(() => {
    nusers.map((x) => {
      if (x.localPlayer === false) {
        if (generateRandom() > 1) {
          moveChar(x.id, "up")
        }
        if (generateRandom() < 1) {
          moveChar(x.id, "down")
        }

        if (generateRandom() > 1) {
          moveChar(x.id, "right")
        }
        if (generateRandom() < 1) {
          moveChar(x.id, "left")
        }
      }
      return x
    })
  }, 1000)

  let name: string | null
  const STEP = 4

  onMount(() => {
    //while (!name || !name.trim()) name = prompt("What's your name?")
    currentUser.name = name = 'Tests'
  })

  let moveChar = (id: number, direction: string) => {
    let index = nusers.findIndex((x) => x.id == id)

    if (direction === "up") {
      if (nusers[index].posY >= STEP) {
        nusers[index].posY -= STEP * 2
      }
    }
    if (direction === "down") {
      if (nusers[index].posY <= 100 - STEP * 4) {
        nusers[index].posY += STEP * 2
      }
    }
    if (direction === "left") {
      if (nusers[index].posX >= STEP) {
        nusers[index].posX -= STEP
      }
    }
    if (direction === "right") {
      if (nusers[index].posX <= 100 - STEP * 2) {
        nusers[index].posX += STEP
      }
    }

    nusers[index].facing = direction
    nusers[index].state = "moving"

    nusers = nusers
  }

  let keydown = (e: KeyboardEvent) => {
    if (
      e.code === "ArrowUp" ||
      e.code === "ArrowDown" ||
      e.code === "ArrowLeft" ||
      e.code === "ArrowRight" ||
      e.code === "Space"
    ) {
      if (e.code === "Space") {
        currentUser.char = currentUser.char >= 12 ? 1 : ++currentUser.char
      } else {
        moveChar(
          currentUser.id,
          e.code.replace("Arrow", "").toLocaleLowerCase()
        )
      }
    }
  }
</script>

<svelte:window on:keydown={keydown} />

{#each nusers as user}
  <User {...user} />
{/each}

<Chat />