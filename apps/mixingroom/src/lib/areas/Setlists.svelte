<script lang="ts">
	import { auth } from "@/Auth.svelte";
	import { getSetsOverview } from "@shared/services/syncuprocks/musician/Api";
	import type { SetOverview } from "@shared/services/syncuprocks/musician/Types";
	import Upload from "./components/setlist/Upload.svelte";

	let sets: SetOverview[] = [];
	let selectedSet: SetOverview | null = null;
	let loading = false;
	let error: string | null = null;
	let searchQuery = '';

	// Mock tags for each setlist
	const mockTags: Record<number, string[]> = {
		1: ['rock', 'wedding'],
		2: ['ska', 'punk'],
		3: ['jazz', 'blues'],
		4: ['pop', 'cover']
	};

	// Reactive statement to fetch sets when user changes
	$: if (auth.user?.userId) {
		fetchSets();
	}

	// Filter sets based on search query
	$: filteredSets = sets.filter(set => 
		set.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	async function fetchSets() {
		if (!auth.user?.userId) return;
		
		loading = true;
		error = null;
		try {
			const result = await getSetsOverview(auth.user.userId);
			if (result.ok) {
				sets = result.value;
			} else {
				error = result.error.message;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			loading = false;
		}
	}

	function selectSet(set: SetOverview) {
		selectedSet = set;
		// TODO: Handle selection, e.g., navigate to set details or something
		console.log('Selected set:', set);
	}

	function getTags(setId: number): string[] {
		return mockTags[setId] || ['untagged'];
	}
</script>

<div class="setlist-library">
	<h3>Setlists</h3>

	<section class="setlist-header">
		<div class="upload-section">
			<Upload />
		</div>
	</section>

	<section class="setlist-search">
		<input
			type="text"
			placeholder="Search setlists..."
			bind:value={searchQuery}
			class="search-input"
		/>
	</section>

	<section class="setlist-items">
		{#if loading}
			<p>Loading setlists...</p>
		{:else if error}
			<p>Error: {error}</p>
		{:else if sets.length === 0}
			<p>No setlists found.</p>
		{:else}
			<div class="setlist-table">
				<div class="setlist-row header-row">
					<div class="col col-name">Name</div>
					<div class="col col-created">Created</div>
					<div class="col col-songs">Songs</div>
					<div class="col col-tags">Tags</div>
				</div>
				{#each filteredSets as set (set.id)}
					<div 
						class="setlist-row" 
						class:selected={selectedSet?.id === set.id} 
						onclick={() => selectSet(set)}
					>
						<div class="col col-name">{set.name}</div>
						<div class="col col-created">{new Date(set.createdAtMsUtc).toLocaleDateString()}</div>
						<div class="col col-songs">{set.songs.length}</div>
						<div class="col col-tags">
							<div class="tags">
								{#each getTags(set.id) as tag}
									<span class="tag">{tag}</span>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

</div>

<style>
	.setlist-library {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 0 2rem;
		margin: 0;
	}

	h3 {
		margin: 1rem 0;
		flex-shrink: 0;
	}

	.setlist-header {
		flex-shrink: 0;
		margin-bottom: 1.5rem;
	}

	.upload-section {
		display: flex;
		gap: 1rem;
	}

	.setlist-search {
		flex-shrink: 0;
		margin-bottom: 1.5rem;
	}

	.search-input {
		width: 100%;
		max-width: 300px;
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
	}

	.search-input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}

	.setlist-items {
		flex: 1;
		overflow-y: auto;
		min-height: 0;
	}

	.setlist-table {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.setlist-row {
		display: grid;
		grid-template-columns: 2fr 1fr 0.75fr 1.5fr;
		gap: 1rem;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
		align-items: center;
	}

	.setlist-row.header-row {
		background-color: #0701016b;
		font-weight: bold;
		cursor: default;
		border-color: #999;
	}

	.setlist-row:not(.header-row):hover {
		background-color: #f9f9f965;
	}

	.setlist-row.selected {
		background-color: #054f8468;
		border-color: #007bff;
	}

	.col {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.col-name {
		font-weight: 500;
	}

	.col-created {
		text-align: center;
		font-size: 0.9rem;
	}

	.col-songs {
		text-align: center;
		font-size: 0.9rem;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		background-color: #e0e0e0;
		border-radius: 12px;
		font-size: 0.75rem;
		color: #333;
	}
</style>
