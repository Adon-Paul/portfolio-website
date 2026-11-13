> Scope: this reference includes both passive research and active queries. Match the method to your authorization; a tool being called OSINT does not make every operation passive.


**Domain research · DNS · Subdomains · Email · Usernames**

A practical reference for choosing a tool, running a focused query, and understanding what its results establish.


## Choose a tool

| Starting point | Question | Tool |
| :--- | :--- | :--- |
| Domain | Who is the registrar, and when was it registered? | [WHOIS](#whois) |
| Domain | What records do its DNS servers publish? | [dig](#dig) or [nslookup](#nslookup) |
| Domain | Can I automate DNS enumeration? | [DNSRecon](#dnsrecon) |
| Domain | What subdomains appear in public sources? | [Subfinder](#subfinder) |
| Domain | What public email addresses and hosts are associated with it? | [theHarvester](#theharvester) |
| Email address | Does it appear in known breach records? | [Have I Been Pwned](#have-i-been-pwned) |
| Email address | Do supported services indicate an existing account? | [Holehe](#holehe) |
| Username | Where else is the same handle used? | [Sherlock](#sherlock) |
| Domain or asset | Can I use a hosted reconnaissance platform? | [Pentester](#pentester) |

---

## Domain registration and DNS

### WHOIS

**Use for:** Registration dates, registrar details, domain status, and nameservers where the service publishes them.

```bash
whois example.com
```

**Read the result:** Look for creation and expiry dates, registrar, domain status, and nameservers. Registrant details may be redacted or belong to a privacy service; they do not necessarily identify the operator.

**Web alternative:** [Whois.com lookup](https://www.whois.com/whois/)

### dig

**Use for:** Precise DNS queries, including a chosen record type or resolver.

```bash
# IPv4 addresses
dig example.com A

# Mail servers
dig example.com MX

# Authoritative nameservers
dig example.com NS

# Published text records
dig example.com TXT

# Query a specific resolver
dig @1.1.1.1 example.com A

# Return a concise answer
dig +short example.com A
```

| Record | What to inspect |
| :--- | :--- |
| `A` / `AAAA` | IPv4 / IPv6 addresses |
| `MX` | Mail servers and priority values |
| `NS` | Authoritative nameservers |
| `TXT` | Published text, including verification and email-policy records |
| `CNAME` | An alias pointing to another hostname |

**Zone transfer:** For an in-scope nameserver, an AXFR request asks for the zone’s records. Replace the example server with an actual authoritative nameserver.

```bash
dig @ns1.example.com example.com AXFR
```

A refused transfer does not mean the domain has no other records.

### nslookup

**Use for:** Basic DNS queries on systems where `nslookup` is available.

```bash
# Query mail servers
nslookup -type=mx example.com

# Query nameservers
nslookup -type=ns example.com
```

For interactive queries, start the tool:

```bash
nslookup
```

Then enter these commands at its prompt:

```text
set type=ns
example.com
exit
```

### DNSRecon

**Use for:** Automated DNS enumeration, including common records, wildcard checks, and wordlist-based subdomain discovery.

```bash
# Standard enumeration
dnsrecon -d example.com

# Subdomain enumeration with a local wordlist
dnsrecon -d example.com -D wordlist.txt -t brt
```

`-d` selects the domain, `-D` supplies the wordlist, and `-t brt` selects brute-force enumeration. The wordlist must exist locally. Wildcard DNS can make nonexistent names appear to resolve, so review findings before treating them as distinct assets.

**Reference:** [DNSRecon project](https://github.com/darkoperator/dnsrecon)

---

## Subdomain discovery

### Subfinder

**Use for:** Passive subdomain discovery through public sources and supported data providers.

```bash
# Discover subdomains and save the output
subfinder -d example.com -o subdomains.txt
```

**Output:** A list of candidate subdomains. Discovery alone does not establish that a hostname currently resolves or hosts a live service. Some providers require API keys.

**Reference:** [Subfinder project](https://github.com/projectdiscovery/subfinder)

---

## Email research

### Have I Been Pwned

**Use for:** Checking whether an email address appears in breaches indexed by the service.

Open [Have I Been Pwned](https://haveibeenpwned.com/) and use the email search. API access has separate requirements described in the [official API documentation](https://haveibeenpwned.com/API/v3).

**Interpretation:** A match establishes inclusion in an indexed breach. It does not establish current account access or current password validity. No match does not prove an address has never been exposed.

### theHarvester

**Use for:** Gathering publicly indexed email addresses, hostnames, and related domain information from supported sources.

```bash
# Check options and supported source names
theHarvester -h

# Example: query certificate-transparency data
theHarvester -d example.com -l 500 -b crtsh
```

| Option | Purpose |
| :--- | :--- |
| `-d` | Domain to investigate |
| `-l` | Search limit; behavior depends on the source |
| `-b` | Data source |

Sources, API requirements, and available results vary by version. Choose a source listed by your installed version; a certificate-transparency source primarily contributes hostnames rather than email addresses.

**Reference:** [theHarvester project](https://github.com/laramies/theHarvester)

### Holehe

This queries service account/recovery responses and is not part of the passive-only Sakura exercise. Use only with appropriate authorization; do not trigger recovery or contact accounts in that room.

**Use for:** Checking whether supported services indicate that an email address is associated with an account, using registration or recovery responses.

```bash
holehe targetemail@example.com
```

**Interpretation:** Treat results as leads. Rate limits, service changes, and ambiguous responses can affect accuracy. An account-existence signal does not reveal who controls the account.

**Reference:** [Holehe project](https://github.com/megadose/holehe)

---

## Username research

### Sherlock

**Use for:** Finding candidate profiles that use the same username across supported websites.

```bash
sherlock targetusername
```

**Validate each candidate:** Compare profile descriptions, linked websites, photographs, location claims, and other independently matching details. A shared username alone does not establish a shared identity.

**Reference:** [Sherlock project](https://github.com/sherlock-project/sherlock)

---

## Hosted reconnaissance

### Pentester

**Use for:** Accessing the hosted security platform at [Pentester.com](https://pentester.com/).

Available discovery and scanning functions depend on the platform’s current offering and account access. Review the selected feature before running it: a hosted platform can perform active checks as well as collect public information.

---

## Investigation workflow

1. **Record the starting clue.** Save the exact domain, email address, or username and where it came from.
2. **Choose the relevant tool.** Use the quick-reference table to match the question to the query.
3. **Capture the evidence.** Record the command or search, source URL, date, and useful output.
4. **Validate the result.** Check candidate profiles, DNS records, and account signals against independent evidence.
5. **Separate findings from assumptions.** State what the evidence shows and what remains uncertain.

### Evidence template

```text
Starting clue:
Question:
Tool / source:
Command / query:
Date and time:
Result:
Supporting evidence:
Confidence and limitations:
Next step:
```

## Related notes

- [Sakura — OSINT walkthrough](/guides/sakura/)

*Examples use placeholder domains and identities. Commands assume the relevant tool is installed; use its help output for version-specific options.*
