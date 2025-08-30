export let spriteBasePath = null;
export let imageVersion = null;

// 讀取版本設定（或從 config json 讀取）
export async function loadConfig() {
  const manifestUrl = new URL('manifest.json', document.baseURI).href;
  const configResponse = await fetch(manifestUrl);
  const config = await configResponse.json();
  spriteBasePath = config.spriteBasePath;

  const versionResponse = await fetch(config.versionTxtPath);
  imageVersion = await versionResponse.text();
  
  console.log("Loaded config, version:", imageVersion);
}