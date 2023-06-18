<template>
	<div>
		<table>
			<!-- api-url="https://vuetable.ratiw.net/api/users" -->
			<vuetable ref="vuetable"
				:api-mode="false"
				:data="pages"
				:fields="['route', 'app', 'doctype', 'overrided', 'type', 'page']"
				:css="css"
				data-path=""
				pagination-path=""
			></vuetable>
	</div>
</template>

<script>


import Vuetable from 'vuetable-2'
// import CssForBootstrap4 from './VuetableCssBootstrap4.js'

const props = {
}


const data = function() {
	let data = {}
	// data.css = CssForBootstrap4
	data.pages = []
	return data
}


const watch = {
}


const computed = {
}


const methods = {
	pagesLoad() {
		frappe.call('dfp_tools.dfp_tools.page.dfp_tools_sitemap.dfp_tools_sitemap.get_web_pages').then(r => {
			r.message.forEach((item, index) => {
				let page = item.page[item.page.length-1]
				this.pages.push({
					route: `/${item.route}`,
					app: page.app,
					doctype: page.doctype,
					overrided: item.page.length ? item.page.length : '',
					type: page.type,
					page: JSON.stringify(page),
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
</style>
