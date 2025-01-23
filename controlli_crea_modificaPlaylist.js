function worgInputName(nomePlaylist) {
    if (nomePlaylist == '') {
        addBadgeSavingWrongInput("Non puoi non dare un nome alla tua playlist");
        return true;
    } else {
        // Recupero informazioni utente loggato che si trovano nel session storage
        for (let i = 1; i < jsonInSessionStorage.length; i++) {
            const playlistUtente = jsonInSessionStorage[i]['playlistUtente'];
                for (const item of playlistUtente) {
                    //se il nome è già presente nel session storage lancio un wrning
                    if (nomePlaylist == item['nome playlist']) {
                        addBadgeSavingWrongInput("La playlist è già presente, segli un'altro nome");
                        return true;
                    }
                }
        }
    }
    return false; //if playlist is not found
}

function noTags(tagsArray) {
    if (tagsArray.length == 0) {
        addBadgeSavingWrongInput("Non hai inserito i tag, devi inserirne almeno uno");
        return true;
    }
    return false;
}

function noTracks(traksArray) {
    if (traksArray == 0) {
        addBadgeSavingWrongInput("Non hai inserito le canzoni, devi inserirne almeno una");
        return true;
    }
    return false;
}
  
//add warings on window
function addBadgeSavingWrongInput(text){
    var alert = document.getElementById('alertSavingWrongInput');
    alert.style.display = "block";
    alert.innerHTML = alert.innerHTML + '<p>' + text + '</p>';
}

//clear warnings on window
function clearBadge(){
    var alert = document.getElementById('alertSavingWrongInput');
    alert.style.display = "none";
    alert.innerHTML = alert.innerHTML = ""
}