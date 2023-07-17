interface Artifact {
  width: number
  height: number
  type: string
}

export interface LinkedInInvitationView {
  invitation: {
    genericInviter: {
      memberProfileUrn: {
        firstName: string
        lastName: string
      }
    }
    inviteeMemberResolutionResult: {
      firstName: string
      lastName: string
    }
    title: {
      text: string
    }
    subtitle: {
      text: string
    }
    typeLabel: string
    message: string
    invitationState: string
    entityUrn: string
    sharedSecret: string
    invitationId: number
  }
  sentTimeLabel: string
  primaryImage: {
    displayImageReferenceResolutionResult: {
      url: string
      vectorImage: {
        attribution: string
        digitalmediaAsset: string
        artifacts: Array<Artifact>
      }
    }
  }
}
