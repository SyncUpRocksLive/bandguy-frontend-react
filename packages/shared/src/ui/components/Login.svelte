<script lang="ts">
	import { auth } from '@shared/ui/stores/Auth.svelte';

	const returnUrl = window.location.pathname + window.location.search + window.location.hash;

	const handleLogin = () => auth.login(returnUrl);
</script>

<section class="login-shell">
	<div class="login-card">
		<div class="login-header">
			<span class="login-badge">Sync Up Rocks Live!</span>
			<h2>Welcome back.</h2>
			<p>Sign in to access your saved songs, setlists, and live session settings.</p>
		</div>

		<button class="login-button" on:click={handleLogin}>
			Go to login
		</button>
	</div>
</section>

<style>
	.login-shell {
		height: 100%;
		display: grid;
		place-items: center;
		padding: 2rem;
		background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 28%),
			radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.14), transparent 25%),
			linear-gradient(180deg, #273d5450 0%, #2d60a37d 90%);
	}

	.login-card {
		width: min(100%, 440px);
		padding: 2rem;
		border-radius: 1.75rem;
		background: rgba(255, 255, 255, 0.94);
		box-shadow: 0 32px 80px rgba(15, 23, 42, 0.12);
		border: 1px solid rgba(148, 163, 184, 0.18);
		backdrop-filter: blur(12px);
	}

	.login-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.login-badge {
		display: inline-flex;
		padding: 0.45rem 0.85rem;
		margin-bottom: 1rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		border-radius: 999px;
		background: rgba(59, 130, 246, 0.16);
		color: #1e3a8a;
	}

	h2 {
		margin: 0;
		font-size: clamp(2rem, 2.5vw, 2.6rem);
		line-height: 1.05;
		color: #0f172a;
	}

	p {
		margin: 1rem auto 0;
		max-width: 34rem;
		font-size: 1rem;
		line-height: 1.75;
		color: #475569;
	}

	.login-button {
		width: 100%;
		padding: 1.15rem 1.4rem;
		font-size: 1rem;
		font-weight: 700;
		color: white;
		background: linear-gradient(135deg, #2563eb, #1d4ed8);
		border: none;
		border-radius: 1rem;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
		box-shadow: 0 18px 32px rgba(37, 99, 235, 0.2);
		margin-top: 1.5rem;
	}

	.login-button:hover {
		transform: translateY(-1px);
		filter: brightness(1.04);
		box-shadow: 0 22px 42px rgba(37, 99, 235, 0.22);
	}

	.login-button:active {
		transform: translateY(0);
	}

	@media (max-width: 580px) {
		.login-card {
			padding: 1.5rem;
		}

		.login-badge {
			font-size: 0.75rem;
			padding: 0.4rem 0.75rem;
		}

		.login-button {
			padding: 1rem 1.2rem;
			font-size: 0.97rem;
		}
	}
</style>
