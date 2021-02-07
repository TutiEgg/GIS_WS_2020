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
var register;
(function (register) {
    //let serverUrl: string = "http://127.0.0.1:8100";
    let serverUrl = "https://lucamosergis2020.herokuapp.com/";
    function main() {
        /*
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/index.html") {
        } else if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/einloggen.html") {
        } else if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/list.html") {
        }*/
        // Button Registrieren, Einloggen und Liste führen zu unterscheidliche Dateien + eine Algemeine Methode für die Serveranfrage bei der Daten von Db zurückgegeben werden und eine Methode die Werte in die Db schreibt 
        let buttonRegister = document.getElementById("registerButton");
        buttonRegister.addEventListener("click", async function funcRegister() {
            let inputFirstName = document.getElementById("regFirstName");
            let inputLastName = document.getElementById("regLastName");
            let inputBenutzer = document.getElementById("regBenutzer");
            let inputPassword = document.getElementById("regPassword");
            let inputStudiengang = document.getElementById("regStudiengang"); //number
            let inputSemesterangabe = document.getElementById("regSemesterangabe");
            auswertenBenutzerVorhanden(inputBenutzer.value, inputFirstName.value, inputLastName.value, inputPassword.value, inputStudiengang.value, inputSemesterangabe.value);
        });
    }
    async function auswertenBenutzerVorhanden(username, firstname, lastname, password, studiengang, semesterangabe) {
        let registerElementMsg = document.getElementById("textRegister");
        if (typeof (registerElementMsg) != "undefined" && registerElementMsg != null) {
            registerElementMsg.remove();
        }
        let _divRegister = document.getElementById("messageRegister");
        let text = document.createElement("p");
        text.id = "textRegister";
        // hier sschauen bei Anfrage an server der Datenbankinhalte, schauen dass nicht null und wenn dann skipe überprüfung der EMail
        if (username != undefined && username != null && username != "") {
            if (password != undefined && password != null && password != "") {
                try {
                    let eingabe = {
                        site: "register",
                        username: username,
                        firstname: firstname,
                        lastname: lastname,
                        password: password,
                        studiengang: studiengang,
                        semesterangabe: semesterangabe
                    };
                    /* //Mit stringify oder ohne
                    let jsonDaten: string = JSON.stringify(eingabe);
                    console.log("Eingabe in einen JSON String" + jsonDaten);
                    */
                    let query = new URLSearchParams(eingabe);
                    let serverMitDatenUrl = serverUrl + "?" + query.toString();
                    console.log("Server Url mit eingabe als query: " + serverMitDatenUrl);
                    let registerErfolg = await serverAnfrage(serverMitDatenUrl);
                    // Hier die WebsiteMSG einfügen nicht in auswertenEmailVorhanden
                    if (registerErfolg) {
                        sessionStorage.clear();
                        // auf die Seite Hauptseite referieren und den Benutzernamen in sessionStorage
                        sessionStorage.setItem("username", username);
                        sessionStorage.setItem("profilname", username);
                        window.location.href = window.location.pathname.substring(0, window.location.pathname.length - 20) + "/main/index.html";
                    }
                    else {
                        text.className = "textFalsch"; // Textformat klasse
                        text.appendChild(document.createTextNode("Der Benutzername ist schon vergeben"));
                    }
                }
                catch (e) {
                    //
                }
            }
            else {
                text.className = "textFalsch"; // Textformat klasse
                text.appendChild(document.createTextNode("Es wurde kein gültiges Passwort eingeben"));
            }
        }
        else {
            text.className = "textFalsch"; // Textformat klasse
            text.appendChild(document.createTextNode("Es wurde kein gültiger Benutzername eingeben"));
        }
        _divRegister.appendChild(text);
    }
    async function serverAnfrage(_url) {
        let response = await fetch(_url);
        let antwort = await response.json();
        if (antwort.msg == "erfolg") {
            return true;
        }
        else {
            return false;
        }
    }
    main();
})(register || (register = {}));
//# sourceMappingURL=scriptRegister.js.map