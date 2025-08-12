export const spriteBasePath = "asset/dragontail";
export let imageVersion = null;

// 讀取版本設定（或從 config json 讀取）
export async function loadConfig() {
  const response = await fetch(`${spriteBasePath}-config.json`);
  const config = await response.json();
  imageVersion = config.version;
  console.log("Loaded config, version:", imageVersion);
}