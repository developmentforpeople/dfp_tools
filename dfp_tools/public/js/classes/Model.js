
import { Observable } from './Observers'


export {
	Model,
}


let frappe_call_promises_by_id = {}


class Model {
	constructor() {
		this._model_properties = [] // Common model fields/properties in frontend and backend
		this._model_common_properties = ['loading'] // Fields that are common to all models
		this._observableOnChange = new Observable()
		this._assigning_data = false // Shows if model is assigning data from backend
		this._data_loaded = {} // Stores original data loaded from backend
		this._loading = false // Shows if model is loading data from backend
	}

	get observableOnChange() {
		return this._observableOnChange
	}

	propertyChanged(property) {
		this._observableOnChange.setState(property)
	}

	get loading() {
		return this._loading
	}
	set loading(value) {
		this._loading = value
		this.propertyChanged('loading')
	}

	dataAssign(data) {
		this._assigning_data = true
		Object.assign(this, data)
		this._data_loaded = this.modelGetObjectForBackend()
		this._assigning_data = false
		this.propertyChanged('*')
	}

	hasChangesToBeSavedToBackend() {
		return !(JSON.stringify(this._data_loaded) === JSON.stringify(this.modelGetObjectForBackend()))
	}

	modelGetObject(without_values=false) {
		let object = {}
		for (const property of this._model_common_properties.concat(this._model_properties)) {
			object[property] = without_values || this[property]
		}
		return object
	}

	modelGetObjectEmpty() {
		return this.modelGetObject(true)
	}

	modelGetObjectForBackend() {
		let object = {}
		for (const property of this._model_properties.concat(this._model_common_properties)) {
			let value = this[property] || ''
			if (value && this[property] instanceof Date) {
				// Format to YYYY-MM-DD
				value = new Intl.DateTimeFormat('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				}).format(value)
			}
			object[property] = value
		}
		return object
	}

	modelGetObjectAsFormData() {
		const data = this.modelGetObjectForBackend()
		const FORM_DATA = new FormData()
		for (let property in data) {
			FORM_DATA.append(property, data[property])
		}
		return FORM_DATA
	}

	/**
	 * Do frappe call to method caching and avoiding duplicated http calls within same page.
	 * 
	 * @param {String} method 
	 * @param {Object} args 
	 * @returns Promise
	 */
	newFrappeCallPromisedAndCached(method, args={}, data_assign=true) {
		if (!method) { throw new Error('method is required') }
		const id = `${method}:${JSON.stringify(args).replace(/[\W_]+/g, '.')}`
		return new Promise(resolve => {
			if (id in frappe_call_promises_by_id) {
				frappe_call_promises_by_id[id].then(response => {
					data_assign && this.dataAssign(response)
					resolve(response)
				})
			} else {
				frappe_call_promises_by_id[id] = new Promise(resolve_api_call => {
					this.loading = true
					frappe.call({
						method: method,
						args: args,
						callback: r => {
							resolve_api_call(r)
							this.loading = false
						}
					})
				})
				frappe_call_promises_by_id[id].then(response => {
					data_assign && this.dataAssign(response)
					resolve(response)
				})
			}
		})
	}
}
