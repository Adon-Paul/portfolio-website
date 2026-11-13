The **Filesystem Hierarchy Standard (FHS)** defines the directory structure and directory contents in Linux distributions. Unlike Windows, which allocates separate drive roots (`C:`, `D:`), UNIX-like systems arrange all physical storage drives, virtual partitions, memory-mapped filesystems, and device nodes beneath a single root directory: `/`.

## The Root Directory Tree (`/`)


:::flow Connections at a glance
- / (Root) → /bin -> /usr/bin / (Essential Binaries)
- / (Root) → /sbin -> /usr/sbin / (System Admin Binaries)
- / (Root) → /etc / (System Configurations)
- / (Root) → /home / (User Home Environments)
- / (Root) → /root / (Superuser Home)
- / (Root) → /var / (Variable State & Logs)
- / (Root) → /tmp / (Volatile Scratch Space)
- / (Root) → /proc / (Kernel Virtual Process Tree)
- / (Root) → /sys / (Kernel Hardware Subsystem)
- / (Root) → /dev / (Device Special Files)
:::


## Directory Reference & Security Context

### 1. `/etc` — Static System Configuration
- **Purpose**: Host-specific static configuration files for the system and installed daemons.
- **Key Targets**:
  - `/etc/passwd`: User account database (usernames, UIDs, GIDs, default shell, home directories).
  - `/etc/shadow`: Cryptographic password hashes (readable exclusively by root or shadow group).
  - `/etc/sudoers`: Privilege elevation rules for `sudo`.
  - `/etc/ssh/sshd_config`: Daemon configurations for SSH server hardening.
- **Relevance**: Auditing `/etc` is standard practice during system hardening and privilege escalation audits.

### 2. `/var` — Variable State & Logging
- **Purpose**: Contains files that change size and content dynamically as the system operates.
- **Key Subdirectories**:
  - `/var/log/`: Log repositories (`syslog`, `auth.log`, web server access/error logs).
  - `/var/spool/`: Queues for print jobs, mail, and scheduled cron execution.
  - `/var/backups/`: Historical copies of key system files.

### 3. `/proc` — Kernel Virtual Process & Hardware Tree
- **Purpose**: A memory-only pseudo-filesystem populated by the Linux kernel on-the-fly. It does not exist on disk.
- **Key Features**:
  - `/proc/[PID]/`: Every running process has a numeric directory exposing its environment variables (`environ`), open file descriptors (`fd`), and executable path (`exe`).
  - `/proc/version`: Kernel version and compiler build data.
  - `/proc/cpuinfo`: Hardware CPU details.

### 4. `/tmp` & `/var/tmp` — Temporary Storage
- **Purpose**: Scratch storage for short-lived data.
- **Sticky Bit (`t`)**: Permissions are typically `1777` (`drwxrwxrwt`), permitting anyone to create files, but removal/renaming is restricted to the file owner, directory owner or a suitably privileged process.
- **Persistence**: `/tmp` cleanup depends on distribution and mount configuration; it may be a tmpfs and cleared at reboot. `/var/tmp` is intended to survive reboots, but age-based cleanup may still apply.

### 5. `/home` vs `/root`
- `/home/<username>`: Default landing zone for standard unprivileged users. Contains user dotfiles (`.bashrc`, `.profile`) and SSH keys (`~/.ssh/id_rsa`, `~/.ssh/authorized_keys`).
- `/root`: The distinct home directory of the root superuser. Kept on the root partition to ensure accessibility even if `/home` resides on an unmounted network share.

---

## Related Notes & Graph Links
- Back to [TryHackMe - Linux Bootcamp](/guides/linux-bootcamp-walkthrough/)
- See [Linux Permissions & Access Control](/guides/linux-permissions/) for file protection mechanisms.
- See [Linux Log Auditing & Cron Automation](/guides/linux-logs-cron/) for log triaging inside `/var/log`.
