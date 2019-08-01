// @flow

import React, { Component } from 'react'
import { DateTime } from 'luxon'
import { computed } from 'mobx'
import { observer, inject } from 'mobx-react'

import greeting from 'lib/greeting'

import type Account from 'src/models/Account'
import type View from 'src/models/View'
import type CalendarArray from 'src/models/CalendarArray'

import List from './List'
import EventCell from './EventCell'

import style from './style'

/**
 * Agenda component
 * Displays greeting (depending on time of day)
 * and list of calendar events
 */

  /**
   * Returns formatted List divs of calendar/event objects
   * Returns XML to be rendered
   */
   const format = (obj) => {
    return (
      <div>
        {obj.department != 'undefined' && <div className={style.header}>{obj.department}</div>}
        {obj.department == 'undefined' && <div className={style.header}>No Department Assigned</div>}
        <List>
          {obj.events.sort((a, b) => (a.event.date.diff(b.event.date).valueOf()))
            .map(({ calendar, event }) => (
              <EventCell key={event.id} calendar={calendar} event={event} />
            ))}
        </List>
      </div>)
  }

type tProps = {
  account: Account,
  departmentView: View,
  calendarArray: CalendarArray
}

@inject('account')
@inject('departmentView')
@inject('calendarArray')
@observer
class Agenda extends Component<tProps> {
  /**
   * Return events from all calendars, sorted by date-time.
   * Returned objects contain both Event and corresponding Calendar
   */
  @computed
  get events (): Array<{ calendar: Calendar, event: Event }> {
    var selectedCalendars = []
    Object.keys(this.props.calendarArray.calendarArray).map((calendar) => (
      this.props.calendarArray.calendarArray[calendar] &&
        selectedCalendars.push(this.props.account.calendars[parseInt(calendar)])
      ))
    const events = selectedCalendars
      .map((calendar) => (
        calendar.events.map((event) => (
          { calendar, event }
        ))
      ))
      .flat()

    // Sort events by date-time, ascending
    events.sort((a, b) => (a.event.date.diff(b.event.date).valueOf()))

    return events
  }
  /**
   * Return events from all calendars, sorted by department.
   * Returned objects contain department label and array of calendar/event objects
   */
  @computed
  get eventsByDepartment (): Array<{ department: Department, events: Events }> {
    const eventsByDepartment = []
    const eventsByDeptObject = {}
    this.props.account.calendars
      .map((calendar) => {
        calendar.events.forEach((event) => {
          if (!eventsByDeptObject[event.department]) {
            eventsByDeptObject[event.department] = []
          }
        return eventsByDeptObject[event.department].push({ event: event, calendar: calendar })
        })
      })

    Object.keys(eventsByDeptObject).forEach((department) => {
      return eventsByDepartment.push({
        department: department,
        events: eventsByDeptObject[department]
      })
    })

    return eventsByDepartment
  }

  render () {

    return (
      <div className={style.outer}>
        <div className={style.container}>

          <div className={style.header}>
            <span className={style.title}>
              {greeting(DateTime.local().hour)}
            </span>
          </div>

          {!this.props.departmentView.view && <div>
              <div className={style.wrapper}>
                <div
                  className={style.deptview}
                  onClick={this.props.departmentView.toggle}>Sort Events by Department</div>
                
                <div className={style.menu}>
                  <div className={style.cals}>Select Calendars to Include</div>
                  <div>Calendar 1: <input type="checkbox" onChange={this.props.calendarArray.toggle0} defaultChecked={true}/></div>
                  <div>Calendar 2: <input type="checkbox" onChange={this.props.calendarArray.toggle1} defaultChecked={true}/></div>
                  <div>Calendar 3: <input type="checkbox" onChange={this.props.calendarArray.toggle2} defaultChecked={true}/></div>
                </div>
              </div>
              <List>
              {this.events.map(({ calendar, event }) => (
                <EventCell key={event.id} calendar={calendar} event={event} />
              ))}
            </List>
          </div>}

          {this.props.departmentView.view && <div>
              <div
              className={style.deptview}
              onClick={this.props.departmentView.toggle}>Show Events Chronologically</div>
              <List>
              {this.eventsByDepartment.map(({ department, events }) => (
                format({ department: department, events: events })
              ))}
            </List>
          </div>}

        </div>
      </div>
    )
  }
}

export default Agenda
