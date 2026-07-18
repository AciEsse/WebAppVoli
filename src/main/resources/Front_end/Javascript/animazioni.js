/*Animazione icona login */

fetch('iconaLogin.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('icona-login-esterna').innerHTML = data;
    })
    .catch(error => console.error('Errore nel caricamento dell\'icona:', error));

/*chiusura pop-up*/
function chiudiFinestra() {
    document.getElementById('finestra-popup').style.display = 'none';
}

/*login-registrazione*/

function accesso(){
  window.location.href="../html/Reg_Aut.html"
}



