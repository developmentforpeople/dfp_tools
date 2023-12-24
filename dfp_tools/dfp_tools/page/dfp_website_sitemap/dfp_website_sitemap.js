
(function() {
	let page_name = 'dfp-website-sitemap'
	let page_title = __('DFP Website Sitemap')
	let page = null
	let app = null


	frappe.pages[page_name].on_page_load = on_page_load
	frappe.pages[page_name].on_page_show = on_page_show


	// Called each time page is shown (DOM loaded and visible)
	function on_page_show(wrapper) {
		let route = frappe.get_route()
		console.log('on_page_show', route)

		create_app(wrapper)
	}


	// Called first time page is loaded
	function on_page_load(wrapper) {
		let route = frappe.get_route()
		console.log('on_page_load', route)

		frappe.ui.make_app_page({
			parent: wrapper,
			title: page_title,
			single_column: true
		})
		// hot reload in development
		if (frappe.boot.developer_mode) {
			frappe.hot_update = frappe.hot_update || []
			frappe.hot_update.push(() => create_app(wrapper))
		}
	}


	function create_app(wrapper) {
		if (app) { return }
		// If no app, create it and mount it in "main-section"
		const $main_section = $(wrapper).find('.layout-main-section')
		$main_section.empty()

		// Page setup
		page = wrapper.page
		page.set_title(page_title)
		page.add_inner_button(__('Load pages'), routes_load)
		page.add_inner_button(__('Search index build'), index_build)

		// Main Vue app
		app = frappe.dfp.appCreate({ page_name: page_name })
		app.mount($main_section.get(0))
	}


	function routes_load() {
		frappe.dfp.Sitemap.fetch()
	}


	function index_build() {
		frappe.confirm(__('Este proceso tardará y te deslogueará automáticamente. Al terminar irás al login.'), () => {
			frappe.call({
				freeze: 1,
				freeze_message: __('Building search index...'),
				method: 'dfp_tools.dfp_tools.page.dfp_website_sitemap.dfp_website_sitemap.build_index_for_all_routes',
				// args: {},
				callback: r => {
					console.log(r)
				},
				error: () => {
				},
			})
		})
	}


})()
