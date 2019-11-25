/*
Flightplan
https://github.com/pstadler/flightplan#installation--usage

You run the Deploy command with:
- fly (if you installed Flightplan Globally)
- node_modules/.bin/fly (You already have it after run npm install)


Setup: execute only once on the environment.
fly setup:<environment>, example: node_modules/.bin/fly setup:staging_keetup

Deploy:
fly deploy:<environment>, example: node_modules/.bin/fly deploy:staging_keetup

Rollback:
fly rollback:<environment>, example: node_modules/.bin/fly rollback:staging_keetup
*/

var plan = require('flightplan');

// Remote configurations for "production multeo"
plan.target('production', {
    host: '162.209.35.84',
    username: 'insoftelloadsapp',
    sudoUser: 'insoftelloadsapp',
    privateKey: '/Users/andres/.ssh/id_rsa',
    //password: '', //If ssh connection didn't work, uncomment this line and add the password, but PLEASE don't commit the password to git.
    agent: process.env.SSH_AUTH_SOCK,
    webRoot: '/var/www/vhosts/894745-web1.insoftel.us/Loadsapp.us',
    ownerUser: 'www-data',
    ownerGroup: 'www-data',
    repository: 'git@bitbucket.org:aburgosguzman/loads-app-web.git',
    branchName: 'develop',
    maxDeploys: 10,
    enviroment: 'prod'
});

/**
 * Creates all the necessary folders in the remote and clones the source git repository
 *
 * Usage:
 * > fly setup[:remote]
 */
plan.remote('setup', function (remote)
{
    var sudoUser = remote.runtime.sudoUser;

    remote.exec('mkdir -p ' + remote.runtime.webRoot);
    remote.with('cd ' + remote.runtime.webRoot, function ()
    {
        remote.exec('mkdir -p versions');
        remote.exec('git clone -b ' + remote.runtime.branchName + ' ' + remote.runtime.repository + ' WebApp');
    });
});

/**
 * Deploys a new version of the code pulling it from the git repository
 *
 * Usage:
 * > fly deploy[:target]
 */
plan.remote('deploy', function (remote)
{
    remote.with('cd ' + remote.runtime.webRoot, function ()
    {

        //  Execute some tasks
        remote.with('cd WebApp', function ()
        {

            //  Clear current changes, fetch, checkout a Branch, and Pull new changes.
            remote.exec('git checkout . && git fetch && git checkout ' + remote.runtime.branchName + ' && git pull');

            //  Npm install
            remote.exec('npm install');

            //  Bower install
            remote.exec('bower install --allow-root');

            //  Generate WWW
            /*remote.exec('gulp build --env='+remote.runtime.enviroment+' --force-build --no-open --minify');

            //  Copy font awesome
            //remote.exec('cp -a app/bower_components/font-awesome/fonts www/fonts');

            //  Copy bootstrap
            //remote.exec('mkdir -p www/bower_components');
            //remote.exec('mkdir -p www/bower_components/bootstrap-sass');
            //remote.exec('mkdir -p www/bower_components/bootstrap-sass/assets');
            //remote.exec('mkdir -p www/bower_components/bootstrap-sass/assets/fonts');
            //remote.exec('mkdir -p www/bower_components/bootstrap-sass/assets/fonts/bootstrap');
            //remote.exec('cp -a app/bower_components/bootstrap-sass/assets/fonts/bootstrap/* www/bower_components/bootstrap-sass/assets/fonts/bootstrap');

            // Copy ng-table
            //remote.exec('mkdir -p www/bower_components');
            //remote.exec('mkdir -p www/bower_components/ng-table');
            //remote.exec('mkdir -p www/bower_components/ng-table/dist');
            //remote.exec('cp -a app/bower_components/ng-table/dist/* www/bower_components/ng-table/dist');

            // Copy datatables
            remote.exec('mkdir -p www/bower_components');
            remote.exec('mkdir -p www/bower_components/datatables');
            remote.exec('mkdir -p www/bower_components/datatables/media');
            remote.exec('cp -a app/bower_components/datatables/media/* www/bower_components/datatables/media');

            // Copy plugins
            remote.exec('mkdir -p www/bower_components');
            remote.exec('mkdir -p www/bower_components/plugins');
            remote.exec('mkdir -p www/bower_components/plugins/integration');
            remote.exec('mkdir -p www/bower_components/plugins/integration/bootstrap');
            remote.exec('cp -a app/bower_components/plugins/integration/bootstrap/* www/bower_components/plugins/integration/bootstrap');

            // Copy datatables
            remote.exec('mkdir -p www/bower_components');
            remote.exec('mkdir -p www/bower_components/screenfull');
            remote.exec('mkdir -p www/bower_components/screenfull/dist');
            remote.exec('cp -a app/bower_components/screenfull/dist/* www/bower_components/screenfull/dist');

            // Copy moment
            remote.exec('mkdir -p www/bower_components');
            remote.exec('mkdir -p www/bower_components/moment');
            remote.exec('mkdir -p www/bower_components/moment/locale');
            remote.exec('cp -a app/bower_components/moment/locale/* www/bower_components/moment/locale');

            // Copy fancybox plus
            remote.exec('mkdir -p www/images');
            remote.exec('mkdir -p www/images/fbplus');
            remote.exec('cp -a app/bower_components/fancybox-plus/images/fbplus/* www/images/fbplus');*/

        });

        /*var command = remote.exec('date +%s.%N');
        var versionId = command.stdout.trim();
        var versionFolder = 'versions/' + versionId;

        remote.exec('cp -R repo ' + versionFolder);
        remote.exec('chown -R ' + remote.runtime.ownerUser + ':' + remote.runtime.ownerGroup + ' ' + versionFolder);
        remote.exec('ln -fsn ' + versionFolder + ' current');
        remote.exec('chown -R ' + remote.runtime.ownerUser + ':' + remote.runtime.ownerGroup + ' current');

        if (remote.runtime.maxDeploys > 0) {
            remote.log('Cleaning up old deploys...');
            remote.exec('rm -rf `ls -1dt versions/* | tail -n +' + (remote.runtime.maxDeploys + 1) + '`');
        }

        remote.log('Web Successfully deployed in ' + versionFolder);
        remote.log('To rollback to the previous version run "fly rollback:' + plan.runtime.target + '"');*/
    });
});

/**
 * Rollbacks to the previous deployed version (if any)
 *
 * Usage
 * > fly rollback[:target]
 */
plan.remote('rollback', function (remote)
{

    remote.with('cd ' + remote.runtime.webRoot, function ()
    {
        var command = remote.exec('ls -1dt versions/* | head -n 2');
        var versions = command.stdout.trim().split('\n');

        if (versions.length < 2) {
            return remote.log('No version to rollback to');
        }

        var lastVersion = versions[0];
        var previousVersion = versions[1];

        remote.log('Web Rolling back from ' + lastVersion + ' to ' + previousVersion);

        remote.exec('ln -fsn ' + previousVersion + ' current');
        remote.exec('chown -R ' + remote.runtime.ownerUser + ':' + remote.runtime.ownerGroup + ' current');

        remote.exec('rm -rf ' + lastVersion);
    });
});


