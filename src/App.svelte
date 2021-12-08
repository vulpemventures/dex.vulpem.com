<script>
  import Trade from './containers/Trade.svelte';
  import TdexIcon from './components/icons/TdexIcon.svelte';
  import Connect from 'svelte-marina-button';
</script>

<section class="hero has-background-black-bis is-fullheight">
  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
    <div class="container is-max-desktop has-text-right mt-3 mr-3">
      <Connect />
    </div>
  </div>

  <div class="hero-body">
    <div class="container is-max-desktop">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <Trade />
        </div>
      </div>
    </div>
  </div>

  <div class="hero-foot">
    <div class="container is-max-desktop">
      <div class="columns is-mobile">
        <div class="column is-offset-1 has-text-right">
          <p class="subtitle">Swap powered by</p>
        </div>
        <div class="column">
          <TdexIcon />
        </div>
      </div>
    </div>
  </div>
</section>

<style src="./scss/main.scss" lang="scss" global></style>