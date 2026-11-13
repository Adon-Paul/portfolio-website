**Discover hosts · Scan ports · Identify services · Record findings**

**Nmap (Network Mapper)** is an open-source tool for exploring networks and auditing exposed services. Use it to answer: **Which hosts respond? Which ports are reachable? What services appear to be running?**

> Start here
> A normal scan checks the **1,000 most common TCP ports**, not every port. Choose the target, scan type, and port range deliberately.


---

## Command structure

```bash
nmap [options] <target>
```

| Target form | Example |
| :--- | :--- |
| One IP address | `nmap 192.0.2.10` |
| Multiple addresses | `nmap 192.0.2.10 192.0.2.11` |
| Hostname | `nmap lab.example` |
| CIDR subnet | `nmap 192.0.2.0/24` |
| Address range | `nmap 192.0.2.10-20` |
| File of targets | `nmap -iL targets.txt` |

The 192.0.2.0/24 addresses are reserved documentation examples, not live targets. Replace them with your actual targets. `sudo` examples assume Linux and privileges for raw-packet scans.

## Essential options

| Purpose | Option | Meaning |
| :--- | :--- | :--- |
| Discover hosts | `-sn` | Perform host discovery without a port scan |
| Skip discovery | `-Pn` | Treat all specified targets as up for scanning |
| Preview targets | `-sL -n` | List targets without reverse DNS lookups |
| TCP SYN scan | `-sS` | Probe TCP ports without completing the normal handshake |
| TCP connect scan | `-sT` | Use the operating system's TCP connection mechanism |
| UDP scan | `-sU` | Probe UDP ports |
| Specific ports | `-p 22,80,443` | Scan the listed ports |
| Port range | `-p 1-1024` | Scan an inclusive range |
| All standard ports | `-p-` | Scan ports **1–65535** for the selected protocol(s) |
| Fewer ports | `-F` | Scan the 100 most common ports |
| Top N ports | `--top-ports 20` | Scan the 20 most common ports |
| Version detection | `-sV` | Probe services to identify software and versions |
| OS detection | `-O` | Attempt OS fingerprinting |
| Default scripts | `-sC` | Run the default NSE script set |
| Combined detection | `-A` | Enable OS/version detection, default scripts, and traceroute |
| Timing template | `-T0` … `-T5` | Adjust timing; default is `-T3` |
| Sequential order | `-r` | Scan ports in ascending order |
| Disable DNS | `-n` | Skip reverse DNS resolution |
| Explain states | `--reason` | Show why Nmap assigned a state |

**Reference:** [Options summary](https://nmap.org/book/man-briefoptions.html), [port selection](https://nmap.org/book/man-port-specification.html).

---

## Host discovery

```bash
# Find responding hosts on the lab subnet
nmap -sn 192.0.2.0/24

# Preview the target range without reverse DNS queries
nmap -sL -n 192.0.2.0/24

# Scan a known host even if discovery probes receive no response
nmap -Pn -p 22,80,443 192.0.2.10
```

- **`-sn` is more than ICMP ping.** Discovery can use ARP, ICMP, or TCP probes depending on the network and privileges.
- **`-Pn` does not discover live hosts.** It attempts the requested scan against every specified address, which can waste time on large ranges.
- **`-sL` alone can generate DNS traffic.** Add `-n` and use numeric addresses for a target-list preview without name resolution.
- On a directly connected Ethernet network, Nmap may still perform ARP/Neighbor Discovery with `-Pn` to obtain link-layer addresses.

**Reference:** [Host discovery](https://nmap.org/book/man-host-discovery.html).

## TCP and UDP scans

### TCP: SYN versus connect

```bash
# SYN scan: requires raw-packet privileges
sudo nmap -sS -p 22,80,443 192.0.2.10

# Connect scan: useful without raw-packet privileges
nmap -sT -p 22,80,443 192.0.2.10
```

| Scan | How it works | Key point |
| :--- | :--- | :--- |
| `-sS` | Sends SYN probes; normally resets an open connection before completing the handshake | Often called “half-open”; still detectable |
| `-sT` | Asks the OS to establish TCP connections | Completes connections to open ports and may produce application logs |

When no scan type is specified, Nmap normally uses SYN scanning when privileges permit, otherwise TCP connect scanning.

### UDP

```bash
# Start with a small UDP port set and probe for service responses
sudo nmap -sU -sV -p 53,123,161 192.0.2.10

# Explicitly select ports for each transport protocol
sudo nmap -sS -sU -p T:22,80,443,U:53,161 192.0.2.10
```

UDP often takes longer because silence is ambiguous and ICMP responses may be rate-limited. An `open|filtered` result does **not** confirm a listening service. Version probes can sometimes resolve the ambiguity.

**Reference:** [Port scanning techniques](https://nmap.org/book/man-port-scanning-techniques.html).

## Service and OS detection

```bash
# Identify services on selected ports
nmap -sV -p 22,80,443 192.0.2.10

# Attempt operating system fingerprinting
sudo nmap -O 192.0.2.10

# Combine detection features on selected ports
sudo nmap -A -p 22,80,443 192.0.2.10
```

Without `-sV`, the `SERVICE` column may simply reflect Nmap's usual service name for that port. With `-sV`, Nmap sends probes to identify what actually responds. Services can run on unexpected ports.

OS fingerprinting is an inference; it works best when Nmap finds at least one open and one closed TCP port. Firewalls and limited responses can reduce confidence.

> Detection is evidence, not proof
> A reported version is a starting point for investigation. Banners can be misleading, and vendor packages may include backported fixes. Confirm vulnerability status against the installed package and its advisory.

**References:** [Service detection](https://nmap.org/book/man-version-detection.html), [OS detection](https://nmap.org/book/man-os-detection.html).

---

## Reading the results

Illustrative output:

```text
PORT     STATE     SERVICE
22/tcp   open      ssh
80/tcp   closed    http
443/tcp  filtered  https
```

| State | Interpretation |
| :--- | :--- |
| **open** | A service accepts connections or datagrams on that port |
| **closed** | The port is reachable, but no service is listening |
| **filtered** | Filtering or another obstacle prevents Nmap from deciding whether it is open |
| **unfiltered** | The port is reachable, but the scan type cannot distinguish open from closed |
| **open\|filtered** | Nmap cannot distinguish an open port from a filtered one; common with UDP |
| **closed\|filtered** | Nmap cannot distinguish closed from filtered; seen with IP ID idle scans |

A state describes what Nmap observes **from your scanning location**. The same port may appear open internally and filtered externally.

```bash
# Include the response or lack of response behind each state
nmap --reason -p 22,80,443 192.0.2.10
```

**Reference:** [Port states](https://nmap.org/book/man-port-scanning-basics.html).

## Practical lab workflow

### 1. Check the target scope

```bash
nmap -sL -n 192.0.2.0/24
```

### 2. Discover responding hosts

```bash
nmap -sn 192.0.2.0/24
```

### 3. Find TCP ports on one host

```bash
mkdir -p scans
sudo nmap -sS -p- --reason -oA scans/tcp-discovery 192.0.2.10
```

### 4. Investigate the ports you found

If step 3 reports ports **22, 80, and 443** open:

```bash
nmap -sV -p 22,80,443 -oA scans/service-details 192.0.2.10
```

### 5. Record what the evidence establishes

```text
Target and scope:
Date / scanning location:
Nmap version and exact command:
Port / protocol / state:
Detected service and version:
Supporting output file:
Uncertainty / next check:
```

This sequence separates finding ports from probing services and preserves the original scan evidence. Adapt discovery and port selection to the task.

---

## Nmap Scripting Engine

NSE uses Lua scripts for tasks such as service inspection, discovery, and targeted vulnerability checks.

```bash
# Read a script's documentation before running it
nmap --script-help http-title

# Retrieve page titles from selected web ports
nmap -sV --script http-title -p 80,443 192.0.2.10

# Run the default script set on selected ports
nmap -sC -sV -p 22,80,443 192.0.2.10
```

`-sC` means `--script=default`. Some default scripts are intrusive; review the selected scripts and their behavior for the task. The `vuln` category is a collection of checks, not a guarantee that every vulnerability will be detected.

**Reference:** [Nmap Scripting Engine](https://nmap.org/book/man-nse.html).

## Timing and saved output

### Timing

| Template | Name | Study note |
| :---: | :--- | :--- |
| `-T0` | Paranoid | Extremely slow |
| `-T1` | Sneaky | Very slow |
| `-T2` | Polite | Reduces scan intensity |
| `-T3` | Normal | Default adaptive timing |
| `-T4` | Aggressive | Suitable for reasonably fast, reliable networks |
| `-T5` | Insane | Tight timing can sacrifice accuracy |

`-T4` changes timing; `-F` reduces the number of ports. They solve different problems. Start with defaults and adjust based on network behavior. Slow timing does not guarantee that a scan goes undetected.

**Reference:** [Timing and performance](https://nmap.org/book/man-performance.html).

### Output

| Option | Result |
| :--- | :--- |
| `-oN scan.txt` | Human-readable normal output |
| `-oX scan.xml` | XML for software processing |
| `-oA scans/baseline` | Normal `.nmap`, XML `.xml`, and grepable `.gnmap` files |
| `-v` | More verbose progress and results |
| `--open` | Display only open or possibly open ports |

Create the parent directory before saving. Prefer XML for new parsing workflows; grepable output is deprecated. Keep full results when closed or filtered ports matter to the investigation.

```bash
mkdir -p scans
nmap -sV -p 22,80,443 -oA scans/baseline 192.0.2.10
```

**Reference:** [Output formats](https://nmap.org/book/man-output.html).

---

## Common mistakes

| Mistake | Correction |
| :--- | :--- |
| Writing `-p -` for a full scan | Use the clear documented form **`-p-`** |
| Assuming `-A` scans all ports | Add `-p-` separately if the task needs all ports |
| Treating `-sS` as invisible | SYN probes can be detected and logged |
| Treating `-sn` as an inventory of every device | Nonresponding or filtered hosts may be missed |
| Assuming `-Pn` bypasses a firewall | It skips discovery; filtering can still block the scan |
| Treating an open port as a vulnerability | Identify the service and validate the specific issue |
| Assuming TCP results cover UDP | Select `-sU` explicitly for UDP |

## Test your understanding

1. How do `-sn` and `-Pn` differ?
2. Why can `-sL` still generate network traffic?
3. What does `-A` enable, and what does it leave unchanged?
4. Why is a UDP `open|filtered` result inconclusive?
5. What additional evidence would you want before calling a reported service vulnerable?

## Related notes

- [Linux Network Reconnaissance & File Transfers](/guides/linux-networking/) — local interfaces, sockets, and file transfers.
- [OSINT Tools](/guides/osint-workflow/) — domain research and public-source discovery.

*Checked against the official Nmap reference on 30 October 2026. For your installed version, use `nmap --version`, `nmap -h`, and `man nmap`.*
