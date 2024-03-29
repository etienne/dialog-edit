<script>
  import Button from './Button.svelte';
  import Menu from './Menu.svelte';
  import { chapters, selectedChapter, selectedChapterId } from './stores/chapters';
  import { playerHistory } from './stores/player';
  import { nodes, nextNodeId } from './stores/nodes';
  let firstNode;

  $: if ($selectedChapter && $selectedChapter.firstNode) {
    firstNode = $selectedChapter.firstNode;
  } else {
    firstNode = null;
  }

  function addChapter() {
    const firstNodeId = $nextNodeId;
    nodes.add();
    chapters.add(firstNodeId);
  }

  function deleteChapter() {
    chapters.delete($selectedChapter.id);
  }

  function play() {
    playerHistory.append(firstNode, 0);
  }

  function importData() {
    const element = document.createElement("input");
    element.type = 'file';
    element.click();
    element.addEventListener('change', () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const json = JSON.parse(content);
        if (json.chapters && json.nodes) {
          $chapters = json.chapters;
          $nodes = json.nodes;
          $selectedChapterId = json.chapters[0].id;
        }
      };
      reader.readAsText(element.files[0]);
    });
  }

  function exportData() {
    const data = {
      chapters: $chapters,
      nodes: $nodes,
    };
    const element = document.createElement("a");
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const date = new Date();
    const [year, month, day, hours, minutes] = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ];
    element.download = `Dialog ${year}-${month}-${day} ${hours}:${minutes}.json`;
    element.href = window.URL.createObjectURL(blob);
    element.click();
  }

  function copyData() {
    const data = {
      chapters: $chapters,
      nodes: $nodes,
    };

    const text = JSON.stringify(data);
    navigator.clipboard.writeText(text).then(function() {
      console.log('JSON copied to clipboard');
    }, function(err) {
      console.error('Failed to copy to clipboard: ', err);
    });
  }
</script>

<Menu>
  <ul>
    <li class:marginRight={!$chapters.length}><Button action={addChapter} label="New Chapter" large icon="plus"/></li>
    {#if $chapters.length}
      <li class="marginRight"><Button action={deleteChapter} label="Delete Chapter" large icon="trash"/></li>
    {/if}
    <li class="import"><Button action={importData} label="Import" large icon="import"/></li>
    {#if $chapters.length}
      <li><Button action={exportData} label="Export" large icon="export"/></li>
      <li><Button action={copyData} label="Copy JSON" large icon="copy"/></li>
    {/if}
    {#if firstNode}
      <li class="play"><Button action={play} label="Play" large icon="play"/></li>
    {/if}
  </ul>
</Menu>

<style>
  ul {
    display: flex;
  }

  ul li {
    margin-right: 0.5rem;
  }

  li.marginRight {
    margin-right: auto;
  }
</style>
