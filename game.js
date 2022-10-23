/* Variables */

let allCitiesCoordinates = {};
let currentCityToGuess = null;
let currentCityLatLng = null;
let cityIndex = 0;
let progression = 0;
let totalScore = 0;
let currentScore = 0;
let isGuessing = false;
let maxScoreBound = 300;
let minScoreBound = 10;


let guessBtn = document.getElementById('guessBtn');
let infoSectionElements = {
    cityName: document.getElementById('cityName'),
    cityPostalCode: document.getElementById('cityPostalCode'),
    cityCoordinates: document.getElementById('cityCoordinates'),
    cityHabitants: document.getElementById('cityHabitants'),
    cityDepartment: document.getElementById('cityDepartment'),
    distanceGuessed: document.getElementById('distanceGuessed'),
    addedScore: document.getElementById('addedScore')
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
    console.log(currentCityLatLng);
    return (latlngGuess.distanceTo(currentCityLatLng) / 1000).toFixed(2);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));


function onMapClick(e) {
    if (isGuessing) {

        /* Supprimer le marqueur précédent */
        if (playerMarker !== null) playerMarker.remove();

        /* Afficher le marqueur à l'endroit du clic */
        playerMarker = L.marker(e.latlng, {
            icon: guessPinIcon
        }).addTo(map);

        /* Activer le bouton de validation */
        guessBtn.disabled = false;
    }
}

const guessBtnClick = () => isGuessing ? endTurn() : startNewTurn();


function createGame() {
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

    /* Nettoyer affichages */
    if (playerMarker !== null) playerMarker.remove();
    if (answerMarker !== null) answerMarker.remove();
    Object.values(infoSectionElements).forEach((value, index) => value.innerHTML = " ")
    infoSectionElements.addedScore.style.color = "white";



    if (cityIndex < currentCitiesData.length) {
        console.log(infoSectionElements);
        currentCityToGuess = currentCitiesData[cityIndex];
        changeTitle(currentCityToGuess.name);
        currentCityLatLng = L.latLng(parseFloat(currentCityToGuess.latitude.toString().replace(',', '.')), parseFloat(currentCityToGuess.longitude.toString().replace(',', '.')));


        isGuessing = true;
        guessBtn.removeEventListener('click', startNewTurn);

    }
    /* Le jeu s'arrête */
    else {
        endGame();
    }
}

function endTurn() {
    /* Afficher les infos de la ville */
    infoSectionElements.cityPostalCode.innerHTML = (currentCityToGuess.postalCode.toString().length == 4 ? "0" : '') + currentCityToGuess.postalCode;
    infoSectionElements.cityCoordinates.innerHTML = currentCityToGuess.latitude.toString().replace(',', '.') + ", " + currentCityToGuess.longitude.toString().replace(',', '.');
    infoSectionElements.cityHabitants.innerHTML = currentCityToGuess.hab2012.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " habitants";

    if (currentCityToGuess.departmentNumber == "") { currentCityToGuess.departmentNumber = 20 }
    let currentDepartment = departmentsList.filter(dep => dep.depNumber == currentCityToGuess.departmentNumber)[0];
    let depDenom = (el) => {
        switch (el) {
            case "L":
                return "de l'";
            case "P":
                return "des ";
            case "M":
                return "du ";
            case "F":
                return "de la ";
            case "N":
                return "de ";
        }
    };

    infoSectionElements.cityDepartment.innerHTML = "Département " + depDenom(currentDepartment.depDenom) + currentDepartment.depName + " (" + currentDepartment.depNumber + ")";
    animateCityInfos();
    setTimeout(() => {
        /* Calculate distance */
        let distanceGuessed = calculateDistance(playerMarker.getLatLng());
        infoSectionElements.distanceGuessed.innerHTML = distanceGuessed + " km";

        /* Calculate score */
        distanceGuessed = Math.floor(distanceGuessed);
        currentScore = distanceGuessed <= minScoreBound ? maxScoreBound : maxScoreBound - distanceGuessed;
        if (currentScore < 0) { currentScore = 0 }
        totalScore += currentScore;

        /* Display scores */
        infoSectionElements.addedScore.innerHTML = "+" + currentScore + " pts";
        scoreSectionElements.scoreInfo.innerHTML = "Score : " + totalScore;

        if (currentScore == maxScoreBound) {
            infoSectionElements.addedScore.style.color = "var(--yellow)";
        }
        animateCurrentScoreInfos();
    }, "20")


    /* Afficher le pin réponse */
    answerMarker = L.marker(currentCityLatLng, {
        icon: answerPinIcon
    }).addTo(map);

    isGuessing = false;

    cityIndex++;

    /* Actualiser la progression */
    progression = cityIndex / currentCitiesData.length;
    scoreSectionElements.progression.innerHTML = cityIndex + " / " + currentCitiesData.length + " villes"
    scoreSectionElements.progressionPercentage.innerHTML = (progression * 100).toFixed(2) + " %";
    document.getElementById('progressionBlock').style.width = progression * 100 + "%";


}
function endGame() {
    console.log("La partie se termine.");
}

/* Script */

/* When #validateBtn is clicked */
document.querySelector('#validateBtn').addEventListener('click', () => createGame())
guessBtn.addEventListener('click', guessBtnClick);
guessBtn.disabled = true;
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

