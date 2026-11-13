> Learning commentary on OSINT Dojo’s Sakura room. My source notes adapted Levent Durdalı’s February 2022 walkthrough. This edition is a new explanation of the methods, with that learning source credited; it is not a claim that I independently discovered the historical findings. No images from the source article are reproduced.

## Start with the evidence, not the tool

Sakura is a staged investigation built around a small set of public clues. The useful lesson is how one observation leads to a testable question: a path in an image suggests a username; a username suggests profiles; a repository suggests a history worth inspecting. Each step can also produce a false lead.

The [official room](https://tryhackme.com/room/sakura) requires passive OSINT. Do not contact account owners, submit password resets or try to access accounts. The scenario is a training exercise, not permission to investigate unrelated people.

I use the following structure to explain the room: **artifact → observation → hypothesis → corroboration → limitation**. It keeps a plausible story from becoming a stronger claim than the evidence supports.

## An image is also a file

The initial clue is an SVG. Unlike a flat screenshot, an SVG is a text document: it can contain element names, editing metadata and local file paths in addition to the visible drawing. Inspecting the source can reveal a useful lead even when the artwork looks ordinary.

For a locally saved room artifact, a text viewer is enough:

```bash
less room-artifact.svg
```

A synthetic example shows the distinction:

```text
/home/example-user/artwork/letter.svg
```

The observation is that the artifact contains a path with the string `example-user`. The hypothesis is that this may be an account name used by its creator. It does not, by itself, prove a person's identity, that they still use that name, or that they created every part of the file. A template or copied artifact could carry someone else's metadata.

**Practical takeaway:** record the original artifact and the exact field that supports the lead. Do not replace the evidence with a search-result screenshot that loses the context.

## Reused usernames are leads

The next move is to look for the same username in public profiles and compare independent details. A distinctive name may narrow the search; it does not eliminate collisions, impersonation or abandoned accounts.

A useful comparison table is:

| Observation | What it supports | What it does not establish |
| --- | --- | --- |
| Same username | Candidate relationship | Same account owner |
| Profile links to a repository | A stated relationship between profiles | Ownership of every repository contribution |
| Matching biographical details | Additional corroboration | Independent verification if both copied one source |
| Public key identity field | A name or email asserted in the key | Verified real-world identity |

The historical walkthrough examines a PGP public key. A local way to inspect a saved public key is:

```bash
gpg --show-keys public-key.asc
```

Treat the identity fields as assertions in the artifact. They become more useful when combined with other evidence, not when treated as an identity certificate on their own.

## Deleted from the latest version is not deleted from history

The room's repository clue turns attention from the current file to earlier commits. Version control preserves changes, so removing a configuration line from the newest revision may leave earlier copies readable.

In a repository you are authorized to inspect locally:

```bash
git log --oneline -- path/to/config
# Replace COMMIT with an actual revision from that history.
git show COMMIT:path/to/config
```

The important questions are: which revision contains the value, when was that revision recorded, and what does the surrounding configuration say the value represents? A wallet-like string could be an example, a worker configuration or an address used by a service. Its presence is an observation; ownership is a separate inference.

For defenders, the lesson is practical: removing a secret in a later commit is not a substitute for revoking or rotating it. Avoid publishing live secrets while discussing historical examples.

## Financial and geographic clues need context

The historical account follows a cryptocurrency address and travel photographs. Both create opportunities for overconfidence.

A transaction explorer can establish that a recorded transfer involves an address. It does not automatically establish the human behind it. Token transfers, mining payouts and service wallets need their own interpretation. Preserve the date and the exact transaction being discussed.

A landmark or lounge photograph can suggest a location. Compare distinctive features and consider alternatives: a repost, an old photograph or a similar building can undermine an attractive match. Distinguish identifying a photographed place from locating the person who posted it.

Wireless-network identifiers need the same care. An SSID is a network name; a BSSID generally identifies an access point interface. A historical record may be stale or incomplete. I do not reproduce the room's historical personal identifiers or reconstructed onion address here; the method matters more than an answer dump.

## A compact investigation record

```text
Question:
Original artifact or source URL:
Date accessed:
Exact observation:
Working hypothesis:
Independent corroboration:
Alternative explanation:
Confidence and limitation:
Next passive check:
```

This template also helps when a source disappears. It makes clear which part of the reasoning came from a captured artifact and which depended on a live service. Do not silently replace an unavailable source with a guessed result.

## What this room teaches

The strongest habit is keeping evidence and inference separate. Metadata can start a search. Correlation can strengthen a lead. Git history can recover context that the latest revision hides. None of these steps makes every resulting claim certain.

For a small independent exercise, create your own SVG containing a fictional local path, then inspect it as text. Write one observation, two possible explanations and a next check. That practices the reasoning without investigating anyone.

## Sources and next reading

- [Sakura room — OSINT Dojo / TryHackMe](https://tryhackme.com/room/sakura).
- [Learning source: Levent Durdalı’s original walkthrough, February 15, 2022](https://medium.com/@leventd/tryhackme-sakura-room-ctf-write-up-47994b800e64).
- [My OSINT tools and evidence workflow](/guides/osint-workflow/), which separately labels active methods that do not belong in Sakura's passive-only scope.
