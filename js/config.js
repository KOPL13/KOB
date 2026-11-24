/* ==========================================================
   King of Britain · site settings
   Edit this file to change the race date, gallery source or
   contact form destination. No build step needed.
   ========================================================== */
window.KOB_CONFIG = {
  // Countdown target (UK time). Change when the date is confirmed.
  raceStart: "2027-03-19T08:00:00Z",

  // Where the contact form sends messages.
  // Leave formEndpoint empty to open the visitor's email app (mailto).
  // To receive messages without an email app, set it to a Supabase Edge
  // Function, Formspree or similar URL that accepts JSON POST.
  contactEmail: "chrisb@kingofthehammers.com",
  formEndpoint: "",

  // ---------- Gallery ----------
  // Supabase Storage: fill url, anonKey and bucket (public bucket) and the
  // gallery will load every image in `folder` automatically.
  // If left empty, the local photos below are shown.
  supabase: {
    url: "",        // e.g. "https://xxxx.supabase.co"
    anonKey: "",    // public anon key
    bucket: "",     // e.g. "gallery"
    folder: ""      // e.g. "kob-2026" (optional)
  },

  localGallery: [
    { src: "assets/photo/kob20261.jpg", alt: "Three race cars on a rocky climb", size: "wide" },
    { src: "assets/photo/kob20262.jpg", alt: "Aerial view of a rock section and spectators", size: "tall" },
    { src: "assets/photo/1.jpg", alt: "Driver hauling a winch line" },
    { src: "assets/photo/kob20265.jpg", alt: "Crew in helmets inside car 53" },
    { src: "assets/photo/kob20263.jpg", alt: "Race action" , size: "wide"},
    { src: "assets/photo/2.jpg", alt: "Race action" },
    { src: "assets/photo/kob20264.jpg", alt: "Race action", size: "tall" },
    { src: "assets/photo/kob20266.jpg", alt: "Race action", size: "wide" },
    { src: "assets/photo/kob20267.jpg", alt: "Race action" },
    { src: "assets/photo/kob20268.jpg", alt: "Race action", size: "wide" },
    { src: "assets/photo/kob20269.jpg", alt: "Race action", size: "wide" },
    { src: "assets/photo/kob202610.jpg", alt: "Race action", size: "wide" }
  ]
};
