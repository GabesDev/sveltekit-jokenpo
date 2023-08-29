// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		type User = {
			id: number
			name: string
			char: number
			posX: number
			posY: number
			facing: Facing
			state: State
			localPlayer: boolean
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export { }
