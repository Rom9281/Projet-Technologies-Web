# Projet_TLW
# BURLOT Alexandre et GAUD Romain
# Début du projet le 28 Septembre 2020
# Projet de réalisation d'un site complet d'une agence de voyage.

    Le projet proposé ici est un site internet au format HTML avec des documents CSS, JS, JSON.
Pour lancer le site web il suffit de lancer le fichier Index.html.

La page Index.html est une page permettant de vider le stockage web local de l'utilisateur pour initialiser notre panier comme étant vide.

Ensuite vous etes redirigé vers la pasge du Menu-principal qui est la page de garde de notre site internet.
Depuis celle-ci vous pourrez visualiser les différents voyages, accéder au panier UNIQUEMENT depuis cette page ci. Aussi un accès à la carte interractive du site.


Un menu d'identification est proposé sur cette page également et un menu déroulant de filtre en fonction du prix.


// Le JS

    Le cadre general

La logique du JS est de creer deux listes: une liste Voyage, qui regroupe les voyages en cours de modification, et une liste Panier, qui regroupe les voyages finalises.

Chaque voyage est un objet voyage, qui contient plusieurs parametres, comme la destination, les dates, le nombre de voyageurs, ect...

On initialise les deux listes lors de l'arrivee sur l'index

/!\  IMPORTANT : il est donc necessaire de lancer ll'index en premier, sinon le site ne sera pas operationel /!\

Nous avons choisit d'utiliser le localstorage pour stoquer les variables.

    Le chemin parcourue

On lance le site sur Index.html, qui redirige vers Menu_Principal.html
A partir de la, l'utilisation est la plus lineaire possible: on souhaite que le client ne puisse pas faire nimporte quoi.
C'est pour ca qu'a partir du choix de la destination par la carte ou le menuprincipal, il ne pourra retourner au menus principal seulement en appuyant sur le bouton retour menu. Cela permet d'empecher de s'enmeler dans des problemes de listes.

Le JS propose plusieurs verificateurs, dans la section VERIFICATION du fichier, qui empechent d'acceder au recap si la mise en forme n'est pas correct.

Le recap permet d'ajouter ses choix au panier et de revenir au menu principal, et ainsi de suite.
Le panier permet grace au JS de modifier la liste panier; c'est le seul a pouvoir le faire; cela permet d'au moins securiser une liste, quitte a voir voyage etre corrompus par une mauvaise utilisation.