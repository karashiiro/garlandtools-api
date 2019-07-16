# garlandtools-api
An unofficial Node wrapper for the Garland Tools API.
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
