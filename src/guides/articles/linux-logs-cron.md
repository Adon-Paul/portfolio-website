Maintaining visibility over system health and automating recurring operational checks are foundational responsibilities of Linux system operators and security engineers.

## Linux System Logging Architecture


:::flow Connections at a glance
- Linux Kernel (/dev/kmsg) → systemd-journald
- System Services (sshd, apache, cron) → systemd-journald
- systemd-journald → Binary Journal (/run/log /var/log/journal)
- systemd-journald → rsyslogd
- rsyslogd → /var/log/auth.log / /var/log/syslog
:::


### 1. Traditional Log Files (`/var/log/`)
Plaintext, timestamped records parsed easily using text utilities (`grep`, `awk`, `cut`):
- `/var/log/auth.log` (Debian/Ubuntu) or `/var/log/secure` (RHEL): Logs authentication events, `sudo` usage, and SSH login attempts.
- `/var/log/syslog` or `/var/log/messages`: General operating system event store.
- `/var/log/dpkg.log`: Historical audit trail of installed, updated, or removed package binaries.

### Forensic Triage Example: Detecting SSH Brute Force
```bash
# Locate first failed authentication attempts
grep -i "failed password" /var/log/auth.log | head -n 5

# Extract source IPs from matching log records and sort by attempt volume
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr
```

### 2. `systemd-journald` & `journalctl`
The systemd logging daemon aggregates log streams into indexed binary logs.
- `journalctl -f`: Follows the active log stream in real time.
- `journalctl -u ssh.service`: Filters exclusively for SSH daemon logs.
- `journalctl --since "1 hour ago"`: Bounded temporal query.
- `logger "Custom alert message"`: CLI command to inject custom log messages into the system logging pipeline.

---

## Task Automation with `cron`

The `cron` daemon executes scheduled commands in the background without user intervention.

### Crontab Time Specification Matrix
```text
┌───────────── Minute (0 - 59)
│ ┌─────────── Hour (0 - 23)
│ │ ┌───────── Day of Month (1 - 31)
│ │ │ ┌─────── Month (1 - 12)
│ │ │ │ ┌───── Day of Week (0 - 6, Sunday = 0 or 7)
│ │ │ │ │
* * * * *  /path/to/executable_or_script.sh
```

### Common Scheduling Patterns:
| Schedule Expression | Meaning | Typical Use Case |
| :--- | :--- | :--- |
| `* * * * *` | Every single minute | High-frequency telemetry |
| `*/20 * * * *` | Every 20 minutes | Cache flushes & periodic integrity scans |
| `0 * * * *` | Hourly (at minute 0) | Log rotation & metrics aggregation |
| `0 2 * * *` | Daily at 02:00 AM | Database backups & nightly sync |
| `0 0 * * 0` | Weekly on Sunday at midnight | Full system cleanup & cold backups |

### Crontab Commands:
```bash
# Display scheduled cron jobs for current user
crontab -l

# Edit user cron table in default editor
crontab -e

# View scheduled jobs for another user (requires sudo)
sudo crontab -u commander -l
```

---

## Related Notes & Graph Links
- Back to [TryHackMe - Linux Bootcamp](/guides/linux-bootcamp-walkthrough/)
- See [Linux Filesystem Hierarchy](/guides/linux-filesystem/) for log storage structures in `/var/log`.
- See [Linux Process & Signal Management](/guides/linux-processes/) for tracking background cron jobs.
- See [Linux Redirection & Pipelines](/guides/linux-pipelines/) for handling standard error redirection in cron commands.

Log paths and SSH service names vary by distribution. The field-based awk example assumes the shown SSH log format; inspect sample records before using it elsewhere. Failed logins alone do not prove a brute-force attack. Cron runs with a limited environment; use explicit paths and check the host timezone.
