import { CollectionOf, With } from './common/utilities'
import { Conversation, Message } from './common/Entities'

export type ConversationsResponse = {
  data: With<{
    messengerConversationsBySyncToken: CollectionOf<
      Conversation,
      {
        metadata: With<{
          newSyncToken: string
        }>
      }
    >
  }>
}

export type ConversationMessagesResponse = {
  data: With<{
    messengerMessagesBySyncToken: CollectionOf<
      Message,
      {
        metadata: With<{
          newSyncToken: string
          shouldClearCache: boolean
          deletedUrns: Array<string>
        }>
      }
    >
  }>
}
