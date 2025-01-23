//recupero playlist pubbliche e informazioni utente
var public_playlists = JSON.parse(localStorage.getItem('playlist_pubbliche'));
var key = Object.keys(sessionStorage)[0];
var infoUtenteObj = JSON.parse(sessionStorage.getItem(key));


//visualizzazione playlist utente in tabella
function fillTable(public_playlists) {
    const nomePlaylist = public_playlists.playlistUtente[0]['nome playlist'];
    const descrizionePlaylist = public_playlists.playlistUtente[0]['descrizione playlist'];
    const tags = public_playlists.playlistUtente[0]['tags'];
    const arrayTracks = public_playlists.playlistUtente[0]['tracce'];

    document.getElementById('nomePlaylist').textContent = nomePlaylist;
    document.getElementById('descrizionePlaylist').textContent = descrizionePlaylist;
    document.getElementById('tagsPlaylist').textContent = tags;
    fillTrackpublic_playlists(arrayTracks);
}

var campiTracce = document.getElementById('tracce');

function fillTrackpublic_playlists(arrayTracks) {
    campiTracce.style.display = "block";
    arrayTracks.forEach(element => {
        campiTracce.innerHTML += `<td style="width: 250px">${element['nome']}</td><td style="width: 250px">${element['artista']}</td><td style="width: 250px">${element['durata']}</td><td style="width: 250px">${element['data_pubblicazione']}</td>`;
    });     
}

fillTable(public_playlists[0]);

//on click cambia il contenuto della tabella
let numeroPlaylist = 0;

function changeContent() {
    campiTracce.innerHTML = `<td style="width: 250px; font-weight: bold;">titolo</td><td style="width: 250px; font-weight: bold;">artista</td><td style="width: 250px; font-weight: bold;">durata</td><td style="width: 250px; font-weight: bold;">data di pubblicazione</td>`;;
    if (document.getElementById('successiva').textContent == "playlist successiva >") {
        numeroPlaylist++;
        loadNextPlayList();
    } else if (document.getElementById('successiva').textContent == "< playlist precedente") {
        numeroPlaylist--;
        loadPreviousPlayList();
    }
}

function loadNextPlayList() {
    if (numeroPlaylist == public_playlists.length -1) {
        document.getElementById('successiva').textContent = "< playlist precedente";
        fillTable(public_playlists[numeroPlaylist]);
    } else {
        fillTable(public_playlists[numeroPlaylist]);
    }
}

function loadPreviousPlayList() {
    if (numeroPlaylist < 1) {
        document.getElementById('successiva').textContent = "playlist successiva >";
        fillTable(public_playlists[numeroPlaylist]);
    } else {
        fillTable(public_playlists[numeroPlaylist]);
    }
}

//gestione del salvataggio della playlist (on click)
function savePlaylistInUserProfile() {
    var namePlaylistToAdd = document.getElementById('nomePlaylist').textContent;

    public_playlists.forEach(playlist => {
        if (JSON.stringify(playlist).includes(namePlaylistToAdd)) {
            if (!sessionStorage.getItem(key).includes(JSON.stringify(playlist))) {
                infoUtenteObj.push(playlist);
                sessionStorage.setItem(key, JSON.stringify(infoUtenteObj));
                localStorage.setItem(key, JSON.stringify(infoUtenteObj));
                hanldeAlertPlaylistSaved();
            } else {
                hanldeAlertCannotSave();
            }
        }
    });
}

function hanldeAlertCannotSave() {
  var alert = document.getElementById('alertAggiunta');
  alert.style.display = "block";
  alert.innerHTML = "<p>Hai già questa playlist salvata</p>"
}

function hanldeAlertPlaylistSaved() {
    var alert = document.getElementById('alertHaiSalvatoPlaylist');
    alert.style.display = "block";
    alert.innerHTML = "<p>Playlist salvata</p>"  
}

//gestione visualizzazione profili di altri utenti (dropdown)
function insertUsers() {
    const kaeyUsersArray = Object.keys(localStorage).filter(key => key.includes('@'));
    const keyLoggedUser =  Object.keys(sessionStorage)[0];

    kaeyUsersArray.forEach(user => {
        if (user != keyLoggedUser) {
            var dropdownUtenti = document.getElementById('dropdownUtenti');
            dropdownUtenti.style.display = "display";
            dropdownUtenti.innerHTML += `<a class="dropdown-item" href="profiloUtente.html?utente=${user}">${user}</a>`;
        }
    });
}

//gestione ricerca playlist in base a tag, nome ed artista
const playlistInputElement = document.querySelector('#palylist-input');
const playlistListElement = document.querySelector('#playlist-list');


function toArrayOfSrings(public_playlists) {
    var arrryOFStrings = [];
    public_playlists.forEach(playlistObj => {
        var genere = playlistObj.playlistUtente[0]['tags'];
        arrryOFStrings = arrryOFStrings.concat(genere);
        var traccePlaylsit = playlistObj.playlistUtente[0]['tracce'];
        traccePlaylsit.forEach(traccia => {
            arrryOFStrings.push(traccia['nome']);
            arrryOFStrings.push(traccia['artista']);
        });
    });
    arrryOFStrings = [...new Set(arrryOFStrings)];
    return arrryOFStrings
}

function filterData(data, searchText) {
    return data.filter((x) => x.toLowerCase().startsWith(searchText.toLowerCase()));
}

function handlePlaylistInput() {
    if (playlistInputElement.value === '') {
        loadData([], playlistListElement);
    } else {
        const filteredData = filterData(toArrayOfSrings(public_playlists), playlistInputElement.value);
        loadData(filteredData, playlistListElement);
    }
}

function loadData(data, element) {
    let innerElement = "";
    var counter = 0;
    data.forEach((item) => {
        counter++
        innerElement += `<button type="button" class="list-group-item list-group-item-action" id="cercaPlaylist${counter}" onclick="showPlaylist(this, ${counter})">${item}</button>`;
    });
    element.innerHTML = innerElement;
}

function showPlaylist(button, counter) {
    var previousTable = document.getElementById('tracce');
    previousTable.innerHTML = "";

    var string = "cercaPlaylist" + counter;
    var button = document.getElementById(string);
    var userChoice = button.textContent;

    public_playlists.forEach(playlist => {
        if (JSON.stringify(playlist).includes(userChoice)) {
            fillTable(playlist)
            console.log([playlist], userChoice)
        }
    });
}