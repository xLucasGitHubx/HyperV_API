# 🚀 HyperV_API

**HyperV_API** est une API REST complète conçue pour simplifier la gestion automatisée des Machines Virtuelles (VM), des switchs virtuels (vSwitch), des services réseau (DHCP, AD, DNS) et des logs associés. Construite avec Node.js, Express et Drizzle ORM (PostgreSQL), cette API est prête à l'emploi et facile à étendre.

---

## 🎯 Fonctionnalités clés

- **Gestion complète des VM** : création, modification, suppression et monitoring.
- **Configuration simplifiée des vSwitch** : ajout, liste et suppression.
- **Intégration des services réseau** : configurer des services tels que DHCP, Active Directory et DNS.
- **Authentification sécurisée** : JWT simple et efficace.
- **Monitoring et logs** : récupération des logs système et logs spécifiques aux VMs.

---

## 🛠️ Stack technique

- **Backend** : Node.js avec Express
- **Base de données** : PostgreSQL
- **ORM** : Drizzle ORM
- **Authentification** : JWT

---

## 📂 Structure du projet

```bash
HyperV_API
├── drizzle               # Migrations Drizzle
├── src
│   ├── db                # Connexion DB et schémas
│   ├── routes            # Routes Express (VM, vSwitch, services, logs)
│   ├── utils             # Helpers (authentification, etc.)
│   └── server.ts         # Point d'entrée du serveur
├── drizzle.config.ts     # Configuration Drizzle ORM
├── package.json          # Dépendances et scripts
└── .env                  # Variables d'environnement
```

---

## ⚙️ Installation rapide

Clonez le dépôt et installez les dépendances :

```bash
git clone <votre_repo_git>
cd HyperV_API
npm install
```

Configurez votre `.env` :

```env
DATABASE_URL=postgres://user:password@localhost:5432/hyperv_db
JWT_SECRET=votre_secret_jwt
PORT=3000
```

---

## 🚀 Démarrage rapide

Exécutez les migrations Drizzle :

```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

Lancez l'API en mode développement :

```bash
npm run dev
```

---

## 📌 API Endpoints

Voici quelques exemples d'endpoints :

### Machines Virtuelles

- Créer une VM : `POST /api/vm/create`
- Liste des VM : `GET /api/vm/list`
- Détails d'une VM spécifique : `GET /api/vm/details?id={vmId}`
- Modifier une VM : `PUT /api/vm/update`
- Supprimer une VM : `DELETE /api/vm/delete?id={vmId}`

### Switchs virtuels

- Créer un vSwitch : `POST /api/vswitch/create`
- Liste des vSwitch : `GET /api/vswitch/list`
- Supprimer un vSwitch : `DELETE /api/vswitch/delete?name={vswitchName}`

### Services réseau

- Configurer un service : `POST /api/services/configure`
- Liste des services : `GET /api/services/list`
- Services liés à une VM : `GET /api/services/vm/{vmId}`

### Logs

- Ajouter un log : `POST /api/logs/add`
- Logs spécifiques d'une VM : `GET /api/logs/vm/{vmId}`
- Logs système : `GET /api/logs/system`

### Authentification

- Login utilisateur : `POST /api/auth/login`

---

## 🔐 Sécurité et Authentification

L'API utilise JWT pour sécuriser les endpoints sensibles. Chaque route sensible utilise le middleware `authenticate`.

### Exemple d'utilisation d'une route protégée :

```javascript
import { authenticate, getUserId } from "../utils/auth";

router.get("/protected", authenticate, (req, res) => {
	const userId = getUserId(req);
	res.json({ message: "Zone protégée", userId });
});
```

### 📦 Données retournées par la route protégée

Lors de la connexion sécurisée à une route protégée, l'utilisateur authentifié obtient :

- **userId** : ID unique de l'utilisateur extrait du JWT
- **message** : Message personnalisé indiquant l'accès réussi à la ressource protégée

---

## ✅ Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une pull request ou ouvrir une issue pour suggérer des améliorations.

---

## 📫 Contact

Pour toute question ou suggestion, contactez-moi : [lucasmadjinda@gmail.com](mailto:lucasmadjinda@gmail.com)
