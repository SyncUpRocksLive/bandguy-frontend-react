export let LogMode: 'verbose'|'info'|'error' = 'verbose';

const logLevels = {
	'verbose': 0,
	'info': 1,
	'error': 2,
}

const logColors = {
	'verbose': 'green',
	'info': 'green',
	'error': 'red',
}

export const LogVerbose = (message: string, context: string | undefined = undefined) => {
	Log('verbose', message, context);
}

export const LogInfo = (message: string, context: string | undefined = undefined) => {
	Log('info', message, context);
}

export const LogError = (message: string, context: string | undefined = undefined) => {
	Log('error', message, context);
}

export const Log = (mode: 'verbose'|'info'|'error', message: string, context: string | undefined = undefined) => {
	if (logLevels[mode] >= logLevels[LogMode]) {
		if (context) {
			console.log(`%c${mode.toUpperCase()} %c[${context}]: %c${message}`, `color: ${logColors[mode]};`, 'color: blue', 'color: inherit;');
		} else {
			console.log(`%c${mode.toUpperCase()}: %c${message}`, `color: ${logColors[mode]};`, 'color: inherit;');
		}
	}
}

export const LogObject = (mode: 'verbose'|'info'|'error', message: string, obj: any, context: string | undefined = undefined) => {
	if (logLevels[mode] >= logLevels[LogMode]) {
		if (context) {
			console.log(`%c${mode.toUpperCase()} %c[${context}]: %c${message}`, `color: ${logColors[mode]};`, 'color: teal', 'color: inherit;');
		} else {
			console.log(`%c${mode.toUpperCase()}: %c${message}`, `color: ${logColors[mode]};`, 'color: inherit;');
		}

		console.table(obj);
	}
}
