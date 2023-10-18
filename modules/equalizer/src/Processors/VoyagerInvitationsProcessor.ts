import { VoyagerInvitations, VoyagerEntities } from 'linkedin'
import { GeneralInvitation } from 'equalizer'

export class VoyagerInvitationsProcessor {
  constructor(private response: VoyagerInvitations) {}

  get generalInvitations(): GeneralInvitation[] {
    return this.getInvitationUrns().map(entityUrn => ({
      urn: entityUrn,
      message: this.getIncludeByEntityUrn(entityUrn).message,
      sentTimeLabel: this.getViewByEntityUrn(entityUrn).sentTimeLabel,
      inviterTitle: this.getViewByEntityUrn(entityUrn).subtitle.text,
      inviterId: this.getProfileIncludeByEntityUrn(entityUrn).publicIdentifier,
      inviterName: this.getViewByEntityUrn(entityUrn).title.text,
      sharedSecret: this.getIncludeByEntityUrn(entityUrn).sharedSecret,
    }))
  }

  private getInvitationUrns(): string[] {
    return this.response.included.reduce<string[]>(
      (allUrns, { $type, entityUrn }) =>
        $type ===
        'com.linkedin.voyager.dash.relationships.invitation.Invitation'
          ? allUrns.concat([entityUrn])
          : allUrns,
      []
    )
  }

  private getIncludeByEntityUrn(
    urn: string
  ): VoyagerEntities.InvitationInclude {
    return this.response.included.find(
      ({ entityUrn }) => entityUrn === urn
    ) as VoyagerEntities.InvitationInclude
  }

  private getViewByEntityUrn(urn: string): VoyagerEntities.InvitationView {
    return this.response.data.data.relationshipsDashInvitationViewsByReceived.elements.find(
      ({ '*invitation': entityUrn }) => entityUrn === urn
    )
  }

  private getProfileIncludeByEntityUrn(
    urn: string
  ): VoyagerEntities.ProfileInclude {
    const memberUrn =
      this.getIncludeByEntityUrn(urn).genericInviter['*memberProfileUrn']
    return this.response.included.find(
      include => include.entityUrn === memberUrn
    ) as VoyagerEntities.ProfileInclude
  }
}
