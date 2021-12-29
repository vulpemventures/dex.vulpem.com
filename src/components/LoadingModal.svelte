<script lang="ts">
  import { allTradableAssets } from '../stores/tdexstore';

  // Messages to show to user while loading tdex markets
  enum MESSAGES {
    loading = 'Discovering TDEX providers...',
    timeout = 'No TDEX provider is available. Try again later.',
  }

  let showModal = true;
  let isLoading = true;

  // Change message after some delay
  // User will only see this if tdex markets didn't respond
  const loadingTimeout = 60 * 1000; // 60 seconds
  setTimeout(() => (isLoading = false), loadingTimeout);

  // Hide modal when tdex markets respond
  allTradableAssets.subscribe((assets) => {
    if (assets.length > 0) showModal = false;
  });
</script>

<div class="modal {showModal && 'is-active'}">
  <div class="modal-background" />
  <div class="modal-content box has-background-black has-text-centered">
    <h1 class="title has-text-white">
      {isLoading ? MESSAGES.loading : MESSAGES.timeout}
    </h1>
    {#if isLoading}
      <div class="loader-wrapper is-active">
        <div class="loader is-loading" />
      </div>
    {/if}
  </div>
</div>
