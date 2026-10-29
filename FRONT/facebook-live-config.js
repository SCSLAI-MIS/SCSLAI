/* =========================================================================
   SCSLAI — FLOATING LIVE VIDEO WINDOW  ·  CONFIGURATION
   -------------------------------------------------------------------------
   ⭐ THIS IS THE ONLY FILE YOU NEED TO EDIT. ⭐
   👉 PASTE YOUR VIDEO LINK ON THE LINE MARKED "liveUrl" BELOW.
   (Layout/behaviour live in facebook-live.css and facebook-live.js.)

   1) liveUrl ........ The video link (YouTube or Facebook).
   2) startDateTime ... When the floating window starts appearing.
   3) endDateTime ..... When the floating window stops appearing.

   SUPPORTED LINKS — copy them straight from the browser address bar
   -----------------------------------------------------------------
     ✅ YouTube   https://www.youtube.com/watch?v=XXXXXXXXXXX
                  https://youtu.be/XXXXXXXXXXX
                  https://www.youtube.com/live/XXXXXXXXXXX
                  https://www.youtube.com/shorts/XXXXXXXXXXX

     ✅ Facebook  https://www.facebook.com/<page>/videos/<number>/
                  https://www.facebook.com/watch/?v=<number>

     ❌ Facebook SHORT share links (facebook.com/share/... or fb.watch/...)
        cannot be played inside other websites — Facebook blocks them.
        Fix: open the share link once in your browser, then copy the URL it
        redirects to (the .../videos/<number>/ one) and paste that instead.

     ❌ Links from other websites show a small "watch on ..." notice
        instead of a player, because those sites block embedding.

   Put the link inside the quotes exactly as copied. A correct line looks
   like this (nothing extra before "https"):
        liveUrl: 'https://www.youtube.com/watch?v=AbCdEf12345',

   DATE / TIME FORMAT
   ------------------
       "YYYY-MM-DDTHH:MM:SS+08:00"

   Examples:
       2026-10-21T08:00:00+08:00   = Oct 21, 2026 · 8:00 AM Philippine time
       2026-10-21T17:30:00+08:00   = Oct 21, 2026 · 5:30 PM Philippine time
       2026-12-01T00:00:00+08:00   = Dec 1, 2026 · 12:00 AM Philippine time

   Keep the "+08:00" at the end: it pins the schedule to Philippine time,
   so the window opens/closes at the same moment for every visitor,
   wherever they are in the world. (If you leave it out, the browser's own
   local time is used instead.)

   The window appears from startDateTime until endDateTime (both inclusive).
   Leave BOTH empty ("") to show it all the time.

   FACEBOOK LINK NOTES
   -------------------
   • The video must be PUBLIC, or the player cannot embed it.
   • Visitors can always use the button in the popup header, which opens the
     same link in a new tab.

   QUICK TESTING (no code change needed)
   -------------------------------------
   • Add  ?fblive=1  to any page URL to force the window open right now.
   • Add  ?fblive=0  to any page URL to force it hidden.

   AFTER EDITING: just save this file and refresh the page (F5). The widget
   re-reads this file on every page load, so no version bump is needed.
   ========================================================================= */

window.SCSLAI_FACEBOOK_LIVE = {
    /* ---------------------------------------------------------------------
       1) VIDEO LINK  ←←← PASTE YOUR LINK HERE (YouTube or Facebook)
       --------------------------------------------------------------------- */
    liveUrl: "",

    /* ---------------------------------------------------------------------
       2) SHOW FROM  (start date & time)
       --------------------------------------------------------------------- */
    startDateTime: '',

    /* ---------------------------------------------------------------------
       3) SHOW UNTIL  (end date & time)
       --------------------------------------------------------------------- */
    endDateTime: '',

    /* ---------------------------------------------------------------------
       OPTIONAL SETTINGS — safe to leave exactly as they are
       --------------------------------------------------------------------- */

    // Master switch: false = never show the floating window.
    enabled: true,

    // Text shown in the popup header.
    title: 'SCSLAI Live',

    // Width of the small floating preview on desktop (pixels).
    previewWidth: 320,

    // Start the small preview automatically. Browsers only allow autoplay
    // when muted, so the preview is muted; the large popup plays with sound.
    autoplayPreview: true,

    // The × now MINIMISES the player into a small "LIVE" pill that the
    // visitor can tap to reopen. This remembers that choice for the
    // tab/session (a new tab opens the player again).
    dismissForSession: true,

    // LIVE badge behaviour:
    //   'auto'   = show the badge only while YouTube confirms the stream is
    //              really on air (replays and Facebook links never show it)
    //   'always' = always show it inside the scheduled window — use this for
    //              Facebook live streams, which cannot be verified from a page
    //   'never'  = never show it
    showLiveBadge: 'auto'
};
