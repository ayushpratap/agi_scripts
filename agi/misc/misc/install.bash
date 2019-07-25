#!/bin/bash
apt-get update -y
apt-get install -y systemd
apt-get install -y tmux
apt-get install -y vim
apt-get install -y wget
apt-get install -y htop
apt-get install -y git
apt-get install -y curl
apt-get install -y asterisk
apt-get install -y npm
apt-get install -y build-essential
apt-add-repository ppa:ondrej/php -y 	#php
apt-get install -y php7.2				#php
apt-get install -y php7.2-cgi			#php
apt-get install -y php7.2-cli			#php
apt-get install -y php7.2-curl			#php
apt-get install -y php7.2-dev			#php
apt-get install -y php7.2-json			#php
apt-get install -y sox					#sox
apt-get install -y npm					#npm
apt-get install -y mpg123

apt-get install -y g++ make binutils autoconf automake autotools-dev libtool pkg-config zlib1g-dev libcunit1-dev libssl-dev libxml2-dev libev-dev libevent-dev libjansson-dev libjemalloc-dev cython python3-dev python-setuptools
git clone https://github.com/tatsuhiro-t/nghttp2.git 	#http2
cd nghttp2 	#http2
autoreconf -i 
automake
autoconf
./configure
make
sudo make install
cd ~
apt-get build-dep curl -y
wget http://curl.haxx.se/download/curl-7.61.0.tar.bz2
tar -xvjf curl-7.61.0.tar.bz2
cd curl-7.61.0
./configure --with-nghttp2=/usr/local --with-ssl
make
make install
ldconfig
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
apt-get install -y mongodb-org
systemctl start mongod
systemctl enable mongod
pecl install mongodb
echo "extension=mongodb.so" >> `php --ini | grep "Loaded Configuration" | sed -e "s|.*:\s*||"`
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
nvm install node