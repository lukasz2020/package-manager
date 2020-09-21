const Packages = require('./Packages');

module.exports = class Package {
    constructor(name, version) {
        this.id = name + ',' + version;
        this.name = name;
        this.version = version;
        this.dependencies = new Packages()
    }

    setDependencies (dependencies = new Packages()) {
        this.dependencies = dependencies;
    }

    findDependency (id, dependencies = this.dependencies) {
        let dependency;

        for (let [dependentPackageId, dependentPackage] of dependencies) {
            if (dependentPackageId === id) {
                dependency = dependentPackage;
            } else {
                dependency = this.findDependency(id, dependentPackage.dependencies);
            }
        }

        return dependency;
    }
}