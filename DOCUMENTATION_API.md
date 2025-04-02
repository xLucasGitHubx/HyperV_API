# 📝 Documentation Complète de l’API

Cette documentation décrit l’ensemble des endpoints et formats de données de **HyperV_API**, un service REST conçu pour gérer les Machines Virtuelles (VM), les vSwitch, les services réseau et les logs.

> **Important :** Certains endpoints sont protégés par JWT (indiqué dans la section correspondante). Vous devrez inclure un en-tête `Authorization: Bearer <token>` pour y accéder.

---

## Sommaire

1. [Authentification](#auth)
2. [Gestion des Machines Virtuelles (VM)](#vm)
3. [Gestion des vSwitch](#vswitch)
4. [Services Réseau (DHCP, AD, etc.)](#services)
5. [Logs](#logs)
6. [Messages d’erreur](#erreur)

---

## 1. Authentification <a id="auth"></a>

### 1.1. Login Utilisateur

- **Méthode :** `POST`
- **Endpoint :** `/api/auth/login`
- **Description :** Authentifie un utilisateur à partir d’un couple `username/password` et renvoie un **JWT**.
- **Body attendu :**
  ```json
  {
  	"username": "admin",
  	"password": "123456"
  }
  ```
- **Réponse :**
  ```json
  {
  	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  	"expiresIn": 7200
  }
  ```

En incluant ce token dans l’en-tête `Authorization: Bearer <token>`, vous aurez accès aux endpoints protégés.

---

## 2. Gestion des Machines Virtuelles (VM) <a id="vm"></a>

> **Routes protégées** (JWT requis, sauf mention contraire)

### 2.1. Créer une VM

- **Méthode :** `POST`
- **Endpoint :** `/api/vm/create`
- **Description :** Crée une nouvelle machine virtuelle dans la base de données, potentiellement associée à un vSwitch.
- **Body attendu :**
  ```json
  {
  	"name": "vm-test-01",
  	"ram": 4096,
  	"vcpu": 2,
  	"vswitch": "default-switch"
  }
  ```
  > Note : `vswitch` doit correspondre à un nom de vSwitch existant en base.
- **Réponse (succès) :**
  ```json
  {
  	"message": "VM created",
  	"data": [
  		{
  			"id": 3,
  			"name": "vm-test-01",
  			"ram": 4096,
  			"vcpu": 2,
  			"storage": 20,
  			"vswitchId": 1,
  			"userId": null
  		}
  	]
  }
  ```

### 2.2. Liste des VM

- **Méthode :** `GET`
- **Endpoint :** `/api/vm/list`
- **Description :** Retourne toutes les VM enregistrées.
- **Réponse (succès) :**
  ```json
  [
  	{
  		"id": 1,
  		"name": "vm-test-01",
  		"ram": 4096,
  		"vcpu": 2,
  		"storage": 20,
  		"userId": 2,
  		"vswitchId": 1
  	}
  ]
  ```

### 2.3. Détails d’une VM

- **Méthode :** `GET`
- **Endpoint :** `/api/vm/details?id={vmId}`
- **Description :** Retourne les détails de la VM spécifiée par `vmId`.
- **Query params :**
  - `id` : l’ID de la VM (ex: `1`)
- **Réponse (succès) :**
  ```json
  {
  	"id": 1,
  	"name": "vm-test-01",
  	"ram": 4096,
  	"vcpu": 2,
  	"storage": 20,
  	"userId": 2,
  	"vswitchId": 1
  }
  ```

### 2.4. Modifier une VM

- **Méthode :** `PUT`
- **Endpoint :** `/api/vm/update`
- **Description :** Met à jour la configuration d’une VM (RAM, vCPU, etc.).
- **Body attendu :**
  ```json
  {
  	"id": 1,
  	"ram": 8192,
  	"vcpu": 4
  }
  ```
- **Réponse (succès) :**
  ```json
  {
  	"message": "VM updated"
  }
  ```

### 2.5. Supprimer une VM

- **Méthode :** `DELETE`
- **Endpoint :** `/api/vm/delete?id={vmId}`
- **Description :** Supprime la VM associée à l’identifiant `vmId`.
- **Réponse (succès) :**
  ```json
  {
  	"message": "VM deleted"
  }
  ```

---

## 3. Gestion des vSwitch <a id="vswitch"></a>

### 3.1. Créer un vSwitch

- **Méthode :** `POST`
- **Endpoint :** `/api/vswitch/create`
- **Description :** Crée un switch virtuel.
- **Body attendu :**
  ```json
  {
  	"name": "vSwitch-01",
  	"userId": 1
  }
  ```
- **Réponse (succès) :**
  ```json
  {
  	"message": "vSwitch 'vSwitch-01' créé."
  }
  ```

### 3.2. Lister les vSwitch

- **Méthode :** `GET`
- **Endpoint :** `/api/vswitch/list`
- **Description :** Retourne la liste de tous les vSwitch enregistrés.
- **Réponse :**
  ```json
  [
  	{
  		"id": 1,
  		"name": "vSwitch-01",
  		"userId": 1
  	}
  ]
  ```

### 3.3. Supprimer un vSwitch

- **Méthode :** `DELETE`
- **Endpoint :** `/api/vswitch/delete?name={vswitchName}`
- **Description :** Supprime le vSwitch correspondant au nom passé en paramètre.
- **Réponse (succès) :**
  ```json
  {
  	"message": "vSwitch 'vSwitch-01' supprimé."
  }
  ```

---

## 4. Services Réseau (DHCP, AD, etc.) <a id="services"></a>

### 4.1. Configurer un service

- **Méthode :** `POST`
- **Endpoint :** `/api/services/configure`
- **Description :** Associe un service (DHCP, AD, DNS, etc.) à une VM donnée.
- **Body attendu :**
  ```json
  {
  	"service": "dhcp",
  	"userId": 2,
  	"vmId": 1
  }
  ```
- **Réponse (succès) :**
  ```json
  {
  	"message": "Service 'dhcp' configuré pour la VM."
  }
  ```

### 4.2. Liste des services

- **Méthode :** `GET`
- **Endpoint :** `/api/services/list`
- **Description :** Retourne tous les services existants en base.
- **Réponse (succès) :**
  ```json
  [
  	{
  		"id": 1,
  		"name": "dhcp"
  	},
  	{
  		"id": 2,
  		"name": "ad"
  	}
  ]
  ```

### 4.3. Services liés à une VM

- **Méthode :** `GET`
- **Endpoint :** `/api/services/vm/{vmId}`
- **Description :** Retourne les services associés à la VM spécifiée.
- **Réponse (succès) :**
  ```json
  [
  	{
  		"id": 10,
  		"userId": 2,
  		"serviceId": 1,
  		"vmId": 1,
  		"service": {
  			"id": 1,
  			"name": "dhcp"
  		}
  	}
  ]
  ```

---

## 5. Logs <a id="logs"></a>

### 5.1. Ajouter un log

- **Méthode :** `POST`
- **Endpoint :** `/api/logs/add`
- **Description :** Ajoute un log dans la table `vm_logs`.
- **Body attendu :**
  ```json
  {
  	"message": "La VM vient d'être créée.",
  	"userId": 2,
  	"vmId": 1
  }
  ```
- **Réponse (succès) :**
  ```json
  {
  	"message": "Log ajouté avec succès"
  }
  ```

### 5.2. Logs spécifiques à une VM

- **Méthode :** `GET`
- **Endpoint :** `/api/logs/vm/{vmId}`
- **Description :** Liste tous les logs liés à la VM.
- **Exemple de réponse :**
  ```json
  [
  	{
  		"id": 5,
  		"message": "La VM vient d'être créée.",
  		"userId": 2,
  		"vmId": 1
  	},
  	{
  		"id": 6,
  		"message": "Mise à jour de la RAM à 8 Go.",
  		"userId": 2,
  		"vmId": 1
  	}
  ]
  ```

### 5.3. Logs système

- **Méthode :** `GET`
- **Endpoint :** `/api/logs/system`
- **Description :** Retourne les derniers logs (toutes VM confondues), limités à 100.
- **Exemple de réponse :**
  ```json
  [
  	{
  		"id": 10,
  		"message": "La VM vm-test-01 a démarré.",
  		"userId": 2,
  		"vmId": 1
  	},
  	{
  		"id": 11,
  		"message": "vSwitch supprimé.",
  		"userId": 1,
  		"vmId": null
  	}
  ]
  ```

---

## 6. Messages d’erreur <a id="erreur"></a>

### 6.1. Format global

En cas d’erreur, l’API renvoie un code HTTP approprié (`400`, `404`, `500`, `401` si token invalide, etc.) et un JSON contenant :

```json
{
	"error": "Description du problème"
}
```

### 6.2. Exemples fréquents

- **400 Bad Request** : Champs obligatoires manquants, paramètre `id` absent.

  ```json
  {
  	"error": "Missing VM id"
  }
  ```

- **401 Unauthorized** : JWT manquant ou invalide.

  ```json
  {
  	"error": "Token invalide ou expiré"
  }
  ```

- **404 Not Found** : Ressource introuvable (VM, vSwitch, etc.).

  ```json
  {
  	"error": "VM not found"
  }
  ```

- **500 Internal Server Error** : Erreur interne du serveur ou de la base de données.

  ```json
  {
  	"error": "Internal Server Error"
  }
  ```

---

## Usage du JWT

Pour les **endpoints protégés**, vous devez inclure l’en-tête suivant :

```http
Authorization: Bearer <token>
```

### Récupérer le token

1. Appelez `POST /api/auth/login` avec un `username` et `password` valides.
2. Récupérez le champ `token` dans la réponse.
3. Stockez ce token côté client (cookies, localStorage, etc.).

### Exemple d’appel protégé

```bash
curl --request GET \
  --url http://localhost:3000/api/vm/list \
  --header 'Authorization: Bearer eyJhbGc...'
```

---

## Conclusion

Cette API offre un ensemble d’endpoints riche pour gérer et superviser vos machines virtuelles. Toutes les opérations courantes (création, listing, mise à jour, suppression) y sont couvertes, ainsi que la configuration réseau (vSwitch, services) et la journalisation (logs). Avec l’authentification JWT, vous pouvez sécuriser vos routes et garantir une utilisation adaptée à votre contexte.

N’hésitez pas à adapter ou étendre ces endpoints selon vos besoins spécifiques. Si vous avez des questions ou besoins de support, contactez-nous !
