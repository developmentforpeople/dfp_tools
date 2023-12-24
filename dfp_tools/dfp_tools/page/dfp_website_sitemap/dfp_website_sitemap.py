from typing import Tuple
from typing import Any
import os
import re
import inspect
from glob import glob
from werkzeug.wrappers import Response
import frappe
from frappe import _
from frappe.website.path_resolver import resolve_redirect
from frappe.website.page_renderers.template_page import TemplatePage
from frappe.website.page_renderers.error_page import ErrorPage
from frappe.website.page_renderers.not_found_page import NotFoundPage
from frappe.website.page_renderers.not_permitted_page import NotPermittedPage
from frappe.website.page_renderers.redirect_page import RedirectPage
from frappe.website.path_resolver import PathResolver
from bs4 import BeautifulSoup
# from frappe.utils import set_request
# from frappe.website.serve import get_response_content
from frappe.search.website_search import WebsiteSearch
from frappe.search.website_search import INDEX_NAME
# from frappe.search.website_search import get_static_pages_from_all_apps
# from frappe.search.website_search import slugs_with_web_view
from frappe.website.router import get_pages


WEBSITE_SEARCH_INDEX_IGNORE_LIST = [
	"app", "_test", "list", "search", "printview", "printpreview", "message", "error", "404", "502", "examples", "access", "modified_doc_alert", "confirm_workflow_action", "third_party_apps", "tests", "unsubscribe", "qrcode", "payment_setup_certification", "login", "update-password", "complete_signup", "me", "integrations/gcalendar-success"
]
WEBSITE_SEARCH_INDEX_IGNORE_LIST_STARTSWITH = [
	"_test/",
]
WEBSITE_SEARCH_INDEX_IGNORE_LIST_ENDSWITH = [
	".js", ".css", ".xml"
]


# @frappe.whitelist()
def doctypes_with_webview():
	"""Returns doctypes with webview enabled"""
	filters = { "has_web_view": 1 }#, "allow_guest_to_view": 1, "index_web_pages_for_search": 1}
	fields = ["name", "is_published_field", "website_search_field", "allow_guest_to_view", "index_web_pages_for_search"]
	return frappe.get_all("DocType", filters=filters, fields=fields)


@frappe.whitelist()
def get_web_pages():

	from frappe.api import API_URL_MAP
	for r in API_URL_MAP.iter_rules():
		print(r)
	# endpoint, arguments = API_URL_MAP.bind_to_environ(request.environ).match()
	# print("endpoint", endpoint)

	pages_by_route = {}

	page_tpl = frappe._dict({
		"route": "",
		"app": "",
		"type": "", # static | doctype
		"path": "", # static file path
		"route": "",
		"route_absolute": "",
		"is_public": 1, # Guest can view
		"api_methods": [],
		"redirected_301": "",
		"doctype": "",
		"doc_name": "",
		"doc_index_web_pages_for_search": "",
		"doc_is_published_field": "",
		"doc_website_search_field": "",
	})

	def api_page_add(app, path, route, methods, is_public):
		page = page_tpl.copy()
		page.app = app
		page.file_or_doctype = path # used for table sorting
		page.type = "api"
		page.path = path
		page.route = route
		page.route_absolute = f"/{route}"
		page.is_public = 1 if is_public else 0
		page.api_methods = methods
		if route in pages_by_route:
			pages_by_route[route].append(page)
		else:
			pages_by_route[route] = [page]

	def static_page_add(app, path, route):
		page = page_tpl.copy()
		page.app = app
		page.file_or_doctype = path # used for table sorting
		page.type = "file"
		page.path = path
		page.route = route
		page.route_absolute = f"/{route}"
		if route in pages_by_route:
			pages_by_route[route].append(page)
		else:
			pages_by_route[route] = [page]

	def doctype_page_add(doctype, doc_page):
		page = page_tpl.copy()
		page.app = ""
		page.file_or_doctype = _(doctype.name) # used for table sorting
		page.type = "doctype"
		page.route = doc_page.route
		page.route_absolute = f"/{doc_page.route}"
		page.doctype = doctype.name
		page.doc_name = doc_page.name
		page.is_public = 1 if doctype.allow_guest_to_view else 0
		page.doc_index_web_pages_for_search = doctype.index_web_pages_for_search
		page.doc_is_published_field = doctype.is_published_field
		page.doc_website_search_field = doctype.website_search_field
		# url = f"""/app/{doctype.name.lower().replace(" ", "-")}/{doc_page.name.lower().replace(" ", "-")}"""
		# page.edit = quote(url)

		if doc_page.route and doc_page.route in pages_by_route:
			pages_by_route[doc_page.route].append(page)
		else:
			pages_by_route[doc_page.route] = [page]

	try:
		# 1. Files in apps/www
		bench_path = frappe.utils.get_bench_path()
		apps_path = os.path.join(bench_path, "apps")
		apps = frappe.get_installed_apps()
		for app in apps:
			path_to_index = frappe.get_app_path(app, "www")
			# files_to_index = glob(path_to_index + "/**/*.html", recursive=True)
			# files_to_index.extend(glob(path_to_index + "/**/*.md", recursive=True))
			# files_to_index.extend(glob(path_to_index + "/**/*.xml", recursive=True))
			# files_to_index.extend(glob(path_to_index + "/**/*.txt", recursive=True))
			files_to_index = [file for file in glob(path_to_index + "/**/*", recursive=True) if (not file.endswith(".py") and not file.endswith(".pyc") and not file.endswith("__pycache__"))]
			for file in files_to_index:
				if file.endswith(".html") or file.endswith(".md"):
					route = os.path.relpath(file, path_to_index).split(".", maxsplit=1)[0]
					if route.endswith("index"):
						route = route.rsplit("index", 1)[0]
				else:
					route = os.path.relpath(file, path_to_index)
				file_without_bench = file[len(apps_path)+1:]
				static_page_add(app=app, path=file_without_bench, route=route)

		# 2. Doctype with web views
		# filters = {"has_web_view": 1}#, "allow_guest_to_view": 1, "index_web_pages_for_search": 1}
		# fields = ["name", "is_published_field", "website_search_field", "allow_guest_to_view", "index_web_pages_for_search"]
		# doctype_with_web_views = frappe.get_all("DocType", filters=filters, fields=fields)
		for doctype in doctypes_with_webview():
			print(doctype)
			if doctype.is_published_field:
				fields_doc_pages = ["name", "route"]
				if doctype.website_search_field:
					fields_doc_pages.append(doctype.website_search_field)
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
					doctype_page_add(doctype=doctype, doc_page=doc_page)
				# all_routes += [route.route for route in docs]

		# 3. API whitelisted methods
		for fn, methods in frappe.allowed_http_methods_for_whitelisted_func.items():
			app = inspect.getmodule(fn).__name__.split(".")[0]
			path = f"{inspect.getmodule(fn).__name__}.{fn.__name__}"
			route = f"api/method/{path}"
			is_public = 1 if fn in frappe.guest_methods else 0
			api_page_add(app, path, route, methods, is_public)

	except Exception as e:
		frappe.log_error("Error in DFP website sitemap get_web_pages", e)

	for path, p in pages_by_route.items():
		try:
			resolve_redirect(path=path)
		except frappe.Redirect:
			for page in p:
				page.redirected_301 = frappe.flags.redirect_location
		except Exception as e:
			frappe.log_error("Error in DFP website sitemap get_web_pages", e)

	sorted_pages = {k: pages_by_route[k] for k in sorted(pages_by_route)}

	return [{"route": route, "page": p} for route, p in sorted_pages.items()]


def get_render_instance(path:str) -> Tuple[(NotFoundPage | RedirectPage | TemplatePage | Any | None), str]:
	endpoint = path
	renderer_instance = None
	try:
		path_resolver = PathResolver(path)
		endpoint, renderer_instance = path_resolver.resolve()
		print("renderer_instance: ", type(renderer_instance))
		return renderer_instance, endpoint
	except Exception as e:
		pass
	return None, endpoint


# def get_response(path=None):
# 	"""Resolves path and renders page"""
# 	response = None

# 	try:
# 		renderer, endpoint = get_render_instance(path=path)
# 		response = renderer.render()
# 	except frappe.Redirect:
# 		return RedirectPage(endpoint or path, http_status_code).render()
# 	except frappe.PermissionError as e:
# 		response = NotPermittedPage(endpoint, http_status_code, exception=e).render()
# 	except frappe.PageDoesNotExistError:
# 		response = NotFoundPage(endpoint, http_status_code).render()
# 	except Exception as e:
# 		response = ErrorPage(exception=e).render()

# 	return response


@frappe.whitelist()
def build_index_for_all_routes():

	from frappe.utils import get_url
	from frappe.utils import nowdate
	from urllib.parse import quote

	from frappe.www.sitemap import get_public_pages_from_doctypes
	pages = []
	# File system files
	for route, page in get_pages().items():
		pages.append({
			"route": route,
			"sitemap": 1 if page.sitemap else 0,
			"loc": get_url(quote(page.name.encode("utf-8"))),
			"lastmod": nowdate(),
			"page": page,
		})
	# DocType pages
	for route, data in get_public_pages_from_doctypes().items():
		pages.append({
			"route": route,
			"loc": get_url(quote((route or "").encode("utf-8"))),
			"lastmod": f"{data['modified']:%Y-%m-%d}",
			"doc_type": data["doctype"],
			"doc_name": data["name"],
		})
	print("pages", pages)


	routes_response = {}
	routes_error = {}

	frappe.local.no_cache = True
	user = frappe.session.user
	frappe.set_user("Guest")
	try:
		for page in pages:
			route = page["route"]
			if route in WEBSITE_SEARCH_INDEX_IGNORE_LIST or any([route.startswith(x) for x in WEBSITE_SEARCH_INDEX_IGNORE_LIST_STARTSWITH]) or any([route.endswith(x) for x in WEBSITE_SEARCH_INDEX_IGNORE_LIST_ENDSWITH]):
				print(f"route: {route} IGNORED!")
				continue
			print("process route: ", route)
			try:
				# TODO: probablemente el path resolver me la pele pq el status code me da info suficiente
				# TODO: pensar si tiene sentido para sacar extra info del 
				renderer_instance, endpoint = get_render_instance(path=route)
				print(type(renderer_instance))

				final_path = endpoint
				print("final_path", final_path) # Maybe it is redirected to /zzz

				response = renderer_instance.render()
				if response.status_code == 200:
					routes_response[route] = response
				else:
					routes_response[route] = response.status_code
			except Exception as e:
				print(e)
				routes_error[route] = {
					"error": type(e).__name__,
					"description": e.args[0] if e.args else "",
				}
				print(e)
	except Exception as e:
		print(e)
		pass
	finally:
		frappe.clear_messages()
		frappe.set_user(user)

	# messages = frappe.local.message_log

	# frappe.set_user(user)

	print("routes_error", routes_error)
	print("routes_response", routes_response)



	# data-doctype="Wiki Page" > wiki-content


	items_to_index = []

	for route, r in routes_response.items():
		# print(r, routes_response[route])
		try:
			if type(r) != Response or not r.response or r.status_code != 200:
				print(f"Algo no va bien con esta response! {route}", r)
				continue
			html = r.get_data(as_text=True)
			# print("Response", r.response)
			soup = BeautifulSoup(html, "html.parser")
			title = soup.title.text.strip() if soup.title else route

			page_content = soup.find(class_="page_content")
			if not page_content:
				page_content = soup.find(class_="wiki-content")
			if not page_content:
				frappe.log_error(f"Error in DFP website sitemap get_document_to_index: {route}", "No page_content or wiki-page-content found")

			text_content = page_content.text if page_content else ""
			# Reemplazar múltiples espacios, tabuladores y saltos de línea consecutivos por un solo espacio
			text_content_cleaned = re.sub(r'[\s]+', ' ', text_content).strip()

			items_to_index.append(frappe._dict(title=title, content=text_content_cleaned, path=route))
		except Exception as e:
			print(e)
			pass

	from frappe.utils.synchronization import filelock
	with filelock("building_website_search"):
		ws = WebsiteSearch(INDEX_NAME)
		ws.documents = items_to_index
		# ws.create_index()
		ws.build_index()

	return "OK"
