In UNIX operating systems, all input and output streams are handled as open file descriptors. By manipulating these streams, operators can build modular data pipelines, redirect logging information, and orchestrate complex shell scripts.

## Standard File Descriptors

An interactive shell normally provides these three standard streams; callers can redirect or close them:

| Descriptor | Name | Default Binding | Description |
| :---: | :---: | :---: | :--- |
| **0** | `stdin` | Keyboard | Standard input stream |
| **1** | `stdout` | Terminal Screen | Normal program output |
| **2** | `stderr` | Terminal Screen | Error messages and diagnostics |


:::flow Connections at a glance
- Keyboard / File → Running Process
- Running Process → Terminal Display
- Running Process → Error Log / Dev Null
:::


---

## Stream Redirection Syntax

### 1. Standard Output Redirection (`>` vs `>>`)
- `>` (Truncate & Overwrite): Directs `stdout` to a file. If the file exists, its previous content is wiped.
  ```bash
  echo "New Content" > output.log
  ```
- `>>` (Append): Appends `stdout` to the end of a file without altering existing lines.
  ```bash
  echo "Appended Entry" >> output.log
  ```

### 2. Standard Error Redirection (`2>`, `2>&1`, `&>`)
- Divert errors to a log file:
  ```bash
  find / -name "*.conf" 2> errors.log
  ```
- Discard all error messages silently to `/dev/null`:
  ```bash
  find / -name "*.conf" 2>/dev/null
  ```
- Merge `stderr` into `stdout`:
  ```bash
  command > all_output.log 2>&1
  # Modern bash shorthand:
  command &> all_output.log
  ```

### 3. Standard Input Redirection (`<`)
Passes a file's content directly into a command expecting `stdin`:
```bash
mysql -u root -p database_name < backup.sql
```

---

## Pipelining (`|`)

The pipe operator (`|`) routes the `stdout` of the command on the left into the `stdin` of the command on the right. This allows linear data processing without storing intermediate artifacts on disk:

```bash
# Count the number of active established TCP connections
ss -tan | grep ESTAB | wc -l

# Extract unique failed login IP addresses from authentication logs
cat /var/log/auth.log | grep "Failed password" | awk '{print $(NF-3)}' | sort -u
```

---

## Conditional & Boolean Flow Operators

Shell commands report completion via exit codes (`0` for success, non-zero for error):

| Operator | Name | Logic |
| :---: | :--- | :--- |
| `&&` | Logical AND | Executes command 2 **only if** command 1 succeeds (exit code 0). |
| `\|\|` | Logical OR | Executes command 2 **only if** command 1 fails (exit code != 0). |
| `;` | Sequential | Executes command 2 immediately after command 1 regardless of exit status. |
| `&` | Background | Spawns command in a background subshell. |

```bash
# Common administrative build & install chain
./configure && make && sudo make install

# Ping target; alert if host is down
ping -c 1 192.0.2.10 >/dev/null && echo "Host Alive" || echo "Host Down"
```

---

## Related Notes & Graph Links
- Back to [TryHackMe - Linux Bootcamp](/guides/linux-bootcamp-walkthrough/)
- See [Linux Process & Signal Management](/guides/linux-processes/) for monitoring chained pipeline processes.
- See [Linux Log Auditing & Cron Automation](/guides/linux-logs-cron/) for redirecting cron output streams.

## Ordering and exit status

`command > all.log 2>&1` sends both streams to the file. `command 2>&1 > out.log` duplicates the original stdout for stderr before redirecting stdout. A pipe carries stdout by default. In Bash, a pipeline normally reports the final command’s status; `set -o pipefail` makes failures earlier in a pipeline affect its status.
