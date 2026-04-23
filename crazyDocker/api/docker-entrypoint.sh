#!/bin/sh
set -e

# ۱. آماده‌سازی فایل .env (بدون حذف هر باره، فقط آپدیت کن)
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        touch .env
    fi
fi

update_env() {
    key=$1
    value=$2
    if grep -q "^${key}=" .env; then
        sed -i "s|^${key}=.*|${key}=${value}|" .env
    else
        echo "${key}=${value}" >> .env
    fi
}

[ -n "$DB_HOST" ]      && update_env "DB_HOST" "$DB_HOST"
[ -n "$DB_DATABASE" ]  && update_env "DB_DATABASE" "$DB_DATABASE"
[ -n "$DB_USERNAME" ]  && update_env "DB_USERNAME" "$DB_USERNAME"
[ -n "$DB_PASSWORD" ]  && update_env "DB_PASSWORD" "$DB_PASSWORD"
[ -n "$APP_ENV" ]      && update_env "APP_ENV" "$APP_ENV"
[ -n "$REDIS_PASSWORD" ] && update_env "REDIS_PASSWORD" "$REDIS_PASSWORD"
[ -n "$REDIS_HOST" ]     && update_env "REDIS_HOST" "$REDIS_HOST"



# ۳. حل مشکل Pail و نصب پکیج‌ها
# اگر در محیط لوکال هستی، پیشنهاد می‌دهم --no-dev را برداری تا ide-helper و pail نصب شوند
composer install --no-interaction --prefer-dist

# ۴. کارهای سیستمی لاراول
php artisan key:generate --force
php artisan storage:link || true
php artisan migrate --force

# ۵. بهینه‌سازی (فقط در پروداکشن پیشنهاد می‌شود، در لوکال فعلاً clear کن)
php artisan optimize:clear

# ۶. تولید IDE Helper (چون درخواست داده بودی)
php artisan ide-helper:generate || true
php artisan ide-helper:models --write || true

# ۷. تصحیح دسترسی‌ها
chown -R www-data:www-data storage bootstrap/cache

echo "CrazyRED is ready to launch!"

exec "$@"