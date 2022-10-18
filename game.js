/* Variables */

let allCitiesCoordinates = {};
let currentCityToGuess = null;
let currentCityLatLng = null;
let cityIndex = 0;
let progression = 0;


let guessBtn = document.getElementById('guessBtn');
let infoSectionElements = {
    cityName: document.getElementById('cityName'),
    cityPostalCode: document.getElementById('cityPostalCode'),
    cityCoordinates: document.getElementById('cityCoordinates'),
    cityHabitants: document.getElementById('cityHabitants'),
    cityDepartment: document.getElementById('cityDepartment'),
    distanceGuessed: document.getElementById('distanceGuessed'),   
}
let scoreSectionElements = {
    scoreInfo: document.getElementById('scoreInfo'),
    progression: document.getElementById('progression'),
    progressionPercentage: document.getElementById('progressionPercentage')
}


let playerMarker = null;
let answerMarker = null;


/* Functions */

function calculateDistance(latlngGuess) {
    return latlngGuess.distanceTo(L.latLng((currentCityToGuess.latitude, currentCityToGuess.longitude))) / 1000;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));


function onMapClick(e) {
    /* Supprimer le marqueur précédent */
    if (playerMarker !== null) playerMarker.remove();

    /* Afficher le marqueur à l'endroit du clic */
    playerMarker = L.marker(e.latlng, {
        icon: guessPinIcon
    }).addTo(map);

    /* Activer le bouton de validation */
    guessBtn.disabled = false;
}


function createGame(){
    console.log("Création de la partie...");
    /* Cacher les éléments dans blueBlock */
    document.getElementById('gameModeChoices').style.display = "none";
    document.getElementById('blueBlock').style.width = "300px"
    /* Randomiser currentCitiesData */
    currentCitiesData.sort(() => Math.random() - 0.5);
    console.log(currentCitiesData);
    startNewTurn();
    console.log("La partie a été créée. Commencement du premier tour avec", currentCityToGuess.name);
}

function startNewTurn() {

    if (cityIndex <= currentCitiesData.length) {
        console.log(infoSectionElements);
        Object.values(infoSectionElements).forEach((value, index) => value.innerHTML = " ")
        currentCityToGuess = currentCitiesData[cityIndex];
        infoSectionElements.cityName.innerHTML = currentCityToGuess.name;
        scoreSectionElements.progression.innerHTML = cityIndex + " / " + currentCitiesData.length + " villes"
        progression = cityIndex / currentCitiesData.length;
        scoreSectionElements.progressionPercentage.innerHTML = (progression * 100) + " %";
        map.on('click', onMapClick);
    }
    /* Le jeu s'arrête */
    else {
        endGame();
    }
}

function endTurn() {
    /* Afficher les infos de la ville */
    infoSectionElements.cityPostalCode.innerHTML = currentCityToGuess.postalCode;
    infoSectionElements.cityCoordinates.innerHTML = currentCityToGuess.latitude + " " + currentCityToGuess.longitude;
    infoSectionElements.cityHabitants.innerHTML = currentCityToGuess.hab2012 + " habitants";
    /* Calculate distance */
    infoSectionElements.distanceGuessed.innerHTML = calculateDistance(playerMarker.getLatLng())
    /* Afficher le pin réponse */
    answerMarker = L.marker(e.latlng, {
        icon: guessPinIcon
    }).addTo(map);

}
function endGame(){

}

/* Script */

/* When #validateBtn is clicked */
document.querySelector('#validateBtn').addEventListener('click', () => createGame())
guessBtn.addEventListener('click', () => endTurn())
guessBtn.disabled = true;


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

