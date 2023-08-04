type ErrorPathSegment = number | string

export type ErrorObject = {
  path: ErrorPathSegment[]
  locations: ErrorPathSegment[]
  extensions: {
    classification: string
  }
  message: string
}
