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

    let listVorhanden: boolean = false;

    function main(): void {

        let buttonList: HTMLInputElement = <HTMLInputElement>document.getElementById("listButton");
        buttonList.addEventListener("click", function funcList(): void {
            list();
        });  
    }

    async function list(): Promise<void> {
            //list name
            if (!listVorhanden) {

                let _divListe: HTMLDivElement;
                let daten: Daten[] = await serverAnfrage(_serverUrl);
                _divListe = <HTMLDivElement>document.getElementById("liste");
                for (let i: number = 0; i < daten.length; i++) {
        
                        let text: HTMLParagraphElement = document.createElement("p");
                        text.className = "textlist"; // Textformat klasse
                        text.id = "listeintrag" + i; // 
                        text.appendChild(document.createTextNode(i + "  Nachname:  " + JSON.stringify(daten[i].lastname) + "  Vorname:  " + JSON.stringify(daten[i].firstname)));
                        _divListe.appendChild(text);
                        //let wert : string = JSON.stringify(benuterArr[i].lastname);
                        listVorhanden = true;
                }
            }
    }

    async function serverAnfrage(_url: RequestInfo): Promise<Daten[]> {
        let response: Response = await fetch(_url);
        let datenbankInhalt: Daten[] = await response.json();
        return datenbankInhalt;
        console.log("ServerResponse = " + response);
    } 

    main();

}

