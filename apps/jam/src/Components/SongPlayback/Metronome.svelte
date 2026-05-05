<script lang="ts">
  /**
   * JamSyncComponent.svelte
   * Ported to Svelte for the band management platform.
   * Handles: 4/4 Time, 16th note subdivisions, and drift-quantized markers.
   */
  import { derived } from 'svelte/store';
  // Assuming syncStore is imported from your local store file
  import { syncStore } from '@/Stores/SyncStore.svelte';

  // Props to determine the layout mode
  export let mode: 'drummer' | 'tablet' | 'phone' = 'drummer';

  /**
   * Reactive state derived from the syncStore.
   * Uses playbackTimeMilliseconds and markers to calculate quantized position.
   */
  const displayState = derived(syncStore, ($s) => {
    const playbackTime = $s.playbackTimeMilliseconds || 0;
    const totalDuration = $s.currentSong?.durationMilliseconds || 1;
    const markers = $s.currentSongMarkers || [
  { "timeMs": 0, "beat": 1, "type": "Intro" },
  { "timeMs": 2353, "beat": 5, "type": "Intro" },
  { "timeMs": 4706, "beat": 9, "type": "Intro" },
  { "timeMs": 7059, "beat": 13, "type": "Intro" },
  { "timeMs": 9350, "beat": 17, "type": "Verse 1" }, 
  { "timeMs": 11700, "beat": 21, "type": "Verse 1" },
  { "timeMs": 14050, "beat": 25, "type": "Verse 1" },
  { "timeMs": 16400, "beat": 29, "type": "Verse 1" },
  { "timeMs": 18753, "beat": 33, "type": "Verse 1" },
  { "timeMs": 21106, "beat": 37, "type": "Verse 1" },
  { "timeMs": 23459, "beat": 41, "type": "Verse 1" },
  { "timeMs": 25812, "beat": 45, "type": "Verse 1" },
  { "timeMs": 28100, "beat": 49, "type": "Chorus 1" }, 
  { "timeMs": 30453, "beat": 53, "type": "Chorus 1" },
  { "timeMs": 32806, "beat": 57, "type": "Chorus 1" },
  { "timeMs": 35159, "beat": 61, "type": "Chorus 1" },
  { "timeMs": 37512, "beat": 65, "type": "Chorus 1" },
  { "timeMs": 39865, "beat": 69, "type": "Chorus 1" },
  { "timeMs": 42218, "beat": 73, "type": "Chorus 1" },
  { "timeMs": 44571, "beat": 77, "type": "Chorus 1" },
  { "timeMs": 47000, "beat": 81, "type": "Bridge" }, 
  { "timeMs": 49353, "beat": 85, "type": "Bridge" },
  { "timeMs": 51706, "beat": 89, "type": "Bridge" },
  { "timeMs": 54059, "beat": 93, "type": "Bridge" },
  { "timeMs": 56412, "beat": 97, "type": "Outro" },
  { "timeMs": 58765, "beat": 101, "type": "Outro" }
];

    // 1. Find anchor points for quantization (Drift handling)
    const nextIndex = markers.findIndex(m => m.timeMs > playbackTime);
    const prev = markers[nextIndex - 1] || { timeMs: 0, beat: 1, type: 'Intro' };
    const next = markers[nextIndex] || { timeMs: totalDuration, beat: prev.beat + 4, type: 'End' };

    // 2. Interpolate progress within the current warped segment
    const segmentDuration = next.timeMs - prev.timeMs;
    const timeInSegment = playbackTime - prev.timeMs;
    const segmentProgress = Math.max(0, Math.min(1, timeInSegment / (segmentDuration || 1)));
    
    // 3. Calculate exact musical position
    const beatsInSegment = next.beat - prev.beat;
    const exactBeatPosition = prev.beat + (segmentProgress * beatsInSegment);

    // 4. Determine rhythmic components for 4/4
    const barBeat = ((Math.floor(exactBeatPosition - 1)) % 4) + 1;
    const isDownbeat = barBeat === 1 && (exactBeatPosition % 1) < 0.25;

    // 5. 16th note subdivisions (1 e & a)
    const subIndex = Math.floor((exactBeatPosition % 1) * 4);
    const subLabels = ['', 'e', '&', 'a'];

    return {
      displayBeat: barBeat,
      subdivision: subLabels[subIndex],
      isDownbeat,
      rotation: segmentProgress * 360,
      songProgress: (playbackTime / totalDuration) * 100,
      currentSection: prev.type,
      nextSection: next.type
    };
  });

  // UI Theme Constants
  const colors = {
    bg: '#0a0b10',
    cobalt: '#3b82f6',
    electric: '#60a5fa',
    dark: '#1e293b'
  };
</script>

<div class="jam-container {mode}" style="--bg: {colors.bg}; --primary: {colors.cobalt}; --accent: {colors.electric};">
  
  {#if mode === 'drummer'}
    <div class="drummer-layout">
      <!-- VISUAL METRONOME COCKPIT -->
      <div class="ring-system">
        <svg viewBox="0 0 100 100">
          <!-- Outer Ring: Total Song Progress -->
          <circle class="track" cx="50" cy="50" r="48" />
          <circle 
            class="progress-outer" 
            cx="50" cy="50" r="48" 
            style="stroke-dasharray: {$displayState.songProgress * 3.01} 301" 
          />

          <!-- Middle Ring: Quarter Note Segments (1 2 3 4) -->
          <circle 
            class="segments-base" 
            cx="50" cy="50" r="38" 
            style="stroke-dasharray: 58 2; stroke-dashoffset: 29;" 
          />
          <circle 
            class="segment-active" 
            cx="50" cy="50" r="38"
            style="
              stroke-dasharray: 58 181; 
              transform: rotate({($displayState.displayBeat - 1) * 90 - 90}deg);
              transform-origin: center;
            "
          />

          <!-- Center Orb: Downbeat Pulse -->
          <circle 
            class="center-orb" 
            class:pulse={$displayState.isDownbeat} 
            cx="50" cy="50" r="12" 
          />

          <!-- Groove Sweep: Subdivisions -->
          <line 
            class="sweep"
            x1="50" y1="50" x2="50" y2="5" 
            transform="rotate({$displayState.rotation} 50 50)" 
          />
        </svg>

        <!-- BEAT READOUT -->
        <div class="count-overlay">
          <span class="main-num" class:highlight={$displayState.isDownbeat}>
            {$displayState.displayBeat}
          </span>
          <span class="sub-num">
            {$displayState.subdivision}
          </span>
        </div>
      </div>

      <!-- METADATA -->
      <div class="info-footer">
        <div class="section-badge">{$displayState.currentSection}</div>
        <div class="next-cue">NEXT: {$displayState.nextSection}</div>
      </div>
    </div>

  {:else if mode === 'tablet'}
    <div class="tablet-layout">
      <div class="side-strip">
        <div class="mini-beat">{$displayState.displayBeat}</div>
        <div class="progress-bar-vertical">
          <div class="fill" style="height: {$displayState.songProgress}%"></div>
        </div>
      </div>
      <div class="main-content">
        <slot name="content"><!-- Render Tabs or Lyrics here --></slot>
      </div>
    </div>

  {:else}
    <div class="phone-layout">
      <div class="top-meta">
         <span>{$displayState.currentSection}</span>
         <span class="next-label">➔ {$displayState.nextSection}</span>
      </div>
      <div class="lyrics-view">
        <slot name="lyrics"></slot>
      </div>
      <div class="compact-pulse" class:active={$displayState.isDownbeat}>
        {$displayState.displayBeat}{$displayState.subdivision}
      </div>
    </div>
  {/if}
</div>

<style>
  .jam-container {
    background: var(--bg);
    color: #fff;
    font-family: 'Inter', sans-serif;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  /* DRUMMER MODE STYLES */
  .drummer-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
  }

  .ring-system {
    position: relative;
    width: 85vmin;
    height: 85vmin;
  }

  svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  circle { fill: none; stroke-linecap: round; }
  
  .track { stroke: #1e293b; stroke-width: 1; }
  .progress-outer { stroke: var(--primary); stroke-width: 2; transition: stroke-dasharray 0.3s ease; }
  
  .segments-base { stroke: #1e293b; stroke-width: 8; }
  .segment-active { stroke: #fff; stroke-width: 10; transition: transform 0.1s ease-out; }

  .center-orb { fill: #1e293b; transition: all 0.1s ease; }
  .center-orb.pulse { fill: var(--primary); filter: drop-shadow(0 0 20px var(--primary)); }

  .sweep { stroke: var(--accent); stroke-width: 2; stroke-linecap: round; }

  .count-overlay {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    display: flex; align-items: baseline; gap: 0.5rem;
  }

  .main-num { font-size: 20rem; font-weight: 900; line-height: 1; }
  .main-num.highlight { color: var(--primary); text-shadow: 0 0 50px rgba(59,130,246,0.5); }
  .sub-num { font-size: 8rem; font-weight: 300; color: var(--accent); width: 6rem; }

  .info-footer {
    margin-top: 2rem;
    display: flex; gap: 2rem; align-items: center;
  }

  .section-badge { background: #1e3a8a; padding: 0.5rem 1.5rem; border-radius: 99px; font-weight: bold; }
  .next-cue { color: #94a3b8; font-weight: 500; letter-spacing: 0.05em; }

  /* TABLET/PHONE ADAPTATIONS */
  .tablet-layout { display: flex; height: 100%; }
  .side-strip { width: 80px; background: #0f172a; display: flex; flex-direction: column; align-items: center; padding: 1rem 0; }
  .mini-beat { font-size: 3rem; font-weight: 900; color: var(--primary); }

  .phone-layout { display: grid; grid-template-rows: auto 1fr auto; height: 100%; padding: 1rem; }
  .compact-pulse { background: var(--primary); padding: 1rem; text-align: center; font-size: 2rem; font-weight: bold; }
  .compact-pulse.active { background: #fff; color: var(--primary); }
</style>
