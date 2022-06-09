import Vue from 'vue'
import Router from 'vue-router'
import routes from '../common/config/router';

Vue.use(Router)

export default new Router({
  routes
})
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
