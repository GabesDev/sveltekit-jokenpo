<script lang="ts">
  import { onMount } from "svelte"
  import { io } from "socket.io-client"

  import User from "$lib/components/User.svelte"
  import Chat from "$lib/components/Chat.svelte"
  import Battle from "$lib/components/Battle.svelte"

  const socket = io()
  let users: User[] = []

  let name: string | null
  let currentUser: User

  let showBattle = false

  onMount(() => {
    name = prompt("What's your name?")
    if (!name || !name.trim()) location.reload()

    socket.emit("join", name, ({ user, error }) => {
      if (error) {
        alert("Name taken. Please, choose another.")
        location.reload()
      }
      if (user) {
        currentUser = user
        showBattle = true
      }
    })
  })

  socket.on("renderAll", (usersData) => {
    users = usersData.users
  })

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
        currentUser = moveChar(
          currentUser,
          e.code.replace("Arrow", "").toLocaleLowerCase()
        )
      }
      socket.emit("updatePosition", currentUser)
    }
  }

  let moveChar = (user: User, direction: string) => {
    const STEP = 4
    if (direction === "up") {
      if (user.posY >= STEP) {
        user.posY -= STEP * 2
      }
    }
    if (direction === "down") {
      if (user.posY <= 100 - STEP * 4) {
        user.posY += STEP * 2
      }
    }
    if (direction === "left") {
      if (user.posX >= STEP) {
        user.posX -= STEP
      }
    }
    if (direction === "right") {
      if (user.posX <= 100 - STEP * 2) {
        user.posX += STEP
      }
    }

    user.facing = direction
    return user
  }
</script>

<svelte:window on:keydown={keydown} />
<main>
  {#each users as user}
    <User {user} {socket} />
  {/each}
</main>
<Chat {socket} />
{currentUser?.state}
{#if showBattle}
  <Battle {currentUser} {socket} />
{/if}
