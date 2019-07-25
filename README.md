# Alexa Integration

##	About
The goal of this project is to provide Alexa services to NEC's STD-SIP and NEC-SIP phones. Alongside using alexa services like weather and cricket scores user can also make calls via his/her desk phone through voice commands.

##	How to setup
**Operating system** : Ubuntu (14.0.6 or above)

###	Install the following
1.	Install GIT
```
$ sudo apt-get install -y git
```
2. PHP
	- 7.2.16 or above
```
$ sudo apt-add-repository ppa:ondrej/php -y
$ sudo apt-get update -y
$ sudo apt-get install -y php7.2
$ sudo apt-get install -y php7.2-cgi
$ sudo apt-get install -y php7.2-cli
$ sudo apt-get install -y php7.2-curl
$ sudo apt-get install -y php7.2-dev
$ sudo apt-get install -y php7.2-json
```
----------------
3.	MongoDB
	- 4.0.9 or above


**To install MongoDB follow the following commands :**
```
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
$ echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```
**Launch MongoDB as a service on Ubuntu :**
Create a configuration file named mongodb.service in /etc/systemd/system to manage the MongoDB service.
```
$ sudo vim /etc/systemd/system/mongodb.service
```
Copy the following contents in the file.
```
#Unit contains the dependencies to be satisfied before the service is started.
[Unit]
Description=MongoDB Database
After=network.target
Documentation=https://docs.[mongodb.org/manual](http://mongodb.org/manual) # Service tells systemd, how the service should be started.
# Key `User` specifies that the server will run under the mongodb user and
# `ExecStart` defines the startup command for MongoDB server.
[Service]
User=mongodb
Group=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf
# Install tells systemd when the service should be automatically started.
# `multi-user.target` means the server will be automatically started during boot.
[Install]
WantedBy=multi-user.target
```
Update the systemd service with the command stated below:
```
$ systemctl daemon-reload
```
Start the service with systemcl.
```
$ sudo systemctl start mongodb
```
Check if mongodb has been started on port 27017 with netstat command:
```
$ netstat -plntu
```
Check if the service has started properly.
```
$ sudo systemctl status mongodb
```
The output to the above command will show `active (running)` status with the PID and Memory/CPU it is consuming.

Enable auto start MongoDB when system starts.
```
$ sudo systemctl enable mongodb
```
Stop MongoDB
```
$ sudo systemctl stop mongodb
```
Restart MongoDB
```
$ sudo systemctl restart mongodb
```
Install mongodb php extension.
```
$ pecl install mongodb
```
Enable the extension.
```
$ echo "extension=mongodb.so" >> `php --ini | grep "Loaded Configuration" | sed -e "s|.*:\s*||"`
```
----------------
4.	SOX
```
$ sudo apt-get install -y sox
```
----------------
5.	MPG123
```
$ sudo apt-get install -y mpg123
```
----------------
6.	cURL

**Build `nghttp2` from source**

Install build tools.
```
$ sudo apt-get install -y g++ make binutils autoconf automake autotools-dev libtool pkg-config zlib1g-dev libcunit1-dev libssl-dev libxml2-dev libev-dev libevent-dev libjansson-dev libjemalloc-dev cython python3-dev python-setuptools
```
Clone the git repository of `nghttp2` source
```
git clone https://github.com/tatsuhiro-t/nghttp2.git
```
Navigate to the directory
```
cd nghttp2
```
Run following commands
```
$ autoreconf -i
$ automake
$ autoconf
$ ./configure
$ make
$ sudo make install
```
**Install `cURL` with `nghttp2`**
```
$ cd ~
$ sudo apt-get build-dep curl -y
$ wget http://curl.haxx.se/download/curl-7.61.0.tar.bz2
$ tar -xvjf curl-7.61.0.tar.bz2
$ cd curl-7.61.0
$ ./configure --with-nghttp2=/usr/local --with-ssl
$ make
$ make install
$ ldconfig
```
----------------
7.	NVM
```
$ curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
$ bash install_nvm.sh
$ source ~/.profile
```
----------------
8.	NPM
```
$ sudo apt-get install npm
```
----------------
9.	NodeJs
```
$ nvm install node
```	
----------------
10.	Asterisk
```
$ sudo apt-get install -y asterisk
```
----------------
11.	Julius
----------------
12.	Perl
```
$ sudo apt-get install perl
```
----------------
### Check out the code
Run the following command to checkout the code source
```
$ git clone https://github.com/ayushpratap/alexa_inegration.git
```
### Setup AGI
Go to the repo directory
```
$ cd alexa_inegration/agi
```
Following files should be present
```
	agi
	├─ Sounds
	│  ├─ alexa_another.sln     //  Alexa audio
	│  ├─ alexa_example.sln     //  Alexa audio 
	│  └─ alexa_hello.sln       //  Alexa audio 
	├─ grant_token.sh           //  Get the refresh token
	├─ necti.php                //  Main AGI script
	├─ phpagi-asmanager.php     //  Part of PHPAGI library
	├─ phpagi-fastagi.php       //  Part of PHPAGI library
	├─ phpagi.php               //  Part of PHPAGI library
	└─ token.pl                 //  Get the access token
```
Copy the sound files
```
$ sudo cp Sounds/alexa*.sln /usr/share/asterisk/sounds/custom/
$ sudo chown asterisk:asterisk /usr/share/asterisk/agi-bin/necti.php
$ sudo chown asterisk:asterisk /usr/share/asterisk/sounds/custom/alexa*.sln
```
Copy `grant_token.sh` and `token.pl` in home directory of your machine
```
$ sudo cp grant_token.sh /home/{YOUR MACHINE NAME}/grant_token.sh
$ sudo cp token.pl /home/{YOUR MACHINE NAME}/token.pl
```
Copy  `necti.php` , `phpagi-asmanager.php` , `phpagi-fastagi.php` , `phpagi.php` to `/usr/share/asterisk/agi-bin/`
```
$ sudo cp necti.php /usr/share/asterisk/agi-bin/necti.php
$ sudo cp phpagi-asmanager.php /usr/share/asterisk/agi-bin/phpagi-asmanager.php
$ sudo cp phpagi-fastagi.php /usr/share/asterisk/agi-bin/phpagi-fastagi.php
$ sudo cp phpagi /usr/share/asterisk/agi-bin/phpagi.php
```
Edit the `/etc/asterisk/extensions.conf` file and apend the the following code in that file.

>; AMAZON ALEXA VOICE
[alexa_tts]
exten => 5555,1,Answer()
; Get an AWS Token
exten => 5555,n,System(/home/{YOUR MACHINE NAME}/token.pl)
; Play prompts
exten => 5555,n,Playback(./custom/alexa_hello)
exten => 5555,n,Playback(./custom/alexa_example)
; Alexa API integration
exten => 5555,n(record),agi(alexa.agi,en-us)
; Loop
exten => 5555,n,Playback(./custom/alexa_another)
exten => 5555,n,goto(record)

Add the following line to extensions.conf so that the extension is dial-able locally.
-	Edit /etc/asterisk/extensions.conf
-	Locate the section called [local]
-	Add a line “include => alexa_tts”

Edit the `/etc/asterisk/sip.conf` file and apend the the following code in that file.
>[5555]
type=friend
username=5555
fromuser=5555
host=dynamic
context=local
insecure=port
qualify=500
dtmfmode=rfc2833
disallow=all
allow=ulaw
obtained
progressinband=no
nat=no
mailbox=5555
callerid=5555

**Reboot the machine**

### Register the product with AVS

#### 1.	Create an Amazon developer account
Unless you already have one, go ahead and create a free developer account at [developer.amazon.com](https://developer.amazon.com/login.html).

#### 2.	Register your prototype and create a security profile
After you've created an Amazon developer account, you'll need to create a product and security profile. This will enable your software client to connect to AVS.

Log in to  [developer.amazon.com](https://developer.amazon.com/login.html). You should be in the Dashboard by default - click the  **ALEXA VOICE SERVICE**button in the global navigation to start building products with Alexa built-in.

If your screen doesn't look like this, try the direct link to  [AVS dashboard](https://developer.amazon.com/avs/home.html#/avs/home).

`// Add the image : 1-devportal-alexa-fixed._TTH_.png`

If this is your first time using AVS, you'll see a welcome screen. Click the  **GET STARTED**  button, then click the  **CREATE PRODUCT**  button.

If you're a returning developer, click the blue  **CREATE PRODUCT**  button at the top right corner of the screen.

#### 3.	Register your prototype and create a security profile
1.  _Product Name_: Use  **AVS Tutorials Project**.
2.  _Product ID_: Use  **PrototypePi.**  No spaces are allowed for the  _Product ID_  field.
3.  Select  **Device with Alexa built-in**  for  _Please Select Your Product Type_. Select  **No**  for  _Will your device use a companion app?_
4.  Choose  **Other**  for  _Product Category_  and write  **Prototype**  in the  _(please specify)_  and  _Brief product description_  field.
5.  Select  **Hands-free**  for  _How will users interact with your product?_
6.  Skip the  _Upload an image_  step. This is not required for prototyping.
7.  Select  **No**  for  _Do you intend to distribute this product commercially?_
8.  Select  **No**  for  _Will your device be used for Alexa for Business?_
9.  Select  **No**  for  _Is this a children’s product or is it otherwise directed to children younger than 13 years old?_
10.  Click  **NEXT**  to continue.

#### 4. Set up your security profile
1.  Click  **CREATE NEW PROFILE**.
    
2.  Enter your own custom  **Security Profile Name**  and  **Security Profile Description**  for the following fields - or use the below example names:
    
    -   _Security Profile Name_:  **AVS Tutorials Project**
    -   _Security Profile Description_:  **AVS Tutorials**
    -   Click  **NEXT**.
    
    **Security Profile ID**  will be generated for you.
    
3.  Select  **Other devices and platforms**  from the  _Web - Android/Kindle - iOS - Other devices and platforms_options in the  **Platform Information**  section.
`// Add image : 1-otherdevicesplatforms-fixed._TTH_.png
`
	-	Write a name for your Client ID here - you can just use  **Prototype**.
	-	Click "Generate ID". You should get a Client ID and an option to download it.
`//	Add image : 1-otherdevicesplatforms2._TTH_.png`
-   Check the box beside  _I agree to the AVS agreement and the AVS Program Requirements._
    -   Click  **FINISH**.

Click OK on the prompt to continue. Your device should now be listed on your  [AVS dashboard](https://developer.amazon.com/avs/home.html#/avs/homes).

#### 5. Enable your security profile for commercial distribution
1.	Open a web browser, and visit [https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html).
`//	Add image : avs-lwa-new-security-profile._TTH_.png`

2. Near the top of the page, select the commercial device security profile you created earlier from the drop-down menu and click the **CONFIRM** button.
`// Add image : avs-lwa-choose-security-profile._TTH_.png`

3.	Enter your privacy policy URL beginning with http:// or https://.
4.	You may upload an image. The image will be shown on the Login with Amazon consent page to give your users context.
5.	Click the **SAVE** button.
`//	Add image : avs-privacy-url_v2._TTH_.png`
#### 6. Setup authentication
1. Copy the URL below to a notepad removing any newlines and EDIT to insert YOURCLIENTID and YOURPRODUCTID (NOT Client Secret) and Paste to your browser.
```
https://www.amazon.com/ap/oa/client_id=YOURCLIENTID&scope=alexa%3Aall&scope_data=%7B%22alexa%3Aall%22%3A%7B%22productID%22%3A%22YOURPRODUCTID%22,%22productInstanceAttributes%22%3A%7B%22deviceSerialNumber%22%3A%2212345%22%7D%7D%7D&response_type=code&redirect_uri=https%3A%2F%2Flocalhost
```
You will need to sign in again with your email/password, and click OK.

2. You will receive a **browser error message**, but the Address URL should show a **provisioning token:**
```
https://localhost/?code=YOURTOKEN&scope=alexa%3Aall
```
Do NOT click anything more. Just copy & paste the URL to your notepad or text file.

3.	In your source code , edit the file **grant_token.sh** and update the fields and run it's cURL commands:
```
$ sudo vim grant_token.sh
```
Run the script
```
$ sudo ./grant_token.sh
```
**YOURTOKEN** - Example: ANLdMXNCfOnqxCa…
**YOURCLIENTID** – Example: amzn1.application-oa2-client.0b1342a03a674c…
**YOURCLIENTSECRET** – Example: 34c812a9c0601d18f14a7f7b035e6416918d…

You should receive back a big JSON message with an ACCESS TOKEN and a REFRESH_TOKEN.

4. Your access_token will be used by Asterisk every time it makes a call to Amazon API. But this
token expires every hour, so Asterisk will be calling a program called `token.pl` each time you dial the Alexa extension number. Your refresh_token never expires, but is only good for retrieving a new Access Token. It is used by `token.pl` to retrieve a new Access Token.

5. Cut & Paste them into your notepad or text file and save the file for future reference.

> Example:
{ 
"access_token":"Atza|IQEBLzAtAhRqd3LSY6n_A_VERY_LONG_STRING…",
"refresh_token":"Atzr|IQEBLjAsAhQgCKZ5Ind88BUAgdO9k7_ANOTHER_VERY_LONG_STRING",
"token_type":"bearer","expires_in":3600
}

6. Edit the `token.pl` perl program inserting your Refresh Token and Client Secret. Then copy the
`token.pl` to /home/{YOUR MACHINE NAME}/token.pl

Edit the script
```
$ sudo vim token.pl
```
> #Send POST Request
my $post = "grant_type=refresh_token&refresh_token=
YOUR_VERY_LONG_REFRESH_TOKEN&client_id=YOURCLIENTID&client_secret=YOURCLIENTSECRET" ;

Copy the script to above mentioned path
```
$ cp toke.pl /home/{YOUR MACHINE NAME}/
```
**_Since the Refresh Token and Client Secret never expire, you only have to do all of these steps once._**
**Note :** If you get errors, you can start again at Step 1

7.	Run the `token.pl` This will query Amazon OAuth2 and return a JSON which is parsed into the /tmp directory.
```
$ perl /home/{YOUR MACHINE NAME}/token.pl
```
Just to make sure that it is working 
```
$ sudo cat /tmp/token.resp
```
>Example of a good token.resp (truncated for security)
{"access_token":"Atza|IwEBILhKrSN8kfzozbImVfr6AAySL_kzVfEvamrA772hjH_Zvx-
0IIIgjXNRK4tXvT6tkaLJ6kSh_F9UbDK3bU-iEfXxOA68jhGEhC3Vaw96pDrOvcuv29rL5Hxhte5-
zWkzf-sL5il5PtuezNKWuPCvjpFCdB5Tm1a6HaiebPk9cDWosHZkFLYVhvK5…
","refresh_token":"Atzr|IwEBIM617be3fOqudYsrfi9KXimW6432DWIgCptdgGqFvnUOuXgN4cJ4l8uvzaQM4Ozoh-
XNf1wgcgprrG4cr0P2mmfrNBgICaUHtc0lt8Ra4Y31QsuElMhIrQWbzz3e0hWcI3xGprwhBEB6Yx6J
43sAZnFUwrBo0QZ_iDJSWd7c3JqK5LtbzgDeczYn2M3pcbAyNJG8r3bj8zG0Q2v9k_BwGKXCDAe6T
ITse0YP_N89KCrmGP4WZPFGGrqAuOA8DAJSoKMGneqDLIX0wBc5R08xLNNnyYbGOQ…
","token_type":"bearer","expires_in":3600}

If you see an error, turn on debug mode (below) in the `token.pl` and rerun the command. Be sure to VERIFY that you have cut&pasted the FULL refresh token, client ID and client Secret. Obviously, if these are wrong, Amazon API will return Authentication errors. Watch out for improper carriage returns in the tokens (there are none!) due to word wraps or cut/paste errors. Also use the correct tokens in the proper places. 99% of the problems will be related to the tokens.
> #Send Post Request
> my $debug = 1;

8.	Delete the /tmp/token.* files after you have it working so that Asterisk can write new files.
```
$ sudo rm /tmp/token.*
```
You are now ready to try out your Asterisk Alexa interface.

9.	Reboot the system


###	Setup the client service
Go to the directory 
```
$ cd alexa_inegration/client\ service/
```
Install the node modules
```
$ npm install
```
Start the client service 
```
$ node server.js
```
HTTP server will be started at port `https://localhost:8443`
###	Setup tcp-http-client
Go to directory
```
 cd alexa_inegration/tcp_http\ client/
```
Install the node modules
```
$ npm install
```
Start the tcp-http client
```
$ node client.js
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTMyNTgzMTA5Nl19
-->