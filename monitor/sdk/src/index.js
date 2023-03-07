import jsError from './core/jsError'
import requestCatch from './core/requestCatch'
import performance from './core/performance'
import { version } from '../package.json'

const VERSION = version

function init() {
	jsError.init()
	requestCatch.init()
	performance.init()
}
export { VERSION, init }
