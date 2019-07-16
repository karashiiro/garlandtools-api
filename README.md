# garlandtools-api
An unofficial Node wrapper for the Garland Tools API.

It's asynchronous and promisified for your convenience.
# Usage
```
const garlandtools = require('garlandtools-api');
```

Search for things:
```
(await garlandtools.search("hempen yarn"))[0].obj.n // "Hempen Yarn"
```

Get an item's data:
```
(await garlandtools.item(5333)).item.name // "Hempen Yarn"
```

Get an icon:
```
await garlandtools.icon("item", 21658) // https://www.garlandtools.org/files/icons/item/21658.png
```

Get an NPC's data:
```
(await garlandtools.npc(1000391)).npc.shops[0].entries[6] // 5333
```

...And much more!
## Full property list
```
// Wrapper properties
lang; // The lanugage. By default, this is "en".

clearCache(); // Clears the wrapper's cache manually.
setCacheTime(time); // Set the time to store data in milliseconds. By default, this is 1 hour.
// API accessors
achievements(); // The achievement JSON index.
actions(); //The action JSON index.
data(); // The entirety of the JSON data index.
endgameGear(job); // The endgame equipment for a job. Uses the three-letter abbreviation as an argument.
fates(); // The FATE JSON index.
fishingSpots(); // The fishing spot JSON index.
icon(type, id); // Returns the PNG icon "id" from directory "type".
instances(); // The instance JSON index.
item(id); // An item's JSON listing.
leves(); // The levequest JSON index.
levelingGear(job); // The leveling equipment for a job, sorted by level. Uses the three-letter abbreviation as an argument.
map(zone); // Returns a PNG map of "zone". Some zones require a parent zone as well, such as "La Noscea/Lower La Noscea".
mob(id); // A mob's JSON listing.
mobs(); // The mob JSON index.
nodes(); // The gathering node JSON index.
npc(id); // An NPC's JSON listing.
npcs(); // The NPC JSON index.
search(query); // A JSON response for a search.
statuses(); // The status JSON index.
quests(); // The quest JSON index.
```
