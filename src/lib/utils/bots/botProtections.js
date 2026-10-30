// Code copied from:
// https://github.com/CaptainCodeman/svelte-kit-bot-block
// License: MIT

// Utilities
import * as z from 'zod';
import { consoleError, consoleLog } from '../debug';

// Checks if value is an IP address
const ipv4 = z.ipv4();
const ipv6 = z.ipv6();

// TODO: Still reworking this into a custom event handler
export const validateRequest = (event, ...options) => {
	const opts = { ...defaultOptions, ...options };

	const handle = async ({ event }) => {
		const { request, url } = event;
		const { hostname, pathname } = url;

		const user_agent = request.headers.get('user-agent') || ''

		const block = (match, ...messages) => {
			if (match) {
				if (opts.log) {
					const prefix = opts.block ? 'blocked' : 'would block';
				}
				return opts.block;
			}
			consoleError(`Event from ${hostname} was considered unsafe.`);
			return false;
		}

		if (block((ipv4.safeParse(hostname).success || ipv6.safeParse(hostname).success), 'ip address', hostname)) {
			return new Response(null, { status: opts.blocked_status });
		}

		if (block(opts.hostnames.some(re => re.test(hostname)), 'hostname', hostname)) {
			return new Response(null, { status: opts.blocked_status });
		}

		if (block(opts.pathnames.some(re => re.test(pathname)), 'pathname', pathname)) {
			return new Response(null, { status: 404 });
		}

		if (block(opts.user_agents.some(re => re.test(user_agent)), 'user-agent', user_agent)) {
			// allow bots to access /robots.txt even if blocked, so they can be told to go away
			// otherwise it's like trying to noindex something that has been blocked
			if (pathname !== '/robots.txt' || !opts.allow_robots) {
				return new Response(null, { status: opts.blocked_status });
			}
		}

		consoleLog(`Event from ${hostname} was considered safe.`);
		return event;
	}

	return handle;
}

export const defaultOptions = {
	// whether to log action
	log: true,

	// whether to block on failure (vs just warn, for testing)
	block: false,

	// block direct ip access (no hostname provided)
	ip_access: true,

	// block matching hostnames
	hostnames: [
		// nuisance requests on GCP
		/\.appspot\.com$/,
		// pretty confident we're not google
		/\.google.com$/,
	],

	// block matching pathnames
	pathnames: [
		// block sensitive file extensions
		/\.(env|git|ssh|map|yml|yaml|DS_Store)$/,
		// block unused file extensions
		/\.(php|asp|cgi|aspx|ashx|bak|py|rb)$/,
		// block nuisance requests
		/\.(rss|zip|rar|gz|sql)/,
		// git content
		/\.git\/\w+$/,
		// various .env file combinations (.env.bak, .env.bak, .env.prod etc...)
		/^\.env\./,
		// vscode config
		/^\.vscode\//,
		// some firebase crap
		/^\/__\/hosting\/verification$/,
		// wordpress config files
		/\/wp-config\./,
		// wordpress admin files
		/\/wp-admin\//,
		// wordpress content files
		/\/wp-content\//,
		/\/wp-includes\//,
		// wordpress XML-RPC and API Endpoints
		/\/wp-json\//,
		// Windows Live Writer?
		/\/wlwmanifest\.xml$/,
	],

	// Block matching user-agents
	user_agents: [
		// from https://community.cloudflare.com/t/top-50-user-agents-to-block/222594
		/(360Spider|acapbot|acoonbot|ahrefs|alexibot|asterias|attackbot|backdorbot|becomebot|binlar|blackwidow|blekkobot|blexbot|blowfish|bullseye|bunnys|butterfly|careerbot|casper|checkpriv|cheesebot|cherrypick|chinaclaw|choppy|clshttp|cmsworld|copernic|copyrightcheck|cosmos|crescent|cy_cho|datacha|demon|diavol|discobot|dittospyder|dotbot|dotnetdotcom|dumbot|emailcollector|emailsiphon|emailwolf|exabot|extract|eyenetie|feedfinder|flaming|flashget|flicky|foobot|g00g1e|getright|gigabot|go-ahead-got|gozilla|grabnet|grafula|harvest|heritrix|httrack|icarus6j|jetbot|jetcar|jikespider|kmccrew|leechftp|libweb|linkextractor|linkscan|linkwalker|loader|masscan|miner|majestic|mechanize|mj12bot|morfeus|moveoverbot|netmechanic|netspider|nicerspro|nikto|ninja|nutch|octopus|pagegrabber|planetwork|postrank|proximic|puppeteer|purebot|pycurl|python|queryn|queryseeker|radian6|radiation|realdownload|rogerbot|scooter|seekerspider|semalt|siclab|sindice|sistrix|sitebot|siteexplorer|sitesnagger|skygrid|smartdownload|snoopy|sosospider|spankbot|spbot|sqlmap|stackrambler|stripper|sucker|surftbot|sux0r|suzukacz|suzuran|takeout|teleport|telesoft|true_robots|turingos|turnit|vampire|vikspider|voideye|webleacher|webreaper|webstripper|webvac|webviewer|webwhacker|winhttp|wwwoffle|woxbot|xaldon|xxxyy|yamanalab|yioopbot|youda|zeus|zmeu|zune|zyborg)/
	],

	// Still allows indexing tools, like Google search.
	allow_robots: true,

	// Status to return when blocking. (Default: 404 "Not found")
	blocked_status: 404,
}