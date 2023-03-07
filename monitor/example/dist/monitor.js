(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Monitor = {}));
})(this, (function (exports) { 'use strict';

	var jsError = {
		init() {
			this.jsError();
			this.promiseError();
		},
		/**
		 * 1.js运行报错
		 * 2.资源加载报错
		 */
		jsError() {
			window.addEventListener(
				'error',
				function (event) {
					console.log(event, 'event');
					// js错误信息 静态资源加载错误信息
					if (event.target.src || event.target.link) {
						console.log('资源加载错误：', {
							type: 'error', //小类型
							errorType: 'resourceError', //小小类型
							message: 'Resources load error', //报错信息
							filename: event.target.src,
							position: event.target.tagName,
							stack: `at ${event.target.outerHTML}`,
						});
					} else {
						console.log('js异常：', {
							type: 'error', //小类型
							errorType: 'jsError', //小小类型
							message: event.message, //报错信息
							filename: event.filename,
							position: `${event.lineno}:${event.colno}`,
							stack: event.error.stack,
						});
					}
				},
				true,
			);
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
					};
					if (typeof event.reason === 'string') {
						log.message = event.reason;
						log.filename = event.currentTarget.origin;
						log.position = `can not detect`;
						log.stack = 'This is a intentionally promise error by Promise.reject()';
					} else if (typeof event.reason === 'object') {
						log.message = event.reason.message;
						if (event.reason.stack) {
							let matchResult = event.reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
							log.filename = matchResult[1];
							let line = matchResult[2],
								column = matchResult[3];
							log.position = `${line}:${column}`;
							log.stack = event.reason.stack;
						}
					}
					console.log(log);
				},
				true,
			);
		},
	};

	var requestCatch = {
		init() {
			this.fetchReplace();
			this.xhrReplace();
		},
		xhrReplace() {
			let xhr = window.XMLHttpRequest;
			// 拦截open,send方法
			let _open = xhr.prototype.open;
			xhr.prototype.open = function (method, url) {
				this.logData = {
					method,
					url,
				};
				return _open.apply(this, arguments)
			};
			let _send = xhr.prototype.send;
			xhr.prototype.send = function (body) {
				let start = Date.now();
				let fn = type => () => {
					console.log({
						type: 'xhr',
						eventType: type,
						duration: Date.now() - start,
						status: this.status,
						responseSize: this.responseText.length,
						body,
						...this.logData,
					});
				};
				this.addEventListener('load', fn('load'), false);
				this.addEventListener('error', fn('error'), false);
				this.addEventListener('abort', fn('abort'), false);
				return _send.apply(this, arguments)
			};
		},
		fetchReplace() {
			const _fetch = window.fetch;
			const newFetch = function (url, config) {
				let start = Date.now();
				const logData = {
					url,
					...config,
				};
				const onResolve = res => {
					// 请求成功
					console.log({
						kind: 'stability',
						type: 'fetch',
						eventType: 'load',
						duration: Date.now() - start,
						status: res.status,
						...logData,
					});
					return res
				};
				const onReject = err => {
					// 请求失败
					console.log({
						kind: 'stability',
						type: 'fetch',
						eventType: 'error',
						duration: Date.now() - start,
						status: 0,
						...logData,
					});

					throw err
				};
				return _fetch.apply(this, arguments).then(onResolve, onReject)
			};
			window.fetch = newFetch;
		},
	};

	var performance = {
		init() {
			// 白屏时间
			this.getFCP();
			// 最大内容绘制时间
			this.getLCP();
			// 首次输入延迟
			this.getFID();
		},
		getFCP() {
			const entryHandler = list => {
				for (const entry of list.getEntries()) {
					if (entry.name === 'first-contentful-paint') {
						observer.disconnect();
						// 计算首次内容绘制时间
						let FCP = entry.startTime;
						console.log('fcp', FCP);
					}
				}
			};
			const observer = new PerformanceObserver(entryHandler);
			observer.observe({ type: 'paint', buffered: true });
		},
		getLCP() {
			const entryHandler = list => {
				if (observer) {
					observer.disconnect();
				}
				for (const entry of list.getEntries()) {
					// 最大内容绘制时间
					let LCP = entry.startTime;
					console.log('lcp', LCP);
				}
			};
			const observer = new PerformanceObserver(entryHandler);
			observer.observe({ type: 'largest-contentful-paint', buffered: true });
		},
		getFID() {
			new PerformanceObserver(entryList => {
				for (const entry of entryList.getEntries()) {
					// 计算首次输入延迟时间
					const FID = entry.processingStart - entry.startTime;
					console.log('fid', FID);
				}
			}).observe({ type: 'first-input', buffered: true });
		},
	};

	var version = "1.0.0";

	const VERSION = version;

	function init() {
		jsError.init();
		requestCatch.init();
		performance.init();
	}

	exports.VERSION = VERSION;
	exports.init = init;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=monitor.js.map
