# LostCats — Изисквания за реалната имплементация (вариант: Python + React + PostgreSQL + k3s)

Този документ описва **как** да се имплементира платформата според избран стек и инфраструктура.  
Продуктовото описание и логическите данни са в отделния файл „Пълно продуктово описание“.

---

## 1) Технологичен стек
- **Backend:** Python (FastAPI препоръчително)
- **Frontend:** React (SPA)
- **Database:** PostgreSQL
- **Containerization:** Docker
- **Orchestration/Deploy:** k3s cluster (Kubernetes)

Допълнителни зависимости (препоръчителни):
- **Object Storage за снимки:** S3-compatible (напр. MinIO в кластера) или външен S3.
- **Reverse proxy / Ingress:** Traefik (по подразбиране в k3s) или NGINX Ingress.
- **Auth:** JWT access + refresh (или сесии), email verification (по възможност).
- **Migrations:** Alembic.
- **Background jobs:** Celery+Redis или RQ+Redis (за thumbnails, архивиране).
- **Observability:** Prometheus/Grafana + Loki (по избор), OpenTelemetry (по избор).

---

## 2) Архитектура
### 2.1 Backend слоеве (препоръка)
- **API layer (routers/controllers):** HTTP контракти, валидиране на входа, статус кодове.
- **Service layer:** бизнес логика (валидиране на правила, matching, политики).
- **Repository/DAO layer:** достъп до DB, транзакции, оптимизирани заявки.
- **Storage layer:** абстракция за файлове (S3/MinIO), генериране на signed URLs.
- **Background workers:** thumbnails, exif strip, scheduled архивиране.

### 2.2 Frontend архитектура
- React SPA с:
  - routing (React Router);
  - state/query management (TanStack Query препоръчително);
  - form management (React Hook Form);
  - карта (Leaflet/Mapbox/Google Maps — според лиценз/бюджет);
  - upload компонент с preview и лимит 5 файла.

### 2.3 Модули (backend)
- `auth` (register/login/verify/reset)
- `users` (profile/settings)
- `posts` (lost/found CRUD)
- `photos` (upload/delete/reorder)
- `chip_lookup` (search by chip)
- `messaging` (threads/messages)
- `reports` (moderation signals)
- `matching` (score + suggestions)
- `admin` (moderation, audit logs)

---

## 3) База данни (PostgreSQL) — таблици (предложение)
> Имената са примерни; реализацията трябва да следва логическия модел.

- `users`
- `posts`
- `post_photos`
- `message_threads`
- `messages`
- `reports`
- `match_suggestions`
- `audit_logs`

### 3.1 Индекси (ключови)
- `posts(type, status, event_datetime desc)`
- `posts(chip_number)` (B-tree)
- Гео-индекс:
  - вариант A: PostGIS (препоръчително) + `GEOGRAPHY(Point, 4326)` индекс
  - вариант B: без PostGIS — съхраняване на `lat/lng` и индекси + Haversine в заявките (по-ограничено)
- `message_threads(post_id, created_at)`
- `messages(thread_id, created_at)`

### 3.2 Ограничения
- `post_photos`: constraint max 5 снимки/пост (enforce в service layer + DB trigger по желание).
- `users.email` unique.
- `posts.author_user_id` FK.

---

## 4) Файлово съхранение за снимки
### 4.1 Изисквания
- Поддържа:
  - upload на оригинал;
  - генериране и съхранение на thumbnail;
  - изтриване;
  - публично показване чрез signed URL или proxy endpoint.
- Изискване: премахване на EXIF от оригинал/копие.

### 4.2 Препоръчана реализация
- MinIO в k3s (S3 API).
- Bucket политика: private by default.
- Backend endpoint:
  - `POST /posts/{id}/photos` приема multipart, валидира тип/размер.
  - записва метаданни в `post_photos`, качва файл в S3, пуска job за thumbnail.

---

## 5) API (backend) — конкретни договори
### 5.1 Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout` (ако използваш refresh tokens)
- `POST /api/v1/auth/verify-email` (optional)

### 5.2 Posts
- `GET /api/v1/posts?type=LOST&status=ACTIVE&lat=...&lng=...&radius_km=...`
- `POST /api/v1/posts`
- `GET /api/v1/posts/{id}`
- `PATCH /api/v1/posts/{id}`
- `POST /api/v1/posts/{id}/resolve`
- `POST /api/v1/posts/{id}/archive`

### 5.3 Photos
- `POST /api/v1/posts/{id}/photos` (multipart)
- `DELETE /api/v1/photos/{photo_id}`
- `PATCH /api/v1/posts/{id}/photos/reorder`

### 5.4 Chip lookup
- `GET /api/v1/chip/{chip_number}`

### 5.5 Messaging
- `POST /api/v1/posts/{id}/contact` (create or reuse thread)
- `GET /api/v1/threads`
- `GET /api/v1/threads/{id}/messages`
- `POST /api/v1/threads/{id}/messages`

### 5.6 Reports / Admin
- `POST /api/v1/reports`
- `GET /api/v1/admin/reports`
- `POST /api/v1/admin/posts/{id}/hide`
- `POST /api/v1/admin/users/{id}/ban`

---

## 6) Сигурност
- Password hashing: Argon2/bcrypt.
- JWT:
  - кратък access token (15–30 мин)
  - refresh token (7–30 дни) със съхранение и ротация (препоръчително).
- Rate limiting (напр. Redis-backed):
  - login: 5/min
  - create post: 10/day (конфигурируемо)
  - message: 30/hour
- CORS: разреши само домейна на фронтенда.
- Input validation: Pydantic.
- Upload защита:
  - лимит размер (напр. 10MB/снимка);
  - allowlist типове (jpeg/png/webp).

---

## 7) Локално развитие (Dev)
- Docker Compose:
  - `api` (FastAPI)
  - `db` (Postgres)
  - `minio` (optional)
  - `redis` (optional)
- Migrations: `alembic upgrade head`
- Seed data (по избор): скрипт за demo.

---

## 8) Деплой в k3s
### 8.1 Компоненти
- Namespace: `lostcats`
- Deployments:
  - `lostcats-api`
  - `lostcats-web` (nginx static или Node serve)
  - `postgres` (по-добре външен managed; ако е вътрешен — StatefulSet)
  - `minio` (StatefulSet) — ако се използва
  - `redis` — ако се използва
  - `worker` — ако има background jobs
- Services + Ingress:
  - `/` -> web
  - `/api` -> api

### 8.2 Storage
- Postgres: PVC (с StorageClass на кластера).
- MinIO: PVC (erasure coding optional).
- Важно: за production — помисли за отделен NAS/Longhorn/NFS, мониторинг и backup.

### 8.3 Secrets/ConfigMaps
- Secrets:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `S3_ACCESS_KEY`, `S3_SECRET_KEY`
  - `SMTP_*` (ако има email)
- ConfigMaps:
  - лимити (max photos, max upload size, rate limits)
  - feature flags (matching on/off)

### 8.4 CI/CD
- GitHub Actions (пример):
  - build & push Docker images (api/web/worker)
  - deploy чрез Helm/manifest apply (kubectl) към k3s
- Versioning: semver tags.

---

## 9) Тестове и качество
- Backend:
  - unit tests (pytest)
  - integration tests срещу Postgres (testcontainers)
  - contract tests за ключови endpoints
- Frontend:
  - компонентни тестове (Vitest/RTL)
  - e2e (Playwright) — критични флоуове: publish post, chip lookup, messaging

---

## 10) Минимални deliverables (Definition of Done)
- Работеща регистрация/вход.
- CRUD за LOST/FOUND + снимки до 5.
- Търсене/филтър по радиус и дата.
- Chip lookup endpoint + UI форма.
- Messaging през платформата.
- Деплойнато в k3s с Ingress + TLS (ако домейн).
- Логове + базов мониторинг (минимум readiness/liveness probes).

---

## 11) Как да се „сменя имплементационният файл“
За друг технологичен стек, този файл се дублира и се подменят:
- backend framework/език,
- frontend framework,
- DB,
- deployment target,
- конкретни инструменти (migrations, background jobs, storage),
без да се пипа продуктово-логическият документ.
