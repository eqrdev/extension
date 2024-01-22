import { useEffect, useState } from 'react'

export const Logger = () => {
  const [log, setLog] = useState([])

  useEffect(() => {
    window.autoConnect.onLogEntry((logEntry) => {
      setLog([...log, logEntry])
    })
  }, [])

  return (
    <div>
      <pre>
        {log.map((row) => (
          <span>{row}</span>
        ))}
      </pre>
    </div>
  )
}
