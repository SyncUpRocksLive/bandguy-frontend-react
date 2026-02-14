 # TODO
> Handle lines like: [02:02.57]And I s{02:03.45,D/F#}ee,

 Create an event DataChannel (JSON, in-order, JSON proto)
   > Send route navigation to (newly) connected clients navigate("/home");
      * Host controls routing, client must be on same routing as host (nav bar hidden)
      * Send current song details (and/or API to query song details)
      * Send current state (play mode, time, etc) - for late connecting clients

    > Think about PWA mode (manifest, service worker, support offline something...)

https://www.megalobiz.com/search/all
https://github.com/0x7d4/syncedlyrics
syncedlyrics <search>
https://github.com/magic-akari/lrc-maker
https://lrc-maker.github.io/#

http://schindlershadow.com/tools/LRCmaker/# (shows higher precision time. Editing is awkward. geared for extended)

# AI audio splitter
https://github.com/Anjok07/ultimatevocalremovergui
Spleeter / SpleeterGUI
https://www.reddit.com/r/audioengineering/comments/12iws99/ultimate_vocal_remover_is_holy_sht_level_good/
https://colab.research.google.com/github/NVIDIA/NeMo/blob/r1.0.0b3/tutorials/asr/Offline_ASR.ipynb#scrollTo=a-LSg9dSL_O1
NEMO

Issues:
  Switched from Guest to Host leaves host connection?
  Issues of initial join state out of sync
  Guest allowed to loclaly play/stop songs (should be readonly - or, just 'vote')
  Initial song load sometimes fails? from web? or from cache?

[ ] font size
[ ] read only guest
[ ] update set list - total time/song count
[ ] lead in
[ ] offset (seek)
[ ] version track
[ ] pause
[ ] seek

[ ] Cue Up Next track
[ ] Fix issues
[ ] Cue track (Starting Verse, )
[ ] Support Multiple Audio Tracks - and panning channels (Click, Drums, Backing Vocals, etc)
[ ] SHow chord diagrams 
