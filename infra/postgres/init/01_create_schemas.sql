-- Отдельные схемы для каждого микросервиса
-- (все сервисы используют одну БД в dev, в prod — отдельные БД)

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS datasets;
CREATE SCHEMA IF NOT EXISTS ai_gateway;
CREATE SCHEMA IF NOT EXISTS projects;
CREATE SCHEMA IF NOT EXISTS notifications;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS integration;
