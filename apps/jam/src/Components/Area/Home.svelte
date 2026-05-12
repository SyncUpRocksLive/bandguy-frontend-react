<script lang="ts">
	import { router } from '@/Router.svelte';
</script>

<div class="home-container">
	<div class="hero-panel">
		<div class="hero-copy">
			<p class="eyebrow">Ready to jam?</p>
			<h1>Choose your jam mode</h1>
			<p class="hero-subtitle">
				Pick the right session for your vibe — solo practice, hosting friends, or joining a live room.
			</p>
		</div>

		<div class="button-grid">
			<button class="home-button primary" onclick={() => router.navigate('SoloSets')}>
				Jam Solo
			</button>

			<button class="home-button success" onclick={() => router.navigate('HostSets')}>
				Start a Jam!
			</button>

			<button class="home-button warning" onclick={() => router.navigate('Guest')}>
				Join a Jam!
			</button>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: radial-gradient(circle at top left, rgba(52, 120, 246, 0.16), transparent 30%),
			linear-gradient(180deg, #0d111b 0%, #121827 100%);
		color: #f8fafc;
	}

	.home-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.25rem;
	}

	.hero-panel {
		width: min(100%, 980px);
		padding: clamp(2rem, 3vw, 3rem);
		border-radius: 2rem;
		background: rgba(15, 23, 42, 0.94);
		box-shadow: 0 30px 80px rgba(15, 23, 42, 0.45);
		border: 1px solid rgba(148, 163, 184, 0.16);
		backdrop-filter: blur(14px);
	}

	.hero-copy {
		max-width: 680px;
		margin: 0 auto 2rem;
		text-align: center;
	}

	.eyebrow {
		margin: 0 0 0.75rem;
		font-size: 0.9rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		font-weight: 700;
		color: #60a5fa;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.1rem, 3.4vw, 3.6rem);
		line-height: 1.03;
		letter-spacing: -0.04em;
	}

	.hero-subtitle {
		margin: 1rem auto 0;
		max-width: 620px;
		font-size: 1rem;
		line-height: 1.8;
		color: #cbd5e1;
	}

	.button-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.home-button {
		width: 100%;
		padding: 1.15rem 1.4rem;
		font-size: 1rem;
		font-weight: 700;
		border: none;
		border-radius: 1rem;
		cursor: pointer;
		transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
		color: white;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
	}

	.home-button:hover {
		transform: translateY(-2px);
		filter: brightness(1.05);
		box-shadow: 0 18px 40px rgba(15, 23, 42, 0.22);
	}

	.home-button:active {
		transform: translateY(0);
	}

	.primary {
		background: linear-gradient(135deg, #3b82f6, #2563eb);
	}

	.success {
		background: linear-gradient(135deg, #22c55e, #16a34a);
	}

	.warning {
		background: linear-gradient(135deg, #facc15, #ea580c);
		color: #111827;
	}

	@media (max-width: 840px) {
		.hero-panel {
			padding: 2rem;
		}

		.button-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 620px) {
		.home-container {
			padding: 1.5rem 1rem;
		}

		.hero-copy {
			margin-bottom: 1.5rem;
		}

		.button-grid {
			grid-template-columns: 1fr;
		}

		.home-button {
			padding: 1rem 1.1rem;
		}
	}
</style>

