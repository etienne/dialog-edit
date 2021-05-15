import { writable, derived } from 'svelte/store';

function createDialogs() {
	const { subscribe, update } = writable(JSON.parse(localStorage.getItem('dialogs')) || {});

	return {
		subscribe,

    add: () => update(d => {
      const newId = getNewId(Object.keys(d));
      d[newId] = {
        id: newId,
        label: 'untitled dialog',
        lines: [{}],
        newlyCreated: true,
      };
      selectedDialog.set(newId);
      return d;
    }),

    update: newDialog => update(d => {
      return {...d, [newDialog.id]: newDialog };
    }),

    touch: dialogId => update(d => {
      const updatedDialog = d[dialogId];
      if (updatedDialog.newlyCreated) {
        delete updatedDialog.newlyCreated;
      }
      return {...d, [dialogId]: updatedDialog};
    }),

    delete: deleteId => update(d => {
      Object.keys(d).forEach(id => {
        if (d[id].branchTo) {
          const updatedBranchTo = d[id].branchTo.filter(b => b !== deleteId);
          d[id] = {...d[id], branchTo: updatedBranchTo, selectedBranch: 0};
        }
      });
      delete d[deleteId];

      return d;
    }),

    deleteBranch: (dialogId, index) => update(d => {
      const parentBranch = d[dialogId];
      parentBranch.branchTo.splice(index, 1);
      if (parentBranch.branchTo.length === 1) {
        // Only one branch remains after deletion; merge last branch back into parent branch
        const updatedLines = [...parentBranch.lines, ...d[parentBranch.branchTo[0]].lines];
        return {...d, [dialogId]: {...parentBranch, lines: updatedLines, branchTo: null, selectedBranch: null}};
      } else {
        const newSelectedBranch = index - 1 >= 0 ? index - 1 : 0;
        const updatedDialog = {...parentBranch, selectedBranch: newSelectedBranch};
        return {...d, [dialogId]: updatedDialog};
        }
    }),

    updateLine: (dialogId, index, newLine) => update(d => {
      const updatedLines = [...d[dialogId].lines];
      updatedLines[index] = newLine;
      const newDialog = {...d[dialogId], lines: updatedLines};
      return {...d, [dialogId]: newDialog};
    }),

    insertLineAfter: (dialogId, index) => update(d => {
      const updatedLines = [...d[dialogId].lines];
      let character;
      if (index > 0) {
        character = updatedLines[index - 1].character;
      }
      console.log('index=', index, 'character=', character);
      updatedLines.splice(index + 1, 0, {newlyCreated: true, character});
      const newDialog = {...d[dialogId], lines: updatedLines};
      return {...d, [dialogId]: newDialog};
    }),

    branchFrom: (dialogId, index) => update(d => {
      const newId = getNewId(Object.keys(d));
      const newDialog = {id: newId, lines: [{}]};
      const currentBranchIds = d[dialogId].branchTo || [];

      if (index) {
        const linesToKeep = [...d[dialogId].lines].slice(0, index);
        const linesToBranchOff = [...d[dialogId].lines].slice(index);
        const branchedId = getNewId([...Object.keys(d), newId]);
        const newBranchTo = [...currentBranchIds, branchedId, newId];
        const updatedDialog = {...d[dialogId], lines: linesToKeep, branchTo: newBranchTo, selectedBranch: newBranchTo.length - 1};
        const branchedDialog = {id: branchedId, lines: linesToBranchOff};
        return {...d, [dialogId]: updatedDialog, [branchedId]: branchedDialog, [newId]: newDialog};
      } else {
        const newBranchTo = [...currentBranchIds, newId];
        const updatedDialog = {...d[dialogId], branchTo: newBranchTo, selectedBranch: newBranchTo.length - 1};
        return {...d, [dialogId]: updatedDialog, [newId]: newDialog};
      }
    }),

    selectBranch: (dialogId, index) => update(d => {
      const updatedDialog = {...d[dialogId], selectedBranch: index };
      return {...d, [dialogId]: updatedDialog};
    }),

    prependLine: dialogId => update(d => {
      const newLines = [...d[dialogId].lines];
      newLines.unshift({});
      const newDialog = {...d[dialogId], lines: newLines};
      return {...d, [dialogId]: newDialog};
    }),

    deleteLine: (dialogId, index) => update(d => {
      const newLines = [...d[dialogId].lines];
      newLines.splice(index, 1);
      const newDialog = {...d[dialogId], lines: newLines};
      return {...d, [dialogId]: newDialog};
    }),
	};
}

function getNewId(ids) {
  if (ids && Array.isArray(ids) && ids.length) {
    return ids.reduce((maxId, id) => Math.max(id, maxId), -1) + 1;
  }
  return 1;
}

export const dialogs = createDialogs();
dialogs.subscribe(value => localStorage.dialogs = JSON.stringify(value));

export const selectedDialog = writable(localStorage.getItem('selectedDialog') || 1);
selectedDialog.subscribe(value => localStorage.selectedDialog = value);

export const currentPreview = writable();
export const firstCharacterFieldElements = writable({});

export const dialogSequence = derived([dialogs, selectedDialog], ([$dialogs, $selectedDialog]) => {
    let currentDialog = $dialogs[$selectedDialog];
    let dialogSequence = [$selectedDialog];

    while (currentDialog && currentDialog.branchTo && currentDialog.branchTo.length) {
      let selectedBranchIndex = currentDialog.selectedBranch || 0;
      dialogSequence.push(currentDialog.branchTo[selectedBranchIndex]);
      currentDialog = $dialogs[currentDialog.branchTo[selectedBranchIndex]];
    }

    return dialogSequence;
  }
);

export const labelledDialogIds = derived(dialogs, $dialogs => {
  let ids = Object.keys($dialogs);
  return ids.filter(id => 'label' in $dialogs[id]);
});

export const characters = derived(dialogs, $dialogs => {
  let ids = Object.keys($dialogs);
  let characters = [];
  ids.forEach(id => {
    if ($dialogs[id].lines && $dialogs[id].lines.length) {
      $dialogs[id].lines.forEach(line => {
        if (line.character && characters.indexOf(line.character) === -1) {
          characters.push(line.character);
        }
      });
    }
  });
  return characters;
});
