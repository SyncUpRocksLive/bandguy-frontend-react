<script lang="ts">
	// Main mixing room components will be added here
	import Header from './lib/Header.svelte';
	import Home from './lib/areas/Home.svelte';
	import { appState } from './State.svelte';
</script>

<Header />

  {#await import(`./lib/areas/${appState.ui.area}.svelte`)}
    <p>Loading...</p>
  {:then module}
    <svelte:component this={module.default} />
  {:catch}
    <p>Could not load view {appState.ui.area}</p>
	<button onclick={() => appState.setView('Home')}>Go Home</button>
  {/await}

<footer id="spacer"></footer>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	footer {
		grid-area: spacer;
	}

</style>
