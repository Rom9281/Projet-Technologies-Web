//_________________ INITIALISATION _____________
function init(){
    localStorage.clear();
    var aVoyages = new Array;
    var aPanier = new Array;
    saveListe("voyages",aVoyages);
    saveListe("panier",aPanier);
    window.location.replace("Menu_Principal.html");
}

function initClass(destination){
    var aVoyages = getListe("voyages");
    var id = genId();
    const voyage = new cVoyage(destination, id);
    aVoyages.push(voyage);
    saveListe("voyages",aVoyages);
}

function returnVoyage(){
    var aVoyages = getListe("voyages");
    return aVoyages[aVoyages.length - 1]
}
function saveVoyage(voyage){
    var aVoyages = getListe("voyages");
    aVoyages.pop(aVoyages.length - 1);
    aVoyages.push(voyage);
    saveListe("voyages",aVoyages)
}

function savePanier(voyage){
    var aPanier = getListe("panier");
    aPanier.push(voyage);
    saveListe("panier",aPanier)
}

function ChangerDestination(){
    var voyage = returnVoyage()
    var destination = voyage.destination;
    chgbyId(destination,'Destination');
}
//______________ GENERATE NUMBER _______________

function genId(){
    Id = "v"
    for (i = 1; i < 16; i++) {
        if (i%4 == 0){
            Id = Id + "-"
        }
        else{
            var rand = Math.floor(Math.random() * 10);
            rand = rand.toString()
            Id += rand
        }
    }
    return Id
}
//__________________ CLASSE VOYAGE ______________
class cVoyage{
    constructor(destination, id){
        this.destination = destination;
        this.id = Id;
        this.nom = "";
        this.prenom = "";
        this.tel = "";
        this.email = "";
        this.nombre_adultes = 0;
        this.nombre_enfants = 0;
        this.date_depart = "";
        this.date_retour = "";
        this.prix = 0;
        this.petit_dej = false;
        this.renseignements = "";
    }
    
}
//_________________ RETOUR AU MENU______________
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
//_________________ LOCAL STORAGE _________________

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

//______________ INTERACTION HTML _________________

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
        var voyage = returnVoyage()
        voyage.prix = prix
        voyage.petit_dej = petit_dej;
        saveVoyage(voyage)
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
//_______________ INFO VOYAGE _______________
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

//______________ IMPRIMER LES VILLES ____________
function printVilles(){
    fetch("../JS/main.json")
    .then(function(response) {
    return response.json()
    })
    .then(function(json) {
    var div_p = document.createElement("div");
    div_p.setAttribute('class','voyage');

    for (var i = 0; i < json.length;i++) {
        
        //Creer le div principal
        var div = document.createElement("div");
        div.setAttribute('class','voyages');
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
        image.setAttribute('class', "image")
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
        div_p.appendChild(div);
        
        
        }
    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv = document.getElementById('Villes');
    document.body.insertBefore(div_p, currentDiv);
    })
   }

//___________________ RETOUR SAISIE ___________________________

function retourSaisie(){
    eraseInfo();
    window.location.replace("Formulaire.html");
}

function eraseInfo(){
    var aVoyages = returnVoyage();
    aVoyages.nom = "";
    aVoyages.prenom = "";
    aVoyages.tel = "";
    aVoyages.email = "";
    aVoyages.nombre_adultes = 0;
    aVoyages.nombre_enfants = 0;
    aVoyages.date_depart = "";
    aVoyages.date_retour = "";
    aVoyages.prix = 0;
    aVoyages.petit_dej = false;
    aVoyages.renseignements = "";
    saveVoyage(aVoyages)
}
//__________________ IMPRESSION DU RECAP ______________________

function Recap(){
    var voyage = returnVoyage();
    chgbyId(voyage.id,'id');
    chgbyId(voyage.nom,'Nom');
    chgbyId(voyage.prenom,'Prenom');
    chgbyId(voyage.email,'Adresse_mail');
    chgbyId(voyage.date_depart,'Date_de_depart');
    chgbyId(voyage.date_retour,'Date_de_retour');
    chgbyId(voyage.destination,'Destination');
    chgbyId(voyage.tel,'Numero_de_telephone');
    chgbyId(voyage.nombre_adultes,'nombre_adultes');
    chgbyId(voyage.nombre_enfants,'nombre_enfants');
    chgbyId(voyage.renseignements,'renseignement');
    chgbyId(voyage.prix,'prix');
    if (voyage.petit_dej){
        chgbyId("Inclus",'petit_dej')
    }
    else{
        chgbyId("Non-inclus",'petit_dej')
    }
    
}

//__________________ VALIDATION DES CRITERES __________________
function validDate(){
    var inputs = document.getElementById('form').elements;
    var depart = inputs["Date_de_depart"].value;
    var retour = inputs["Date_de_retour"].value;

    var auj = new Date();
    var jour = auj.getDate();
    var mois = auj.getMonth() + 1; 
    var annee = auj.getFullYear();
    if (jour < 10){
        jour = "0"+jour
    }
    
    auj = annee+'-'+mois+'-'+jour

    if((depart < retour) && (depart > auj)){
        var voyage = returnVoyage()
        voyage.date_depart = depart;
        voyage.date_retour = retour;
        saveVoyage(voyage)
        return true
    }
    else{
        return false
    }
}
function validClient(){
    var inputs = document.getElementById('form').elements;
    var nombre_adultes = inputs["Nombre_d'adultes"].value;
    var nombre_enfants = inputs["Nombre_d'enfants"].value;
    if(nombre_adultes >= 1){
        var voyage = returnVoyage()
        voyage.nombre_adultes = nombre_adultes;
        voyage.nombre_enfants =nombre_enfants;
        saveVoyage(voyage)
        return true
    }
    else{
        return false
    }
}

function validProfil(){
    var inputs = document.getElementById('form').elements;
    var nom = inputs["Nom"].value;
    var prenom = inputs["Prenom"].value;
    var email = inputs["Adresse_mail"].value;
    var tel = inputs["Numero_de_telephone"].value;
    var renseignements = inputs["Renseignements"].value;
    if (((nom != "") && (prenom != "")) && ((email != "") && (tel != ""))){
        var voyage = returnVoyage()
        voyage.nom = nom,
        voyage.prenom = prenom,
        voyage.email = email,
        voyage.tel = tel,
        voyage.renseignements = renseignements,
        saveVoyage(voyage)
        return true
    }
    else{
        return false
    }
}

function validerVoyage(){
    var aVoyage = returnVoyage()
    savePanier(aVoyage)
    window.location.replace("Menu_Principal.html");
}


//______________________ Erreures possibles _____________________
function date_error(){
    eraseError();

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
    eraseError();

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

function profile_error(){
    eraseError();
    
    var div1 = document.createElement("div");
    div1.setAttribute('id',"profile_error");
    div1.setAttribute('class',"error")
    var contenu1 = document.createTextNode("!Erreur! : Le profile est incomplet: il manque le nom, prenom, email ou numero de telephone.");

    // ajoute le nœud texte au nouveau div créé
    div1.appendChild(contenu1);

    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv1 = document.getElementById('error');
    document.body.insertBefore(div1, currentDiv1);
}


function eraseError(){
    if (!(document.getElementById("date_error") == null)){
        document.getElementById("date_error").remove();
    }
    if (!(document.getElementById("client_error") == null)){
        document.getElementById("client_error").remove();
    }
    if (!(document.getElementById("profile_error") == null)){
        document.getElementById("profile_error").remove();
    }
}


//____________  Verifiction pour passer au Recap ____________

function saveF(){
    if (validDate()){ // Pas oublier de remmetre date
        if(validClient()){
            if(validProfil()){
                document.forms["form"].submit;
                window.location.replace("Recapitulatif.html");
            }
            else{
                profile_error();
            }
        }
        else{
            client_error()
        }
    }
    else{
        date_error()
    }

}

function updatePath(){
    fetch("../JS/main.json")
    .then(function(response) {
    return response.json()
    })
    .then(function(json) {
    for (var i = 0; i < json.length;i++) {

        // place un attibut target sur les éléments contenus dans le json
        var currentPath = document.getElementById(json[i].Id)
        currentPath.setAttribute('target',"True")

        currentPath.setAttribute('onclick',)
    }
})
}

