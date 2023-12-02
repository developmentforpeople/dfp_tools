import { defineStore } from 'pinia'
// import {
// 	create_layout,
// 	scrub_field_names,
// 	load_doctype_model,
// 	section_boilerplate,
// } from "./utils";
// import { computed, nextTick, ref } from 'vue'
import { ref } from 'vue'
// import { useDebouncedRefHistory, onKeyDown, useActiveElement } from "@vueuse/core";


export const useStore = defineStore('store-main', () => {
	let routes = ref([])
	let routes_loading = ref(false)

	// Getters
	// let get_docfields = computed(() => {
	// 	return is_customize_form.value ? custom_docfields.value : docfields.value
	// })

	// Actions
	async function fetch() {
		routes_loading.value = true
		frappe.call('dfp_tools.dfp_tools.page.dfp_website_sitemap.dfp_website_sitemap.get_web_pages').then(r => {
			console.log('get_web_pages', r)
			routes.value = []
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
				routes.value.push(page_active)
			})
			console.log('routes', routes.value)
			routes_loading.value = false
		})
	}


	return {
		routes_loading,
		routes,
		fetch,
	}
})
