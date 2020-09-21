const Package = require('./model/Package');
const Packages = require('./model/Packages');
const lineByLine = require('n-readlines');

module.exports = class PackageConfigFileReader {
    constructor() {
        this.line = null;
        this.lineNumber = 1;
        this.numberOfPackages = 0;
        this.numberOfDependencies = 0;
    }

    read (path) {
        let packages = new Packages();
        let notFoundPackages = new Packages();
        const liner = new lineByLine(path);

        while (this.line = liner.next()) {
            const lineContent = this.line.toString().trim();
            if (this.lineNumber === 1) {
                this.numberOfPackages = +lineContent
            } else if (this.lineNumber <= this.numberOfPackages + 1) {
                const packageData = lineContent.split(',');
                const packageName = packageData[0];
                const packageVersion = packageData[1];
                const packageToInstall = new Package(packageName, packageVersion);
                packages.set(packageToInstall.id, packageToInstall);
            } else if(this.lineNumber === this.numberOfPackages + 2){
                this.numberOfDependencies = +lineContent
            } else {
                const dependencies = lineContent.split(',');
                let packageName = dependencies.shift();
                let packageVersion = dependencies.shift();
                let parentPackage = packages.get(packageName + ',' + packageVersion);
                if (!parentPackage) {
                    parentPackage = new Package(packageName, packageVersion);
                }

                while (dependencies.length) {
                    let packageName = dependencies.shift();
                    let packageVersion = dependencies.shift();
                    const dependencyPackage = new Package(packageName, packageVersion);
                    if (dependencyPackage.id !== parentPackage.id) {
                        parentPackage.dependencies.set(dependencyPackage.id, dependencyPackage)
                    }
                }

                if (packages.get(parentPackage.id)) {
                    packages.set(parentPackage.id, parentPackage)
                } else {
                    notFoundPackages.set(parentPackage.id, parentPackage)
                }
            }
            this.lineNumber++;
        }


        for (let [notFoundPackageId, notFoundPackage] of notFoundPackages) {
            for (let [notFoundPackageId2, notFoundPackage2] of notFoundPackages) {
                if (notFoundPackageId !== notFoundPackageId2) {
                    let packageToInstallDependency = notFoundPackage2.findDependency(notFoundPackageId);

                    if (packageToInstallDependency) {
                        packageToInstallDependency.setDependencies(notFoundPackage.dependencies);
                        notFoundPackages.delete(notFoundPackageId)
                    }
                }


            }
        }


        for (let [notFoundPackageId, notFoundPackage] of notFoundPackages) {
            for (let [packageToInstallId, packageToInstall] of packages) {
                let packageToInstallDependency = packageToInstall.findDependency(notFoundPackageId);
                if (packageToInstallDependency) {
                    packageToInstallDependency.setDependencies(notFoundPackage.dependencies);
                    notFoundPackages.delete(notFoundPackageId)
                }
            }
        }


        return packages;



    }
}