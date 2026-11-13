## Before connecting

These notes cover Bandit 0→1 through 5→6. Follow the [official Bandit instructions](https://overthewire.org/wargames/bandit/) for the current host, port and starting credentials. Passwords obtained from the levels are deliberately not included here.

The recurring question is: **what does the shell think this filename means?** Spaces, leading hyphens and hidden entries change how you need to inspect a directory, even when the underlying file is just text.

## Level 0 to 1 — read the starting file

After connecting to the starting account, inspect your location and the visible files:

```bash
pwd
ls -la
cat readme
```

`pwd` establishes context. `ls -la` lists entries, including hidden ones, with metadata. `cat` writes the named file to standard output. Read the objective before assuming every file is relevant.

The habit to keep is checking your location before acting. Relative paths are resolved from the current working directory, not from the directory you intended to be in.

## Level 1 to 2 — a filename that looks like stdin

A file named `-` is a useful lesson in command conventions. Many tools treat a lone hyphen as standard input rather than a literal filename. For this task, make the path unambiguous:

```bash
cat ./-
```

The `./` prefix means “the file with this name in the current directory.” A general `--` option delimiter stops option parsing in tools that support it, but it does not necessarily cancel the special stdin meaning of a lone `-`. The explicit path is the clearer solution here.

## Level 2 to 3 — spaces are argument boundaries

The shell normally splits unquoted words into separate arguments. Quote a filename containing spaces, or escape the spaces:

```bash
cat 'spaces in this filename'
cat spaces\ in\ this\ filename
```

Both forms pass one filename to `cat`. Tab completion can help avoid typing mistakes, but understanding quoting is more useful than depending on completion alone. Use the actual filename listed in your current level rather than assuming an older walkthrough's filename still applies.

## Level 3 to 4 — hidden means omitted by default

On Unix-like systems, a leading dot conventionally hides a name from an ordinary `ls` listing. It does not encrypt the file or make it inaccessible.

```bash
cd inhere
ls -la
```

Inspect the actual dot-prefixed file shown by the listing, then read it using its exact path. `.` and `..` are directory entries, not the hidden answer file.

:::hint Hint: when the directory looks empty
Check whether the listing is suppressing dot-prefixed entries. Try the option that includes all names before guessing a filename.
:::

## Level 4 to 5 — inspect type before printing

When a directory contains several files, some may be binary. Printing all of them to a terminal is noisy and can produce control characters. Ask `file` to identify their content first:

```bash
file ./inhere/*
```

Read the file classified as appropriate text using its exact path. The `./` prefix also prevents a leading hyphen in a filename from being interpreted as an option by many tools.

A file extension is only a naming convention. Content inspection gives a better starting point, though `file` itself uses signatures and heuristics rather than proving the meaning of every byte.

## Level 5 to 6 — combine the constraints

The level provides properties such as size, readability and executable status. Translate those properties into a search rather than opening every file manually. For the documented size condition:

```bash
find inhere -type f -size 1033c ! -executable
```

`-type f` restricts the search to regular files. `1033c` means exactly 1,033 bytes, not blocks or kilobytes. `! -executable` negates the executability test for the current user. Inspect the candidate with `file` before reading it; this search alone does not prove the file is human-readable.

If the objective changes, change the constraints to match. A successful command from an old walkthrough is less useful than understanding how each predicate narrows the result.

## Practice without the game

In a new directory you own, create a text file with spaces in its name, a hidden file and a file named `-`. Practice listing and reading each using explicit paths. Do not use a system directory or real credentials for the exercise.

Next: [Bandit text and encodings](/guides/bandit-text/). Related: [Linux filesystem](/guides/linux-filesystem/) and [permissions](/guides/linux-permissions/).
