import React, { useEffect, useState } from 'react'
import Echo from 'laravel-echo'
import PlotlyChart from 'react-plotly.js'

import { UserExperimentDashboardFragment } from '__generated__/graphql'
import { CCol, CRow } from '@coreui/react'
import ExperimentAnimation from './ExperimentAnimation'
import Plotly from 'plotly.js'
import { ErrorNotifier, SpinnerOverlay } from 'components'
import { WsData, WsResponse } from 'types'

type Props = {
  userExperiment: UserExperimentDashboardFragment
  running: boolean
  setRunning: (running: boolean) => void
}

//@ts-ignore
window.Pusher = require('pusher-js')

const ExperimentVisualization: React.FC<Props> = ({ userExperiment, running, setRunning }: Props) => {
  const [graphData, setGraphData] = useState<Plotly.Data[]>()
  const [wsError, setWsError] = useState<string>()
  const [data, setData] = useState<WsData[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
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
      .listen('DataBroadcaster', (e: WsResponse) => {
        setLoading(false)
        setRunning(true)

        if (e.finished) {
          setData(undefined)
          setRunning(false)
        } else if (e.error) {
          setData(undefined)
          setWsError(e.error)
        } else if (e.data) {
          setData(e.data)
          const time = e.data[0].name === 'Timestamp'
            ? e.data[0].data.map((timestamp: string) => parseFloat(timestamp))
            : Array.from(Array(e.data[0].data).keys()).map((i) => i)
          updateGraphData(e.data, time)
          setWsError(undefined)
        }
      })

    return () => {
      echo.channel('channel').stopListening('DataBroadcaster')
      echo.leaveChannel('channel')
    }
  }, [userExperiment, setRunning])

  const updateGraphData = (data: WsData[], time: number[]) => {
    setGraphData(
      data.map((d) => {
        if (d.name === 'Timestamp') return {}
        return {
          name: d['name'],
          x: time,
          y: d['data'],
          type: 'scatter',
        }
      }),
    )
  }

  return (
    <div className="position-relative">
      {loading && <SpinnerOverlay transparent={true} className="position-absolute" style={{ zIndex: 999 }} />}
      <CRow>
        <CCol md={userExperiment.experiment.device?.deviceType.name === 'tom1a' ? 7 : 12}>
          <PlotlyChart
            data={graphData || []}
            layout={{}}
            useResizeHandler={true}
            style={{ width: '100%' }}
          />
        </CCol>
        {userExperiment.experiment.device?.deviceType.name === 'tom1a' && (
          <CCol md={5}>
            <ExperimentAnimation data={data} isRunning={running} />
          </CCol>
        )}
      </CRow>
      {wsError && (
        <CRow>
          <CCol md={12}>
            <ErrorNotifier error={wsError} />
          </CCol>
        </CRow>
      )}
    </div>
  )
}

export default React.memo(ExperimentVisualization)
