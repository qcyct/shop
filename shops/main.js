import Vue from 'vue'
import App from './App'
import tuiIcon from "@/components/icon/icon";
import tuiTabs from "@/components/tui-tabs/tui-tabs";
import tuiButton from "@/components/button/button";
import tuiDrawer from "@/components/drawer/drawer";
import tuiLoadmore from "@/components/loadmore/loadmore";
import tuiNomore from "@/components/nomore/nomore";
import tuiListCell from "@/components/list-cell/list-cell";
import tuiSticky from "@/components/sticky/sticky";
import tuiTag from "@/components/tag/tag"
import tuiBadge from "@/components/badge/badge"
import tuiTopDropdown from "@/components/top-dropdown/top-dropdown"
import tuiBottomPopup from "@/components/bottom-popup/bottom-popup"
import tuiNumberbox from "@/components/numberbox/numberbox"
import tuiCountdown from "@/components/countdown/countdown"

import * as Api from './config/api.js';
import * as Common from './config/common.js';
import * as Db from './config/db.js';
import * as Config from './config/config.js';
import store from './store'


Vue.config.productionTip = false
Vue.prototype.$api = Api;
Vue.prototype.$common = Common;
Vue.prototype.$db = Db;
Vue.prototype.$config = Config;
Vue.prototype.$store = store;

Vue.component('tui-icon', tuiIcon);
Vue.component('tui-list-cell', tuiListCell);
Vue.component('tui-tabs', tuiTabs);
Vue.component('tui-button', tuiButton);
Vue.component('tui-loadmore', tuiLoadmore);
Vue.component('tui-sticky', tuiSticky);
Vue.component('tui-drawer', tuiDrawer);
Vue.component('tui-nomore', tuiNomore);
Vue.component('tui-tag', tuiTag);
Vue.component('tui-badge', tuiBadge);
Vue.component('tui-top-dropdown', tuiTopDropdown);
Vue.component('tui-bottom-popup', tuiBottomPopup);
Vue.component('tui-numberbox', tuiNumberbox);
Vue.component('tui-countdown', tuiCountdown);

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
