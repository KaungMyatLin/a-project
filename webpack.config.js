const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
console.log(appDirectory);
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);
console.log(appDirectory);


module.exports = {
    mode: 'development',
    entry:  './src/app.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'assets', 'scripts')
    },
    plugins: [
		new NodePolyfillPlugin(),
	]
};