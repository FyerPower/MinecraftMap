
1.) Pre Generate Chunks:
```
/pregen gen startradius square 0 0 250
/pregen gen startexpansion square 0 0 250 600
```

2.) Run JourneyMap AutoMap

3.) Convert the map files to a single large image
```
java -jar journeymaptools-0.3.jar MapSaver "C:\\Users\\gamegenius86\\Documents\\Curse\\Minecraft\\Instances\\v1.12.2 with JourneyMap\\journeymap\\data\\sp\\StonedCraft SP" "C:\\Users\\gamegenius86\\Desktop\\MinecraftMap\\mapData" 512 512 -1 0 false day
```
