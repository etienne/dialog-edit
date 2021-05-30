import { writable } from 'svelte/store';

export const currentPreview = writable();
export const playerHistory = writable([]);
