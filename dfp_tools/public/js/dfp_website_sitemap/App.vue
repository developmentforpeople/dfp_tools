<template>
	<div class="dfp-website-sitemap-app" v-loading="store.routes_loading">

		<el-table
			:data="filterTableData"
			style="width: 100%"
			border
			default-expand-all
		>
			<el-table-column prop="route_absolute" label="Path" sortable>
				<template #default="scope">
					<el-link icon="link" :href="scope.row.route_absolute">
						{{ scope.row.route_absolute }}
					</el-link>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="sitemap" label="sitemap" sortable /> -->
			<el-table-column prop="file_or_doctype" label="File or entry" sortable>
				<!-- width="130" fixed="right" -->
				<template #default="scope">
					<el-link v-if="scope.row.doctype"
						icon="link"
						type="primary"
						size="small"
						:href="scope.row.edit"
						:title="scope.row.doc_name"
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
console.log('DFP Website Sitemap: App.vue loaded')

import { ref, watch, computed } from 'vue'
import { useStore } from './store'

const store = useStore()
store.fetch()

// const defaultProps = {
//   children: 'children',
//   label: 'label',
// }

// watch(filterText, (val) => {
//   treeRef.value.filter(val)
// })

const search = ref('')
const filterTableData = computed(() =>
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

</script>


<style lang="scss">
@import 'element-plus/dist/index.css';
</style>

<style lang="scss" scoped>
</style>
