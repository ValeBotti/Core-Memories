/*-CHIAMATE ALL'API DI SPOTIFY-*/
//connesione all'API di spotify tramite client credential flow per ottenre l'access token
const client_id = '';
const client_secret = '';

function fetchAccessToken() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(client_id + ":" + client_secret)
    },
    body: "grant_type=client_credentials"
  })
  .then(response => response.json())
  .then(data => {
    const access_token = data.access_token;
    window.localStorage.setItem("access_token", access_token);
  })
  .catch(error => {
    console.error("Error fetching access token: ", error);
  });
}

/*chiamate GET a spotify tramite access token e fetch dei dati restituiti dal server*/

//creo un'array di generi musicali
function fetchGenreSeeds() {
  fetchAccessToken();
  return fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
    headers: {
      'Authorization': 'Bearer ' + window.localStorage.getItem("access_token")
    }
  })
  .then(response => response.json())
  .then(responseData => responseData.genres)
  .catch(error => {
    console.error('Error retrieving available genre seeds: ', error);
    return [];
  });
}

//creo un'array di artisti
function searchArtists(searchText) {
  fetchAccessToken();
  return fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=artist`, {
    headers: {
      'Authorization': 'Bearer ' + window.localStorage.getItem("access_token")
    }
  })
    .then(response => response.json())
    .then(responseData => responseData.artists.items.map(item => item.name))
    .catch(error => {
      console.error('Error searching for artists: ', error);
      return [];
    });
}


/*----------------javscript iscrizione.html------------------*/
//controlli input utente
function checkDataIscrizione() {
  var flag = true;
  clearBadgeIscrizione();
  if (!minLen("email", 6)){
    addBadgeIscrizione("Email troppo corta!");
    flag = false;
  }
  if (!checkMail("email")){
    addBadgeIscrizione("Email non valida!");
    flag = false;
  }
  if (!minLen("nome", 3)){
    addBadgeIscrizione("Nome troppo corto!");
    flag = false;
  }
  if (!minLen("password", 3)){
    addBadgeIscrizione("Password troppo corta!");
    flag = false;
  }
  if (!checkCharAllowURL("nome")){
    addBadgeIscrizione("Nome non valido!");
    flag = false;
  }
  if (!checkCharAllowURL("password")){
    addBadgeIscrizione("Password non valida!");
    flag = false;
  }
  if (!mailStorage("email")) {
    addBadgeIscrizione("Sei già iscritto al sito! <a href='accesso.html' class='link-light'>Accedi</a>");
    flag = false;
  }

  return flag;
}

//controllo che l'utente abbia inserito un valore consentito dalla regular expression
//informazioni in chiaro tramite url, per cui, ho tolto % che insieme ad altre combinazioni simboleggiano caratteri speciali
function checkCharAllowURL(id) {
  var text = document.getElementById(id).value;
  var regURL = /^[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;
  return regURL.test(text)
}

//c'è una lughezza minima per gli input
function minLen(id, n) {
  return document.getElementById(id).value.length >= n
}

function checkMail(id){
  var email = document.getElementById(id).value;
  var emailR = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return emailR.test(email)
}

//verifico se l'utente è già registrato al sito (se è già inserito nel local storage) tramite mail (mail è univoca)
function mailStorage(id) {
  var email = document.getElementById(id).value;
  return localStorage.getItem(email) == null;
}

//se non vengono rispettate determiante condizioni inserisco un alert nel div selezionato
function addBadgeIscrizione(text){
  var alert = document.getElementById('alertIscrizione');
  alert.style.display = "block";
  alert.innerHTML = alert.innerHTML + "<p>" + text + "</p>"

}

//tolgo tutti gli alert generati in precedenza
function clearBadgeIscrizione(){
  var alert = document.getElementById('alertIscrizione');
  alert.style.display = "none";
  alert.innerHTML = alert.innerHTML = "";
}


/*-----------------preferenzeUtente.html----------------*/
//mostra le informazioni restituite dall'API in un dropdown composto da bottoni che cliccando vengono mostrati nella parte bassa dello schermo
const genreInputElement = document.querySelector('#genre_seeds-input');
const genreListElement = document.querySelector('#genre_seeds-list');

function handleGenreInput() {
  if (genreInputElement.value === '') {
    loadData([], genreListElement);
  } else {
    fetchGenreSeeds()
      .then(genreSeeds => {
        const filteredData = filterData(genreSeeds, genreInputElement.value);
        const type = "genre-seed";
        loadData(filteredData, genreListElement, type);
      })
      .catch(error => {
        console.error('Error retrieving genre seeds: ', error);
      });
  }
}

const artistInputElement = document.querySelector('#artist-input');
const artistListElement = document.querySelector('#artist-list');

function handleArtistInput() {

  if (artistInputElement.value === '') {
    loadData([], artistListElement);
  } else {
    searchArtists(artistInputElement.value)
      .then(artistNames => {
        const filteredData = filterData(artistNames, artistInputElement.value);
        const type = "artist";
        loadData(filteredData, artistListElement, type);
      })
      .catch(error => {
        console.error('Error retrieving artist data: ', error);
      });
  }
}

//crea un'array contenente solo gli elementi che rispettano l'input
function filterData(data, searchText) {
  return data.filter((x) => x.toLowerCase().startsWith(searchText.toLowerCase()));
}

//funzioni condivise, loadData -> inserisce il dropdown
function loadData(data, element, type) {
  clearBadgePreferenzeUtente();
  if ((artistInputElement.value != "" || genreInputElement.value != "") && data.length == 0) {
    element.innerHTML = "";
    addBadgePreferenzeUtente();
  } else {
    element.innerHTML = "";
    let innerElement = "";
    data.forEach((item) => {
      innerElement += `<button type="button" class="list-group-item list-group-item-action ${type}" onclick="addChoice(this)">${item}</button>`;
    });
    element.innerHTML = innerElement;
  }
}

//alert per indicare all'utente che l'artista/canone o genere non è restituito dall'api
function addBadgePreferenzeUtente(){
  var alert = document.getElementById('alertPreferenzeUtente');
  alert.style.display = "block";
  alert.innerHTML = alert.innerHTML + "<p>La ricerca non è presnte nel dataset</p>"
}

//cancella tutti gli alert
function clearBadgePreferenzeUtente(){
  var alert = document.getElementById('alertPreferenzeUtente');
  alert.style.display = "none";
  alert.innerHTML = alert.innerHTML = ""
}

//prende gli elementi selezionati dall'utente e li salva come oggetti per poi inserirli nell'array che andrà nel local storage (tra le info dell'utente)
const genreChosenElement = document.querySelector('#genre_seeds-chosen');
const artistChosenElement = document.querySelector('#artist-chosen');

const genreSeedsSet = new Set();
const artistSet = new Set();

function addChoice(button) {
  const buttonText = button.textContent;

  if (button.classList.contains('genre-seed')) {
    genreSeedsSet.add(buttonText);
  } else if (button.classList.contains('artist')) {
    artistSet.add(buttonText);
  }

  if (genreChosenElement.value === '') {
    loadDataUser(new Set(), genreChosenElement);
  } else {
    type = "genre-seed";
    loadDataUser(genreSeedsSet, genreChosenElement, type);
  }

  if (artistChosenElement.value === '') {
    loadDataUser(new Set(), artistChosenElement);
  } else {
    type = "artist";
    loadDataUser(artistSet, artistChosenElement, type);
  }
}

//mostra le scelte dell'utente
function loadDataUser(data, element, type) {
  if (data.size >= 0) {
    element.innerHTML = "";
    let innerElement = "";
    data.forEach((item) => {
      innerElement += `<button type="button" class="btn btn-outline-success ${type}" onclick="removeChoice(this)">${item}</button>`;
    });
    element.innerHTML = innerElement;
  }
}

//rimuove le scelte dell'utente
function removeChoice(button) {
  const buttonText = button.textContent;

  if (button.classList.contains('genre-seed')) {
    genreSeedsSet.delete(buttonText);
  } else if (button.classList.contains('artist')) {
    artistSet.delete(buttonText);
  }

  loadDataUser(genreSeedsSet, genreChosenElement, "genre-seed");
  loadDataUser(artistSet, artistChosenElement, "artist");
}

//fase di salvataggio dati inseriti dall'utente
//recupera l'input utente della pagina precedente (iscrizione.html) dall'url
function getQueryParamValue(param) {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

//salva nel local e session storage le informazioni dell'utente
function salvaInput() {

  var nome = getQueryParamValue('nome');
  var email = getQueryParamValue('email');
  var password = getQueryParamValue('password');
  let obj1 = {
    nome: nome,
    email: email,
    password: password,
  }

  //salva i dati nel submit in un oggetto javascript
  const form = document.querySelector('form');
  let obj2 = {};

  // Create JavaScript object with user input
  const fd = new FormData(form);
  obj2 = Object.fromEntries(fd);

  obj2['generi preferiti'] = Array.from(genreSeedsSet);
  obj2['artisti preferiti'] = Array.from(artistSet);

  const mergedObj = Object.assign({}, obj1, obj2)

  const infoUtente = [mergedObj];

  const json = JSON.stringify(infoUtente);

  localStorage.setItem(email, json);
  
  sessionStorage.setItem(email, json);
}

/*-----------------------------------accesso.html-----------------------------------------------------*/
function saveCredentialsSessionStorageAccesso() {
  let email = document.getElementById("email").value;
  sessionStorage.setItem(email, localStorage.getItem(email));
}

function checkDataAccesso() {

  clearBadgeAccesso()
  if (!mailStorageAccesso("email")) {
    addBadgeAccesso("Non sei ancora iscritto al sito! <a href='iscrizione.html' class='link-light'>Iscriviti</a>");
    return false;
  } else if (!checkCredentials("nome")) {
    addBadgeAccesso("Non hai inserito il nome giusto");
    return false;
  } else if (!checkCredentials("password")) {
    addBadgeAccesso("Non hai inserito la password giusta");
    return false;
  }

  saveCredentialsSessionStorageAccesso();

  return true;
}

function mailStorageAccesso(id) {
  email = document.getElementById(id).value;
  return localStorage.getItem(email) != null;
}

function checkCredentials(id) {
  text = document.getElementById(id).value;
  credenziali = JSON.parse(localStorage.getItem(email));
  if (credenziali[0][id] == text) {
    
    return true;
  }
}

function addBadgeAccesso(text){
    var alert = document.getElementById('alertAccesso');
    alert.style.display = "block";
    alert.innerHTML = alert.innerHTML + "<p>" + text + "</p>"
}

function clearBadgeAccesso(){
    var alert = document.getElementById('alertAccesso');
    alert.style.display = "none";
    alert.innerHTML = alert.innerHTML = ""

}


/*-------------------------modifica_informazioni_profiloUtente.html---------------------*/
function checkData() {
  var flag = true;
  clearBadge();

  if (!minLen("nome", 3)){
    addBadge("Nome troppo corto!");
    flag = false;
  }
  if (!minLen("password", 3)){
    addBadge("Password troppo corta!");
    flag = false;
  }
  if (!checkCharAllowURL("nome")){
    addBadge("Nome non valido!");
    flag = false;
  }
  if (!checkCharAllowURL("password")){
    addBadge("Password non valida!");
    flag = false;
  }

  return flag;
}

//caratteri permessi in input
function checkCharAllowURL(id) {
  var text = document.getElementById(id).value;
  var regURL = /^[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;
  return regURL.test(text)
}

//c'è una lughezza minima per gli input
function minLen(id, n) {
  return document.getElementById(id).value.length >= n
}

function addBadge(text){
    var alert = document.getElementById('alertModificaDati');
    alert.style.display = "block";
    alert.innerHTML = alert.innerHTML + "<p>" + text + "</p>"
}

function clearBadge(){
    var alert = document.getElementById('alertModificaDati');
    alert.style.display = "none";
    alert.innerHTML = alert.innerHTML = ""
}

function salvaInputModficaInformazioni(e) {
  e.preventDefault();

  var key = Object.keys(sessionStorage)[0];

  var nome = document.getElementById('nome').value;
  var email = key;
  var password = document.getElementById('password').value;

  let obj1 = {
    nome: nome,
    email: email,
    password: password
  }

  //salva i dati nel submit in un oggetto javascript
  const form = document.querySelector('form');
  let obj2 = {};

  // Create JavaScript object with user input
  const fd = new FormData(form);
  obj2 = Object.fromEntries(fd);

  obj2['generi preferiti'] = Array.from(genreSeedsSet);
  obj2['artisti preferiti'] = Array.from(artistSet);

  const mergedObj = Object.assign({}, obj1, obj2)

  const infoUtente = [mergedObj];

  const json = JSON.stringify(userCurrentStorageInformation(infoUtente));

  localStorage.setItem(key, json);
  
  sessionStorage.setItem(key, json);

  window.location.href = "profiloUtente.html";
}


function userCurrentStorageInformation(changedInformationObject) {
  var key = Object.keys(sessionStorage)[0];
  var infoUtenteObj = JSON.parse(sessionStorage.getItem(key));

  infoUtenteObj[0] = changedInformationObject[0];

  return infoUtenteObj
}
