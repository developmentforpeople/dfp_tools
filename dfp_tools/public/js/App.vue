<template>
	<div class="dfp-tools-app">

		<WebsiteSitemap v-if="$dfp_main_component=='website_sitemap'"/>
		<template v-else>
			<el-empty :description="__('Nothing to show yet 🙃')" />
		</template>

	</div>
</template>


<script setup>

import { getCurrentInstance } from 'vue'
// import { ref, watch, computed } from 'vue'
// import { onMounted, onUnmounted, toRefs } from 'vue'

import WebsiteSitemap from './WebsiteSitemap.vue'

const $dfp_main_component = getCurrentInstance().appContext.config.globalProperties.$dfp_main_component

</script>


<style lang="scss">
@import 'element-plus/dist/index.css';
a.el-link {
	i.el-icon {
		margin-right: 4px;
	}
	&:hover {
		text-decoration: none !important;
	}
}
</style>

<style lang="scss" scoped>
</style>
