const path = require('path');
var modulesPath = path.resolve(__dirname, '../');
var shell = require('shelljs');
const {
    scanforder
} = require('./utils');

// 指定打包模块
let designatedModule = [];


let targetBuildModules = scanforder(modulesPath);
if (designatedModule.length > 0) {
    targetBuildModules = designatedModule;
}
targetBuildModules.forEach(function (name) {
    if (name != '.git' && name != 'build' && name != 'publicMethods' && name != 'dist') {
        shell.cd(`${modulesPath}/${name}`);
        //清除node_modules
        shell.rm('-rf', `${modulesPath}/${name}/node_modules/*`);
        console.warn("清除"+`${name}/`+"node_modules:OK")
        shell.exec('cnpm install');
        // shell.exec('npm install --registry=https://registry.npm.taobao.org');
    }
});