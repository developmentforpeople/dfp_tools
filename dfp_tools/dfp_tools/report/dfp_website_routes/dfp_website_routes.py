
import frappe
from frappe import _
from dfp_tools.dfp_tools.page.dfp_website_sitemap.dfp_website_sitemap import get_web_pages


def execute(filters):
	filters = frappe._dict(filters or {})
	if "guest_access" in filters and filters["guest_access"]:
		filters["guest_access"] = 1 if filters["guest_access"] == "Public" else 0

	message = ""
	chart = None
	report_summary = None
	columns = get_columns(filters)
	data = get_data(filters)

	return columns, data, message, chart, report_summary


def get_columns(filters):
	return [
		{
			"fieldname": "is_public",
			"label": _("Is public"),
			"fieldtype": "Check",
			"options": "",
			"width": 80,
		},
		# {
		# 	"fieldname": "route",
		# 	"label": _("Route"),
		# 	"fieldtype": "Data",
		# 	"width": 200,
		# },
		{
			"fieldname": "route_absolute",
			"label": _("Route absolute"),
			"fieldtype": "Data",
			"width": 200,
		},
		{
			"fieldname": "path",
			"label": _("App file path"),
			"fieldtype": "Data",
			"width": 200,
		},
		{
			"fieldname": "override",
			"label": _("Overrided"),
			"fieldtype": "Data",
			"width": 120,
		},
		{
			"fieldname": "redirected_301",
			"label": _("Redirected 301"),
			"fieldtype": "Data",
			"width": 120,
		},
		{
			"fieldname": "app",
			"label": _("App"),
			"fieldtype": "Data",
			"width": 80,
		},
		{
			"fieldname": "type",
			"label": _("Type"),
			"fieldtype": "Data",
			"width": 80,
		},
		{
			"fieldname": "doctype",
			"label": _("DocType"),
			"fieldtype": "Link",
			"options": "DocType",
			"width": 120,
		},
		{
			"fieldname": "doc_name",
			"fieldtype": "Dynamic Link",
			"label": "Doc",
			"options": "doctype",
			"width": 120,
		},
	]


def get_data(filters):
	rows = []
	for item in get_web_pages():
		# If several items in array, first one is the source extended and last one the active and rendered
		page_active = item["page"][len(item["page"]) - 1]

		if "guest_access" in filters and page_active["is_public"] != filters["guest_access"]:
			continue
		if "doctype" in filters and page_active["doctype"] != filters["doctype"]:
			continue
		if "type" in filters and page_active["type"] != filters["type"]:
			continue

		if len(item["page"]) > 1:
			page_active["override"] =item["page"]
			# remove last item
			page_active["override"].pop()
			# reverse order
			page_active["override"].reverse()

		rows.append({
			"is_public": page_active["is_public"],
			# "route": item["route"],
			"route_absolute": page_active["route_absolute"],
			"path": page_active["path"],
			"redirected_301": page_active["redirected_301"],
			"override": ",".join([i.path for i in page_active["override"]]) if "override" in page_active else "",
			"app": page_active["app"],
			"type": page_active["type"],
			"doctype": page_active["doctype"],
			"doc_name": page_active["doc_name"],
		})
		# { 'api_methods': [], 'doc_index_web_pages_for_search': '', 'doc_is_published_field': '', 'doc_website_search_field': '', 'file_or_doctype': 'site_cm/site_cm/www/index.html'}
	return rows
