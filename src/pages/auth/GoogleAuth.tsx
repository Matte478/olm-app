import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'
import { AppStateContext } from 'provider'
import { useSocialLoginMutation } from '__generated__/graphql'
import { SpinnerOverlay } from 'components'

const GoogleAuth: React.FC = () => {
  const [socialLogin, { loading }] = useSocialLoginMutation()
  const { appSetLogin, appSetRefreshToken } = useContext(AppStateContext)
  const navigate = useNavigate()

  const responseGoogle = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (!('accessToken' in response)) return

    try {
      const { data } = await socialLogin({
        variables: {
          socialLoginInput: {
            provider: 'google',
            token: response.accessToken,
          },
        },
      })
      if (
        data === undefined ||
        data?.socialLogin === undefined ||
        data.socialLogin?.access_token === undefined ||
        data.socialLogin?.user === undefined
      )
        throw new Error('Invalid credentials')

      appSetRefreshToken(data?.socialLogin.refresh_token || '')
      appSetLogin(
        data?.socialLogin.access_token!,
        data?.socialLogin.expires_in!,
        data?.socialLogin.user!,
      )

      navigate('/')
    } catch {}

    socialLogin({
      variables: {
        socialLoginInput: {
          provider: 'google',
          token: response.accessToken,
        },
      },
    })
  }

  return (
    <>
      {loading && <SpinnerOverlay transparent={true} />}
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
        buttonText="Log in with Google"
        onSuccess={responseGoogle}
        onFailure={console.log}
        cookiePolicy={'single_host_origin'}
      />
    </>
  )
}

export default GoogleAuth
