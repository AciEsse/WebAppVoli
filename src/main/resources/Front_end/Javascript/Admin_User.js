fetch('iconaLogin.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('icona-login-esterna').innerHTML = data;
    })
    .catch(error => console.error('Errore nel caricamento dell\'icona:', error));


function logout(){
    let log_out=document.getElementById("icona-login-esterna")
    localStorage.removeItem("token")
    alert("Logout avvenuto con successo")
    window.location.href="../html/home.html"
}


/* Menu funzionamento */
function apriMenu(){
  let menu = document.getElementById("menu");
  menu.classList.toggle("active");
}

window.addEventListener('click', function(event) {
  let menu = document.getElementById("menu");
  let icona = document.querySelector('.bi-list'); 
  if (menu && menu.classList.contains('active')) {
    if (!menu.contains(event.target) && !icona.contains(event.target)) {
      menu.classList.remove('active');
    }
  }
});

/* Filtro funzionamento */
function apriFiltro(){
  let menu = document.getElementById("filtro");
  menu.classList.toggle("active");
}

window.addEventListener('click', function(event) {
  let menu = document.getElementById("filtro"); // Questa variabile si chiama 'menu'
  let icona = document.querySelector('.bi-funnel'); 
  if (menu && menu.classList.contains('active')) { // Corretto da 'filtro' a 'menu' per evitare il crash
    if (!menu.contains(event.target) && !icona.contains(event.target)) {
      menu.classList.remove('active');
    }
  }
});

/* FUNZIONE APRI FIELDSET CORRETTA E UNICA */
function apriFieldset(idDelFieldset){
  let tuttiIFieldset = document.querySelectorAll("fieldset");
  tuttiIFieldset.forEach(f => f.classList.remove("active"));

  let fieldsetDaAprire = document.getElementById(idDelFieldset);
  if (fieldsetDaAprire) {
    fieldsetDaAprire.classList.add("active");
  }
}

// Global variable per tracciare la selezione
let idVoloSelezionato = null;

// FUNZIONE DI UTILITÀ: Estrae l'ID utente dal token JWT memorizzato nel localStorage
function ottieniIdDaToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        // Il payload del JWT è la stringa centrale racchiusa tra due punti
        const payloadBase64 = token.split('.')[1];
        const stringaDecodificata = atob(payloadBase64);
        const datiToken = JSON.parse(stringaDecodificata);
        
        // Mappa i formati di output standard di Spring Boot (id, userId o sub)
        return datiToken.id || datiToken.userId || datiToken.sub;
    } catch (e) {
        console.error("Errore decodifica JWT:", e);
        return null;
    }
}

function inserisci(){
    const compagnia = document.getElementById("compagnia").value;
    const aeroportoPartenza = document.getElementById("aeroportoPartenza").value;
    const aeroportoDestinazione = document.getElementById("aeroportoDestinazione").value;
    const data = document.getElementById("data").value;
    const orarioDecollo = document.getElementById("orarioDecollo").value;
    const orarioAtterraggio = document.getElementById("orarioAtterraggio").value;
    const postiDisponibili = document.getElementById("posti").value;

    fetch("http://localhost:8081/voli", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            compagnia: compagnia,
            aeroportoPartenza: aeroportoPartenza,
            aeroportoDestinazione: aeroportoDestinazione,
            data: data,
            orarioDecollo: orarioDecollo,
            orarioAtterraggio: orarioAtterraggio,
            postiDisponibili: Number(postiDisponibili)
        })
    })
    .then(res => {
        console.log("Status:", res.status);
        if(!res.ok){
            throw new Error("Errore inserimento volo");
        }
        return res.json();
    })
    .then(volo => {
        console.log("Volo inserito:", volo);
        alert("Volo inserito correttamente!");
        caricaVoli(); 
    })
    .catch(error => {
        console.error("Errore:", error);
        alert("Inserimento fallito");
    });
}

function caricaVoli(){
    fetch("http://localhost:8081/voli",{
        method:"GET",
        headers:{
            "Authorization":"Bearer " + localStorage.getItem("token")
        }
    })
    .then(res=>{
        if(!res.ok) throw new Error("Errore nel caricamento dei voli");
        return res.json();
    })
    .then(voli=>{
        const body = document.getElementById("bodyVoli");
        body.innerHTML = "";

        voli.forEach(volo => {
            const riga = document.createElement("tr");
            riga.style.cursor = "pointer";

            riga.innerHTML = `
                <td>${volo.codice}</td>
                <td>${volo.compagnia}</td>
                <td>${volo.aeroportoPartenza}</td>
                <td>${volo.aeroportoDestinazione}</td>
                <td>${volo.data}</td>
                <td>${volo.orarioDecollo}</td>
                <td>${volo.orarioAtterraggio}</td>
                <td>${volo.postiDisponibili}</td>
            `;

            // Riconosce automaticamente il contesto e assegna la funzione corretta
            riga.onclick = function() {
                if (document.getElementById("putCompagnia")) {
                    selezionaVolo(volo, riga);
                } else {
                    selezionaVoloUser(volo, riga);
                }
            };

            body.appendChild(riga);
        });
    })
    .catch(err=>{
        console.error(err);
        alert("Impossibile caricare i voli");
    });
}

document.addEventListener("DOMContentLoaded", caricaVoli);

// SELEZIONE ADMIN ORIGINALMENTE INALTERATA
function selezionaVolo(volo, rigaElemento) {
    idVoloSelezionato = volo.codice; 

    const righe = document.querySelectorAll("#bodyVoli tr");
    righe.forEach(r => r.classList.remove("riga-selezionata"));

    rigaElemento.classList.add("riga-selezionata");

    document.getElementById("putCompagnia").value = volo.compagnia;
    document.getElementById("putAeroportoPartenza").value = volo.aeroportoPartenza;
    document.getElementById("putAeroportoDestinazione").value = volo.aeroportoDestinazione;
    document.getElementById("putData").value = volo.data;
    document.getElementById("putOrarioDecollo").value = volo.orarioDecollo;
    document.getElementById("putOrarioAtterraggio").value = volo.orarioAtterraggio;
    document.getElementById("putPostiDisponibili").value = volo.postiDisponibili;

    console.log("Hai selezionato il volo ID:", idVoloSelezionato);
}



function aggiornaVolo(){

    if(idVoloSelezionato === null){
        alert("Seleziona prima un volo dalla tabella!");
        return;
    }

    const orarioDecollo = document.getElementById("putOrarioDecollo").value.substring(0,5);
    const orarioAtterraggio = document.getElementById("putOrarioAtterraggio").value.substring(0,5);

    const datiModificati = {
        compagnia: document.getElementById("putCompagnia").value,
        aeroportoPartenza: document.getElementById("putAeroportoPartenza").value,
        aeroportoDestinazione: document.getElementById("putAeroportoDestinazione").value,
        data: document.getElementById("putData").value,
        orarioDecollo: orarioDecollo,
        orarioAtterraggio: orarioAtterraggio,
        postiDisponibili: Number(document.getElementById("putPostiDisponibili").value)
    };


    fetch(`http://localhost:8081/voli/${idVoloSelezionato}`, {
        method: "PUT",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(datiModificati)
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Errore modifica volo");
        }
        return response.json();
    })
    .then(volo => {
        alert("Volo modificato correttamente!");
        caricaVoli();
    })
    .catch(error => {
        console.error(error);
        alert("Modifica fallita");
    });
}

function eliminaVolo(){
    if (!idVoloSelezionato) {
        alert("Seleziona prima un volo dalla tabella cliccandoci sopra!");
        return;
    }

    const idNumerico = parseInt(idVoloSelezionato, 10);

    if (isNaN(idNumerico)) {
        alert("Errore: Il codice di questo volo non è un numero valido e non può essere elaborato dal backend.");
        return;
    }

    if (!confirm(`Sei sicuro di voler eliminare il volo ID: ${idNumerico}?`)) {
        return;
    }

    fetch(`http://localhost:8081/voli/${idNumerico}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        console.log("Status eliminazione:", res.status);
        if(!res.ok){
            throw new Error("Errore durante l'eliminazione. Stato: " + res.status);
        }
        return res.text();
    })
    .then(() => {
        alert("Volo eliminato con successo!");
        idVoloSelezionato = null; 
        
        document.getElementById("putCompagnia").value = "";
        document.getElementById("putAeroportoPartenza").value = "";
        document.getElementById("putAeroportoDestinazione").value = "";
        document.getElementById("putData").value = "";
        document.getElementById("putOrarioDecollo").value = "";
        document.getElementById("putOrarioAtterraggio").value = "";
        document.getElementById("putPostiDisponibili").value = "";

        caricaVoli(); 
    })
    .catch(err => {
        console.error(err);
        alert("Eliminazione fallita. Controlla la console del browser.");
    });
}


function prenotaVolo() {
    if (!idVoloSelezionato) {
        alert("Seleziona prima un volo dalla tabella cliccandoci sopra!");
        return;
    }

    const idNumerico = parseInt(idVoloSelezionato, 10);
    if (isNaN(idNumerico)) {
        alert("Errore: Il codice di questo volo non è un numero valido.");
        return;
    }

    const inputPosti = document.getElementById("postiPrenotati");
    const postiPrenotati = Number(inputPosti.value);

    // Recupero dinamico dal token funzionante
    const idUtente = ottieniIdDaToken();
    if(!idUtente){
        alert("Utente non riconosciuto dal Session Token. Effettua nuovamente il login");
        return;
    }

    console.log({
        volo:idNumerico,
        posti:postiPrenotati,
        utente:idUtente
    });

    fetch(`http://localhost:8081/voli/${idNumerico}/prenotazioni`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
        postiPrenotati: postiPrenotati,
        user: { id: Number(idUtente) } 
    })
})
    .then(response=>{
        console.log("Status prenotazione:",response.status);
        if(!response.ok){
            throw new Error("Errore prenotazione: "+response.status);
        }
        return response.json();
    })
    .then(data=>{
        console.log("Prenotazione effettuata:",data);
        alert("Prenotazione effettuata!");
        document.getElementById("postiPrenotati").value="";
        caricaVoli();
    })
    .catch(error=>{
        console.error(error);
        alert("Prenotazione non riuscita");
    });
}

function filtra() {

    const partenza = document.getElementById("filtroPartenza").value.trim().toLowerCase();
    const destinazione = document.getElementById("filtroDestinazione").value.trim().toLowerCase();
    const data = document.getElementById("filtroData").value.trim();
    const compagnia = document.getElementById("filtroCompagnia").value.trim().toLowerCase();

    fetch("http://localhost:8081/voli", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nel recupero dei voli");
        }
        return response.json();
    })
    .then(voli => {

        const voliFiltrati = voli.filter(volo => {

            return (
                (partenza === "" ||
                    volo.aeroportoPartenza.toLowerCase().includes(partenza)) &&

                (destinazione === "" ||
                    volo.aeroportoDestinazione.toLowerCase().includes(destinazione)) &&

                (compagnia === "" ||
                    volo.compagnia.toLowerCase().includes(compagnia)) &&

                (data === "" ||
                    volo.data === data)
            );
        });

        aggiornaTabella(voliFiltrati);
    })
    .catch(error => {
        console.error(error);
        alert("Si è verificato un errore durante la ricerca.");
    });
}

function aggiornaTabella(voli) {
    const tbody = document.getElementById('bodyVoli');
    
    tbody.innerHTML = ''; 

    if (voli.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nessun volo trovato</td></tr>`;
        return;
    }

    voli.forEach(volo => {
        const row = document.createElement('tr');
        row.style.cursor = "pointer"; 
        
        row.innerHTML = `
            <td>${volo.codice || '-'}</td>
            <td>${volo.compagnia || '-'}</td>
            <td>${volo.aeroportoPartenza || '-'}</td>
            <td>${volo.aeroportoDestinazione || '-'}</td> 
            <td>${volo.data || '-'}</td>
            <td>${volo.orarioDecollo || '-'}</td>
            <td>${volo.orarioAtterraggio || '-'}</td> 
            <td>${volo.postiDisponibili || '-'}</td>
        `;
        
        row.onclick = function() {
            if (document.getElementById("putCompagnia")) {
                selezionaVolo(volo, row);
            } else {
                selezionaVoloUser(volo, row);
            }
        };
        
        tbody.appendChild(row);
    });
}

function prenota(){
    const codice=parseInt(document.getElementById("codice").value)
    const postiPrenotati= document.getElementById("postiPrenotati").value

    fetch(`http://localhost:8081/voli/${codice}/prenotazioni`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },

        body: JSON.stringify(parseInt(postiPrenotati))
    })
    .then(res => {
        console.log("Status:", res.status);
        if(!res.ok){
            throw new Error("Errore penotazionevolo");
        }
        return res.json();
    })
    .then(volo => {
        console.log("Volo prenotato:", volo);
        alert("Volo prenotato correttamente!");
        location.reload(true)
    })
    .catch(error => {
        console.error("Errore:", error);
        alert("Prenotazione fallita");
    });
}


