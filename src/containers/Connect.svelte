<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { detectProvider, Utxo } from 'marina-provider';

  import { marinaStore, MarinaStore } from '../stores/store';

  $: installed = false;
  $: enabled = false;
  $: listeners = [];

  const unsubscribe = marinaStore.subscribe((s: MarinaStore) => {
    installed = s.installed;
    enabled = s.enabled;
  });

  const connect = async () => {
    if (!enabled) await window.marina.enable();
    else await window.marina.disable();
  };

  const notifyEnabled = () => {
    marinaStore.update((s: MarinaStore) => ({ ...s, enabled: true }));
  };

  const notifyDisabled = () => {
    marinaStore.update((s: MarinaStore) => ({ ...s, enabled: false }));
  };

  const notifyInstalled = () => {
    marinaStore.update((s: MarinaStore) => ({ ...s, installed: true }));
  };

  onMount(async () => {
    const marina = await detectProvider('marina');

    if (!marina) return;
    notifyInstalled();

    const isEnabled = await marina.isEnabled();
    if (isEnabled) {
      notifyEnabled();
    } else {
      notifyDisabled();
    }

    // Start listening to ENABLED and DISABLED events and binds to the state
    listeners.push(
      marina.on('ENABLED', () => {
        notifyEnabled();
      })
    );

    listeners.push(
      marina.on('DISABLED', () => {
        notifyDisabled();
      })
    );

    listeners.push(
      marina.on('NEW_UTXO', (u: Utxo) => {
        marinaStore.update((s: MarinaStore) => ({
          ...s,
          utxos: [...s.utxos, u],
        }));
      })
    );

    listeners.push(
      marina.on(
        'SPENT_UTXO',
        ({ txid, vout }: { txid: string; vout: number }) => {
          marinaStore.update((s: MarinaStore) => ({
            ...s,
            utxos: s.utxos.filter((u) => u.txid !== txid || u.vout !== vout),
          }));
        }
      )
    );
  });

  const unsubscribeFunc = async () => {
    unsubscribe();
    const marina = await detectProvider('marina');
    listeners.forEach((listener) => marina.off(listener));
    listeners = [];
  };

  onDestroy(unsubscribeFunc);
</script>

{#if !installed}
  <button
    class="button is-rounded is-primary"
    on:click={() => window.open('https://vulpem.com/marina')}
  >
    Install Marina
  </button>
{:else if !enabled}
  <button class="button is-rounded is-primary" on:click={connect}>
    Connect with Marina
  </button>
{:else}
  <button class="button is-rounded is-primary" on:click={connect}>
    Disconnect
  </button>
{/if}
