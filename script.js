// Leaflet

var map = L.map('map').setView([46, 2], 6);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);
function onMapClick(e) {
    /* console.log("You clicked the map at " + e.latlng) */
    if (i != 0) {
        marker.remove();
    }
    i++;
    marker = L.marker(e.latlng, {
        opacity: 0.7
    }).addTo(map);
    document.getElementById("validate").disabled = false;
}
map.on('click', onMapClick);
// Assumes your Leaflet map variable is 'map'..
L.DomUtil.addClass(map._container, 'crosshair-cursor-enabled');
const sleep = ms => new Promise(r => setTimeout(r, ms));

document.getElementById("validate").disabled = true;

var nbOfCities = Object.keys(citiesCoordinates).length;
console.log("Number of cities : " + nbOfCities);

function generateQueue() {
    var arr = [];
    while (arr.length < nbOfCities) {
        var r = Math.floor(Math.random() * nbOfCities) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

var citiesKeys = Object.keys(citiesCoordinates);
var queue = generateQueue();
console.log("Queue : " + queue);

var marker = 0;
var answerMarker = 0;
i = 0;

var queuePos = 0;
var currentCity = citiesKeys[(queue[queuePos] - 1)];
var currentPoint = citiesCoordinates[currentCity];
document.getElementById("cityName").innerHTML = currentCity;

async function validate(e) {
    calculateDistance(marker.getLatLng());
    answerMarker = L.marker(L.latLng(currentPoint), {
        opacity: 0.7
    }).addTo(map);
    document.getElementById("validate").disabled = true;
    await new Promise(r => setTimeout(r, 2000));
    marker.remove();
    answerMarker.remove();
    queuePos++;
    if (queuePos == nbOfCities) {
        document.getElementById("cityName").innerHTML = "F5 to replay";
        document.getElementById("validate").disabled = true;
    }
    else{
        currentCity = citiesKeys[(queue[queuePos] - 1)];
        currentPoint = citiesCoordinates[currentCity];
        document.getElementById("cityName").innerHTML = currentCity;
    }
}

function calculateDistance(latlngGuess) {
    var result = latlngGuess.distanceTo(L.latLng(currentPoint));
    var kms = result / 1000;
    var meters = result - kms * 1000;
    console.log("Result : " + Math.round(kms) + " Km " + Math.round(meters) + " m");

}


