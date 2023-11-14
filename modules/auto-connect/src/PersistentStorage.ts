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
    this.initStorage().then()
  }

  private async initStorage() {
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
