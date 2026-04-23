FROM php:8.4-fpm-bookworm

ARG UPLOAD_LIMIT=64

# ۱. تنظیم میرورهای ایران و غیرفعال کردن چک تاریخ انقضا
RUN sed -i 's/deb.debian.org/mirror.arvancloud.ir/g' /etc/apt/sources.list.d/debian.sources \
    && sed -i 's/security.debian.org/mirror.arvancloud.ir\/debian-security/g' /etc/apt/sources.list.d/debian.sources \
    && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99ignore \
    && echo 'Acquire::AllowInsecureRepositories "true";' >> /etc/apt/apt.conf.d/99ignore

# ۲. حل تضاد نسخه libssl3 و نصب ابزارهای پایه
RUN apt-get update && apt-get install -y --allow-downgrades --no-install-recommends \
    libssl3=3.0.18-1~deb12u2 \
    libssl-dev=3.0.18-1~deb12u2 \
    libzip-dev \
    unzip \
    git \
    curl \
    default-mysql-client \
    libonig-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    netcat-openbsd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ۳. نصب اکستنشن‌های PHP
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# نکته: Reverb برای کارکرد به اکستنشن sockets نیاز مبرم دارد
RUN install-php-extensions pdo_mysql exif pcntl bcmath gd zip sockets

# ۴. نصب Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY ./crazyAPI/ /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1

# تنظیم میرور ایران برای Composer جهت سرعت بالا در نصب Reverb
RUN rm -f composer.lock \
    && composer config --global repo.packagist composer https://mirror-composer.runflare.com 

RUN chown -R www-data:www-data /var/www/html

# ۵. تنظیمات بهینه‌سازی PHP
RUN echo "pcre.jit=0" > /usr/local/etc/php/conf.d/disable-pcre-jit.ini \
    && echo "upload_max_filesize = ${UPLOAD_LIMIT}M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = ${UPLOAD_LIMIT}M" >> /usr/local/etc/php/conf.d/uploads.ini

# ۶. آماده‌سازی فایل Entrypoint
COPY ./crazyDocker/api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# باز کردن پورت Reverb (پورت پیش‌فرض ۸۰۸۰ است)
EXPOSE 8000 8080

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["php-fpm"]
