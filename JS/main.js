function saveChoice(variable,choix) {
    localStorage.setItem(variable, choix);
}

function saveListe(variable,liste) {
    localStorage.setItem(variable, JSON.stringify(liste));
}

function getChoice(variable){
    return localStorage.getItem(variable);
}

function getListe(variable){
    return JSON.parse(localStorage.getItem(variable));
}

function chgbyId(text,Id){
    document.getElementById(Id).innerHTML = text;
}

function saveForm(Id){
    var inputs = document.getElementById(Id).elements;
    for (i = 0; i < inputs.length; i++) {
        saveChoice(inputs[i].id,inputs[i].value)
    }
}

function Recap(){
    chgbyId(getChoice('Nom'),'Nom')
    chgbyId(getChoice('Prenom'),'Prenom')
    chgbyId(getChoice('Adresse_mail'),'Adresse_mail')
    chgbyId(getChoice('Date_de_depart'),'Date_de_depart')
    chgbyId(getChoice('Date_de_retour'),'Date_de_retour')
    chgbyId(getChoice('Destination'),'Destination')
    chgbyId(getChoice('Numero_de_telephone'),'Numero_de_telephone')
}

function prntPrix(){
    var prix_ad = getChoice('prixAd')
    var prix_en = getChoice('prixEn')
    var inputs = document.getElementById('form').elements;
    if ((parseInt(inputs["Nombre_d'adultes"].value) == undefined) && (parseInt(inputs["Nombre_d'enfants"].value) == undefined )){
        chgbyId('0','prix');
    }else if (parseInt(inputs["Nombre_d'adultes"].value) == undefined){
        
        chgbyId(parseInt(inputs["Nombre_d'enfants"].value)*prix_en,'prix');

    }else if(parseInt(inputs["Nombre_d'enfants"].value) == undefined){
        var prix = parseInt(inputs["Nombre_d'adultes"].value)*prix_en
        chgbyId(prix,'prix');
    }
    else{
        var prix = parseInt(inputs["Nombre_d'adultes"].value)*prix_ad+parseInt(inputs["Nombre_d'enfants"].value)*prix_en;
        chgbyId(prix,'prix');
    }
    
}

function saveF(){
    var inputs = document.getElementById('form').elements;
    var depart = inputs["Date_de_depart"].value;
    var retour = inputs["Date_de_retour"].value;
    if(depart < retour){
        document.forms["form"].submit;
        window.location.replace("Recapitulatif.html");
    }
    else{
        if (!(document.getElementById("erreur") == null)){
            document.getElementById("erreur").remove();
        }
        
        var div1 = document.createElement("div");
        div1.setAttribute('id',"erreur");
        var contenu1 = document.createTextNode(" - !Erreur! : Verifiez bien que le depart soit avant le retour, ou que la date est valide");

        // ajoute le nœud texte au nouveau div créé
        div1.appendChild(contenu1);

        // ajoute le nouvel élément créé et son contenu dans le DOM
        var currentDiv1 = document.getElementById('erreur_date');
        document.body.insertBefore(div1, currentDiv1);
    }
}



function init(){
    if (getChoice("Init") == null){
        localStorage.clear();
        var aVoyages = new Array;
        saveListe("voyages",aVoyages);
        saveChoice("Init","1");
    }
}

function returnMenu(){
    if ( confirm( "  -  Retourner au Menu Principal? Cela effacera la progression. -  " ) ) {
        var aVoyages = getListe("voyages");
        aVoyages.pop();
        saveListe("voyages",aVoyages)
        window.location.replace("Index.html");
    } else {
        alert("   -   Retour Annulé   -   ");
    }

}

function initClass(destination){
    var aVoyages = getListe("voyages");
    const voyage = new cVoyage(destination);
    aVoyages.push(voyage);
    saveListe("voyages",aVoyages);
}

//Fonction permettant d'imprimer un element de la classe voyage
function returnVoyage(){
    var aVoyages = getListe("voyages");
    return aVoyages[aVoyages.length - 1]
}

function ChangerDestination(){
    var voyage = returnVoyage()
    var destination = voyage.destination;
    chgbyId(destination,'Destination')
}

function getInfo(){
    var voyage = returnVoyage();
    var destination = voyage.destination;
    fetch("../JS/main.json")
    .then(function(response) {
        return response.json()
    })
    .then(function(json) {
        for (var i = 0; i < json.length;i++) {
            if (json[i].destination == destination){
                var prix_adulte = json[i].prixAd;
                var prix_enfant =prix_adulte*0.4
            }
        }

    })

}

class cVoyage{
    constructor(destination){
        this.destination = destination;
        this.nbAd = 0;
        this.nbEn = 0;
        this.dateA = "";
        this.dateR = "";
    }
    getdest_nb(){
        return this.dest_nb
    }
    getDestination(){
        return this.destination
    }
    getnbAd(){
        return this.nbAd
    }
    getnbEn(){
        return this.nbEn
    }
    getdateA(){
        return this.nbEn
    }
    getdateR(){
        return this.nbEn
    }
    modifydestination(val){
        this.destination = val;
    }
    modifydest_nb(val){
        this.dest_nb = val;
    }
    modifynbEn(val){
        this.nbEn = val;
    }
    modifynbAd(val){
        this.nbAd = val;
    }
    modifydateA(val){
        this.dateA = val;
    }
    modifydateR(val){
        this.dateR = val;
    }
    saveData(){
        sessionStorage.setItem("Voyage"+this.dest_nb,Voyage); 
    }
    
}

function printVilles(){
    fetch("../JS/main.json")
    .then(function(response) {
    return response.json()
    })
    .then(function(json) {
    for (var i = 0; i < json.length;i++) {
    
    //Creer le div principal
    var div = document.createElement("div");
    div.setAttribute('class',json[i].Order);
    var link = document.createElement("a");
    link.setAttribute('href','Formulaire.html');
    var initClass = "initClass('";
    initClass += json[i].Nom;
    initClass += "')";
    link.setAttribute('onclick',initClass)
    var contenu = document.createTextNode(json[i].Nom);
    
    // ajoute le nœud texte au nouveau div créé
    link.appendChild(contenu);
    
    // ajoute une image dans un div a chaque objet de class Destination
    var image = document.createElement("img");
    image.setAttribute('src', json[i].Image);
    image.setAttribute('alt', "Photo de " + json[i].Nom);
    image.setAttribute('height', 200);
    image.setAttribute('width', 300);
    var div2 = document.createElement("div");
    div2.appendChild(image);
    link.appendChild(div2);
    
    // Petite description de la ville
    var descript = document.createElement("pre");
    descript.setAttribute('class', "Description")
    var contenu = document.createTextNode(json[i].Description);
    descript.appendChild(contenu);
    link.appendChild(descript);
    
    // API météo sur place
    //var meteo = document.createElement('div');
    div.appendChild(link);
    
    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv = document.getElementById('Villes');
    document.body.insertBefore(div, currentDiv);
    }
    })
   }

