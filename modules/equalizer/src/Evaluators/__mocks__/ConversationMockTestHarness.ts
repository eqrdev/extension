import { GeneralConversation } from '../../Types/GeneralConversation'

export class ConversationMockTestHarness {
  private generateProfileId(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-'
    return Array(39)
      .fill(undefined)
      .map(() =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      )
      .join('')
  }

  private generateConversationUrn() {
    return `urn:li:msg_conversation:(urn:li:fsd_profile:${this.generateProfileId()},${this.generateProfileId()})`
  }

  private generateParticipantUrn() {
    return `urn:li:msg_messagingParticipant:urn:li:fsd_profile:${this.generateProfileId()}`
  }

  private generateConversationUrl() {
    return `https://www.linkedin.com/messaging/thread/${this.generateProfileId()}/`
  }

  public get({
    isGroupMessage = false,
    isUnilateral = true,
    isArchive = false,
    createdAt = 1695888754994,
    lastActivityAt = 1695888754994,
  } = {}): GeneralConversation {
    const message1 = {
      text: "Sometimes I'll start a sentence and I don't even know where it's going. I just hope I find it along the way. Like an improv conversation.",
      sender: this.generateParticipantUrn(),
    }
    const message2 = {
      text: 'I am running away from my responsibilities. And it feels good.',
      sender: this.generateParticipantUrn(),
    }

    return {
      messages: isUnilateral ? [message1] : [message1, message2],
      participants: Array(isGroupMessage ? 3 : 2)
        .fill(undefined)
        .map(() => this.generateParticipantUrn()),
      categories: [isArchive ? 'ARCHIVED' : 'PRIMARY_INBOX', 'INMAIL'],
      createdAt,
      lastActivityAt,
      url: this.generateConversationUrl(),
      urn: this.generateConversationUrn(),
    }
  }
}
