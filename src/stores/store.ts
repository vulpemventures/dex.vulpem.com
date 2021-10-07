import { writable } from 'svelte/store';

const storeName = "dexStore";


export interface MarinaStore {
  installed: boolean;
  enabled: boolean;
}



export const marinaStore = writable<MarinaStore>({installed: false, enabled: false});


/* 
interface State {
  swap: any;
}

export const store = writable<State>(JSON.parse(localStorage.getItem(storeName)) || {});
// Anytime the store changes, update the local storage value
store.subscribe((store: State) => {
  localStorage[storeName] = store;
});
 */


