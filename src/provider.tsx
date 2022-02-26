import { createContext, useState, ReactNode } from 'react'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  DefaultOptions,
  Observable,
} from '@apollo/client'
import { onError } from '@apollo/link-error'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import { setContext } from '@apollo/client/link/context'
import { Cookies } from 'react-cookie'
import { createUploadLink } from 'apollo-upload-client'

import { AuthenticatedUserFragment } from '__generated__/graphql'

const apiUri = process.env.REACT_APP_API_ENDPOINT || 'https://olm-api.test/graphql'
let authToken = ''
let authTokenExp: Date | null = null

const appStateInitial: { authUser?: AuthenticatedUserFragment } = { authUser: undefined }

const initial = {
  appState: appStateInitial,
  appSetLogin: (token: string, expSec: number, authUser: AuthenticatedUserFragment) => {},
  appSetLogout: () => {},
  appSetAuthToken: (token: string, expSec: number) => {},
  appClearAuthToken: () => {},
  appSetRefreshToken: (token: string) => {},
  appSetAuthUser: (authUser: AuthenticatedUserFragment) => {},
  appClearRefreshToken: () => {},
  appGetRefreshToken: (): string => '',
}

export const AppStateContext = createContext(initial)

function AppStateProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<{ authUser?: AuthenticatedUserFragment }>({
    authUser: undefined,
  })

  const appSetLogin = (token: string, expSec: number, authUser: AuthenticatedUserFragment) => {
    appSetAuthToken(token, expSec)

    setAppState({ ...appState, authUser: authUser })
  }

  const appSetLogout = () => {
    appClearAuthToken()
    appClearRefreshToken()
    setAppState({ ...appState, authUser: undefined })
  }

  const appSetAuthToken = (token: string, expSec: number) => {
    const expDate = new Date()
    expDate.setSeconds(expDate.getSeconds() + expSec)

    authToken = token
    authTokenExp = expDate
  }

  const appClearAuthToken = () => {
    authToken = ''
    authTokenExp = null
  }

  const appSetRefreshToken = (token: string) => {
    const cookies = new Cookies()
    const expDate = new Date()
    expDate.setDate(expDate.getDate() + 1)

    cookies.set('refresh_token', token, {
      path: '/',
      expires: expDate,
    })
  }

  const appClearRefreshToken = () => {
    const cookies = new Cookies()
    cookies.remove('refresh_token')
  }

  const appSetAuthUser = (authUser: AuthenticatedUserFragment) => {
    setAppState({ ...appState, authUser: authUser })
  }

  const appGetAuthToken = (): { token: string; exp: Date | null } => {
    return { token: authToken, exp: authTokenExp }
  }

  const appGetRefreshToken = (): string => {
    const cookies = new Cookies()
    return cookies.get('refresh_token') || ''
  }

  // apollo client
  const cache = new InMemoryCache()
  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: appGetAuthToken().token ? `Bearer ${appGetAuthToken().token}` : '',
      },
    }
  })

  const uploadLink = createUploadLink({
    uri: apiUri,
  })

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors && graphQLErrors[0].message === 'Unauthenticated.') {
      const cookies = new Cookies()
      const refreshToken = cookies.get('refresh_token')
      if (refreshToken) {
        return new Observable((observer) => {
          fetchAccessToken()
            .then(({ accessToken }: { accessToken: { token: string; exp: number } }) => {
              if (!accessToken.token) return

              appSetAuthToken(accessToken.token, accessToken.exp)

              const oldHeaders = operation.getContext().headers
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${accessToken.token}`,
                },
              })
            })
            .then(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              }

              forward(operation).subscribe(subscriber)
            })
            .catch((error) => {
              observer.error(error)
            })
        })
      }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const client = new ApolloClient({
    link: ApolloLink.from([
      new TokenRefreshLink({
        accessTokenField: 'accessToken',
        isTokenValidOrUndefined: () => {
          const { token, exp } = appGetAuthToken()
          const refreshToken = appGetRefreshToken()

          if (refreshToken.length === 0) return true

          if (token.length === 0 || !exp) return false
          if (exp && new Date() >= exp) return false
          return true
        },
        fetchAccessToken,
        handleFetch: (accessToken: { token: string; exp: number }) => {
          appSetAuthToken(accessToken.token, accessToken.exp)
        },
        handleResponse: (operation, accessTokenField) => {
          // console.log(`handleResponse: ${accessTokenField}`)
          // console.log(operation)
        },
        handleError: (err) => {
          console.log(`handleError: ${err}`)
          appSetLogout()
        },
      }),
      errorLink,
      authLink,
      uploadLink,
      // new HttpLink({
      //   uri: apiUri,
      //   credentials: 'include',
      // }),
    ]),
    cache,
    defaultOptions,
  })

  return (
    <AppStateContext.Provider
      value={{
        appState,
        appSetLogin,
        appSetLogout,
        appSetAuthToken,
        appClearAuthToken,
        appSetRefreshToken,
        appSetAuthUser,
        appClearRefreshToken,
        appGetRefreshToken,
      }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AppStateContext.Provider>
  )
}

export default AppStateProvider

export const fetchAccessToken = async (): Promise<any> => {
  const cookies = new Cookies()
  const refreshToken = cookies.get('refresh_token')

  const payload = {
    operationName: 'refreshToken',
    variables: {},
    query: `mutation refreshToken {
      refreshToken(
        input: {
          refresh_token: "${refreshToken}"
        }
      ) {
        access_token
        refresh_token
        expires_in
        token_type
      }
    }`,
  }
  return fetch(apiUri, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
  })
    .then(async (res) => {
      const response = await res.json()

      const expDate = new Date()
      expDate.setDate(expDate.getDate() + 1)

      cookies.set('refresh_token', response.data.refreshToken.refresh_token, {
        path: '/',
        expires: expDate,
      })

      return {
        accessToken: {
          token: response.data.refreshToken.access_token,
          exp: response.data.refreshToken.expires_in,
        },
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

export const fetchAuthUser = async (): Promise<any> => {
  const payload = {
    operationName: 'Me',
    variables: {},
    query: `query Me {
      me {
        id
        name
        email
        permissionsList
      }
    }`,
  }
  return fetch(apiUri, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      authorization: `Bearer ${authToken}`,
    },
  })
    .then(async (res) => {
      const response = await res.json()
      const user: AuthenticatedUserFragment = response.data.me
      return user
    })
    .catch((error) => {
      console.log(error)
    })
}
