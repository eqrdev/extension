import { Collection, MessengerConversation, Urn } from './entities'

export type ConversationsResponse = {
  data: With<
    undefined,
    {
      messengerConversationsBySyncToken: Collection<
        'restli.common.CollectionResponse',
        MessengerConversation,
        {
          metadata: With<
            'messenger.SyncMetadata',
            {
              newSyncToken: string
            }
          >
        }
      >
    }
  >
}

export type ConversationMessagesResponse = {
  data: With<
    undefined,
    {
      messengerConversationsBySyncToken: Collection<
        'restli.common.CollectionResponse',
        MessengerConversation,
        {
          metadata: With<
            'messenger.SyncMetadata',
            {
              newSyncToken: string
              shouldClearCache: boolean
              deletedUrns: Array<Urn<string>>
            }
          >
        }
      >
    }
  >
}
