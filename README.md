# Visualisation-de-Cours-Bourse
Petite Application pour un process de recrutement

Projet déployé à l'adresse: http://52.56.36.139/

Pour deployer le projet en local : 

```bash 
$ git clone https://github.com/aymebou/Visualisation-de-Cours-Bourse.git
$ cd Visualisation-de-Cours-Bourse
$ npm install
$ npm start
```

Ensuite taper localhost:4000 dans le navigateur.

Les fichiers en racine et /bin/www sont exclusivement executés par le server, tout ce qui est en public peut être executé par le client.
Toutes les vérifications de la cohérence des données envoyées sont faites côté server.
Le graphique se resize à chaque actualisation.
Le choix du nombre de points sur le graphique est fait côté server et l'utilisateur n'a aucun pouvoir dessus.
