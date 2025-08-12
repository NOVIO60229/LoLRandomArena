import { generateRandomCharacters } from './randomizer.js';
import { spriteBasePath, imageVersion } from './config.js';

export function bindDrawButton() {
  document.getElementById("drawButton").addEventListener("click", () => {
    try {
      const selectedMap = document.getElementById("mapSelect").value;
      const characterCount = parseInt(document.getElementById("characterCount").value, 10);
      const dFlashEnabled = document.getElementById("dFlashToggle").checked;
      const guaranteedFlash = document.getElementById("guaranteedFlashToggle").checked;

      const groups = generateRandomCharacters(selectedMap, characterCount,dFlashEnabled, guaranteedFlash);

      renderGroups(groups, selectedMap);

    } catch (error) {
      alert(error.message);
    }
  });
}

function renderGroups(groups, selectedMap) {
  const characterGroupPool = document.getElementById("characterGroupPool");
  const blueSideDiv = document.getElementById("blueSide");
  const redSideDiv = document.getElementById("redSide");

  characterGroupPool.innerHTML = "";
  blueSideDiv.innerHTML = "";
  redSideDiv.innerHTML = "";

  groups.forEach((group, index) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "characterGroup";
    groupDiv.id = `characterGroup-${index}`;
    groupDiv.draggable = true;
    groupDiv.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", groupDiv.id);
    });

    // 上半部：英雄 + 裝備 + 符文
    const upperDiv = document.createElement("div");
    upperDiv.className = "upperSection";

    // 英雄圖示
    const champDiv = document.createElement("div");
    champDiv.className = "championIcon";
    champDiv.style.backgroundImage = `url(${spriteBasePath}/${imageVersion}/img/sprite/${group.champion.image.sprite})`;
    champDiv.style.backgroundPosition = `-${group.champion.image.x}px -${group.champion.image.y}px`;
    upperDiv.appendChild(champDiv);

    // 裝備
    group.items.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "itemIcon";
      itemDiv.style.backgroundImage = `url(${spriteBasePath}/${imageVersion}/img/sprite/${item.image.sprite})`;
      itemDiv.style.backgroundPosition = `-${item.image.x}px -${item.image.y}px`;
      upperDiv.appendChild(itemDiv);
    });

    // 下半部
    const lowerDiv = document.createElement("div");
    lowerDiv.className = "lowerSection";

    // 符文
    const runeDiv = document.createElement("div");
    runeDiv.className = "runeIcon";
    runeDiv.style.backgroundImage = `url(${spriteBasePath}/img/${group.rune.icon})`;
    runeDiv.style.backgroundPosition = "center";
    lowerDiv.appendChild(runeDiv);

    //召喚師技能
    for (const spell of group.spells) {
      const spellDiv = document.createElement("div");
      spellDiv.className = "spellIcon";
      spellDiv.style.backgroundImage = `url(${spriteBasePath}/${imageVersion}/img/spell/${spell.image.full})`;
      spellDiv.style.backgroundPosition = "center";
      lowerDiv.appendChild(spellDiv);
    }


    // ban 按鈕
    const banButton = document.createElement("button");
    banButton.className = "banButton";
    banButton.textContent = "禁用";

    // TODO:刷新ban view
    banButton.addEventListener("click", () => {
      groupDiv.classList.add("banned");
    });
    lowerDiv.appendChild(banButton);

    groupDiv.appendChild(upperDiv);
    groupDiv.appendChild(lowerDiv);
    characterGroupPool.appendChild(groupDiv);
  });
}

// 綁定拖放事件
export function bindDragAndDrop() {
  ["redSide", "blueSide"].forEach(sideId => {
    const side = document.getElementById(sideId);

    side.addEventListener("dragover", (e) => {
      e.preventDefault();
      side.classList.add("drag-over");
    });

    side.addEventListener("dragleave", () => {
      side.classList.remove("drag-over");
    });

    side.addEventListener("drop", (e) => {
      e.preventDefault();
      side.classList.remove("drag-over");

      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedElement = document.getElementById(draggedId);
      if (draggedElement) side.appendChild(draggedElement);
    });
  });

  // characterGroupPool 拖回功能
  const characterGroupPool = document.getElementById("characterGroupPool");
  characterGroupPool.addEventListener("dragover", e => {
    e.preventDefault();
    characterGroupPool.classList.add("drag-over");
  });
  characterGroupPool.addEventListener("dragleave", () => {
    characterGroupPool.classList.remove("drag-over");
  });
  characterGroupPool.addEventListener("drop", e => {
    e.preventDefault();
    characterGroupPool.classList.remove("drag-over");

    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedId);
    if (draggedElement) characterGroupPool.appendChild(draggedElement);
  });
}

// 切換顯示 ban 角色
export function bindToggleBanVisibility() {
  document.getElementById("toggleBanVisibility").addEventListener("change", function () {
    const showBanned = this.checked;
    const bannedItems = document.querySelectorAll(".characterGroup.banned");
    bannedItems.forEach(item => {
      item.style.display = showBanned ? "flex" : "none";
    });
  });
}
