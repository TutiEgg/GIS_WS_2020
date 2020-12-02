namespace main {

    // Geht nicht mit eval, da ich diese Variablen zum geniereien der Select boxen brauche
    // eventuelle Generation bei den Auswahlblöcken mit Form1 - FormN N=anzahl einträge in form
    let kopfform: string[] = ["drei", "vier", "rund"]; // bleiben erstmals statisch
    let kopffarbe: string[] = ["blue", "yellow", "red", "green"];
    let kopfkugel: string[] = ["blue", "yellow", "red", "green"];
    
    let bodyform: string[] = ["drei", "vier", "rund"];
    let bodyfarbe: string[] = ["blue", "yellow", "red", "green"];
    let bodyfenster: string[] = ["blue", "yellow", "red", "green"];
    
    let footform: string[] = ["drei", "vier", "rund"];
    let footfarbe: string[] = ["blue", "yellow", "red", "green"];
    let footfeuer: string[] = ["blue", "yellow", "red", "green"]; 
    
    export let bezeichnung: string[] = ["", "Kopffarbe", "Kopfkugel", "", "Bodyfarbe", "Bodyfenster", "", "Footfarbe", "Footfeuer"];

    export let daten: string[][] = [kopfform, kopffarbe, kopfkugel, bodyform, bodyfarbe, bodyfenster, footform, footfarbe, footfeuer ];
    

    
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


}




