# STAF PRINT CENTER

> **"L'empreinte de votre succès"**
> Plateforme web de STAF PRINT CENTER — studio créatif basé à Porto-Novo, Bénin (design graphique, impression numérique, développement web, formations).

🔗 Site public : [stafprint.com](https://stafprint.com)

---

## 📌 À propos

STAF PRINT CENTER est un studio créatif fondé en 2019 à Porto-Novo, Bénin. Cette plateforme regroupe l'ensemble de l'écosystème digital de l'entreprise : vitrine publique, back-office d'administration, espace étudiant/formation, et outils internes (QR codes, newsletter, etc.).

Le projet est développé et maintenu par **Steve Aster Afovo** (super_admin & développeur principal).

---

## 🏗️ Architecture

Le projet est organisé en **multi-sous-domaines**, chacun servant un usage distinct sur une même API backend :

| Sous-domaine | Rôle |
|---|---|
| `stafprint.com` | Site vitrine public |
| `admin.stafprint.com` | Back-office / administration |
| `student.stafprint.com` | Espace étudiant / formations |
| `go.stafprint.com` | Outils courts liens / QR codes |

### Stack technique

- **Backend** : Laravel 11 (PHP 8.4), API REST
- **Hébergement** : alwaysdata (mutualisé)
- **Frontend** : React + TanStack Router + TanStack Query
- **Pattern d'architecture front** : types dans `src/data`, stores générés via `createResourceStore`, hooks TanStack Query, routes admin `list` / `detail` — voir la skill interne `api-frontend-sync` pour le détail du pattern à respecter systématiquement.

---

## 🧩 Modules fonctionnels

- **Newsletter** — inscription et gestion des abonnés
- **Avis & feedback clients** — formulaire dynamique (form builder)
- **Pré-inscriptions aux formations**
- **Offres d'emploi & candidatures**
- **Demandes de stage**
- **Annonces & bannières**
- **QR codes** — génération et gestion

---

## ⚙️ Prérequis

- PHP 8.4
- Composer
- Node.js (LTS recommandé) + npm/pnpm
- Base de données compatible (MySQL/MariaDB selon config alwaysdata)

---

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/<org>/<repo>.git
cd <repo>

# Backend (Laravel)
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Frontend (React)
cd frontend
npm install
npm run dev
```

> ⚠️ Adapter les variables `.env` selon l'environnement (local / staging / production alwaysdata), notamment les URLs des différents sous-domaines et les clés API.

---

## 🔄 Conventions de développement

- Tout nouveau code frontend (routes, stores, formulaires) doit respecter le **pattern architectural établi** (TanStack Router/Query) — ne pas improviser une structure différente sans validation préalable.
- Toute ressource CRUD doit exposer : types (`src/data`), store (`createResourceStore`), hooks (TanStack Query), routes admin `list` + `detail`.
- Les commits suivent [préciser convention : Conventional Commits, etc.]
- Les PR doivent être reliées à une issue et passer la revue avant merge sur `main`.

---

## 📄 Licence

Propriétaire — © 2026 STAF PRINT CENTER. Tous droits réservés.

---

## 📬 Contact

- Email : contact@stafprint.com
- Porto-Novo, Bénin