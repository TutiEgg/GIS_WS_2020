"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server_script = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var server_script;
(function (server_script) {
    let eingabe; // 
    let port = Number(process.env.PORT); // Port zuweisen für den Server
    if (!port) {
        port = 8100; // Falls kein Port angegeben ist 8100 benutzen    5500       
    }
    //let databaseUrl: string = "mongodb://localhost:27017";
    let databaseUrl = "mongodb+srv://Testuser:test@luca.bhhsd.mongodb.net/datenbank?retryWrites=true&w=majority";
    startServer(port); // Verbinden
    connectToDatabase(databaseUrl);
    async function connectToDatabase(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        eingabe = mongoClient.db("datenbank").collection("User"); // server
        // eingabe = mongoClient.db("datenbank").collection("Benutzer"); // lokal
        console.log("Datenbank Verbindung hergestellt ", eingabe != undefined);
    }
    function startServer(_port) {
        let server = Http.createServer(); // Server variable
        console.log("Server wird gestartet mit dem Port: " + _port);
        server.listen(_port);
        server.addListener("request", handleRequest); // Listener hinzufügen
        server.addListener("listening", handleListen);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        console.log("I hear voices!");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url) {
            let url = Url.parse(_request.url, true);
            let jsonString = JSON.stringify(url.query);
            console.log("String übergabe: " + jsonString);
            let anfrageList = JSON.parse(jsonString);
            switch (anfrageList.site) {
                case "login": {
                    let datenRichtig = await checkLogin(anfrageList);
                    let antwort;
                    if (datenRichtig) {
                        antwort = { msg: "erfolg" };
                    }
                    else {
                        antwort = { msg: "error" };
                    }
                    let antwortString = JSON.stringify(antwort);
                    _response.end(antwortString);
                    break;
                }
                case "register": {
                    let datenVorhanden = await checkRegister(anfrageList);
                    let antwort;
                    if (!datenVorhanden) {
                        let jsonString = deleteFirstKey(url);
                        let datenIntoDB = JSON.parse(jsonString);
                        storeEingabe(datenIntoDB);
                        insertEmptyFollowAndBeitraglist(datenIntoDB.username);
                        antwort = { msg: "erfolg" };
                    }
                    else {
                        antwort = { msg: "error" };
                    }
                    let antwortString = JSON.stringify(antwort);
                    _response.end(antwortString);
                    break;
                }
                case "getBeitrag": {
                    let antwort = await getBeitragList("" + anfrageList.username);
                    let antwortString = JSON.stringify(antwort);
                    _response.end(antwortString);
                    break;
                }
                case "addBeitrag": {
                    let jsonString = deleteFirstKey(url);
                    let beitrag = JSON.parse(jsonString);
                    let erfolg = insertBeitrag(beitrag, beitrag.username);
                    if (erfolg) {
                        let antwort = { msg: "erfolg" };
                        let antwortString = JSON.stringify(antwort);
                        _response.end(antwortString);
                    }
                    else {
                        let antwort = { msg: "error" };
                        let antwortString = JSON.stringify(antwort);
                        _response.end(antwortString);
                    }
                    break;
                }
                case "addFollower": {
                    let jsonString = deleteFirstKey(url);
                    let datenIntoDB = JSON.parse(jsonString);
                    //addFollower("help", "lumo");
                    addFollower(datenIntoDB.username, datenIntoDB.follower);
                    let antwort = { msg: "erfolg" };
                    let antwortString = JSON.stringify(antwort);
                    _response.end(antwortString);
                    break;
                }
                case "removeFollower": {
                    let jsonString = deleteFirstKey(url);
                    let datenIntoDB = JSON.parse(jsonString);
                    //deleteFollower("lumo", "help");
                    deleteFollower(datenIntoDB.username, datenIntoDB.follower);
                    let antwort = { msg: "erfolg" };
                    let antwortString = JSON.stringify(antwort);
                    _response.end(antwortString);
                    break;
                }
                case "getUsernameList": {
                    let userList = await getUsernameList();
                    let userListJson = JSON.stringify(userList);
                    _response.end(userListJson);
                    break;
                }
                case "getFollowedUserList": {
                    console.log("Username: " + anfrageList.username); //
                    let userList = await getFollowedUsernameList("" + anfrageList.username);
                    let userListJson = JSON.stringify(userList);
                    _response.end(userListJson);
                    break;
                }
                case "changeProfil": {
                    let erfolg = updateProfil(url); // boolean return -> danach response string
                    if (erfolg) {
                        let antwort = { msg: "erfolg" };
                        let antwortString = JSON.stringify(antwort);
                        _response.end(antwortString);
                    }
                    else {
                        let antwort = { msg: "error" };
                        let antwortString = JSON.stringify(antwort);
                        _response.end(antwortString);
                    }
                    break;
                }
                case "getDatenProfil": {
                    console.log("Username: " + anfrageList.username); //
                    let datenProfilArray = await eingabe.find({ username: anfrageList.username }).toArray();
                    let datenProfil = datenProfilArray[0];
                    let userListJson = JSON.stringify(datenProfil);
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
    async function getUsernameList() {
        let usernameList = [];
        let user = await eingabe.find().toArray();
        for (let i = 0; i < user.length; i++) {
            usernameList.push({ username: user[i].username });
        }
        return usernameList;
    }
    async function getFollowedUsernameList(username) {
        console.log("hier: " + username);
        let followedList = [];
        let user = await eingabe.find({ username: username }).toArray();
        if (user[0].follower != null || user[0].follower != undefined) {
            for (let follower of user[0].follower) {
                followedList.push({ username: follower });
            }
        }
        return followedList;
    }
    async function getBeitragList(name) {
        let beitraglist = [];
        let user = await eingabe.find({ username: name }).toArray();
        if (user[0].follower != null && user[0].follower != undefined) {
            for (let follower of user[0].follower) {
                let u = await eingabe.find({ username: follower }).toArray();
                if (user[0].beitraglist != null && user[0].beitraglist != undefined) {
                    try {
                        for (let beitrag of u[0].beitraglist) {
                            beitraglist.push(beitrag);
                        }
                    }
                    catch (e) {
                        //
                    }
                }
            }
        }
        return beitraglist;
    }
    function insertBeitrag(b, name) {
        // let user: Benutzer = coll.find({username: name});
        // user.beitragelist.push(b);
        // coll.updateOne({username: name}, user);
        try {
            eingabe.updateOne({ username: name }, {
                $push: {
                    beitraglist: b
                }
            });
            return true;
        }
        catch (e) {
            return false;
        }
    }
    function insertEmptyFollowAndBeitraglist(name) {
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
    async function deleteFollower(username, followerString) {
        let followerlist = [];
        let user = await eingabe.find({ username: username }).toArray();
        if (user[0].follower != null || user[0].follower != undefined) {
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
    async function addFollower(username, followerString) {
        let followerlist = [];
        let user = await eingabe.find({ username: username }).toArray();
        if (user[0].follower != null || user[0].follower != undefined) {
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
    function updateProfil(url) {
        let name = "Error";
        let datenChangeKey = "Error";
        let datenChangeValue = "Error";
        for (let key in url.query) {
            console.log("key: " + key);
            if (key != "site") {
                if (key == "username") {
                    name = "" + url.query[key];
                }
                else if (key == "key") {
                    datenChangeKey = "" + url.query[key];
                }
                else if (key == "keyValue") {
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
            }
            case "lastname": {
                eingabe.updateOne({ username: name }, {
                    $set: {
                        lastname: datenChangeValue
                    }
                });
                return true;
            }
            case "password": {
                eingabe.updateOne({ username: name }, {
                    $set: {
                        password: datenChangeValue
                    }
                });
                return true;
            }
            case "studiengang": {
                eingabe.updateOne({ username: name }, {
                    $set: {
                        studiengang: datenChangeValue
                    }
                });
                return true;
            }
            case "semesterangabe": {
                eingabe.updateOne({ username: name }, {
                    $set: {
                        semesterangabe: datenChangeValue
                    }
                });
                return true;
            }
            default: {
                return false;
            }
        }
        /*eingabe.updateOne({ username: name }, { // Funktioniert nicht, datenChangeKey wird so eingetragen "datenChangeKey"
            $set: {
                datenChangeKey: datenChangeValue
            }
        });*/
    }
    function deleteFirstKey(url) {
        let jsonStringCutted = "{";
        for (let key in url.query) {
            console.log("key: " + key);
            if (key != "site") {
                console.log("Nicht seite");
                jsonStringCutted = jsonStringCutted + "\"" + key + "\"" + ":" + "\"" + url.query[key] + "\"" + ",";
            }
        }
        let deletelaststring = jsonStringCutted.substring(0, jsonStringCutted.length - 1);
        jsonStringCutted = deletelaststring + "}";
        return jsonStringCutted;
    }
    async function checkLogin(anfrageList) {
        let userDaten = await retrieveDaten();
        let datenRichtig = false;
        for (let i = 0; i < userDaten.length; i++) {
            let usernameString = "\"" + anfrageList.username + "\"";
            //let emailString: string = email;
            // console.log(JSON.stringify(userDaten[i].email).toString() + " == " + usernameString); // "mmlpv.mossder@gmx.de" == mmlpv.mossder@gmx.de !!!FALSCH rumtesten
            if (JSON.stringify(userDaten[i].username) == usernameString) { // benutzerArr[i].email.toString() kann undefined sein ... muss gelöst werden durch vollständige Formular ausfüllung  
                console.log("jaaa ist gleich" + i);
                //let passwordString: string = "\"" + password + "\"";
                let passwordString = "" + anfrageList.password;
                if (userDaten[i].password == passwordString) { // undefined führt zu problemen
                    console.log("password ist gleich");
                    datenRichtig = true;
                    return datenRichtig;
                }
                break;
            }
        }
        return datenRichtig;
    }
    async function checkRegister(anfrageList) {
        let userDaten = await retrieveDaten();
        let datenVorhanden = false;
        for (let i = 0; i < userDaten.length; i++) {
            let usernameString = "\"" + anfrageList.username + "\"";
            //let emailString: string = email;
            //console.log(JSON.stringify(userDaten[i].email).toString() + " == " + usernameString); // "mmlpv.mossder@gmx.de" == mmlpv.mossder@gmx.de !!!FALSCH rumtesten
            if (JSON.stringify(userDaten[i].username) == usernameString) { // benutzerArr[i].email.toString() kann undefined sein ... muss gelöst werden durch vollständige Formular ausfüllung  
                datenVorhanden = true;
                return datenVorhanden;
            }
        }
        return datenVorhanden;
    }
    function storeEingabe(_eingabe) {
        eingabe.insertOne(_eingabe);
    }
    // anstatt beitrag: string muss beitrag:Daten
    async function retrieveDatenBenutzer() {
        let datenArr = await eingabe.find().toArray();
        return datenArr;
    }
    async function retrieveDaten() {
        let datenArr = await eingabe.find().toArray();
        return datenArr;
    }
})(server_script = exports.server_script || (exports.server_script = {}));
//# sourceMappingURL=server.js.map