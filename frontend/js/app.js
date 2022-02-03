const app = {
    // api's url without endpoint
    apiUrl: 'http://localhost:8080',

    // select videogames element
    selectVideogameElement: document.querySelector('#videogameId'),

    init: function () {
        console.log('app.init()');

        // methods to add every eventlistener to our dom elements
        app.addAllEventListeners();

        // retrieving all videogames from db
        app.loadVideoGames();
    },


    // ####################################################################
    //                              EVENTS
    // ####################################################################

    addAllEventListeners: function () {
        // event listener on "change", with app.handleVideogameSelected callback function
        app.selectVideogameElement.addEventListener('change', app.handleVideogameSelected)
        // add a videogame button
        const addVideogameButtonElement = document.getElementById('btnAddVideogame');
        // eventlistener on click
        addVideogameButtonElement.addEventListener('click', app.handleClickToAddVideogame);
        // add a videogame form selection
        addVideogameFormElement = document.querySelector('#addVideogameForm');
        // eventistener on form submission
        addVideogameFormElement.addEventListener('submit', app.handleFormSubmit);
    },

    handleFormSubmit: function (event) {
        event.preventDefault();
        const newVideogameFormElement = event.currentTarget;
        const videogameTitleElement = newVideogameFormElement.querySelector('#inputName');
        const newVideogameTitle = videogameTitleElement.value;

        const videogameEditorElement = newVideogameFormElement.querySelector('#inputEditor');
        const newVideogameEditor = videogameEditorElement.value;

        const data = {
            "name": newVideogameTitle,
            "editor": newVideogameEditor,
        }

        console.log(data);

        const httpHeaders = new Headers();
        httpHeaders.append("Content-Type", "application/json");

        let config = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: httpHeaders,
            body: JSON.stringify(data)
        };

        fetch(app.apiUrl + "/videogames", config)
            .then(
                function (response) {
                    if (response.status == 201) {
                        $('#addVideogameModal').modal('hide');
                        alert('jeu vidéo ajouté');
                        return response.json();
                    }
                    else {
                        alert('le jeu n\'a pas été ajouté, veuillez renseigner les champs correctement');
                    }
                }
            )
            .then(
                function (newTaskObject) {
                    app.addVideoGameInList(newTaskObject);
                }
            )
    },

    handleVideogameSelected: function (evt) {
        // Récupérer la valeur du <select> (id du videogame)
        videoGameId = evt.target.selectedIndex;
        // Vider le contenu de div#review
        document.querySelector('#review').innerHTML = "";
        // charger les données pour ce videogame
        app.loadReviewFromApi(videoGameId);
    },

    handleClickToAddVideogame: function (evt) {
        // https://getbootstrap.com/docs/4.4/components/modal/#modalshow
        // jQuery obligatoire ici
        $('#addVideogameModal').modal('show');
    },


    // ####################################################################
    //                              AJAX
    // ####################################################################

    loadReviewFromApi: function (id) {
        // On prépare la configuration de la requête HTTP
        let config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        // 1 - Attaquer l'API
        fetch(app.apiUrl + '/videogames/' + id + '/reviews', config)
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
            // Template selection and cloning
            const newReviewTemplate = document.querySelector('#reviewTemplate');
            const newReviewElement = newReviewTemplate.content.firstElementChild.cloneNode(true);

            // Modification of the new element
            newReviewElement.querySelector('.reviewTitle').textContent = review.title;
            newReviewElement.querySelector('.reviewText').textContent = review.text;
            newReviewElement.querySelector('.reviewAuthor').textContent = review.author;
            newReviewElement.querySelector('.reviewPublication').textContent = review.publication_date;
            newReviewElement.querySelector('.reviewDisplay').textContent = review.display_note;
            newReviewElement.querySelector('.reviewGameplay').textContent = review.gameplay_note;
            newReviewElement.querySelector('.reviewScenario').textContent = review.scenario_note;
            newReviewElement.querySelector('.reviewLifetime').textContent = review.lifetime_note;
            
            newReviewElement.querySelector('.reviewVideogame').textContent = review.videogame.name;
            newReviewElement.querySelector('.reviewEditor').textContent = review.videogame.editor;
            newReviewElement.querySelector('.reviewPlatform').textContent = review.platform.name;

            divReviewElement.append(newReviewElement);
        }
    },

    // add videogames to the select element
    addVideogamesFromApi: function (videogamesFromApi) {
        for (const videogame of videogamesFromApi) {
            app.addVideoGameInList(videogame);
        }
    },

    addVideoGameInList: function (newVideogame) {
        optionElement = document.createElement('option');
        optionElement.value = newVideogame.id;
        optionElement.text = newVideogame.name;
        app.selectVideogameElement.append(optionElement);
    },
};

document.addEventListener('DOMContentLoaded', app.init);