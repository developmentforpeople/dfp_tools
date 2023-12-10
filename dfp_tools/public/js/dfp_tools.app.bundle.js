frappe.provide('frappe.dfp')

import * as ECharts from 'echarts'
frappe.dfp.ECharts = ECharts

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// ElementPlus css loaded within App.vue
import { createPinia } from 'pinia'
import { dfpWebsiteSitemapStore } from './website_sitemap_store.js'


import App from './App.vue'

let app_created = null

function appCreateFactory() {
	// let app = createApp(App, { website_sitemap: this.website_sitemap })
	const app = createApp(App)
	// SetVueGlobals(app)

	// app.use(ElementPlus, { size: 'small', zIndex: 3000 })
	app.use(ElementPlus, { })
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}

	// // TODO: jaime revisa si este registerglobalcomponents tiene más sentido que lo de abajo :)
	// registerGlobalComponents(app)

	app.config.globalProperties.__ = window.__
	app.config.globalProperties.frappe = window.frappe

	app.config.globalProperties.$dfp_main_component = null

	const pinia = createPinia()
	app.use(pinia)

	// Our stores
	frappe.dfp.website_sitemap_store = dfpWebsiteSitemapStore()

	if (app_created) {
		app_created.unmount()
	}
	app_created = app
	return app
}

// frappe.router.on('change', () => {
// 	console.log('frappe.router.on change', frappe.router.current_route)
// })

frappe.dfp.appCreate = () => appCreateFactory()
