import Vue from 'vue'
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  breakpoints: {
    sm: 600,
    md: 1250,

  },
  defaultBreakpoint: 'sm'  
})

export default VueMq;