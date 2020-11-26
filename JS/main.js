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
    getInfo()
    var prix_adulte = getChoice('prix_adulte')
    var prix_enfant = 0.4*prix_adulte

    var petit_dej = document.getElementById("petit_dej").checked;

    var inputs = document.getElementById('form').elements;
    var nombre_adultes = parseInt(inputs["Nombre_d'adultes"].value);
    var nombre_enfants = parseInt(inputs["Nombre_d'enfants"].value);

    if (validDate()){
        var nb_jours = calcJours()
        var prix = nombre_adultes*prix_adulte;
        prix = prix + nombre_enfants*prix_enfant;
        prix = prix*nb_jours;
        prix = prix + 14*nb_jours*(nombre_adultes+nombre_enfants)*petit_dej
        chgbyId(prix,'prix');
    }
    else{
        chgbyId('Veuillez selectionner des dates valides pour afficher le prix.','prix');
    }
}

function calcJours(){
    // !!! On suppose que le retour soit apres l'arrivee: toujours mettre donc apres une verification de la date !!!
    var inputs = document.getElementById('form').elements;
    var depart = inputs["Date_de_depart"].value;
    var retour = inputs["Date_de_retour"].value;
    var depart = new Date(depart); 
    var retour = new Date(retour); 
  
    // Calcul de la difference de temps
    var diff_temp = retour.getTime() - depart.getTime(); 
  
    // To calculate the no. of days between two dates 
    var diff_jours = diff_temp / (1000 * 3600 * 24);
    
    return diff_jours
}


//---------- Validation des criteres --------
function validDate(){
    var inputs = document.getElementById('form').elements;
    var depart = inputs["Date_de_depart"].value;
    var retour = inputs["Date_de_retour"].value;
    if(depart < retour){
        return true
    }
    else{
        return false
    }
}
function validClient(){
    var inputs = document.getElementById('form').elements;
    var nombre_adultes = inputs["Nombre_d'adultes"].value;
    if(nombre_adultes >= 1){
        return true
    }
    else{
        return false
    }
}

//--------------------------------------------
//--------  Erreures possibles ---------------
function date_error(){
    if (!(document.getElementById("date_error") == null)){
        document.getElementById("date_error").remove();
    }
    var div1 = document.createElement("div");
    div1.setAttribute('id',"date_error");
    div1.setAttribute('class',"error")
    var contenu1 = document.createTextNode("!Erreur! : Le depart est avant ou egal au retour, ou la date n'est pas valide");

    // ajoute le nœud texte au nouveau div créé
    div1.appendChild(contenu1);

    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv1 = document.getElementById('error');
    document.body.insertBefore(div1, currentDiv1);
}

function client_error(){
    if (!(document.getElementById("client_error") == null)){
        document.getElementById("client_error").remove();
    }
    var div1 = document.createElement("div");
    div1.setAttribute('id',"client_error");
    div1.setAttribute('class',"error")
    var contenu1 = document.createTextNode("!Erreur! : Il n'y a aucun passager, ou il n'y a que des enfants, ce qui est interdit. ");

    // ajoute le nœud texte au nouveau div créé
    div1.appendChild(contenu1);

    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv1 = document.getElementById('error');
    document.body.insertBefore(div1, currentDiv1);
}


//------------------------------------------------
//------ Verifiction pour passer au Recap---------
function saveF(){
    if (validDate()){
        if(validClient()){
            document.forms["form"].submit;
            window.location.replace("Recapitulatif.html");
        }
        else{
            client_error()
        }
    }
    else{
        date_error()
    }

}

function init(){
    localStorage.clear();
    var aVoyages = new Array;
    saveListe("voyages",aVoyages);
    window.location.replace("Menu_Principal.html");
}

function returnMenu(){
    if ( confirm( "  -  Retourner au Menu Principal? Cela effacera la progression. -  " ) ) {
        var aVoyages = getListe("voyages");
        aVoyages.pop();
        saveListe("voyages",aVoyages)
        window.location.replace("Menu_Principal.html");
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
            if (json[i].Nom == destination){
                var prix_adulte = json[i].PrixAd;
                saveChoice("prix_adulte", prix_adulte)
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

