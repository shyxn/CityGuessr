
let slideAnimation;

function isOverflown(element) {
    return element.scrollWidth > element.clientWidth;
}

function slideCityName(slideAnimEl) {
    if (isOverflown(slideAnimEl)) {
        console.log("activation de l'animation")
        let gap = slideAnimEl.scrollWidth - slideAnimEl.clientWidth;
        slideAnimation = slideAnimEl.animate([
            // keyframes
            { transform: 'translateX(0)', offset: 0.1 },
            { transform: 'translateX(-' + gap + 'px)', offset: 0.4 },
            { transform: 'translateX(-' + gap + 'px)', offset: 0.6 },
            { transform: 'translateX(0)', offset: 0.9 }
        ], {
            // timing options
            duration: 7000,
            iterations: Infinity
        });
    }
}
slideCityName(document.getElementById("cityName"));

function changeTitle(newCityName) {
    slideAnimation.pause();
    var firstText = document.querySelector(".cityText");

    // Déclencher l'animation de shrink vers le haut
    firstText.classList.toggle('cityText-active');

    // Créer le prochain titre
    const nextText = document.createElement("p");
    nextText.appendChild(document.createTextNode(newCityName));
    nextText.classList.add('cityText');
    nextText.setAttribute('id', "cityName");
    nextText.style.position = "absolute";

    // Ajouter le prochain titre
    const container = document.getElementById("cityNameBlock");
    container.prepend(nextText);
    slideAnimEl = nextText;

    setTimeout(() => {
        // Supprimer l'ancien titre
        firstText.remove();
        nextText.style.position = "static";
        slideCityName(slideAnimEl);
    }, 200);
}

function animateCityInfos() {
    document.querySelectorAll('#yellowContent > p').forEach(label => {
        label.classList.add('infoLabel-active');
    })
    setTimeout(() => {
        document.querySelectorAll('#yellowContent > p').forEach(label => {
            label.classList.remove('infoLabel-active');
        })
    }, "310")

}


function animateCurrentScoreInfos() {
    document.querySelectorAll('#currentScoreBlock > p').forEach(label => {
        label.classList.add('infoLabel-active');
    })
    setTimeout(() => {
        document.querySelectorAll('#currentScoreBlock > p').forEach(label => {
            label.classList.remove('infoLabel-active');
        })
    }, "310")
}
