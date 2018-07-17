'use strict';

var TILE_SIZE = 256;
var MAP_SIZE = 32768;
var MC_MAP_SIZE = [19456, 19456];
var TYPE = { SPAWN: 'spawn', PLAYER: 'player' };
var POLYGON_COLORS = { 'spawn': '#FA8072', 'player': '#CCCCFF' };
var minecraftMap = undefined;
var Icons = [];
var Locations = [];
var showMapIcons = false;

// Map
setupMap();

// Icons
buildIcons();

// Markers
createLocation(TYPE.SPAWN,  0,  5500,  -5500, "Community Area",           [[5260, -5456], [5635, -5840], [6000, -5570], [5532, -5100]]);
createLocation(TYPE.PLAYER, 1,  5150,  -5850, "FyerPower",                [170]);
createLocation(TYPE.PLAYER, 2,  6170,  -5850, "Emerlyy<br/>WedgieEdward", [170]);
createLocation(TYPE.PLAYER, 3,  5950,  -7000, "CrayonGravy",              [[6075, -7134], [6075, -6860], [5820, -6860], [5700, -7020], [5700, -7134]]);
createLocation(TYPE.PLAYER, 4,  6800,  -5900, "XerxesMC",                 [170]);
createLocation(TYPE.PLAYER, 5,  6950,  -5050, "Kink_In_Pink25",           [[7130, -5200], [7130, -4920], [6770, -4920], [6770, -5200]]);
createLocation(TYPE.PLAYER, 6,  6800,  -4080, "SilentHonk",               [[6600, -4200], [6600, -3970], [6980, -3970], [6980, -4200]]);
createLocation(TYPE.PLAYER, 7,  3124,  -6930, "Anakibu",                  [160]);
createLocation(TYPE.PLAYER, 8,  6930,  -7700, "End0Sensei",               [[6800, -7890], [6800, -7470], [7060, -7470], [7060, -7890]]);
createLocation(TYPE.PLAYER, 9,  10240, -7700, "EndItAll",                 []);
createLocation(TYPE.PLAYER, 10, 10450, -5500, "KalCzar",                  []);
createLocation(TYPE.PLAYER, 11, 5100,  -5140, "PurpleTurtleSamm",         [170]);
createLocation(TYPE.PLAYER, 12, 10550, -4250, "TinySilverfish",           []);

$('li[goto]').on('click', function(){
    console.log('clicked');
    var id = +$(this).attr('goto');
    var location = Locations.find(function(l){
        return l.id == id;
    });
    if(location){
        minecraftMap.setView(location.marker.getLatLng());
        console.log('centered');
    }
});

$('input[type=checkbox]')
    .rcSwitcher({theme: 'flat'})
    .on('toggle.rcSwitcher', function(e, dataObj, changeType){
        var enabled = changeType === 'turnon';
        switch($(this).attr('name')){
            case 'players':
                Locations.forEach(function(loc){
                    if(loc.type === TYPE.PLAYER){
                        loc.marker.setOpacity(showMapIcons && enabled ? 1 : 0);
                        loc.label.getTooltip().setOpacity(enabled ? 0.9 : 0);
                        if(loc.polygon){
                            loc.polygon.setStyle({opacity: (enabled ? 0.9 : 0)})
                                       .setStyle({fillOpacity: (enabled ? 0.2 : 0)});
                        }
                    }
                });
                break;
        }
    });

function latLongToBlock(lat, long){
    var position = minecraftMap.project([lat, long], Math.ceil(Math.log(MAP_SIZE / TILE_SIZE) / Math.log(2)));
    return {
        x: Math.round(position.x - (MC_MAP_SIZE[0] / 2)),
        y: Math.round(position.y - (MC_MAP_SIZE[0] / 2))
    }
}

function blockToLatLong(xMinecraft, zMinecraft){
    var xPoint = ((MC_MAP_SIZE[0] / 2) + xMinecraft);
    var yPoint = ((MC_MAP_SIZE[1] / 2) + zMinecraft);
    return minecraftMap.unproject([xPoint, yPoint], Math.ceil(Math.log(MAP_SIZE / TILE_SIZE) / Math.log(2)))
}

function blocksToMeters(blockCount){
    return blockCount * 217.2;
}

function buildIcons(){
    Icons = {};
    Icons[TYPE.SPAWN]  = L.icon({ iconUrl: '/images/markerCastle.png', iconSize: [64, 64], iconAnchor: [32, 32], popupAnchor: [0, -16] });
    Icons[TYPE.PLAYER] = L.icon({ iconUrl: '/images/markerKnight.png', iconSize: [64, 64], iconAnchor: [32, 32], popupAnchor: [0, -16] })
}

function createLocation(type, id, x, y, label, area){
    var location = {type: type, id: id};

    location.marker = L.marker(blockToLatLong(x, y), {icon: Icons[type], opacity: (showMapIcons ? 1 : 0)})
                        .bindPopup(label + "<br/>" + x + ", " + y)
                        .on('mouseover', function (e) {
                            if(minecraftMap.getZoom() < 5){
                                this.openPopup();
                            }
                        })
                        .on('mouseout', function (e) {
                            this.closePopup();
                        })
                        .addTo(minecraftMap);

    var labelOffset = (showMapIcons ? 16 : (label.indexOf('<br/>') > 0 ? -30 : -22));
    location.label = L.marker(blockToLatLong(x, y), {opacity: 0})
                    .bindTooltip(label, {direction: 'bottom', permanent: true, opacity: 1, offset: [0, labelOffset]})
                    .addTo(minecraftMap);

    if(area && area.length > 1){
        area = area.map(coord => blockToLatLong(coord[0], coord[1]));
        location.polygon = L.polygon(area, {color: POLYGON_COLORS[type]})
                            .on('mouseover', function (e) {
                                    this.setStyle({opacity: 0.5});
                                })
                            .on('mouseout', function (e) {
                                    this.setStyle({opacity: 1});
                                })
                            .addTo(minecraftMap);
    }
    else if(area && area.length === 1) {
        location.polygon = L.circle(blockToLatLong(x, y), {radius: blocksToMeters(area[0]), color: POLYGON_COLORS[type]})
                            .addTo(minecraftMap);
    }

    Locations.push(location);
}


function setupMap(){
    // Map
    minecraftMap = L.map('minecraftMap', {
        center: [0,0],
        zoom: 1,
        scrollWheelZoom: true,
        attributionControl: false
    });

    // Tile Layer
    L.tileLayer('/mapData/output/{z}/{y}/{x}.jpg', {
        minZoom: 3,
        maxZoom: 6,
        noWrap: true
    }).addTo(minecraftMap);

    // Initial Config
    minecraftMap.setView(blockToLatLong(5500, -5500), 5);
    minecraftMap.on('zoomend', function() {
        minecraftMap.getPane('tooltipPane').style.opacity = (minecraftMap.getZoom() < 4 ? 0 : 1);
    });
    L.control.coordinates({
        position: "bottomleft",
        labelFormatterLat: function(lat){
            return ', ' + latLongToBlock(lat, 0).y;
        },
        labelFormatterLng: function(long){
            return 'Coordinates: ' + latLongToBlock(0, long).x;
        }
    }).addTo(minecraftMap);
}
