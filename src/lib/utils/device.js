// -- Utilities for detecting what kind of device the user is on -- //
// NOTE: This is useful for mobile-only features.

// Returns an object of booleans describing the current device type,
// based on the browser's userAgent string.
export function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();

  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /ipad|android(?!.*mobile)/i.test(ua);

  return {
    isMobile: isMobile && !isTablet,
    isTablet: isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}
