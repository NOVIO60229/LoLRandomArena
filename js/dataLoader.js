import { spriteBasePath, imageVersion } from './config.js';

export let championList = [];
export let itemList = [];
export let spellList = [];
export let runeList = [];

export async function loadChampionData() {
    const res = await fetch(`${spriteBasePath}/${imageVersion}/data/zh_TW/champion.json`);
    const json = await res.json();
    championList = Object.values(json.data);
}

export async function loadItemData() {

    const res = await fetch(`${spriteBasePath}/${imageVersion}/data/zh_TW/item.json`);
    const json = await res.json();
    itemList = Object.entries(json.data)
        .map(([id, item]) => ({ id, ...item }))
        .filter(item => item.gold.total >= 2200 && item.gold.purchasable === true);
}

export async function loadSpellData() {
    const res = await fetch(`${spriteBasePath}/${imageVersion}/data/zh_TW/summoner.json`);
    const json = await res.json();
    spellList = Object.values(json.data);
}

export async function loadRuneData() {

    const res = await fetch(`${spriteBasePath}/${imageVersion}/data/zh_TW/runesReforged.json`);
    runeList = await res.json();
}

export async function loadAllData() {
    await Promise.all([
        loadChampionData(),
        loadItemData(),
        loadSpellData(),
        loadRuneData()
    ]);
}
