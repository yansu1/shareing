export default {
	init() {
		this.fetchReplace()
		this.xhrReplace()
	},
	xhrReplace() {
		let xhr = window.XMLHttpRequest
		// 拦截open,send方法
		let _open = xhr.prototype.open
		xhr.prototype.open = function (method, url) {
			this.logData = {
				method,
				url,
			}
			return _open.apply(this, arguments)
		}
		let _send = xhr.prototype.send
		xhr.prototype.send = function (body) {
			let start = Date.now()
			let fn = type => () => {
				console.log({
					type: 'xhr',
					eventType: type,
					duration: Date.now() - start,
					status: this.status,
					responseSize: this.responseText.length,
					body,
					...this.logData,
				})
			}
			this.addEventListener('load', fn('load'), false)
			this.addEventListener('error', fn('error'), false)
			this.addEventListener('abort', fn('abort'), false)
			return _send.apply(this, arguments)
		}
	},
	fetchReplace() {
		const _fetch = window.fetch
		const newFetch = function (url, config) {
			let start = Date.now()
			const logData = {
				url,
				...config,
			}
			const onResolve = res => {
				// 请求成功
				console.log({
					kind: 'stability',
					type: 'fetch',
					eventType: 'load',
					duration: Date.now() - start,
					status: res.status,
					...logData,
				})
				return res
			}
			const onReject = err => {
				// 请求失败
				console.log({
					kind: 'stability',
					type: 'fetch',
					eventType: 'error',
					duration: Date.now() - start,
					status: 0,
					...logData,
				})

				throw err
			}
			return _fetch.apply(this, arguments).then(onResolve, onReject)
		}
		window.fetch = newFetch
	},
}
