/* Variables */

let allCitiesCoordinates = {};
let currentCityToGuess = null;
let cityIndex = 0;

/* Functions */

async function djagojfogjaValidate() {
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
const sleep = ms => new Promise(r => setTimeout(r, ms));

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


function createGame(){
    /* Cacher les éléments dans blueBlock */

    /* Remplir allCitiesCoordinates à partir de currentCitiesData */
    
    /* Randomiser currentCitiesData */
    currentCitiesData.sort(() => Math.random() - 0.5);
    console.log(currentCitiesData);
    startNewTurn();
}

function startNewTurn() {

    if (cityIndex <= currentCitiesData.length) {
        
        currentCityToGuess = currentCitiesData[cityIndex];
        document.getElementById('cityName').innerHTML = currentCityToGuess.name;
    }
    /* Le jeu s'arrête */
    else {
        endGame();
    }
}
function endGame(){

}

/* Script */

/* When #validateBtn is clicked */
document.querySelector('#validateBtn').addEventListener('click', () => createGame())


map.on('click', onMapClick);
/* document.getElementById("validate").disabled = true; */
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

