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
    name = Math.random().toString()
    if (!name || !name.trim()) location.reload()

    socket.emit(
      "join",
      name,
      ({ user, error }: { user: User; error: Error }) => {
        if (error) {
          alert("Name taken. Please, choose another one.")
          location.reload()
        }
        if (user) {
          currentUser = user
          showBattle = true
        }
      }
    )
  })

  socket.on("renderAll", (usersData) => {
    users = usersData.users
  })

  let keydown = (e: KeyboardEvent) => {
    if (currentUser.state == "busy") return
    if (
      e.code === "ArrowUp" ||
      e.code === "ArrowDown" ||
      e.code === "ArrowLeft" ||
      e.code === "ArrowRight" ||
      e.code === "Space"
    ) {
      const STEP = 4

      if (e.code === "Space") {
        currentUser.char = currentUser.char >= 12 ? 1 : ++currentUser.char
      } else {
        let direction = e.code.replace("Arrow", "").toLocaleLowerCase()
        if (direction === "up" && currentUser.posY >= STEP) {
          currentUser.posY -= STEP * 2
        }
        if (direction === "down" && currentUser.posY <= 100 - STEP * 4) {
          currentUser.posY += STEP * 2
        }
        if (direction === "left" && currentUser.posX >= STEP) {
          currentUser.posX -= STEP
        }
        if (direction === "right" && currentUser.posX <= 100 - STEP * 2) {
          currentUser.posX += STEP
        }
        currentUser.facing = direction
      }
      socket.emit("updatePosition", currentUser)
    }
  }
</script>

<svelte:window on:keydown={keydown} />

{#if showBattle}
  <Battle {currentUser} {socket} />
{/if}

<main>
  {#each users as user (user.id)}
    <User {user} {socket} />
  {/each}
</main>

<Chat {socket} />
