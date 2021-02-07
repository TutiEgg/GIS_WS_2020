namespace register {
    
    interface List {
        [type: string]: string | string[];
    }
    interface ServerMsg {
        msg: string;
    }
    let username: string = "Fehler";
    let serverUrl: string = "https://lucamosergis2020.herokuapp.com/";
    //let serverUrl: string = "http://127.0.0.1:8100";

    function main(): void {
        //1. Seite laden mit allen Usern + btn hinzufügen zum FOlgen und entfolgen
        //2. Nur alle die man folgt oben rechts
        //3. Alle die einen FOlgen (Follower) untern rechts
        //punkt 1 und 2 werden beim folgen und entfolgen neugeformt (gelöscht und wieder hinzugefügt)

        letUsername();
        let divAllUserList: HTMLDivElement = <HTMLDivElement>document.getElementById("allUserList");
        listAllUser(divAllUserList);
        
        /* später
        let divFollowedUserList: HTMLDivElement = <HTMLDivElement>document.getElementById("allFollowedList");
        let divFollowersList: HTMLDivElement = <HTMLDivElement>document.getElementById("allFollowersList");
        */

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

    async function listAllUser(divUserList: HTMLDivElement): Promise<void> {

        deleteUserList(divUserList);

        let getUserList: List = {site: "getUsernameList"};
        let getFollowedList: List = {site: "getFollowedUserList", username: sessionStorage.getItem("username")};
        let allUsernameList: List[] = await serverAnfrageGet(createUrlQuery(getUserList)); // Nur Username
        let allFollowedList: List[] = await serverAnfrageGet(createUrlQuery(getFollowedList)); // Nur Usernames die von dem Accountbenutzer gefolgt werden

        // Man Folgt sich beim Registrieren automatisch selbst. Man kann sich jeder Zeit selbst entfolgen, damit die eigenen Beiträge nicht angezeigt werden.hg

        for (let i: number = 0; i < allUsernameList.length; i++) {

            let divOneUser: HTMLDivElement = document.createElement("div");
            divOneUser.id = "user_" + i;
            let btnUser: HTMLButtonElement = document.createElement("button");
            let pUsername: HTMLParagraphElement = document.createElement("p");
            let divKey: HTMLDivElement = document.createElement("div");
            let userFolgt: boolean = false;
            if ( allFollowedList.length < 1) {
                //Keine Followed User
            } else {
                for (let j: number = 0; j < allFollowedList.length; j++) {
                    if (allUsernameList[i].username == allFollowedList[j].username) {
                        userFolgt = true;
                        break;
                    }
                }
            }
            

            if (userFolgt) {
                divKey.className = "followFolgtUsername";
                btnUser.className = "entfolgen"; 
                btnUser.appendChild(document.createTextNode("Entfolgen"));
                btnUser.addEventListener("click", async function funcBtnEntfolgen(): Promise<void> {
                    let userDeleted: boolean = await deleteUserFromFollowedList("" + allUsernameList[i].username, sessionStorage.getItem("username"));
                    if (userDeleted) {
                        // Nachricht, dass der Username erfolgreich entfolgt wurde
                        console.log("wurde entfolgt");
                        main();
                    } else {
                        // Fehlernachricht, dass es nicht geklappt hat den User zu löschen
                        console.log("wurde nicht entfolgt");
                    }
                   
                });
            } else {
                divKey.className = "followEntfolgtUsername";
                btnUser.className = "folgen";
                btnUser.appendChild(document.createTextNode("Folgen")); 
                btnUser.addEventListener("click", async function funcBtnFolgen(): Promise<void> {
                    
                    let userAdded: boolean = await addUserFromFollowedList("" + allUsernameList[i].username, sessionStorage.getItem("username"));
                    if (userAdded) {
                        // Nachricht, dass der Username erfolgreich gefolgt wurde
                        console.log("wurde gefolgt");
                        main();
                    } else {
                        // Fehlernachricht, dass es nicht geklappt hat den User hinzuzufügen
                        console.log("wurde nicht gefolgt");
                    }
                   
                });
            }

            divKey.appendChild(document.createTextNode("" + allUsernameList[i].username));
            pUsername.appendChild(divKey);

            pUsername.appendChild(btnUser);
            divOneUser.appendChild(pUsername);
            divUserList.appendChild(divOneUser);
            
            divKey.addEventListener("click", function funcUsername(): void {
                sessionStorage.removeItem("profilname");
                sessionStorage.setItem("profilname", "" + allUsernameList[i].username);
                window.location.href = window.location.pathname.substring(0, window.location.pathname.length - 18) + "/Profil/index.html";
                //window.document.location.href = "/profil/index.html"; 
                console.log("Follow username Klick: " + allUsernameList[i].username);
            });
        }  
    }

    function deleteUserList(divList: HTMLDivElement): void {
        if (divList.hasChildNodes()) {
            while (divList.firstChild) {
                divList.removeChild(divList.firstChild);
            }
        }
    }
    async function deleteUserFromFollowedList(follower: string, username: string): Promise<boolean> {
        
        let deleteUser: List = {site: "removeFollower", follower: follower, username: username};
        let erfolg: boolean = await serverAnfrageSend(createUrlQuery(deleteUser));
        return erfolg;
    }
    async function addUserFromFollowedList(follower: string, username: string): Promise<boolean> {
        let addUser: List = {site: "addFollower", follower: follower, username: username};
        let erfolg: boolean = await serverAnfrageSend(createUrlQuery(addUser));
        return erfolg;
    }


    function createUrlQuery (msg: List): string {

        let query: URLSearchParams = new URLSearchParams(<any>msg);
        let serverMitDatenUrl: string = serverUrl + "?" + query.toString();
        return serverMitDatenUrl;
    }

    async function serverAnfrageGet(_url: RequestInfo): Promise<List[]> {
        let response: Response = await fetch(_url);
        let antwort: List[] = await response.json();
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