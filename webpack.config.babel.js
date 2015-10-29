import path from 'path';
import webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer-core';
import './scripts/load-env';

const IS_DEBUG = !!process.env.CY_DEBUG;
const IS_DEV_SERVER = process.argv[1].endsWith('webpack-dev-server');

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
    // Main static file.
    new HtmlWebPackPlugin({
        excludeChunks: ['test-bundle'],
        inject: false,
        template: 'src/index.html',
        // Relative to `output.publicPath`.
        filename: '../index.html',
        // Extra options.
        title: 'DevStack - Home',
        isDevServer: IS_DEV_SERVER,
    }),
    // Test suite static file.
    new HtmlWebPackPlugin({
        excludeChunks: ['bundle'],
        inject: false,
        template: 'src/index.html',
        filename: '../test.html',
        // Extra options.
        title: 'DevStack - Spec Runner',
        isDevServer: IS_DEV_SERVER,
    }),
    new ExtractTextPlugin('[name]-[contenthash:7].css', {
        allChunks: true,
    }),
];

if (!IS_DEBUG) {
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        // UglifyJs produces nonsense warnings by default.
        compress: { warnings: false },
    }));
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

export default {
    context: __dirname,
    entry: {
        bundle: 'boot.js',
        'test-bundle': 'mocha!./test/boot.js',
    },
    devtool: IS_DEBUG ? '#eval' : null,
    debug: IS_DEBUG,
    output: {
        filename: '[name]-[hash:7].js',
        chunkFilename: '[name]-[id]-[chunkhash:7].js',
        path: path.join(__dirname, 'dist/static'),
        publicPath: 'static/',
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
                    prependFilenameComment: IS_DEBUG ? __dirname : null,
                    // Images prepended with '/' are relative to given path.
                    root: path.join(__dirname, 'src'),
                    parseMacros: false,
                },
            }, {
                test: /\.scss$/,
                // First compile with Sass and then Postcss.
                loader: ExtractTextPlugin.extract(
                    'css?sourceMap!' +
                    'postcss!' +
                    'sass?sourceMap&outputStyle=compressed',
                    // Paths in CSS are relative to dist/static/ instead of dist/
                    { publicPath: '' }
                ),
            }, {
                // Extract all non-CSS and non-JS assets.
                test: /\.(gif|png|jpe?g|svg|ico|woff|ttf)$/i,
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
            autoprefixer({ browsers: ['last 1 versions'] }),
        ];
    },
};
