//url général de l'api
const url_general_api = "http://localhost:8000/api/v1/titles/";

// url pour avoir le meilleur film 
const url_meilleur_film = "http://localhost:8000/api/v1/titles/?page_size=1&sort_by=-imdb_score";

const url_sept_meilleur_film = "http://localhost:8000/api/v1/titles/?page_size=7&sort_by=-imdb_score";
const url_sept_meilleur_action = "http://localhost:8000/api/v1/titles/?page_size=7&sort_by=-imdb_score&genre=action";
const url_sept_meilleur_romance = "http://localhost:8000/api/v1/titles/?page_size=7&sort_by=-imdb_score&genre=romance";
const url_meilleur_sci_fi = "http://localhost:8000/api/v1/titles/?page_size=7&sort_by=-imdb_score&genre=Sci-Fi";
// petite finction permettant de créer une div avec un nom de class
function create_div(className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div;
};
// creation de la fenétre modal
function construction_modal(url) {
    fetch(url)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(film) {
            document.getElementById("modal").style.display = "block";
            document.getElementById("img_modal").src = film.image_url
            document.getElementById("titre").innerHTML = film.title
            document.getElementById("genre").innerHTML = "genre : " + film.genres
            document.getElementById("date").innerHTML = "date de sorti : " + film.date_published
            document.getElementById("note").innerHTML = "note : " + film.votes + " points"
            document.getElementById("score").innerHTML = "score imdb : " + film.imdb_score
            document.getElementById("real").innerHTML = "realisateur : " + film.writers
            document.getElementById("acteurs").innerHTML = "acteurs : " + film.actors
            document.getElementById("dure").innerHTML = "durée : " + film.duration + " minutes"
            document.getElementById("pays").innerHTML = "pay de création : " + film.countries
            document.getElementById("boxoffice").innerHTML = " box office : " + film.worldwide_gross_income + " $"
            document.getElementById("resumer").innerHTML = "resumer : " + film.long_description
            let span = document.getElementsByClassName("close")[0];
            span.onclick = function() {
                modal.style.display = "none";
            }
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        })
};
//partie qui permet de récupérer les information du meilleur film de les ajouter  et de créer son modal
function meilleur_film(url) {
    fetch(url)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(data) {
            let meilleur_film = data.results[0]
            let url = meilleur_film.url
            let img = meilleur_film.image_url
            let titre = meilleur_film.title
            let img_tag = document.getElementById("best_film")
            let meilleur_titre = document.getElementById("best_moovie_title")
            meilleur_titre.innerHTML = titre
            img_tag.src = img
            img_tag.addEventListener("click", function() {
                construction_modal(url)
            })
        })
};
//lancement de la fonction permettant de créer les carouselle pour chaque chaque cathégorie
function main() {
    meilleur_film(url_meilleur_film);
    carrousel(url_sept_meilleur_film, "carousel1");
    carrousel(url_sept_meilleur_action, "carousel2");
    carrousel(url_sept_meilleur_romance, "carousel3");
    carrousel(url_meilleur_sci_fi, "carousel4");
}
// fonction créant un carousell pour chaque films des cathérie selectionner 
function carrousel(api_url, id) {
    fetch(api_url)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(data) {
            let result = data.results;
            let ratio = result.length / 3;
            let caroussel = document.getElementById(id);
            let parent = caroussel.parentNode
            caroussel.style.width = (ratio * 100) + "%";
            let next_button = create_div("next")
            let prev_button = create_div("prev")
            parent.appendChild(next_button)
            parent.appendChild(prev_button)
                // pour chaque film  on crée une div dans laquel on ajout un élément image 
            result.forEach(elements => {
                let url = elements.url
                let item = create_div("item")
                    //on ajoute le lien de l'image dans l'élément on 
                item.innerHTML = "<img src='" + elements.image_url + "'>";
                item.style.width = (100 / 4 / ratio) + "%"
                caroussel.appendChild(item)
                    // pour chaque film on lance la fonction de création du modal le lien de la page du film en paramétre
                item.addEventListener("click", function() {
                    construction_modal(url)
                })
            })
            var current_item = 0
            var item_to_scroll = 1
                //bouton du carousel permettant de scroll les items
            next_button.addEventListener('click', function() {
                // condition qui vérifie ou on en est dans le carousel si on est à la fin alors on retourne au début
                if (current_item > (result.length - ratio)) {
                    current_item = -1
                }
                let i = current_item + item_to_scroll
                let translateX = i * -100 / result.length
                caroussel.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
                current_item = i
            })
            prev_button.addEventListener('click', function() {
                // condition qui vérifie ou on en est dans le carousel si on est au début alors on va à la fin
                if (current_item <= 0) {
                    current_item = parseInt(result.length - ratio)
                }
                let i = current_item - item_to_scroll
                let translateX = i * -100 / result.length
                caroussel.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
                current_item = i
            })
        })
};

main()