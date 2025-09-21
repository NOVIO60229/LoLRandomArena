import { championList, itemList, spellList, runeList } from './dataLoader.js';
import { spriteBasePath, imageVersion } from './config.js';

export const mapIdToName = {
  12: "ARAM",
  11: "CLASSIC",
  30: "CHERRY"
};

let lastGroups = [];
let remainingChampions;
let itemPool;

export function generateRandomGroups(mapId, characterCount, dFlashEnabled, guaranteedFlash) {
  if (characterCount > championList.length) {
    throw new Error("組數超過可用英雄數量！");
  }

  let groups = [];

  // 英雄隨機排序
  remainingChampions = [...championList].sort(() => 0.5 - Math.random());
  //裝備隨機排序
  itemPool = [...itemList].filter(item => item.maps && item.maps[mapId] === true);

  // 抽選英雄
  for (let g = 0; g < characterCount; g++) {
    const champion = remainingChampions.shift();

    // 裝備篩選
    const items = copyRandomFromPool(itemPool, 2);

    // 符文抽取
    const primary = runeList[Math.floor(Math.random() * runeList.length)];
    const rune = primary.slots[0].runes[Math.floor(Math.random() * primary.slots[0].runes.length)];

    // 抽召喚師技能
    let spells = rollSpells(mapId, guaranteedFlash, dFlashEnabled);

    groups.push({
      champion,
      items,
      rune,
      spells,
    });
  }

  lastGroups = groups;

  return groups;
}

function rollSpells(mapId, guaranteedFlash, dFlashEnabled) {
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
  return spells;
}

export function regenerateGroupAtIndex(index, mapId, guaranteedFlash, dFlashEnabled) {
  if (index < 0 || index >= lastGroups.length) throw new Error(' regenerateGroupAtIndex | index out of range');

  const newChampion = remainingChampions.shift();
  remainingChampions.push(lastGroups[index].champion);

  const items = copyRandomFromPool(itemPool, 2);

  const primary = runeList[Math.floor(Math.random() * runeList.length)];
  const rune = primary.slots[0].runes[Math.floor(Math.random() * primary.slots[0].runes.length)];

  const spells = rollSpells(mapId, guaranteedFlash, dFlashEnabled);

  lastGroups[index].champion = newChampion;
  lastGroups[index].items = items;
  lastGroups[index].rune = rune;
  lastGroups[index].spells = spells;

  return lastGroups[index];
}

function copyRandomFromPool(pool, n) {
  const copy = [...pool];
  const result = [];

  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }

  return result;
}
