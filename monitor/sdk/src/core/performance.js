export default {
	init() {
		// 白屏时间
		this.getFCP()
		// 最大内容绘制时间
		this.getLCP()
		// 首次输入延迟
		this.getFID()
	},
	getFCP() {
		const entryHandler = list => {
			for (const entry of list.getEntries()) {
				if (entry.name === 'first-contentful-paint') {
					observer.disconnect()
					// 计算首次内容绘制时间
					let FCP = entry.startTime
					console.log('fcp', FCP)
				}
			}
		}
		const observer = new PerformanceObserver(entryHandler)
		observer.observe({ type: 'paint', buffered: true })
	},
	getLCP() {
		const entryHandler = list => {
			if (observer) {
				observer.disconnect()
			}
			for (const entry of list.getEntries()) {
				// 最大内容绘制时间
				let LCP = entry.startTime
				console.log('lcp', LCP)
			}
		}
		const observer = new PerformanceObserver(entryHandler)
		observer.observe({ type: 'largest-contentful-paint', buffered: true })
	},
	getFID() {
		new PerformanceObserver(entryList => {
			for (const entry of entryList.getEntries()) {
				// 计算首次输入延迟时间
				const FID = entry.processingStart - entry.startTime
				console.log('fid', FID)
			}
		}).observe({ type: 'first-input', buffered: true })
	},
}
