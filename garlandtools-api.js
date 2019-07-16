'use strict';

const cron = require('cron').CronJob;
const request = require('request-promise');

//
// Internal stuff.
//

module.exports.lang = "en"; // Can be altered directly.

const achievementURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/achievement.json`;
const actionURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/action.json`;
const dataURL = `https://www.garlandtools.org/db/doc/core/${this.lang}/3/data.json`;
const endgameGearURL = `https://www.garlandtools.org/db/doc/equip/${this.lang}/2/end-`;
const fateURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/fate.json`;
const fishingURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/fishing.json`;
const iconURL = `https://www.garlandtools.org/files/icons/`;
const instanceURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/instance.json`;
const itemURL = `https://www.garlandtools.org/db/doc/item/${this.lang}/3/`;
const leveURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/leve.json`;
const levelingGearURL = `https://www.garlandtools.org/db/doc/equip/${this.lang}/2/leveling-`;
const mapURL = `https://www.garlandtools.org/files/maps/`;
const mobURL = `https://www.garlandtools.org/db/doc/mob/${this.lang}/2/`;
const mobsURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/mob.json`;
const nodeURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/node.json`;
const npcURL = `https://www.garlandtools.org/db/doc/npc/${this.lang}/2/`;
const npcsURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/npc.json`;
const searchURL = `https://www.garlandtools.org/api/search.php`;
const statusURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/status.json`;
const questURL = `https://www.garlandtools.org/db/doc/browse/${this.lang}/2/quest.json`;

const cachedData = new Map(); // The cache, keyed with the URL. It stores a generic object value with properties data and time.

var cacheTime = 3600000; // A new request is made at least an hour after the previous. These files don't change very often.

const cache = async (url) => { // A simple function to check the cache for data.
    if (!cachedData.get(url)) {
        cachedData.set(url, {
            data: await request(url),
            time: now
        });
    }
    return cachedData.get(url).data;
};

const clearCache = () => {
    cachedData.forEach((value, key, map) => {
        if (new Date().getTime() >= value.time + cacheTime) { // Not a perfect check, but functional. Things can stay in the cache for a minimum of cacheTime ms, and a maximum of 2*cacheTime - 1 ms.
            cachedData.delete(key);
        }
    });
};

var cacheJob = new cron(new Date(cacheTime), clearCache);

//
// Public wrapper methods.
//

/**
 * Clears the cache.
 */
module.exports.clearCache = () => {
    cachedData.forEach((value, key, map) => {
        cachedData.delete(key);
    });
};

/**
 * Sets cache time.
 * @param time The time to cache data.
 */
module.exports.setCacheTime = (time) => {
    cacheTime = time;
    cacheJob.stop();
    cacheJob = new cron(new Date(cacheTime), clearCache);
};

//
// API accessors.
//

/**
 * @returns The achievement JSON index.
 */
module.exports.achievements = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(achievementURL)).browse;
        resolve(response);
    });
};

/**
 * @returns The action JSON index.
 */
module.exports.actions = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(actionURL)).browse;
        resolve(response);
    });
};

/**
 * @returns The entirety of the JSON data index.
 */
module.exports.data = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(dataURL));
        resolve(response);
    });
};

/**
 * @param job The three-letter job abbreviation.
 * @returns The endgame equipment for a job.
 */
module.exports.endgameGear = async (job) => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(endgameGearURL + `${job}.json`));
        resolve(response);
    });
};

/**
 * @returns The FATE JSON index.
 */
module.exports.fates = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(fateURL)).browse;
        resolve(response);
    });
};

/**
 * @returns The fishing spot JSON index.
 */
module.exports.fishingSpots = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(fishingURL)).browse;
        resolve(response);
    });
};

/**
 * @param type The database directory to retrieve from, e.g. "item", "action", etc.
 * @param id The icon ID.
 * @returns A PNG icon.
 */
module.exports.icon = async (type, id) => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = await cache(itemIconURL + `${type}/${id}.png`);
        resolve(response);
    });
};

/**
 * @returns The instance JSON index.
 */
module.exports.instances = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(instanceURL)).browse;
        resolve(response);
    });
};

/**
 * @param id The item's ID.
 * @returns An item's JSON listing.
 */
module.exports.item = async (id) => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(itemURL + `${id}.json`));
        resolve(response);
    });
};

/**
 * @returns The levequest JSON index.
 */
module.exports.leves = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(leveURL)).browse;
        resolve(response);
    });
};

/**
 * @param job The three-letter job abbreviation.
 * @returns The leveling equipment for a job, sorted by level.
 */
module.exports.levelingGear = async (job) => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(levelingGearURL + `${job}.json`));
        resolve(response);
    });
};

/**
 * @param zone The zone name. Some zones require a parent zone as well, such as "La Noscea/Lower La Noscea".
 * @returns A PNG map.
 */
module.exports.map = async (zone) => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = await cache(mapURL + `${zone}.png`);
        resolve(response);
    });
};

/**
 * @param id The mob's ID.
 * @returns A mob's JSON listing.
 */
module.exports.mob = async (id) => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(mobURL + `${id}.json`));
        resolve(response);
    });
};

/**
 * @returns The mob JSON index.
 */
module.exports.mobs = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(mobsURL)).browse;
        resolve(response);
    });
};

/**
 * @returns The gathering node JSON index.
 */
module.exports.nodes = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(nodeURL)).browse;
        resolve(response);
    });
};

/**
 * @param id The NPC's ID.
 * @returns An NPC's JSON listing.
 */
module.exports.npc = async (id) => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(npcURL + `${id}.json`));
        resolve(response);
    });
};

/**
 * @returns The NPC JSON index.
 */
module.exports.npcs = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(npcsURL)).browse;
        resolve(response);
    });
};

/**
 * @returns A JSON response for a search.
 */
module.exports.search = async (query) => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(searchURL + `?text=${query}&lang=${this.lang}`));
        resolve(response);
    });
};

/**
 * @returns The status JSON index.
 */
module.exports.statuses = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(statusURL)).browse;
        resolve(response);
    });
};

/**
 * @returns The quest JSON index.
 */
module.exports.quests = async () => {
    return new Promise(async (resolve, reject) => {
        let response;
        response = JSON.parse(await cache(questURL)).browse;
        resolve(response);
    });
};
