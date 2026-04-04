<script>
	import { appState } from "../../State.svelte";

</script>

<p>Song Library</p>
<button onclick={() => appState.setView('Home')}>Go Home</button>
