
import App from './App.vue'

class DFPToolsSitemap {
	constructor(wrapper) {
		this.page = frappe.ui.make_app_page({
			parent: wrapper,
			title: __('DFP Website Sitemap'),
			single_column: true,
		})

		this.page.body.append('<div id="dfp-vue3-app"></div>')

		this.app = new Vue({
			el: '#dfp-vue3-app',
			render: h => h(App),
		})

		this.filters()

		this.buttons()

		this.show()
	}

	show() {
		console.log('DFPToolsSitemap->show()')
		// Not colled first time!!!

	}

	buttons() {
		this.page.add_inner_button(__('Load pages'), () => {
			this.app.$root.$emit('pages-load')
		})
	}

	filters() {
		this.view = this.page.add_field({
			label: __("View"),
			fieldname: "view",
			fieldtype: "Select",
			options: ["Jobs", "Workers"],
			default: "Jobs",
			change: () => {
				alert('change!')
				// this.queue_timeout.toggle(this.view.get_value() === "Jobs");
				// this.job_status.toggle(this.view.get_value() === "Jobs");
			},
		})
		this.auto_refresh = this.page.add_field({
			label: __("Auto Refresh"),
			fieldname: "auto_refresh",
			fieldtype: "Check",
			default: 1,
			change: () => {
				alert('cambia!')
				// if (this.auto_refresh.get_value()) {
				// 	// this.refresh_jobs();
				// }
			},
		})
	}
}

frappe.provide('DFP.tools.Sitemap')
DFP.tools.Sitemap = DFPToolsSitemap
