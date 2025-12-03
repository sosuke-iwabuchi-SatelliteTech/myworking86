export type GachaRarity = 'UR' | 'SR' | 'R' | 'UC' | 'C';

export interface GachaItem {
  id: string;
  name: string;
  rarity: GachaRarity;
  description: string;
  imageUrl?: string; // Optional for now, we'll use emojis/placeholders
}

export const GACHA_ITEMS: GachaItem[] = [
  // UR (Ultra Rare) - 1%
  { id: 'ur-1', name: '伝説のドラゴン', rarity: 'UR', description: '炎をまとう伝説の生き物', imageUrl: '🐉' },
  { id: 'ur-2', name: '不死鳥フェニックス', rarity: 'UR', description: '永遠の命を持つ鳥', imageUrl: '🦅' },

  // SR (Super Rare) - 4%
  { id: 'sr-1', name: '百獣の王ライオン', rarity: 'SR', description: '草原の支配者', imageUrl: '🦁' },
  { id: 'sr-2', name: '猛虎タイガー', rarity: 'SR', description: '密林の狩人', imageUrl: '🐯' },
  { id: 'sr-3', name: 'ユニコーン', rarity: 'SR', description: '神秘的な一角獣', imageUrl: '🦄' },

  // R (Rare) - 15%
  { id: 'r-1', name: '大きなゾウ', rarity: 'R', description: '優しい力持ち', imageUrl: '🐘' },
  { id: 'r-2', name: 'キリン', rarity: 'R', description: '首がとても長い', imageUrl: '🦒' },
  { id: 'r-3', name: 'ホッキョクグマ', rarity: 'R', description: '氷の上の王様', imageUrl: '🐻‍❄️' },
  { id: 'r-4', name: 'パンダ', rarity: 'R', description: '笹が大好物', imageUrl: '🐼' },
  { id: 'r-5', name: 'クジラ', rarity: 'R', description: '海を泳ぐ巨大な影', imageUrl: '🐋' },

  // UC (Uncommon) - 30%
  { id: 'uc-1', name: '柴犬', rarity: 'UC', description: '忠実なパートナー', imageUrl: '🐕' },
  { id: 'uc-2', name: '三毛猫', rarity: 'UC', description: '気まぐれな性格', imageUrl: '🐈' },
  { id: 'uc-3', name: 'ウサギ', rarity: 'UC', description: 'ぴょんぴょん跳ねる', imageUrl: '🐇' },
  { id: 'uc-4', name: 'ペンギン', rarity: 'UC', description: '氷の上を滑る', imageUrl: '🐧' },
  { id: 'uc-5', name: 'フクロウ', rarity: 'UC', description: '森の賢者', imageUrl: '🦉' },
  { id: 'uc-6', name: 'カメ', rarity: 'UC', description: 'ゆっくり歩く', imageUrl: '🐢' },

  // C (Common) - 50%
  { id: 'c-1', name: 'ネズミ', rarity: 'C', description: 'すばしっこい', imageUrl: '/gacha/c-1-mouse.svg' },
  { id: 'c-2', name: 'ニワトリ', rarity: 'C', description: '朝を告げる', imageUrl: '/gacha/c-2-chicken.svg' },
  { id: 'c-3', name: 'カエル', rarity: 'C', description: '雨が好き', imageUrl: '/gacha/c-3-frog.svg' },
  { id: 'c-4', name: 'ヒツジ', rarity: 'C', description: 'もこもこの毛', imageUrl: '/gacha/c-4-sheep.svg' },
  { id: 'c-5', name: 'ブタ', rarity: 'C', description: 'きれい好き', imageUrl: '/gacha/c-5-pig.svg' },
  { id: 'c-6', name: 'アヒル', rarity: 'C', description: '水浴びが好き', imageUrl: '/gacha/c-6-duck.svg' },
  { id: 'c-7', name: 'サル', rarity: 'C', description: '木登りが得意', imageUrl: '/gacha/c-7-monkey.svg' },
  { id: 'c-8', name: 'ウマ', rarity: 'C', description: '走るのが速い', imageUrl: '/gacha/c-8-horse.svg' },
];

const RARITY_WEIGHTS: Record<GachaRarity, number> = {
  UR: 1,
  SR: 4,
  R: 15,
  UC: 30,
  C: 50,
};

export function pullGacha(): GachaItem {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  let randomValue = Math.random() * totalWeight;

  let selectedRarity: GachaRarity = 'C';

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    randomValue -= weight;
    if (randomValue <= 0) {
      selectedRarity = rarity as GachaRarity;
      break;
    }
  }

  const itemsOfRarity = GACHA_ITEMS.filter(item => item.rarity === selectedRarity);

  // Fallback to Common if something goes wrong (shouldn't happen with correct logic)
  if (itemsOfRarity.length === 0) {
    return GACHA_ITEMS.filter(item => item.rarity === 'C')[0];
  }

  const randomIndex = Math.floor(Math.random() * itemsOfRarity.length);
  return itemsOfRarity[randomIndex];
}
