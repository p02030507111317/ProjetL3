DataCrawler
========

>Analyse et structuration de données

Installation
------------

L'application nécessite un serveur web avec:

* PHP
* Curl

Interface
---------

1. Name: Nom (affiché) de la racine
2. Target: Identifiant de la racine (replacera la chaine "$TARGET" du champ)
3. Field: Champ de recherche (URL) des données
4. Rule: Rêgle de détermination des données liées (voir Rêgle)

Règle
-----

Les règles de détermination sont des expressions régulières (PREG) contenant deux groupes nommés:

* node: identifiant de la donnée suivante
* data: nom (affiché) de la donnée

La plupart du temps, les données seront liées entre elles par des liens href. Dans ce cas, une rêgle générale peut être utilisée:

> `#<a .*? href="www.foo.bar/abc/def/(?<node>[^"]*)" .*?>(?<data>[^<]*)</a>#`

Pour plus d'inforamtions sur les expressions régulières [PREG](https://en.wikipedia.org/wiki/Regular_expression)

Utilisation
-----------

Nous alons ici étudier le cas de l'analyse des dépendances de paquets selon [https://packages.debian.org](https://packages.debian.org).

###1. Choix du champ.
Nous nous interessons ici à la varsion Wheezy du paquet. Le champ est ici 
>`https://packages.debian.org/wheezy/$TARGET`

###2. Analyse des données sources. 
Il s'agit ici de l'analyse du code source de la page d'un paquet. Ici, chaque paquet dont dépend le paquet choisi est listé sous forme de lien href de la forme 
>`<a href="/wheezy/xxx">yyy</a>` où xxx est l'identifiant de ce paquet et yyy son nom

###3. Création de la règle
Il s'agira ici de récupérer les identifiants et noms des paquets. La rêgle sera : 
>` #<a href="/wheezy/(?<node>[^"]*)">(?<data>[^<]*)</a># `


