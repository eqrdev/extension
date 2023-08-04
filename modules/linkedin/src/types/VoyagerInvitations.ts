import { VoyagerCollectionOf, VoyagerTyped } from './common/utilities'
import {
  CollectionMetadata,
  InvitationView,
  MicroSchema,
  ContentSeriesInclude,
  CompanyInclude,
  ProfileInclude,
  InviteInclude,
} from './common/VoyagerEntities'
import { ErrorObject } from './common/ErrorObject'

export type VoyagerInvitations = {
  data: {
    extensions: {
      webMetadata: Record<string, unknown>
    }
  } & {
    data: VoyagerTyped<{
      relationshipsDashInvitationViewsByReceived: VoyagerCollectionOf<
        InvitationView,
        {
          metadata: CollectionMetadata
          paging: CollectionMetadata
        }
      >
    }>
    errors: ErrorObject[]
  }
  meta?: {
    microSchema: MicroSchema
  }
  included?: Array<
    CompanyInclude | ContentSeriesInclude | InviteInclude | ProfileInclude
  >
}
