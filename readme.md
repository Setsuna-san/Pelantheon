# 🍺 Pelantheon

Pelantheon est un site web développé avec **Angular** permettant de répertorier, classer et noter différentes bières.  
L’objectif est d’offrir un espace simple pour ajouter des bières, attribuer des notes, consulter des statistiques et synchroniser les données localement ou via Firebase.

---

## 🚀 Fonctionnalités

- [ ] Ajouter des bières
- [ ] Attribuer des notes
- [ ] Suivre les statistiques globales
- [ ] Voir les statistiques par utilisateur

---

## 🧩 Features techniques

- [ ] API REST locale pour la gestion et le stockage des données en local
- [ ] Firebase pour le stockage et la synchronisation des données en ligne
- [ ] Application Angular responsive

---

## 📦 Installation & Lancement

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/Setsuna-san/pelato.git
cd pelato
```

### Lancer le projet
```bash
cd pelato/app
npm install
ng serve
```

### Mettre en ligne avec Firebase
#### ⚠️ Avertissement : Configuration de l’environnement

Pour utiliser Firebase, il est nécessaire de créer un fichier `environment.ts` dans `src/environments` avec vos informations :

```typescript
export const environment = {
    apiUrl: 'http://localhost:8080',
    status: 'normal',
    biereService: 'src/app/services/bieres/biere.firebase.service'
};

export const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "la-bonne-biere.firebaseapp.com",
  projectId: "la-bonne-biere",
  storageBucket: "la-bonne-biere.firebasestorage.app",
  messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxxxxxxxxxxxx"
};

```bash
ng build
firebase deploy
```
