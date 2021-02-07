namespace register {


    interface DatenList {
        site: string;
        username: string;
        firstname: string;
        lastname: string;
        password: string; 
        studiengang: string;
        semesterangabe: string;  
                          
    }
    interface ServerMsg {
        msg: string;
    }
    let serverUrl: string = "http://127.0.0.1:8100";
    
    //let serverUrl: string = "https://lucamosergis2020.herokuapp.com/";

    

    function main(): void {

        let buttonRegister: HTMLInputElement = <HTMLInputElement>document.getElementById("registerButton");
        buttonRegister.addEventListener("click", async function funcRegister(): Promise<void> {

            let inputFirstName: HTMLInputElement = <HTMLInputElement>document.getElementById("regFirstName");
            let inputLastName: HTMLInputElement = <HTMLInputElement>document.getElementById("regLastName");
            let inputBenutzer: HTMLInputElement = <HTMLInputElement>document.getElementById("regBenutzer");
            let inputPassword: HTMLInputElement = <HTMLInputElement>document.getElementById("regPassword");
            let inputStudiengang: HTMLInputElement = <HTMLInputElement>document.getElementById("regStudiengang"); //number
            let inputSemesterangabe: HTMLSelectElement = <HTMLSelectElement>document.getElementById("regSemesterangabe");

            auswertenBenutzerVorhanden(inputBenutzer.value, inputFirstName.value, inputLastName.value, inputPassword.value, inputStudiengang.value, inputSemesterangabe.value);
            
        });  
    }

    async function auswertenBenutzerVorhanden(username: string, firstname: string, lastname: string, password: string, studiengang: string, semesterangabe: string): Promise<void> { 

        let registerElementMsg: HTMLElement =  document.getElementById("textRegister");
        if (typeof(registerElementMsg) != "undefined" && registerElementMsg != null) {
            registerElementMsg.remove(); 
        }

        let _divRegister: HTMLDivElement = <HTMLDivElement>document.getElementById("messageRegister");
        let text: HTMLParagraphElement = document.createElement("p");
        text.id = "textRegister"; 

        if (username != undefined && username != null && username != "") {
            if (password != undefined && password != null && password != "") {
                try {
                    let eingabe: DatenList =  {
                        site: "register", 
                        username: username, 
                        firstname: firstname, 
                        lastname: lastname, 
                        password: password, 
                        studiengang: studiengang, 
                        semesterangabe: semesterangabe
                    };
                        
                    let query: URLSearchParams = new URLSearchParams(<any>eingabe);
                    let serverMitDatenUrl: string = serverUrl + "?" + query.toString();
                    console.log("Server Url mit eingabe als query: " + serverMitDatenUrl);
                    let registerErfolg: boolean = await serverAnfrage(serverMitDatenUrl);
                        
                            
                    if (registerErfolg) {
                        sessionStorage.clear();
                        sessionStorage.setItem("username", username);
                        sessionStorage.setItem("profilname", username);
                        window.location.href = window.location.pathname.substring(0, window.location.pathname.length - 20) + "/main/index.html";
                        
                            
                    } else {
                        text.className = "textFalsch"; // Textformat klasse
                        text.appendChild(document.createTextNode("Der Benutzername ist schon vergeben"));
                    }
    
                } catch ( e ) {
                        //
                }      
            } else {
                text.className = "textFalsch"; // Textformat klasse
                text.appendChild(document.createTextNode("Es wurde kein gültiges Passwort eingeben"));
            }
            
        } else {
            text.className = "textFalsch"; // Textformat klasse
            text.appendChild(document.createTextNode("Es wurde kein gültiger Benutzername eingeben"));
        }  
        _divRegister.appendChild(text);         
    }


    async function serverAnfrage(_url: RequestInfo): Promise<boolean> {
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

