import path from 'node:path'

export interface TAssetLocator {
  getPath(fileName: string): string
}
class AssetLocator implements TAssetLocator {
  private static AssetsDirectory = path.resolve(__dirname, 'Assets')
  getPath(fileName: string): string {
    return path.resolve(AssetLocator.AssetsDirectory, fileName)
  }
}

export const assetLocator = new AssetLocator()
