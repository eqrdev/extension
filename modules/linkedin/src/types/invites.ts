type ErrorPathSegment = number | string

type Error = {
  path: ErrorPathSegment[]
  locations: ErrorPathSegment[]
  extensions: {
    classification: string
  }
  message: string
}

export type InvitesResponse = {
  data: {
    extensions: {
      webMetadata: Record
    }
    data: Record
    errors: Error[]
  }
}
