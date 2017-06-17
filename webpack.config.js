var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './oos.js',
    target: 'node',
    output: { path: __dirname, filename: 'build/oos.bundle.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'es2016', 'es2017', 'stage-2']
                }
            }
        ]
    },
    node:{
        console: true
    }
};