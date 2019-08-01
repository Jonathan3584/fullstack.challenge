// @flow

import React, { Component } from 'react'
import { Provider, disposeOnUnmount } from 'mobx-react'

import updateAccount from 'lib/updateAccount'
import createAccount from 'lib/createAccount'
import createView from 'lib/createView'
import createCalendarArray from 'lib/createCalendarArray'
import runEvery from 'lib/runEvery'

import Agenda from './Agenda'

const REAL_TIME_UPDATES_INTERVAL = 10000

class Application extends Component {
  // Initialize an Account populated with random values
  account = createAccount()
  departmentView = createView()
  calendarArray = createCalendarArray()

  // Simulate real-time updates by updating random events properties
  // at pre-defined intervals
  cancelRealTimeUpdates = disposeOnUnmount(this,
    runEvery(REAL_TIME_UPDATES_INTERVAL, () => {
      try {
        updateAccount(this.account)
      }
      catch (e) {
        console.error(e)
      }
    }),
  )

  render () {
    return (
      <Provider account={this.account} 
        departmentView={this.departmentView}
        calendarArray={this.calendarArray}>
        <Agenda />
      </Provider>
    )
  }
}

export default Application
