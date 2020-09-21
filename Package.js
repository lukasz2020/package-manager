module.exports = class Package {
  constructor (name, version) {
    this.id = name + ',' + version
    this.name = name
    this.version = version
    this.dependencies = new Map()
  }

  setDependencies (dependencies = new Map()) {
    this.dependencies = dependencies
  }

  findDependency (id, dependencies = this.dependencies) {
    let dependency

    for (const [dependentPackageId, dependentPackage] of dependencies) {
      if (dependentPackageId === id) {
        dependency = dependentPackage
      } else {
        dependency = this.findDependency(id, dependentPackage.dependencies)
      }
    }

    return dependency
  }
}
