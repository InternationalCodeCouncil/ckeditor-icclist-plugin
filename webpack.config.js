var Encore = require('@symfony/webpack-encore');
var CopyWebpackPlugin = require('copy-webpack-plugin');

Encore
    // the project directory where all compiled assets will be stored
    .setOutputPath('dist/')

    // the public path used by the web server to access the previous directory
    .setPublicPath('/')

    // Source files.
    .addEntry('iccenterkey/plugin', './src/iccenterkey/plugin.js')
    .addEntry('iccindentlist/plugin', './src/iccindentlist/plugin.js')
    .addEntry('icclist/plugin', './src/icclist/plugin.js')
    .addEntry('icclistlabel/plugin', './src/icclistlabel/plugin.js')

    // Enable SASS.
    .enableSassLoader()
    .enableSourceMaps(!Encore.isProduction())
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()

    .addPlugin(new CopyWebpackPlugin([
        {
            from: './src/icclist',
            to:   'icclist',
            ignore: ['*.js']
        },
        {
            from: './src/icclistlabel',
            to:   'icclistlabel',
            ignore: ['*.js']
        }
    ]))
;

module.exports = Encore.getWebpackConfig();