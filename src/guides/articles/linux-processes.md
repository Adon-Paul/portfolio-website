In Linux, a **process** is an executing instance of a program in memory, managed by the kernel and identified by a unique integer called a **Process ID (PID)**. Operating systems maintain process tables tracking CPU usage, memory allocation, ownership, priority, and parent-child relationships.

## Process Surveillance Utilities


:::flow Connections at a glance
- Linux Kernel → PID 1 (systemd)
- PID 1 (systemd) → Background Daemons (sshd, cron)
- PID 1 (systemd) → Interactive Shells (bash)
- Interactive Shells (bash) → Forked Processes (grep, python)
:::


### 1. `ps` (Process Status Snapshot)
- `ps`: By default, selects processes with the same effective user ID and controlling terminal as the caller.
- `ps aux` (BSD Syntax):
  - `a`: Displays processes for all users.
  - `u`: Formats output with user-oriented metrics (user, CPU%, MEM%, start time).
  - `x`: Includes processes not attached to any controlling terminal (e.g., background daemons).
- `ps -ef` (POSIX/System V Syntax):
  - `-e`: Select all processes.
  - `-f`: Full-format listing including PPID (Parent Process ID).

### 2. `top` & `htop` (Dynamic Real-Time Monitors)
Provides continuous real-time statistics regarding CPU load averages, memory consumption, swap utilization, and thread states.

---

## Inter-Process Signals & Process Termination

Signals are asynchronous notifications sent to a process to notify it of an event or enforce an action.

### Critical UNIX Signals:
| Signal Number | Signal Name | Standard Keystroke | Kernel Behavior & Handling |
| :---: | :---: | :---: | :--- |
| **1** | `SIGHUP` | Terminal Close | Hangup. Some programs implement configuration reload on SIGHUP; the default action is termination. |
| **2** | `SIGINT` | `Ctrl + C` | Interrupt from keyboard. Process can intercept, handle, or ignore. |
| **9** | `SIGKILL` | None | **Forced Termination**. Cannot be caught, blocked, or ignored. Enforced directly by the kernel. |
| **15** | `SIGTERM` | Default `kill` | **Graceful Termination**. Requests process to clean up open files, buffers, and state before exiting. |
| **19** | `SIGSTOP` | None (Ctrl + Z normally sends SIGTSTP) | Pauses process execution. Cannot be caught or ignored. |
| **18** | `SIGCONT` | `fg` / `bg` | Resumes a stopped process. |

### Process Termination in Practice:
```bash
# Graceful termination request (Signal 15)
kill 4512

# Unconditional forced kill (Signal 9)
kill -9 4512

# Terminate processes matching a specific name pattern
pkill -9 -f "miner.sh"

# Kill all instances of a program by executable name
killall apache2
```

> Engineering Principle: SIGTERM vs SIGKILL
> Always attempt `kill` (`SIGTERM`) first. This gives the application opportunity to close database connections, write pending memory buffers to disk, and remove stale PID lockfiles. Resort to `kill -9` (`SIGKILL`) when a process does not respond to normal termination. A process in uninterruptible kernel sleep may not exit until that wait ends, even after SIGKILL.

---

## Related Notes & Graph Links
- Back to [TryHackMe - Linux Bootcamp](/guides/linux-bootcamp-walkthrough/)
- See [Linux Redirection & Pipelines](/guides/linux-pipelines/) for piping process output into filters.
- See [Linux Log Auditing & Cron Automation](/guides/linux-logs-cron/) for managing automated recurring background processes.

Signal numbers above reflect common Linux architectures; prefer signal names for portability. SIGTERM allows a program to handle shutdown but does not guarantee that it will clean up. Test signals only on a disposable process you started.

Reference: [Linux signal manual](https://man7.org/linux/man-pages/man7/signal.7.html).
