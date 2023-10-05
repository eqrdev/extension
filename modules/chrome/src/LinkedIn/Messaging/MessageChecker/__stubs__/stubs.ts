import { ConversationData } from '../../../../Shared/Gateways/LinkedInAPIGateway'

export const conversationsStub: ConversationData[] = [
  {
    categories: ['PRIMARY_INBOX', 'INMAIL'],
    conversationParticipantsCount: 2,
    lastActivityAt: new Date('2023-10-10').getTime(),
    createdAt: new Date('2023-10-10').getTime(),
    entityUrn: 'urn:li:fsd_profile:ARqe0o0OYH2XvCCzQdnB043AbQKCAU6BLYGsknt',
  },
  {
    categories: ['PRIMARY_INBOX'],
    conversationParticipantsCount: 2,
    lastActivityAt: new Date('2023-10-10').getTime(),
    createdAt: new Date('2023-10-10').getTime(),
    entityUrn: 'urn:li:fsd_profile:UY0AHsqKvOAQCCkB6Gtd0nbY0CBQX4z3ALeRo2n',
  },
  {
    categories: ['PRIMARY_INBOX', 'INMAIL'],
    conversationParticipantsCount: 2,
    lastActivityAt: new Date('2023-10-10').getTime(),
    createdAt: new Date('2023-10-10').getTime(),
    entityUrn: 'urn:li:fsd_profile:soCL20G6BeOdqbYQBnU0AAnAYHCz0vKk4XQRC3t',
  },
  {
    // shouldn't process - group message
    categories: ['PRIMARY_INBOX', 'INMAIL'],
    conversationParticipantsCount: 3,
    lastActivityAt: new Date('2023-10-10').getTime(),
    createdAt: new Date('2023-10-10').getTime(),
    entityUrn: 'urn:li:fsd_profile:Ytd2bzCqBnQ60HKC0eRvUOQAk40GCsAoLA3nXBY',
  },
  {
    // shouldn't process - too old
    categories: ['PRIMARY_INBOX', 'INMAIL'],
    conversationParticipantsCount: 2,
    lastActivityAt: new Date('2023-09-01').getTime(),
    createdAt: new Date('2023-09-01').getTime(),
    entityUrn: 'urn:li:fsd_profile:Uvsbo3BLkBGCtXAe60KnQHYC0OAz0A2QRdCYnq4',
  },
  {
    // shouldn't process - in archive
    categories: ['ARCHIVE'],
    conversationParticipantsCount: 2,
    lastActivityAt: new Date('2023-10-10').getTime(),
    createdAt: new Date('2023-10-10').getTime(),
    entityUrn: 'urn:li:fsd_profile:nnCe3OQbHt4AQB0KYzsU0CAAXGBRv6C2Ld0Ykqo',
  },
]

export const conversationStub = {
  entityUrns: ['urn:li:fsd_profile:nXqtALYHAG30o40A6C2UBCbYsRKvnzeBOQdQCk0'],
  conversationText: 'Hello, this is a message from a recruiter. Really.',
}
