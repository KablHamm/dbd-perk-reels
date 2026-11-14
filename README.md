# DBD Perks

A fan-made build roller for Dead by Daylight. Spin four random perks for survivor or killer,
ask for a type of build (stealth, gen rush, hex and so on), and browse every perk with its
description.

- **Use it online:** the site is published from this repository with GitHub Pages.
- **Stay up to date:** a daily job (`.github/workflows/update-perks.yml`) reads the
  [Dead by Daylight Wiki](https://deadbydaylight.wiki.gg/wiki/Perks), refreshes descriptions
  and icons, and adds new perks.
- **Run it on your own PC:** double-click `Start Perk Randomiser.bat` (needs Python).

Perk data lives in `data/survivor-perks.js` and `data/killer-perks.js`. Each perk's build tags
drive the suggestions and can be edited there.

Not affiliated with Behaviour Interactive. Perk names, descriptions and icons belong to
Behaviour Interactive and are taken from the Dead by Daylight Wiki.
