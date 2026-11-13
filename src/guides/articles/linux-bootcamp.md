## From the room to a working reference

My Linux Bootcamp notes began as a task-by-task record of the TryHackMe room. They grew into linked references because the same ideas kept coming back: finding the right file, understanding a permission boundary, directing output and explaining what a running service is doing.

This collection keeps the original walkthrough and the six companion topics together. The public copies retain their structure and explanations, with targeted technical corrections, web links and redacted lab details. The source vault and its screenshots remain private.

## Follow the walkthrough

[Linux Bootcamp: complete room walkthrough](/guides/linux-bootcamp-walkthrough/) follows the twenty tasks, from connecting to the lab through logs and automation. It is the long-form record, useful when you want to follow the original sequence. Passwords and flag values are omitted.

The [official TryHackMe room](https://tryhackme.com/room/linuxbootcamp) remains the source for current access instructions and task objectives.

## Study one concept at a time

| Chapter | The question it helps answer |
| --- | --- |
| [Filesystem hierarchy](/guides/linux-filesystem/) | Where does this kind of data belong, and is it a real file or a kernel interface? |
| [Permissions and access control](/guides/linux-permissions/) | Which user can perform which operation, and why does directory access differ? |
| [Redirection and pipelines](/guides/linux-pipelines/) | Where do normal output and errors go, and what does a pipeline's status mean? |
| [Processes and signals](/guides/linux-processes/) | What is running, under whose identity, and what happens when it receives a signal? |
| [Networking and file transfers](/guides/linux-networking/) | Which interface, route or listener is involved, and how will a file move? |
| [Log auditing and cron](/guides/linux-logs-cron/) | What can the logs establish, and how does a scheduled command run? |

## Put the topics together

A useful investigation often crosses several chapters. A service may be listening but blocked by a firewall. Its process may run under a different account than expected. Its logs may be in the journal rather than the file a walkthrough names. A scheduled script may work interactively but fail because cron has a different environment.

Use the notes as a starting point and inspect the actual system. The goal is to explain the behavior, not merely recognize a command from a list.

For another place to practice, continue with my [Bandit learning path](/guides/bandit/). For a lab where permission boundaries become the central issue, read [Sunset](/guides/sunset/).
