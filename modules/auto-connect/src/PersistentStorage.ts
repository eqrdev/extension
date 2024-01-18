import { EqualizerStoredData } from './Types/EqualizerStoredData'
import { FileStorage } from './FileStorage'
import { DateProvider } from 'equalizer'

export class PersistentStorage {
  private data: EqualizerStoredData = {
    checkedConversations: [],
    checkedInvitations: [],
  }

  constructor(
    private dateProvider: DateProvider,
    private storage: FileStorage<EqualizerStoredData>
  ) {
    void this.initStorage()
  }

  private async initStorage() {
    const hasFile = await this.storage.hasFile()

    if (!hasFile) {
      await this.storage.save(this.data)
      return
    }

    const persisted = await this.storage.read()
    if (persisted) {
      this.data = persisted
    }
  }

  private async save(): Promise<void> {
    await this.storage.save(this.data)
  }

  async markInvitationChecked(urn: string): Promise<void> {
    this.data.checkedInvitations.push(urn)
    await this.save()
  }

  async markMessageChecked(urn: string): Promise<void> {
    this.data.checkedConversations.push(urn)
    await this.save()
  }

  isChecked(urn: string): boolean {
    return (
      this.data.checkedConversations.includes(urn) ||
      this.data.checkedInvitations.includes(urn)
    )
  }

  async markMonitoringComplete() {
    this.data.lastMonitoringCompleteAt = this.dateProvider.now()
    await this.save()
  }
}
