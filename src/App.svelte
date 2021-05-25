<script>
	import CharacterList from './CharacterList.svelte';
	import ChapterList from './ChapterList.svelte';
	import Chapter from './Chapter.svelte';
	import EditorMenu from './EditorMenu.svelte';
	import Player from './Player.svelte';
	import PlayerMenu from './PlayerMenu.svelte';
	import SelectLinkNotification from './SelectLinkNotification.svelte';
	import { currentPreview, selectLinkFromNode, selectedChapter } from './stores';
</script>

{#if $currentPreview}
	<PlayerMenu/>
	<main class="player">
		<Player/>
	</main>
{:else}
	{#if $selectLinkFromNode}
		<SelectLinkNotification/>		
	{/if}
	<EditorMenu/>
	<main class="editor">
		<ChapterList/>
		{#if $selectedChapter}
			<Chapter chapter={$selectedChapter}/>
		{/if}
		<CharacterList/>
	</main>
{/if}

<style>
	main {
		padding: 1em;
	}

	main.editor {
		display: grid;
		grid-template-columns: 31% auto;
		grid-template-areas: "sidebar content";
		grid-column-gap: 3%;
		max-width: 64em;
	}
</style>