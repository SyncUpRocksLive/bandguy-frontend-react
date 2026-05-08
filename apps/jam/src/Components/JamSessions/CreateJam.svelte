<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { auth } from '@/Auth.svelte';
	import { peerStore } from "@/Stores/PeerStore.svelte";
	import { JamChannels, type JamChannelDetail } from '@shared/services/syncuprocks/musician/JamChannels';
	import { LogError, LogInfo } from '@shared/services/Logger';
	import { onMount } from 'svelte';

	let joinCode = $state('1234');
	let channelName = $state('');

	const mutation = createMutation(() => ({
        mutationFn: async (code: string) => {
            return await JamChannels.createChannel({
				hostUser: auth.user!.userId,
				identifier: channelName,
				friendlyName: channelName,
				timestamp: Date.now()
			});
        },
        onSuccess: (data) => {
            LogInfo(`Channel Created: ${data}`, 'CreateJam');
			peerStore.updateState({
				connectedChannelDetail: data!
			});
        },
        onError: (err) => {
            LogError(`Failed to create channel: ${err}`, 'CreateJam');
        }
    }));

	function createChannel() {
		if (!joinCode || !channelName || mutation.isPending) return;
        
		mutation.mutate(joinCode);
	}

	onMount(() => {
		channelName = auth.user ? `${auth.user.username}'s Jam` : 'My Jam';
	});

</script>

<div class="band-join-container">
	<div class="band-header">
		<p class="band-title">Channel Creation</p>
	</div>

	<div class="band-content">
		<div class="code-input-section">
			<input
				type="text"
				placeholder="Enter channel name"
				bind:value={channelName}
				onkeydown={(e) => {
					if (e.key === 'Enter') createChannel();
				}}
				class="code-input"
			/>
			<input
				type="text"
				placeholder="Enter join code"
				bind:value={joinCode}
				onkeydown={(e) => {
					if (e.key === 'Enter') createChannel();
				}}
				class="code-input"
			/>
			<button onclick={createChannel} class="code-submit">
				{#if mutation.isPending}
                    <span class="spinner"></span> 
                {:else}
                    Create Channel
                {/if}
			</button>
		</div>

		{#if mutation.isError}
            <p class="error-text">Error: {mutation.error.message}</p>
        {/if}
	</div>
</div>

<style>
	.spinner {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

	.band-join-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: rgba(0, 0, 0, 0.9);
		color: white;
		overflow: hidden;
	}

	.band-header {
		background: rgba(255, 255, 255, 0.7);
		padding: 0.5rem;
		text-align: center;
	}

	.band-title {
		font-weight: bold;
		margin: 0;
		padding: 0;
		color: black;
	}

	.band-content {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.error-text {
		text-align: center;
		color: #f00;
	}

	.code-input-section {
		display: flex;
		gap: 0.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		padding-top: 1rem;
	}

	.code-input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 0.25rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 1rem;
	}

	.code-input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.code-input:focus {
		outline: none;
		border-color: #007bff;
		background: rgba(0, 0, 0, 0.7);
	}

	.code-submit {
		padding: 0.5rem 1rem;
		background: #28a745;
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 1rem;
		transition: background 0.2s;
	}

	.code-submit:hover {
		background: #218838;
	}
</style>
