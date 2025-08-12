import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execCb);

const LANG_CODE = process.env.DDRAGON_LANG || "zh_TW"; // 語系
const DATA_DIR = "data";   
const CONFIG_JS = "config.js";     // 給前端 import 的設定檔
const MANIFEST = `manifest.json`;

async function getLatestRemote() {
  const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
  if (!res.ok) throw new Error(`Failed to fetch versions.json: ${res.status}`);
  const arr = await res.json();
  console.log('getLatestRemote:' + arr[0]);
  return arr[0];
}

async function getSavedVersion() {
  try {
    const version = await readFile(`data/latest.txt`, "utf8");
    console.log('getSavedVersion:' + version);
    return version;
  } catch(err) {
    console.log(err.message);
    return null;
  }
}

async function writeSavedVersion(ver) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(`${DATA_DIR}/latest.txt`, ver, "utf8");
}

async function main() {
  const remote = await getLatestRemote();
  const saved = await getSavedVersion();

  console.log(`Remote: ${remote} ; Saved: ${saved || "(none)"}`);
  if (remote === saved) {
    console.log("No update needed.");
    return;
  }

  await writeSavedVersion(remote);

  console.log(`Update done: ${saved || "(none)"} -> ${remote}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});