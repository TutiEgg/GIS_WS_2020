"use strict";
var register;
(function (register) {
    let serverUrl = "https://lucamosergis2020.herokuapp.com/";
    //let serverUrl: string = "http://127.0.0.1:8100";
    let username = "Fehler";
    function main() {
        letUsername();
        let divProfil = document.getElementById("divUserProfil");
        createProfil(divProfil);
        /* später
        let divFollowedUserList: HTMLDivElement = <HTMLDivElement>document.getElementById("allFollowedList");
        let divFollowersList: HTMLDivElement = <HTMLDivElement>document.getElementById("allFollowersList");
        */
    }
    function letUsername() {
        let divUsername = document.getElementById("divUsername");
        if (divUsername.hasChildNodes()) {
            divUsername.removeChild(divUsername.firstChild);
        }
        let usernameText = document.createElement("p");
        usernameText.id = "username";
        usernameText.className = "usernameHaupt";
        username = sessionStorage.getItem("username");
        if (username != null) {
            usernameText.appendChild(document.createTextNode(username));
        }
        else {
            usernameText.appendChild(document.createTextNode("Fehler"));
        }
        divUsername.appendChild(usernameText);
    }
    function toKeysVonList(value) {
        return Object.keys(value);
    }
    async function createProfil(divParent) {
        deleteElements(divParent);
        let getDatenUser = { site: "getDatenProfil", username: sessionStorage.getItem("profilname") };
        console.log(sessionStorage.getItem("profilname"));
        //let getDatenUser: List = {site: "getDatenProfil", username: sessionStorage.getItem("profilname")};
        let datenUser = await serverAnfrageGet(createUrlQuery(getDatenUser));
        //let datenUser: List = {text: "texts", username: "Luca" , date: "22"};
        let keysVonDaten = toKeysVonList(datenUser); // Um mögliche Datenangaben variabel halten zukönnen
        //console.log(keysVonDaten[0]);
        for (let i = 0; i < keysVonDaten.length; i++) {
            let keyDaten = "" + keysVonDaten[i];
            if ("_id" == keyDaten || "follower" == keyDaten || "beitraglist" == keyDaten) {
                // Damit _id, follower und beitraglist nicht im Profil angezeigt werden
            }
            else {
                let divOneData = document.createElement("div");
                divOneData.id = "data_" + i;
                let btnData = document.createElement("button");
                let pData = document.createElement("p");
                let divKey = document.createElement("div");
                let divValue = document.createElement("div");
                divKey.appendChild(document.createTextNode(keyDaten + ": "));
                divValue.appendChild(document.createTextNode("" + datenUser[keysVonDaten[i]]));
                pData.appendChild(divKey);
                pData.appendChild(divValue);
                if (keyDaten == "username") {
                    // Damit Username nicht bearbeitet werden kann
                    divKey.className = "usernameKeyProfil";
                    divValue.className = "usernameValueProfil";
                }
                else {
                    divKey.className = "keyProfil";
                    divValue.className = "valueProfil";
                    // Damit man nur sein eigenes Profil bearbeiten kann
                    if (sessionStorage.getItem("username") == sessionStorage.getItem("profilname")) {
                        divValue.appendChild(btnData);
                    }
                    //divKey.appendChild(divValue);
                    btnData.appendChild(document.createTextNode("Bearbeiten"));
                    btnData.className = "btnProfil";
                    btnData.addEventListener("click", async function funcBtnBearbeiten() {
                        let valueName = "" + datenUser[keysVonDaten[i]];
                        let keyName = keyDaten;
                        let btnFinish = document.createElement("button");
                        btnFinish.appendChild(document.createTextNode("Fertig"));
                        deleteElements(divValue);
                        let eingabeFeld = document.createElement("textarea");
                        eingabeFeld.cols = 15;
                        eingabeFeld.rows = 2;
                        eingabeFeld.placeholder = valueName;
                        eingabeFeld.maxLength = 30;
                        divValue.appendChild(eingabeFeld);
                        btnFinish.className = "btnProfil";
                        divValue.appendChild(btnFinish);
                        btnFinish.addEventListener("click", async function funcBtnFinish() {
                            if (eingabeFeld.value != "") { // Keine Überprüfung ob leerzwichen drinnen sind
                                let getDatenUser = { site: "changeProfil", username: sessionStorage.getItem("username"), key: keyName, keyValue: eingabeFeld.value };
                                let erfolg = await serverAnfrageSend(createUrlQuery(getDatenUser));
                                console.log("Eingabe: " + eingabeFeld.value + erfolg);
                                main();
                            }
                            eingabeFeld.placeholder = "Eingabe wird benötigt";
                        });
                    });
                }
                divOneData.appendChild(pData);
                divParent.appendChild(divOneData);
            }
        }
        // Profil komplett bearbeiten (Später). Vielleicht noch eigene Daten hinzufügbar z.B Alter oder Adresse
        /*
        let btnEdit: HTMLButtonElement = document.createElement("button");
        btnEdit.className = "btnEdit";
        btnEdit.appendChild(document.createTextNode("Profil bearbeiten"));
        btnEdit.addEventListener("click", async function funcBtnEdit(): Promise<void> {
            // öffnet Modal worauf generiete felder zum Ausfüllen sind mit bestätigenbutton
           
        });
        divParent.appendChild(btnEdit); */
    }
    function deleteElements(divList) {
        if (divList.hasChildNodes()) {
            while (divList.firstChild) {
                divList.removeChild(divList.firstChild);
            }
        }
    }
    function createUrlQuery(msg) {
        let query = new URLSearchParams(msg);
        let serverMitDatenUrl = serverUrl + "?" + query.toString();
        return serverMitDatenUrl;
    }
    async function serverAnfrageGet(_url) {
        let response = await fetch(_url);
        let antwort = await response.json();
        return antwort;
    }
    async function serverAnfrageSend(_url) {
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
})(register || (register = {}));
//# sourceMappingURL=scriptProfil.js.map