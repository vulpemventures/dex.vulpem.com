<script>
  import { Coin, CoinTicker } from '../constants';

  import BitcoinLogo from '../assets/images/liquid-btc.svg';
  import TetherLogo from '../assets/images/liquid-tether.svg';
  import LCADLogo from '../assets/images/liquid-cad.png';

  const CoinLogo = {
    [Coin.Bitcoin]: BitcoinLogo,
    [Coin.Tether]: TetherLogo,
    [Coin.LCAD]: LCADLogo,
  };

  export let name;
  export let showTicker = false;

  $: source = CoinLogo[name];
  $: ticker = CoinTicker[name];
</script>

<div class="columns is-mobile is-vcentered">
  <div class="column is-one-third">
    <figure class="image is-32x32">
      <img src={source} alt="coin logo" />
    </figure>
  </div>
  <div class="column is-two-third">
    <span class="subtitle has-text-white">{!showTicker ? name : ticker}</span>
  </div>
</div>
