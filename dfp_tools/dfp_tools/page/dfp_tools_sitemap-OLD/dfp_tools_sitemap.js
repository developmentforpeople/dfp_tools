
frappe.pages['dfp-tools-sitemap'].on_page_load = async wrapper => {
	await frappe.require([
		'dfp_tools_sitemap_controller.bundle.js'
	])

	const dfp_tools_sitemap = new DFP.tools.Sitemap(wrapper)

	$(wrapper).bind('show', async () => {
		dfp_tools_sitemap.show()
	})
}
