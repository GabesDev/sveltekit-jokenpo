<script lang="ts">
  import { fly, slide } from "svelte/transition"

  export let currentUser: User
  export let socket: any

  let state: BattleState = "neutral"
  let result: Result

  let enemy: User | null
  let isAnimating: boolean = true

  let enemyChoice: Choices = ""
  let myChoice: Choices = ""

  let clearStatus = () => {
    state = "neutral"
    isAnimating = true
    enemyChoice = ""
    myChoice = ""
    enemy = null
    result = ""
  }

  let endGame = (final: Result) => {
    result = final

    setTimeout(() => {
      state = "ended"
      setTimeout(() => {
        socket.emit("battleEnded", enemy)
        clearStatus()
      }, 3000)
    }, 3000)
  }

  $: {
    if (myChoice && enemyChoice) {
      if (myChoice === enemyChoice) {
        endGame("tie")
      } else if (
        (myChoice === "rock" && enemyChoice === "paper") ||
        (myChoice === "paper" && enemyChoice === "scissors") ||
        (myChoice === "scissors" && enemyChoice === "rock")
      ) {
        endGame("lost")
      } else {
        endGame("won")
      }
    }
  }

  socket.on("challenged", (challenger: User) => {
    enemy = challenger
    state = "answering"
  })

  socket.on("waiting", () => {
    state = "asking"
  })

  let answerBattle = (answer: boolean) => {
    socket.emit("answerBattle", { enemy, answer })
  }

  socket.on("openModal", (newEnemy: User) => {
    clearStatus()
    enemy = { ...newEnemy }
    state = "playing"
  })

  socket.on("battleDenied", () => {
    clearStatus()
  })

  socket.on(
    "option",
    ({ sender, choice }: { sender: User; choice: Choices }) => {
      enemyChoice = choice
    }
  )

  let makeChoice = (choice: Choices) => {
    myChoice = choice
    isAnimating = false

    socket.emit("choiceMade", { choice, enemy })
  }
</script>

{#if state == "asking"}
  <div transition:slide class="ask-modal">
    <h1>...</h1>
  </div>
{/if}

{#if state == "answering"}
  <div transition:slide class="ask-modal">
    <h1>{enemy?.name} challenged you!</h1>
    <button class="accept" on:click={() => answerBattle(true)}>Accept</button>
    <button class="deny" on:click={() => answerBattle(false)}>Deny</button>
  </div>
{/if}

{#if state == "playing"}
  <div class="container">
    <div in:fly={{ x: 1000, y: 0, duration: 1500 }} class="background">
      <img
        in:fly={{ x: -2000, duration: 1500 }}
        src="../images/battle.jpg"
        alt="Background"
      />
    </div>
    <div
      in:fly={{ x: -500, duration: 1000, delay: 1000 }}
      class="full-user user-{currentUser?.char} left"
    />
    <div class="options" in:slide={{ delay: 2000 }}>
      <button
        class="option rock {myChoice == 'rock' ? '' : 'transparent'}"
        class:animated={isAnimating}
        disabled={!isAnimating}
        on:click={() => makeChoice("rock")}
      />
      <button
        class="option paper {myChoice == 'paper' ? '' : 'transparent'}"
        class:animated={isAnimating}
        disabled={!isAnimating}
        on:click={() => makeChoice("paper")}
      />
      <button
        class="option scissors {myChoice == 'scissors' ? '' : 'transparent'}"
        class:animated={isAnimating}
        disabled={!isAnimating}
        on:click={() => makeChoice("scissors")}
      />
    </div>
    <div
      in:fly={{ x: 500, duration: 1000, delay: 1000 }}
      class="full-user user-{enemy?.char} right"
    />
    <div class="result {result}">
      <option class="option me {myChoice}" />
      <option class="option enemy {enemyChoice}" />
    </div>
  </div>
{/if}

{#if state == "ended"}
  <div transition:slide class="ask-modal">
    <h1>{result === "tie" ? "Tied!" : `You ${result}!`}</h1>
  </div>
{/if}

<style lang="scss">
  .container {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    overflow-x: hidden;
    position: absolute;
    z-index: 5;
  }
  .background {
    height: 300px;
    border-top: 3px solid white;
    border-bottom: 3px solid white;
    z-index: 5;
    width: 100%;

    @media screen and (max-width: 750px) {
      height: 200px;
    }

    img {
      width: 100%;
      object-fit: cover;
      object-position: bottom;
      max-height: 100%;
    }
  }
  .full-user {
    width: 100px;
    height: 160px;
    background: url(/images/sprites.png);
    position: absolute;
    z-index: 5;
    transition: all 1s;

    transform: scale(4);
    &.left {
      left: 20%;
    }
    &.right {
      right: 20%;
    }

    @media screen and (max-width: 750px) {
      transform: scale(1.2);
      &.left {
        left: 0;
      }
      &.right {
        right: 0;
      }
    }

    &.user-1 {
      background-position: -10px -25px;
    }
    &.user-2 {
      background-position: -250px -35px;
    }
    &.user-3 {
      background-position: -485px -30px;
    }
    &.user-4 {
      background-position: -10px -220px;
    }
    &.user-5 {
      background-position: -250px -220px;
    }
    &.user-6 {
      background-position: -485px -215px;
    }
    &.user-7 {
      background-position: -10px -410px;
    }
    &.user-8 {
      background-position: -250px -410px;
    }
    &.user-9 {
      background-position: -485px -410px;
    }
    &.user-10 {
      background-position: -10px -600px;
    }
    &.user-11 {
      background-position: -250px -600px;
    }
    &.user-12 {
      background-position: -485px -600px;
    }
  }
  .ask-modal {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% - 150px);
    width: 50%;
    min-width: 450px;
    height: 300px;
    background: white;
    margin: 0 auto;
    border: 2px solid black;
    border-radius: 4px;
    z-index: 6;
    button {
      width: 50%;
      font-size: 3rem;
      cursor: pointer;
      &.accept {
        background-color: rgba(0, 255, 0, 0.5);
      }
      &.deny {
        background-color: rgba(255, 0, 0, 0.5);
      }
    }
  }
  .options {
    position: absolute;
    z-index: 5;
    background: white;
    width: 200px;
    display: flex;
    align-items: center;
    flex-flow: column;
    border-radius: 100px;

    @media screen and (max-width: 750px) {
      transform: scale(0.8);
    }
  }
  .option {
    background: url(/images/jkp.png);
    width: 120px;
    height: 160px;
    transform: rotate(90deg);
    cursor: pointer;
    border: none;

    &.paper {
      background-position: -126px -460px;
    }
    &.scissors {
      background-position: -250px -460px;
    }
    &.rock {
      background-position: -380px -480px;
    }
  }
  .transparent {
    opacity: 0.5;
  }

  .animated {
    animation: 1.5s wiggle infinite;
    opacity: 1;
  }

  .result {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;

    .option {
      position: absolute;
      z-index: 5;
      transition: left 2s cubic-bezier(0.16, 0.59, 0.75, -0.06),
        right 2s cubic-bezier(0.16, 0.59, 0.75, -0.06);
      &.me {
        left: -480px;
        transform: scale(3) rotate(90deg);
      }
      &.enemy {
        right: -480px;
        transform: scale(3) rotate(270deg);
      }
    }

    &.won {
      .option {
        &.me {
          transform: scale(3.5) rotate(90deg);
          left: 79%;
          z-index: 6;
        }
        &.enemy {
          transition: right 1.5s cubic-bezier(0.24, 0.64, 0.49, 1);
          transform: scale(2.5) rotate(270deg);
          right: 15%;
        }
      }
    }

    &.lost {
      .option {
        &.me {
          transition: left 1.5s cubic-bezier(0.24, 0.64, 0.49, 1);
          transform: scale(2.5) rotate(90deg);
          left: 15%;
        }
        &.enemy {
          transform: scale(3.5) rotate(270deg);
          right: 79%;
          z-index: 6;
        }
      }
    }
    &.tie {
      .option {
        &.me {
          transform: scale(3) rotate(90deg);
          left: calc(50% - 300px);
        }
        &.enemy {
          transform: scale(3) rotate(270deg);
          right: calc(50% - 300px);
        }
      }
    }

    @media screen and (max-width: 750px) {
      &.won,
      &.tie,
      &.lost {
        .option {
          &.me {
            transform: scale(1) rotate(90deg);
            left: calc(50% - 100px);
          }
          &.enemy {
            transform: scale(1) rotate(270deg);
            right: calc(50% - 100px);
          }
        }
      }
    }
  }

  @keyframes wiggle {
    10%,
    90% {
      transform: rotate(90deg);
    }
    20%,
    80% {
      transform: rotate(92deg);
    }
    30%,
    50%,
    70% {
      transform: rotate(82deg);
    }
    40%,
    60% {
      transform: rotate(92deg);
    }
  }
</style>
