<template>
	<div class="dfp-tools-app">
		<WebsiteSitemap v-if="properties.page_name=='dfp-website-sitemap'"/>
		<WebsiteConfig v-else-if="properties.page_name=='dfp-website-config'"/>
		<template v-else>
			<el-empty :description="__('Nothing to show yet 🙃')" />
		</template>
	</div>
</template>


<script setup>

import WebsiteSitemap from './WebsiteSitemap.vue'
import WebsiteConfig from './WebsiteConfig.vue'


const properties = defineProps({
	page_name: String,
})

</script>


<style lang="scss">
// @import 'element-plus/dist/index.css';
</style>

<style lang="scss" scoped>
</style>
