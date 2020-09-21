const PackageConfigFileReader = require('./PackageConfigFileReader');
const PackageInstaller = require('./PackageInstaller');
const parseArgs = require('minimist');
const { readFile } = require('fs').promises

const argv = parseArgs(process.argv.slice(2), {string: 'f'});

const fileReader = new PackageConfigFileReader();
const packages = fileReader.read('./input/input' + argv['f'] + '.txt');
const packageInstaller = new PackageInstaller(packages)

let message = 'PASS';

try {
    packageInstaller.check();
} catch (e) {
    message = 'FAIL'
}

console.log(message);

readFile('./output/output' + argv['f'] + '.txt')
    .then((data) => console.log('Expected result:' + data.toString().trim()))
    .catch((error) => console.error(error));




