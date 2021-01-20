/*
import * as Mongo from "mongodb";

let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
await mongoClient.connect();
*/
import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";
//import { PassThrough } from "stream";

export namespace Aufgabe_3 {

    interface Daten {
        [type: string]: string | string[] | number;                   // array-möglichkeit nur falls später benötigt
    }

    let eingabe: Mongo.Collection;                          // 
    let port: number = Number(process.env.PORT);            // Port zuweisen für den Server
    if (!port) {
        port = 8100;                                        // Falls kein Port angegeben ist 8100 benutzen    5500       
    }
    //let databaseUrl: string = "mongodb://localhost:27017";

    let databaseUrl: string = "mongodb+srv://Testuser:test@luca.bhhsd.mongodb.net/datenbank?retryWrites=true&w=majority";

    startServer(port);
                                         // Verbinden
    connectToDatabase(databaseUrl);

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        eingabe = mongoClient.db("datenbank").collection("Benutzer");
        console.log("Datenbank Verbindung hergestellt ", eingabe != undefined);
    }

    function startServer(_port: number | string): void {
        let server: Http.Server = Http.createServer();          // Server variable
         
        console.log("Server wird gestartet mit dem Port: " + _port);  

        server.listen(_port);
        server.addListener("request", handleRequest);   // Listener hinzufügen
        server.addListener("listening", handleListen);
    }
    

    function handleListen(): void {                 // Start des Servers
        console.log("Listening");
    }
    

    
    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> { // wenn eingabe = null ist noch überprüfen
        console.log("I hear voices!");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        // Wenn _request.url einen query hat muss eingetragen werden in die DB (response erfolgt oder nicht) und wenn nicht soll es als _response einen JSON String[] (array)zurückgeben mit den Datenbank werten
        if (_request.url) {
                console.log("url ja: ");
                let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
               // console.log("url href: " + url.href);
                console.log();
                if (Object.keys(url.query).length > 2) {
                    console.log("url query ja: ");
                    let jsonString: string = JSON.stringify(url.query);
                    let eingabeString: Daten = JSON.parse(jsonString);
                    storeEingabe(eingabeString);
                    //_response.write("Datensätze wurden eingetragen");
                    _response.end("Datensätze wurden eingetragen");
                } else if (Object.keys(url.query).length == 2 || Object.keys(url.query).length == 1) {
                    //let benutzerArr: Daten[] = await retrieveDaten();
                    let benutzerString: string = await retrieveDaten();

                    //_response.write(benutzerArr);
                    _response.end(benutzerString);
                } else {
                    try {
                        //let benutzerArr: Daten[] = await retrieveDaten();
                    let benutzerString: string = await retrieveDaten();

                    //_response.write(benutzerArr);
                    _response.end(benutzerString);
                    } catch (e) {
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

    function storeEingabe(_eingabe: Daten): void {
        eingabe.insertOne(_eingabe);
        //console.log("hier: " + _eingabe.email);
    }
    /*async function retrieveDaten(): Promise<Daten[]> {
        let eingabeArr: Daten[] = await eingabe.find().toArray();
        return eingabeArr;
    }*/
    async function retrieveDaten(): Promise<string> {
        let eingabeArr: Daten[] = await eingabe.find().toArray();
        let eingabeJson: string = await JSON.stringify(eingabeArr);
        return eingabeJson;
    }
}










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
