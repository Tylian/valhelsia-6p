# Valhelsia 6+

This modpack is managed with **packwiz**.
If you want to poke at it, tweak mods, or help maintain things, this repo is the source of truth.

packwiz can be installed here:
[https://packwiz.infra.link/installation/](https://packwiz.infra.link/installation/)

## Client and server usage

This modpack is used by both the client and the server as a single source of truth. Because of that, it’s important that any mods you add are correctly flagged for the side they run on.

When adding or updating mods, make sure the `side` field in the corresponding `.pw.toml` file is set correctly (`client`, `server`, or `both`). Incorrect side configuration can cause crashes or mismatches when the pack is used server-side.

## Deployment notes

This pack is manually published by me. Changes merged here are not automatically deployed.

If you need an update published, ping me on Discord.


## Common workflows

### Adding a mod from Modrinth or CurseForge

Use whichever provider the mod is hosted on. CurseForge is preferred, but sometimes they do not allow API downloads of mods, use Modrinth in that case.

#### CurseForge:

```sh
packwiz curseforge add <project-id-or-url>
```

#### Modrinth:

```sh
packwiz modrinth add <slug-or-url>
```

This will create a file in `mods/` and update the index.

### Adding a raw file

You can drop loose files directly into the repo, like jars in `mods/`, configs in `config/`, or other pack files. packwiz will pick these up, but only after the index is refreshed.

### Refreshing the index

`packwiz refresh` tells packwiz to scan the repo and update `index.toml` to match what’s actually on disk.

Run this when:

* you manually edit a `.pw.toml`
* you drop loose files into the repo
* you add, remove, or rename files by hand
* something feels out of sync

```sh
packwiz refresh
```

If you only used packwiz commands, this usually happens automatically. If you touched files yourself, this step is required or the pack will export incorrectly.