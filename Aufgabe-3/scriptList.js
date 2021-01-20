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
var Aufgabe_3;
(function (Aufgabe_3) {
    //let _serverUrl: string = "http://127.0.0.1:8100";
    let _serverUrl = "http://lucamosergis2020.herokuapp.com/";
    let listVorhanden = false;
    function main() {
        let buttonList = document.getElementById("listButton");
        buttonList.addEventListener("click", function funcList() {
            list();
        });
    }
    async function list() {
        //list name
        if (!listVorhanden) {
            let _divListe;
            let daten = await serverAnfrage(_serverUrl);
            _divListe = document.getElementById("liste");
            for (let i = 0; i < daten.length; i++) {
                let text = document.createElement("p");
                text.className = "textlist"; // Textformat klasse
                text.id = "listeintrag" + i; // 
                text.appendChild(document.createTextNode(i + "  Nachname:  " + JSON.stringify(daten[i].lastname) + "  Vorname:  " + JSON.stringify(daten[i].firstname)));
                _divListe.appendChild(text);
                //let wert : string = JSON.stringify(benuterArr[i].lastname);
                listVorhanden = true;
            }
        }
    }
    async function serverAnfrage(_url) {
        let response = await fetch(_url);
        let datenbankInhalt = await response.json();
        return datenbankInhalt;
        console.log("ServerResponse = " + response);
    }
    main();
})(Aufgabe_3 || (Aufgabe_3 = {}));
//# sourceMappingURL=scriptList.js.map