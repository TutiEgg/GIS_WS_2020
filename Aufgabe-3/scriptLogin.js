"use strict";
/*
import * as Mongo from "mongodb";

let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
await mongoClient.connect();
*/
//import * as Http from "http";
//import * as Url from "url";
//import * as Mongo from "mongodb";
//import { PassThrough } from "stream";
// FEHLER: scriptList.ts:44 Uncaught (in promise) SyntaxError: Unexpected token D in JSON at position 0 
var Aufgabe_3;
(function (Aufgabe_3) {
    //let _serverUrl: string = "http://localhost:8100/";
    let _serverUrl = "http://lucamosergis2020.herokuapp.com/";
    function main() {
        let buttonLogin = document.getElementById("loginButton");
        buttonLogin.addEventListener("click", function funcLogin() {
            let inputEmail = document.getElementById("loginEmail");
            let inputPassword = document.getElementById("loginPassword");
            auswertenLogin(inputEmail.value, inputPassword.value);
        });
    }
    async function auswertenLogin(email, password) {
        // Einloggen
        let daten = await serverAnfrage(_serverUrl); // await dazu vielleicht
        let emailIstVorhanden = false;
        let passwortRichtig = false;
        let loginElementMsg = document.getElementById("textLogin");
        if (typeof (loginElementMsg) != "undefined" && loginElementMsg != null) {
            loginElementMsg.remove();
        }
        let _divLogin = document.getElementById("messageLogin");
        let text = document.createElement("p");
        text.id = "textLogin";
        if (email != undefined) {
            for (let i = 0; i < daten.length; i++) {
                let emailString = "\"" + email + "\"";
                //let emailString: string = email;
                console.log(JSON.stringify(daten[i].email).toString() + " == " + emailString); // "mmlpv.mossder@gmx.de" == mmlpv.mossder@gmx.de !!!FALSCH rumtesten
                if (JSON.stringify(daten[i].email) == emailString) { // benutzerArr[i].email.toString() kann undefined sein ... muss gelöst werden durch vollständige Formular ausfüllung
                    console.log("jaaa ist gleich" + i);
                    emailIstVorhanden = true;
                    //let passwordString: string = "\"" + password + "\"";
                    let passwordString = password;
                    if (daten[i].password == passwordString) { // undefined führt zu problemen
                        passwortRichtig = true;
                    }
                    break;
                }
            }
            if (emailIstVorhanden) {
                console.log("Email ist vorhanden");
                if (passwortRichtig) {
                    console.log("Das Passwort ist richtig!");
                    text.className = "textRichtig"; // Textformat klasse
                    text.appendChild(document.createTextNode("Die Email und das zugehörige Passwort ist richtig!"));
                }
                else {
                    text.className = "textFalsch"; // Textformat klasse
                    text.appendChild(document.createTextNode("Die Email ist vorhanden, aber das Passwort ist falsch!"));
                }
            }
            else {
                console.log("die Email ist nicht in der Datenbank eingetragen");
                text.className = "textFalsch"; // Textformat klasse
                text.appendChild(document.createTextNode("Die Email ist noch nicht in der Datenbank eingetragen"));
            }
        }
        else {
            console.log("keine Email angegeben");
            text.className = "textFalsch"; // Textformat klasse
            text.appendChild(document.createTextNode("Es wurde keine Email eingegeben"));
        }
        _divLogin.appendChild(text);
    }
    async function serverAnfrage(_url) {
        let response = await fetch(_url);
        // console.log("Response: ", response.json());
        let datenbankInhalt = await response.json();
        //console.log("ServerResponse = " + response);
        return datenbankInhalt;
    }
    main();
})(Aufgabe_3 || (Aufgabe_3 = {}));
//# sourceMappingURL=scriptLogin.js.map