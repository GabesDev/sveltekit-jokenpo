// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type User = {
		id: string
		name: string
		char: number
		posX: number
		posY: number
		facing: Facing
		state: State
	}
	type BattleState = "neutral" | "asking" | "answering" | "playing" | "ended"
	type Result = "won" | "lost" | "tie" | ""
	type Choices = "rock" | "paper" | "scissors" | ""
	type ChatState = "recording" | "normal"
	type Facing = "left" | "right" | "up" | "down"
	type State = "busy" | "stopped" | "moving"

	type Messages = {
		uid: string | null,
		user: string,
		text: string
	}

	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}

}

export { }
