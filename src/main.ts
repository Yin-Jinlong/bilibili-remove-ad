import {createApp} from 'vue'

import App from './App.vue'
import './style.scss'

let element = document.querySelector('[data-v-bili-app]')
if (!element) {
    element = document.createElement('div')
    element.setAttribute('data-v-bili-app', '')
    document.body.append(element)
    let app = createApp(App)
    app.mount(element)
}
