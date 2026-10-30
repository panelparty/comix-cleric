// -- This file contains references to any components that need to be used externally. -- //
// NOTE: Will be used when starting to implement block-building for web pages.

// Import components
import ComingSoon from "./Placeholders/ComingSoon.svelte";
import Hero from "./DataBlocks/Hero.svelte";
import ArchivePreview from "./DataBlocks/ArchivePreview.svelte";
import Loader from "./Placeholders/Loader.svelte";
import Login from "./Auth/Login.svelte";
import Section from "./DataBlocks/Section.svelte";

// Export registered components
// NOTE: This basically creates an alias we can use to get the component.
// To use this, simply import `registry`.
// Then, get the value of the component you want to use like this: `registry.coming_soon`

export const registry = {
  // -- Placeholder components -- //
  coming_soon: ComingSoon,
  loader: Loader,


  // -- Layout components -- //
  section: Section,


  // -- Preview Components -- //
  hero: Hero,
  archive_preview: ArchivePreview,
  // blog_preview: BlogPreview,
  // feed_preview: FeedPreview,
  // gallery_preview: GalleryPreview,
  // cast_preview: CastPreview,


  // -- Authentication components -- //
  login_button: Login,
};
