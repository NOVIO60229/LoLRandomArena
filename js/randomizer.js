import { championList, itemList, spellList, runeList } from './dataLoader.js';
import { spriteBasePath, imageVersion } from './config.js';

export const mapIdToName = {
  12: "ARAM",
  11: "CLASSIC",
  30: "CHERRY"
};

export function generateRandomCharacters(mapId, characterCount) {
  if (characterCount > championList.length) {
    throw new Error("組數超過可用英雄數量！");
  }

  // 隨機排序
  let remainingChampions = [...championList].sort(() => 0.5 - Math.random());

  // 抽選英雄
  let groups = [];
  for (let g = 0; g < characterCount; g++) {
    const champion = remainingChampions.splice(0, 1)[0];

    // 裝備篩選
    const items = [...itemList]
      .filter(item => item.maps && item.maps[mapId] === true)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    // 符文抽取
    const primary = runeList[Math.floor(Math.random() * runeList.length)];
    const rune = primary.slots[0].runes[Math.floor(Math.random() * primary.slots[0].runes.length)];

    // 技能抽取 (此處留空，建議由 UI 控制器自行決定)

    groups.push({
      champion,
      items,
      rune,
      // spells: [...], // 由呼叫端決定
    });
  }

  return groups;
}
