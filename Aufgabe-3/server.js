"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aufgabe_3 = void 0;
/*
import * as Mongo from "mongodb";

let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
await mongoClient.connect();
*/
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
//import { PassThrough } from "stream";
var Aufgabe_3;
(function (Aufgabe_3) {
    let eingabe; // 
    let port = Number(process.env.PORT); // Port zuweisen für den Server
    if (!port) {
        port = 8100; // Falls kein Port angegeben ist 8100 benutzen    5500       
    }
    //let databaseUrl: string = "mongodb://localhost:27017";
    let databaseUrl = "mongodb+srv://Testuser:test@luca.bhhsd.mongodb.net/datenbank?retryWrites=true&w=majority";
    startServer(port);
    // Verbinden
    connectToDatabase(databaseUrl);
    async function connectToDatabase(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        eingabe = mongoClient.db("datenbank").collection("Benutzer");
        console.log("Datenbank Verbindung hergestellt ", eingabe != undefined);
    }
    function startServer(_port) {
        let server = Http.createServer(); // Server variable
        console.log("Server wird gestartet mit dem Port: " + _port);
        server.listen(_port);
        server.addListener("request", handleRequest); // Listener hinzufügen
        server.addListener("listening", handleListen);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        console.log("I hear voices!");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        // Wenn _request.url einen query hat muss eingetragen werden in die DB (response erfolgt oder nicht) und wenn nicht soll es als _response einen JSON String[] (array)zurückgeben mit den Datenbank werten
        if (_request.url) {
            console.log("url ja: ");
            let url = Url.parse(_request.url, true);
            // console.log("url href: " + url.href);
            console.log();
            if (Object.keys(url.query).length > 2) {
                console.log("url query ja: ");
                let jsonString = JSON.stringify(url.query);
                let eingabeString = JSON.parse(jsonString);
                storeEingabe(eingabeString);
                //_response.write("Datensätze wurden eingetragen");
                _response.end("Datensätze wurden eingetragen");
            }
            else if (Object.keys(url.query).length == 2 || Object.keys(url.query).length == 1) {
                //let benutzerArr: Daten[] = await retrieveDaten();
                let benutzerString = await retrieveDaten();
                //_response.write(benutzerArr);
                _response.end(benutzerString);
            }
            else {
                try {
                    //let benutzerArr: Daten[] = await retrieveDaten();
                    let benutzerString = await retrieveDaten();
                    //_response.write(benutzerArr);
                    _response.end(benutzerString);
                }
                catch (e) {
                    // 
                }
            }
            // Zum Anzeigen auf der htmlseite
            /*
            for (let key in url.query) {
                _response.write(key + ":" + url.query[key] + "<br/>");
            }
            
            let jsonString: string = JSON.stringify(url.query);
            _response.write(jsonString);*/
            // let test: Eingabe = url.query;
        }
        _response.end();
    }
    function storeEingabe(_eingabe) {
        eingabe.insertOne(_eingabe);
        //console.log("hier: " + _eingabe.email);
    }
    /*async function retrieveDaten(): Promise<Daten[]> {
        let eingabeArr: Daten[] = await eingabe.find().toArray();
        return eingabeArr;
    }*/
    async function retrieveDaten() {
        let eingabeArr = await eingabe.find().toArray();
        let eingabeJson = await JSON.stringify(eingabeArr);
        return eingabeJson;
    }
})(Aufgabe_3 = exports.Aufgabe_3 || (exports.Aufgabe_3 = {}));
/*

async function communicate(_url: RequestInfo): Promise<void> {
    let response: Response = await fetch(_url);
    console.log("Response", response);

    msg = await response.json();
    console.log(msg);

    datenEinsortieren(msg.kopfform, 0);
    datenEinsortieren(msg.kopffarbe, 1);
    datenEinsortieren(msg.kopfkugel, 2);
    datenEinsortieren(msg.bodyform, 3);
    datenEinsortieren(msg.bodyfarbe, 4);
    datenEinsortieren(msg.bodyfenster, 5);
    datenEinsortieren(msg.footform, 6);
    datenEinsortieren(msg.footfarbe, 7);
    datenEinsortieren(msg.footfeuer, 8);
    _bezeichnung = msg.bezeichnung;

}

interface ServerMsg {
    error: string;
    message: string;
}



async function serverAnfrage(_url: RequestInfo): Promise<void> {

   // let browserAuswahlDaten: JSON = JSON.stringify([sessionStorage.getItem("kopfform"), sessionStorage.getItem("kopffarbe"), sessionStorage.getItem("kopfkugel"), sessionStorage.getItem("bodyform")]);
   // let browserAuswahlDaten: JSON = JSON.parse(sessionStorage.getItem("Kopfform"));
   // console.log("Bowserauswahl zurückgeben: " + browserAuswahlDaten);

   let query: URLSearchParams = new URLSearchParams(<any>sessionStorage);
   _url = _url + "?" + query.toString();

   let response: Response = await fetch(_url);
   console.log("Response: ", response);

   let antwort: ServerMsg = await response.json();
   console.log("Die Antwort: " + antwort.error);
   console.log("Die Antwort: " + antwort.message);


   let _divElementMsg: HTMLDivElement = <HTMLDivElement> document.getElementById("msg");
   let textMsg: HTMLParagraphElement = document.createElement("p");
   textMsg.className = "textright";
   textMsg.id = "serverNachricht";
   if (antwort.message != undefined) {
        textMsg.className = "erfolg";
        textMsg.appendChild(document.createTextNode("Serverantwort: " + antwort.message));
    } else if (antwort.error != undefined) {
        textMsg.className = "error";
        textMsg.appendChild(document.createTextNode("Serverantwort: " + antwort.error));
    }

   _divElementMsg.appendChild(textMsg);



}

*/
//# sourceMappingURL=server.js.map