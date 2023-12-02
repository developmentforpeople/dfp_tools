import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import { useStore } from './store'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import App from './App.vue'
import { registerGlobalComponents } from './globals.js'


class DFPWebsiteSitemap {
	constructor({ wrapper, page, website_sitemap}) {
		this.$wrapper = $(wrapper)
		this.page = page
		this.website_sitemap = website_sitemap

		// this.page.set_indicator('Beta', 'orange')

		this.init()
	}

	init() {
		this.page.set_title(__('DFP Website Sitemap'))
		this.setup_page_actions()
		this.setup_app()
	}

	setup_page_actions() {
	// 	// clear actions
	// 	this.page.clear_actions()
	// 	this.page.clear_menu()
	// 	this.page.clear_custom_actions()

		// setup page actions
		this.page.add_inner_button(__('Load pages'), () => {
			const store = useStore()
			store.fetch()
		})
		// 	this.primary_btn = this.page.set_primary_action(__('Save'), () =>
	// 		this.store.save_changes()
	// 	)

	// 	this.reset_changes_btn = this.page.add_button(__('Reset Changes'), () => {
	// 		this.store.reset_changes()
	// 	})

	// 	this.go_to_doctype_btn = this.page.add_menu_item(__('Go to Workflow'), () =>
	// 		frappe.set_route('Form', 'Workflow', this.workflow)
	// 	)
	}

	setup_app() {
		const pinia = createPinia()
		// let app = createApp(App, { website_sitemap: this.website_sitemap })
		const app = createApp(App)
		SetVueGlobals(app)
		// app.use(ElementPlus, { size: 'small', zIndex: 3000 })
		app.use(ElementPlus, { })
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			app.component(key, component)
		}
		app.use(pinia)
		registerGlobalComponents(app)

		this.$dfp_website_sitemap = app.mount(this.$wrapper.get(0))
	}

}

frappe.provide('frappe.ui')
frappe.ui.DFPWebsiteSitemap = DFPWebsiteSitemap
export default DFPWebsiteSitemap
