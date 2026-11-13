## Search is a sequence of decisions

These notes cover Bandit 6→7 through 11→12. The common pattern is reducing a large input to the property the task asks for. Keep passwords private and use the [official level pages](https://overthewire.org/wargames/bandit/) for current objectives.

## Level 6 to 7 — ownership and size

The documented task gives an owner, group and exact size. Combine them in one search:

```bash
find / -type f -user bandit7 -group bandit6 -size 33c 2>/dev/null
```

This searches the filesystem for regular files matching all three conditions. The final redirection suppresses error messages, commonly permission-denied notices. It does not grant access to directories you cannot search.

While learning, run a small scoped search without suppressing errors first. Understanding which paths could not be searched helps explain the limits of your result. Read the candidate with its full path, and check that the result actually matches the question.

## Level 7 to 8 — match a known marker

When a text file contains a known marker, begin with a literal match:

```bash
grep -F 'millionth' data.txt
```

`-F` treats the pattern as a fixed string. Ordinary grep patterns are regular expressions, which is useful when intended but can produce surprises if the marker contains special characters.

If the output format is confirmed to be a marker followed by a value, a field selection can follow:

```bash
grep -F 'millionth' data.txt | awk '{print $2}'
```

Do not assume the second field is always the right answer in unrelated logs. Inspect a record before writing a parser for it.

## Level 8 to 9 — a line that appears once

`uniq` compares adjacent lines, not every line against the whole file. Sort first so equal lines become neighbors:

```bash
sort data.txt | uniq -u
```

`uniq -u` prints groups that occur only once. This is different from ordinary `uniq`, which keeps one representative of each adjacent group.

A local exercise makes the distinction visible:

```text
apple
pear
apple
plum
```

For that illustrative input, sorting then `uniq -u` keeps `pear` and `plum`; plain `uniq` on the unsorted input leaves both separated `apple` lines. The grouping assumption is the lesson.

## Level 9 to 10 — printable strings in a binary file

A binary file may contain readable runs of characters. Extract those runs, then filter for the marker in the objective:

```bash
strings data.txt | grep '='
```

`strings` is a discovery tool, not a decoder for the whole file. Its output can include accidental sequences and unrelated text. Check the context and expected pattern before deciding which line is relevant.

## Level 10 to 11 — Base64 is encoding

Base64 represents bytes as printable characters. It is reversible without a secret key:

```bash
base64 --decode data.txt
```

That is GNU syntax; other systems may use different flags. Consult the installed tool's help if the option is rejected. Decoding is not decryption, and a successful decode does not prove that the result is meaningful or trustworthy.

## Level 11 to 12 — rotate the alphabet

ROT13 shifts each letter thirteen places through the alphabet. A translation maps both uppercase and lowercase characters:

```bash
tr 'A-Za-z' 'N-ZA-Mn-za-m' < data.txt
```

The input redirection sends the file to `tr` through standard input. Applying the same transform twice restores the original letters. Digits and punctuation are unchanged by these character sets.

## What to carry forward

The pipe connects stdout from one command to stdin of the next. Each stage should have an explainable job: locate, select, group or transform. When the final answer looks wrong, inspect the stages individually instead of adding more commands blindly.

Next: [Formats, keys and local services](/guides/bandit-formats-and-access/). Related: [Linux pipelines](/guides/linux-pipelines/).
