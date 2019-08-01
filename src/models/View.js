// @flow

import { observable, action } from 'mobx'

class View {
    @observable view = false;

    @action.bound
    toggle() {
        this.view = !this.view
    }
}

export default View