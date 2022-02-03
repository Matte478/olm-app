import React from 'react'
import { CChart } from '@coreui/react-chartjs'

type Props = {}

const ExperimentGraph: React.FC<Props> = ({}: Props) => {
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  const datasets = [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(220, 220, 220, 0.2)',
      borderColor: 'rgba(220, 220, 220, 1)',
      pointBackgroundColor: 'rgba(220, 220, 220, 1)',
      pointBorderColor: '#fff',
      data: [40, 20, 12, 39, 10, 40, 39],
    },

    {
      label: 'My Second dataset',
      backgroundColor: 'rgba(151, 187, 205, 0.2)',
      borderColor: 'rgba(151, 187, 205, 1)',
      pointBackgroundColor: 'rgba(151, 187, 205, 1)',
      pointBorderColor: '#fff',
      data: [50, 12, 28, 29, 7, 25, 12],
    },
  ]

  return (
    <CChart
      type="line"
      options={{
        // animation: false,
      }}
      data={{
        labels,
        datasets,
      }}
    />
  )
}

export default React.memo(ExperimentGraph)
