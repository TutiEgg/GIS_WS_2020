"use strict";
var main;
(function (main) {
    // Geht nicht mit eval, da ich diese Variablen zum geniereien der Select boxen brauche
    // eventuelle Generation bei den Auswahlblöcken mit Form1 - FormN N=anzahl einträge in form
    let kopfform = ["drei", "vier", "rund"]; // bleiben erstmals statisch
    let kopffarbe = ["blue", "yellow", "red", "green"];
    let kopfkugel = ["blue", "yellow", "red", "green"];
    let bodyform = ["drei", "vier", "rund"];
    let bodyfarbe = ["blue", "yellow", "red", "green"];
    let bodyfenster = ["blue", "yellow", "red", "green"];
    let footform = ["drei", "vier", "rund"];
    let footfarbe = ["blue", "yellow", "red", "green"];
    let footfeuer = ["blue", "yellow", "red", "green"];
    main.bezeichnung = ["", "Kopffarbe", "Kopfkugel", "", "Bodyfarbe", "Bodyfenster", "", "Footfarbe", "Footfeuer"];
    main.daten = [kopfform, kopffarbe, kopfkugel, bodyform, bodyfarbe, bodyfenster, footform, footfarbe, footfeuer];
    /* Unübersichtlich
    {
    "datenInhalt": [
    {"kopfform": ["drei","vier","rund"]},
    {"kopffarbe": ["blue", "yellow", "red", "green"]},
    {"kopfkugel": ["blue", "yellow", "red", "green"]},

    {"bodyform": ["drei","vier","rund"]},
    {"bodyfarbe": ["blue", "yellow", "red", "green"]},
    {"bodyfenster": ["blue", "yellow", "red", "green"]},

    {"footform": ["drei","vier","rund"]},
    {"footfarbe": ["blue", "yellow", "red", "green"]},
    {"footfeuer": ["blue", "yellow", "red", "green"]},

    {"bezeichnung": ["", "Kopffarbe", "Kopfkugel", "", "Bodyfarbe", "Bodyfenster", "", "Footfarbe", "Footfeuer"]}
    ]
    


    
}
    */
})(main || (main = {}));
//# sourceMappingURL=data.js.map