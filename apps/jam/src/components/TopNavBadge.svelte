<script lang="ts">
	import { syncStore } from '@/Stores/SyncStore.svelte';
	import { msToHMS } from '@shared/display/DisplayHelpers'
</script>

<div>
	[ {msToHMS($syncStore.plabackTimeMilliseconds) } :
	{$syncStore.currentSong ? msToHMS($syncStore.currentSong.durationMilliseconds) : '--:--' } ] {$syncStore.currentSong?.name ?? '--'}
</div>

