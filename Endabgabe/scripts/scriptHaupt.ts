namespace register {
    
    interface List {
        [type: string]: string | string[];
    }
    interface ServerMsg {
        msg: string;
    }

    interface Beitrag {
        text: string;
        date: string;
        username: string;
    }
    interface BeitragSend {
        site: string;
        text: string;
        date: string;
        username: string;
    }

    let serverUrl: string = "http://127.0.0.1:8100";
    //let serverUrl: string = "https://lucamosergis2020.herokuapp.com/";
    let username: string = "Fehler";

    async function main(): Promise<void> {
        letUsername();
        
        let btnAdd: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btnAdd");
        btnAdd.addEventListener("click", addBeitrag);

        //let optionSort: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sort");
        //let sortEingabe: string = optionSort.value;

        hauptseiteReload();

        
    }

    async function hauptseiteReload(): Promise<void> {

        let hauptProfilNavi: HTMLLIElement = <HTMLLIElement>document.getElementById("hauptProfil");
        hauptProfilNavi.addEventListener("click", function funcProfil(): void {
            sessionStorage.setItem("profilname" , sessionStorage.getItem("username"));
        });

        let divBeitragBox: HTMLDivElement = <HTMLDivElement>document.getElementById("flexcontainer");
        deleteBeitragListe(divBeitragBox);

        createbeitragListe(divBeitragBox , await getBeitrageListe(serverUrl));
        console.log("sessionStorage inhalt: " + sessionStorage.getItem("username") + sessionStorage.getItem("profilname"));
    }

    function letUsername(): void {
        let divUsername: HTMLDivElement = <HTMLDivElement>document.getElementById("divUsername");
        if (divUsername.hasChildNodes()) {
            divUsername.removeChild(divUsername.firstChild);
        }
        let usernameText: HTMLParagraphElement = document.createElement("p");
        usernameText.id = "username"; 
        usernameText.className = "usernameHaupt";

        username  = sessionStorage.getItem("username");
        
        if (username != null) {  
            usernameText.appendChild(document.createTextNode(username));
        } else {
            usernameText.appendChild(document.createTextNode("Fehler"));   
        }
        divUsername.appendChild(usernameText);
    }

    function createbeitragListe(divBeitragBox: HTMLDivElement, beitragListe: Beitrag[]): void {
        // sortieren
        //let beitragListeSortiert: Beitrag[] = beitragListSortieren(sort, beitragListe);
        let beitragListeSortiert: Beitrag[] = beitragListe;

        for (let i: number = 0; i < beitragListeSortiert.length; i++) {
            let divBeitragText: HTMLDivElement = document.createElement("div");
            divBeitragText.id = "beitrag" + i;
            let spanBeitragDate: HTMLSpanElement = document.createElement("span");

            divBeitragText.appendChild(document.createTextNode("" + beitragListeSortiert[i].text));
            divBeitragText.appendChild(spanBeitragDate);
            spanBeitragDate.appendChild(document.createTextNode(beitragListeSortiert[i].username + " am " + beitragListeSortiert[i].date));
            spanBeitragDate.addEventListener("click", function funcBeitrag(): void {
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

    function deleteBeitragListe(divParent: HTMLDivElement): void {
        if (divParent.hasChildNodes()) {
            while (divParent.firstChild) {
                divParent.removeChild(divParent.firstChild);
            }
        }
    }


    async function getBeitrageListe(_url: RequestInfo): Promise<Beitrag[]> {

        
        let eingabe: List =  {site: "getBeitrag", username: sessionStorage.getItem("username")};
        let query: URLSearchParams = new URLSearchParams(<any>eingabe);
        let serverMitDatenUrl: string = serverUrl + "?" + query.toString();
        let beitragListe: Beitrag[] = await serverAnfrageGet(serverMitDatenUrl);
        return beitragListe;
        
    }

    async function addBeitrag(): Promise<void> {

        let modal: HTMLDivElement = <HTMLDivElement>document.getElementById("myModal");
        let span: HTMLSpanElement = <HTMLSpanElement>document.getElementById("closeModal");
        
        // Modal anzeigen lassen
        modal.style.display = "block";
        
        // wenn auf den X-Buttton geklickt wird, soll er den Modal schließen
        span.onclick = function(): void {
            modal.style.display = "none";
        };

        // wenn außerhalb des Modals geklicked wird, wird er geschloßen
        window.onclick = function(event: any) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        let btnSend: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btnBeitragSend");

        btnSend.addEventListener("click", async function sendBeitrag(): Promise<void> {

            let textFeld: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("textFeld");
            let beitragText: string = textFeld.value;

            

            if (beitragText.length != 0) {
                const date  = new Date();
                let jsonStringDate: string = date.getDate() + "." + date.getMonth() + 1  + "." + date.getFullYear() + " um " + date.getHours() + ":" + date.getMinutes();
                let beitragSend: BeitragSend = {site: "addBeitrag", text: beitragText, date: jsonStringDate, username: sessionStorage.getItem("username")};
                //let beitragSend: beitragSend = {site: "addBeitrag", text: beitragText, date: jsonStringDate, username: sessionStorage.getItem(username)};
                let query: URLSearchParams = new URLSearchParams(<any>beitragSend);
                let serverMitDatenUrl: string = serverUrl + "?" + query.toString();
                let erfolg: boolean = await serverAnfrageSend(serverMitDatenUrl); // Antwort hinzufügen
                if (erfolg) {
                    textFeld.className = "textFeld";
                    textFeld.placeholder = "";
                    modal.style.display = "none";
                    textFeld.value = "";
                    btnSend.removeEventListener("click", sendBeitrag); 
                    hauptseiteReload();
                } else {
                   //
                }
                
            } else {
                textFeld.className = "textFeldError";
                textFeld.placeholder = "Es muss was eingetragen werden"; //ändern zu:  es muss was eingetragen werden
            }

        });
    }


    async function serverAnfrageGet(_url: RequestInfo): Promise<Beitrag[]> {
        let response: Response = await fetch(_url);
        console.log(response);
        let antwort: Beitrag[] = await response.json();
        return antwort;    
    } 
    async function serverAnfrageSend(_url: RequestInfo): Promise<boolean> {
        let response: Response = await fetch(_url);
        let antwort: ServerMsg = await response.json();
        if (antwort.msg == "erfolg") {
            return true;
        } else {
            return false;
        }   
    } 

    main();
}