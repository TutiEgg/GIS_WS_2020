"use strict";
var register;
(function (register) {
    //let serverUrl: string = "http://127.0.0.1:8100";
    let serverUrl = "https://lucamosergis2020.herokuapp.com/";
    let username = "Fehler";
    async function main() {
        letUsername();
        let btnAdd = document.getElementById("btnAdd");
        btnAdd.addEventListener("click", addBeitrag);
        let optionSort = document.getElementById("sort");
        let sortEingabe = optionSort.value;
        hauptseiteReload(sortEingabe);
    }
    async function hauptseiteReload(sort) {
        let hauptProfilNavi = document.getElementById("hauptProfil");
        hauptProfilNavi.addEventListener("click", function funcProfil() {
            sessionStorage.setItem("profilname", sessionStorage.getItem("username"));
        });
        let divBeitragBox = document.getElementById("flexcontainer");
        deleteBeitragListe(divBeitragBox);
        createbeitragListe(sort, divBeitragBox, await getBeitrageListe(serverUrl));
        console.log("sessionStorage inhalt: " + sessionStorage.getItem("username") + sessionStorage.getItem("profilname"));
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
    function createbeitragListe(sort, divBeitragBox, beitragListe) {
        // sortieren
        //let beitragListeSortiert: Beitrag[] = beitragListSortieren(sort, beitragListe);
        let beitragListeSortiert = beitragListe;
        for (let i = 0; i < beitragListeSortiert.length; i++) {
            let divBeitragText = document.createElement("div");
            divBeitragText.id = "beitrag" + i;
            let spanBeitragDate = document.createElement("span");
            divBeitragText.appendChild(document.createTextNode("" + beitragListeSortiert[i].text));
            divBeitragText.appendChild(spanBeitragDate);
            spanBeitragDate.appendChild(document.createTextNode(beitragListeSortiert[i].username + " am " + beitragListeSortiert[i].date));
            spanBeitragDate.addEventListener("click", function funcBeitrag() {
                sessionStorage.removeItem("profilname");
                sessionStorage.setItem("profilname", "" + beitragListeSortiert[i].username);
                window.location.href = window.location.pathname.substring(0, window.location.pathname.length - 11) + "/Profil/index.html";
                //window.document.location.href = "/profil/index.html"; 
                console.log("Beitrag name Klick: " + beitragListeSortiert[i].username);
            });
            divBeitragBox.appendChild(divBeitragText);
        }
    }
    /*
    function beitragListSortieren( sort: string, beitragListe: Beitrag[]): Beitrag[] {

        let antwort: Beitrag[] = beitragListe.sort();
        return antwort;

        switch (sort) {
            case "datumNeu": {

                break;
            }case "datumAlt": {
                break;
            }case "benutzerVorne": {
                break;
            }case "benutzerHinten": {
                break;
            }case "shuffel": {
                break;
            } default : {
                return beitragListe;
            }
        }

    }

    function sortieren(bl: Beitrag[], highPrio: string, lowPrio: string): Beitrag[] {

    }*/
    function deleteBeitragListe(divParent) {
        if (divParent.hasChildNodes()) {
            while (divParent.firstChild) {
                divParent.removeChild(divParent.firstChild);
            }
        }
    }
    async function getBeitrageListe(_url) {
        let eingabe = { site: "getBeitrag", username: sessionStorage.getItem("username") };
        let query = new URLSearchParams(eingabe);
        let serverMitDatenUrl = serverUrl + "?" + query.toString();
        let beitragListe = await serverAnfrageGet(serverMitDatenUrl);
        return beitragListe;
    }
    async function addBeitrag() {
        let modal = document.getElementById("myModal");
        let span = document.getElementById("closeModal");
        // Modal anzeigen lassen
        modal.style.display = "block";
        // wenn auf den X-Buttton geklickt wird, soll er den Modal schließen
        span.onclick = function () {
            modal.style.display = "none";
        };
        // wenn außerhalb des Modals geklicked wird, wird er geschloßen
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
        let btnSend = document.getElementById("btnBeitragSend");
        btnSend.addEventListener("click", async function sendBeitrag() {
            let textFeld = document.getElementById("textFeld");
            let beitragText = textFeld.value;
            if (beitragText.length != 0) {
                const date = new Date();
                let jsonStringDate = date.getDate() + "." + date.getMonth() + 1 + "." + date.getFullYear() + " um " + date.getHours() + ":" + date.getMinutes();
                let beitragSend = { site: "addBeitrag", text: beitragText, date: jsonStringDate, username: sessionStorage.getItem("username") };
                //let beitragSend: beitragSend = {site: "addBeitrag", text: beitragText, date: jsonStringDate, username: sessionStorage.getItem(username)};
                let query = new URLSearchParams(beitragSend);
                let serverMitDatenUrl = serverUrl + "?" + query.toString();
                let erfolg = await serverAnfrageSend(serverMitDatenUrl); // Antwort hinzufügen
                if (erfolg) {
                    textFeld.className = "textFeld";
                    textFeld.placeholder = "";
                    modal.style.display = "none";
                    textFeld.value = "";
                    btnSend.removeEventListener("click", sendBeitrag);
                    hauptseiteReload();
                }
                else {
                    //
                }
            }
            else {
                textFeld.className = "textFeldError";
                textFeld.placeholder = "Es muss was eingetragen werden"; //ändern zu:  es muss was eingetragen werden
            }
        });
    }
    function createUrlQuery(msg) {
        let query = new URLSearchParams(msg);
        let serverMitDatenUrl = serverUrl + "?" + query.toString();
        return serverMitDatenUrl;
    }
    async function serverAnfrageGet(_url) {
        let response = await fetch(_url);
        console.log(response);
        let antwort = await response.json();
        return antwort;
    }
    async function serverAnfrageSend(_url) {
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
//# sourceMappingURL=scriptHaupt.js.map