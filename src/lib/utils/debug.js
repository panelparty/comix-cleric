// Utilities for printing a console message without manually adding a timestamp.

// Generate timestamp
const timestamp = () => new Date().toLocaleString();

// Standard console.log with timestamp.
export function consoleLog(...data) {
	return console.log(`\x1b[0m[${timestamp()}] DEBUG:`, ...data, "\x1b[0m");
}

// Standard console.log with timestamp.
export function consoleInfo(...data) {
	return console.info(`\x1b[34m[${timestamp()}] INFO:`, ...data, "\x1b[0m");
}

// Standard console.success with timestamp.
export function consoleSuccess(...data) {
	return console.log(`\x1b[32m[${timestamp()}] SUCCESS:`, ...data, "\x1b[0m");
}

// Standard console.warn with timestamp.
export function consoleWarn(...data) {
	return console.warn(`\x1b[33m[${timestamp()}] WARN:`, ...data, "\x1b[0m");
}

// Standard console.error with timestamp.
export function consoleError(...data) {
	return console.error(`\x1b[31m[${timestamp()}] ERROR:`, ...data, "\x1b[0m");
}