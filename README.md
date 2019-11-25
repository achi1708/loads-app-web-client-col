# loads-app-web-client-col
Colombian Loads WebApp

This project is built from angularjs scaffolding named Yeoman generator (gulp angular generator).

Below are the links with the documentation about this scaffolding:

1) Yeoman Gulp-Angular Generator documentation (https://github.com/Swiip/generator-gulp-angular/blob/master/docs/README.md)

2) User guide (https://github.com/Swiip/generator-gulp-angular/blob/master/docs/user-guide.md)

3) How it works (https://github.com/Swiip/generator-gulp-angular/blob/master/docs/how-it-works.md)

# Download project from repository #

To set project in your local server, after downloading files you have to run some commands:

* npm install
* bower install

# Main code #

Site is built through modules and these are in (/src/app) folder, you can find some folder with names about modules in the website

* Auth
* Carriers
* Drivers
* Fastpay
* Interesting points
* Loads
* Main (general modules like header, aside, etc)
* Profile
* Trucks

In the root of (/src/app) folder you can find SCSS files which are compiled when you generate the dist version, also you can find some javascript files where are some settings that are executed at start of app

# Generate dist version #

To do this, you need to know about gulp, you can generate the dist version from console; in the root of project there is a dist folder where are files that you have to upload at the server. To generate these you have to:

* Set console in root of project
* Write the command: "gulp serve:dist"
* Go to /dist folder
* Edit index.html file with your prefered Html editor
* At end of code from index.html, there are some scripts loaded, you have to change the location of crypto js script, please change to "assets/js/crypto-js/crypto-js.js"
* Save changes
* Upload all files from dist folder to server