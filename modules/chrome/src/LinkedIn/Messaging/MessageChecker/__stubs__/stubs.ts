import { GeneralConversation } from 'equalizer'

export const conversationsStub: GeneralConversation[] = [
  {
    urn: 'urn:li:fsd_profile:ARqe0o0OYH2XvCCzQdnB043AbQKCAU6BLYGsknt',
    messages: [
      {
        text: 'Hello',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
      {
        text: 'world',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
    ],
    participants: [
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
    ],
    categories: ['PRIMARY_INBOX', 'INMAIL'],
    createdAt: new Date('2023-10-10').getTime(),
    lastActivityAt: new Date('2023-10-10').getTime(),
    url: 'https://www.linkedin.com/messaging/thread/2-ZTQ2OGM4N2QtOThlOS00ZjdiLTk5NjgtMWQzNDU2NGQ4ZWUyXzAxMA==/',
  },
  {
    urn: 'urn:li:fsd_profile:UY0AHsqKvOAQCCkB6Gtd0nbY0CBQX4z3ALeRo2n',
    messages: [
      {
        text: 'Hello',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
      {
        text: 'world',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
    ],
    participants: [
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
    ],
    categories: ['PRIMARY_INBOX'],
    createdAt: new Date('2023-10-10').getTime(),
    lastActivityAt: new Date('2023-10-10').getTime(),
    url: 'https://www.linkedin.com/messaging/thread/2-ZTQ2OGM4N2QtOThlOS00ZjdiLTk5NjgtMWQzNDU2NGQ4ZWUyXzAxMA==/',
  },
  {
    urn: 'urn:li:fsd_profile:soCL20G6BeOdqbYQBnU0AAnAYHCz0vKk4XQRC3t',
    messages: [
      {
        text: 'Hello',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
      {
        text: 'world',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
    ],
    participants: [
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
    ],
    categories: ['PRIMARY_INBOX', 'INMAIL'],
    createdAt: new Date('2023-10-10').getTime(),
    lastActivityAt: new Date('2023-10-10').getTime(),
    url: 'https://www.linkedin.com/messaging/thread/2-ZTQ2OGM4N2QtOThlOS00ZjdiLTk5NjgtMWQzNDU2NGQ4ZWUyXzAxMA==/',
  },
  {
    // shouldn't process - group message
    urn: 'urn:li:fsd_profile:Ytd2bzCqBnQ60HKC0eRvUOQAk40GCsAoLA3nXBY',
    messages: [
      {
        text: 'Hello',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
      {
        text: 'world',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
    ],
    participants: [
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
    ],
    categories: ['PRIMARY_INBOX', 'INMAIL'],
    createdAt: new Date('2023-10-10').getTime(),
    lastActivityAt: new Date('2023-10-10').getTime(),
    url: 'https://www.linkedin.com/messaging/thread/2-ZTQ2OGM4N2QtOThlOS00ZjdiLTk5NjgtMWQzNDU2NGQ4ZWUyXzAxMA==/',
  },
  {
    // shouldn't process - too old
    urn: 'urn:li:fsd_profile:Uvsbo3BLkBGCtXAe60KnQHYC0OAz0A2QRdCYnq4',
    messages: [
      {
        text: 'Hello',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
      {
        text: 'world',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
    ],
    participants: [
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
    ],
    categories: ['PRIMARY_INBOX', 'INMAIL'],
    createdAt: new Date('2023-09-01').getTime(),
    lastActivityAt: new Date('2023-09-01').getTime(),
    url: 'https://www.linkedin.com/messaging/thread/2-ZTQ2OGM4N2QtOThlOS00ZjdiLTk5NjgtMWQzNDU2NGQ4ZWUyXzAxMA==/',
  },
  {
    // shouldn't process - in archive
    urn: 'urn:li:fsd_profile:nnCe3OQbHt4AQB0KYzsU0CAAXGBRv6C2Ld0Ykqo',
    messages: [
      {
        text: 'Hello',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
      {
        text: 'world',
        sender:
          'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      },
    ],
    participants: [
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
      'urn:li:msg_messagingParticipant:urn:li:fsd_profile:ACoAACQ4OnYBUb2skzde0qnH0tK06L3CXQRGBvY',
    ],
    categories: ['ARCHIVED'],
    createdAt: new Date('2023-10-10').getTime(),
    lastActivityAt: new Date('2023-10-10').getTime(),
    url: 'https://www.linkedin.com/messaging/thread/2-ZTQ2OGM4N2QtOThlOS00ZjdiLTk5NjgtMWQzNDU2NGQ4ZWUyXzAxMA==/',
  },
]
