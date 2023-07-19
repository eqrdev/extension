# React components for building Equalizer UI

_For now, this is not a standalone package, but later we might extract it from the repository._ 

Until that we do not transpile the source code. 

We use [Emotion][emotion] to style our components.  

## Usage

These are very little and simple components. The usage is simple and intuitive, you just need to use the `EqGlobal`
component to provide the CSS custom properties and the global styles. 

```typescript jsx
import { ReactElement } from 'react'
import { EqGlobal } from 'ui-library'
import { EqButton } from './EqButton'

const MyApplication = (): ReactElement => {
  return (
    <EqGlobal cacheId="my-app-emotion-cache-id">
      <div>
        <EqButton small outline>My small outline style button</EqButton>
      </div>
    </EqGlobal>
  )
}
```

[emotion]: https://emotion.sh/docs/introduction
