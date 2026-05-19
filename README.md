# Syncless CLI

A CLI wrapper for the official Syncless APIs.

## Installation

```sh
npm install -g syncless-cli
```

Requires Node.js 20.12 or newer.

The package registers `syncl` as the primary command and `syncless-cli` as a
verbose alias.

## Quickstart

```sh
syncl --help

syncl auth login
syncl auth status

syncl projects list
syncl projects create --template <template-id> --name "Launch checklist"

# personal tasks
syncl tasks list
syncl tasks list personal
syncl tasks create "Draft a launch checklist"

# project tasks
syncl tasks list <project-id>
syncl tasks send <task-id> "Continue with the implementation plan"

syncl tasks history <task-id>

syncl users list
```

Read commands support JSON output:

```sh
syncl projects list --json
syncl tasks list personal --json
syncl users list --json
```

Interactive terminal sessions prompt for missing human-oriented input, such as
the API key for `auth login`, the project for `tasks list`, and template node
owners for `projects create`.

When creating a project from a template in an interactive terminal, Syncless CLI
prompts you to assign an owner for each template node. In non-interactive
environments, pass `--nodes` explicitly:

```sh
syncl projects create --template <template-id> --name "Launch checklist" \
  --nodes '{"<node-id>":"<owner-id>"}'
```
