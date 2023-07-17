export const generateTrackingIdAsCharString = () => {
  const randomIntArray = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256)
  )
  const randByteArray = new Uint8Array(randomIntArray)
  const charArray = Array.from(randByteArray, byte => String.fromCharCode(byte))

  return charArray.join('')
}
