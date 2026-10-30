// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Default templates
import catppuccin from '$theme/custom-defaults/catppuccin.css?raw';
import cerberus from '$theme/custom-defaults/cerberus.css?raw';
import concord from '$theme/custom-defaults/concord.css?raw';
import crimson from '$theme/custom-defaults/crimson.css?raw';
import dracula from '$theme/custom-defaults/dracula.css?raw';
import fennec from '$theme/custom-defaults/fennec.css?raw';
import hamlindigo from '$theme/custom-defaults/hamlindigo.css?raw';
import legacy from '$theme/custom-defaults/legacy.css?raw';
import mint from '$theme/custom-defaults/mint.css?raw';
import modern from '$theme/custom-defaults/modern.css?raw';
import mona from '$theme/custom-defaults/mona.css?raw';
import nosh from '$theme/custom-defaults/nosh.css?raw';
import nouveau from '$theme/custom-defaults/nouveau.css?raw';
import pine from '$theme/custom-defaults/pine.css?raw';
import reign from '$theme/custom-defaults/reign.css?raw';
import rocket from '$theme/custom-defaults/rocket.css?raw';
import rose from '$theme/custom-defaults/rose.css?raw';
import rosepine from '$theme/custom-defaults/rosepine.css?raw';
import sahara from '$theme/custom-defaults/sahara.css?raw';
import seafoam from '$theme/custom-defaults/seafoam.css?raw';
import terminus from '$theme/custom-defaults/terminus.css?raw';
import vintage from '$theme/custom-defaults/vintage.css?raw';
import vox from '$theme/custom-defaults/vox.css?raw';
import wintry from '$theme/custom-defaults/wintry.css?raw';

interface Theme {
	label: string;
	name: string;
	css: string;
}

export const themes: Theme[] = [
	{
		label: 'Catppuccin',
		name: 'catppuccin',
		css: catppuccin,
	},
	{
		label: 'Cerberus',
		name: 'cerberus',
		css: cerberus,
	},
	{
		label: 'Concord',
		name: 'concord',
		css: concord,
	},
	{
		label: 'Crimson',
		name: 'crimson',
		css: crimson,
	},
	{
		label: 'Dracula',
		name: 'dracula',
		css: dracula,
	},
	{
		label: 'Fennec',
		name: 'fennec',
		css: fennec,
	},
	{
		label: 'Hamlindigo',
		name: 'hamlindigo',
		css: hamlindigo,
	},
	{
		label: 'Legacy',
		name: 'legacy',
		css: legacy,
	},
	{
		label: 'Mint',
		name: 'mint',
		css: mint,
	},
	{
		label: 'Modern',
		name: 'modern',
		css: modern,
	},
	{
		label: 'Mona',
		name: 'mona',
		css: mona,
	},
	{
		label: 'Nosh',
		name: 'nosh',
		css: nosh,
	},
	{
		label: 'Nouveau',
		name: 'nouveau',
		css: nouveau,
	},
	{
		label: 'Pine',
		name: 'pine',
		css: pine,
	},
	{
		label: 'Reign',
		name: 'reign',
		css: reign,
	},
	{
		label: 'Rocket',
		name: 'rocket',
		css: rocket,
	},
	{
		label: 'Rose',
		name: 'rose',
		css: rose,
	},
	{
		label: 'Rosepine',
		name: 'rosepine',
		css: rosepine,
	},
	{
		label: 'Sahara',
		name: 'sahara',
		css: sahara,
	},
	{
		label: 'Seafoam',
		name: 'seafoam',
		css: seafoam,
	},
	{
		label: 'Terminus',
		name: 'terminus',
		css: terminus,
	},
	{
		label: 'Vintage',
		name: 'vintage',
		css: vintage,
	},
	{
		label: 'Vox',
		name: 'vox',
		css: vox,
	},
	{
		label: 'Wintry',
		name: 'wintry',
		css: wintry,
	}
];


// Custom themes
import backwoods from '$theme/backwoods.css?raw';
import bitf from '$theme/bitf.css?raw';
import comixCleric from '$theme/comixcleric.css?raw';
import defaultTheme from '$theme/default.css?raw';
import grawlich from '$theme/grawlich.css?raw';
import grawloween from '$theme/grawloween.css?raw';
import lavenderMist from '$theme/lavendermist.css?raw';
import limelight from '$theme/limelight.css?raw';
import panelparty from '$theme/panelparty.css?raw';
import phosphor from '$theme/phosphor.css?raw';
import qwitter from '$theme/qwitter.css?raw';
import retro from '$theme/retro.css?raw';
import weirdogs from '$theme/weirdogs.css?raw';

export const customThemes: Theme[] = [
	{
		label: 'Default',
		name: 'default',
		css: defaultTheme,
	},
	{
		label: 'Backwoods',
		name: 'backwoods',
		css: backwoods,
	},
	{
		label: 'Comix Cleric',
		name: 'comix-cleric',
		css: comixCleric,
	},
	{
		label: 'Lavender Mist',
		name: 'lavender-mist',
		css: lavenderMist,
	},
	{
		label: 'Limelight',
		name: 'limelight',
		css: lavenderMist,
	},
	{
		label: 'Panel Party',
		name: 'panelparty',
		css: panelparty,
	},
	{
		label: 'Phosphor',
		name: 'phosphor',
		css: phosphor,
	},
	{
		label: 'Qwitter',
		name: 'qwitter',
		css: qwitter,
	},
	{
		label: 'Retro',
		name: 'retro',
		css: retro,
	},
	{
		label: 'Grawlich',
		name: 'grawlich',
		css: grawlich,
	},
	{
		label: 'Grawloween',
		name: 'grawloween',
		css: grawloween,
	},
	{
		label: 'Weirdogs',
		name: 'weirdogs',
		css: weirdogs,
	},
];