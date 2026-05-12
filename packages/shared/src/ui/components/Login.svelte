<script lang="ts">
	import { auth } from "@shared/ui/stores/Auth.svelte";

	const returnUrl = window.location.pathname + window.location.search + window.location.hash;

</script>

<section id="center">
	<div class="login-container">
		<h2>Welcome to the Mixing Room</h2>
		<p>Please log in to access your music library, setlists, and more.</p>
		<button class="login-btn" on:click={() => auth.login(returnUrl)}>Log In</button>
	</div>
</section>

<style>
	.login-container {
		color: black;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 5px;
		padding: 5px;
	}

	.login-container h2 {
		font-weight: bold;
	}

	#center p {
		font-size: 1rem;
		margin: 0.5rem 0;
		color: black;
	}

</style>
