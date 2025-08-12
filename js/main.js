import {Test} from '/scripts/check_and_update.js';
import { loadConfig } from './config.js';
import { loadAllData } from './dataLoader.js';
import { bindDrawButton, bindDragAndDrop, bindToggleBanVisibility } from './uiHandlers.js';

async function main() {
  await Test();

  await loadConfig();
  await loadAllData();

  bindDrawButton();
  bindDragAndDrop();
  bindToggleBanVisibility();

  console.log("Init complete");
}

main();
