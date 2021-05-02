<script>
	import DialogList from './DialogList.svelte';
	import Dialog from './Dialog.svelte';
</script>

<main>
	<DialogList/>
	<Dialog/>
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