const app = {
    // URL de l'API (sans le endpoint)
    apiUrl: 'http://localhost:8080',

    videoGameId: null,

    init: function () {
        console.log('app.init()');

        // On appelle la méthode s'occupant d'ajouter les EventListener sur les éléments déjà dans le DOM
        app.addAllEventListeners();

        // On appelle la méthode s'occupant de charger tous les jeux vidéo
        //app.loadVideoGames();

        //app.loadReviewFromApi();
    },


    // ####################################################################
    //                              EVENTS
    // ####################################################################

    addAllEventListeners: function () {
        // On récupère l'élément <select> des jeux vidéo
        selectVideogameElement = document.querySelector('#videogameId');
        // On ajoute l'écouteur pour l'event "change", et on l'attache à la méthode app.handleVideogameSelected
        selectVideogameElement.addEventListener('change', app.handleVideogameSelected)
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
        fetch(app.apiUrl + '/reviews' , config)
            .then(function (apiResponse) {
                return apiResponse.json();
            })
            .then(app.addReviewFromApi);
    },

    loadSingleVideoGame: function (id) {
        // Charger toutes les données des videogames
        // Ajouter une balise <option> par videogame

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
            .then(function(videogame) {
                console.log(videogame);
            });
            return videogame;
    },

    addVideogameFromApi: function (videogame) {
    },


    // ####################################################################
    //                              DOM
    // ####################################################################

    addReviewFromApi: function (reviewFromApi) {
        divReviewElement = document.querySelector('#review');
        for (const review of reviewFromApi) {
            if (review.videogame_id === videoGameId) {
                console.log(review);
                const newReviewTemplate = document.querySelector('#reviewTemplate');
                const newReviewElement = newReviewTemplate.content.firstElementChild.cloneNode(true);
                divReviewElement.append(newReviewElement);
            }
        }
    },
};

document.addEventListener('DOMContentLoaded', app.init);