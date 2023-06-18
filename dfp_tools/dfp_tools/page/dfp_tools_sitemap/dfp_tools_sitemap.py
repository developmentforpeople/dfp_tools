import os
import frappe
# from frappe.query_builder import Interval, Order
# from frappe.query_builder.functions import Date, Sum, UnixTimestamp
# from frappe.utils import getdate
from glob import glob
# from frappe.search.website_search import get_static_pages_from_all_apps
from bs4 import BeautifulSoup


@frappe.whitelist()
def get_web_pages():

	pages = []
	pages_by_route = {}

	page_tpl = frappe._dict({
		"route": "",
		"app": "",
		"type": "", # static | doctype
		"path": "", # static file path
		"no_cache": "",
		"sitemap": "",
		"doctype": "",
		"doc_allow_guest_to_view": "",
		"doc_index_web_pages_for_search": "",
		"doc_is_published_field": "",
		"doc_website_search_field": "",
	})

	def static_page_add(app, path, route):
		page = page_tpl.copy()
		page.app = app
		page.type = "static"
		page.path = path
		page.route = route
		if route in pages_by_route:
			pages_by_route[route].append(page)
		else:
			pages_by_route[route] = [page]
		pages.append(page)

	def doctype_page_add(doctype, doc_page):
		page = page_tpl.copy()
		page.app = "app"
		page.type = "doctype"
		page.route = doc_page.route
		page.doctype = doctype.name
		page.doc_allow_guest_to_view = doctype.allow_guest_to_view
		page.doc_index_web_pages_for_search = doctype.index_web_pages_for_search
		page.doc_is_published_field = doctype.is_published_field
		page.doc_website_search_field = doctype.website_search_field
		if doc_page.route and doc_page.route in pages_by_route:
			pages_by_route[doc_page.route].append(page)
		else:
			pages_by_route[doc_page.route] = [page]
		pages.append(page)

	try:
		apps = frappe.get_installed_apps()
		for app in apps:
			path_to_index = frappe.get_app_path(app, "www")

			files_to_index = glob(path_to_index + "/**/*.html", recursive=True)
			files_to_index.extend(glob(path_to_index + "/**/*.md", recursive=True))
			for file in files_to_index:
				route = os.path.relpath(file, path_to_index).split(".", maxsplit=1)[0]
				if route.endswith("index"):
					route = route.rsplit("index", 1)[0]
				static_page_add(app, file, route)

		# Doctype with web views
		filters = {"has_web_view": 1}#, "allow_guest_to_view": 1, "index_web_pages_for_search": 1}
		fields = ["name", "is_published_field", "website_search_field", "allow_guest_to_view", "index_web_pages_for_search"]
		doctype_with_web_views = frappe.get_all("DocType", filters=filters, fields=fields)
		for doctype in doctype_with_web_views:
			if doctype.is_published_field:
				fields_doc_pages = ["route", doctype.website_search_field]
				filters_doc_pages = ({doctype.is_published_field: 1})
				# if doctype.website_search_field:
				# 	docs = frappe.get_all(doctype.name, filters=filters_doc_pages, fields=fields_doc_pages + ["title"])
				# 	for doc_page in docs:
				# 		content = frappe.utils.md_to_html(getattr(doc_page, doctype.website_search_field))
				# 		soup = BeautifulSoup(content, "html.parser")
				# 		text_content = soup.text if soup else ""
				# 		# docs_items += [frappe._dict(title=doc.title, content=text_content, path=doc.route)]
				# 		doctype_page_add(doctype, doc_page)
				# else:
				docs = frappe.get_all(doctype.name, filters=filters_doc_pages, fields=fields_doc_pages)
				for doc_page in docs:
					doctype_page_add(doctype, doc_page)
				# all_routes += [route.route for route in docs]

		# print(pages)
		# print(pages_by_route)


	except Exception as e:
		print(e)

	return [{"route": route, "page": p} for route, p in pages_by_route.items()]



# @frappe.whitelist()
# def get_energy_points_percentage_chart_data(user, field):
# 	result = frappe.get_all(
# 		"Energy Point Log",
# 		filters={"user": user, "type": ["!=", "Review"]},
# 		group_by=field,
# 		order_by=field,
# 		fields=[field, "ABS(sum(points)) as points"],
# 		as_list=True,
# 	)

# 	return {
# 		"labels": [r[0] for r in result if r[0] is not None],
# 		"datasets": [{"values": [r[1] for r in result]}],
# 	}


# @frappe.whitelist()
# def get_user_rank(user):
# 	month_start = datetime.today().replace(day=1)
# 	monthly_rank = frappe.get_all(
# 		"Energy Point Log",
# 		group_by="`tabEnergy Point Log`.`user`",
# 		filters={"creation": [">", month_start], "type": ["!=", "Review"]},
# 		fields=["user", "sum(points)"],
# 		order_by="sum(points) desc",
# 		as_list=True,
# 	)

# 	all_time_rank = frappe.get_all(
# 		"Energy Point Log",
# 		group_by="`tabEnergy Point Log`.`user`",
# 		filters={"type": ["!=", "Review"]},
# 		fields=["user", "sum(points)"],
# 		order_by="sum(points) desc",
# 		as_list=True,
# 	)

# 	return {
# 		"monthly_rank": [i + 1 for i, r in enumerate(monthly_rank) if r[0] == user],
# 		"all_time_rank": [i + 1 for i, r in enumerate(all_time_rank) if r[0] == user],
# 	}


# @frappe.whitelist()
# def update_profile_info(profile_info):
# 	profile_info = frappe.parse_json(profile_info)
# 	keys = ["location", "interest", "user_image", "bio"]

# 	for key in keys:
# 		if key not in profile_info:
# 			profile_info[key] = None

# 	user = frappe.get_doc("User", frappe.session.user)
# 	user.update(profile_info)
# 	user.save()
# 	return user


# @frappe.whitelist()
# def get_energy_points_list(start, limit, user):
# 	return frappe.db.get_list(
# 		"Energy Point Log",
# 		filters={"user": user, "type": ["!=", "Review"]},
# 		fields=[
# 			"name",
# 			"user",
# 			"points",
# 			"reference_doctype",
# 			"reference_name",
# 			"reason",
# 			"type",
# 			"seen",
# 			"rule",
# 			"owner",
# 			"creation",
# 			"revert_of",
# 		],
# 		start=start,
# 		limit=limit,
# 		order_by="creation desc",
# 	)
