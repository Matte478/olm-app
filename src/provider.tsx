import React, { createContext, useState, ReactNode } from 'react'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/link-error'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import { setContext } from '@apollo/client/link/context'
import { Cookies } from 'react-cookie'
import { User } from './__generated__/graphql'

const apiUri = 'http://olm-api.test/graphql'
let authToken = ''
let authTokenExp: Date | null = null

const appStateInitial: { authUser?: User } = { authUser: undefined }

const initial = {
  appState: appStateInitial,
  // gqlError: { msg: '' },
  appSetLogin: (token: string, expSec: number, authUser: User) => {},
  appSetLogout: () => {},
  appSetAuthToken: (token: string, expSec: number) => {},
  appClearAuthToken: () => {},
  appSetRefreshToken: (token: string) => {},
  appSetAuthUser: (authUser: User) => {},
  appClearRefreshToken: () => {},
  appGetRefreshToken: (): string => '',
}

export const AppStateContext = createContext(initial)

function AppStateProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<{ authUser?: User }>({ authUser: undefined })
  // const [gqlError, setGQLError] = useState({ msg: '' })

  const appSetLogin = (token: string, expSec: number, authUser: User) => {
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

  const appSetAuthUser = (authUser: User) => {
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
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: appGetAuthToken().token ? `Bearer ${appGetAuthToken().token}` : '',
      },
    }
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    // if (graphQLErrors === undefined || graphQLErrors[0].path === undefined) return
    // if (graphQLErrors[0].path[0] === 'refresh') return
    // const msg = graphQLErrors[0].message
    // const reason = graphQLErrors[0]?.extensions?.reason
    // const validation = graphQLErrors[0]?.extensions?.validation

    // let validationList = null
    // if (Object.prototype.toString.call(validation) === '[object Object]') {
    //   validationList = (
    //     <ul className="mb-0">
    //       {Object.entries(validation).map((entry) => {
    //         const [key, value] = entry
    //         return <li key={key}>{value as string}</li>
    //       })}
    //     </ul>
    //   )
    // }

    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
      )

    if (networkError) console.log(`[Network error]: ${networkError}`)

    // setGQLError({ msg: validationList || reason || msg || '' })
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
      new HttpLink({
        uri: apiUri,
        credentials: 'include',
      }),
    ]),
    cache,
  })

  return (
    <AppStateContext.Provider
      value={{
        appState,
        // gqlError,
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
        refresh_token
        access_token
        expires_in
        __typename
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
    operationName: 'me',
    variables: {},
    query: `query me {
      me {
        id
        name
        email
        created_at
        updated_at
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
      const user: User = response.data.me
      return user
    })
    .catch((error) => {
      console.log(error)
    })
}
