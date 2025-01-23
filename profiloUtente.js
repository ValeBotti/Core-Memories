var key = Object.keys(sessionStorage)[0];
var infoUtenteObj = JSON.parse(sessionStorage.getItem(key));

/*gestire la visualizzazione dei profili di altri utenti*/
const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('utente');

function showUserInfo() {

    if (user) {
        infoUtenteObj = JSON.parse(localStorage.getItem(user));
        var tabelle = document.getElementById('tabellePlaylist');
        tabelle.innerHTML = "";
        var eliminaProfiloBottone = document.getElementById('eliminaProfilo');
        eliminaProfiloBottone.innerHTML = "";
        var modificaProfiloBottone = document.getElementById('modificaProfilo');
        modificaProfiloBottone.innerHTML = "";
    }

    //gestione dati personali utente
    //fills the table with the content in the session storage
    document.getElementById("nome").textContent = infoUtenteObj[0]['nome'];
    document.getElementById("email").textContent = infoUtenteObj[0]['email'];
    document.getElementById("password").textContent = infoUtenteObj[0]['password'];

    var stringArtisti = infoUtenteObj[0]["artisti preferiti"].join(", ");
    var stringGeneri = infoUtenteObj[0]["generi preferiti"].join(", ");

    document.getElementById("artisti_preferiti").textContent = stringArtisti;
    document.getElementById("generi_preferiti").textContent = stringGeneri;
}

//visualizzazione playlist utente
var nomePlaylistCorrente = "";

function fillTable(infoUtenteObj) {
    const nomePlaylist = infoUtenteObj.playlistUtente[0]['nome playlist'];

    document.getElementById('buttonModifica').innerHTML += `<a href="modificaPlaylist.html?playlistDaModificare=${nomePlaylist}" class="btn btn-outline-warning">modifica playlist</a>`;
    
    if (infoUtenteObj.playlistUtente[0].playlist_pubblica) {
        document.getElementById('buttonModifica').innerHTML = "";
    }

    const descrizionePlaylist = infoUtenteObj.playlistUtente[0]['descrizione playlist'];
    const tags = infoUtenteObj.playlistUtente[0]['tags'];
    const arrayTracks = infoUtenteObj.playlistUtente[0]['tracce'];

    nomePlaylistCorrente = nomePlaylist;

    document.getElementById('nomePlaylist').textContent = nomePlaylist;
    document.getElementById('descrizionePlaylist').textContent = descrizionePlaylist;
    document.getElementById('tagsPlaylist').textContent = tags;
    fillTrackInformations(arrayTracks);
}

var campiTracce = document.getElementById('tracce');

function fillTrackInformations(arrayTracks) {
    campiTracce.style.display = "block";
    arrayTracks.forEach(element => {
        campiTracce.innerHTML += `<td style="width: 250px">${element['nome']}</td><td style="width: 250px">${element['artista']}</td><td style="width: 250px">${element['durata']}</td><td style="width: 250px">${element['data_pubblicazione']}</td>`;
    });     
}

//fills the playlist teble
if (infoUtenteObj.length == 1) {
    var div = document.getElementById('divTabella');
    div.style.display = "block";
    div.innerHTML = "";

    var alert = document.getElementById('alertCreaPlaylist');
    alert.style.display = "block";
    alert.innerHTML = alert.innerHTML + "<h5>Com'è vuoto! Crea una tua playlist!</h5>" + '<a href="creaPlaylist.html" class="btn btn-primary btn-lg btn-block btn btn-success bottone_crea">crea</a>';

} else if (infoUtenteObj.length == 2)  {
    fillTable(infoUtenteObj[1]);
    document.getElementById('successivaDiv').innerHTML = "";
} else {
    fillTable(infoUtenteObj[1]);
}


//on click change the content of the table

let numeroPlaylist = 1;

function changeContent() {
    document.getElementById('buttonModifica').innerHTML = "";
    campiTracce.innerHTML = `<td style="width: 250px; font-weight: bold;">titolo</td><td style="width: 250px; font-weight: bold;">artista</td><td style="width: 250px; font-weight: bold;">durata</td><td style="width: 250px; font-weight: bold;">data di pubblicazione</td>`;;
    if (document.getElementById('successiva').textContent == "playlist successiva >") {
        numeroPlaylist++;
        loadNextPlayList(numeroPlaylist, "piu");
    } else if (document.getElementById('successiva').textContent == "< playlist precedente") {
        numeroPlaylist--;
        loadPreviousPlayList(numeroPlaylist);
    }
}

function loadNextPlayList() {
    if (numeroPlaylist == infoUtenteObj.length -1) {
        document.getElementById('successiva').textContent = "< playlist precedente";
        fillTable(infoUtenteObj[numeroPlaylist]);
    } else {
        fillTable(infoUtenteObj[numeroPlaylist]);
    }
}

function loadPreviousPlayList() {
    if (numeroPlaylist <= 1) {
        document.getElementById('successiva').textContent = "playlist successiva >";
        fillTable(infoUtenteObj[numeroPlaylist]);
    } else {
        fillTable(infoUtenteObj[numeroPlaylist]);
    }
}

/*cancella playlist utente*/

function erasePlaylist() {
    if (nomePlaylistCorrente != "") {
        infoUtenteObj.slice(1).forEach(element => {
            if (element.playlistUtente[0]['nome playlist'] == nomePlaylistCorrente) {
                console.log(element.playlistUtente[0]['nome playlist']);
                const updatedArray = infoUtenteObj.filter(elementA => elementA !== element);

                localStorage.setItem(key, JSON.stringify(updatedArray));
                sessionStorage.setItem(key, JSON.stringify(updatedArray));
            }
        }); 
    }
}

/*eliminare il profilo utente*/
function eraseMyProfile() {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
}