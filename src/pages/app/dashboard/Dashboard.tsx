import React, { useEffect } from 'react'

import { Card } from 'components'

// import Echo from 'laravel-echo'
// //@ts-ignore
// window.Pusher = require('pusher-js')

// //@ts-ignore
// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: process.env.REACT_APP_PUSHER_ENV_KEY,
//   cluster: process.env.REACT_APP_PUSHER_ENV_CLUSTER,
//   wsHost: process.env.REACT_APP_PUSHER_HOST,
//   wsPort: 6001,
//   forceTLS: false,
//   disableStats: true,
// })

const Dashboard: React.FC = () => {
  let init = false

  // useEffect(() => {
  //   //@ts-ignore
  //   if (!window.Echo) return

  //   window.Echo.channel('channel').listen('DataBroadcaster', (e: any) => {
  //     console.log(e)
  //     if (e.hello) {
  //       console.log(e.hello)
  //     } else {
  //       // probably end of stream
  //     }
  //   })
  // }, [init])

  return <Card title="Dashboard">Dashboard</Card>
}

export default Dashboard
