<script>
	import ChapterList from './ChapterList.svelte';
	import Chapter from './Chapter.svelte';
	import DetachedNodes from './DetachedNodes.svelte';
	import EditorMenu from './EditorMenu.svelte';
	import Player from './Player.svelte';
	import PlayerMenu from './PlayerMenu.svelte';
	import SelectLinkNotification from './SelectLinkNotification.svelte';
	import { playerHistory } from './stores/player';
	import { selectLinkFromNode } from './stores/nodes';
	import { selectedChapter, showDetachedNodes } from './stores/chapters';
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
		<aside>
			<ChapterList/>
		</aside>
		{#if $selectedChapter}
			<Chapter chapter={$selectedChapter}/>
		{:else if $showDetachedNodes}
			<DetachedNodes/>			
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