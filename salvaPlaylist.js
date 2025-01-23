//salva i dati nel submit in un oggetto javascript
const form = document.querySelector('form');
let objPlaylist = {};
const key = Object.keys(sessionStorage)[0];
const jsonInSessionStorage = JSON.parse(sessionStorage.getItem(key));

function createArrayTags(objPlaylist) {
  //store the tags as an array in the objPlaylist
  //create an array with all the elements that starts with #
  const elementsStartingWithHash = Object.keys(objPlaylist).filter(key => key.startsWith('#'));

  //delete all the elements that starts with # from objPlaylist
  elementsStartingWithHash.forEach(key => delete objPlaylist[key]);

  //add the array with the selected tags in the objPlaylist
  objPlaylist.tags = elementsStartingWithHash;
}

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevents the default form submission behavior, which would cause a page refresh

  // Create JavaScript object with user input
  const fd = new FormData(form);
  objPlaylist = Object.fromEntries(fd);

  createArrayTags(objPlaylist);

  objPlaylist['tracce'] = createArrayOfObjects(tracksSet);

  clearBadge()
  if ((!worgInputName(objPlaylist['nome playlist']) && !noTags(objPlaylist['tags']) && !noTracks(objPlaylist['tracce']))) {

    const objPlaylistAssociatedToCreator = Object.assign({ proprietario: key }, objPlaylist);

    //gestisce l'aspetto modifica playlist
    const urlParam = new URLSearchParams(window.location.search);
    if (urlParam.get('playlistDaModificare') != null) {
      erasePreviousPlaylist()
    }

    //creo oggetto che contiene la palylist dell'utente
    let playlistUtenteObj = {
      //oggetti playlist sono salvati in un array per mantenere il formato json
      playlistUtente: [objPlaylistAssociatedToCreator],
    };

    const json = JSON.stringify(jsonInSessionStorage.concat(playlistUtenteObj));

    localStorage.setItem(key, json);
    
    sessionStorage.setItem(key, json);

    console.log(sessionStorage.getItem(key))
    console.log(localStorage.getItem(key))

    if (objPlaylist['playlist_pubblica']) {
      delete objPlaylistAssociatedToCreator.playlist_pubblica
      sharePublicPlaylist(objPlaylistAssociatedToCreator);
    }
    
    window.location.href = "profiloUtente.html"
  }
});

//se è off playlist privata, se on pubblica
function toPublic_creaPlaylist() {
  var privacyText = document.getElementById("privacy_text");
  var checkbox = document.getElementById("flexSwitchCheckDefault");
  
  if (checkbox.checked) {
    privacyText.textContent = "Playlist pubblica";
  } else {
    privacyText.textContent = "Playlist privata";
  }
}

function createArrayOfObjects(tracksSet) {
  var arrayTracksObj = []
  tracksSet.forEach(element => {
    var array = element.split(";");
    var nome = array[0].split(":")[1].trim();
    var artista = array[1].split(":")[1].trim();
    var durata = array[2].split(": ")[1].trim();
    var dataPubblicazione = array[3].split(":")[1].trim();
    
    var trackObj = {
      nome: nome,
      artista: artista,
      durata: durata,
      data_pubblicazione: dataPubblicazione
    }
    arrayTracksObj.push(trackObj);
  });
  return arrayTracksObj;
}

function sharePublicPlaylist(newPublicPlayList) {
  var playlist_pubblicheArray = JSON.parse(localStorage.getItem('playlist_pubbliche'));
  
  //ricostruisco il formato JSON
  var arrayContainerObj = [newPublicPlayList];
  let oneObjJsonArray = {
    playlistUtente: arrayContainerObj
  }

  playlist_pubblicheArray.push(oneObjJsonArray);
  
  localStorage.setItem('playlist_pubbliche', JSON.stringify(playlist_pubblicheArray));
}

/*----------------------------modificaPlaylist.html-----------------------------------*/
var playlistInSessionStorage_index = 0;
function showPreviousInformations() {
  //prendo il nome della playlist da modificare dall'url
  const urlParam = new URLSearchParams(window.location.search);
  const playlistToModify_name = urlParam.get('playlistDaModificare');

  var playlistInSessionStorage_name = "";
  var playlistInSessionStorage_descrizionePlaylist = "";
  var playlistInSessionStorage_tags = [];

  for (let i = 1; i < jsonInSessionStorage.length; i++) {
    if (jsonInSessionStorage[i].playlistUtente[0]['nome playlist'] == playlistToModify_name) {
      playlistInSessionStorage_index = i;
      playlistInSessionStorage_name = jsonInSessionStorage[i].playlistUtente[0]['nome playlist'];
      playlistInSessionStorage_descrizionePlaylist = jsonInSessionStorage[i].playlistUtente[0]['descrizione playlist'];
      playlistInSessionStorage_tags = jsonInSessionStorage[i].playlistUtente[0]['tags'];
    }
  }

  var placeholderNomePlaylist = document.getElementById('formGroupInputNome');
  placeholderNomePlaylist.placeholder = playlistInSessionStorage_name;

  var placeholderNomePlaylist = document.getElementById('formGroupInputDescrizione');
  placeholderNomePlaylist.placeholder = playlistInSessionStorage_descrizionePlaylist;

  //segno come checked se era già presente nella playlist
  var checkboxes = document.querySelectorAll('input[class="btn-check"]');

  checkboxes.forEach(function(checkbox) {
    var nameTag = checkbox.getAttribute("name");
    checkWhatWasPreviouslyChecked(playlistInSessionStorage_tags, nameTag, checkbox);
  });
}

//controlla se era tra  tags della playlist
function checkWhatWasPreviouslyChecked(playlistInSessionStorage_tags, nameTag, checkbox) {
  playlistInSessionStorage_tags.forEach(tag => {
    if (tag == nameTag) {
      checkbox.checked = true;
    }
  });
}

//se è off playlist privata, se on pubblica
function toPubblic_modificaPlaylist() {
  var privacyText = document.getElementById("privacy_text");
  var checkbox = document.getElementById("flexSwitchCheckDefault");
  
  var alert = document.getElementById('alertPublicPlaylist');
  alert.style.display = "block";
  alert.innerHTML = "";

  if (checkbox.checked) {
    alert.innerHTML = "<p>Attenzione! Se rendi la playlist pubblica non sarà più modificabile</p>"
    privacyText.textContent = "Playlist pubblica";
  } else {
    privacyText.textContent = "Playlist privata";
  }
}

//ellimina la playlist precedente
function erasePreviousPlaylist() {
  jsonInSessionStorage.splice(playlistInSessionStorage_index, 1);

  const json = JSON.stringify(jsonInSessionStorage);

  localStorage.setItem(key, json);
  
  sessionStorage.setItem(key, json);

  console.log(sessionStorage.getItem(key))
  console.log(localStorage.getItem(key))
}