
frappe.query_reports["DFP Website Routes"] = {
	"filters": [
		{
			"fieldname": "guest_access",
			"label": __("Guest Access"),
			"fieldtype": "Select",
			"options": "\nPublic\nPrivate",
			"default": ""
		},
		{
			"fieldname": "type",
			"label": __("Type"),
			"fieldtype": "Select",
			"options": "\nfile\ndoctype\napi\nredirect",
			"default": ""
		},
		{
			"fieldname": "doctype",
			"label": __("DocType"),
			"fieldtype": "Link",
			"options": "DocType",
			"get_query": function() {
				return {
					"doctype": "DocType",
					"filters": {
						"has_web_view": 1,
					}
				}
			}
		},
	]
}
