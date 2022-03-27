import React, { useEffect, useState } from 'react'
import Echo from 'laravel-echo'
import PlotlyChart from 'react-plotly.js'

import { UserExperimentDashboardFragment } from '__generated__/graphql'
import { CCol, CRow } from '@coreui/react'
import ExperimentAnimation from './ExperimentAnimation'
import Plotly from 'plotly.js'
import { ErrorNotifier } from 'components'

type Props = {
  userExperiment: UserExperimentDashboardFragment
}

//@ts-ignore
window.Pusher = require('pusher-js')

const ExperimentGraph: React.FC<Props> = ({ userExperiment }: Props) => {
  const [graphData, setGraphData] = useState<Plotly.Data[]>()
  const [wsError, setWsError] = useState<string>()

  useEffect(() => {
    const echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.REACT_APP_PUSHER_ENV_KEY,
      cluster: process.env.REACT_APP_PUSHER_ENV_CLUSTER,
      wsHost: userExperiment.experiment.server?.api_domain,
      wssPort: userExperiment.experiment.server?.websocket_port,
      forceTLS: true,
      disableStats: true,
    })

    echo
      .channel(userExperiment.experiment.device?.name || 'channel')
      .listen('DataBroadcaster', (e: any) => {
        console.log(e)
        if (e.error) {
          console.log(e.error)
          setWsError(e.error)
        } else if (e.data) {
          console.log(e.data)
          updateGraphData(e.data)
          setWsError(undefined)
        }
      })

    return () => {
      echo.channel('channel').stopListening('DataBroadcaster')
      echo.leaveChannel('channel')
    }
  }, [userExperiment])

  const updateGraphData = (data: any[]) => {
    setGraphData(
      data.map((d) => {
        return {
          name: d['name'],
          x: d['data'].keys(),
          y: d['data'],
          type: 'scatter',
        }
      }),
    )
  }

  return (
    <>
      <CRow>
        <CCol md={6}>
          <PlotlyChart
            data={graphData || []}
            layout={
              {
                // autosize: true,
                // title: 'A Fancy Plot',
              }
            }
            useResizeHandler={true}
            style={{ width: '100%' }}
          />
        </CCol>
        <CCol md={6}>
          <ExperimentAnimation />
        </CCol>
      </CRow>
      {wsError && (
        <CRow>
          <CCol md={12}>
            <ErrorNotifier error={wsError} />
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default React.memo(ExperimentGraph)
