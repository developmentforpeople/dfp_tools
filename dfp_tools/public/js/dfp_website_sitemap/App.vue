<template>

	<!-- <pre>{{ store }}</pre>

	<pre>{{ store.pages }}</pre> -->

	<el-empty v-if="!store.pages.length" description="No pages to show :)" />

	<div v-else>
		<el-input v-model="filterText" placeholder="Filter keyword" />

		<el-tree
			ref="treeRef"
			class="filter-tree"
			:data="store.pages"
			show-checkbox
			node-key="id"
			:props="defaultProps"
			default-expand-all
			:filter-node-method="filterNode"
			:expand-on-click-node="false"
		>
			<template #default="{ node, data }">
				<span v-if="data.level==1">
					/{{ data.route }}
					<el-icon><Link /></el-icon>
				</span>
				<span v-if="data.level==2">
					<el-text :tag="!data.renderable_one ? 'del' : 'span'">
						<!-- <span>{{ node.label }}</span> -->
						<span>
							<span v-if="data.app"><strong>{{ data.app }}</strong></span>
							<span v-if="data.doctype">[{{ __(data.doctype) }}]</span>
							<span v-if="data.app_and_path_or_doc" v-html="data.app_and_path_or_doc"></span>
							<!-- &nbsp; &nbsp;|&nbsp; &nbsp; <a @click="append(data)"> Append </a>
							<a style="margin-left: 8px" @click="remove(node, data)"> Delete </a> -->
						</span>
					</el-text>
				</span>
			</template>
		</el-tree>

	</div>

</template>


<!-- <script lang="ts" setup> -->
<script setup>
console.log('DFP Website Sitemap: App.vue loaded')

import { useStore } from './store'

let store = useStore()

// import { ref } from 'vue'


import { ref, watch } from 'vue'
import { ElTree } from 'element-plus'

// interface Tree {
//   [key: string]: any
// }

const filterText = ref('')
const treeRef = ref()

const defaultProps = {
  children: 'children',
  label: 'label',
}

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

const filterNode = (value, page) => {
  if (!value) return true
  return page.label.includes(value)
}


store.fetch()


let id = 1000
const append = (data) => {
	const newChild = { id: id++, label: 'testtest', children: [] }
	if (!data.children) {
		data.children = []
	}
	data.children.push(newChild)
	store.pages.value = [...store.pages.value]
}

const remove = (node, data) => {
	const parent = node.parent
	const children = parent.data.children || parent.data
	const index = children.findIndex((d) => d.id === data.id)
	children.splice(index, 1)
	store.pages.value = [...store.pages.value]
}

// const handleClick = () => {
//   console.log('Botón clickeado')
// }

</script>


<style lang="scss">
// @import 'dfp_tools/public/js/libs/element-plus@2.4.3--dist--index.css';
// @import '@element-plus/dist/index.css';
</style>

<style lang="scss" scoped>

</style>
