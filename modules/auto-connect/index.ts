import { AutoConnect } from './src/AutoConnect'

const equalizer = new AutoConnect(
  process.env.LI_SESSION_TOKEN,
  process.env.LI_PROFILE_ID,
  process.env.LI_AUTO_MESSAGE,
  process.env.OPENAI_API_KEY
)

console.log('[EQUALIZER] - monitoring started')

equalizer
  .monitorEnquiries()
  .catch(e => {
    console.log(`[EQUALIZER] - monitoring ran into some error: ${e}`)
  })
  .finally(() => {
    console.log('[EQUALIZER] - monitoring done')
  })
