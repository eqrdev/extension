import { PersistentStorage } from './PersistentStorage'

export type MonitoringData = {
  lastMonitoringCompleteAt?: number
  checkedInvitations: string[]
  checkedConversations: string[]
}
export class MonitoringStorage {
  private data: MonitoringData = {
    checkedConversations: [],
    checkedInvitations: [],
  }

  constructor(private storage: PersistentStorage<MonitoringData>) {
    this.initStorage()
  }

  private initStorage() {
    if (this.storage.isEmpty()) {
      this.save()
      return
    }

    const persisted = this.storage.read()

    if (persisted) {
      this.data = persisted
    }
  }

  private save(): void {
    this.storage.save(this.data)
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

  markMonitoringComplete(date: number) {
    this.data.lastMonitoringCompleteAt = date
    this.save()
  }
}
