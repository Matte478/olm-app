import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toast'

type Props = {
  url: string
  userName: string
  deviceType: string
  createdAt: string
}

const ShowUserExperimentDownload: React.FC<Props> = ({
  url,
  userName,
  deviceType,
  createdAt,
}: Props) => {
  const { t } = useTranslation()

  const handleDownloadResult = () => {
    fetch(url)
      .then((response) => {
        response.blob().then((blob) => {
          const fileExt = url.split('.').pop()
          const href = window.URL.createObjectURL(blob)
          let a = document.createElement('a')
          a.href = href
          a.download = `${userName}_${deviceType}_${createdAt}.${fileExt}`
          a.click()
          toast.success(t('user_experiments.download.success'))
        })
      })
      .catch(() => {
        toast.error(t('user_experiments.download.error'))
      })
  }

  return (
    <CButton
      className="me-2 text-light d-inline-flex justify-content-center align-items-center"
      color="success"
      onClick={handleDownloadResult}
    >
      <CIcon content={cilCloudDownload} className="me-1 text-light" />
      {t('user_experiments.download.button')}
    </CButton>
  )
}

export default ShowUserExperimentDownload
