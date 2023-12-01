<template>
	<div>
		<!-- <v-grid
			theme="compact"
			:source="vgrid_rows"
			:columns="vgrid_columns"
			></v-grid>
		<hr> -->
		<vuetable ref="vuetable"
			:api-mode="false"
			:data="pages"
			:fields="vuetable_fields"
			data-path=""
			pagination-path=""
			></vuetable>
	</div>
</template>

<script>

// import Vue from 'vue/dist/vue.js'
// import { * } from '@revolist/revogrid'
// import VGrid from '@revolist/vue-datagrid'

import Vuetable from 'vuetable-2'
// import CssForBootstrap4 from './VuetableCssBootstrap4.js'

const props = {
}


const data = function() {
	let data = {}
	// data.css = CssForBootstrap4
	data.pages = []
	data.vuetable_fields = ['route', 'app_and_path_or_doc', 'extended', 'page', 'page_extended']

	// data.vgrid_columns = [
	// 	{
	// 	prop: "name",
	// 	name: "First",
	// 	},
	// 	{
	// 	prop: "details",
	// 	name: "Second",
	// 	},
	// ]
	// data.vgrid_rows = [
	// 	{
	// 	name: "1",
	// 	details: "Item 1",
	// 	},
	// 	{
	// 	name: "2",
	// 	details: "Item 2",
	// 	},
	// ]

	return data
}


const watch = {
}


const computed = {
}


const methods = {
	pagesLoad() {
		frappe.call('dfp_tools.dfp_tools.page.dfp_tools_sitemap.dfp_tools_sitemap.get_web_pages').then(r => {
			this.pages = []
			r.message.forEach((item, index) => {
				// item = [route:(string), page:(array)]
				// If several items in array, first one is the source extended and last one the active and rendered
				let page = item.page[item.page.length-1] // last one active and rendered
				this.pages.push({
					route: `<a href="/${item.route}">/${item.route}</a>`,
					// type: page.doctype && page.doc_name ? `<a href="${frappe.utils.get_form_link(page.doctype, page.doc_name)}">${page.doctype}</a>`: page.type,
					// app: page.app,
					extended: item.page.length > 1 ? item.page.length - 1 : '-',
					app_and_path_or_doc: page.type === 'file' ? page.path : (page.doctype && page.doc_name ? `<a href="${frappe.utils.get_form_link(page.doctype, page.doc_name)}">${page.doctype}</a>`: page.type),
					page: JSON.stringify(page),
					page_extended: item.page.length > 1 ? JSON.stringify(item.page[0]) : '',
				})
			})
		})
	},
}


const created = function() {
	this.pagesLoad()
	this.$root.$on('pages-load', () => {
		this.pagesLoad()
	})
}


const mounted = function() {
}


const components = {
	Vuetable,
	// VGrid,
}


export default {
	name: 'PagesList',
	props,
	data,
	watch,
	computed,
	methods,
	created,
	mounted,
	components,
}

</script>

<style lang="scss" scoped>
	// @import "../../../scss/variables.scss";
</style>

<style lang="scss">
	// @import "../../../scss/variables.scss";
	revo-grid {
		height: 50%;
	}
</style>
