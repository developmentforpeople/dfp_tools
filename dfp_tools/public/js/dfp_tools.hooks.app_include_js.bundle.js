frappe.provide('frappe.dfp')

import * as ECharts from 'echarts'
frappe.dfp.ECharts = ECharts

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// ElementPlus css loaded within dfp_tools/public/scss/dfp_tools.hooks.app_include_css.bundle.scss

import { Sitemap } from './classes/Sitemap'
frappe.dfp.Sitemap = new Sitemap()


import Page from './components/Page.vue'

frappe.dfp.apps_per_page = {}

function appCreateFactory(properties) {
	let page = frappe.router.current_route[0]

	if (frappe.dfp.apps_per_page[page]) {
		return frappe.dfp.apps_per_page[page]
	}

	const app = createApp(Page, properties || {})

	// app.use(ElementPlus, { size: 'small', zIndex: 3000 })
	app.use(ElementPlus, { })
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}

	app.config.globalProperties.__ = window.__
	app.config.globalProperties.frappe = window.frappe

	app.config.globalProperties.$dfp_main_component = null

	frappe.dfp.apps_per_page[page] = app
	return app
}

frappe.dfp.appCreate = properties => appCreateFactory(properties)

// frappe.router.on('change', () => {
// 	console.log('frappe.router.on change', frappe.router.current_route)
// })
