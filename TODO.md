### Features
- Ajouter récap syllabes sur lesquelles on s'est raté dans le mode train
- Ajouter records accuracy et speed (/acc, /speed, commands identiques à /records)
- Ajouter status Discord pour dire room principale et nombre de rooms (setInterval)
- Commande "/def" : voir quelle api utilisée par overlay Amaya
- Dans le "/c", ajouter un flag pour ne rechercher que des mots SANS catégories.

### Bugs
- L'alpha skippe la lettre Z
- Le mot bonus ne correspond pas au mode actuel (mot trop commun en sub par exemple)
- La gestion de l'event willTransferRoom ne fonctionne
- Certains profils ne sont pas détectés avec le "/profile" et ne peut pas être créé avec "/createprofile"