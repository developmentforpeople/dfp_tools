<template>
	<div class="dfp-website-sitemap-component" v-loading="store.routes_loading">

		<h4>{{ __('Found {} routes', [store.routes.length]) }}</h4>

		<div ref="chartContainer" style="width: 100%; height: 500px;"></div>
		<hr>

		<el-table
			:data="routes_filtered"
			style="width: 100%"
			size="small"
			border
			default-expand-all
		>
			<el-table-column prop="route_absolute" label="Path" sortable>
				<template #default="scope">
					<el-link
						:id="`page-${scope.row.route_absolute.substring(1)}`"
						icon="link"
						:href="scope.row.route_absolute"
						target="_blank"
					>{{ scope.row.route_absolute }}</el-link>

				<template v-if="scope.row.redirected_301">
					<el-tooltip :content="__('This page has a 301 redirect to {0}', [scope.row.redirected_301])">
						<el-check-tag class="ml-2"
							checked
							type="info"
							size="small"
							effect="plain"
							@click.native.prevent="scrollTo(`#page-${scope.row.redirected_301.substring(1)}`)"
						>301: {{ scope.row.redirected_301 }}</el-check-tag>

						<!-- <el-link
							icon="aim"
							@click.native.prevent="scrollTo(`#page-${scope.row.redirected_301.substring(1)}`)"
						>301: {{ scope.row.redirected_301 }}</el-link> -->

					</el-tooltip>
				</template>

				</template>
			</el-table-column>
			<!-- <el-table-column prop="sitemap" label="sitemap" sortable /> -->
			<el-table-column prop="file_or_doctype" label="File or document" sortable>
				<!-- width="130" fixed="right" -->
				<template #default="scope">
					<el-link v-if="scope.row.doctype"
						icon="link"
						type="primary"
						size="small"
						:title="scope.row.doc_name"
						@click.native.prevent="frappe.set_route('Form', scope.row.doctype, scope.row.doc_name)"
					>
					<!-- <el-icon><Link /></el-icon> -->
					{{ __(scope.row.doctype) }}</el-link>
					<span v-else>
						{{ scope.row.path }}
						<span v-for="p, k in scope.row.overrides">
							<br>
							<el-tooltip :content="__('Overrided file #{0}', [k])">
								<del>{{ p.path }}</del>
							</el-tooltip>
						</span>
					</span>
				</template>
			</el-table-column>

			<el-table-column align="right">
				<template #header>
					<el-input v-model="search" size="small" placeholder="Type to search" />
				</template>
				<template #default="scope">
					<el-button
						size="small"
						@click="handleEdit(scope.$index, scope.row)"
					>Edit</el-button>
					<el-button
						size="small"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)"
					>Delete</el-button>
				</template>
			</el-table-column>

		</el-table>

	</div>
</template>


<!-- <script lang="ts" setup> -->
<script setup>

import { ref, watch, computed } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { dfpWebsiteSitemapStore } from './website_sitemap_store.js'

const store = dfpWebsiteSitemapStore()
store.fetch()


const chartContainer = ref(null)
let myChart = null
onMounted(async () => {
	if (chartContainer.value !== null) {
		myChart = frappe.dfp.ECharts.init(chartContainer.value)
		myChart.showLoading()
		await loadData()
		myChart.hideLoading()


		function onChartClick(params) {
			console.log('echart clicked: ', params)
			// if (params.componentType === 'series') {
			// 	const url = 'https://example.com/' + encodeURIComponent(params.name)
			// 	window.open(url, '_blank')
			// }
		}
		myChart.on('click', onChartClick)


	}
	window.addEventListener('resize', () => {
		myChart.resize()
	})
})
onUnmounted(() => {
	window.removeEventListener('resize', () => {
		myChart.resize()
	})
})

const data_url = '/assets/dfp_tools/les-miserables.json'

async function loadData() {
	const response = await fetch(data_url)
	let graph = await response.json()
	let option = {
		tooltip: {},
		legend: [
		{
			data: graph.categories.map(a => {
				return a.name
			})
		}
		],
		series: [
		{
			name: 'Les Miserables',
			type: 'graph',
			layout: 'none',
			data: graph.nodes,
			links: graph.links,
			categories: graph.categories,
			roam: true,
			label: {
				show: true,
				position: 'right',
				formatter: '{b}'
			},
			labelLayout: {
				hideOverlap: true
			},
			scaleLimit: {
				min: 0.4,
				max: 2
			},
			lineStyle: {
				color: 'source',
				curveness: 0.3
			}
		}
		]
	}
	myChart.setOption(option)

	option && myChart.setOption(option)
}


// const defaultProps = {
//   children: 'children',
//   label: 'label',
// }

// watch(filterText, (val) => {
//   treeRef.value.filter(val)
// })

const search = ref('')
const routes_filtered = computed(() =>
	store.routes.filter(data => {
		let searched_string = `${data.route_absolute} ${data.file_or_doctype}`.toLowerCase()
		return !search.value || searched_string.includes(search.value.toLowerCase())
	})
)
const handleEdit = (index, row) => {
	console.log(index, row)
}
const handleDelete = (index, row) => {
	console.log(index, row)
}
const scrollTo = selector => {
	frappe.utils.scroll_to($(selector), true, 30)
}

</script>


<style lang="scss">
</style>

<style lang="scss" scoped>
</style>
