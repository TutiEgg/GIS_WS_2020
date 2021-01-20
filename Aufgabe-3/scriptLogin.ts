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
namespace Aufgabe_3 {


    interface Daten {
        [type: string]: string | string[] | number;                   // array-möglichkeit nur falls später benötigt
    }
    //let _serverUrl: string = "http://localhost:8100/";
    let _serverUrl: string = "https://lucamosergis2020.herokuapp.com/";
    

    function main(): void {
        let buttonLogin: HTMLInputElement = <HTMLInputElement>document.getElementById("loginButton");
        buttonLogin.addEventListener("click", function funcLogin(): void {

            let inputEmail: HTMLInputElement = <HTMLInputElement>document.getElementById("loginEmail");
            let inputPassword: HTMLInputElement = <HTMLInputElement>document.getElementById("loginPassword");
            auswertenLogin(inputEmail.value, inputPassword.value);  
        }); 
    }
    
    async function auswertenLogin(email: string, password: string): Promise<void> { // wenn eingabe = null ist noch überprüfen
         // Einloggen

         let daten: Daten[] = await serverAnfrage(_serverUrl); // await dazu vielleicht

         let emailIstVorhanden: boolean = false;
         let passwortRichtig: boolean = false;
         

         let loginElementMsg: HTMLElement =  document.getElementById("textLogin");
         if (typeof(loginElementMsg) != "undefined" && loginElementMsg != null) {
              loginElementMsg.remove(); 
         }

         let _divLogin: HTMLDivElement = <HTMLDivElement>document.getElementById("messageLogin");
         let text: HTMLParagraphElement = document.createElement("p");
         text.id = "textLogin"; 

         if (email != undefined) {
             for (let i: number = 0; i < daten.length; i++) {
                 let emailString: string = "\"" +email + "\"";
                 //let emailString: string = email;
                 console.log(JSON.stringify(daten[i].email).toString() + " == " + emailString); // "mmlpv.mossder@gmx.de" == mmlpv.mossder@gmx.de !!!FALSCH rumtesten
                 if (JSON.stringify(daten[i].email) == emailString) { // benutzerArr[i].email.toString() kann undefined sein ... muss gelöst werden durch vollständige Formular ausfüllung
                             
                     console.log("jaaa ist gleich" + i);
                     emailIstVorhanden = true;
                     //let passwordString: string = "\"" + password + "\"";
                     let passwordString: string = password;
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
                         
                     } else {
                         text.className = "textFalsch"; // Textformat klasse
                         text.appendChild(document.createTextNode("Die Email ist vorhanden, aber das Passwort ist falsch!")); 
                     }
                     
             } else {
                 console.log("die Email ist nicht in der Datenbank eingetragen");
                 text.className = "textFalsch"; // Textformat klasse
                 text.appendChild(document.createTextNode("Die Email ist noch nicht in der Datenbank eingetragen"));
             }    

         } else {
             console.log("keine Email angegeben");
             text.className = "textFalsch"; // Textformat klasse
             text.appendChild(document.createTextNode("Es wurde keine Email eingegeben"));
         }
         _divLogin.appendChild(text);
    }


    async function serverAnfrage(_url: RequestInfo): Promise<Daten[]> {
        let response: Response = await fetch(_url);
       // console.log("Response: ", response.json());
        let datenbankInhalt: Daten[] = await response.json();
        
        //console.log("ServerResponse = " + response);
        return datenbankInhalt;
    } 
    main();

}


