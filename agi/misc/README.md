AWS lambda
Link -> https://aws.amazon.com\
username -> ayushs56@gmail.com
password -> i49uSxhK00sf
-----------------------
Go to LAMBDA
select "officeLabCutomSkillFunction"
Upload the ZIP
Save
---------------------------------------
---------------------------------------
For SKILL
Link -> https://developer.amazon.com/home.html
username -> ayushs56@gmail.com
passowrd -> Iamthe1whonox
----------------------------
Go to alexa skill kit
select "officeLab"
---------------------------------------
---------------------------------------
For AGI
place following files in /usr/share/asterisk/agi-bin
	- necti_alexa.php
	-	phpagi.php
	-	phpagi-fastagi.php
	-	phpagi-asmanager.php
	-	composer.json
run composer install (it will create composer.lock and a folder named vendor)

copy sip.conf from asterisk_alexa_agi to /etc/asterisk/
copy extension.conf from asterisk_alexa_agi to /etc/asterisk/
copy "token.pl" and "token_007.pl" and place them in "/home/alexa-vm/"
--------------------------------------
--------------------------------------
For client service
execute run.sh
-------------------------------------
-------------------------------------
{for debugging}
**If alexa is repeating thank you again and again
	-> go to asterisk_alexa_agi/demo and run "php flush.php"
**To sync data between pcpro and local db
	METHOD - 1
	-> kill the server.js
	-> execute run.sh
	METHOD - 2
	-> go to asterisk_alexa_agi/demo/ and run "php deleteAll.php"
	-> go to necti_client_service/simulation/pcpro/ and run "node SyncDataService.js"
**To set agi debugging
	-> sudo asterisk -r
	-> set agi debug on
	-> core debug set 4
-------------------------------------
-------------------------------------
Bitbucket cridentials
email -> ayushs56@gmail.com
password -> Iamthe1whonox




# USE "master" branch for both the repos
# Both the repos must exists in "/home/alexa-vm/Desktop/goliath/"