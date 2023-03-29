#!/usr/bin/env bash

# prepare for an unattended installation
export DEBIAN_FRONTEND=noninteractive

apt-get update -y

apt-get upgrade -y

apt-get install -y build-essential htop screen git-core python-software-properties software-properties-common memcached zip

apt-get install -y nginx
rm /etc/nginx/sites-enabled/default

add-apt-repository ppa:ondrej/php
apt-get update

apt-get install -y php7.3-cli php7.3-common php7.3-fpm php7.3-mysql php7.3-curl php7.3-mbstring php7.3-xml php7.3-zip

apt-get install -y --allow-unauthenticated mariadb-server mariadb-client

if [ -f $VAGRANT_SYNCED_DIR/vagrant/.mysql-passes ]
  then
    rm -f $VAGRANT_SYNCED_DIR/vagrant/.mysql-passes
fi

echo "vagrant:vagrant" >> ${VAGRANT_SYNCED_DIR}/vagrant/.mysql-passes

mysql -uroot -e "CREATE USER 'vagrant'@'localhost' IDENTIFIED BY 'vagrant'"
mysql -uroot -e "GRANT ALL PRIVILEGES ON * . * TO 'vagrant'@'localhost' WITH GRANT OPTION;"
mysql -uroot -e "FLUSH PRIVILEGES;"
mysql -uroot -e "CREATE DATABASE vagrant DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;"

echo "Created vagrant database"

cp -r ${VAGRANT_SYNCED_DIR}/vagrant/_provision/nginx_conf/global /etc/nginx/
cp ${VAGRANT_SYNCED_DIR}/vagrant/_provision/nginx_conf/nginx_wp /etc/nginx/sites-available

ln -s /etc/nginx/sites-available/nginx_wp /etc/nginx/sites-enabled/nginx_wp

sed -i 's/^upload_max_filesize =.*/upload_max_filesize = 16M/' /etc/php/7.3/fpm/php.ini
sed -i 's/^post_max_size =.*/post_max_size = 16M/' /etc/php/7.3/fpm/php.ini

service php7.3-fpm restart
service nginx restart

cd ~
apt-get install php-zip
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === '48e3236262b34d30969dca3c37281b3b4bbe3221bda826ac6a9a62d6444cdb0dcd0615698a5cbe587c3f0fe57a54d8f5') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer

curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
mv wp-cli.phar /usr/local/bin/wp
sudo -u vagrant -i -- wp --info
sudo -u vagrant -i -- wp core download --path=/vagrant/_project/_public

echo "You need to run 'cd /vagrant/_project && composer install' after installation has completed"

echo "This project uses a .env file. Make sure you have created one before you start work."
