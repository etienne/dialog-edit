<script>
  import { characters } from './stores';
</script>

<datalist id="characters">
  {#each $characters as character}
    <option value={character}/>
  {/each}
</datalist>
