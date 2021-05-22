<script>
	import CharacterList from './CharacterList.svelte';
	import NodeList from './NodeList.svelte';
	import NodeSequence from './NodeSequence.svelte';
	import Player from './Player.svelte';
	import SelectLinkNotification from './SelectLinkNotification.svelte';
	import { currentPreview, selectLinkFromNode } from './stores';
</script>

{#if $currentPreview}
	<main class="player">
		<Player/>
	</main>
{:else}
	{#if $selectLinkFromNode}
		<SelectLinkNotification/>		
	{/if}
	<main class="editor">
		<NodeList/>
		<NodeSequence/>
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