<script>
  export let value = '', action, type;
</script>

<input bind:value={value} on:change={() => action(value)} class={type}>

<style>
  input, textarea {
    width: 100%;
    display: block;
    border: 1px solid white;
    padding: 0;
  }

  textarea {
    resize: none;
  }

  input::placeholder, textarea::placeholder {
    color: #ccc;
  }
  
  input:hover, textarea:hover {
    border: 1px solid #ccc;
  }

  input.character {
    text-transform: uppercase;
    font-size: 13px;
  }
  
  /* input.character:not(:focus) {
    color: ${stringToColor(value)};
  } */
  
  input.label {
    font-size: 2em;
    margin: 0.8em 0;
  }
</style>
