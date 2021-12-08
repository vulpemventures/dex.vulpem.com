import type { Outpoint } from "ldk";
import { detectProvider, EventListenerID, MarinaProvider, Utxo } from "marina-provider";
import { readable, Updater } from "svelte/store";

export interface UtxoStore {
  unspents: Utxo[];
}

const initialState: UtxoStore = {
  unspents: [],
}

const addUtxo = (utxo: Utxo): Updater<UtxoStore> => (s: UtxoStore) => ({
  ...s,
  unspents: [...s.unspents, utxo],
})

const removeUtxo = (outpoint: Outpoint): Updater<UtxoStore> => (s: UtxoStore) => ({
  ...s,
  unspents: s.unspents.filter(u => u.txid !== outpoint.txid || u.vout !== outpoint.vout),
})

export const utxoStore = readable<UtxoStore>(initialState, function (set) {
  const listeners: EventListenerID[] = [];
  let state = initialState;

  // trick to update the store using updaters + set
  const updateState = (updater: Updater<UtxoStore>) => {
    console.log('updating state')
    const newState = updater(state);
    state = newState;
    set(state);
  }

  detectProvider('marina')
    .then((marina: MarinaProvider) => {
      const newUtxoListID = marina.on('NEW_UTXO', (u: Utxo) => updateState(addUtxo(u)));
      const spentUtxoListID = marina.on('SPENT_UTXO', (outpoint: Outpoint) => updateState(removeUtxo(outpoint)));
      listeners.push(newUtxoListID, spentUtxoListID);
    })
    .catch(console.error);

  return () => {
    detectProvider('marina').then((marina: MarinaProvider) => listeners.forEach(id => marina.off(id)));
  }
});
