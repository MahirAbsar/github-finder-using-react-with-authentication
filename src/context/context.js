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
    setIsLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) => {
      console.log(err)
    })
    if (response) {
      setGithubUser(response.data)
      const { login, followers_url } = response.data
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results
          const status = 'fulfilled'
          if (repos.status === status) {
            setGithubRepos(repos.value.data)
          }
          if (followers.status === status) {
            setGithubFollowers(followers.value.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      toggleError(true, 'there is no user with that username')
    }
    checkRequests()
    setIsLoading(false)
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
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}
export { GithubProvider, GithubContext }
