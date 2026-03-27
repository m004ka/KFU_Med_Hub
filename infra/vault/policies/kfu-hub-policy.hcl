# Политика для микросервисов KFU Hub
# Доступ на чтение секретов из пространства kfu-hub/*

path "secret/data/kfu-hub/*" {
  capabilities = ["read"]
}

path "secret/metadata/kfu-hub/*" {
  capabilities = ["list", "read"]
}

# Доступ к динамическим credentials PostgreSQL
path "database/creds/kfu-hub-*" {
  capabilities = ["read"]
}
