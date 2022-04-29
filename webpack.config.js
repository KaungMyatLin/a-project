const path = require ('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'assets', 'scripts')
    },
    resolve: {
        // modules: [ 'node_modules' ],
        // fallback: {
        //   "constants": require.resolve("constants-browserify"),
        //   "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        // }
    },
    plugins: [
		new NodePolyfillPlugin()
	]
};