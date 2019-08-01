// @flow

import { observable, action } from 'mobx'

class CalendarArray {
    @observable calendarArray = {
    	0: true,
    	1: true,
    	2: true
    };

    @action.bound
    toggle0() {
        this.calendarArray[0] = !this.calendarArray[0]
    }
    @action.bound
    toggle1() {
        this.calendarArray[1] = !this.calendarArray[1]
    }
    @action.bound
    toggle2() {
        this.calendarArray[2] = !this.calendarArray[2]
    }
}

export default CalendarArray