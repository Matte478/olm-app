import React, { useEffect } from 'react'
import Echo from 'laravel-echo'
import PlotlyChart from 'react-plotly.js'

import { UserExperimentBasicFragment } from '__generated__/graphql'

type Props = {
  userExperiment: UserExperimentBasicFragment
}

//@ts-ignore
window.Pusher = require('pusher-js')

const ExperimentGraph: React.FC<Props> = ({userExperiment}: Props) => {

  useEffect(() => {
    const echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.REACT_APP_PUSHER_ENV_KEY,
      cluster: process.env.REACT_APP_PUSHER_ENV_CLUSTER,
      // wsHost: process.env.REACT_APP_PUSHER_HOST,
      wsHost: userExperiment.experiment.server.ip_address,
      wsPort: userExperiment.experiment.server.websocket_port,
      forceTLS: false,
      disableStats: true,
    })

    echo.channel('channel').listen('DataBroadcaster', (e: any) => {
      console.log(e)
      if (e.hello) {
        console.log(e.hello)
      } else {
        // probably end of stream
      }
    })

    return () => {
      console.log('disable')
     
      echo.channel('channel').stopListening('DataBroadcaster')
      echo.leaveChannel('channel')
    }
  }, [])

  return (
    <PlotlyChart
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' },
        },
        {
          x: [1, 2, 3],
          y: [1, 3, 9],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
      ]}
      layout={{ title: 'A Fancy Plot' }}
    />
  )
}

export default React.memo(ExperimentGraph)
