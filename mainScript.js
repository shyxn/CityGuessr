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
let departmentCitiesNb = 0;

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


// Vérifie si la ville n'est pas déjà présente avant de l'ajouter, pour éviter les doublons
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
    i = 0;
    while (mostPopulatedCitiesNb < x) {
        if (allFrenchCities[i].departmentNumber < 100) {
            addCity(allFrenchCities[i], container);
            mostPopulatedCitiesNb++;
        }
        i++;
    }
}

function selectDepartment(container, departmentNumber) {
    departmentCitiesNb = 0;
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


function selectCities() {
    currentCitiesData = [];
    let checkedModes = document.querySelectorAll('input[name="gameMode"]:checked');
    console.log(checkedModes);
    checkedModes.forEach(checkInput => {
        switch (checkInput.value) {
            case "prefectures":
                selectPrefectures(currentCitiesData);
                break;
            case "subprefectures":
                selectSubPrefectures(currentCitiesData);
                break;
            case "habs50k":
                select50kCities(currentCitiesData);
                break;
            case "habs30k":
                select30kCities(currentCitiesData);
                break;
            case "mostPopulated":
                let number = document.querySelector("#nbOfMostPopulated").value;
                selectXMostPopulated(currentCitiesData, number);
                break;
            case "allCities":
                selectAllCities(currentCitiesData);
                break;
            case "oneDepartment":
                break;
            default:
                break;
        }
    });
    const nbOfSelectedCities = currentCitiesData.length;
    document.querySelector('#citiesCount').innerHTML = nbOfSelectedCities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ville' + (nbOfSelectedCities > 0 ? 's' : '');
    document.querySelector('#validateBtn').disabled = false;
    if (nbOfSelectedCities == 0) { 
        document.querySelector('#validateBtn').disabled = true;
    }
}

function resetCheckboxes() {
    document.querySelectorAll('input[type="checkbox"][name="gameMode"]').forEach(checkbox => {
        checkbox.removeAttribute('disabled');
        checkbox.checked = false;
    });
    document.querySelectorAll('#nbOfMostPopulated, #subprefectures').forEach(el => { el.setAttribute('disabled', ''); });
    document.querySelectorAll('#nbOfMostPopulated').value = "";
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
resetCheckboxes();
document.querySelector('#validateBtn').disabled = true;


/* Exclure #habs50k, #habs30k, #mostPopulated */
let modeChoices = document.querySelectorAll('#habs50k, #habs30k, #mostPopulated');

modeChoices.forEach(choice => {
    choice.addEventListener('click', function () {
        if (this.checked) {
            document.querySelector("#nbOfMostPopulated").setAttribute('disabled', "");
            modeChoices.forEach(otherChoice => {
                if (this !== otherChoice) {
                    otherChoice.checked = false;
                    otherChoice.removeAttribute('disabled');
                }
            });
        }
    });
});
/* Cocher aussi les villes > 50k habs si 30k est sélectionné */
document.querySelector("#habs30k").addEventListener('click', function () {
    let habs50kChoice = document.querySelector('#habs50k');
    if (this.checked) {
        habs50kChoice.checked = true;
        habs50kChoice.setAttribute('disabled', '');
    }
    else {
        habs50kChoice.checked = false;
        habs50kChoice.removeAttribute('disabled');
    }
});


/* Exclure #allCities de tous les autres */
document.querySelector("#allCities").addEventListener('click', function () {
    let allChoices = document.querySelectorAll('input[name="gameMode"]');
    if (!this.checked) {
        resetCheckboxes();
    }
    else {
        allChoices.forEach(choice => {
            if (this !== choice) {
                choice.checked = false;
                choice.setAttribute('disabled', '');
            }
        })
    }
});

/* Activer/désactiver la sous-option "Sous-préfectures" */
document.querySelector("#prefectures").addEventListener('click', function () {
    /* Récupérer la checkbox + le label */
    let subprefecturesChoice = document.querySelectorAll('#subprefectures, label[for="subprefectures"]');
    /* Apparaître */
    if (this.checked) {
        subprefecturesChoice.forEach(el => el.removeAttribute('disabled'));
        /* Cacher */
    } else {
        subprefecturesChoice.forEach(el => el.checked = false);
        subprefecturesChoice.forEach(el => el.setAttribute('disabled', ''));
    }
});

/* Activer/désactiver le input number */
document.querySelector('#mostPopulated').addEventListener('click', function () {
    let input = document.querySelector("#nbOfMostPopulated");
    if (this.checked) {
        input.removeAttribute('disabled');
    }
    else {
        input.setAttribute('disabled', '');
    }
})

/* Exclusions des choix */

document.querySelectorAll('input[type="checkbox"][name="gameMode"]').forEach(checkbox => {
    checkbox.addEventListener('click', function () {
        selectCities();
    });
})




/* Désactiver element */
button.setAttribute("disabled", "");

/* Valeur d'un input */
document.querySelector("input").value;

/* Obtenir la valeur d'un checkbox */
document.getElementById('send').checked;

/* Obtenir la valeur de radiobuttons */
document.querySelector('input[name="genderS"]:checked').value;


