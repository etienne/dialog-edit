<script>
	import CharacterList from './CharacterList.svelte';
	import DialogList from './DialogList.svelte';
	import DialogSequence from './DialogSequence.svelte';
	import Player from './Player.svelte';
	import { currentPreview } from './stores';
</script>

{#if $currentPreview}
	<main class="player">
		<Player/>
	</main>
{:else}
	<main class="editor">
		<DialogList/>
		<DialogSequence/>
		<CharacterList/>
	</main>
{/if}


<style>
	main.editor {
		display: grid;
		grid-template-columns: 31% auto;
		grid-template-areas: "sidebar content";
		grid-column-gap: 3%;
		max-width: 64em;
	}
</style>