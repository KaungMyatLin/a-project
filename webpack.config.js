const path = require ('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
console.log(appDirectory);
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);
console.log(appDirectory);


module.exports = {
    mode: 'development',
    entry: {
        app: [resolveAppPath('src') + '/app.js', resolveAppPath('src') + '/payment Checkout.html'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'assets', 'scripts')
    },
    resolve: {
        // modules: [ 'node_modules' ],
        // fallback: {
        //   "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        // }
    },
    plugins: [
		new NodePolyfillPlugin()
	]
};