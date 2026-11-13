Linux governs filesystem access via **Discretionary Access Control (DAC)**. Access rights are determined by three entities: the **Owner User (`u`)**, the **Owning Group (`g`)**, and all **Others (`o`)**.

## Permission Triad & Numeric Weighting

Each permission triplet contains three binary switches: Read (`r`), Write (`w`), and Execute (`x`).

```text
r (Read)    = 4  (2^2)
w (Write)   = 2  (2^1)
x (Execute) = 1  (2^0)
Total Range = 0 to 7 per user class
```

| Octal Value | Binary | Symbolic | File Semantic | Directory Semantic |
| :---: | :---: | :---: | :--- | :--- |
| **7** | `111` | `rwx` | Read, modify, and execute | List files, modify contents, and enter directory |
| **6** | `110` | `rw-` | Read and modify | List names; creating/deleting entries also requires directory execute/search permission |
| **5** | `101` | `r-x` | Read and execute | List directory and enter (`cd`) |
| **4** | `100` | `r--` | Read only | List filenames only (cannot inspect metadata) |
| **1** | `001` | `--x` | Execute only | Traverse/enter directory (`cd`) without listing |
| **0** | `000` | `---` | No permissions | Completely inaccessible |

---

## The 10-Character Permission Mask

When issuing `ls -l`, the first 10 characters dictate accessibility:

```text
- r w x r - x - - x
┬ └───┘ └───┘ └───┘
│   │     │     └── Others permission (Octal: 1)
│   │     └──────── Group permission (Octal: 5)
│   └────────────── Owner/User permission (Octal: 7)
└────────────────── File type descriptor: '-' (File), 'd' (Directory), 'l' (Symlink)
```

## Manipulating Access: `chmod` & `chown`

### 1. Symbolic Mode (`chmod`)
Modifies specific permission flags relative to current settings:
- **Scopes**: `u` (user), `g` (group), `o` (others), `a` (all).
- **Operators**: `+` (add), `-` (revoke), `=` (assign exact).
```bash
# Add execute permission (omitted scope is affected by umask)
chmod +x script.sh
# Explicitly select every user class
chmod a+x script.sh

# Revoke write permissions from group and others
chmod go-w sensitive.conf

# Set exact permissions: user can read/write, group and others have no permissions
chmod u=rw,go= private.key
```

### 2. Octal Mode (`chmod`)
Explicitly overwrites all 9 bits using a 3-digit octal representation:
```bash
# 751: Owner=rwx(7), Group=r-x(5), Others=--x(1)
chmod 751 mission.sh

# 644: Standard web file permissions (rw-r--r--)
chmod 644 index.html

# 600: Restricted SSH private key permissions (rw-------)
chmod 600 ~/.ssh/id_rsa
```

### 3. Ownership Changes: `chown` & `chgrp`
```bash
# Change both owner user and group simultaneously
chown recruit:intelofficer brief.txt

# Recursively change ownership of an entire directory tree
chown -R www-data:www-data /var/www/html/
```

---

## Related Notes & Graph Links
- Back to [TryHackMe - Linux Bootcamp](/guides/linux-bootcamp-walkthrough/)
- See [Linux Filesystem Hierarchy](/guides/linux-filesystem/) for context on root and system path access.
- See [Linux Process & Signal Management](/guides/linux-processes/) for process execution under elevated UID contexts.

## Try it locally

In a disposable directory owned by your regular user, compare a directory with read permission alone against read plus execute permission. A filename listing and access to a file inside it are different operations. Restore permissions before removing the test directory. Root and ACLs can change the result, so perform the exercise without sudo.

References: [chmod](https://man7.org/linux/man-pages/man1/chmod.1.html) and [pathname resolution](https://man7.org/linux/man-pages/man7/path_resolution.7.html).
