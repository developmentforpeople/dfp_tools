
class DFPWebsiteSitemap {
	constructor({ wrapper, page, website_sitemap}) {
		this.$wrapper = $(wrapper)
		this.page = page
		this.website_sitemap = website_sitemap

		// this.page.set_indicator('Beta', 'orange')
		this.app_mounted = false
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
			frappe.dfp.store.fetch()
		})
		this.page.add_inner_button(__('Search index build'), () => {
			frappe.confirm(__('Este proceso tardará y te deslogueará automáticamente. Al terminar irás al login.'), () => {
				frappe.call({
					freeze: 1,
					freeze_message: __('Building search index...'),
					method: 'dfp_tools.dfp_tools.page.dfp_website_sitemap.dfp_website_sitemap.build_index_for_all_routes',
					// args: {},
					callback: r => {
						console.log(r)
						// if (r.message.status === "ok") {
						// 	this.post_setup_success();
						// } else if (r.message.status === "registered") {
						// 	this.update_setup_message(__("starting the setup..."));
						// } else if (r.message.fail !== undefined) {
						// 	this.abort_setup(r.message.fail);
						// }
					},
					error: () => {
					},
				})
			})

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
		let app = frappe.dfp.app()
		app.config.globalProperties.$dfp_main_component = 'website_sitemap'
		app.mount(this.$wrapper.get(0))
	}

}

frappe.provide('frappe.ui')
frappe.ui.DFPWebsiteSitemap = DFPWebsiteSitemap
export default DFPWebsiteSitemap
