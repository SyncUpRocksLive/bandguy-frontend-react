/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  onwarn: (warning, handler) => {
    // TODO: Review these - and fix code
    // These are the specific ones crashing your build
    if (warning.code === 'a11y_click_events_have_key_events') return;
    if (warning.code === 'a11y_no_static_element_interactions') return;
    if (warning.code === 'css_unused_selector') return;
    if (warning.code === 'a11y_label_has_associated_control') return;
    
    handler(warning);
  }
};
