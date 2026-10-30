<script>
	// Svelte utilities
  import { invalidateAll } from '$app/navigation';
  
  // Utilities
  import { isEqual, sortBy } from 'lodash-es';
  import { headerLayouts } from '$lib/utils/validation/style.js';
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
	import { acceptedFileTypes } from '$lib/utils/validation/schema';

  // Skeleton UI components
  import { Accordion } from '@skeletonlabs/skeleton-svelte';

  // Components
  import Form from '$lib/components/Forms/Form.svelte';
  import FormControls from '$lib/components/Forms/FormControls.svelte';
  import Input from '$lib/components/Admin/Inputs/Input.svelte';
  import FormSection from '$lib/components/Admin/Forms/FormSection.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import FaviconPreview from '$lib/components/Admin/FaviconPreview.svelte';
  import DeleteConfirm from '$lib/components/Admin/DeleteConfirm.svelte';
	import Alert from '$lib/components/Alerts/Alert.svelte';

  // Props
  let {
    data,
		...restProps
  } = $props();

  // Form Values
  let app_name = $derived(data?.globals?.name ?? "Comix Cleric");
  let app_desc = $derived(data?.globals?.description);
  let app_subtitle = $derived(data?.globals?.subtitle);
  let app_logo = $derived(data?.globals?.logo);
  let series_branding = $derived(data?.globals?.series_branding);
  let app_favicon = $derived(data?.globals?.favicon);
  let app_layout = $derived(data?.globals?.layout ?? 'default');
  let app_width = $derived(data?.globals?.width ?? '1280px');
  let logo_height = $derived(data?.globals?.logo_height ?? '3rem');
  let header_layout = $derived(data?.globals?.header_layout ?? headerLayouts[0]);
  let reader_height = $derived(data?.globals?.reader_height ?? "350px");
  let reader_width = $derived(data?.globals?.reader_width);
  let format_strip = $derived(data?.globals?.format_strip);
  let format_infinite = $derived(data?.globals?.format_infinite);
  let app_url = $derived(data?.globals?.url);
  let admin_email = $derived(data?.globals?.admin_email);
  let page_limit = $derived(data?.globals?.page_limit ?? 25);
  let source_branding = $derived(data?.globals?.source_branding ?? true);
  let copyright = $derived(data?.globals?.copyright ?? '\$CC_APP_NAME © \$CURRENT_YEAR');
  let bsky_feed = $derived(data?.globals?.bsky_feed ?? false);
  let bsky_handle = $derived(data?.globals?.bsky_handle ?? '');
  let bsky_feed_limit = $derived(data?.globals?.bsky_feed_limit ?? 6);
  let bsky_feed_message = $derived(data?.globals?.bsky_feed_message ?? "<i class='ph-fill ph-butterfly'></i>\r\n\n[Join us on Bluesky!]($BSKY_LINK)");
  let content_rating = $derived(data?.globals?.content_rating ?? "everyone");
  let warning_popup = $derived(data?.globals?.warning_popup ?? false);
  let warning_title = $derived(data?.globals?.warning_title ?? "Heads up!");
  let warning_message = $derived(data?.globals?.warning_message ?? "This webcomic may feature mature themes, images, and/or text. Viewer discretion is advised.");

  // Display email value
  let content_ratings = $derived(sortBy(data?.content_ratings, ["min_age"]));
	let siteUrl = $derived(data.siteUrl);

  // Display email value
  let showEmail = $state(false);

  // Form element
  let formElement = $state(null);

  // Check for changes in data to unlock save/discard buttons
  let hasChanged = $derived.by(()=>{
    if (
      !isEqual(app_name, data?.globals?.name) ||
      !isEqual(app_desc, data?.globals?.description) ||
      !isEqual(app_subtitle, data?.globals?.subtitle) ||
      !isEqual(app_favicon, data?.globals?.favicon) ||
      !isEqual(app_logo, data?.globals?.logo) ||
      !isEqual(series_branding, data?.globals?.series_branding) ||
      !isEqual(logo_height, data?.globals?.logo_height) ||
      !isEqual(app_width, data?.globals?.width) ||
      !isEqual(format_strip, data?.globals?.format_strip) ||
      !isEqual(format_infinite, data?.globals?.format_infinite) ||
      !isEqual(page_limit, data?.globals?.page_limit) ||
      !isEqual(source_branding, data?.globals?.source_branding) ||
      !isEqual(copyright, data?.globals?.copyright) ||
      !isEqual(bsky_feed, data?.globals?.bsky_feed) ||
      !isEqual(bsky_handle, data?.globals?.bsky_handle) ||
      !isEqual(bsky_feed_limit, data?.globals?.bsky_feed_limit) ||
      !isEqual(bsky_feed_message, data?.globals?.bsky_feed_message) ||
      !isEqual(content_rating, data?.globals?.content_rating) ||
      !isEqual(warning_popup, data?.globals?.warning_popup) ||
      !isEqual(warning_title, data?.globals?.warning_title) ||
      !isEqual(warning_message, data?.globals?.warning_message)
    ) {
      return true;
    }
    return false;
  });

  // Set preview when selecting a new image from the media library.
  function handlePreviewFile(file) {
    app_logo = file; // Replace our preview image with the selected file.
  }

  // Set preview when selecting a new image from the media library.
  function handleFaviconFile(file) {
    app_favicon = file; // Replace our preview image with the selected file.
  }

  // Form submission logic
  const handleSubmit = ({ formData }) => { // `formData` is passed by the `use:enhance` attribute on the form element.
    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      // If the result returned a success state
      if (result?.data?.success === true) {
        // Reload all page data without refresh
        invalidateAll();
        // Display a success toast message
        toastSuccess('Settings updated!'); // ...display a generic success toast for creating/updating the page.
      } else {
        // Display a error toast message
        toastError("Failed to update settings!", result?.data?.error);
      }
    };
  };

  // Discard all changes
  function handleCancel() {
    // Reload all page data without refresh
    invalidateAll();
  };

</script>

<KeyboardControls
  {formElement}
  save
/>

<!-- Main form -->
<Form
	action='/api/actions/globals?/update'
	method="POST"
	enctype="multipart/form-data"
	onSubmit={handleSubmit}
	class="space-y-2 overflow-y-auto"
	bind:element={formElement}
>
	<!-- Default site branding -->
	<FormSection label="App Branding">
		<!-- Preview Image Upload + Preview -->
		<Input
			type="media-import-simple"
			name="app_logo"
			label="App Logo"
			bind:value={app_logo}
			fetchTypes={["image"]}
			accept={[...acceptedFileTypes?.image]}
		>
			{#snippet tooltip()}
				<p class="">The main app logo. Used as a fallback if active series logo is not added.</p>
				<p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
			{/snippet}
		</Input>

		<!-- Preview Image Upload + Preview -->
		<Input
			type="media-import-simple"
			name="app_favicon"
			label="App Favicon"
			bind:value={app_favicon}
			fetchTypes={["image"]}
			accept={[...acceptedFileTypes?.image]}
		>
			{#snippet tooltip()}
				<p class="">The main app favicon (the image on your tabs). Used as a fallback if active series favicon is not added.</p>
				<p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
			{/snippet}

			{#snippet preview()}
				<!-- Custom previews for Favicon -->
				<FaviconPreview img={app_favicon} />
			{/snippet}
		</Input>

		<!-- Use series branding toggle -->
		<Input
			type="checkbox"
			name="series_branding"
			label="Use Series Branding"
			bind:value={series_branding}
		>
			{#snippet tooltip()}
				<p class="">If enabled, uses the active series logo and favicon in place of all global branding.</p>
			{/snippet}
		</Input>
	</FormSection>

	<FormSection>
		<h4 class="h4 leading-none! w-full">App Details</h4>
		<!-- Site name input -->
		<Input type="text" name="app_name" label="App Name" inputClasses="w-full sm:max-w-[50%]" bind:value={app_name}>
			{#snippet tooltip()}
				<p class="">The canonical name of your site, brand, or comic series.</p>
			{/snippet}
		</Input>

		<!-- Site subtitle input -->
		<Input type="text" name="app_subtitle" label="App Subtitle" inputClasses="w-full max-w-prose" bind:value={app_subtitle}>
			{#snippet tooltip()}
				<p class="">The (optional) subtitle of your site, brand, or comic series.</p>
			{/snippet}
		</Input>

		<!-- Site description input -->
		<Input type="textarea" name="app_desc" label="App Description" inputClasses="w-full" bind:value={app_desc}>
			{#snippet tooltip()}
				<p class="">Is displayed on external links. Helps with SEO.</p>
			{/snippet}
		</Input>
		<!-- Site description input -->
		<Input type="textarea" name="copyright" label="App Copyright" inputClasses="w-full" bind:value={copyright}>
			{#snippet tooltip()}
				<p class="">Is displayed on in the footer of your app. This field can utilize "dynamic tags/values."</p>
				<div class="">
					<p class="text-lg font-bold">Supported tags:</p>
					<p class="font-medium text-xs"><span class="font-mono font-bold">$APP_NAME</span> <i class="ph-bold ph-arrow-right"></i> {data?.globals?.name}</p>
					<p class="font-medium text-xs"><span class="font-mono font-bold">$APP_SUBTITLE</span> <i class="ph-bold ph-arrow-right"></i> {data?.globals?.subtitle}</p>
					<p class="font-medium text-xs"><span class="font-mono font-bold">$CURRENT_YEAR</span> <i class="ph-bold ph-arrow-right"></i> {new Date()?.getFullYear()}</p>
					<p class="font-medium text-xs"><span class="font-mono font-bold">$SERIES_NAME</span> <i class="ph-bold ph-arrow-right"></i> {data?.series?.name}</p>
					<p class="font-medium text-xs"><span class="font-mono font-bold">$BSKY_LINK</span> <i class="ph-bold ph-arrow-right"></i> {"https://bsky.app/profile/" + data?.settings?.bsky_handle}</p>
				</div>
			{/snippet}
		</Input>

		<!-- Media warnings input -->
		<Input
			type="select"
			name="content_rating"
			label="Global Media Rating"
			options={content_ratings}
			optionValues="slug"
			allowNull={false}
			bind:value={content_rating}
		>
			{#snippet tooltip()}
				<p class="">Marks the overall age rating for your site and comics.</p>
				<p class="">If your work(s) only sometimes contain more mature media/text, choose the minimum acceptable rating.</p>
				<p class="">For example, if the work(s) are predominantly "Teen", but can reach more mature ratings, choose "Teen" and mark specific work(s) according to their respective age rating.</p>
				<div class="flex flex-col gap-1">
					{#each content_ratings as item}
						<p class="font-bold">{item?.name} - {item?.min_age + "+"}</p>
					{/each}
				</div>
			{/snippet}
		</Input>

		<!-- Warning popup -->
		<Input type="checkbox" name="warning_popup" label="Warning Popup" bind:value={warning_popup}>
			{#snippet tooltip()}
				<p class="">If enabled, it will display a pop-up warning the user about the rating until they close it once.</p>
			{/snippet}
		</Input>

		<!-- Warning message input -->
		<Input type="text" name="warning_title" label="Warning Title" class={warning_popup ? '' : 'hidden'} inputClasses="w-full" bind:value={warning_title}>
			{#snippet tooltip()}
				<p class="">A custom title for your warning pop-up.</p>
			{/snippet}
		</Input>

		<!-- Warning message input -->
		<Input type="textarea" name="warning_message" label="Warning Message" class={warning_popup ? '' : 'hidden'} inputClasses="w-full" bind:value={warning_message}>
			{#snippet tooltip()}
				<p class="">A custom message for your warning pop-up.</p>
			{/snippet}
		</Input>

		<!-- Display Comix Cleric branding -->
		<Input type="checkbox" name="source_branding" label="Show Source" bind:value={source_branding}>
			{#snippet tooltip()}
				<p class="">If enabled, it will display a small call-to-action in the footer of your site saying:</p>
				<p class="font-bold italic">Made with Comix Cleric by Panel Party!</p>
			{/snippet}
		</Input>
	</FormSection>

	<FormSection>
		<h4 class="h4 leading-none! w-full flex items-center gap-2">App Layout</h4>
		
		<!-- App layout input -->
		<Input
			type="select"
			name="app_layout"
			label="App Layout"
			bind:value={app_layout}
			allowNull={false}
			disabled
			options={[{label: 'Default', value: 'default'}]}>
			{#snippet tooltip()}
				<p class="">Controls the general front-end layout of your app.</p>
				<p class="italic text-surface-700-300">(Does not affect the admin panel)</p>
			{/snippet}
			{#snippet after()}
				<p class="text-warning-300-700 inline-flex items-center gap-1"><i class="ph-bold ph-info"></i> Layout settings are being reworked.</p>
			{/snippet}
		</Input>

		<!-- App width input -->
		<Input
			type="text"
			name="app_width"
			label="App Width"
			bind:value={app_width}>
			{#snippet tooltip()}
				<p class="">Controls the maximum width of your app pages.</p>
				<p class="italic text-surface-700-300">(Does not affect the admin panel)</p>
			{/snippet}
		</Input>

		<!-- Logo size input -->
		<Input
			type="text"
			name="logo_height"
			label="Logo Height"
			bind:value={logo_height}>
			{#snippet tooltip()}
				<p class="">Controls the maximum height of your app logos.</p>
				<p class="italic text-surface-700-300">(Currently affects all logos, except within the admin panel)</p>
			{/snippet}
		</Input>

		<!-- Header layout input -->
		<Input
			type="select"
			name="header_layout"
			label="Header Layout"
			bind:value={header_layout}
			allowNull={false}
			options={headerLayouts}
		>
			{#snippet tooltip()}
				<p class="">Controls the layout flow of your site header, excluding on mobile.</p>
				<p class="italic text-surface-700-300">(Does not affect the admin panel)</p>
			{/snippet}
		</Input>
		
		<!-- Homepage route -->
		<!-- <Input
			type="select"
			name="homepage"
			label="Homepage"
			bind:value={header_layout}
			allowNull={false}
			options={["default", "first", "last", "random", "number"]}
		>
			{#snippet tooltip()}
				<p class="">Controls the layout flow of your site header, excluding on mobile.</p>
				<p class="italic text-surface-700-300">(Does not affect the admin panel)</p>
			{/snippet}
		</Input> -->
	</FormSection>

	<!-- Reader Formatting -->
	<FormSection label="Reader Layout">
		<!-- Enable strip formatting -->
		<!-- <Input type="checkbox" name="format_infinite" label="Infinite Scroll" bind:value={format_infinite}>
			{#snippet tooltip()}
				<p class="leading-tight font-bold">Changes the comic reader to flow endlessly!</p>
				<p class="leading-tight font-bold text-warning-700-300">Warning, this will disable certain features.</p>
			{/snippet}
		</Input> -->

		<!-- Maximum reader height (prevents large image overflow) -->
		<Input
			type="text"
			name="reader_width"
			label="Reader Maximum Width"
			bind:value={reader_width}
		>
			{#snippet tooltip()}
				<p class="">Controls the maximum width of your reader component.</p>
				<p class="text-warning-700-300">This will not exceed your app width.</p>
				<p class="italic text-surface-700-300">(Does not affect the admin panel)</p>
			{/snippet}
		</Input>

		<!-- Enable strip formatting -->
		<Input type="checkbox" name="format_strip" label="Comic Strip" bind:value={format_strip} disabled={format_infinite}>
			{#snippet tooltip()}
				<p class="leading-tight font-bold">Changes the comic reader to flow horizontally for comic strips!</p>
				<p class="leading-tight font-bold">This ensures any images that are <span class="italic">very</span> wide don't become unreadable on narrow screens!</p>
				<p class="leading-tight font-bold">This option can also be toggled per-page, this toggle just sets the default value.</p>
				<p class="leading-tight font-bold text-warning-700-300">Right-to-left options will become available with better language support!</p>
			{/snippet}
		</Input>

		<!-- Maximum reader height (prevents large image overflow) -->
		<Input
			type="text"
			name="reader_height"
			label="Reader Maximum Height"
			bind:value={reader_height}
		>
			{#snippet tooltip()}
				<p class="font-medium text-warning-700-300">(Only works with Comic Strip formatting.)</p>
				<p class="">Controls the maximum height of your reader component.</p>
				<p class="italic text-surface-700-300">(Does not affect the admin panel)</p>
			{/snippet}
		</Input>
	</FormSection>

	<!-- Bluesky feed -->
	<FormSection label="Integrated Bluesky Feed">
		<!-- Enable Bluesky feed -->
		<Input
			type="checkbox"
			name="bsky_feed"
			label="Enable Bluesky Feed"
			bind:value={bsky_feed}
		>
			{#snippet tooltip()}
				<p class="">Enables the experimental Bluesky Feed on your home page!</p>
			{/snippet}
		</Input>

		<!-- Bluesky handle -->
		<Input
			type="text"
			name="bsky_handle"
			label="Bluesky Handle"
			placeholder="myusername.bsky.app"
			class={bsky_feed ? '' : 'hidden'}
			inputClasses="max-w-[50%]"
			bind:value={bsky_handle}
		>
			{#snippet tooltip()}
				<p class="">The account you'd like to display posts from.</p>
			{/snippet}
		</Input>

		<!-- Bluesky feed limit -->
		<Input
			type="number"
			name="bsky_feed_limit"
			label="Feed Limit"
			class={bsky_feed ? '' : 'hidden'}
			inputClasses="max-w-32"
			bind:value={bsky_feed_limit}
		>
			{#snippet tooltip()}
				<p class="">The maximum number of posts that will be fetched.</p>
				<p class="">Pagination is not planned at this time.</p>
			{/snippet}
		</Input>

		<!-- Bluesky end-of-feed message -->
		<Input
			type="textarea"
			name="bsky_feed_message"
			label="End of Feed Message"
			class={bsky_feed ? '' : 'hidden'}
			inputClasses="max-w-full"
			bind:value={bsky_feed_message}
		>
			{#snippet tooltip()}
				<p class="">The maximum number of posts that will be fetched.</p>
				<p class="">Pagination is not planned at this time.</p>
			{/snippet}
		</Input>

		<!-- Notice -->
		<Alert message="This section will likely be changed to allow for any ATProto service so you aren't limited to Bluesky." preset="success" class="max-w-full!" />
	</FormSection>

	<!-- App Info section -->
	<FormSection label="App Info">
		<!-- Site URL (readonly) -->
		<Input type="readonly" label="Public App URL" value={siteUrl}>
			{#snippet tooltip()}
				<p class="">The URL on which your app is displayed. (Set automatically.)</p>
			{/snippet}
		</Input>
	</FormSection>

	<!-- Archive settings -->
	<FormSection label="Archive Settings">
		<!-- Pagination limit input -->
		<Input type="number" name="page_limit" label="Default Page Limit" bind:value={page_limit} inputClasses="max-w-32">
			{#snippet tooltip()}
				<p class="">The maximum number of items returned per page when using pagination.</p>
			{/snippet}
		</Input>
	</FormSection>

	<!-- Danger zone (dangerous settings) -->
	{#if false}
	<!-- Accordion menu component (Skeleton UI) -->
	<Accordion collapsible>
		<Accordion.Item
			controlClasses="w-full text-error-950-50 text-base font-semibold bg-error-300-700/40 hover:bg-error-300-700 hover:text-surface-50"
			panelClasses="w-full bg-error-300-700/40 py-4 border-t border-error-700-300 space-y-8 lg:space-y-4 rounded-b-md"
		>
			<!-- Trigger -->
			{#snippet control()}Danger Zone{/snippet}
			<!-- Contents -->
			{#snippet panel()}
			<!-- <Input
				type="checkbox"
				name="feedback-negative"
				label="Display Negative Fields"
				disabled
			>
				{#snippet tooltip()}
					<p class="leading-tight font-medium">Due to mental health concerns and a desire to put a bigger spotlight on the art rather than the numbers, we have chosen to hide some feedback and statistics by default.</p>
					<p>Enabling this option does not display them automatically. Check Feedback settings for more options.</p>
					<div class="">
						<p class="font-bold mb-1">Examples:</p>
						<ul class="list-disc list-inside mb-1">
							<li>Dislikes/Dislike Count</li>
							<li>Profanity</li>
						</ul>
					</div>
				{/snippet}
			</Input>

			<hr class="hr my-4 border-error-500"> -->

			<!-- Warning notice -->
			<div class="bg-error-100-900 bg-danger text-error-700-300 border border-error-500 p-2 rounded-lg">
				<p class="text-sm font-medium px-3 py-2 bg-error-950 border border-error-500 rounded-md">These settings <span class="underline font-bold">will</span> cause irreversible effects, please read each description carefully!</p>
			</div>

			<!-- Delete all updates -->
			<!-- TODO: Create action in (api) directory -->
			<div class="flex flex-col">
				<DeleteConfirm
					title="All Updates"
					label="Delete All Updates"
					formAction="/api/actions/updates?/deleteAll"
					class="w-fit! min-w-32"
				/>
				<span class="text-xs text-error-700-300 leading-tight mt-1">Will remove ALL Comic Update records from the server.</span>
			</div>

			<!-- Delete all chapters -->
			<!-- TODO: Create action in (api) directory -->
			<div class="flex flex-col">
				<DeleteConfirm
					title="All Chapters"
					label="Delete All Chapters"
					formAction="/api/actions/chapters?/deleteAll"
					class="w-fit! min-w-32"
				/>
				<span class="text-xs text-error-700-300 leading-tight mt-1">Will remove ALL Chapter records from the server.</span>
			</div>

			<!-- Delete all volumes -->
			<!-- TODO: Create action in (api) directory -->
			<div class="flex flex-col">
				<DeleteConfirm
					title="All Volumes"
					label="Delete All Volumes"
					formAction="/api/actions/volumes?/deleteAll"
					class="w-fit! min-w-32"
				/>
				<span class="text-xs text-error-700-300 leading-tight mt-1">Will remove ALL Volume records from the server.</span>
			</div>

			<!-- Delete all series -->
			<!-- TODO: Create action in (api) directory -->
			<div class="flex flex-col">
				<DeleteConfirm
					title="All Series"
					label="Delete All Series"
					formAction="/api/actions/series?/deleteAll"
					class="w-fit! min-w-32"
				/>
				<span class="text-xs text-error-700-300 leading-tight mt-1">Will remove ALL Series records from the server.</span>
			</div>

			<!-- Delete all blogs -->
			<!-- TODO: Create action in (api) directory -->
			<div class="flex flex-col">
				<DeleteConfirm
					title="All Blogs"
					label="Delete All Blogs"
					formAction="/api/actions/blogs?/deleteAll"
					class="w-fit! min-w-32"
				/>
				<span class="text-xs text-error-700-300 leading-tight mt-1">Will remove ALL Blog records from the server.</span>
			</div>

			<!-- Delete all cast -->
			<!-- TODO: Create action in (api) directory -->
			<div class="flex flex-col">
				<DeleteConfirm
					title="All Cast"
					label="Delete All Cast"
					formAction="/api/actions/cast?/deleteAll"
					class="w-fit! min-w-32"
				/>
				<span class="text-xs text-error-700-300 leading-tight mt-1">Will remove ALL Cast records from the server.</span>
			</div>

			<!-- Delete all gallery -->
			<!-- TODO: Create action in (api) directory -->
			<div class="flex flex-col">
				<DeleteConfirm
					title="All Gallery Items"
					label="Delete All Gallery Items"
					formAction="/api/actions/gallery?/deleteAll"
					class="w-fit! min-w-32"
				/>
				<span class="text-xs text-error-700-300 leading-tight mt-1">Will remove ALL Gallery records from the server.</span>
			</div>

			<!-- Full app reset -->
			<!-- TODO: Create action in (api) directory -->
			<div class="flex flex-col">
				<DeleteConfirm
					title="EVERYTHING"
					label="Full Reset"
					formAction="/api/actions/collections?/deleteAll"
					class="w-fit! min-w-32"
				/>
				<span class="text-xs text-error-700-300 leading-tight mt-1">Will restore your site to the moment it was created. All settings will be reset, and all entries created or uploaded to the database will be permanently destroyed.</span>
			</div>
			{/snippet}
		</Accordion.Item>
	</Accordion>
	{/if}

	<!-- Footer controls (sticky) -->
	{#snippet controls()}
		<FormControls disabled={!hasChanged} handleDiscard={handleCancel} />
	{/snippet}
</Form>