export let users: any[] = [
  {
  char: 1,
  posX: 0,
  posY: 0,
  name: "BOT",
  id: 0,
  state: "moving",
  facing: "down",
  localPlayer: true,
},
{
  char: Math.floor(1 + Math.random() * 10),
  posX: 20,
  posY: 24,
  name: "bot 1",
  id: 1,
  state: "stopped",
  facing: "down",
  localPlayer: false
},
{
  char: Math.floor(1 + Math.random() * 10),
  posX: 40,
  posY: 24,
  name: "bot 2",
  id: 2,
  state: "stopped",
  facing: "down",
  localPlayer: false
},
{
  char: Math.floor(1 + Math.random() * 10),
  posX: 60,
  posY: 24,
  name: "bot 3",
  id: 3,
  state: "stopped",
  facing: "down",
  localPlayer: false
},
{
  char: Math.floor(1 + Math.random() * 10),
  posX: 80,
  posY: 24,
  name: "bot 4",
  id: 4,
  state: "stopped",
  facing: "down",
  localPlayer: false
}
]
