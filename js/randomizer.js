import { championList, itemList, spellList, runeList } from './dataLoader.js';
import { spriteBasePath, imageVersion } from './config.js';

export const mapIdToName = {
  12: "ARAM",
  11: "CLASSIC",
  30: "CHERRY"
};

export function generateRandomCharacters(mapId, characterCount, dFlashEnabled, guaranteedFlash) {
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

    // 抽召喚師技能
    const mapName = mapIdToName[mapId] || "ARAM";


    const flashSpell = spellList.find(spell => spell.id === "SummonerFlash");
    // 過濾地圖可用，並移除 flash，用來手動插入
    const filteredSpells = [...spellList].filter(spell => spell.modes && spell.modes.includes(mapName)).filter(spell => spell.id !== "SummonerFlash");
    let spells = [];

    if (guaranteedFlash && flashSpell) {
      const otherSpell = filteredSpells.sort(() => 0.5 - Math.random())[0];
      spells = dFlashEnabled ? [flashSpell, otherSpell] : [otherSpell, flashSpell];
    }
    else {
      spells = [...filteredSpells, flashSpell]
        .filter(Boolean)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      // 如果抽到 flash，就根據 D Flash 決定順序
      const hasFlash = spells.some(spell => spell.id === "SummonerFlash");
      if (hasFlash && dFlashEnabled) {
        spells.sort((a, b) => (a.id === "SummonerFlash" ? -1 : 1));
      }
    }


    groups.push({
      champion,
      items,
      rune,
      spells,
    });
  }

  return groups;
}
