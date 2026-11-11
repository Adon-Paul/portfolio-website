export const projects = [
  {
    slug: "melody",
    title: "Melody",
    category: "Mobile development",
    label: "A little more in tune.",
    summary:
      "A home for the music already on your phone. Local playback, a queue that makes sense, and room for your favorites.",
    stack: ["Flutter", "Provider", "just_audio"],
    repository: "https://github.com/Adon-Paul/melody",
    poster: "/media/melody.webp",
    video: "/videos/melody.mp4",
    demoSteps: [
      "The recording opens with a splash screen and a sign-in form, then moves to a dark green home screen with Device Music, Favorites and integration cards. Some integration cards are placeholders.",
      "The local library displays a searchable list of songs with artwork and play buttons. Selecting a song opens a full player with cover art, track information, a progress slider and playback controls.",
      "The player changes between several songs. A lyrics panel displays lines beneath the playback position. The recording has no audio track, so it demonstrates the interface rather than sound output.",
      "Returning to the home screen leaves a compact player along the bottom. The settings screen then shows playback, lyrics, theme, cache and account options. Their presence in the recording does not verify every option is implemented.",
    ],
    status: "Personal project · working prototype",
    intro:
      "The player is the easy part. Keeping the queue, the mini player and background playback in agreement is where a music app starts to become interesting.",
    problem:
      "Local music should be easy to find and play without rebuilding a playlist every time the app opens. Melody brings device scanning, favorites and playback into one Flutter application.",
    decisions: [
      [
        "One queue, two views",
        "Provider connects the mini player and full player to shared playback state. A change in one view should be reflected in the other.",
      ],
      [
        "Playback beyond the screen",
        "just_audio and Android background audio support keep the listening session separate from the visible player interface.",
      ],
      [
        "Keep the small things local",
        "Favorites are persisted with shared_preferences. Lyrics use an LRCLIB lookup and a cache, so repeated reads do not need the same request.",
      ],
    ],
    outcome:
      "The repository documents local library scanning, queue reordering, shuffle and repeat, favorites, lyrics and background playback. The recording below shows an earlier version of the interface; some integrations visible in it are placeholders.",
    next: "The next engineering question is resilience: permission changes, missing files and interruptions during playback. Those deserve device testing before calling this production-ready.",
    evidence: "Implementation and feature documentation",
  },
  {
    slug: "style-transfer-ai",
    title: "Style Transfer AI",
    category: "Python / applied AI",
    label: "Writing has a fingerprint.",
    summary:
      "A command-line experiment in what makes writing sound like someone: its rhythm, vocabulary and structure.",
    stack: ["Python", "Ollama", "LLMs"],
    repository: "https://github.com/Adon-Paul/style-transfer-ai",
    poster: "/media/style.webp",
    video: "/videos/style-transfer-ai.mp4",
    demoSteps: [
      "In Windows PowerShell, a package-install command reports that Style Transfer AI and its dependencies are already installed, and the command-line program is launched.",
      "A stored profile summary shows the user name adon, model gemma3:1b, enhanced mode, three files analyzed and zero total words. When the readable report is requested, the program says that report is not available in this profile. These are prototype limitations, not successful analysis results.",
      "Returning to the main menu shows writing-style analysis, saved profiles, content generation and transfer, comparison, report cleanup, model selection, configuration and exit options. The recording ends at the menu prompt.",
    ],
    status: "Personal project · experimental tool",
    intro:
      "Before asking a model to write in a particular voice, it helps to describe what that voice actually does.",
    problem:
      "Style Transfer AI takes text samples and builds a structured writing profile. It explores linguistic patterns rather than image style transfer.",
    decisions: [
      [
        "Local inference is an option",
        "Ollama supports running the analysis locally. Optional OpenAI and Gemini integrations offer a different deployment choice; privacy depends on the provider selected.",
      ],
      [
        "Make the output portable",
        "TXT reports are readable without the tool, while JSON profiles can be used by other programs. Named, timestamped outputs make runs easier to revisit.",
      ],
      [
        "Separate analysis from storage",
        "Profiles can stay local. Optional Firestore backups are a separate capability, rather than a requirement to analyze a piece of writing.",
      ],
    ],
    outcome:
      "The public project documents a Python CLI with statistical and model-assisted analysis, profile management and report export. The existing recording captures the terminal workflow, including incomplete reports; it is a prototype demonstration, not an accuracy benchmark.",
    next: "A useful next step is evaluation: compare profiles across samples from the same writer and test whether the descriptions remain stable. Model-generated observations should be treated as hypotheses.",
    evidence: "CLI documentation and source",
  },
  {
    slug: "luxecart",
    title: "LuxeCart",
    category: "Flutter / learning project",
    label: "Learning, cart by cart.",
    summary:
      "An early shopping app that brought product browsing, a persistent cart and a payment integration into one Flutter project.",
    stack: ["Flutter", "Hive", "Dio"],
    repository: "https://github.com/Adon-Paul/E-Commerce",
    status: "Learning project · prototype",
    intro:
      "An early project, kept here with its rough edges. Building a shopping flow was a practical way to learn how interfaces, data and persistence fit together.",
    problem:
      "The app explores the journey from a product list to a detail page, wishlist and cart. It is a learning implementation, not a live storefront.",
    decisions: [
      [
        "Keep cart data between visits",
        "Hive models represent the cart and wishlist locally, with fields for product details and quantity.",
      ],
      [
        "Work with remote product data",
        "Dio and cached_network_image support the product browsing layer. Dedicated product models describe the response data.",
      ],
      [
        "Draw the prototype boundary",
        "The code includes a Razorpay integration. The login screen currently validates form fields and navigates; it does not implement secure authentication.",
      ],
    ],
    outcome:
      "The public source contains browsing, detail, wishlist and cart screens, local persistence models and a payment integration. These are implementation exercises, not evidence of a production commerce system.",
    next: "Before a real release: authenticated sessions, server-side pricing and payment verification, tests for cart calculations, and a review of error and empty states.",
    evidence: "Public Flutter source",
  },
];
export const projectPath = (project) => `/work/${project.slug}/`;
export function projectAtPath(path) {
  return projects.find(
    (project) =>
      projectPath(project) === path ||
      projectPath(project).slice(0, -1) === path,
  );
}
