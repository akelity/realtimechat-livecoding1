// TODO: aggiungere le configurazioni di firebase qui!
var firebaseConfig = {
};
var user = null;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const actualDateTime = function() {
    var dt = new Date();

    return `
    ${dt.getDate().toString().padStart(2, '0')}/
    ${(dt.getMonth()+1).toString().padStart(2, '0')}/
    ${dt.getFullYear().toString().padStart(4, '0')} 
    ${dt.getHours().toString().padStart(2, '0')}:
    ${dt.getMinutes().toString().padStart(2, '0')}:
    ${dt.getSeconds().toString().padStart(2, '0')}`
    ;
}

const inviaMessaggio = function() {
    const testo = document.getElementById("boxTesto").value;
    const nick = document.getElementById("nickname").value;

    if(testo && nick) {
        document.getElementById("boxTesto").value = "";

        let chatRef = database.ref('chat');
        chatRef.push({
            nick: nick,
            testo: testo,
            time: actualDateTime()
        });

        console.log("Invia Mes : ", testo);
    } else {
        alert("Devi scrivere il nick e il messaggio!");
    }

}

const login = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        document.getElementById("loginButton").style.visibility = "hidden";
        user = result.user;
        document.getElementById("nickname").value = user.displayName;
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
    });
}

const inserisciMessaggi = function(messaggi) {
    let messaggiFormattati = "";

    messaggi.forEach(function(messaggio) {
        messaggiFormattati += `
            <li class="list-group-item">
                ${messaggio.nick}: ${messaggio.testo} <br />
                <span style="font-size:8px">${messaggio.time ? messaggio.time : ""}</span>
            </li>`;
    });

    document.getElementById("listaMessaggi").innerHTML = messaggiFormattati;
}

database.ref('chat').on('value', function(snapshot) {
    const data = snapshot.val();

    const datiFormattati = [];

    Object.keys(data).reverse().forEach(function(key) {
        datiFormattati.push(data[key]);
    });

    inserisciMessaggi(datiFormattati);
});

firebase.auth().onAuthStateChanged(function(loggedUser) {
    if (loggedUser) {
        document.getElementById("loginButton").style.visibility = "hidden";
        user = loggedUser;
        document.getElementById("nickname").value = user.displayName;

    } else {
        // No user is signed in.
    }
});
