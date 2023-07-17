import { LinkedInClient } from 'linkedin'
import { LinkedInHeaders } from '../../../Worker/LinkedInHeaders'
import { Observable } from '../../../Shared/Observable'
import { ChromeStorageGateway } from '../../../Shared/ChromeStorageGateway'

export interface InvitationData {
  lastChecked: number
}

export class InvitationCheckerRepository {
  private programmersModel: Observable<InvitationData>
  private storage: ChromeStorageGateway<InvitationData>

  constructor() {
    this.storage = new ChromeStorageGateway<InvitationData>()
    this.programmersModel = new Observable<InvitationData>(null)
  }

  async getData(callback) {
    this.programmersModel.subscribe(callback)
    await this.loadData()
  }

  async checkInvitations() {
    const client = new LinkedInClient({
      csrfToken: await LinkedInHeaders.getCsrfToken(),
    })
    const invites = await client.getInvites()

    for (const invite of invites) {
      const { invitationId, sharedSecret } = invite.invitation

      await client.acceptInvitation(invitationId.toString(), sharedSecret)
    }
  }

  private async loadData(): Promise<void> {
    this.programmersModel.value = await this.storage.getAll()
  }
}
