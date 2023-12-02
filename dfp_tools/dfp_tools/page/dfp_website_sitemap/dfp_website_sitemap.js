frappe.pages['dfp-website-sitemap'].on_page_load = function(wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: __('DFP Website Sitemap'),
		single_column: true
	})

	// hot reload in development
	if (frappe.boot.developer_mode) {
		frappe.hot_update = frappe.hot_update || []
		frappe.hot_update.push(() => load_website_sitemap(wrapper))
	}
}


frappe.pages['dfp-website-sitemap'].on_page_show = function(wrapper) {
	load_website_sitemap(wrapper)
}


async function load_website_sitemap(wrapper) {
	let route = frappe.get_route()
	let $parent = $(wrapper).find('.layout-main-section')

	if (frappe.dfp_website_sitemap) {
		// Refresh data ???
	} else {
		$parent.empty()

		let assets = []
		assets.push('dfp_website_sitemap.bundle.js')
	
		await frappe.require(assets)
		frappe.dfp_website_sitemap = new frappe.ui.DFPWebsiteSitemap({
			wrapper: $parent,
			page: wrapper.page,
			website_sitemap: route[1],
		})
	}
}
