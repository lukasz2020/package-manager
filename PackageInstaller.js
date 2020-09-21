module.exports = class PackageInstaller {
  constructor (packages) {
    this.packages = packages
  }

  check (dependencies = this.packages, names = new Map()) {
    for (const packageToInstall of dependencies.values()) {
      const preparedPackage = names.get(packageToInstall.name)
      if (preparedPackage && preparedPackage.version !== packageToInstall.version) {
        throw new Error(`Duplicated package: ${preparedPackage.name}`)
      } else {
        names.set(packageToInstall.name, packageToInstall)
        this.check(packageToInstall.dependencies, names)
      }
    }

    return true
  }
}
