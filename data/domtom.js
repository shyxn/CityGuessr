function selectGuadeloupeCities(container) {
    selectDOMTOMCities(container, 971)
}
function selectMartiniqueCities(container) {
    selectDOMTOMCities(container, 972)
}
function selectGuyaneCities(container) {
    selectDOMTOMCities(container, 973)
}
function selectLaReunionCities(container) {
    selectDOMTOMCities(container, 974)
}
function selectMayotteCities(container) {
    selectDOMTOMCities(container, 976)
}

function selectDOMTOMCities(container, domtomNb){
    allFrenchCities.forEach((item) => {
        if (item.departmentNumber == domtomNb) {
            container.push(item);
        }
    })
}