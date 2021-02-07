namespace register {
    
    interface List {
        [type: string]: string | string[];
    }
    interface ServerMsg {
        msg: string;
    }

    let serverUrl: string = "https://lucamosergis2020.herokuapp.com/";
    //let serverUrl: string = "http://127.0.0.1:8100";
    let username: string = "Fehler";

    function main(): void {
        
        letUsername();
        let divProfil: HTMLDivElement = <HTMLDivElement>document.getElementById("divUserProfil");
        createProfil(divProfil);
        /* später
        let divFollowedUserList: HTMLDivElement = <HTMLDivElement>document.getElementById("allFollowedList");
        let divFollowersList: HTMLDivElement = <HTMLDivElement>document.getElementById("allFollowersList");
        */
        let hauptProfilNavi: HTMLLIElement = <HTMLLIElement>document.getElementById("hauptProfil");
        hauptProfilNavi.addEventListener("click", function funcProfil(): void {
            sessionStorage.setItem("profilname" , sessionStorage.getItem("username"));
        });
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

    function toKeysVonList(value: List): (keyof List)[] {
        return Object.keys(value);
    }

    async function createProfil (divParent: HTMLDivElement): Promise<void> {
        
        deleteElements(divParent);
        let getDatenUser: List = {site: "getDatenProfil", username: sessionStorage.getItem("profilname")};
        console.log(sessionStorage.getItem("profilname"));
        let datenUser: List = await serverAnfrageGet(createUrlQuery(getDatenUser));
       
        let keysVonDaten: (string | number)[] = toKeysVonList(datenUser); // Um mögliche Datenangaben variabel halten zukönnen
        //console.log(keysVonDaten[0]);
        
        for (let i: number = 0; i < keysVonDaten.length; i++) {
            let keyDaten: string = "" + keysVonDaten[i];
            if ("_id" == keyDaten || "follower" == keyDaten || "beitraglist" == keyDaten ) {
                // Damit _id, follower und beitraglist nicht im Profil angezeigt werden
            } else {
                let divOneData: HTMLDivElement = document.createElement("div");
                divOneData.id = "data_" + i;
                let btnData: HTMLButtonElement = document.createElement("button");
                let pData: HTMLParagraphElement = document.createElement("p");
                let divKey: HTMLDivElement = document.createElement("div");
                let divValue: HTMLDivElement = document.createElement("div");
                

                divKey.appendChild(document.createTextNode(keyDaten + ": "));
                divValue.appendChild(document.createTextNode("" + datenUser[keysVonDaten[i]]));
                pData.appendChild(divKey);
                pData.appendChild(divValue);

                if (keyDaten == "username") { 
                    // Damit Username nicht bearbeitet werden kann
                    divKey.className = "usernameKeyProfil";
                    divValue.className = "usernameValueProfil";
                } else {
                    divKey.className = "keyProfil";
                    divValue.className = "valueProfil";
                    // Damit man nur sein eigenes Profil bearbeiten kann
                    if (sessionStorage.getItem("username") == sessionStorage.getItem("profilname")) {
                        divValue.appendChild(btnData);
                    }
                    //divKey.appendChild(divValue);
                    btnData.appendChild(document.createTextNode("Bearbeiten"));
                    btnData.className = "btnProfil";
            
                    btnData.addEventListener("click", async function funcBtnBearbeiten(): Promise<void> {
                        let valueName: string = "" + datenUser[keysVonDaten[i]];
                        let keyName: string = keyDaten;
                        let btnFinish: HTMLButtonElement = document.createElement("button");
                        btnFinish.appendChild(document.createTextNode("Fertig"));
                        deleteElements(divValue);
                        let eingabeFeld: HTMLTextAreaElement = document.createElement("textarea");
                        eingabeFeld.cols = 15;
                        eingabeFeld.rows = 2;
                        eingabeFeld.placeholder = valueName;
                        eingabeFeld.maxLength = 30;
                        
                        divValue.appendChild(eingabeFeld);

                        btnFinish.className = "btnProfil";
                        divValue.appendChild(btnFinish);
                        btnFinish.addEventListener("click", async function funcBtnFinish(): Promise<void> {
                            if (eingabeFeld.value != "") { // Keine Überprüfung ob leerzwichen drinnen sind
                                let getDatenUser: List = {site: "changeProfil", username: sessionStorage.getItem("username"), key: keyName, keyValue: eingabeFeld.value};
                                let erfolg: boolean = await serverAnfrageSend(createUrlQuery(getDatenUser));
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


    function deleteElements(divList: HTMLDivElement): void {
        if (divList.hasChildNodes()) {
            while (divList.firstChild) {
                divList.removeChild(divList.firstChild);
            }
        }
    }

    function createUrlQuery (msg: List): string {

        let query: URLSearchParams = new URLSearchParams(<any>msg);
        let serverMitDatenUrl: string = serverUrl + "?" + query.toString();
        return serverMitDatenUrl;
    }

    async function serverAnfrageGet(_url: RequestInfo): Promise<List> {
        let response: Response = await fetch(_url);
        let antwort: List = await response.json();
        return antwort;    
    } 
    async function serverAnfrageSend(_url: RequestInfo): Promise<boolean> {
        let response: Response = await fetch(_url);
        let antwort: ServerMsg = await response.json();
        console.log("Rückgabe: " + antwort.msg);
        if (antwort.msg == "erfolg") {
            return true;
        } else {
            return false;
        }   
    } 
    main();
}