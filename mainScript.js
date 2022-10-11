// === Variables ===

const mapStartLatLng = [46.65, 2.466667];

let guessPinIcon = L.icon({
    iconUrl: 'assets/vector/guessPin.svg',
    iconSize: [37, 50],
    iconAnchor: [18, 50],
    shadowUrl: 'assets/vector/pinShadow.svg',
    shadowSize: [41, 15],
    shadowAnchor: [4, 15]
});
let answerPinIcon = L.icon({
    iconUrl: 'assets/vector/answerPin.svg',
    iconSize: [37, 50],
    iconAnchor: [18, 50],
    shadowUrl: 'assets/vector/pinShadow.svg',
    shadowSize: [41, 15],
    shadowAnchor: [4, 15]
});

let prefecturesCitiesNb = 0;
let subPrefecturesCitiesNb = 0;
let habs50kCitiesNb = 0;
let habs30kCitiesNb = 0;
let mostPopulatedCitiesNb = 0;
let allCitiesNb = 0;

// Villes sélectionnées pour le jeu
let currentCitiesData = [];

let allCitiesCoordinates = {};

// === Functions ===
const sleep = ms => new Promise(r => setTimeout(r, ms));

function writeInFile(content, filepath) {
    // write to js file
    const fs = require('fs');

    fs.writeFile('C:/Users/mrgnl/Desktop/Laboratoire informatique/CityGuessr/resultJson', content, err => {
        if (err) {
            console.error(err);
            return
        }
    });
}

function generateQueue() {
    var arr = [];
    while (arr.length < nbOfCities) {
        var r = Math.floor(Math.random() * nbOfCities) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

function onMapClick(e) {
    if (marker !== null) marker.remove();

    marker = L.marker(e.latlng, {
        icon: guessPinIcon
    }).addTo(map);

    document.getElementById("validate").disabled = false;
}

async function validate() {
    answerMarker = L.marker(L.latLng(currentPoint), {
        icon: answerPinIcon
    }).addTo(map);
    calculateDistance(marker.getLatLng());

    document.getElementById("validate").disabled = true;
    await new Promise(r => setTimeout(r, 2000));
    marker.remove();
    answerMarker.remove();
    queuePos++;
    if (queuePos == nbOfCities) {
        document.getElementById("cityName").innerHTML = "F5 to replay";
        document.getElementById("validate").disabled = true;
    }
    else {
        currentCity = citiesKeys[(queue[queuePos] - 1)];
        currentPoint = citiesCoordinates[currentCity];
        document.getElementById("cityName").innerHTML = currentCity;
    }
}

function calculateDistance(latlngGuess) {
    var result = latlngGuess.distanceTo(L.latLng(currentPoint));
    var kms = Math.floor(result / 1000);
    var meters = Math.round(result - kms * 1000);
    console.log("Result : " + kms + " Km " + meters + " m");

}

function addCity(city, container) {
    if (!(container.includes(city))) {
        container.push(city);
    }
}
function select30kCities(container) {
    habs30kCitiesNb = 0;
    allFrenchCities.forEach((city) => {
        if (city.hab2012 >= 30000 && city.departmentNumber < 100) {
            addCity(city, container);
            habs30kCitiesNb++;
        }
    })
}
function select50kCities(container) {
    habs50kCitiesNb = 0;
    allFrenchCities.forEach((city) => {
        if (city.hab2012 >= 50000 && city.departmentNumber < 100) {
            addCity(city, container);
            habs50kCitiesNb++;
        }
    })
}
function selectPrefectures(container) {
    prefecturesCitiesNb = 0;
    prefectures.forEach((city) => {
        let foundCity = [];
        foundCity = allFrenchCities.filter(frenchCity => frenchCity.name == city);
        // Sélectionner la ville qui a le plus grand nombre d'habitants de tous.
        if (foundCity.length > 1) {
            var highestHab = foundCity.reduce((acc, city) => acc = acc > city.hab2012 ? acc : city.hab2012, 0);
            foundCity = foundCity.filter(frenchCity => frenchCity.hab2012 == highestHab);
        }
        addCity(foundCity[0], container);
        prefecturesCitiesNb++;
    })
}
function selectSubPrefectures(container) {
    subPrefecturesCitiesNb = 0;
    subPrefectures.forEach((city) => {
        let foundCity = [];
        foundCity = allFrenchCities.filter(frenchCity => frenchCity.name == city);
        // Sélectionner la ville qui a le plus grand nombre d'habitants de tous.
        if (foundCity.length > 1) {
            var highestHab = foundCity.reduce((acc, city) => acc = acc > city.hab2012 ? acc : city.hab2012, 0);
            foundCity = foundCity.filter(frenchCity => frenchCity.hab2012 == highestHab);
        }
        addCity(foundCity[0], container);
        subPrefecturesCitiesNb++;
    })
}

function selectXMostPopulated(container, x) {
    mostPopulatedCitiesNb = 0;
    for (let i = 0; i < x; i++) {
        if (allFrenchCities[i].departmentNumber < 100) {
            addCity(allFrenchCities[i], container);
            mostPopulatedCitiesNb++;
        }
    }
}

function selectAllCities(container) {
    allCitiesNb = 0;
    allFrenchCities.forEach((city) => {
        if (city.departmentNumber < 100) {
            addCity(city, container);
            allCitiesNb++;
        }
    })
}

// === Script ===

/* for (let index = 0; index < allCities.length; index++) {
    setCoordinates(allCities[index]);   
} */

// == Set game ==

var map = L.map('map').setView(mapStartLatLng, 6);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',

    maxZoom: 15
}).addTo(map);
map.on('click', onMapClick);
// Assumes your Leaflet map variable is 'map'..
L.DomUtil.addClass(map._container, 'crosshair-cursor-enabled');

document.getElementById("validate").disabled = true;
/* 
var nbOfCities = Object.keys(citiesCoordinates).length;
console.log("Number of cities : " + nbOfCities);

var citiesKeys = Object.keys(citiesCoordinates);
var queue = generateQueue();
console.log("Queue : " + queue);

var marker = 0;
var answerMarker = 0;

var queuePos = 0;
var currentCity = citiesKeys[(queue[queuePos] - 1)];
var currentPoint = citiesCoordinates[currentCity];

document.getElementById("cityName").innerHTML = currentCity;
 */

// Vérifie si la ville n'est pas déjà présente avant de l'ajouter, pour éviter les doublons


selectSubPrefectures(currentCitiesData);

console.log(currentCitiesData);