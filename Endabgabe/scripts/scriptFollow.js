"use strict";
var register;
(function (register) {
    let username = "Fehler";
    //let serverUrl: string = "https://lucamosergis2020.herokuapp.com/";
    let serverUrl = "http://127.0.0.1:8100";
    function main() {
        letUsername();
        let divAllUserList = document.getElementById("allUserList");
        listAllUser(divAllUserList);
        let hauptProfilNavi = document.getElementById("hauptProfil");
        hauptProfilNavi.addEventListener("click", function funcProfil() {
            sessionStorage.setItem("profilname", sessionStorage.getItem("username"));
        });
        /* später
        //1. Seite laden mit allen Usern + btn hinzufügen zum FOlgen und entfolgen
        //2. Nur alle die man folgt oben rechts
        //3. Alle die einen FOlgen (Follower) untern rechts
        //punkt 1 und 2 werden beim folgen und entfolgen neugeformt (gelöscht und wieder hinzugefügt)
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
    async function listAllUser(divUserList) {
        deleteUserList(divUserList);
        let getUserList = { site: "getUsernameList" };
        let getFollowedList = { site: "getFollowedUserList", username: sessionStorage.getItem("username") };
        let allUsernameList = await serverAnfrageGet(createUrlQuery(getUserList)); // Nur Username
        let allFollowedList = await serverAnfrageGet(createUrlQuery(getFollowedList)); // Nur Usernames die von dem Accountbenutzer gefolgt werden
        // Man Folgt sich beim Registrieren automatisch selbst. Man kann sich jeder Zeit selbst entfolgen, damit die eigenen Beiträge nicht angezeigt werden.hg
        for (let i = 0; i < allUsernameList.length; i++) {
            let divOneUser = document.createElement("div");
            divOneUser.id = "user_" + i;
            let btnUser = document.createElement("button");
            let pUsername = document.createElement("p");
            let divKey = document.createElement("div");
            let userFolgt = false;
            if (allFollowedList.length < 1) {
                //Keine Followed User
            }
            else {
                for (let j = 0; j < allFollowedList.length; j++) {
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
                btnUser.addEventListener("click", async function funcBtnEntfolgen() {
                    let userDeleted = await deleteUserFromFollowedList("" + allUsernameList[i].username, sessionStorage.getItem("username"));
                    if (userDeleted) {
                        // Nachricht, dass der Username erfolgreich entfolgt wurde
                        console.log("wurde entfolgt");
                        main();
                    }
                    else {
                        // Fehlernachricht, dass es nicht geklappt hat den User zu löschen
                        console.log("wurde nicht entfolgt");
                    }
                });
            }
            else {
                divKey.className = "followEntfolgtUsername";
                btnUser.className = "folgen";
                btnUser.appendChild(document.createTextNode("Folgen"));
                btnUser.addEventListener("click", async function funcBtnFolgen() {
                    let userAdded = await addUserFromFollowedList("" + allUsernameList[i].username, sessionStorage.getItem("username"));
                    if (userAdded) {
                        console.log("wurde gefolgt");
                        main();
                    }
                    else {
                        console.log("wurde nicht gefolgt");
                    }
                });
            }
            divKey.appendChild(document.createTextNode("" + allUsernameList[i].username));
            pUsername.appendChild(divKey);
            pUsername.appendChild(btnUser);
            divOneUser.appendChild(pUsername);
            divUserList.appendChild(divOneUser);
            divKey.addEventListener("click", function funcUsername() {
                sessionStorage.removeItem("profilname");
                sessionStorage.setItem("profilname", "" + allUsernameList[i].username);
                window.location.href = window.location.pathname.substring(0, window.location.pathname.length - 18) + "/Profil/index.html";
                //window.document.location.href = "/profil/index.html"; 
                console.log("Follow username Klick: " + allUsernameList[i].username);
            });
        }
    }
    function deleteUserList(divList) {
        if (divList.hasChildNodes()) {
            while (divList.firstChild) {
                divList.removeChild(divList.firstChild);
            }
        }
    }
    async function deleteUserFromFollowedList(follower, username) {
        let deleteUser = { site: "removeFollower", follower: follower, username: username };
        let erfolg = await serverAnfrageSend(createUrlQuery(deleteUser));
        return erfolg;
    }
    async function addUserFromFollowedList(follower, username) {
        let addUser = { site: "addFollower", follower: follower, username: username };
        let erfolg = await serverAnfrageSend(createUrlQuery(addUser));
        return erfolg;
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
//# sourceMappingURL=scriptFollow.js.map