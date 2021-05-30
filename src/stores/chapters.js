import { writable, derived } from 'svelte/store';
import { getNewId } from './helpers';

function createChapters() {
  const { subscribe, update, set } = writable(JSON.parse(localStorage.getItem('chapters')) || []);

  return {
    subscribe,
    set,

    add: (firstNode) => update(c => {
      const ids = c.map(chapter => chapter.id);
      const newId = getNewId(ids);
      c.push({
        id: newId,
        name: '',
        newlyCreated: true,
        firstNode,
      });
      selectedChapterId.set(newId);
      return c;
    }),

    update: (updatedChapter) => update(c => {
      c = c.map(chapter => chapter.id == updatedChapter.id ? updatedChapter : chapter)
      return c;
    }),

    touch: chapterId => update(c => {
      c = c.map(chapter => chapter.id == chapterId ? {...chapter, newlyCreated: false} : chapter);
      return c;
    }),

    delete: deleteId => update(c => {
      const ids = c.map(chapter => chapter.id);
      const index = ids.indexOf(deleteId);
      if (index >= 0) {
        c.splice(index, 1);
        if (c.length) {
          if (index == 0) {
            selectedChapterId.set(c[0].id);
          } else {
            selectedChapterId.set(c[index - 1].id);
          }
        } else {
          selectedChapterId.set(null);
        }
        return c;
      } else {
        console.error('Could not delete chapter id', deleteId, '; found index', index);
      }
    }),
  }
}

export const chapters = createChapters();
chapters.subscribe(value => localStorage.chapters = JSON.stringify(value));

export const selectedChapterId = writable(localStorage.getItem('selectedChapterId'));
selectedChapterId.subscribe(value => localStorage.selectedChapterId = value);

export const selectedChapter = derived([chapters, selectedChapterId], ([$chapters, $selectedChapterId]) => {
  return $chapters.filter(c => c.id == Number($selectedChapterId))[0];
});
