import Store from 'electron-store'
import { DateProvider } from 'equalizer'
import { MonitoringData } from '../Types/AutoConnectStoredData'

export class PersistentStorage {
  private storage: Store<MonitoringData>
  private data: MonitoringData = {
    checkedConversations: [],
    checkedInvitations: [],
  }

  constructor(private dateProvider: DateProvider) {
    this.storage = new Store<MonitoringData>()
    this.initStorage()
  }

  private initStorage() {
    const hasEntries = Object.keys(this.storage.store).length !== 0

    if (!hasEntries) {
      this.storage.set('monitoring', this.data)
      return
    }

    const persisted: MonitoringData = this.storage.get('monitoring')
    if (persisted) {
      this.data = persisted
    }
  }

  private save(): void {
    this.storage.set('monitoring', this.data)
  }

  markInvitationChecked(urn: string): void {
    this.data.checkedInvitations.push(urn)
    this.save()
  }

  markMessageChecked(urn: string): void {
    this.data.checkedConversations.push(urn)
    this.save()
  }

  isChecked(urn: string): boolean {
    return (
      this.data.checkedConversations.includes(urn) ||
      this.data.checkedInvitations.includes(urn)
    )
  }

  markMonitoringComplete() {
    this.data.lastMonitoringCompleteAt = this.dateProvider.now()
    this.save()
  }
}
