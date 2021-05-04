<script>
	import DialogList from './DialogList.svelte';
	import DialogSequence from './DialogSequence.svelte';
</script>

<main>
	<DialogList/>
	<DialogSequence/>
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 31% auto;
		grid-template-areas: "sidebar content";
		grid-column-gap: 3%;
		max-width: 64em;
	}
</style>