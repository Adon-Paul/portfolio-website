> Public edition of my original lab notes. Structure and explanations are retained. Passwords, flags and device identifiers are omitted; addresses use documentation examples. Screenshots remain in the private source notes, so references to captures describe that record rather than images reproduced here. Technical corrections are applied where needed.

## Executive Summary & Tactical Overview

The **Linux Bootcamp** room on TryHackMe is an intensive, scenario-driven operational laboratory engineered to transition security recruits into proficient command-line operators. Rather than treating Linux as an abstract theoretical operating system, the curriculum structures each concept around operational field tasks: establishing encrypted tunnels, mapping local directory trees, setting discretionary access controls, manipulating background processes, conducting network reconnaissance, hunting down buried artifacts, and automating scheduled monitoring routines.

This field manual serves as an end-to-end, study report and reference guide. Every task includes technical background, command syntax breakdowns, defensive and offensive operational context, the exact solution workflow, and recorded task results; flag values are omitted in this public edition.

---

## Mission Map & Knowledge Graph

This note is integrated into the vault's graph view via bidirectional links. Explore the core conceptual pillars below:

- [Linux Filesystem Hierarchy](/guides/linux-filesystem/) — Directory structures, FHS standards, and ephemeral mount points.
- [Linux Permissions & Access Control](/guides/linux-permissions/) — Discretionary access control (DAC), octal notation, and ownership.
- [Linux Redirection & Pipelines](/guides/linux-pipelines/) — Standard streams (stdin, stdout, stderr), pipelining, and logical operators.
- [Linux Process & Signal Management](/guides/linux-processes/) — Process lifecycles, signal dispatching (`SIGTERM` vs `SIGKILL`), and audit filters.
- [Linux Network Reconnaissance & File Transfers](/guides/linux-networking/) — Socket inspection (`ss`), interface discovery (`ip`), and encrypted data drops (`scp`).
- [Linux Log Auditing & Cron Automation](/guides/linux-logs-cron/) — Systemd journal triage, authentication inspection, and crontab scheduling.

---

## Task 1: Welcome & Mission Briefing

### Operational Briefing
The journey begins at the staging ground. Shell fluency is useful for remote administration, incident response and lab work. Graphical tools remain useful too; this room focuses on the command line.


:::flow Connections at a glance
- Recruit (Local Kali) → THM Lab Network
- THM Lab Network → Bootcamp Target VM
- Bootcamp Target VM → intelofficer / commander / root
:::


The mission objective is to step through 20 structured tasks that mirror realistic administrative and defensive operational milestones:
1. **Network Foothold & Remote Access**: Establishing secure tunnels and authenticating via SSH.
2. **Filesystem Mastery**: Navigating, inspecting, creating, and modifying system components.
3. **Data Routing**: Chaining commands through pipes, streams, and conditional logic.
4. **Access Management**: Enforcing file permissions and pivoting between user accounts.
5. **Investigation & Reconnaissance**: Locating hidden artifacts and auditing listening network sockets.
6. **System Control & Automation**: Managing running processes, triaging log streams, and configuring scheduled cron jobs.

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **Lace up your boots. let’s get you battle-ready for the terminal!** | *No answer needed* | Click **Completed** to initiate the deployment. |

---

## Task 2: Launch the VPN Tunnel (OpenVPN)

### Operational Briefing
Before interacting with any target instance in isolated training networks, you must bridge your workstation with the internal lab subnet. Use the room’s current VPN or browser-based access instructions to reach its private lab network. Addresses shown below have been replaced with documentation examples, not live TryHackMe network ranges.

```bash
# Securely initialize the OpenVPN client with elevated privileges
sudo openvpn ~/Downloads/ap-south-1-yourusername-regular.ovpn
```

### Technical Breakdown:
- `sudo`: OpenVPN requires superuser privileges to create virtual network interfaces (`tun0`) and manipulate the host kernel routing table.
- `.ovpn` Configuration: Contains cryptographic material (CA certificate, user certificate, private key) and server directives (TLS cipher suites, endpoint IPs, UDP port 1194).
- Handshake Sequence: When the terminal streams `Initialization Sequence Completed` or `Protocol options: explicit-exit-notify 3`, your local interface `tun0` has successfully acquired an internal IP.

> Terminal Workflow Tip
> Always preserve your OpenVPN session in a dedicated terminal tab (`Ctrl + Shift + T`) or run it inside a terminal multiplexer like `tmux`. Terminating the process immediately severes your connection to the grid.

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **I am Connected to tryhackme network and ready for my first lesson.** | *No answer needed* | Verified via active `tun0` tunnel. |
| **What does VPN stand for?** | `Virtual Private Network` | Encrypted tunnel across untrusted networks. |

---

## Task 3: Remote Access via SSH

### Operational Briefing
With network reachability established, remote administration requires an encrypted communication protocol. The **Secure Shell (SSH)** protocol replaced legacy unencrypted protocols like Telnet and rlogin, which transmitted authentication credentials and commands in plain cleartext.

### Deployment & Credentials
- **Target Host**: `MACHINE_IP`
- **Port**: `22` (Default)
- **Username**: `recruit`
- **Password**: `[password omitted]`

### Command Execution:
```bash
# Connect to remote target
ssh recruit@MACHINE_IP
```

### Host Key Fingerprint Verification
Upon initiating your initial connection, SSH halts execution and displays the host's public key fingerprint:
```text
The authenticity of host 'MACHINE_IP (MACHINE_IP)' can't be established.
ED25519 key fingerprint is SHA256:MNE1NeNfmAHKz86suTrZ/iDNiClAh7jaGTIvC8HXDLI.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
```
Entering `yes` appends the server's public key to your local `~/.ssh/known_hosts` file. On subsequent logins, SSH cross-checks this stored key against the server's response. A changed host key can trigger a warning or refusal depending on configuration. Verify the fingerprint through a trusted channel: a server rebuild can change it legitimately, but a mismatch can also indicate interception. Do not automatically accept a new key just to suppress the warning.

```bash
# Non-standard port syntax:
ssh -p 2222 recruit@MACHINE_IP
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **What does SSH stand for ?** | `Secure Shell` | RFC 4253 encrypted transport layer protocol. |
| **What is the default port of SSH?** | `22` | Registered IANA port for SSH traffic. |
| **What option do you use to connect to an SSH server running on port 2222?** | `-p 2222` | Flag `-p` specifies target port. |

---

## Task 4: Terminal Essentials

### Operational Briefing
Once logged into an unfamiliar shell, the first imperative is immediate environmental orientation. You must establish your current operational identity, identify the hostname, and understand how to echo data to standard output.

```text
recruit@bootcamp:~$
```
The standard bash prompt decodes as:
- `recruit`: Current user context.
- `@bootcamp`: Host machine identifier.
- `~`: Current working directory (`~` is shorthand for `/home/recruit`).
- `$`: Standard unprivileged shell (contrasted with `#` for root).

### Core Reconnaissance Commands:
```bash
# Print strings or evaluate shell variables
echo "I am operating as: $USER"

# Display current effective UID context
whoami

# Output machine system name
hostname

# Output all assigned network addresses
hostname -I
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **Who are you currently?** | `recruit` | Identified via `whoami`. |
| **How do you check the machine’s name?** | `hostname` | Returns system hostname. |
| **How do you print Hello world in the terminal?** | `echo "Hello world"` | Quotes preserve single string parameter. |

---

## Task 5: Route Mapping — Navigation & File Inspection

### Operational Briefing
Navigating the Linux directory tree requires fluency with path notation. Unlike Windows' drive-letter scheme (`C:\`), UNIX unifies all storage devices, partitions, and virtual filesystems beneath a single hierarchical root: `/`.


:::flow Connections at a glance
- / (Root Directory) → /home
- /home/recruit → Documents
- /home/recruit → Pictures
:::


### Path Mechanics & Core Commands:
- `pwd`: Displays the absolute canonical path to your current working directory.
- `cd <path>`: Changes directory context. `cd ~` or simply `cd` returns to the user's home directory; `cd ..` traverses up to the parent directory.
- `ls`: Lists directory entries.
  - `-l`: Long-listing format displaying mode bits, link count, owner, group, file size, and timestamp.
  - `-a`: Includes hidden entries (filenames prefixed with a dot `.`).
  - `-lh`: Employs human-readable file sizes (e.g., `4.0K`, `25M`).
  - `-R`: Recursively enumerates child subdirectories.
- `cat`: Concatenates and dumps file content directly to standard output.

### Field Investigation & Hidden File Discovery:
Inspecting the user's home directory reveals four subdirectories:
```bash
recruit@bootcamp:~$ ls -l
drwxr-xr-x 2 recruit recruit 4096 Jul  7 05:20 Documents
drwxr-xr-x 2 recruit recruit 4096 Jul  7 05:20 Important-Files
drwxr-xr-x 2 recruit recruit 4096 Jul  7 05:20 Notes
drwxr-xr-x 2 recruit recruit 4096 Jul  7 05:20 Pictures

recruit@bootcamp:~$ ls -l Pictures/*.jpg | wc -l
4
```
Enumerating the `Documents` directory with `-a` uncovers a hidden configuration file:
```bash
recruit@bootcamp:~$ cd ~/Documents
recruit@bootcamp:~/Documents$ ls -la
total 16
drwxr-xr-x 2 recruit recruit 4096 Jul  7 05:21 .
drwxr-xr-x 6 recruit recruit 4096 Jul  7 05:20 ..
-rw-r--r-- 1 recruit recruit   25 Jul  7 05:21 .hidden_config
-rw-r--r-- 1 recruit recruit   36 Jul  7 05:20 todo.txt

recruit@bootcamp:~/Documents$ cat .hidden_config
[flag omitted]
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **What command do you use to return to your home directory from anywhere?** | `cd ~` | `cd` without arguments also defaults to `$HOME`. |
| **What command shows your current working directory?** | `pwd` | Print Working Directory. |
| **How many .jpg files are in the Pictures directory?** | `4` | `dog1.jpg`, `dog2.jpg`, `dog3.jpg`, `dog4.jpg`. |
| **What key helps you auto-complete a file or directory name?** | `Tab` | Press once for unique match, twice for ambiguous list. |
| **There is a hidden file inside the Documents folder. what is its content?** | `[flag omitted]` | Extracted via `cat ~/Documents/.hidden_config`. |

---

## Task 6: Supply Depot — File Operations & Manuals

### Operational Briefing
Creating, moving, duplicating, and cleaning up files are daily administrative imperatives. In security contexts, staging scripts, duplicating configuration files prior to edits, and reviewing built-in documentation (`man`) are essential competencies.

### Core File Manipulation Commands:
- `touch <file>`: Creates an empty file if it does not exist, or refreshes the access/modification timestamps of an existing file.
- `mkdir -p <path>`: Creates a directory. The `-p` (parents) flag creates intermediary parent directories without erroring if they already exist.
- `cp <source> <dest>`: Copies files. Add `-r` for recursive directory duplication.
- `mv <source> <dest>`: Moves files or directories across paths, or renames them within the same directory.
- `rm <target>`: Unlinks and deletes files. Add `-r` for recursive directory removal, and `-f` to suppress confirmation prompts.
- `man <command>`: Opens the manual pager (defaulting to `less`). Use `/` to search forward, `n` for next match, and `q` to exit.

### Command Execution:
```bash
# Create nested mission logs in a single operational step
mkdir -p /home/recruit/ops/logs

# Rename backup report to final submission
mv report-backup.txt final-report.txt
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **Which command creates a file?** | `touch` | Modifies timestamps or creates empty file. |
| **How would you build /home/recruit/ops/logs in one command?** | `mkdir -p /home/recruit/ops/logs` | The `-p` flag ensures parent paths are generated. |
| **Show how to rename report-backup.txt to final-report.txt.** | `mv report-backup.txt final-report.txt` | Moving within the same path executes a rename. |
| **What Linux command shows you the manual for other commands?** | `man` | Formats and displays online manual pages. |

---

## Task 7: Basecamp Layout — Linux Filesystem Hierarchy (FHS)

### Operational Briefing
The Linux **Filesystem Hierarchy Standard (FHS)** governs where specific categories of data reside. Understanding the purpose of each top-level directory is critical for both locating service configurations and discovering log artifacts during digital forensics.


:::flow Connections at a glance
- / → /bin & /sbin / (Essential Binaries)
- / → /etc / (System Configurations)
- / → /home / (User Data)
- / → /var / (/var/log, Spools)
- / → /tmp / (Volatile Scratch)
- / → /proc / (Kernel & Process RAM)
:::


### FHS Architecture Breakdown:
| Directory | Technical Purpose | Security & Administrative Context |
| :--- | :--- | :--- |
| `/home` | User home directories | Holds user configs (`.bashrc`), SSH keys (`~/.ssh`), and personal data. |
| `/etc` | Host-specific system configuration files | Target for auditing (`/etc/passwd`, `/etc/shadow`, `/etc/ssh/sshd_config`). |
| `/var/log` | System and service log stores | Primary forensic destination (`auth.log`, `syslog`, `nginx/access.log`). |
| `/tmp` | Temporary scratchpad storage | Cleanup depends on distribution and mount policy; frequently has world-writable sticky bit (`drwxrwxrwt`). |
| `/proc` | Pseudo-filesystem representing kernel state | Exposes running processes as numeric directories (`/proc/<PID>/status`). |
| `/bin` / `/sbin` | Core executables | Essential binaries for all users (`/bin`) and system administrators (`/sbin`). |

### Disk Usage Inspection:
```bash
recruit@bootcamp:~$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/root        20G  4.2G   15G  22% /
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **Which directory holds user‑specific data?** | `/home` | Stores regular user home environments. |
| **Where would you find system service configuration files like SSH?** | `/etc` | Contains system-wide static configuration. |
| **In which path are you most likely to find .log files?** | `/var/log` | Standard logging destination. |
| **Which directory is used for storing temporary files that get cleared on reboot?** | `/tmp` | Ephemeral memory- or ramdisk-backed scratch area. |
| **Where would you look to find information about running processes?** | `/proc` | Kernel virtual filesystem exposing process state. |

---

## Task 8: Supply Lines — Redirection, Pipes & Operators

### Operational Briefing
The UNIX philosophy dictates: *Write programs that do one thing and do it well. Write programs to work together.* This composability is enabled by standard I/O streams, redirection operators, and pipelines.


:::flow Connections at a glance
- Command 2 (stdin) → target.log (Disk Append)
:::


### Standard I/O Descriptors & Redirection:
- `stdin` (`0`): Standard input stream (keyboard or pipe).
- `stdout` (`1`): Standard output stream (terminal or redirected target).
- `stderr` (`2`): Standard error output stream.
- `>`: Overwrite redirection. Replaces existing file content or creates a new file.
- `>>`: Append redirection. Appends content to the end of the destination file without truncating.

### Redirection Behavior Analysis:
```bash
recruit@bootcamp:~$ echo "Mission Start" >> mission.log
recruit@bootcamp:~$ cat mission.log
Mission Start

recruit@bootcamp:~$ echo "Second Objective" > mission.log
recruit@bootcamp:~$ cat mission.log
Second Objective
```
Notice that using `>` on the second execution completely overwrote the original file, obliterating `"Mission Start"`.

### Pipelines & Conditional Execution:
- `|` (Pipe): Streams the `stdout` of the left-hand command into the `stdin` of the right-hand command.
- `&&` (Logical AND): Executes the second command *only if* the preceding command exits with status code `0` (success).
- `||` (Logical OR): Executes the second command *only if* the preceding command exits with a non-zero status code (failure).
- `;` (Sequential): Executes commands sequentially regardless of exit status.

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **Which operator runs the next command only if the first succeeds?** | `&&` | Conditional execution on zero return code. |
| **Which operator lets you connect the output of one command to the input of another?** | `|` | UNIX pipe operator. |
| **Run this command: echo "Mission Start" >> mission.log then echo "Second Objective" > mission.log. What will be the final content of mission.log?** | `Second Objective` | The single `>` truncates and overwrites. |
| **Using > will add new output to the end of a file without removing its existing contents. (yay or nay)?** | `nay` | `>` truncates; `>>` appends. |

---

## Task 9: Security Clearances — Permissions & Ownership

### Operational Briefing
Linux enforces access control through **Discretionary Access Control (DAC)**. Every filesystem entity is bound to an owner user, an owning group, and a 9-bit permission mask defining read, write, and execute rights.

### Anatomy of an `ls -l` Permission String:
```text
- r w x r - x - - x   1 recruit intelofficer 828 Jul  7 06:40 brief.txt
┬ └───┘ └───┘ └───┘
│   │     │     └── Others (World) : Read (0) + Write (0) + Execute (1) = 1
│   │     └──────── Group (intelofficer) : Read (4) + Write (0) + Execute (1) = 5
│   └────────────── User (recruit) : Read (4) + Write (2) + Execute (1) = 7
└────────────────── Type: '-' (Regular File), 'd' (Directory), 'l' (Symlink)
```

### Octal Calculation Matrix:
| Bit Value | Symbol | File Meaning | Directory Meaning |
| :---: | :---: | :--- | :--- |
| **4** | `r` | Read contents | List directory entries (`ls`) |
| **2** | `w` | Modify or truncate contents | Create, rename, or delete entries when directory search/execute permission also permits access |
| **1** | `x` | Execute as binary/script | Traverse into directory (`cd`) |

### Practical Manipulations with `chmod`:
```bash
# Assign rwx (7) to owner, r-x (5) to group, --x (1) to others
chmod 751 mission.sh

# Grant execute rights to all user scopes symbolically
chmod +x mission.sh
```

### Investigating `countdown.sh` and `brief.txt`:
```bash
recruit@bootcamp:~$ ls -l countdown.sh
-rwxr-xr-- 1 recruit recruit 142 Jul  7 06:45 countdown.sh

recruit@bootcamp:~$ ls -l brief.txt
-rw-rw-r-- 1 recruit intelofficer 828 Jul  7 06:40 brief.txt
```
For `countdown.sh`, the user (owner) permissions are `-rwx` (`rwx`). For `brief.txt`, the owning group is explicitly listed as `intelofficer`.

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **Check the permissions for countdown.sh. what is its user permission?** | `rwx` | Read, write, and execute for owner. |
| **How would you add permissions rwx for owner, r-x for group, --x for others in numerical form for the file mission.sh?** | `chmod 751 mission.sh` | 7 (4+2+1), 5 (4+0+1), 1 (0+0+1). |
| **What is the Group of the file brief.txt?** | `intelofficer` | Group owner field from `ls -l`. |
| **Which command would you use to give everyone (user, group, and others) execute permission on mission.sh?** | `chmod +x mission.sh` | With no scope specified, umask limits which bits change; use `a+x` to explicitly select all users. |

---

## Task 10: Rank Elevation — Privileges & User Switching

### Operational Briefing
Operating under a restricted account limits the blast radius of operational errors. However, system reconfiguration and accessing sensitive artifacts necessitate account pivoting and privilege elevation.

### User Switching Mechanics:
- `su <username>`: Substitute User. Runs a shell under the target account, preserving the working directory and much of the environment while changing selected identity variables.
- `su -l <username>` (or `su - <username>`): Starts a login shell, changes to the target home directory and initializes the login environment. Startup files depend on the selected shell and system configuration.
- `sudo <command>`: Executes an administrative command under superuser authority if permitted by `/etc/sudoers`.
- `passwd`: Updates the user's authentication password. Standard users can only update their own credentials; `root` can reset any account password without supplying the current password.

### Investigating `secret.sh`:
Inspecting the environment reveals an operational script:
```bash
recruit@bootcamp:~$ ls -la
-rwxr-x--- 1 recruit recruit 104 Jul  7 06:50 secret.sh

recruit@bootcamp:~$ cat secret.sh
#!/bin/bash
echo "[flag omitted]"
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **what is the content of the secret.sh file.?** | `[flag omitted]` | First elevation flag recovered. |
| **Which command lets you switch to another user account?** | `su` | Switch User utility. |
| **You need to be root or have sudo privileges to change another user’s password.(yay or nay)** | `yay` | Unprivileged users can only alter their own credentials. |
| **Which command do you use to change your own password?** | `passwd` | Changes authentication tokens. |

---

## Task 11: Intel Briefings — Terminal Text Editors

### Operational Briefing
In headless server deployments where no graphical windowing system (X11/Wayland) is installed, text manipulation must occur entirely inside the terminal. Operators rely on two primary text editors:

1. **nano**: A modeless, beginner-friendly editor. Typing immediately inputs text, while interface commands are displayed at the bottom of the screen using `Ctrl` (`^`) and `Alt`/`Esc` (`M-`) keystrokes.
2. **vi / vim**: A modal powerhouse designed for speed. The editor boots in **Command Mode**. Pressing `i` transitions into **Insert Mode** for entering text. Pressing `Esc` returns to Command Mode, allowing rapid navigation and command execution via ex-commands (e.g., `:w` to write, `:q` to quit, `:wq` to write and exit, `:q!` to force quit without saving).

### Comparative Architecture:
| Workflow Step | `nano` Command | `vi` Command |
| :--- | :--- | :--- |
| Mode Architecture | Modeless (Direct Input) | Modal (Command vs Insert) |
| Save Changes | `Ctrl + O`, then `Enter` | `:w`, then `Enter` |
| Exit Editor | `Ctrl + X` | `:q` (or `:q!` if dirty) |
| Save & Exit | `Ctrl + O` -> `Ctrl + X` | `:wq` (or `ZZ`) |

### Script Generation in Action:
```bash
# In nano: create mission brief
intelofficer@bootcamp:~$ nano brief.sh
# Type: echo "Operation Bravo is green-lit."
# Save with Ctrl+O, Enter, then Ctrl+X
intelofficer@bootcamp:~$ chmod +x brief.sh && ./brief.sh
Operation Bravo is green-lit.

# In vi: create intel drop
intelofficer@bootcamp:~$ vi intel.sh
# Press 'i', enter: echo "Intel package received."
# Press 'Esc', type ':wq', Enter
intelofficer@bootcamp:~$ chmod +x intel.sh && ./intel.sh
Intel package received.
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **How do you exit from vi.?** | `:q` | Exits when no unsaved changes exist (`:wq` saves & quits). |
| **What key combination do you use in nano to save (write) your changes to a file?** | `Ctrl+O` | Write Out command. |
| **Both nano and vi run inside your terminal, without any GUI. (yay or nay)** | `yay` | Fully console-native terminal applications. |
| **Which text editor opens directly in insert mode, making it more beginner-friendly?** | `nano` | Immediately accepts text entry. |

---

## Task 12: Signal Recon — Network Discovery

### Operational Briefing
Before pivoting or diagnosing connectivity, you must audit network interfaces, test ICMP reachability, and identify local listening daemon sockets.

### Interface & Route Auditing:
```bash
# Modern interface inspection tool
intelofficer@bootcamp:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    inet 192.0.2.12/24 brd 192.0.2.13 scope global dynamic eth0
3: tun0: <POINTOPOINT,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 state UNKNOWN
    inet 192.0.2.14/16 scope global tun0
```
- `lo`: Local loopback interface (`127.0.0.1`).
- `eth0`: Primary ethernet interface for local subnet traffic.
- `tun0`: Point-to-Point virtual VPN adapter routing TryHackMe lab traffic.

### Host Probing & Path Tracing:
```bash
# Transmit exactly 5 ICMP echo requests
ping -c 5 facebook.com

# Trace intermediate gateway hops to target
traceroute MACHINE_IP
```

### Socket Auditing with `ss`:
The modern replacement for legacy `netstat` is `ss` (socket statistics):
```bash
intelofficer@bootcamp:~$ ss -tuln
Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port
udp    UNCONN  0       0              0.0.0.0:68           0.0.0.0:*
tcp    LISTEN  0       128            0.0.0.0:22           0.0.0.0:*
tcp    LISTEN  0       128               [::]:22              [::]:*
```
- `-t`: Filter for TCP sockets.
- `-u`: Filter for UDP sockets.
- `-l`: Restrict output to listening state (daemons waiting for connections).
- `-n`: Render IP addresses and port numbers numerically without DNS/service resolution.

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **Which command shows all your network interfaces and their assigned IPs?** | `ip a` | Modern `iproute2` interface query. |
| **How would you send only 5 pings to facebook.com?** | `ping -c 5 facebook.com` | `-c` specifies ICMP packet count. |
| **Which interface name typically shows your TryHackMe VPN tunnel connection?** | `tun0` | Virtual TUN network interface. |
| **Which command shows all TCP and UDP listening ports on your machine?** | `ss -tuln` | Socket statistics for listening TCP/UDP. |

---

## Task 13: Intel Drops — Secure File Transfer

### Operational Briefing
Transferring artifacts, configuration baselines, and exfiltrated forensic packages between workstations requires choosing the right transfer mechanism:


:::flow Connections at a glance
- File Transfer Mechanisms → Encrypted Transport (Production)
- File Transfer Mechanisms → Cleartext HTTP (Ad-hoc Lab Only)
- Encrypted Transport (Production) → SCP / SFTP / (Encrypted via SSH - Port 22)
- Cleartext HTTP (Ad-hoc Lab Only) → Python SimpleHTTP & wget / curl / (Vulnerable to Sniffing & Tampering)
:::


### Secure Copy Protocol (`scp`):
`scp` encrypts the entire payload in-transit using SSH transport security:
```bash
# Push local file to remote target home directory
scp evidence.png intelofficer@MACHINE_IP:/home/intelofficer/
```

### Ephemeral HTTP Staging:
For rapid internal data transfers in closed lab ranges, Python provides a built-in single-threaded HTTP server:
```bash
# Spin up temporary web server hosting current working directory on port 8000
python3 -m http.server 8000

# Download remote file over HTTP
wget http://MACHINE_IP:8000/evidence.png
```

> Operational Security Warning
> Tools like `wget` and `curl` over HTTP transmit payloads in plaintext. Anyone running `tcpdump` or `wireshark` on intermediate network segments can sniff credentials and inspect transmitted files. Always enforce HTTPS or `scp`/`sftp` in production environments.

### Investigating `evidence.png`:
Inspecting the transferred artifact (`evidence.png`) reveals an embedded message:
```text
YOU FOUND ME
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **what is the content of the evidence.png?** | `YOU FOUND ME` | Extracted string payload from image. |
| **Which Python command starts a simple HTTP server to share files?** | `python3 -m http.server` | Defaults to binding on port `8000`. |
| **Using wget encrypts your file transfer over HTTP.(yay or nay)** | `nay` | Plain HTTP lacks TLS transport encryption. |
| **Which command securely copies files between systems using SSH encryption?** | `scp` | Secure Copy Protocol. |

---

## Task 14: Deep Recon — Finding Files & Content

### Operational Briefing
When tracking down misconfigurations, suspicious webshells, or buried flags, manually opening directories is inefficient. Incident responders and operators rely on two complementary discovery tools:
- **`find`**: Searches filesystem *metadata* (filenames, permissions, timestamps, sizes).
- **`grep`**: Searches *inside file contents* for matching regular expressions or string patterns.

### Locating Files with `find`:
```bash
intelofficer@bootcamp:~$ cd ~
intelofficer@bootcamp:~$ find . -name "flag.txt"
./loot/deepcover/flag.txt

intelofficer@bootcamp:~$ find . -type f -name "*.jpg"
./Pictures/dog1.jpg
./Pictures/dog2.jpg
./Pictures/dog3.jpg
./Pictures/dog4.jpg
```

### Pattern Hunting with `grep`:
Once file candidates are located, use `grep` to extract specific strings:
```bash
# Search within a designated file
intelofficer@bootcamp:~$ grep "flag{" ./loot/deepcover/flag.txt
[flag omitted]

# Recursively scan all files under current directory tree
intelofficer@bootcamp:~$ grep -r "flag{" .
loot/deepcover/flag.txt:[flag omitted]
loot/archive/secret_intel.txt:[flag omitted]
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **What is the content of flag.txt?** | `[flag omitted]` | Discovered at `./loot/deepcover/flag.txt`. |
| **What is the content of second flag?** | `[flag omitted]` | Extracted via recursive `grep -r`. |
| **grep can only search one file at a time.(yay or nay)** | `nay` | Supports multiple files, wildcards, and `-r`. |
| **Which tool is better for searching inside file content. find or grep?** | `grep` | `grep` parses content; `find` parses filesystem metadata. |

---

## Task 15: Supply Armory — Package Management

### Operational Briefing
Modern Debian-derived systems (Debian, Ubuntu, Kali) maintain package hygiene through two interlinked management layers:


:::flow Connections at a glance
- Remote APT Repositories → Local Package Index Cache
- Local Package Index Cache → APT (High-Level Dependency Resolver)
- APT (High-Level Dependency Resolver) → dpkg (Low-Level .deb Installer)
- .deb Archive → dpkg (Low-Level .deb Installer)
:::


1. **APT (`Advanced Package Tool`)**: High-level repository frontend. Automatically connects to configured mirrors in `/etc/apt/sources.list`, resolves complex dependency trees, downloads binaries, and invokes `dpkg`.
2. **`dpkg`**: Low-level package engine. Installs standalone `.deb` (Debian archive) packages directly from disk without resolving remote dependencies.

### Command Syntax:
```bash
# Refresh local cache of available packages
sudo apt update

# Install a package from remote repositories
sudo apt install nmap

# Manually install an offline .deb archive
sudo dpkg -i package_name.deb
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **What is the full form of apt?** | `Advanced Package Tool` | Debian software management framework. |
| **Which command updates your local list of available packages in Kali?** | `sudo apt update` | Resynchronizes repository package index files. |
| **You need an internet connection to use APT.(yay or nay)** | `yay` | Needed for remote mirrors; cached packages and local repositories can be used without internet access. |
| **What is the file extension for Debian package files used with dpkg?** | `.deb` | Standard Debian binary archive extension. |

---

## Task 16: Tactical Command — Process Management

### Operational Briefing
Elevating to the `commander` account grants oversight of system operations. In operational environments, monitoring running processes is the first line of defense against unauthorized backdoors and rogue miners.

### Account Pivot:
```bash
fieldagent@bootcamp:~$ su -l commander
Password: [password omitted]
commander@bootcamp:~$ whoami
commander
```

### Surveillance Utilities & Options:
- `ps`: By default, selects processes with the caller’s effective user ID and controlling terminal.
- `ps aux`: Enumerates every running process across all users:
  - `a`: Selects all processes with a tty (terminal), including those of other users.
  - `u`: Formats output with user-oriented details (user, CPU%, MEM%, start time).
  - `x`: Includes processes without a controlling tty (daemons, services, background scripts).
- `kill <PID>`: Dispatches signal `15` (`SIGTERM`), requesting clean termination.
- `kill -9 <PID>`: Dispatches signal `9` (`SIGKILL`), which cannot be caught, blocked or ignored. Termination may wait for an uninterruptible kernel operation to finish.

### Hunting Down the Rogue Threat:
Auditing running processes for flag signatures uncovers a covert background runner:
```bash
commander@bootcamp:~$ ps aux | grep flag
commander    462  0.0  0.7   6936  3328 ?        Ss   02:33   0:00 /bin/bash /home/commander/cronjobs/[flag omitted].sh
commander    762  0.0  0.4   6336  2136 pts/0    S+   02:58   0:00 grep flag

# Forcefully terminate the rogue PID
commander@bootcamp:~$ kill -9 462
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **What is the flag?** | `[flag omitted]` | Extracted directly from process argument string. |
| **Which command shows all running processes from all users?** | `ps aux` | BSD syntax for full system process enumeration. |
| **The ps command only shows processes from your current shell by default.(yay or nay)** | `yay` in the room’s simplified wording | More precisely: same effective user ID and controlling terminal, not only children of the current shell. |
| **You find a rogue process with PID 4512. Write the full command to terminate it forcefully** | `kill -9 4512` | SIGKILL signal forces unconditional termination. |

---

## Task 17: Tactical Archiving — Compression & Archives

### Operational Briefing
Transporting multi-file payloads or backing up logs requires bundling multiple items into a single container file and applying compression algorithms to minimize bandwidth.

### Archiving Formats & Operations:
1. **ZIP (`.zip`)**: Popular cross-platform compression format.
   - Extract: `unzip archive.zip`
   - Create: `zip -r logs.zip mission_logs/` (the `-r` flag ensures recursive descent into subfolders).
2. **TAR (`.tar` / `.tar.gz`)**: The standard UNIX "Tape Archive" utility. Packs multiple files while preserving file permissions, ownership, and directory hierarchies.
   - Extract compressed tarball: `tar -xzvf archive.tar.gz`
   - Create compressed tarball: `tar -czvf backup.tar.gz folder/`
     - `-c`: Create new archive.
     - `-x`: Extract from archive.
     - `-z`: Filter archive through `gzip` compression.
     - `-v`: Verbose (lists processed files in real-time).
     - `-f`: Specifies the target archive filename.

### Unpacking `intel_payload.zip`:
In the commander's home folder sits `intel_payload.zip`:
```bash
commander@bootcamp:~$ unzip intel_payload.zip
Archive:  intel_payload.zip
   creating: extraction_zone/
  inflating: extraction_zone/intel_report.txt
  inflating: extraction_zone/mission_data.txt
  inflating: extraction_zone/target_coordinates.txt

commander@bootcamp:~$ grep -r "flag{" extraction_zone/
extraction_zone/intel_report.txt:[flag omitted]
```

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **What is the flag?** | `[flag omitted]` | Unpacked and recovered from `extraction_zone/`. |
| **If you want to compress an entire folder named mission_logs into a .zip file called logs.zip, which command would you use?** | `zip -r logs.zip mission_logs/` | `-r` handles recursive directory archiving. |
| **The -r option is needed when creating a .zip if you want to include subfolders.(yay or nay)** | `yay` | Omitting `-r` captures only the empty directory node. |

---

## Task 18: Outpost Sentinel — System Logs & Auditing

### Operational Briefing
Operating systems maintain continuous audit logs documenting operational events, service health, and authentication attempts. As an Outpost Sentinel, reviewing logs is critical for spotting unauthorized access attempts.

### System Logging Architecture:
- Traditional Log Files: Stored in `/var/log/` as plain text (e.g., `/var/log/auth.log` on Debian/Ubuntu or `/var/log/secure` on RHEL/CentOS).
- `systemd-journald`: Centralized binary log service accessed via `journalctl`.
  - `journalctl -f`: Follows the active log stream in real time.
  - `logger "Message"`: Utility allowing scripts and operators to inject custom events directly into the system log stream.

### Investigating Authentication Failures:
Inspecting `/var/log/auth.log` reveals an ongoing brute-force attack against the SSH daemon:
```bash
commander@bootcamp:~$ grep -i "failed password" /var/log/auth.log | head -n 5
Jul  7 04:12:01 bootcamp sshd[1245]: Failed password for invalid user admin from 192.0.2.12 port 45122 ssh2
Jul  7 04:12:05 bootcamp sshd[1248]: Failed password for invalid user root from 192.0.2.12 port 45124 ssh2
Jul  7 04:12:10 bootcamp sshd[1251]: Failed password for recruit from 192.0.2.12 port 45126 ssh2
```
The initial IP address generating authentication failures is `192.0.2.12`.

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **which ip address is the first to fail authentication?** | `192.0.2.12` | Discovered in `/var/log/auth.log`. |
| **Which command shows live updates from the systemd journal?** | `journalctl -f` | `-f` follows output in real time. |
| **logger can be used to create custom log entries that appear in journalctl.(yay or nay)** | `yay` | Standard shell interface to syslog/journal. |

---

## Task 19: Automated Patrols — Scheduled Tasks (cron)

### Operational Briefing
Routine patrols, log backups, and system audits should not depend on manual execution. The **cron** daemon executes tasks automatically in the background on recurring schedules specified in **crontab** files.

### Crontab Syntax Breakdown:
A crontab entry consists of five temporal fields followed by the command:
```text
┌───────────── Minute (0 - 59)
│ ┌─────────── Hour (0 - 23)
│ │ ┌───────── Day of Month (1 - 31)
│ │ │ ┌─────── Month (1 - 12)
│ │ │ │ ┌───── Day of Week (0 - 6, Sunday = 0 or 7)
│ │ │ │ │
* * * * *  /path/to/command_or_script.sh
```
- `*/20 * * * *`: Executes every 20 minutes.
- `0 0 * * *`: Executes daily at midnight.

### Crontab Management Commands:
- `crontab -l`: Lists all scheduled cron jobs for the current user.
- `crontab -e`: Opens the user's crontab in the default text editor.
- `crontab -r`: Removes the user's crontab.

### Auditing Commander's Scheduled Patrols:
```bash
commander@bootcamp:~$ crontab -l
# Automated System Maintenance
*/20 * * * * /home/commander/scripts/cleanup.sh > /dev/null 2>&1
```
The scheduled maintenance script executing every 20 minutes is `cleanup.sh`.

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **What command shows you all the cron jobs scheduled for your current user?** | `crontab -l` | Lists active user crontab entries. |
| **What single command would you run to edit your user’s cron jobs?** | `crontab -e` | Edits user crontab file. |
| **There’s a script that runs every 20 minutes via cron, what’s its name?** | `cleanup.sh` | Identified from crontab schedule: `*/20 * * * *`. |

---

## Task 20: Mission Debrief — Room Completion

### Operational Debriefing
The room concludes after twenty tasks. This records completion of the training sequence, not a separate professional certification.


:::flow Connections at a glance
- 1. Network Access / (OpenVPN & SSH) → 2. Navigation & FHS / (pwd, cd, ls, cat)
- 2. Navigation & FHS / (pwd, cd, ls, cat) → 3. File Operations & Permissions / (touch, mkdir, chmod, chown)
- 3. File Operations & Permissions / (touch, mkdir, chmod, chown) → 4. Redirection & Pipelining / (>, >>, |, &&, ||)
- 4. Redirection & Pipelining / (>, >>, |, &&, ||) → 5. Privilege Elevation / (su, sudo, passwd)
- 5. Privilege Elevation / (su, sudo, passwd) → 6. Recon & Forensics / (find, grep, ss, ip)
- 6. Recon & Forensics / (find, grep, ss, ip) → 7. System Administration / (ps aux, kill -9, tar, zip)
- 7. System Administration / (ps aux, kill -9, tar, zip) → 8. Auditing & Automation / (journalctl, auth.log, cron)
:::


### Cumulative Flag Inventory
| Milestone Task | Flag Identifier | Concept Validated |
| :--- | :--- | :--- |
| **Task 5: Route Mapping** | `[flag omitted]` | Hidden file discovery (`ls -la`) |
| **Task 10: Rank Elevation** | `[flag omitted]` | Privilege inspection (`secret.sh`) |
| **Task 14: Deep Recon (1)** | `[flag omitted]` | Deep path scanning (`find`) |
| **Task 14: Deep Recon (2)** | `[flag omitted]` | Recursive pattern matching (`grep -r`) |
| **Task 16: Tactical Command** | `[flag omitted]` | Process surveillance (`ps aux \| grep`) |
| **Task 17: Tactical Archiving**| `[flag omitted]` | Archive extraction (`unzip`) |

### Task Verification & Solution

| Question | Answer | Notes |
| :--- | :--- | :--- |
| **You’ve earned your stripes in Linux operations. Carry these skills into every environment you encounter. Over and out!** | *No answer needed* | Room 100% completed. |

---

## Operational Cheat Sheet & Reference Card

For rapid deployment during security assessments and system maintenance:

### 1. File Inspection & Navigation
```bash
pwd                                 # Print working directory canonical path
cd ~                                # Return to user home directory
ls -lah                             # Long list including hidden files with human-readable sizes
cat /etc/os-release                 # Display Linux distribution details
head -n 20 file.txt                 # Print first 20 lines
tail -n 20 -f /var/log/syslog       # Print last 20 lines and follow additions
```

### 2. Permissions & Ownership
```bash
chmod 751 script.sh                 # rwx for user, r-x for group, --x for others
chmod a+x script.sh                # Explicitly add execute permission for all users
chown user:group file.txt           # Alter user and group ownership simultaneously
```

### 3. Redirection & Pipelines
```bash
cmd > file.txt                      # Overwrite stdout to file
cmd >> file.txt                     # Append stdout to file
cmd 2>&1                            # Redirect stderr to stdout
cmd1 && cmd2                        # Execute cmd2 only if cmd1 returns 0 (success)
cmd1 || cmd2                        # Execute cmd2 only if cmd1 fails
ps aux | grep nginx                 # Chain output into filter
```

### 4. Forensic Search & Pattern Extraction
```bash
find / -type f -name "*.conf" 2>/dev/null       # Search entire drive, discard permission errors
grep -rni "password" /var/www/html/            # Recursive, case-insensitive search with line numbers
```

### 5. Process & System Auditing
```bash
ps aux | grep python                # Identify process IDs of running scripts
kill -9 <PID>                       # Force kill uncooperative process
ss -tuln                            # View listening TCP/UDP ports numerically
journalctl -u sshd -n 50 --no-pager # Review last 50 log lines for SSH service
crontab -l                          # Enumerate active scheduled jobs
```

## Documentation references

- [Official Linux Bootcamp room](https://tryhackme.com/room/linuxbootcamp) — current tasks and connection instructions.
- [chmod manual](https://man7.org/linux/man-pages/man1/chmod.1.html).
- [su manual](https://man7.org/linux/man-pages/man1/su.1.html).
- [Linux signals](https://man7.org/linux/man-pages/man7/signal.7.html).

Technical clarifications in this public edition cover directory search permission, umask, temporary-directory cleanup, login environments and the difference between room completion and professional certification.
