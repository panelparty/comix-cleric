// -- Contains helpers and lists for common values in Comix Cleric -- //

// Status fallback
const statusUnknown = {
	label: 'Unknown',
	value: 'unknown',
	color: 'text-surface-950-50',
	bg: 'bg-surface-100-900',
	indicator: 'bg-surface-500'
};

// Post status
export const statusPost = [
	statusUnknown,
	{
		label: 'Archived',
		value: 'archived',
		color: 'text-warning-950-50',
		bg: 'bg-warning-100-900',
		indicator: 'bg-warning-500'
	},
	{
		label: 'Draft',
		value: 'draft',
		color: 'text-surface-950-50',
		bg: 'bg-surface-100-900',
		indicator: 'bg-surface-500'
	},
	{
		label: 'Scheduled',
		value: 'scheduled',
		color: 'text-success-950-50',
		bg: 'bg-success-100-900',
		indicator: 'bg-success-500'
	},
	{
		label: 'Published',
		value: 'published',
		color: 'text-primary-950-50',
		bg: 'bg-primary-100-900',
		indicator: 'bg-primary-500'
	},
];

// User status
export const statusAccount = [
	statusUnknown,
	{
		label: 'Active',
		value: 'active',
		color: 'text-primary-950-50',
		bg: 'bg-primary-100-900',
		indicator: 'bg-primary-500'
	},
	{
		label: 'Invited',
		value: 'invited',
		color: 'text-surface-950-50',
		bg: 'bg-surface-100-900',
		indicator: 'bg-surface-500'
	},
	{
		label: 'Unverified',
		value: 'unverified',
		color: 'text-warning-950-50',
		bg: 'bg-warning-100-900',
		indicator: 'bg-warning-500'
	},
	{
		label: 'Suspended',
		value: 'suspended',
		color: 'text-error-950-50',
		bg: 'bg-error-100-900',
		indicator: 'bg-error-500'
	},
];

// All status options
export const statusOptions = [
	...statusPost,
	...statusAccount,
];