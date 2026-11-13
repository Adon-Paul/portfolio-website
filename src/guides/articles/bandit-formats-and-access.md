## Three different boundaries

Bandit 12→13 through 14→15 moves from file formats to authentication and service input. These are different mechanisms: unpacking bytes, proving access with a key, and sending data to a listening process. The [official Bandit pages](https://overthewire.org/wargames/bandit/) provide the current objectives. No level passwords or private-key contents are reproduced here.

## Level 12 to 13 — identify each layer

The starting file is a hex dump of data that has been compressed repeatedly. Work in a unique temporary directory rather than overwriting source files:

```bash
workdir=$(mktemp -d)
cp data.txt "$workdir/"
cd "$workdir"
xxd -r data.txt > layer
file layer
```

`xxd -r` reverses the dump into bytes. `file` tells you what the next layer appears to be. Choose the next operation based on that result, then inspect again.

| Identified format | Next step | Important distinction |
| --- | --- | --- |
| gzip | Give a working copy a `.gz` suffix and decompress with `gunzip` | Compression is not an archive of many named files |
| bzip2 | Decompress a correctly named working copy with `bunzip2` | Inspect the newly produced file again |
| tar | List entries with `tar -tf` before extracting with `tar -xf` | An archive can contain multiple files and paths |
| Text | Inspect the content | Stop decompressing when the evidence changes |

Do not assume a memorized sequence of formats will always be correct. Inspect archive paths before extraction and stay inside your disposable workspace. Avoid automating extraction of arbitrary untrusted archives into your home directory.

:::hint Hint: choosing the next decompression command
The current bytes determine the next step, not the number of layers in an older walkthrough. Run `file` again after each successful extraction.
:::

## Level 13 to 14 — authenticate with the supplied key

The task supplies a private key for the next account. Use the key as an identity file rather than trying to treat it as a password:

```bash
ssh -i sshkey.private bandit14@localhost -p 2220
```

Use the host and port specified by the current official task if they differ. Keep the key private; never paste its contents into a public write-up. SSH may reject a private key with overly permissive local permissions. For a key you own, a restrictive mode such as `600` allows only your user to read and write it.

After authentication, inspect the task's specified password file from the authorized account. Access depends on the new identity and file permissions; the key has not decrypted every file on the machine.

## Level 14 to 15 — send input to a local service

The documented task asks for the current level's password to be submitted to a service on local TCP port 30000. Establish a connection from the intended lab environment:

```bash
nc localhost 30000
```

Enter the current credential privately when interacting with the service. Avoid placing it literally in a shell command that may be retained in history. Read the response and distinguish a connection failure from the service rejecting the input.

`localhost` is the machine where the command runs. Running the command on your own laptop is not the same as running it inside the Bandit account. This distinction also matters when debugging databases and development servers.

## Lessons beyond the levels

- **Formats:** inspect the current layer and preserve a source copy.
- **Keys:** authentication material is sensitive even in a training exercise.
- **Services:** context includes where a command runs, which port it reaches and what input the protocol expects.

Return to the [Bandit learning path](/guides/bandit/), or connect these ideas to [Linux networking](/guides/linux-networking/) and [permissions](/guides/linux-permissions/).
