# LinkedIn API client for Equalizer

This is a simple API client to communicate with LinkedIn internal API-s directly.

## Usage

```typescript jsx
import { LinkedInClient } from 'linkedin'

const myClient = new LinkedInClient({
  csrfToken: 'ajax:8389143845...' // use a real CSRF token here
})

const conversation = await myClient.getConversation('ACoAABBVe30B...') // use a real URN id here
```

## Methods

#### sendMessage

`sendMessage(conversationUrnId: string, mailboxUrnId: string, text: string): Promise<Response>`

Sends a message to a conversation identified by `conversationUrnId` with the content of `text`.

#### getConversation

`getConversation(conversationUrnId: string): Promise<Message[]>`

Returns with a Conversation's messages array

#### getConversations

`getConversation(mailboxUrnId: string): Promise<MessengerConversation[]>`

Returns with an array of the Conversations

#### getInvites

`getInvites(): Promise<LinkedInInvitationView[]>`

Returns with an array of Invitations of the authenticated user

#### acceptInvitation

`acceptInvitation(invitationId: string, sharedSecret: string): Promise<void>`

Accepts the given invitation

## Static members

`LinkedInClient.apiBaseUrl(): string`

Returns the LinkedIn's internal API base url. 
