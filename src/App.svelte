<script>
	import ChapterList from './ChapterList.svelte';
	import Chapter from './Chapter.svelte';
	import EditorMenu from './EditorMenu.svelte';
	import Player from './Player.svelte';
	import PlayerMenu from './PlayerMenu.svelte';
	import SelectLinkNotification from './SelectLinkNotification.svelte';
	import { playerHistory } from './stores/player';
	import { selectLinkFromNode } from './stores/nodes';
	import { selectedChapter } from './stores/chapters';
</script>

{#if $playerHistory.length}
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