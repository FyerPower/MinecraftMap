(function() {
    'use strict';

    var mymap = L.map('minecraftMap', {
        center: [0,0],
        zoom: 5,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false
    })

    L.tileLayer('mapData/JourneyMap/{x},{y}.png', {
        attribution: 'Map data by me!'
    }).addTo(mymap);

}());
