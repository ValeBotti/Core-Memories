//GET + FETCH DATI API
function searchTracks(searchText) {
  return fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=track`, {
    headers: {
      'Authorization': 'Bearer ' + window.localStorage.getItem("access_token")
    }
  })
    .then(response => response.json())
    .then(responseData => {
      return responseData.tracks.items.map(item => {
        return {
          name: item.name,
          artist: item.artists.map(artist => artist.name).join(', '),
          duration: item.duration_ms,
          release_date: item.album.release_date,
          image: `<img src=${item.album.images[0].url} style="max-width: 100px; max-height: 100px;">`
        };
      });
    })
    .catch(error => {
      console.error('Error searching for tracks: ', error);
      return [];
    });
}

//prende i dati restituiti dall'api e li mette in un dropdown
const trackInputElement = document.querySelector('#tracks-input');
const trackListElement = document.querySelector('#tracks-list');

trackInputElement.addEventListener("input", async function() {
  if (trackInputElement.value === '') {
    loadData([], trackListElement);
  } else {
    const trackData = await searchTracks(trackInputElement.value);
    const filteredData = filterData(trackData, trackInputElement.value);
    loadData(filteredData, trackListElement);
  }
});

// Shared functions (dropdown)
function loadData(data, element) {
  clearBadge();
  if (trackInputElement.value != "" && data.length == 0) {
    element.innerHTML = "";
    addBadge();
  } else {
    element.innerHTML = "";
    let innerElement = "";
    data.forEach((item) => {
      infoCanzone = changeFormat(item); 
      innerElement += `<button type="button" class="list-group-item list-group-item-action" onclick="addChoice(this)">${infoCanzone}</button>`;
    });
    element.innerHTML = innerElement;
  }
}

function filterData(data, searchText) {
  return data.filter((obj) => {

    const nameMatch = obj.name.toLowerCase().includes(searchText.toLowerCase());
    const artistMatch = obj.artist.toLowerCase().includes(searchText.toLowerCase());

    return nameMatch || artistMatch;
  });
}

//cambio il formato dei dati restituiti dall'api
function changeFormat(item) {
    const strButton = item['image'] + " Nome: " + item['name'] + "; Artista: " + item['artist'] + "; Durata: " + millisecondToTimeFormat(item['duration']) + "; Data pubblicazione: " + fromAmaricanToItaDateFormat(item['release_date']);
    return strButton;
}

function fromAmaricanToItaDateFormat(date) {
  try {
    if (typeof date === 'string' && typeof date !== 'undefined') {
      const [year, month, day] = date.split('-');
      return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
    } else {
      throw new Error('Date is not a string or undefined');
    }
  } catch (error) {
    return '';
  }
}

function millisecondToTimeFormat(duration_ms) {

  const totalSeconds = Math.floor(duration_ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;

}

//warning
function addBadge(){
  var alert = document.getElementById('alertSearchTraks');
  alert.style.display = "block";
  alert.innerHTML = "<p>Il nome non è presnte nel dataset</p>"
}

function clearBadge(){
  var alert = document.getElementById('alertSearchTraks');
  alert.style.display = "none";
  alert.innerHTML = alert.innerHTML = ""
}

//codice prende e salva le info nel local storage
const tracksChosenElement = document.querySelector('#tracks-chosen');

const tracksSet = new Set();

function addChoice(button) {
  const buttonText = button.textContent;

  tracksSet.add(buttonText);

  if (tracksChosenElement.value === '') {
    loadDataUser(new Set(), tracksChosenElement);
  } else {
    loadDataUser(tracksSet, tracksChosenElement);
  }
}

function loadDataUser(data, element) {
  if (data.size >= 0) {
    element.innerHTML = "";
    let innerElement = "";
    data.forEach((item) => {
      innerElement += `<button type="button" class="btn btn-outline-success" onclick="removeChoice(this)">${item}</button>`;
    });
    element.innerHTML = innerElement;
  }
}

function removeChoice(button) {
  const buttonText = button.textContent;

  tracksSet.delete(buttonText);

  loadDataUser(tracksSet, tracksChosenElement);
}