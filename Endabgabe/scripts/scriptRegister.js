"use strict";
var register;
(function (register) {
    //let serverUrl: string = "http://127.0.0.1:8100";
    let serverUrl = "https://lucamosergis2020.herokuapp.com/";
    function main() {
        let buttonRegister = document.getElementById("registerButton");
        buttonRegister.addEventListener("click", async function funcRegister() {
            let inputFirstName = document.getElementById("regFirstName");
            let inputLastName = document.getElementById("regLastName");
            let inputBenutzer = document.getElementById("regBenutzer");
            let inputPassword = document.getElementById("regPassword");
            let inputStudiengang = document.getElementById("regStudiengang"); //number
            let inputSemesterangabe = document.getElementById("regSemesterangabe");
            auswertenBenutzerVorhanden(inputBenutzer.value, inputFirstName.value, inputLastName.value, inputPassword.value, inputStudiengang.value, inputSemesterangabe.value);
        });
    }
    async function auswertenBenutzerVorhanden(username, firstname, lastname, password, studiengang, semesterangabe) {
        let registerElementMsg = document.getElementById("textRegister");
        if (typeof (registerElementMsg) != "undefined" && registerElementMsg != null) {
            registerElementMsg.remove();
        }
        let _divRegister = document.getElementById("messageRegister");
        let text = document.createElement("p");
        text.id = "textRegister";
        if (username != undefined && username != null && username != "") {
            if (password != undefined && password != null && password != "") {
                try {
                    let eingabe = {
                        site: "register",
                        username: username,
                        firstname: firstname,
                        lastname: lastname,
                        password: password,
                        studiengang: studiengang,
                        semesterangabe: semesterangabe
                    };
                    let query = new URLSearchParams(eingabe);
                    let serverMitDatenUrl = serverUrl + "?" + query.toString();
                    console.log("Server Url mit eingabe als query: " + serverMitDatenUrl);
                    let registerErfolg = await serverAnfrage(serverMitDatenUrl);
                    if (registerErfolg) {
                        sessionStorage.clear();
                        sessionStorage.setItem("username", username);
                        sessionStorage.setItem("profilname", username);
                        window.location.href = window.location.pathname.substring(0, window.location.pathname.length - 20) + "/main/index.html";
                    }
                    else {
                        text.className = "textFalsch"; // Textformat klasse
                        text.appendChild(document.createTextNode("Der Benutzername ist schon vergeben"));
                    }
                }
                catch (e) {
                    //
                }
            }
            else {
                text.className = "textFalsch"; // Textformat klasse
                text.appendChild(document.createTextNode("Es wurde kein gültiges Passwort eingeben"));
            }
        }
        else {
            text.className = "textFalsch"; // Textformat klasse
            text.appendChild(document.createTextNode("Es wurde kein gültiger Benutzername eingeben"));
        }
        _divRegister.appendChild(text);
    }
    async function serverAnfrage(_url) {
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
//# sourceMappingURL=scriptRegister.js.map