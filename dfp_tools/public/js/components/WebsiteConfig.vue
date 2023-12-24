<template>
	<div class="dfp-website-sitemap-component">

		<h4>{{ __('site_config.json') }}</h4>

		<p>hola!</p>

	</div>
</template>


<!-- <script lang="ts" setup> -->
<script setup>

// import { ref, watch, computed } from 'vue'
import { onMounted, onUnmounted } from 'vue'

// const store = dfpWebsiteSitemapStore()
// store.fetch()


onMounted(async () => {
})
onUnmounted(() => {
})

// const data_url = '/assets/dfp_tools/les-miserables.json'

// async function loadData() {
// }

// const defaultProps = {
//   children: 'children',
//   label: 'label',
// }

// watch(filterText, (val) => {
//   treeRef.value.filter(val)
// })

// const search = ref('')
// const routes_filtered = computed(() =>
// 	store.routes.filter(data => {
// 		let searched_string = `${data.route_absolute} ${data.file_or_doctype}`.toLowerCase()
// 		return !search.value || searched_string.includes(search.value.toLowerCase())
// 	})
// )
// const handleEdit = (index, row) => {
// 	console.log(index, row)
// }
// const handleDelete = (index, row) => {
// 	console.log(index, row)
// }
// const scrollTo = selector => {
// 	frappe.utils.scroll_to($(selector), true, 30)
// }

</script>


<style lang="scss">
</style>

<style lang="scss" scoped>
</style>
