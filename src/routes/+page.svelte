<script lang="ts">
  import { onMount } from "svelte"
  import { swipe } from "svelte-gestures"

  import { io } from "socket.io-client"

  import Button from "$lib/components/Button.svelte"
  import User from "$lib/components/User.svelte"
  import Chat from "$lib/components/Chat.svelte"
  import Battle from "$lib/components/Battle.svelte"

  const socket = io()
  let users: User[] = []

  let name: string | null
  let currentUser: User

  let showBattle = false
  let innerWidth: number | null

  onMount(() => {
    name = prompt("What's your name?")
    if (!name || !name.trim()) name = "Anon " + Math.floor(Math.random() * 50)

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

  let keydown = (e: KeyboardEvent | any) => {
    if (currentUser.state == "busy") return

    let direction = e.detail?.direction
    if (direction) {
      if (direction == "top") direction = "ArrowUp"
      if (direction == "bottom") direction = "ArrowDown"
      if (direction == "left") direction = "ArrowLeft"
      if (direction == "right") direction = "ArrowRight"
      if (!e.code) e.code = direction
    }

    if (
      e.code === "ArrowUp" ||
      e.code === "ArrowDown" ||
      e.code === "ArrowLeft" ||
      e.code === "ArrowRight" ||
      e.code === "Space"
    ) {
      let STEP = 4

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
        if(innerWidth < 1000) STEP *= 4
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

<svelte:window on:keydown={keydown} bind:innerWidth />

<div
  class="container"
  use:swipe={{ timeframe: 300, minSwipeDistance: 100 }}
  on:swipe={keydown}
>
  <Button />

  {#if showBattle}
    <Battle {currentUser} {socket} />
  {/if}

  <main>
    {#each users as user (user.id)}
      <User {user} {socket} />
    {/each}
  </main>
  {#if innerWidth > 1000}
    <!-- content here -->
    <Chat {socket} />
  {/if}
</div>

<style>
  .container {
    z-index: 99;
    position: absolute;
    width: 100vw;
    height: 100vh;
  }
</style>
