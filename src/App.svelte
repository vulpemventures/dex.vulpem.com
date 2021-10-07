<script>
	import Trade from './pages/Trade.svelte';
  import Connect from './components/Connect.svelte'
</script>


<section class="hero has-background-grey-lighter is-fullheight">
  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
    <div class="container is-max-desktop has-text-right">
      <Connect />
    </div>
  </div>

  <div class="hero-body">
    <div class="container is-max-desktop">
      <Trade />
    </div>
  </div>

</section>


<style src="./scss/main.scss" lang="scss" global>
</style>
