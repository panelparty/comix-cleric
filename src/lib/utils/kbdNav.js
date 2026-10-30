// -- Utilities and helpers for keyboard navigation -- //

// Modifier keys
const modifierKeys = {
	ctrl: 'ctrlKey',
	alt: 'altKey',
	shift: 'shiftKey',
	meta: 'metaKey'
};

// Creates a new keyboard command
export function kbdCommand(event, baseKey, action = () => {}, { modifier = null, preventDefault = false } = {}) {
	const modifierMatch = modifier ? event[modifierKeys[modifier]] === true : true;

	if (modifierMatch && event.key === baseKey) {
		if (preventDefault) {
			event.preventDefault();
		}
		action();
	}
};