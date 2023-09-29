export interface GeneralConversation {
  urn: string
  messages: Array<{
    text: string
    sender: string
  }>
  participants: string[]
  categories: string[]
  createdAt: number
  lastActivityAt: number
  url: string
}
