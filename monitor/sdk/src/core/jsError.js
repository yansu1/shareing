export default {
	init() {
		this.jsError()
		this.promiseError()
	},
	/**
	 * 1.js运行报错
	 * 2.资源加载报错
	 */
	jsError() {
		window.addEventListener(
			'error',
			function (event) {
				console.log(event, 'event')
				// js错误信息 静态资源加载错误信息
				if (event.target.src || event.target.link) {
					console.log('资源加载错误：', {
						type: 'error', //小类型
						errorType: 'resourceError', //小小类型
						message: 'Resources load error', //报错信息
						filename: event.target.src,
						position: event.target.tagName,
						stack: `at ${event.target.outerHTML}`,
					})
				} else {
					console.log('js异常：', {
						type: 'error', //小类型
						errorType: 'jsError', //小小类型
						message: event.message, //报错信息
						filename: event.filename,
						position: `${event.lineno}:${event.colno}`,
						stack: event.error.stack,
					})
				}
			},
			true,
		)
	},
	/**
	 * promise unhandledrejection报错
	 */
	promiseError() {
		window.addEventListener(
			'unhandledrejection',
			function (event) {
				let log = {
					type: 'error', //小类型
					errorType: 'promiseError', //小小类型
					message: '', //报错信息
					filename: '',
					position: '',
					stack: '',
				}
				if (typeof event.reason === 'string') {
					log.message = event.reason
					log.filename = event.currentTarget.origin
					log.position = `can not detect`
					log.stack = 'This is a intentionally promise error by Promise.reject()'
				} else if (typeof event.reason === 'object') {
					log.message = event.reason.message
					if (event.reason.stack) {
						let matchResult = event.reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
						log.filename = matchResult[1]
						let line = matchResult[2],
							column = matchResult[3]
						log.position = `${line}:${column}`
						log.stack = event.reason.stack
					}
				}
				console.log(log)
			},
			true,
		)
	},
}
