
import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";


export namespace server_script {

    interface Daten {
        [type: string]: string | string[] | number;                   // array-möglichkeit nur falls später benötigt
    }
    interface Profil {
        username: string;
        firstname: string;
        lastname: string;
        studiengang: string;
        semesterangabe: string;
    }
    interface ServerMsg {
        msg: string;
    }

    interface Follower {
        username: string;
        follower: string; // Der zu entfolgende/folgende Benutzername
    }
    interface UsernameList {
        username: string; 
    }
    interface Benutzer {

        username: string;
        firstname: string;
        lastname: string;
        password: string; 
        studiengang: string;
        semesterangabe: string;
        follower: string[];
        beitraglist: Beitrag[];

    }

    interface Beitrag {
        text: string;
        date: string;
        username: string;
    }



    let eingabe: Mongo.Collection;                          // 
    let port: number = Number(process.env.PORT);            // Port zuweisen für den Server
    if (!port) {
        port = 8100;                                        // Falls kein Port angegeben ist 8100 benutzen    5500       
    }
    //let databaseUrl: string = "mongodb://localhost:27017";

    let databaseUrl: string = "mongodb+srv://Testuser:test@luca.bhhsd.mongodb.net/datenbank?retryWrites=true&w=majority";

    startServer(port);                                      // Verbinden
    connectToDatabase(databaseUrl);

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        eingabe = mongoClient.db("datenbank").collection("User"); // server
       // eingabe = mongoClient.db("datenbank").collection("Benutzer"); // lokal
        console.log("Datenbank Verbindung hergestellt ", eingabe != undefined);
    }

    function startServer(_port: number | string): void {
        let server: Http.Server = Http.createServer();          // Server variable
         
        console.log("Server wird gestartet mit dem Port: " + _port);  

        server.listen(_port);
        server.addListener("request", handleRequest);   // Listener hinzufügen
        server.addListener("listening", handleListen);
    }
    

    function handleListen(): void {                 // Start des Servers
        console.log("Listening");
    }
    

    
    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> { // wenn eingabe = null ist noch überprüfen
        console.log("I hear voices!");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        if (_request.url) {

                let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

                let jsonString: string = JSON.stringify(url.query);
                console.log("String übergabe: " + jsonString);
                let anfrageList: Daten = JSON.parse(jsonString);


                switch (anfrageList.site) {
                    case "login": {

                        let datenRichtig: boolean = await checkLogin(anfrageList);
                        let antwort: ServerMsg;
                        if (datenRichtig) {
                            antwort = {msg: "erfolg"};
                            
                        } else {
                            antwort = {msg: "error"};
                        }
                        let antwortString: string = JSON.stringify(antwort);
                        _response.end(antwortString);
                        break;
                    }case "register": {
                        let datenVorhanden: boolean = await checkRegister(anfrageList);
                        let antwort: ServerMsg;
                        if (!datenVorhanden) {

                            let jsonString: string = deleteFirstKey(url);
                            let datenIntoDB: Benutzer = JSON.parse(jsonString);

                            storeEingabe(datenIntoDB);
                            insertEmptyFollowAndBeitraglist(datenIntoDB.username);
                            antwort = {msg: "erfolg"};
                        } else {
                            antwort = {msg: "error"};
                            
                        }
                        let antwortString: string = JSON.stringify(antwort);
                        _response.end(antwortString);
                        break;
                    }case "getBeitrag": {
                        
                        let antwort: Beitrag[] = await getBeitragList("" + anfrageList.username);
                        let antwortString: string = JSON.stringify(antwort);

                        _response.end(antwortString);
                        break;
                        
                    }case "addBeitrag": {
                        
                        let jsonString: string = deleteFirstKey(url);
                        let beitrag: Beitrag = JSON.parse(jsonString);
                        let erfolg: boolean = insertBeitrag(beitrag, beitrag.username); 
                        if (erfolg) {
                            let antwort: ServerMsg = {msg: "erfolg"};
                            let antwortString: string = JSON.stringify(antwort);
                            _response.end(antwortString);
                        } else {
                            let antwort: ServerMsg = {msg: "error"};
                            let antwortString: string = JSON.stringify(antwort);
                            _response.end(antwortString);
                        }
                        break;

                    }case "addFollower": {
                        let jsonString: string = deleteFirstKey(url);
                        let datenIntoDB: Follower = JSON.parse(jsonString);
                        //addFollower("help", "lumo");
                        addFollower(datenIntoDB.username, datenIntoDB.follower);
                        let antwort: ServerMsg = {msg: "erfolg"};
                        let antwortString: string = JSON.stringify(antwort);
                        _response.end(antwortString);
                        break;
                    }case "removeFollower": {
                        let jsonString: string = deleteFirstKey(url);
                        let datenIntoDB: Follower = JSON.parse(jsonString);
                        //deleteFollower("lumo", "help");
                        deleteFollower(datenIntoDB.username, datenIntoDB.follower);
                        let antwort: ServerMsg = {msg: "erfolg"};
                        let antwortString: string = JSON.stringify(antwort);
                        _response.end(antwortString);
                        break;
                    }case "getUsernameList": {
                        let userList: UsernameList[] = await getUsernameList();
                        let userListJson: string = JSON.stringify(userList);
                        _response.end(userListJson);
                        break;

                    }case "getFollowedUserList": {
                        console.log("Username: " + anfrageList.username); //
                        let userList: UsernameList[] = await getFollowedUsernameList("" + anfrageList.username);
                        let userListJson: string = JSON.stringify(userList);
                        _response.end(userListJson);
                        break;

                    }case "changeProfil": {
                        let erfolg: boolean = updateProfil(url); // boolean return -> danach response string
                        if (erfolg) {
                            let antwort: ServerMsg = {msg: "erfolg"};
                            let antwortString: string = JSON.stringify(antwort);
                            _response.end(antwortString);
                        } else {
                            let antwort: ServerMsg = {msg: "error"};
                            let antwortString: string = JSON.stringify(antwort);
                            _response.end(antwortString);
                        }
                        break;
                    }case "getDatenProfil": {
                        console.log("Username: " + anfrageList.username); //
                        let datenProfilArray: Profil[] = await eingabe.find({username: anfrageList.username}).toArray();
                        let datenProfil: Profil = datenProfilArray[0];
                        let userListJson: string = JSON.stringify(datenProfil);
                        _response.end(userListJson);
                        break;
                    }
                    
                    default: {
                        // Fehler
                    }

                }
        }
        
        _response.end();
    }
    
    async function getUsernameList(): Promise<UsernameList[]> {

        let usernameList: UsernameList[] = [];
        let user: Benutzer[] = await eingabe.find().toArray();
        for (let i: number = 0; i < user.length; i++) {
            usernameList.push({username: user[i].username});
        }
        return usernameList;
    }

    async function getFollowedUsernameList(username: string): Promise<UsernameList[]> {
        let followedList: UsernameList[] = [];
        let user: Benutzer[] = await eingabe.find({username: username}).toArray();
        
        if (user[0].follower != null || user[0].follower != undefined ) {
            for (let follower of user[0].follower) {
                followedList.push({username: follower});
            }
        }
        return followedList;
    }
      
    async function getBeitragList(name: string): Promise<Beitrag[]> {

        let beitraglist: Beitrag[] = [];
        let user: Benutzer[] = await eingabe.find({username: name}).toArray();
        
        if (user[0].follower != null && user[0].follower != undefined ) {
            for (let follower of user[0].follower) {
                let u: Benutzer[] = await eingabe.find({ username: follower }).toArray();
                if (user[0].beitraglist != null && user[0].beitraglist != undefined ) {
                    try {
                        for (let beitrag of u[0].beitraglist) {
                            beitraglist.push(beitrag);
                        }
                    } catch ( e ) {
                        
                        //
                    }
                    
                }
            }
        }
        
        
        return beitraglist;
    }
      
    function insertBeitrag(b: Beitrag, name: string): boolean {
        try {
            eingabe.updateOne({ username: name }, {
                $push: {
                    beitraglist: b
                }   
            });
            return true;
        } catch ( e ) {
            return false;
        }
        
    }
    function insertEmptyFollowAndBeitraglist(name: string): void {
        // let user: Benutzer = coll.find({username: name});
        // user.beitragelist.push(b);
        // coll.updateOne({username: name}, user);
        // "Help" für die Anleitung (kann man durch unfollowen ausstellen) und "name" damit seine eigene Beiträge angezeigt werden
        eingabe.updateOne({ username: name }, {
            $set: {
                follower: ["help", name]
            }   
        });
        eingabe.updateOne({ username: name }, {
            $set: {
                beitraglist: []
            }   
        });
    }
    async function deleteFollower(username: string, followerString: string): Promise<void> {
        let followerlist: string[] = [];
        let user: Benutzer[] = await eingabe.find({username: username}).toArray();
        
        if (user[0].follower != null || user[0].follower != undefined ) {
            for (let follower of user[0].follower) {
                if (follower != followerString) {
                    followerlist.push(follower);
                }
            }
        }
        
        eingabe.updateOne({ username: username }, {
            $set: {
                follower: followerlist
            }   
        });

    }

    async function addFollower(username: string, followerString: string): Promise<void> {
        let followerlist: string[] = [];
        let user: Benutzer[] = await eingabe.find({username: username}).toArray();
        
        if (user[0].follower != null || user[0].follower != undefined ) {
            for (let follower of user[0].follower) {
                    followerlist.push(follower);
            }
        }
        followerlist.push(followerString);
        eingabe.updateOne({ username: username }, {
            $set: {
                follower: followerlist
            }   
        });
    }
    function updateProfil (url: Url.UrlWithParsedQuery): boolean {
        let name: string = "Error";
        let datenChangeKey: string = "Error";
        let datenChangeValue: string = "Error";

        for (let key in url.query) {
            console.log("key: " + key);
            if (key != "site") {
                if (key == "username") {
                    name = "" + url.query[key]; 
                } else if (key == "key") {
                    datenChangeKey = "" + url.query[key];
                    
                } else  if (key == "keyValue") {
                    datenChangeValue = "" + url.query[key];
                }
                console.log("Nicht seite");
            }
        }
        console.log(datenChangeKey + " = " + name);
        switch (datenChangeKey) {
            case "firstname": {
                eingabe.updateOne({ username: name }, { 
                     $set: {
                        firstname: datenChangeValue
                    }   
                });
                return true;
            }case "lastname": {
                eingabe.updateOne({ username: name }, { 
                    $set: {
                       lastname: datenChangeValue
                   }   
                });
                return true;
            }case "password": {
                eingabe.updateOne({ username: name }, { 
                    $set: {
                       password: datenChangeValue
                   }   
                });
                return true;
            }case "studiengang": {
                eingabe.updateOne({ username: name }, { 
                    $set: {
                       studiengang: datenChangeValue
                   }   
                });
                return true;
            }case "semesterangabe": {
                eingabe.updateOne({ username: name }, { 
                    $set: {
                       semesterangabe: datenChangeValue
                   }   
                });
                return true;
            } default: {
                return false;
            }
        }
        /*eingabe.updateOne({ username: name }, { // Funktioniert nicht, datenChangeKey wird so eingetragen "datenChangeKey"
            $set: {
                datenChangeKey: datenChangeValue
            }   
        });*/
    }

    function deleteFirstKey (url: Url.UrlWithParsedQuery): string {
        let jsonStringCutted: string = "{";
        for (let key in url.query) {
            console.log("key: " + key);
            if (key != "site") {
                console.log("Nicht seite");
                jsonStringCutted = jsonStringCutted + "\"" + key + "\"" + ":" + "\"" + url.query[key] + "\"" + ",";
            }
        }
        let deletelaststring: string = jsonStringCutted.substring(0, jsonStringCutted.length - 1 );
        jsonStringCutted = deletelaststring + "}";
        return jsonStringCutted;
    }

    async function checkLogin(anfrageList: Daten): Promise<boolean> {
        
        let userDaten: Daten[] = await retrieveDaten();
        let datenRichtig: boolean = false;
        for (let i: number = 0; i < userDaten.length; i++) {
            let usernameString: string = "\"" + anfrageList.username + "\"";
            if (JSON.stringify(userDaten[i].username) == usernameString) { 
                console.log("username ist vorhanden" + i);

                let passwordString: string = "" + anfrageList.password;
                if (userDaten[i].password == passwordString) { // undefined führt zu problemen
                    console.log("passwort ist richtig");
                    datenRichtig = true;
                    return datenRichtig;
                }
                break;
            }              
        }
        return datenRichtig;
    }

    async function checkRegister(anfrageList: Daten): Promise<boolean> {
        
        let userDaten: Daten[] = await retrieveDaten();
        let datenVorhanden: boolean = false;
        for (let i: number = 0; i < userDaten.length; i++) {
            let usernameString: string = "\"" + anfrageList.username + "\"";
            if (JSON.stringify(userDaten[i].username) == usernameString) { 
                    datenVorhanden = true;
                    return datenVorhanden;
                    
            }            
        }
        return datenVorhanden;
    }


    function storeEingabe(_eingabe: Benutzer): void {
        eingabe.insertOne(_eingabe);
    }
    // anstatt beitrag: string muss beitrag:Daten
    /*async function retrieveDatenBenutzer(): Promise<Benutzer[]> {
        let datenArr: Benutzer[] = await eingabe.find().toArray();
        return datenArr;
    }*/

    async function retrieveDaten(): Promise<Daten[]> {
        let datenArr: Daten[] = await eingabe.find().toArray();
        return datenArr;
    }
}