<script lang="ts">
  export let user: User
  export let socket: any

  let localPlayer = socket.id == user.id

  let startBattle = (user: User) => {
    socket.emit("askBattle", user)
  }
</script>

<div
  class="user-container"
  style="left: {user.posX}vw; top: {user.posY}vh; {localPlayer
    ? 'z-index: 2'
    : ''}"
  on:transitionend={() => (user.state = "stopped")}
  on:transitionstart={() => (user.state = "moving")}
>
  <p class:me={localPlayer}>
    {user.name}
  </p>
  <button
    class="user user-{user.char} {user.facing} {user.state}"
    disabled={user.state === "busy"}
    on:click={() => {
      if (user.state === "busy" || localPlayer) return
      startBattle(user)
    }}
  />
</div>

<style lang="scss">
  .user-container {
    position: absolute;
    transition: all 0.2s;
    transition-property: top, left;
    text-align: center;
    max-width: 100px;
    .user {
      border: none;
      background: url(/images/sprites.png);
      width: 32px;
      height: 42px;
      margin: 0 auto;
      cursor: pointer;
      &.busy {
        opacity: 0.75;
        cursor: auto;
        filter: grayscale(1);
      }
    }
    p {
      text-transform: capitalize;
      color: white;
      text-shadow: 0px 0px 3px black;
      word-wrap: break-word;
      &.me {
        color: gold;
      }
    }
    .pop-up {
      background: white;
      padding: 5px;
      position: absolute;
      margin-top: 0;
      border: 2px solid #777;
      border-radius: 3px;
      text-align: center;
      color: black;
      text-shadow: none;
      cursor: pointer;
      &:hover {
        background: #aaa;
      }
    }
  }
  @mixin sprites($initialX, $initialY) {
    $step-y: 48;
    $step-x: 32;
    &.down {
      background-position: #{$initialX}px #{$initialY}px;
      &.moving {
        background-position: #{$initialX - $step-x}px #{$initialY}px;
      }
    }
    &.left {
      background-position: #{$initialX}px #{$initialY - $step-y}px;
      &.moving {
        background-position: #{$initialX - $step-x}px #{$initialY - $step-y}px;
      }
    }
    &.right {
      background-position: #{$initialX}px #{$initialY - ($step-y * 2)}px;
      &.moving {
        background-position: #{$initialX - $step-x}px #{$initialY -
          ($step-y * 2)}px;
      }
    }
    &.up {
      background-position: #{$initialX}px #{$initialY - ($step-y * 3)}px;
      &.moving {
        background-position: #{$initialX - $step-x}px #{$initialY -
          ($step-y * 3)}px;
      }
    }
  }

  $z: 0;
  @for $i from 0 through 3 {
    @for $j from 0 through 2 {
      $x: -1 * $i * 194 - 4;
      $y: -1 * $j * 240 - 110;
      $z: $z + 1;
      .user-#{$z} {
        @include sprites($y, $x);
      }
    }
  }
</style>
