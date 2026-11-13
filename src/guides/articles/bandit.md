## Small levels, reusable habits

My Bandit notes cover the first fifteen transitions, from level 0→1 through 14→15. This public edition groups them by the skill being practiced rather than repeating the same connection instructions on every page. The notes have been rewritten for clarity; level passwords are omitted.

Bandit belongs to **OverTheWire**, not TryHackMe. The [official game](https://overthewire.org/wargames/bandit/) is designed for beginners and provides the current connection instructions and objectives. Use those pages as the source of truth when a level changes.

## Choose a lesson

1. [Files, paths and search: levels 0→6](/guides/bandit-files/) — starting a session, filenames that look like options, spaces, hidden files, file identification and constrained searches.
2. [Text, encodings and useful filters: levels 6→12](/guides/bandit-text/) — ownership, grep, sort/uniq, strings, Base64 and ROT13.
3. [Formats, keys and local services: levels 12→15](/guides/bandit-formats-and-access/) — repeated decompression, SSH identity files and sending input to a local service.

The arrows refer to the transition: **0→1** means solving the task while logged in at level 0 to reach level 1. The grouped URLs retain individual level headings so you can link directly to a technique.

## How to use the notes

Read the objective on the official level page first. Try a command, read its output and consult the manual before revealing a method. Each lesson explains why a command fits the evidence; copying it without understanding the file type or arguments misses most of the value.

Keep a private working record with the command you used, what changed your mind, and the smallest explanation you could give someone else. Do not publish passwords in screenshots or terminal transcripts.

## Connections to the Linux path

The same ideas recur in the [Linux Bootcamp learning path](/guides/linux-bootcamp/). File discovery depends on understanding the filesystem. A pipeline is easier to debug when stdout and stderr are distinct. SSH identity files make more sense once file permissions are familiar.

These are training notes, not a claim of professional assessment experience. The benefit is a more precise way of working at the command line: inspect first, choose the smallest useful operation, and explain the result.
