
import { Model } from './Model'


export {
	Sitemap,
}


class Sitemap extends Model {
	constructor() {
		super()
		this._model_properties = ['routes']
		this._routes = []
	}

	get routes() {
		return this._routes
	}
	set routes(routes) {
		this._routes = routes
		this.propertyChanged('routes')
	}

	fetch() {
		this.loading = true

		let method = 'dfp_tools.dfp_tools.page.dfp_website_sitemap.dfp_website_sitemap.get_web_pages'
		let args = {}
		this.newFrappeCallPromisedAndCached(method, args, false).then(r => {
			let routes = []
			r.message.forEach((item, index) => {
				// If several items in array, first one is the source extended and last one the active and rendered
				let page_active = item.page[item.page.length - 1]

				if (item.page.length > 1) {
					page_active.overrides = [...item.page]
					// remove last item
					page_active.overrides.pop()
					// reverse order
					page_active.overrides.reverse()
				}

				console.log(page_active)
				routes.push(page_active)
			})
			this.routes = routes
			this.loading = false
		})
	}
}
