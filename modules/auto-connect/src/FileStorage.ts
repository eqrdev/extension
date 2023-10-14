import { DataStorage } from './Types/DataStorage'
import { writeFile, readFile } from 'fs/promises'

export class FileStorage<T> implements DataStorage<T> {
  constructor(private filePath: string) {}

  async save(data: T): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(data), { encoding: 'utf-8' })
  }

  async read(): Promise<T> {
    try {
      return JSON.parse(await readFile(this.filePath, 'utf-8')) as T
    } catch (error) {
      if (error.code === 'ENOENT') {
        await writeFile(this.filePath, '', 'utf-8')
      }
    }
  }
}
