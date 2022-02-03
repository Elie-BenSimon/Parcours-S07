const app = {
    // URL de l'API (sans le endpoint)
    apiUrl: 'http://localhost:8080',

    videoGameId: null,

    // On récupère l'élément <select> des jeux vidéo
    selectVideogameElement: document.querySelector('#videogameId'),

    init: function () {
        console.log('app.init()');

        // On appelle la méthode s'occupant d'ajouter les EventListener sur les éléments déjà dans le DOM
        app.addAllEventListeners();

        // On appelle la méthode s'occupant de charger tous les jeux vidéo
        app.loadVideoGames();

        //app.loadReviewFromApi();
    },


    // ####################################################################
    //                              EVENTS
    // ####################################################################

    addAllEventListeners: function () {
        // On ajoute l'écouteur pour l'event "change", et on l'attache à la méthode app.handleVideogameSelected
        app.selectVideogameElement.addEventListener('change', app.handleVideogameSelected)
        // On récupère le bouton pour ajouter un jeu vidéo
        const addVideogameButtonElement = document.getElementById('btnAddVideogame');
        // On ajoute l'écouteur pour l'event "click"
        addVideogameButtonElement.addEventListener('click', app.handleClickToAddVideogame);

        // TODO
    },

    handleVideogameSelected: function (evt) {
        // Récupérer la valeur du <select> (id du videogame)
        videoGameId = evt.target.selectedIndex;
        // Vider le contenu de div#review
        document.querySelector('#review').innerHTML = "";
        // charger les données pour ce videogame
        app.loadReviewFromApi();
        //console.log(videogameDomElement);
        // Dupliquer la template #reviewTemplate et personnaliser son contenu avec les données

        // Ajouter dans le DOM
    },

    handleClickToAddVideogame: function (evt) {
        // https://getbootstrap.com/docs/4.4/components/modal/#modalshow
        // jQuery obligatoire ici
        $('#addVideogameModal').modal('show');
    },


    // ####################################################################
    //                              AJAX
    // ####################################################################

    loadReviewFromApi: function () {
        // On prépare la configuration de la requête HTTP
        let config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        // 1 - Attaquer l'API
        fetch(app.apiUrl + '/reviews', config)
            .then(function (apiResponse) {
                return apiResponse.json();
            })
            .then(app.addReviewFromApi);
    },

    loadSingleVideoGame: function (id) {
        // On prépare la configuration de la requête HTTP
        let config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        // 1 - Attaquer l'API
        fetch(app.apiUrl + '/videogames/' + id, config)
            .then(function (apiResponse) {
                return apiResponse.json();
            })
            .then(function (videogame) {
                console.log(videogame);
            });
        return videogame;
    },

    loadVideoGames: function () {
        // On prépare la configuration de la requête HTTP
        let config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        // 1 - Attaquer l'API
        fetch(app.apiUrl + '/videogames', config)
            .then(function (apiResponse) {
                return apiResponse.json();
            })
            .then(app.addVideogamesFromApi);
    },


    // ####################################################################
    //                              DOM
    // ####################################################################

    addReviewFromApi: function (reviewFromApi) {
        // Selection of div review's container
        divReviewElement = document.querySelector('#review');

        for (const review of reviewFromApi) {
            // if the review belong to the selected videogame, we add it to the dom
            if (review.videogame_id === videoGameId) {
                // Template selection and modification
                const newReviewTemplate = document.querySelector('#reviewTemplate');
                const newReviewElement = newReviewTemplate.content.firstElementChild.cloneNode(true);
                newReviewElement.querySelector('.reviewTitle').textContent = review.title;
                newReviewElement.querySelector('.reviewText').textContent = review.text;
                newReviewElement.querySelector('.reviewAuthor').textContent = review.author;
                newReviewElement.querySelector('.reviewPublication').textContent = review.publication_date;
                newReviewElement.querySelector('.reviewDisplay').textContent = review.display_note;
                newReviewElement.querySelector('.reviewGameplay').textContent = review.gameplay_note;
                newReviewElement.querySelector('.reviewScenario').textContent = review.scenario_note;
                newReviewElement.querySelector('.reviewLifetime').textContent = review.lifetime_note;

                divReviewElement.append(newReviewElement);
            }
        }
    },

    // add videogames to the select element
    addVideogamesFromApi: function (videogamesFromApi) {
        for (const videogame of videogamesFromApi) {
            optionElement = document.createElement('option');
            optionElement.value = videogame.id;
            optionElement.text = videogame.name;
            app.selectVideogameElement.append(optionElement);
        }
    }
};

document.addEventListener('DOMContentLoaded', app.init);