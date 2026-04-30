<script lang="ts">
	import { syncStore } from '@/Stores/SyncStore.svelte';
	import { msToHMS } from '@shared/display/DisplayHelpers'
</script>

<div>
	{$syncStore.currentSongPlabackTimeSeconds ? msToHMS($syncStore.currentSongPlabackTimeSeconds * 1000) : '--:--' } / 
	{$syncStore.currentSong ? msToHMS($syncStore.currentSong.durationMilliseconds) : '--:--' } - {$syncStore.currentSong?.name ?? '--'}
</div>
