import { DataStorage } from './Types/DataStorage'
import { writeFile, readFile, mkdir, stat } from 'node:fs/promises'
import { dirname } from 'path'

export class FileStorage<T> implements DataStorage<T> {
  constructor(private filePath: string) {}

  private async createFile(data = '') {
    await mkdir(dirname(this.filePath), { recursive: true })
    await writeFile(this.filePath, data, 'utf-8')
  }

  async hasFile(): Promise<boolean> {
    try {
      const fileStats = await stat(this.filePath)
      return fileStats.isFile()
    } catch (e) {
      if (e.code === 'ENOENT') {
        return false
      }
    }
  }

  private async checkAndCreateFile<T>(data?: T) {
    if (!(await this.hasFile())) {
      await this.createFile(JSON.stringify(data || ''))
    }
  }

  async save(data: T, raw = false): Promise<void> {
    await this.checkAndCreateFile(data)
    await writeFile(
      this.filePath,
      raw ? (data as string) : JSON.stringify(data),
      {
        encoding: 'utf-8',
      }
    )
  }

  async read(): Promise<T> {
    await this.checkAndCreateFile()
    return JSON.parse(await readFile(this.filePath, 'utf-8')) as T
  }
}
