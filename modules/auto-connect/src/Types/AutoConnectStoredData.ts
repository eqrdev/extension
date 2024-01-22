export type AutoConnectSettings = {
  username: string
  token: string
  message?: string
  openAiKey?: string
}

export type MonitoringData = {
  lastMonitoringCompleteAt?: number
  checkedInvitations: string[]
  checkedConversations: string[]
}

export type AutoConnectStoredData = {
  settings: AutoConnectSettings
  monitoring: MonitoringData
}
