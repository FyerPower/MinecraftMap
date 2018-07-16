(function() {
    'use strict';

    var TILE_SIZE = 256;
    var MAP_SIZE = 32768;
    var MC_MAP_SIZE = [19456, 19456];
    var Icons = buildIcons();

    // Map
    var minecraftMap = L.map('minecraftMap', {
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
        minecraftMap.getPane('tooltipPane').style.opacity = (minecraftMap.getZoom() < 5 ? 0 : 1);
    });
    L.control.coordinates({
    	position: "bottomleft",
        // useLatLngOrder: true,
        labelFormatterLat: function(lat){
            return ', ' + latLongToBlock(lat, 0).y;
        },
    	labelFormatterLng: function(long){
            return 'Coordinates: ' + latLongToBlock(0, long).x;
        },
    }).addTo(minecraftMap);


    // Markers
    buildIcon(5500, -5500, Icons.spawn, "Community Area");
    buildIcon(5150, -5900, Icons.player, "FyerPower");
    buildIcon(6200, -5900, Icons.player, "Emerlyy<br/>WedgieEdward");
    buildIcon(5950, -7000, Icons.player, "CrayonGravy");
    buildIcon(6800, -5900, Icons.player, "XerxesMC");
    buildIcon(6950, -5050, Icons.player, "Kink_In_Pink25");
    buildIcon(6800, -4100, Icons.player, "SilentHonk");
    buildIcon(3124, -6930, Icons.player, "Anakibu");
    buildIcon(6930, -7700, Icons.player, "End0Sensei");
    buildIcon(10240, -7700, Icons.player, "EndItAll");
    buildIcon(10450, -5500, Icons.player, "KalCzar");
    buildIcon(5100, -5150, Icons.player, "PurpleTurtleSamm");


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

    function buildIcons(){
        return {
            spawn:  L.icon({ iconUrl: '/images/markerCastle.png', iconSize: [64, 64], iconAnchor: [32, 32], popupAnchor: [0, -16] }),
            player: L.icon({ iconUrl: '/images/markerKnight.png', iconSize: [64, 64], iconAnchor: [32, 32], popupAnchor: [0, -16] })
        };
    }

    function buildIcon(x, y, icon, label){
        L.marker(blockToLatLong(x, y), {icon: icon})
            .bindPopup(label + "<br/>" + x + ", " + y)
            .bindTooltip(label, {direction: 'bottom', permanent: true, opacity: 1, offset: [0, 16]})
            .on('mouseover', function (e) {
                if(minecraftMap.getZoom() < 5){
                    this.openPopup();
                }
            })
            .on('mouseout', function (e) {
                this.closePopup();
            })
            .addTo(minecraftMap);

    }
}());
