"use strict";
var main;
(function (main_1) {
    let msg;
    let index = 0;
    let _form = "rund";
    let _formfarbe = "white";
    let _objektfarbe = "white";
    let _auswahl = ["drei", "white", "white", "drei", "white", "white", "drei", "white", "white"];
    let divElement;
    let divBezeichnung;
    let startY = 50;
    let daten;
    async function communicate(_url) {
        let response = await fetch(_url);
        console.log("Response", response);
        msg = await response.json();
        console.log(msg);
        datenEinsortieren(msg.kopfform, 0);
        datenEinsortieren(msg.kopffarbe, 1);
        datenEinsortieren(msg.kopfkugel, 2);
        datenEinsortieren(msg.bodyform, 3);
        datenEinsortieren(msg.bodyfarbe, 4);
        datenEinsortieren(msg.bodyfenster, 5);
        datenEinsortieren(msg.footform, 6);
        datenEinsortieren(msg.footfarbe, 7);
        datenEinsortieren(msg.footfeuer, 8);
    }
    function datenEinsortieren(wert, index) {
        for (let i = 0; i < wert.length; i++) {
            daten[index][i] = wert[i];
        }
    }
    function main() {
        communicate("http://127.0.0.1:5500/Aufgabe-2/data.json");
        if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/index.html") {
            seitenWahl(); // Seite auf der man sich befindet wird generiert
            auswahlListener();
            /*
            console.log(window.location.pathname.substring(window.location.pathname.lastIndexOf("/")));
            window.addEventListener("load", function(): void {
                console.log("jo");
                if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/end.html") {
                    zeichnenRakete();
                }
            });
            */
            //Button **********************************************************************************
            let buttonEleBack = document.getElementById("backButton");
            buttonEleBack.addEventListener("click", function funcBack() {
                console.log(index);
                if (index > 0) {
                    deleteSelect();
                    _auswahl[index] = _form;
                    _auswahl[index + 1] = _formfarbe;
                    _auswahl[index + 2] = _objektfarbe;
                    index = index - 3;
                    seitenWahl();
                    auswahlListener();
                }
                else {
                    // Fehlermeldung hinzufügen, dass man nicht zurück kommen kann wenn man auf der ersten Seite ist
                }
                console.log(index);
                console.log("_kopfASuwahl betätigt: " + _auswahl[0] + _auswahl[1] + _auswahl[2] + _auswahl[3] + _auswahl[4] + _auswahl[5] + daten[0].length);
            });
            let buttonEleSub = document.getElementById("submitButton");
            buttonEleSub.addEventListener("click", function funcSub() {
                console.log(index);
                if (index < 6) {
                    deleteSelect();
                    _auswahl[index] = _form;
                    _auswahl[index + 1] = _formfarbe;
                    _auswahl[index + 2] = _objektfarbe;
                    index = index + 3;
                    seitenWahl();
                    auswahlListener();
                }
                else {
                    _auswahl[index] = _form;
                    _auswahl[index + 1] = _formfarbe;
                    _auswahl[index + 2] = _objektfarbe;
                    index = index + 3;
                    auswahlSpeichern();
                    let endFenster = window.open("end.html");
                    endFenster.focus();
                }
                console.log(index);
                console.log("_kopfASuwahl betätigt: " + _auswahl[0] + _auswahl[1] + _auswahl[2] + _auswahl[3] + _auswahl[4] + _auswahl[5] + _auswahl[6] + _auswahl[7] + _auswahl[8] + daten[0].length);
            });
        }
        else if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/")) == "/end.html") {
            // Daten übergabe
            auswahlEinlesen();
            console.log(" Auswahl insgesamt betätigt: " + _auswahl[0] + _auswahl[1] + _auswahl[2] + _auswahl[3] + _auswahl[4] + _auswahl[5] + _auswahl[6] + _auswahl[7] + _auswahl[8] + daten[0].length);
            zeichnenRakete();
        }
    }
    function auswahlSpeichern() {
        sessionStorage.setItem("kopfform", _auswahl[0]);
        sessionStorage.setItem("kopffarbe", _auswahl[1]);
        sessionStorage.setItem("kopfkugel", _auswahl[2]);
        sessionStorage.setItem("bodyform", _auswahl[3]);
        sessionStorage.setItem("bodyfarbe", _auswahl[4]);
        sessionStorage.setItem("bodyfenster", _auswahl[5]);
        sessionStorage.setItem("footform", _auswahl[6]);
        sessionStorage.setItem("footfarbe", _auswahl[7]);
        sessionStorage.setItem("footfeuer", _auswahl[8]);
    }
    function auswahlEinlesen() {
        _auswahl[0] = sessionStorage.getItem("kopfform");
        _auswahl[1] = sessionStorage.getItem("kopffarbe");
        _auswahl[2] = sessionStorage.getItem("kopfkugel");
        _auswahl[3] = sessionStorage.getItem("bodyform");
        _auswahl[4] = sessionStorage.getItem("bodyfarbe");
        _auswahl[5] = sessionStorage.getItem("bodyfenster");
        _auswahl[6] = sessionStorage.getItem("footform");
        _auswahl[7] = sessionStorage.getItem("footfarbe");
        _auswahl[8] = sessionStorage.getItem("footfeuer");
    }
    function auswahlListener() {
        //Kopfform **********************************************************************************
        let kopfformEle = document.getElementById(index.toString());
        kopfformEle.addEventListener("change", function func0() {
            _form = kopfformEle.value;
            // _kopfform = check(_kopfform, 0); //nur zur überprüfung da, ob die Daten in data.ts mit Auswahlmöglichkeiten übereinstimmen.
            zeichnen(_form, _formfarbe, _objektfarbe);
        });
        //Kugelfarbe **********************************************************************************
        let kugelfarbeEle = document.getElementById("" + (index + 2).toString());
        kugelfarbeEle.addEventListener("change", function func2() {
            _objektfarbe = kugelfarbeEle.value;
            console.log("Input Kugelfarbe: " + _objektfarbe);
            // _kugelfarbe = check(_kugelfarbe, 1); //nur zur überprüfung da, ob die Daten in data.ts mit Auswahlmöglichkeiten übereinstimmen.
            zeichnen(_form, _formfarbe, _objektfarbe);
        });
        //Kugelfarbe **********************************************************************************
        let kopffarbeEle = document.getElementById("" + (index + 1).toString());
        kopffarbeEle.addEventListener("change", function func1() {
            _formfarbe = kopffarbeEle.value;
            //_kopffarbe = check(_kopffarbe, 1); //nur zur überprüfung da, ob die Daten in data.ts mit Auswahlmöglichkeiten übereinstimmen.
            zeichnen(_form, _formfarbe, _objektfarbe);
        });
    }
    function seitenWahl() {
        zeichnen(_form, _formfarbe, _objektfarbe);
        if (index <= 6) {
            divElement = document.getElementById("gridmain");
            divBezeichnung = document.getElementById("gridright");
            erstelleSelect(index + 1, divElement, divBezeichnung);
            erstelleSelect(index + 2, divElement, divBezeichnung);
            divElement = document.getElementById("gridheader");
            erstelleSelect(index, divElement, divBezeichnung);
        }
    }
    function erstelleSelect(index, divElementForm, divElementBezeichnung) {
        let selectKopfFarbe = document.createElement("select");
        selectKopfFarbe.id = (index).toString(); // war davor index%3
        console.log("ID: " + selectKopfFarbe.id);
        selectKopfFarbe.className = "abstand";
        divElementForm.className = divElementForm.id;
        for (let i = 0; i < daten[index].length; i++) {
            let option = document.createElement("option");
            option.value = daten[index][i];
            option.appendChild(document.createTextNode(daten[index][i]));
            selectKopfFarbe.appendChild(option);
        }
        divElementForm.appendChild(selectKopfFarbe);
        let text = document.createElement("p");
        text.className = "textright";
        text.id = (index).toString() + (index).toString(); // war davor index%3
        text.appendChild(document.createTextNode(main_1.bezeichnung[index]));
        divElementBezeichnung.appendChild(text);
    }
    function deleteSelect() {
        for (let i = 0; i < 3; i++) {
            let elem = document.getElementById("" + (index + i).toString());
            elem.remove();
            let elemText = document.getElementById("" + (index + i).toString() + (index + i).toString());
            elemText.remove();
        }
    }
    // zeichnen ***********************************************************************************************
    function zeichnenRakete() {
        let canvasEnd = document.getElementById("myEndCanvas");
        let contextEnd = canvasEnd.getContext("2d");
        contextEnd.clearRect(0, 0, canvasEnd.width, canvasEnd.height);
        contextEnd.lineWidth = 10;
        for (let i = 0; i <= 6; i = i + 3) {
            if (_auswahl[i] == "rund") {
                if (i == 0) {
                    startY = 100;
                    zeichnenkopfrund(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
                else if (i == 3) {
                    startY = 400;
                    zeichnenbodyrund(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
                else if (i == 6) {
                    startY = 700;
                    zeichnenfootrund(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
            }
            else if (_auswahl[i] == "vier") {
                if (i == 0) {
                    startY = 100;
                    zeichnenkopfvier(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
                else if (i == 3) {
                    startY = 400;
                    zeichnenbodyvier(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
                else if (i == 6) {
                    startY = 700;
                    zeichnenfootvier(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
            }
            else if (_auswahl[i] == "drei") {
                if (i == 0) {
                    startY = 100;
                    zeichnenkopfdrei(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
                else if (i == 3) {
                    startY = 400;
                    zeichnenbodydrei(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
                else if (i == 6) {
                    startY = 700;
                    zeichnenfootdrei(contextEnd, _auswahl[i + 1], _auswahl[i + 2]);
                }
            }
        }
    }
    // function zeichnen und zeichnenRakete könnte man zsm einfügen
    function zeichnen(form, farbeform, farbeobjekt) {
        let canvas = document.getElementById("myCanvas");
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 10;
        if (index == 0) {
            console.log("Es ist Kopf, Form:" + form + " Kopffarbe: " + farbeform + " ObjektFarbe: " + farbeobjekt);
            if (form == "rund") {
                zeichnenkopfrund(context, farbeform, farbeobjekt);
            }
            else if (form == "drei") {
                zeichnenkopfdrei(context, farbeform, farbeobjekt);
            }
            else if (form == "vier") {
                zeichnenkopfvier(context, farbeform, farbeobjekt);
            }
        }
        else if (index == 3) {
            if (form == "rund") {
                zeichnenbodyrund(context, farbeform, farbeobjekt);
            }
            else if (form == "drei") {
                zeichnenbodydrei(context, farbeform, farbeobjekt);
            }
            else if (form == "vier") {
                zeichnenbodyvier(context, farbeform, farbeobjekt);
            }
        }
        else if (index == 6) {
            if (form == "rund") {
                zeichnenfootrund(context, farbeform, farbeobjekt);
            }
            else if (form == "drei") {
                zeichnenfootdrei(context, farbeform, farbeobjekt);
            }
            else if (form == "vier") {
                zeichnenfootvier(context, farbeform, farbeobjekt);
            }
        }
        else {
            console.log("Es zeichnet rakete");
            zeichnenRakete();
        }
    }
    /* Kopf */
    function zeichnenkopfrund(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeform;
        context.fillStyle = farbeform;
        context.beginPath();
        context.moveTo(50, startY + 300);
        context.lineTo(50, startY + 200);
        context.arc(200, startY + 200, 150, 0, Math.PI, true);
        context.lineTo(350, startY + 200);
        context.lineTo(350, startY + 300);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = farbeobjekt;
        context.arc(200, startY + 200, 50, 0, Math.PI * 2, true);
        context.fill();
    }
    function zeichnenkopfdrei(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeform;
        context.fillStyle = farbeform;
        context.beginPath();
        context.moveTo(50, startY + 300);
        context.lineTo(200, startY);
        context.lineTo(350, startY + 300);
        context.lineTo(50, startY + 300);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = farbeobjekt;
        context.arc(200, startY + 200, 50, 0, Math.PI * 2, true);
        context.fill();
    }
    function zeichnenkopfvier(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeform;
        context.fillStyle = farbeform;
        context.beginPath();
        context.moveTo(50, startY + 300);
        context.lineTo(50, startY);
        context.lineTo(350, startY);
        context.lineTo(350, startY + 300);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = farbeobjekt;
        context.arc(200, startY + 200, 50, 0, Math.PI * 2, true);
        context.fill();
    }
    /* Body */
    function zeichnenbodyrund(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeobjekt;
        context.fillStyle = farbeform;
        context.beginPath();
        context.arc(200, startY, 150, Math.PI, Math.PI / 2, true);
        context.arc(200, startY + 300, 150, Math.PI * 1.5, Math.PI, true);
        context.lineTo(350, startY + 300);
        context.arc(200, startY + 300, 150, 0, Math.PI * 1.5, true);
        context.arc(200, startY, 150, Math.PI / 2, 0, true);
        context.closePath();
        context.fill();
        context.stroke();
        context.beginPath();
        context.arc(200, startY + 75, 50, 0, Math.PI * 2, true);
        context.fillStyle = farbeobjekt;
        context.fill();
        context.beginPath();
        context.arc(200, startY + 225, 50, 0, Math.PI * 2, true);
        context.fillStyle = farbeobjekt;
        context.fill();
    }
    function zeichnenbodydrei(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeobjekt;
        context.fillStyle = farbeform;
        context.beginPath();
        context.moveTo(50, startY);
        context.lineTo(100, startY + 150);
        context.lineTo(50, startY + 300);
        context.lineTo(350, startY + 300);
        context.lineTo(300, startY + 150);
        context.lineTo(350, startY);
        context.closePath();
        context.fill();
        context.stroke();
        context.beginPath();
        context.moveTo(150, startY + 50);
        context.lineTo(175, startY + 150);
        context.lineTo(150, startY + 250);
        context.lineTo(250, startY + 250);
        context.lineTo(225, startY + 150);
        context.lineTo(250, startY + 50);
        context.lineTo(150, startY + 50);
        context.fillStyle = farbeobjekt;
        context.fill();
    }
    function zeichnenbodyvier(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeform;
        context.fillStyle = farbeform;
        context.beginPath();
        context.moveTo(50, startY);
        context.lineTo(350, startY);
        context.lineTo(350, startY + 300);
        context.lineTo(50, startY + 300);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = farbeobjekt;
        context.beginPath();
        context.moveTo(150, 50 + startY);
        context.lineTo(250, 50 + startY);
        context.lineTo(250, startY + 250);
        context.lineTo(150, startY + 250);
        context.closePath();
        context.fill();
    }
    /* Foot */
    function zeichnenfootrund(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeform;
        context.fillStyle = farbeform;
        context.beginPath();
        context.arc(200, startY, 150, Math.PI, 0, true);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = farbeobjekt;
        context.beginPath();
        context.moveTo(50, startY + 225);
        context.lineTo(350, startY + 225);
        context.lineTo(350, startY + 250);
        context.lineTo(325, startY + 300);
        context.lineTo(300, startY + 250);
        context.lineTo(275, startY + 325);
        context.lineTo(250, startY + 250);
        context.lineTo(200, startY + 350);
        context.lineTo(150, startY + 250);
        context.lineTo(125, startY + 325);
        context.lineTo(100, startY + 250);
        context.lineTo(75, startY + 300);
        context.lineTo(50, startY + 250);
        context.closePath();
        context.fill();
    }
    function zeichnenfootdrei(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeform;
        context.fillStyle = farbeform;
        context.beginPath();
        context.moveTo(50, startY);
        context.lineTo(350, startY);
        context.lineTo(250, startY + 200);
        context.lineTo(200, startY + 100);
        context.lineTo(150, startY + 200);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = farbeobjekt;
        context.beginPath();
        context.moveTo(50, startY + 225);
        context.lineTo(350, startY + 225);
        context.lineTo(350, startY + 250);
        context.lineTo(325, startY + 300);
        context.lineTo(300, startY + 250);
        context.lineTo(275, startY + 325);
        context.lineTo(250, startY + 250);
        context.lineTo(200, startY + 350);
        context.lineTo(150, startY + 250);
        context.lineTo(125, startY + 325);
        context.lineTo(100, startY + 250);
        context.lineTo(75, startY + 300);
        context.lineTo(50, startY + 250);
        context.closePath();
        context.fill();
    }
    function zeichnenfootvier(context, farbeform, farbeobjekt) {
        context.strokeStyle = farbeform;
        context.fillStyle = farbeform;
        context.beginPath();
        context.moveTo(50, startY);
        context.lineTo(350, startY);
        context.lineTo(350, startY + 150);
        context.lineTo(250, startY + 150);
        context.lineTo(250, startY + 100);
        context.lineTo(150, startY + 100);
        context.lineTo(150, startY + 150);
        context.lineTo(50, startY + 150);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = farbeobjekt;
        context.beginPath();
        context.moveTo(50, startY + 225);
        context.lineTo(350, startY + 225);
        context.lineTo(350, startY + 250);
        context.lineTo(325, startY + 300);
        context.lineTo(300, startY + 250);
        context.lineTo(275, startY + 325);
        context.lineTo(250, startY + 250);
        context.lineTo(200, startY + 350);
        context.lineTo(150, startY + 250);
        context.lineTo(125, startY + 325);
        context.lineTo(100, startY + 250);
        context.lineTo(75, startY + 300);
        context.lineTo(50, startY + 250);
        context.closePath();
        context.fill();
    }
    //******************************************************************************************************************************************************** 
    main();
    //test();
})(main || (main = {}));
//# sourceMappingURL=script.js.map