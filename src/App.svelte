<script>
  import Trade from './containers/Trade.svelte';
  import Connect from './containers/Connect.svelte';
</script>

<section class="hero has-background-dark is-fullheight">
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
</section>

<style src="./scss/main.scss" lang="scss" global></style>