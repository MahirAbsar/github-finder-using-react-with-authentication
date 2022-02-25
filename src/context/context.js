import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()
//Provider , Consumer
// GithubContext.Provider,....Consumer
const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [githubRepos, setGithubRepos] = useState(mockRepos)
  const [githubFollowers, setGithubFollowers] = useState(mockFollowers)
  const [request, setRequest] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ show: false, msg: '' })
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        const {
          rate: { remaining },
        } = data
        setRequest(remaining)
        if (remaining === 0) {
          toggleError(true, 'Sorry, you have exceeded your hourly rate limit!')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const searchGithubUser = async (user) => {
    toggleError()
    // setLoading
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) => {
      console.log(err)
    })
    console.log(response)
    if (response) {
      setGithubUser(response.data)
    } else {
      toggleError(true, 'there is no user with that username')
    }
  }

  function toggleError(show = false, msg = '') {
    setError({
      show: show,
      msg: msg,
    })
  }

  useEffect(() => {
    checkRequests()
  }, [])
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        githubFollowers,
        githubRepos,
        request,
        error,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}
export { GithubProvider, GithubContext }
