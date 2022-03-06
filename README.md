# Lisez-moi

J'ai choisi de présenter l'exercice à travers une implémentation fonctionnelle basique présentant les prix
et le volume d'échange courant du bitcoin en euro. Cette implémentation m'a permis de faciliter en partie le reverse-engineering
et de bien comprendre comment l' API était consommée dans les applicatifs utilisant le service.
J'ai utilisé l'API publique de Kraken à ces fins; la documentation est disponible ici: https://docs.kraken.com/websockets/

L'application Angular 13.5.2 créée présente une architecture basique, et comme la mise en place des dépendances externes n'a pas été
demandé, vous pouvez directement consulter l'implémentation du websocket service dans le dossier src/app/core/services.

Une recherche sur le "flag(appConf)" permet de voir un "code alternatif" afin de respecter de manière plus stricte le contexte
initial (appConf comme constante).
Un sujet a été exposé pour remplacer les events broadcast dans $rootScope. Une autre implémentation intéressante via ngrx,
composé d'un dispatch d'évènement et d'un traitement via un effet aurait pu être proposée mais cela ne m'a pas semblé
pertinent dans le cadre de l'exercice.

Par manque de temps, les tests unitaires n'ont malheureusement pas pu être implémentés sur la refacto demandée, je pourrai les implémenter
sur demande si cela semble intéressant pour vous en terme d'analyse de compétence.

J'ai malheureusement échoué à utiliser un client STOMP dans la nouvelle implémentation.
Malgré de nombreuses tentatives, je n'ai pas été capable de trouver une implémentation dans laquelle le webSocketSubject d'Rxjs
était utile et viable. (@stomp/stompjs, @stomp/rx-stomp).
La méthode permettant d'override la methode debug du client stomp n'a donc pas non plus été implémentée.

Je serais heureux de pouvoir discuter de ces points avec vous lors d'une éventuelle rencontre. Dans le cas contraire,
j'apprécierai tout de même tout retour de l'équipe technique afin d'assimiler de nouvelles connaissances et compétences,
si cela vous convient.

## Lancer le serveur

Pour les utilisateurs de nvm, un .nvmrc est présent à la racine du dépôt:

- nvm use
- nvm install si version non installé.

Pour les utilisteurs n'utilisant pas nvm, l'application a été développée dans un environnement Node 16.13.0

- npm ci

- ng serve
