import os from 'node:os';
import path from 'node:path';
import { mkdir, rm, rename, writeFile, readFile} from 'node:fs/promises';
import { exec as execCb } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execCb);


const LANG_CODE = process.env.DDRAGON_LANG || "zh_TW"; // 語系
const ASSET_DIR = "asset/dragontail"; //dragontail 資料位置
const ASSET_DIR_TEMP = "asset/.tarTemp" //dragontail temp解壓位置
const VERSION_TXT_DIR = "data";   //版本號txt資料夾
const VERSION_TXT_PATH = 'data/latest.txt'; //版本號txt檔案位置
const MANIFEST_PATH = `manifest.json`; //設定檔位置
const DDRAGON_VERSION_URL = 'https://ddragon.leagueoflegends.com/api/versions.json'; //官方提供版本查詢API

async function getLatestRemote() {
    const res = await fetch(DDRAGON_VERSION_URL);
    if (!res.ok) throw new Error(`Failed to fetch versions.json: ${res.status}`);
    const arr = await res.json();
    console.log('getLatestRemote:' + arr[0]);
    return arr[0];
}

async function getSavedVersion() {
    try {

        const version = await readFile(VERSION_TXT_PATH, "utf8");
        console.log('getSavedVersion:' + version);
        return version;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

const TMP_DIR = os.tmpdir(); 

async function extractDragontail(ver) {
    const finalDir = ASSET_DIR;
    const workDir  = ASSET_DIR_TEMP;
    const tgzPath = path.join(TMP_DIR, `dragontail-${ver}.tgz`);

    //清空解壓資料夾
    await rm(workDir, { recursive: true, force: true });
    await mkdir(workDir, { recursive: true });

    console.log(`Downloading dragontail-${ver}.tgz ...`);
    // 存到tgz到系統暫存
    await exec(
        `curl --fail --location --retry 3 --retry-delay 2 ` +
        `"https://ddragon.leagueoflegends.com/cdn/dragontail-${ver}.tgz" -o "${tgzPath}"`
    );

    console.log(`Extracting ALL ...`);
    await exec(
        `tar -xzf "${tgzPath}" ` +
        `-C "${workDir}" ` 
    );

    //替換解壓成功的資料夾
    await rm(finalDir, { recursive: true, force: true });
    await rename(workDir, finalDir);

    console.log(`Extracted to ${finalDir}`);
}

async function writeSavedVersion(ver) {
    await mkdir(VERSION_TXT_DIR, { recursive: true });
    await writeFile(`${VERSION_TXT_DIR}/latest.txt`, ver, "utf8");
}

async function main() {

    const remote = await getLatestRemote();
    const saved = await getSavedVersion();

    console.log(`Remote: ${remote} ; Saved: ${saved || "(none)"}`);
    if (remote === saved) {
        console.log("No update needed.");
        return;
    }

    await extractDragontail(remote);
    await writeSavedVersion(remote);

    console.log(`Update done: ${saved || "(none)"} -> ${remote}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});