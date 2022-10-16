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

// Array des villes sélectionnées pour le jeu
let currentCitiesData = [];

// === Functions ===

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
        // Sélectionner la ville qui a le plus grand nombre d'habitants de tous, parmi des doublons.
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
        // Sélectionner la ville qui a le plus grand nombre d'habitants de tous, parmis des doublons.
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

/* function selectDepartment(container, departmentNumber) {
    departmentCitiesNb = 0;
    for (let i = 0; i < x; i++) {
        if (allFrenchCities[i].departmentNumber == departmentNumber) {
            addCity(allFrenchCities[i], container);
            departmentCitiesNb++;
        }
    }
} */

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
            /* case "oneDepartment":
                break; */
            default:
                break;
        }
    });
    /* Actualisation du label indiquant le nombre de villes choisies */
    const nbOfSelectedCities = currentCitiesData.length;
    document.querySelector('#citiesCount').innerHTML = nbOfSelectedCities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ville' + (nbOfSelectedCities > 0 ? 's' : '');

    /* Button enabling/disabling */
    document.querySelector('#validateBtn').disabled = false;
    document.querySelector('#citiesCount').style.opacity = 1;
    if (nbOfSelectedCities == 0) {
        document.querySelector('#validateBtn').disabled = true;
        document.querySelector('#citiesCount').style.opacity = 0.5;
    }
}

function resetCheckboxes() {
    document.querySelectorAll('input[type="checkbox"][name="gameMode"]').forEach(checkbox => {
        checkbox.removeAttribute('disabled');
        checkbox.checked = false;
    });
    document.querySelectorAll('#nbOfMostPopulated, #subprefectures').forEach(el => { el.setAttribute('disabled', ''); });
    document.querySelector('#nbOfMostPopulated').value = '';
    document.querySelector('#validateBtn').disabled = true;
    document.querySelector('#citiesCount').style.opacity = 0.5;
}

// === Script ===

/* for (let index = 0; index < allCities.length; index++) {
    setCoordinates(allCities[index]);   
} */

// == Set form & layouts ==

var map = L.map('map').setView(mapStartLatLng, 6);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 15
}).addTo(map);
L.DomUtil.addClass(map._container, 'crosshair-cursor-enabled');

resetCheckboxes();

/* == Comportements du form == */

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
    let subprefecturesChoice = document.querySelector('#subprefectures');
    /* Apparaître */
    subprefecturesChoice.disabled = !this.checked;
    /* Cacher */
    if (!this.checked) {
        subprefecturesChoice.checked = false;
    }
});

/* Activer/désactiver le input number */
document.querySelector('#mostPopulated').addEventListener('click', function () {
    document.querySelector("#nbOfMostPopulated").disabled = !this.checked;
})

/* Actualisation à chaque frappe de l'input number */
document.querySelector('#nbOfMostPopulated').addEventListener('input', () => selectCities());

/* Actualisation à chaque clic */
document.querySelectorAll('input[type="checkbox"][name="gameMode"]').forEach(checkbox => {
    checkbox.addEventListener('click', function () {
        selectCities();
    });
})

