import { defineStore } from 'pinia'
// import {
// 	create_layout,
// 	scrub_field_names,
// 	load_doctype_model,
// 	section_boilerplate,
// } from "./utils";
// import { computed, nextTick, ref } from 'vue'
import { computed, ref } from 'vue'
// import { useDebouncedRefHistory, onKeyDown, useActiveElement } from "@vueuse/core";

export const useStore = defineStore('store-main', () => {
	// let doctype = ref("");
	// let frm = ref(null);
	// let pages = ref([])
	let routes = ref([])
	// let docfields = ref([]);
	// let custom_docfields = ref([]);
	// let form = ref({
	// 	layout: {},
	// 	active_tab: null,
	// 	selected_field: null,
	// });
	// let dirty = ref(false);
	// let read_only = ref(false);
	// let is_customize_form = ref(false);
	// let preview = ref(false);
	let routes_loading = ref(false)
	let counter = ref(1)
	// let drag = ref(false);
	// let get_animation = "cubic-bezier(0.34, 1.56, 0.64, 1)";
	// let ref_history = ref(null);

	// Getters
	let get_docfields = computed(() => {
		return is_customize_form.value ? custom_docfields.value : docfields.value
	})

	// let current_tab = computed(() => {
	// 	return form.value.layout.tabs.find((tab) => tab.df.name == form.value.active_tab);
	// });

	// const active_element = useActiveElement();
	// const not_using_input = computed(
	// 	() =>
	// 		active_element.value?.readOnly ||
	// 		active_element.value?.disabled ||
	// 		(active_element.value?.tagName !== "INPUT" &&
	// 			active_element.value?.tagName !== "TEXTAREA")
	// );

	// Actions
	function selected(name) {
		return form.value.selected_field?.name == name
	}

	// function get_df(fieldtype, fieldname = "", label = "") {
	// 	let docfield = is_customize_form.value ? "Customize Form Field" : "DocField";
	// 	let df = frappe.model.get_new_doc(docfield);
	// 	df.name = frappe.utils.get_random(8);
	// 	df.fieldtype = fieldtype;
	// 	df.fieldname = fieldname;
	// 	df.label = label;
	// 	is_customize_form.value && (df.is_custom_field = 1);
	// 	return df;
	// }

	// function has_standard_field(field) {
	// 	if (!is_customize_form.value) return;
	// 	if (!field.df.is_custom_field) return true;

	// 	let children = {
	// 		"Tab Break": "sections",
	// 		"Section Break": "columns",
	// 		"Column Break": "fields",
	// 	}[field.df.fieldtype];

	// 	if (!children) return false;

	// 	return field[children].some((child) => {
	// 		if (!child.df.is_custom_field) return true;
	// 		return has_standard_field(child);
	// 	});
	// }

	// function is_user_generated_field(field) {
	// 	return cint(field.df.is_custom_field && !field.df.is_system_generated);
	// }

	async function fetch() {
		routes_loading.value = true
		frappe.call('dfp_tools.dfp_tools.page.dfp_website_sitemap.dfp_website_sitemap.get_web_pages').then(r => {
			console.log('get_web_pages', r)
			// pages.value = []
			routes.value = []
			let i = 10
			r.message.forEach((item, index) => {
				// item = { route: 'search', page: [{ app: 'frappe', type: 'file', path: 'frappe/frappe/www/search.html', no_cache: 0, sitemap: 1, doctype: '', doc_name: '', doc_allow_guest_to_view: 0, doc_index_web_pages_for_search: 0, doc_is_published_field: '', doc_website_search_field: '', published: 1 }] }

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


				// // Subpages for active page
				// let subpages = []
				// item.page.forEach((subpage, subindex) => {
				// 	subpages.push({
				// 		id: i++,
				// 		label: `/${subpage.route}`,
				// 		children: [],

				// 		level: 2,
				// 		renderable_one: subindex === item.page.length - 1,
				// 		route: subpage.route,
				// 		app: subpage.app,
				// 		path: subpage.path,
				// 		no_cache: subpage.no_cache,
				// 		sitemap: subpage.sitemap,
				// 		doctype: subpage.doctype,
				// 		doc_name: subpage.doc_name,
				// 		doc_allow_guest_to_view: subpage.doc_allow_guest_to_view,
				// 		doc_index_web_pages_for_search: subpage.doc_index_web_pages_for_search,
				// 		doc_is_published_field: subpage.doc_is_published_field,
				// 		published: subpage.published,
				// 		doc_website_search_field: subpage.doc_website_search_field,
				// 		type: subpage.doctype && subpage.doc_name ? `<a href="${frappe.utils.get_form_link(subpage.doctype, subpage.doc_name)}">${subpage.doctype}</a>`: subpage.type,
				// 	})
				// })
				// pages.value.push({
				// 	id: i++,
				// 	label: `/${item.route}`,
				// 	children: subpages,

				// 	level: 1,
				// 	route: item.route,//`<a href="/${item.route}">/${item.route}</a>`,
				// 	type: '',//page_active.doctype && page_active.doc_name ? `<a href="${frappe.utils.get_form_link(page_active.doctype, page_active.doc_name)}">${page_active.doctype}</a>`: page_active.type,
				// 	app: '',//page_active.app,
				// })

				// data_source.value.push({
				// 	id: i++,
				// 	label: link,
				// 	children: [
				// 	// {
				// 	// 	id: 4,
				// 	// 	label: 'Level two 1-1',
				// 	// 	children: [
				// 	// 	{
				// 	// 		id: 9,
				// 	// 		label: 'Level three 1-1-1',
				// 	// 	},
				// 	// 	{
				// 	// 		id: 10,
				// 	// 		label: 'Level three 1-1-2',
				// 	// 	},
				// 	// 	],
				// 	// },
				// 	],
				// })

					// 'route': 'search'
					// 'app':
					// 'type': 'file'
					// 'path': 'frappe/frappe/www/search.html'
					// 'no_cache':
					// 'sitemap':
					// 'doctype':
					// 'doc_name':
					// 'doc_allow_guest_to_view':
					// 'doc_index_web_pages_for_search':
					// 'doc_is_published_field':
					// 'doc_website_search_field':

			})
			console.log('routes', routes.value)
			routes_loading.value = false
		})




		// if (doctype.value.startsWith("new-doctype-") && !doc.value.fields) {
		// 	doc.value.fields = [get_df("Data", "", __("Title"))];
		// }

		// if (!get_docfields.value.length) {
		// 	let docfield = is_customize_form.value ? "Customize Form Field" : "DocField";
		// 	if (!frappe.get_meta(docfield)) {
		// 		await load_doctype_model(docfield);
		// 	}
		// 	let df = frappe.get_meta(docfield).fields;
		// 	if (is_customize_form.value) {
		// 		custom_docfields.value = df;
		// 	} else {
		// 		docfields.value = df;
		// 	}
		// }

		// form.value.layout = get_layout();
		// form.value.active_tab = form.value.layout.tabs[0].df.name;
		// form.value.selected_field = null;

		// nextTick(() => {
		// 	if (!doctype.value.startsWith("new-doctype-")) {
		// 		dirty.value = false;
		// 		frm.value.doc.__unsaved = 0;
		// 		frm.value.page.clear_indicator();
		// 	}
		// 	read_only.value =
		// 		!is_customize_form.value && !frappe.boot.developer_mode && !doc.value.custom;
		// 	preview.value = false;
		// });

		// setup_undo_redo();
	}

	// let undo_redo_keyboard_event = onKeyDown(true, (e) => {
	// 	if (!ref_history.value) return;
	// 	if (frm.value.get_active_tab().label == "Form" && (e.ctrlKey || e.metaKey)) {
	// 		if (e.key === "z" && !e.shiftKey && ref_history.value.canUndo) {
	// 			ref_history.value.undo();
	// 		} else if (e.key === "z" && e.shiftKey && ref_history.value.canRedo) {
	// 			ref_history.value.redo();
	// 		}
	// 	}
	// });

	// function setup_undo_redo() {
	// 	ref_history.value = useDebouncedRefHistory(form, { deep: true, debounce: 100 });

	// 	undo_redo_keyboard_event;
	// }

	// function validate_fields(fields, is_table) {
	// 	fields = scrub_field_names(fields);
	// 	let error_message = "";

	// 	let has_fields = fields.some((df) => {
	// 		return !["Section Break", "Tab Break", "Column Break"].includes(df.fieldtype);
	// 	});

	// 	if (!has_fields) {
	// 		error_message = __("DocType must have atleast one field");
	// 	}

	// 	let not_allowed_in_list_view = ["Attach Image", ...frappe.model.no_value_type];
	// 	if (is_table) {
	// 		not_allowed_in_list_view = not_allowed_in_list_view.filter((f) => f != "Button");
	// 	}

	// 	function get_field_data(df) {
	// 		let fieldname = `<b>${df.label} (${df.fieldname})</b>`;
	// 		if (!df.label) {
	// 			fieldname = `<b>${df.fieldname}</b>`;
	// 		}
	// 		let fieldtype = `<b>${df.fieldtype}</b>`;
	// 		return [fieldname, fieldtype];
	// 	}

	// 	fields.forEach((df) => {
	// 		// check if fieldname already exist
	// 		let duplicate = fields.filter((f) => f.fieldname == df.fieldname);
	// 		if (duplicate.length > 1) {
	// 			error_message = __("Fieldname {0} appears multiple times", get_field_data(df));
	// 		}

	// 		// Link & Table fields should always have options set
	// 		if (in_list(["Link", ...frappe.model.table_fields], df.fieldtype) && !df.options) {
	// 			error_message = __(
	// 				"Options is required for field {0} of type {1}",
	// 				get_field_data(df)
	// 			);
	// 		}

	// 		// Do not allow if field is hidden & required but doesn't have default value
	// 		if (df.hidden && df.reqd && !df.default) {
	// 			error_message = __(
	// 				"{0} cannot be hidden and mandatory without any default value",
	// 				get_field_data(df)
	// 			);
	// 		}

	// 		// In List View is not allowed for some fieldtypes
	// 		if (df.in_list_view && in_list(not_allowed_in_list_view, df.fieldtype)) {
	// 			error_message = __(
	// 				"'In List View' is not allowed for field {0} of type {1}",
	// 				get_field_data(df)
	// 			);
	// 		}

	// 		// In Global Search is not allowed for no_value_type fields
	// 		if (df.in_global_search && in_list(frappe.model.no_value_type, df.fieldtype)) {
	// 			error_message = __(
	// 				"'In Global Search' is not allowed for field {0} of type {1}",
	// 				get_field_data(df)
	// 			);
	// 		}
	// 	});

	// 	return error_message;
	// }

	// function update_fields() {
	// 	if (!dirty.value && !frm.value.is_new()) return;

	// 	frappe.dom.freeze(__("Saving..."));

	// 	try {
	// 		let fields = get_updated_fields();
	// 		let has_error = validate_fields(fields, doc.value.istable);
	// 		if (has_error) return has_error;
	// 		frm.value.set_value("fields", fields);
	// 		return fields;
	// 	} catch (e) {
	// 		console.error(e);
	// 	} finally {
	// 		frappe.dom.unfreeze();
	// 	}
	// }

	// function get_updated_fields() {
	// 	let fields = [];
	// 	let idx = 0;
	// 	let new_field_name = is_customize_form.value
	// 		? "new-customize-form-field-"
	// 		: "new-docfield-";

	// 	let layout_fields = JSON.parse(JSON.stringify(form.value.layout.tabs));

	// 	layout_fields.forEach((tab, i) => {
	// 		if (
	// 			(i == 0 && is_df_updated(tab.df, get_df("Tab Break", "", __("Details")))) ||
	// 			i > 0
	// 		) {
	// 			idx++;
	// 			tab.df.idx = idx;
	// 			if (tab.df.__unsaved && tab.df.__islocal) {
	// 				tab.df.name = new_field_name + idx;
	// 			}
	// 			fields.push(tab.df);
	// 		}

	// 		tab.sections.forEach((section, j) => {
	// 			// data before section is added
	// 			let fields_copy = JSON.parse(JSON.stringify(fields));
	// 			let old_idx = idx;
	// 			section.has_fields = false;

	// 			// do not consider first section if label is not set
	// 			if ((j == 0 && is_df_updated(section.df, get_df("Section Break"))) || j > 0) {
	// 				idx++;
	// 				section.df.idx = idx;
	// 				if (section.df.__unsaved && section.df.__islocal) {
	// 					section.df.name = new_field_name + idx;
	// 				}
	// 				fields.push(section.df);
	// 			}

	// 			section.columns.forEach((column, k) => {
	// 				// do not consider first column if label is not set
	// 				if (
	// 					(k == 0 && is_df_updated(column.df, get_df("Column Break"))) ||
	// 					k > 0 ||
	// 					column.fields.length == 0
	// 				) {
	// 					idx++;
	// 					column.df.idx = idx;
	// 					if (column.df.__unsaved && column.df.__islocal) {
	// 						column.df.name = new_field_name + idx;
	// 					}
	// 					fields.push(column.df);
	// 				}

	// 				column.fields.forEach((field) => {
	// 					idx++;
	// 					field.df.idx = idx;
	// 					if (field.df.__unsaved && field.df.__islocal) {
	// 						field.df.name = new_field_name + idx;
	// 					}
	// 					fields.push(field.df);
	// 					section.has_fields = true;
	// 				});
	// 			});

	// 			// restore data back to data before section is added.
	// 			if (!section.has_fields) {
	// 				fields = fields_copy || [];
	// 				idx = old_idx;
	// 			}
	// 		});
	// 	});

	// 	return fields;
	// }

	// function is_df_updated(df, new_df) {
	// 	let df_copy = JSON.parse(JSON.stringify(df));
	// 	let new_df_copy = JSON.parse(JSON.stringify(new_df));
	// 	delete df_copy.name;
	// 	delete new_df_copy.name;
	// 	return JSON.stringify(df_copy) != JSON.stringify(new_df_copy);
	// }

	// function get_layout() {
	// 	return create_layout(doc.value.fields);
	// }

	// // Tab actions
	// function add_new_tab() {
	// 	let tab = {
	// 		df: get_df("Tab Break", "", "Tab " + (form.value.layout.tabs.length + 1)),
	// 		sections: [section_boilerplate()],
	// 	};

	// 	form.value.layout.tabs.push(tab);
	// 	activate_tab(tab);
	// }

	// function activate_tab(tab) {
	// 	form.value.active_tab = tab.df.name;
	// 	form.value.selected_field = tab.df;

	// 	// scroll to active tab
	// 	nextTick(() => {
	// 		$(".tabs .tab.active")[0]?.scrollIntoView({
	// 			behavior: "smooth",
	// 			inline: "center",
	// 			block: "nearest",
	// 		});
	// 	});
	// }

	return {
		// pages,
		routes_loading,
		routes,
		// counter,
		fetch,
		// form,
		// dirty,
		// read_only,
		// is_customize_form,
		// preview,
		// drag,
		// get_animation,
		// get_docfields,
		// current_tab,
		// not_using_input,
		// selected,
		// get_df,
		// has_standard_field,
		// is_user_generated_field,
		// fetch,
		// validate_fields,
		// update_fields,
		// get_updated_fields,
		// is_df_updated,
		// get_layout,
		// add_new_tab,
		// activate_tab,
	}
})
