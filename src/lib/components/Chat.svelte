<script lang="ts">
  import { afterUpdate, onMount } from "svelte"
  export let socket

  type ChatState = "recording" | "normal"
  let state: ChatState = "normal"

  let messages: { user: string; text: string }[] = []
  let messagesContainer: HTMLElement

  let SpeechRecognition: any
  let SpeechGrammarList: any
  let grammar
  let recognition: any
  let speechRecognitionList

  let initRecordingObjects = () => {
    SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    grammar = "#JSGF V1.0;"

    recognition = new SpeechRecognition()
    speechRecognitionList = new SpeechGrammarList()
    speechRecognitionList.addFromString(grammar, 1)

    recognition.grammars = speechRecognitionList
    recognition.lang = "pt-BR"
    recognition.interimResults = false
    recognition.continuos = true
  }

  let recordEventBinding = () => {
    recognition.onspeechend = () => stopRecording()

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let last = e.results.length - 1
      let command = e.results[last][0].transcript

      let text = command.toLowerCase()
      if (!isCommand(text)) socket.emit("newMessage", { text })
    }

    recognition.onerror = (e: SpeechRecognitionErrorEvent) =>
      console.log("Não reconheceu: " + e.error)
  }

  let isCommand = (text: string) => {
    if (text === "alerta") {
      alert("Exemplo de comando")
      return true
    }
    return false
  }

  onMount(() => {
    initRecordingObjects()
    recordEventBinding()
  })

  afterUpdate(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  })

  let stopRecording = () => {
    recognition.stop()
    state = "normal"
  }

  let recordToggle = () => {
    if (state === "recording") {
      stopRecording()
    } else {
      recognition.start()
      state = "recording"
    }
  }

  socket.on("renderMessages", (allMessages) => {
    messages = [...allMessages.messages]
  })
</script>

<div class="container">
  <button class="record-container {state}" on:click={recordToggle}>
    Click to record
    <div class="record-button" />
  </button>
  <div class="messages" bind:this={messagesContainer}>
    {#each messages as message}
      <p>
        <span class="user {message.uid === socket.id ? 'me' : ''}">
          {message.user}:
        </span>
        {message.text}
      </p>
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 400px;
    width: 400px;
    padding: 0;
    background: rgba(0, 0, 0, 0.5);
    border-top: 2px solid white;
    color: white;
    z-index: 3;
  }

  .messages {
    height: 360px;
    overflow-y: auto;
    p {
      margin: 5px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
    }
    .user {
      color: lightblue;
      text-transform: capitalize;
    }
    .me {
      color: gold;
    }
  }

  .record-container {
    width: 100%;
    background: white;
    height: 35px;
    padding: 0 20px;
    cursor: pointer;
    color: black;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.recording {
      background: rgb(218, 73, 73);
      .record-button {
        animation: recording 1.5s infinite;
      }
    }
  }

  .record-button {
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: red;
    border: 2px solid white;
    box-shadow: 0px 0px 0px 2px red;
  }

  @keyframes recording {
    0% {
      background: red;
    }
    50% {
      background: white;
    }
    100% {
      background: red;
    }
  }
</style>
