/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // TODO ... your other config (preprocess, etc.)
  onwarn: (warning, handler) => {
    // List of warnings to completely ignore
    const ignoredWarnings = [
      'css_unused_selector',
      'a11y_click_events_have_key_events',
      'a11y_no_static_element_interactions',
      'state_referenced_locally'
    ];

    if (ignoredWarnings.includes(warning.code)) return;

    // For everything else, use the default handler
    handler(warning);
  }
};
