# Syncless CLI

A CLI wrapper for the official Syncless APIs.

## Installation

```sh
npm install -g syncless-cli
```

Requires Node.js 18 or newer.

## Quickstart

```sh
syncless --help

syncless auth login
syncless auth status

syncless projects list

# personal tasks
syncless tasks list personal
syncless tasks create "Draft a launch checklist"

# project tasks
syncless tasks list <project-id>
syncless tasks send <task-id> "Continue with the implementation plan"

syncless tasks history <task-id>

syncless users list
```

Read commands support JSON output:

```sh
syncless projects list --json
syncless tasks list personal --json
syncless users list --json
```
