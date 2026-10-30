// -- Utilities for handling media URLs and file previews. -- //

// Converts a standard YouTube watch URL to the embed format needed for iframes.
// Non-YouTube URLs are returned unchanged.
export function setEmbed(url) {
  if (url?.startsWith("https://www.youtube.com/watch?v=")) {
    return url.split("&")[0].replace("watch?v=", "embed/");
  }

  return url;
}

// Used with Skeleton UI file upload components
// TODO: May be incomplete
export function generatePreview(event) {
  const reader = new FileReader();

  reader.onload = (event) => {
    const image = event.target.result;
  };

  reader.readAsDataURL(event.details.acceptedFiles[0]);
}
