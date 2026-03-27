# 📊 Статус разработки KFU Hub Med

> Интеграционная платформа медицинской санчасти Казанского федерального университета

![Backend](https://img.shields.io/badge/Backend-Java%2021%20%7C%20Spring%20Boot%203.3-6db33f?style=flat-square&logo=spring)
![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%205-61dafb?style=flat-square&logo=react)
![Infra](https://img.shields.io/badge/Infra-Docker%20%7C%20Kafka%20%7C%20PostgreSQL-2496ed?style=flat-square&logo=docker)
![Status](https://img.shields.io/badge/Статус-В%20разработке-orange?style=flat-square)
![Version](https://img.shields.io/badge/Версия-0.1.0--SNAPSHOT-blue?style=flat-square)

---

## 🗺️ Общий прогресс по этапам ТЗ

| № | Этап | Срок (ТЗ) | Статус | Прогресс |
|---|------|-----------|--------|----------|
| 1 | Аналитика и проектирование | 4 нед | ✅ Завершён | `████████████` 100% |
| 2 | MVP: Ядро платформы | 8 нед | 🔄 В процессе | `███░░░░░░░░░` 25% |
| 3 | Каталог датасетов | 6 нед | ⏳ Не начат | `░░░░░░░░░░░░` 0% |
| 4 | Интеграция ИИ-моделей | 8 нед | ⏳ Не начат | `░░░░░░░░░░░░` 0% |
| 5 | Внешние интеграции (FHIR/DICOM) | 6 нед | ⏳ Не начат | `░░░░░░░░░░░░` 0% |
| 6 | Управление задачами и проектами | 4 нед | ⏳ Не начат | `░░░░░░░░░░░░` 0% |
| 7 | Тестирование и безопасность | 4 нед | ⏳ Не начат | `░░░░░░░░░░░░` 0% |
| 8 | Опытная эксплуатация | 4 нед | ⏳ Не начат | `░░░░░░░░░░░░` 0% |
| 9 | Документирование и сдача | 2 нед | ⏳ Не начат | `░░░░░░░░░░░░` 0% |

---

## ✅ Что уже сделано

### 🔧 Инфраструктура
- [x] `.gitignore` для Java, Node.js, Python, Docker, IntelliJ, VS Code
- [x] `docker-compose.yml` — полное локальное окружение:
  - [x] PostgreSQL 16 со схемами под каждый микросервис
  - [x] Redis 7
  - [x] Elasticsearch 8 + Kibana
  - [x] MinIO (S3-совместимое хранилище)
  - [x] Apache Kafka 3.7 (KRaft, без Zookeeper) + Kafka UI
  - [x] HashiCorp Vault 1.17
  - [x] Keycloak 24
- [x] `.env.example` с переменными для всех сервисов
- [x] `infra/postgres/init/` — SQL-скрипты создания схем
- [x] `infra/vault/policies/` — политики доступа к секретам

### 🟢 Backend (`KFU_hub/`)
- [x] Мультимодульный Maven-проект (parent pom)
  - Spring Boot 3.3.4, Java 21, Spring Cloud 2023.0.3
  - HAPI FHIR 7.4.0 BOM, Testcontainers BOM
  - Lombok + MapStruct через `annotationProcessorPaths`
- [x] **8 микросервисов** — структура + `pom.xml` + `Application.java` + `application.yml`:
  - [x] `kfu-hub-common` — общие DTO, исключения, утилиты
  - [x] `kfu-hub-gateway` — Spring Cloud Gateway, rate limiting, circuit breaker
  - [x] `kfu-hub-auth` — Spring Security, OAuth2, Keycloak, 2FA
  - [x] `kfu-hub-dataset` — каталог датасетов, MinIO, Elasticsearch
  - [x] `kfu-hub-ai-gateway` — очередь ИИ-задач, SSE стриминг
  - [x] `kfu-hub-integration` — HAPI FHIR R4, dcm4che (DICOM)
  - [x] `kfu-hub-projects` — задачи, проекты, Kanban
  - [x] `kfu-hub-notifications` — email + in-app, Kafka consumer
  - [x] `kfu-hub-audit` — журнал действий, партиционирование, 3 года хранения

### 🔵 Frontend (`KFU_Hub_frontend/`)
- [x] Vite 5 + React 18 + TypeScript 5
- [x] Ant Design 5 с кастомной темой КФУ (`#45688e`)
- [x] Inter шрифт, CSS-переменные, кастомный scrollbar
- [x] Zustand store аутентификации
- [x] React Router 6 с вложенными маршрутами
- [x] TanStack Query (QueryClient + провайдер)
- [x] **Layout:** Sidebar (коллапсируемый, тёмный), Header (уведомления, профиль)
- [x] **Страница входа** — брендинг КФУ, форма, SSO кнопка
- [x] **Dashboard** — статистика, активность, прогресс ИИ-задач
- [x] **Каталог датасетов** — таблица, фильтры, drag-and-drop загрузка
- [x] **ИИ-анализ** — wizard запуска, 6 сценариев, история задач
- [x] **Проекты** — карточки, участники, прогресс, теги

---

## 🔲 Что предстоит сделать

### 🟢 Backend — реализация

#### Auth Service
- [ ] Entity: `User`, `Role`, `RefreshToken`
- [ ] Liquibase миграции схемы `auth`
- [ ] JWT генерация и валидация
- [ ] Интеграция с Keycloak (OIDC/SAML)
- [ ] 2FA для ролей Врач и Администратор
- [ ] REST API: `/auth/login`, `/auth/refresh`, `/auth/logout`
- [ ] Audit-события через Kafka

#### Dataset Service
- [ ] Entity: `Dataset`, `DatasetVersion`, `DatasetTag`
- [ ] Liquibase миграции схемы `datasets`
- [ ] Загрузка файлов в MinIO (multipart, до 5 ГБ)
- [ ] Индексация метаданных в Elasticsearch
- [ ] Полнотекстовый поиск и фасетная фильтрация
- [ ] Превью: первые 50 строк CSV/JSON, статистики
- [ ] Версионирование датасетов
- [ ] Автопроверка качества (дубли, пустые значения, выбросы)
- [ ] REST API CRUD + download + convert

#### AI Gateway Service
- [ ] Entity: `AITask`, `AITaskResult`
- [ ] Liquibase миграции схемы `ai_gateway`
- [ ] Kafka producer — публикация задач в очередь
- [ ] SSE endpoint — real-time прогресс задачи
- [ ] HTTP-клиент к Triton Inference Server
- [ ] HTTP-клиент к Hugging Face API
- [ ] Хранение результатов + история запусков
- [ ] Экспорт результатов (PDF, CSV, JSON)

#### Integration Service
- [ ] HAPI FHIR R4 сервер и клиент
- [ ] Валидация FHIR-ресурсов по профилям Минздрава РФ
- [ ] DICOM WADO/STOW/QIDO адаптер (dcm4che)
- [ ] REST-мост к республиканским МИС
- [ ] SOAP-адаптер для легаси-систем

#### Project Service
- [ ] Entity: `Project`, `Task`, `ProjectMember`, `Comment`
- [ ] Liquibase миграции схемы `projects`
- [ ] Kanban API (статусы задач)
- [ ] Файловое хранилище проекта (MinIO)
- [ ] Kafka-события → Notification Service
- [ ] Публичный каталог открытых задач

#### Notification Service
- [ ] Entity: `Notification`, `NotificationPreference`
- [ ] Kafka consumer для всех топиков событий
- [ ] Email отправка (Spring Mail + шаблоны)
- [ ] In-app уведомления через Redis pub/sub

#### Audit Service
- [ ] Entity: `AuditEvent` с партиционированием по месяцам
- [ ] Kafka consumer `kfu.hub.audit.event`
- [ ] REST API поиска и экспорта журнала
- [ ] Автоматическое создание партиций (scheduler)
- [ ] Ретенция данных 3 года (152-ФЗ)

#### API Gateway
- [ ] Маршрутизация к сервисам
- [ ] JWT-валидация на уровне шлюза
- [ ] Rate limiting через Redis
- [ ] Circuit breaker fallback-ответы
- [ ] Request/Response logging

### 🔵 Frontend — доработка

- [ ] Интеграция с реальным API (React Query хуки)
- [ ] Защищённые маршруты (redirect на `/login`)
- [ ] Страница профиля пользователя
- [ ] Страница интеграций (FHIR/DICOM статус)
- [ ] Страница аудит-журнала (таблица с фильтрами)
- [ ] Страница настроек (профиль, уведомления)
- [ ] Real-time уведомления (SSE/WebSocket)
- [ ] Страница детали датасета (превью таблицы)
- [ ] Страница детали проекта (Kanban-доска)
- [ ] Страница результатов ИИ-анализа
- [ ] Адаптивность (планшет)
- [ ] Code splitting (lazy imports)
- [ ] Обработка ошибок API (глобальный error handler)

### ⚙️ DevOps / Инфраструктура

- [ ] `Dockerfile` для каждого микросервиса
- [ ] `docker-compose.override.yml` для запуска сервисов
- [ ] Helm-чарты для Kubernetes
- [ ] GitLab CI/CD пайплайн (build → test → deploy)
- [ ] Prometheus + Grafana дашборды
- [ ] ELK Stack конфигурация
- [ ] Nginx конфигурация (reverse proxy, TLS)
- [ ] Скрипт инициализации Vault (секреты для всех сервисов)
- [ ] Скрипт инициализации Keycloak (realm, roles, clients)

### 🧪 Тестирование

- [ ] Unit-тесты бизнес-логики (цель: ≥70% покрытие)
- [ ] Интеграционные тесты с Testcontainers
- [ ] E2E тесты (Playwright)
- [ ] Нагрузочное тестирование (k6)
- [ ] Пентест и аудит безопасности

---

## 🏗️ Архитектура

```
                        ┌─────────────────┐
                        │   React SPA     │
                        │  (Vite + AntD)  │
                        └────────┬────────┘
                                 │ HTTP / SSE
                        ┌────────▼────────┐
                        │   API Gateway   │  :8080
                        │ Spring Cloud GW │
                        └─┬──┬──┬──┬──┬──┘
            ┌─────────────┘  │  │  │  │  └──────────────┐
     ┌──────▼──────┐  ┌──────▼─┐ │ ┌▼──────┐  ┌────────▼──────┐
     │Auth Service │  │Dataset │ │ │AI GW  │  │Integration Svc│
     │    :8081    │  │ :8082  │ │ │ :8083 │  │     :8084     │
     └─────────────┘  └────────┘ │ └───────┘  └───────────────┘
                                 │
                    ┌────────────┼────────────┐
              ┌─────▼────┐ ┌────▼──────┐ ┌───▼──────┐
              │ Projects │ │Notificati.│ │  Audit   │
              │  :8085   │ │  :8086    │ │  :8087   │
              └──────────┘ └───────────┘ └──────────┘
                                 │
              ┌──────────────────┼──────────────────┐
        ┌─────▼─────┐   ┌────────▼──┐   ┌──────────▼─┐
        │PostgreSQL │   │  Kafka    │   │   Redis    │
        │    16     │   │    3.7    │   │     7      │
        └───────────┘   └───────────┘   └────────────┘
              ┌──────────────┬──────────────┐
        ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐
        │  MinIO    │  │  Elastic  │  │  Keycloak │
        │  (S3)     │  │  search   │  │    24     │
        └───────────┘  └───────────┘  └───────────┘
```

---

## 📦 Стек технологий

| Слой | Технология |
|------|-----------|
| Backend | Java 21, Spring Boot 3.3.4, Spring Cloud 2023.0.3 |
| Frontend | React 18, TypeScript 5, Vite 5, Ant Design 5 |
| База данных | PostgreSQL 16, Redis 7, Elasticsearch 8 |
| Хранилище | MinIO (S3-совместимое) |
| Очередь | Apache Kafka 3.7 (KRaft) |
| IAM | Keycloak 24, OAuth2, JWT |
| Секреты | HashiCorp Vault 1.17 |
| ИИ/ML | ONNX Runtime, NVIDIA Triton, Hugging Face |
| Интеграции | HAPI FHIR R4, dcm4che (DICOM) |
| Инфраструктура | Docker, Kubernetes, Helm |
| Мониторинг | Prometheus, Grafana, ELK Stack |
| Тестирование | JUnit 5, Testcontainers, Playwright, k6 |

---

<div align="center">
  <sub>КФУ Медхаб · Медицинская санчасть Казанского федерального университета · 2026</sub>
</div>
