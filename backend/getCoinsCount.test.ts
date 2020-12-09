import { getCoinsCount } from "./getCoinsCount";

describe(getCoinsCount.name, () => {
  it.each([
    [10, 100, 0],
    [11, 121, 10],
    [12.25, 136, 10],
    [25, 288, 15],
    [38, 456, 20],
    [55.5, 694, 25],
    [120, 1500, 25],
  ])(
    "for %d EUR, the expected coin count is: %d and bonus is: %d%",
    (input, coins, bonus) => {
      const result = getCoinsCount(input);

      expect(result.coins).toEqual(coins);
      expect(result.bonusPercent).toEqual(bonus);
    }
  );
});
