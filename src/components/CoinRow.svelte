<script>
  import { AssetNames } from '../constants';

  import BitcoinLogo from '../assets/images/liquid-btc.svg';
  import TetherLogo from '../assets/images/liquid-tether.svg';
  import LCADLogo from '../assets/images/liquid-cad.png';
  import QuestionMark from '../assets/images/question-mark.svg';

  const CoinLogo = {
    [AssetNames.LBTC]: BitcoinLogo,
    [AssetNames.LCAD]: LCADLogo,
    [AssetNames.USDT]: TetherLogo,
  };

  const getImgSource = (coin) => {
    const logo = CoinLogo[coin.name];
    if (!logo) return QuestionMark;
    return logo;
  };

  export let coin;
  export let showTicker = false;

  $: source = getImgSource(coin);
</script>

<div class="columns is-mobile is-vcentered">
  <div class="column is-one-third">
    <figure class="image is-32x32">
      <img src={source} alt="coin logo" />
    </figure>
  </div>
  <div class="column is-two-third">
    <span class="subtitle has-text-white"
      >{!showTicker ? coin.name : coin.ticker}</span
    >
  </div>
</div>
