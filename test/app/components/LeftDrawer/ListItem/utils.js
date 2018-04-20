import { coins } from 'constants/coins';

export default (code) => {
  let coin;
  if (!code) {
    const coinsArray = Object.values(coins);
    const randomIndex = Math.floor(Math.random() * coinsArray.length);
    coin = coinsArray[randomIndex];
  } else {
    coin = coins[code];
  }
  return coin;
};
