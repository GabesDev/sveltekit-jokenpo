# Svelte Jokenpo 🤜 💥 🫲

![image](https://github.com/GabesDev/sveltekit-jokenpo/assets/33043706/80791ce3-9179-4a9e-8cda-59158a3d6a42)

[![Button Icon]][Link] 

Rock, Paper, and Scissors online multiplayer minigame project to put into practice some SvelteKit and socket.io knowledge 😁

>⬆️➡️⬇️⬅️ - Move
>
><kbd> <br> SPACE <br> </kbd> - Change char
>
>🖱️ - Challenge players
>
>🎙️ - Record messages
>
><kbd> <br> ESC <br> </kbd> - Close modals


You can open two tabs to see it in action if nobody is there.
Use **arrow keys** to walk, press **space** to change char and **esc** to close modals.

The chat/recording system uses [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API). 

Works better on Chrome (to see the API in action using Firefox, you have to change some flags under about:config) 😑

It is possible to give some commands using that API, but I did not go too deep in that. You can test it by saying "alerta".

> 
[/blob/master/src/lib/components/Chat.svelte #46](../main/src/lib/components/Chat.svelte#L46)
```javascript
  let isCommand = (text: string) => {
    if (text === "alerta") {
      alert("Exemplo de comando")
      return true
    }
    return false
  }
```

Deploy:

[![FE Icon]][FE Link] 

[![BE Icon]][BE Link] 

[Button Icon]: https://img.shields.io/badge/ACESSAR-jokenpo.gabes.dev-blue
[Link]: https://jokenpo.gabes.dev/ 'Jokenpo (Rock, Paper, Scissors)'

[FE Icon]: https://img.shields.io/badge/Front_end-NETLIFY-red
[FE Link]: https://www.netlify.com 'Netlify'

[BE Icon]: https://img.shields.io/badge/Back_end-FLY.IO-green
[BE Link]: https://fly.io/ 'Fly.io'
