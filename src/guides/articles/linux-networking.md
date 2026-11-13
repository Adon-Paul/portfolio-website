Network verification and secure data staging are critical disciplines in systems administration and penetration testing. Understanding how interfaces bind, how listening sockets expose attack surfaces, and how data moves across boundaries dictates operational effectiveness.

## Network Interface Discovery


:::flow Connections at a glance
- Linux Network Stack → lo: Loopback / 127.0.0.1/8
- Linux Network Stack → eth0: Physical / VM LAN / lab interface
- Linux Network Stack → tun0: Virtual TUN Tunnel / 10.x.x.x (VPN)
:::


### Modern `iproute2` (`ip`) vs Legacy `net-tools` (`ifconfig`)
While `ifconfig` remains widely used, the modern standard is the `ip` command suite:
```bash
# Enumerate all interfaces, link state, and IP allocations
ip a
ip addr show

# Enumerate kernel IP routing tables
ip route show

# View Neighbor table (ARP cache)
ip neigh
```

---

## Active Probing & Reachability Testing

### 1. ICMP Reachability (`ping`)
In Linux, `ping` runs continuously until interrupted, unlike Windows which defaults to 4 packets. Use `-c` to bound packet count:
```bash
# Transmit exactly 4 ICMP packets
ping -c 4 192.0.2.10
```

### 2. Path Tracing (`traceroute`)
Maps the intermediate router hops between client and destination:
```bash
traceroute 192.0.2.10
```

### 3. Listening Socket Auditing (`ss` vs `netstat`)
`ss` communicates directly with kernel socket tables, executing significantly faster than legacy `netstat`:
```bash
# Audit all listening TCP and UDP sockets with numeric ports
ss -tuln
```
- `-t`: TCP sockets.
- `-u`: UDP sockets.
- `-l`: Listening sockets only.
- `-n`: Numeric port display (suppresses `/etc/services` name lookup).
- `-p`: Displays process names and PIDs where permitted; viewing other users’ processes may require elevated privileges.

---

## File Transfer Methodologies

### 1. Secure Copy (`scp`) — Production Standard
Encapsulates file transfers within SSH transport layer encryption (TCP port 22):
```bash
# Push local file to remote server
scp report.txt user@remote_host:/home/user/

# Pull remote file to local working directory
scp user@remote_host:/var/log/auth.log ./local_auth.log

# Recursive directory copy using specific port
scp -P 2222 -r ./evidence_dir/ user@remote_host:/tmp/
```

### 2. Ephemeral HTTP Staging (`python3` + `wget`/`curl`)
Quickly exposes local directory contents for internal lab use:
```bash
# Host current directory on port 8000
python3 -m http.server 8000 --bind 127.0.0.1

# In a second terminal on the same machine, download a file you placed there
wget http://127.0.0.1:8000/example.txt
curl -O http://127.0.0.1:8000/example.txt
```

> Security Consideration
> Plain HTTP transfers (`wget`, `curl` over `http://`) lack encryption and integrity validation. In an operational assessment, cleartext file transfers expose files to network eavesdropping and tampering via ARP spoofing.

---

## Related Notes & Graph Links
- Back to [TryHackMe - Linux Bootcamp](/guides/linux-bootcamp-walkthrough/)
- See [Linux Process & Signal Management](/guides/linux-processes/) for mapping listening ports to running PIDs.
- See [Linux Log Auditing & Cron Automation](/guides/linux-logs-cron/) for monitoring incoming network connections.

The HTTP example now binds to loopback by default. For an authorized two-machine lab, explicitly select the lab interface and use a directory containing only files intended for transfer. A listening socket does not prove remote reachability; routing and firewall rules also matter.
