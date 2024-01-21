import path from 'node:path'

export class AssetLocator {
  constructor(private assetsDir: string) {}

  getPath(fileName: string) {
    return path.resolve(this.assetsDir, fileName)
  }
}
