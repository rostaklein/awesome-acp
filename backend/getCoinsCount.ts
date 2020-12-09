type CoinsCondition = {
  until: number;
  bonus: number;
};

const coinRanks: CoinsCondition[] = [
  { until: 100, bonus: 0 },
  { until: 200, bonus: 10 },
  { until: 350, bonus: 15 },
  { until: 500, bonus: 20 },
  { until: 1000, bonus: 25 },
];

type CoinsResult = {
  coins: number;
  bonusPercent: number;
  bonusCoins: number;
};

export const getCoinsCount = (eurAmount: number): CoinsResult => {
  const basicCoins = eurAmount * 10;
  const foundRank = coinRanks.find(({ until }) => until >= basicCoins);

  const rank = foundRank ?? coinRanks[coinRanks.length - 1];

  const bonusCoins = Math.ceil(basicCoins * (rank.bonus / 100));

  const totalCoins = Math.ceil(basicCoins + bonusCoins);

  return {
    coins: totalCoins,
    bonusPercent: rank.bonus,
    bonusCoins,
  };
};
