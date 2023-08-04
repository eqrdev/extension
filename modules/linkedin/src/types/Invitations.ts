import { CollectionOf, Typed } from './common/utilities'
import { CollectionMetadata, InvitationView } from './common/Entities'
import { ErrorObject } from './common/ErrorObject'

export type Invitations = {
  data: Typed<{
    relationshipsDashInvitationViewsByReceived: CollectionOf<
      InvitationView,
      {
        metadata: CollectionMetadata
        paging: CollectionMetadata
      }
    >
  }>
  errors: ErrorObject[]
}
