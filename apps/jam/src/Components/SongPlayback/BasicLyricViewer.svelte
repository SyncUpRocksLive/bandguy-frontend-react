<script lang="ts">
import type { Line, Lyric, Word } from '@shared/parsers/lyrics/Lyrics';
import { LyricFormatVersion } from '@shared/parsers/lyrics/Lyrics';

	const LinesPerGroup = 2;
	const VisibleGroups = 2;

	interface LyricGroup {
		groupRow: number;
		groupIndex: number;
		start: number;
		end: number;
		alpha: number;
		duration: number;
		lyricLines: Line[];
	}

	interface Props {
		lyrics: Lyric;
		tick: number;
	}

	let { lyrics, tick }: Props = $props();

	let groupData: LyricGroup[] = $state([]);
	let visibleGroups: LyricGroup[] = $state([]);

	function isLineActive(line: Line) {
		return tick >= line.time && tick < line.time + line.duration;
	}

	const LeadIndicatorThreshold = 2000;

	function isWordActive(word: Word) {
		return tick >= word.time && tick < word.time + word.duration;
	}

	function getNextUpcomingLine() {
		if (!lyrics || !lyrics.lines || lyrics.lines.length === 0) {
			return null;
		}
		return lyrics.lines.find(line => line.time > tick) ?? null;
	}

	function shouldShowLeadIndicator(line: Line) {
		// TODO: For basic lyric, show indcator in first line... and, after any blank line

		//const nextLine = getNextUpcomingLine();
		//return nextLine === line && line.time - tick <= LeadIndicatorThreshold;
		return true;
	}

	function leadIndicatorWidth(line: Line) {
		const remaining = line.time - tick;
		if (remaining <= 0) {
			return 0;
		}
		if (remaining >= LeadIndicatorThreshold) {
			return 90;
		}
		return (remaining / LeadIndicatorThreshold) * 90;
	}

	// Initialize lyric groups whenever lyrics change
	$effect(() => {
		if (!lyrics || lyrics.lines.length === 0) {
			groupData = [];
			visibleGroups = [];
			return;
		}

		// Build group data
		const newGroupData: LyricGroup[] = [
			{
				groupRow: 0,
				groupIndex: 0,
				start: 0,
				end: 0,
				alpha: 100,
				duration: 0,
				lyricLines: []
			}
		];

		for (let i = 0; i < lyrics.lines.length; ++i) {
			const lyric = lyrics.lines[i];
			const groupNumber = Math.floor(i / LinesPerGroup);
			const groupExists = groupNumber < newGroupData.length;

			let group: LyricGroup;
			if (groupExists) {
				group = newGroupData[groupNumber];
			} else {
				group = {
					groupRow: groupNumber % VisibleGroups,
					groupIndex: groupNumber,
					start: lyric.time,
					end: lyric.time,
					duration: 0,
					alpha: 100,
					lyricLines: []
				};
				newGroupData.push(group);
			}

			group.lyricLines.push(lyric);

			// Update group.end (next element's start)
			if (i + 1 >= lyrics.lines.length) {
				group.end = lyrics.duration;
			} else {
				group.end = lyrics.lines[i + 1].time;
			}
		}

		// Calculate durations
		newGroupData.forEach(g => {
			g.duration = g.end - g.start;
		});

		groupData = newGroupData;
	});

	// Update visible groups based on tick
	$effect(() => {
		if (!groupData || groupData.length === 0) {
			visibleGroups = [];
			return;
		}

		groupData.forEach(g => {
			g.alpha = 1;
		});

		let firstGroup = groupData.findIndex(g => tick < g.start) - 1;

		if (firstGroup >= 0) {
			let g = groupData[firstGroup];
			const midpoint = g.duration / 2;
			const showPriorGroup = firstGroup > 0 && tick <= g.start + midpoint;

			if (showPriorGroup) {
				const fadeOut = 1.0 - (tick - g.start) / midpoint;
				firstGroup = firstGroup - 1;
				g = groupData[firstGroup];
				// TODO: Change - not too frequent updates, but more granular steps
				g.alpha = Math.max(.3, fadeOut / 100);
			}

			const rows = groupData
				.slice(firstGroup, firstGroup + VisibleGroups)
				.sort((a, b) => a.groupRow - b.groupRow);

			visibleGroups = rows;
		}
	});
</script>

<div class="lyric-viewer">
	<div class="lyric-groups">
		{#each visibleGroups as group (group.groupIndex)}
			<div
				class="lyric-group"
				style="opacity: {group.alpha}; transition: opacity 0.1s ease-out"
			>
				{#each group.lyricLines as line (line.time)}
					<div class="lyric-line-wrapper {isLineActive(line) ? 'active' : ''}">
						{#if shouldShowLeadIndicator(line)}
							<div class="line-lead-container">
								<div class="line-lead" style="width: {leadIndicatorWidth(line)}%;"></div>
							</div>
						{/if}
						<div class="lyric-line">
							<div class="lyric-text">
								{#if lyrics.type !== LyricFormatVersion.Basic && line.words}
									{#each line.words as word (word.time)}
										<span class="word-group">
											{#if lyrics.type === LyricFormatVersion.Chords}
												<span class="chord-text {isWordActive(word) ? 'active' : ''}">{word.chord ?? '\u00A0'}</span>
											{/if}
											<span class="word-text {isWordActive(word) ? 'active' : ''}">{word.text}</span>
										</span>
									{/each}
								{:else}
									{line.text}
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.lyric-viewer {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		background: rgba(0, 0, 0, 0);
		color: white;
		text-align: center;
		padding: 2rem;
	}

	.lyric-groups {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 100%;
	}

	.lyric-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		animation: fadeIn 0.3s ease-in;
	}

	.lyric-line-wrapper {
		position: relative;
		overflow: hidden;
		padding: 0.55rem 1rem;
		border-radius: 0.95rem;
		background: rgba(255, 255, 255, 0.04);
	}

	.line-lead-container {
		display: flex;
		justify-content: center;
		margin-bottom: 0.35rem;
		color: rgba(64, 156, 255, 0.329);
	}

	.line-lead {
		height: 2px;
		background: rgba(64, 156, 255, 0.85);
		border-radius: 1px;
		transition: width 0.1s linear;
		max-width: 90%;
	}

	.lyric-line {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.lyric-text {
		position: relative;
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.25rem 0.5rem;
		overflow: hidden;
	}

	.word-group,
	.word-text,
	.chord-text {
		position: relative;
		z-index: 1;
	}

	.lyric-line {
		position: relative;
		z-index: 1;
		font-size: 1.5rem;
		font-weight: 500;
		line-height: 1.4;
		letter-spacing: 0.05em;
	}

	.word-group {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		white-space: pre;
	}

	.word-text,
	.chord-text {
		white-space: pre;
	}

	.word-text.active,
	.chord-text.active {
		color: #ff4d4f;
	}

	.chord-text {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
		min-height: 1.1rem;
		line-height: 1.1;
	}

	.lyric-line-wrapper.active {
		background: rgba(255, 255, 255, 0.08);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.lyric-viewer {
			padding: 1rem;
		}

		.lyric-line {
			font-size: 1.2rem;
		}
	}
</style>
