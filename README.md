Lancer le projet :


### Cloner les projets dans un dossier commun :

Créer un dossier où cloner les deux repository : Schoolo-front et Schoolo-back

https://github.com/PIROSS-Dynamics/Schoolo-front.git

https://github.com/PIROSS-Dynamics/Schoolo-back.git


### Dans Schoolo-front

Faire npm install depuis le projet Schoolo-front

### Dans Schoolo-back

Depuis le projet Schoolo-back :

Pour éviter des soucis de versions, vous pouvez faire venv\Scripts\activate (Windows) ou source venv/bin/activate (macOs etLinux) avant l'étape suivante

Faire pip install -r requirements.txt 

### Lancement
Lancer le front avec npm start et lancer le back avec python manage.py runserver