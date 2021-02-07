"use strict";
var login;
(function (login_1) {
    let serverUrl = "http://localhost:8100/";
    //let serverUrl: string = "https://lucamosergis2020.herokuapp.com/";
    function main() {
        let buttonLogin = document.getElementById("loginButton");
        buttonLogin.addEventListener("click", function funcLogin() {
            let inputUsername = document.getElementById("loginUsername");
            let inputPassword = document.getElementById("loginPassword");
            auswertenLogin(inputUsername.value, inputPassword.value);
        });
    }
    async function auswertenLogin(username, password) {
        // Einloggen
        /*Serveranfrage
            mit login als Übergabewert
        */
        let login; // Standartgemäß Null
        let eingabe = { site: "login", username: username, password: password };
        //let eingabe: Daten =  {site: "login", username: "lumo", semesterangabe: "help"};
        let query = new URLSearchParams(eingabe);
        let serverMitDatenUrl = serverUrl + "?" + query.toString();
        console.log(serverMitDatenUrl);
        login = await serverAnfrage(serverMitDatenUrl);
        /* Überprüfen ob Loginnachricht noch angezeigt wird,
            ja -> löschen
            nein -> weiter machen
        */
        let loginElementMsg = document.getElementById("textLogin");
        if (typeof (loginElementMsg) != "undefined" && loginElementMsg != null) {
            loginElementMsg.remove();
        }
        /*überprüfung ob Login erfolgt ist oder nicht
            Ja -> Benutzer wird in SessionStorage eingetragen + Profil und anschließend auf die Hauptseite weitergeleitet
            Nein -> Eine Fehlermeldung wird auf der Login-Seite angezeigt
        */
        if (login) {
            sessionStorage.clear();
            // auf die Seite Hauptseite referieren und den Benutzernamen in sessionStorage
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("profilname", username);
            console.log("Patchname" + window.location.pathname + "");
            window.location.href = window.location.pathname.substring(0, window.location.pathname.length - 11) + "/main/index.html";
            /*
            let hauptFenster: Window = window.open("/main/index.html");
            hauptFenster.focus();*/
        }
        else {
            let _divLogin = document.getElementById("messageLogin");
            let text = document.createElement("p");
            text.id = "textLogin";
            text.className = "textFalsch"; // Textformat klasse
            text.appendChild(document.createTextNode("Die Login-Daten sind falsch"));
            _divLogin.appendChild(text);
        }
    }
    /*Serveranfrage
        mit Url und boolean Rückgabe wert
    */
    async function serverAnfrage(_url) {
        let response = await fetch(_url);
        let antwort = await response.json();
        console.log("Rückgabe: " + antwort.msg);
        if (antwort.msg == "erfolg") {
            return true;
        }
        else {
            return false;
        }
    }
    main();
})(login || (login = {}));
//# sourceMappingURL=scriptLogin.js.map