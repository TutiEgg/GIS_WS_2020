/*
import * as Mongo from "mongodb";

let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
await mongoClient.connect();
*/
//import * as Http from "http";
//import * as Url from "url";
//import * as Mongo from "mongodb";
//import { PassThrough } from "stream";

namespace Aufgabe_3 {


    interface Daten {
        [type: string]: string | string[] | number;                   // array-möglichkeit nur falls später benötigt
    }
    //let _serverUrl: string = "http://127.0.0.1:8100";
    
    let _serverUrl: string = "https://lucamosergis2020.herokuapp.com/";

    

    function main(): void {
        /*
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/index.html") {
        } else if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/einloggen.html") {
        } else if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/list.html") {
        }*/

        // Button Registrieren, Einloggen und Liste führen zu unterscheidliche Dateien + eine Algemeine Methode für die Serveranfrage bei der Daten von Db zurückgegeben werden und eine Methode die Werte in die Db schreibt 
        let buttonRegister: HTMLInputElement = <HTMLInputElement>document.getElementById("registerButton");
        buttonRegister.addEventListener("click", async function funcRegister(): Promise<void> {

            let inputFirstName: HTMLInputElement = <HTMLInputElement>document.getElementById("regFirstName");
            let inputLastName: HTMLInputElement = <HTMLInputElement>document.getElementById("regLastName");
            let inputEmail: HTMLInputElement = <HTMLInputElement>document.getElementById("regEmail");
            let inputPassword: HTMLInputElement = <HTMLInputElement>document.getElementById("regPassword");
            let inputBirthyear: HTMLInputElement = <HTMLInputElement>document.getElementById("regBirthyear"); //number
            let inputGender: HTMLSelectElement = <HTMLSelectElement>document.getElementById("regGender");

            let datenSenden: boolean = await auswertenEmailVorhanden(inputEmail.value, inputPassword.value);
            if (datenSenden) {
                let eingabe: Daten =  {firstname: inputFirstName.value, lastname: inputLastName.value, email: inputEmail.value, password: inputPassword.value, birthyear: inputBirthyear.value, gender: inputGender.value};
                let jsonDaten: string = JSON.stringify(eingabe);
                console.log("Eingabe in einen JSON String" + jsonDaten);

                let query: URLSearchParams = new URLSearchParams(<any>eingabe);
                let serverMitDatenUrl: string = _serverUrl + "?" + query.toString();
                console.log("Server Url mit eingabe als query: " + serverMitDatenUrl);
                datenbankEintrag(serverMitDatenUrl);
                // Hier die WebsiteMSG einfügen nicht in auswertenEmailVorhanden
                
            } else { // else nur zur Überprüfung
                console.log("email ist vorhanden bei Registirerungsversuch oder server antwort zuspät");
            }
            
        });
        
    }

    async function auswertenEmailVorhanden(email: string, password: string): Promise<boolean> { // wenn eingabe = null ist noch überprüfen
        console.log("Email wird auf vorhanden sein überprüft");

        /*_response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url) {
                let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
                // Zum Anzeigen auf der htmlseite
                
                for (let key in url.query) {
                    _response.write(key + ":" + url.query[key] + "<br/>");
                }
                
                let jsonString: string = JSON.stringify(url.query);
                _response.write(jsonString);
        }*/
        
    
        let datenSenden: boolean = true;

        console.log("serverAnfrage vorbei");

        let registerElementMsg: HTMLElement =  document.getElementById("textRegister");
        if (typeof(registerElementMsg) != "undefined" && registerElementMsg != null) {
            registerElementMsg.remove(); 
        }

        let _divRegister: HTMLDivElement = <HTMLDivElement>document.getElementById("messageRegister");
        let text: HTMLParagraphElement = document.createElement("p");
        text.id = "textRegister"; 
    
        if (email != undefined && email != null && email != "") {
            if (password != undefined && password != null && password != "") {
                try {
                    let daten: Daten[] = await serverAnfrage(_serverUrl); // await dazu vielleicht
                    for (let i: number = 0; i < daten.length; i++) {
                        let emailString: string = "\"" + email + "\"";
                        //let emailString: string = email;
                        console.log(JSON.stringify(daten[i].email).toString() + " == " + emailString); // "mmlpv.mossder@gmx.de" == mmlpv.mossder@gmx.de !!!FALSCH rumtesten
                        if (JSON.stringify(daten[i].email) == emailString) { // benutzerArr[i].email.toStkring() kann undefined sein ... muss gelöst werden durch vollständige Formular ausfüllung
                                            
                            console.log("jaaa ist gleich" + i);
                            datenSenden = false;
                            break;
                        }
                                    
                                    
                    }
                } catch ( e ) {
                    //
                }
                
                
                if (datenSenden) {
                    console.log("wird eingetragen");
                    text.className = "textRichtig"; // Textformat klasse
                    text.appendChild(document.createTextNode("Die Daten wurden eingetragen")); // Abfrage ob eintrag erfolg ist
                    

                } else {
                    console.log("die Email ist schon vorhanden");
                    text.className = "textFalsch"; // Textformat klasse
                    text.appendChild(document.createTextNode("Die Email ist schon Registriert"));
                }
            } else {
                datenSenden = false;
                text.className = "textFalsch"; // Textformat klasse
                text.appendChild(document.createTextNode("Es wurde kein Passwort eingegeben"));
            }
        } else {
            datenSenden = false;
            text.className = "textFalsch"; // Textformat klasse
            text.appendChild(document.createTextNode("Es wurde keine gültige Email eingegeben"));
        }
        _divRegister.appendChild(text);
        
        return datenSenden;
        
    }

    async function serverAnfrage(_url: RequestInfo): Promise<Daten[]> {
        let response: Response = await fetch(_url);
        let datenbankInhalt: Daten[] = await response.json();
        return datenbankInhalt;
        //console.log("ServerResponse = " + response);
    } 

    async function datenbankEintrag(_url: RequestInfo): Promise<void> {
        let response: Response = await fetch(_url);
        console.log("Antwort des Servers nach Eintragsanfrage: " + response);
    }

    main();

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
