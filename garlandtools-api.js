"use strict";

import { CronJob } from "cron";
import bent from "bent";
import "regenerator-runtime";

const garlandTools = bent("https://www.garlandtools.org", "GET", "json", 200)

let lang = "en";

/**
 * Set the language used by the library.
 * @param {"en" | "de" | "fr" | "ja"} newLang
 */
export function setLang(newLang) {
    lang = newLang;
}

const achievementURL = () => `/db/doc/achievement/${lang}/2/`;
const achievementsURL = () => `/db/doc/browse/${lang}/2/achievement.json`;
const actionURL = () => `/db/doc/action/${lang}/2/`;
const actionsURL = () => `/db/doc/browse/${lang}/2/action.json`;
const dataURL = () => `/db/doc/core/${lang}/3/data.json`;
const endgameGearURL = () => `/db/doc/equip/${lang}/2/end-`;
const fateURL = () => `/db/doc/fate/${lang}/2/`;
const fatesURL = () => `/db/doc/browse/${lang}/2/fate.json`;
const fishingURL = () => `/db/doc/browse/${lang}/2/fishing.json`;
const iconURL = () => `/files/icons/`;
const instanceURL = () => `/db/doc/instance/${lang}/2/`;
const instancesURL = () => `/db/doc/browse/${lang}/2/instance.json`;
const itemURL = () => `/db/doc/item/${lang}/3/`;
const leveURL = () => `/db/doc/leve/${lang}/3/`;
const levesURL = () => `/db/doc/browse/${lang}/2/leve.json`;
const levelingGearURL = () => `/db/doc/equip/${lang}/2/leveling-`;
const mapURL = () => `/files/maps/`;
const mobURL = () => `/db/doc/mob/${lang}/2/`;
const mobsURL = () => `/db/doc/browse/${lang}/2/mob.json`;
const nodeURL = () => `/db/doc/node/${lang}/2/`;
const nodesURL = () => `/db/doc/browse/${lang}/2/node.json`;
const npcURL = () => `/db/doc/npc/${lang}/2/`;
const npcsURL = () => `/db/doc/browse/${lang}/2/npc.json`;
const searchURL = () => `/api/search.php`;
const statusURL = () => `/db/doc/Status/${lang}/2/`;
const statusesURL = () => `/db/doc/browse/${lang}/2/status.json`;
const questURL = () => `/db/doc/quest/${lang}/2/`;
const questsURL = () => `/db/doc/browse/${lang}/2/quest.json`;

const cachedData = new Map(); // The cache, keyed with the URL. It stores a generic object value with properties data and time.

let cacheTime = 3600000; // A new request is made at least an hour after the previous. These files don't change very often.

const cache = async (url) => { // A simple function to check the cache for data.
    const now = new Date().getTime();
    if (!cachedData.get(url)) {
        cachedData.set(url, {
            data: await garlandTools(url),
            time: now,
        });
    }
    return cachedData.get(url).data;
};

const timeoutCache = () => {
    const now = new Date().getTime();
    cachedData.forEach((value, key) => {
        if (now >= value.time + cacheTime) { // Not a perfect check, but functional. Things can stay in the cache for a minimum of cacheTime ms, and a maximum of 2*cacheTime - 1 ms.
            cachedData.delete(key);
        }
    });
};

var cacheJob = new CronJob(new Date(cacheTime), timeoutCache);

//
// Public wrapper methods.
//

/**
 * Clears the cache.
 */
export function clearCache() {
    cachedData.forEach((value, key, map) => {
        cachedData.delete(key);
    });
};

/**
 * Sets cache time.
 * @param time The time to cache data.
 */
export function setCacheTime(time) {
    cacheTime = time;
    cacheJob.stop();
    cacheJob = new CronJob(new Date(cacheTime), clearCache);
}

//
// API accessors.
//

/**
 * @param id The achievement's ID.
 * @returns An achievement's JSON listing.
 */
export async function achievement(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(achievementURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The achievement JSON index.
 */
export async function achievements() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(achievementsURL())).browse;
        resolve(response);
    });
}

/**
 * @param id The action's ID.
 * @returns An action's JSON listing.
 */
export async function action(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(actionURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The action JSON index.
 */
export async function actions() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(actionsURL())).browse;
        resolve(response);
    });
}

/**
 * @returns The entirety of the JSON data index.
 */
export async function data() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(dataURL()));
        resolve(response);
    });
}

/**
 * @param job The three-letter job abbreviation.
 * @returns The endgame equipment for a job.
 */
export async function endgameGear(job) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(endgameGearURL() + `${job}.json`));
        resolve(response);
    });
}

/**
 * @param id The FATE's ID.
 * @returns A FATE's JSON listing.
 */
export async function fate(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(fateURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The FATE JSON index.
 */
export async function fates() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(fatesURL())).browse;
        resolve(response);
    });
}

/**
 * @returns The fishing spot JSON index.
 */
export async function fishingSpots() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(fishingURL())).browse;
        resolve(response);
    });
}

/**
 * @param type The database directory to retrieve from, e.g. "item", "action", etc.
 * @param id The icon ID.
 * @returns A PNG icon.
 */
export async function icon(type, id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = await cache(iconURL() + `${type}/${id}.png`);
        resolve(response);
    });
}

/**
 * @param id The instance's ID.
 * @returns An instance's JSON listing.
 */
export async function instance(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(instanceURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The instance JSON index.
 */
export async function instances() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(instancesURL())).browse;
        resolve(response);
    });
}

/**
 * @param id The item's ID.
 * @returns An item's JSON listing.
 */
export async function item(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(itemURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @param id The leve's ID.
 * @returns A leve's JSON listing.
 */
export async function leve(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(leveURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The levequest JSON index.
 */
export async function leves() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(levesURL())).browse;
        resolve(response);
    });
}

/**
 * @param job The three-letter job abbreviation.
 * @returns The leveling equipment for a job, sorted by level.
 */
export async function levelingGear(job) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(levelingGearURL() + `${job}.json`));
        resolve(response);
    });
}

/**
 * @param zone The zone name. Some zones require a parent zone as well, such as "La Noscea/Lower La Noscea".
 * @returns A PNG map.
 */
export async function map(zone) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = await cache(mapURL() + `${zone}.png`);
        resolve(response);
    });
}

/**
 * @param id The mob's ID.
 * @returns A mob's JSON listing.
 */
export async function mob(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(mobURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The mob JSON index.
 */
export async function mobs() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(mobsURL())).browse;
        resolve(response);
    });
}

/**
 * @param id The node's ID.
 * @returns A node's JSON listing.
 */
export async function node(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(nodeURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The gathering node JSON index.
 */
export async function nodes() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(nodesURL())).browse;
        resolve(response);
    });
}

/**
 * @param id The NPC's ID.
 * @returns An NPC's JSON listing.
 */
export async function npc(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(npcURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The NPC JSON index.
 */
export async function npcs() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(npcsURL())).browse;
        resolve(response);
    });
}

/**
 * @returns A JSON response for a search.
 */
export async function search(query) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(searchURL() + `?text=${query}&lang=${this.lang}`));
        resolve(response);
    });
}

/**
 * @param id The status's ID.
 * @returns An status's JSON listing.
 */
export async function status(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(statusURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The status JSON index.
 */
export async function statuses() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(statusesURL())).browse;
        resolve(response);
    });
}

/**
 * @param id The quest's ID.
 * @returns A quest's JSON listing.
 */
export async function quest(id) {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(questURL() + `${id}.json`));
        resolve(response);
    });
}

/**
 * @returns The quest JSON index.
 */
export async function quests() {
    return new Promise(async (resolve, reject) => {
        let response;
        response = (await cache(questsURL())).browse;
        resolve(response);
    });
}
