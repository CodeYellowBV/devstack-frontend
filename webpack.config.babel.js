import path from 'path';
import webpack from 'webpack';
import _ from 'lodash';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer-core';
import './scripts/load-env';
import pkg from './package.json';

const IS_DEVELOPMENT = process.env.CY_ENVIRONMENT === 'development';

let devtool = '#source-map';
let debug = false;

// Plugins that are used for all environments.
const plugins = [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        _: 'underscore',
        moment: 'moment',
        vent: 'vent',
        Marionette: 'backbone.marionette',
        Backbone: 'backbone',
    }),
    // Prevent including all locales of moment.
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new webpack.DefinePlugin({
        CY_CONFIG: JSON.stringify({
            domain: _.trimLeft(process.env.CY_SESSION_DOMAIN, '.'),
            environment: process.env.CY_ENVIRONMENT,
            is_demo: !!process.env.CY_DEMO,
            version: pkg.version,
            node: {
                base_url: process.env.CY_NODE_CLIENT_BASE_URL,
                socketOptions: {
                    path: process.env.CY_NODE_CLIENT_SOCKET_PATH,
                },
            },
        }),
    }),
    // Main static file.
    new HtmlWebPackPlugin({
        excludeChunks: ['test-bundle'],
        inject: false,
        template: 'src/index.html',
        filename: 'index.html',
        // Extra options.
        title: 'DevStack - Home',
        isDevelopment: IS_DEVELOPMENT,
    }),
    // Test suite static file.
    new HtmlWebPackPlugin({
        excludeChunks: ['bundle'],
        inject: false,
        template: 'src/index.html',
        filename: 'test.html',
        isDevelopment: IS_DEVELOPMENT,
        // Extra options.
        title: 'DevStack - Spec Runner',
    }),
    new ExtractTextPlugin('[name]-[contenthash].css', {
        allChunks: true,
    }),
];

if (IS_DEVELOPMENT) {
    devtool = '#eval';
    debug = true;
}

if (!IS_DEVELOPMENT) {
    // Optimize for non-development environments.
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        // UglifyJs produces nonsense warnings by default.
        compress: {warnings: false},
    }));
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

export default {
    context: __dirname,
    entry: {
        bundle: 'boot.js',
        'test-bundle': 'mocha!./test/boot.js',
    },
    devtool,
    debug,
    output: {
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[id]-[chunkhash].js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel?stage=0',
            }, {
                // Precompile html templates with lodash.
                test: /\.html$/,
                loader: 'underscore-template',
                query: {
                    // html attributes that should be parsed as module.
                    attributes: ['img:src', 'link:href'],
                    prependFilenameComment: IS_DEVELOPMENT ? __dirname : null,
                    // images prepended with '/' are relative to given path.
                    root: path.join(__dirname, 'src'),
                },
            }, {
                test: /\.scss$/,
                // First compile with Sass and then Postcss.
                loader: ExtractTextPlugin.extract(
                    'css?sourceMap!' +
                    'postcss!' +
                    'sass?sourceMap&outputStyle=compressed'
                ),
            }, {
                // Extract all non-CSS and non-JS assets.
                test: /\.(gif|png|jpe?g|svg|woff|ttf)$/i,
                loader: 'file',
                query: {
                    name: '[name]-[hash:7].[ext]',
                },
            },
        ],
    },
    plugins,
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    resolve: {
        root: path.join(__dirname, 'src'),
        extensions: ['', '.js'],
        alias: {
            'jquery': require.resolve('jquery'),
            'marionette': 'backbone.marionette',
            'underscore': 'lodash',
            'crux': 'backbone-crux/src',
        },
    },
    postcss() {
        return [
            autoprefixer({browsers: ['last 1 versions']}),
        ];
    },
};
