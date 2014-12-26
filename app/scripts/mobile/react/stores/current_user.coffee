_         = require 'underscore'
BaseStore = require './_base'

_currentUser = null

extendByMockData = (user) ->
  # Some mock data for better development process
  if localStorage?.getItem('userLogged') is 'true'
    if localStorage.getItem 'userToken'
      user.api_key.access_token = localStorage.getItem 'userToken'

    if localStorage.getItem 'userId'
      user.id = parseInt localStorage.getItem('userId')

  user

CurrentUserStore = _.extend new BaseStore(),

  initialize: (user) ->
    if user?
      user         = extendByMockData user
      _currentUser = user

      console.debug? 'Залогинен пользователь:', user.slug
    else
      console.debug? 'Без пользователя'

  isLogged: ->
    currentUser?

  getUser: ->
    _currentUser

  getAccessToken: ->
    _currentUser.api_key.access_token

module.exports = CurrentUserStore