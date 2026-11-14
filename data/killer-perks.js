/*
  KILLER PERKS
  ============
  To add a perk when a new chapter comes out, copy one of the lines below and edit it:

    p("Perk Name", "The Killer Name", "tag1 tag2", "Short description of what it does.");

  - Tags drive the "Ask for a build" suggestions. Put the most important tag first.
    Killer tags: regression genblock slowdown aura tracking chase antiloop haste hex
                 totems scourge hook carry basement endgame stealth terror antiheal
                 slug exposed obsession status hinder scream items antiblind lockers
                 basicattack
  - Icon: save a PNG as icons/killer/<perk-name>.png, using lower case with dashes for
    spaces and punctuation, e.g. "Hex: Ruin" -> icons/killer/hex-ruin.png.
    It is picked up automatically. (Or pass a different path as an optional 5th value.)
    With no image, the perk shows its initials instead.
  - You can also add perks from inside the app (All perks -> Add a perk). Those are
    saved in your browser only; perks in this file are there for everyone.
*/
(function () {
  const list = [];
  const p = (name, owner, tags, desc, icon) =>
    list.push({ name, owner, tags: tags.split(" ").filter(Boolean), desc, icon: icon || "" });

  // ---- General ----
  p("Bitter Murmur", "General", "aura tracking", "When a generator is completed you see the survivors near it, and when the last one is done you see everyone for a few seconds.");
  p("Deerstalker", "General", "slug aura", "Shows the auras of dying survivors within a wide range.");
  p("Distressing", "General", "terror", "Your terror radius is considerably larger.");
  p("Hex: No One Escapes Death", "General", "hex endgame exposed haste", "When the exit gates are powered a dull totem lights up: you move faster and every survivor is Exposed until it is cleansed.");
  p("Hex: Thrill of the Hunt", "General", "hex totems", "Survivors cleanse and bless more slowly for every totem standing, and you get a loud notification when someone starts on a hex totem.");
  p("Insidious", "General", "stealth", "Standing still for a few seconds makes you Undetectable until you move.");
  p("Iron Grasp", "General", "carry hook", "Survivors you carry throw you around less and take longer to wiggle free.");
  p("Scourge Hook: Monstrous Shrine", "General", "scourge hook basement", "Survivors on scourge hooks, including the basement hooks, lose hook progress faster while you are far away.");
  p("Shattered Hope", "General", "totems aura", "You destroy boon totems for good instead of just snuffing them, and see the survivors who were inside the boon's range.");
  p("Sloppy Butcher", "General", "antiheal basicattack", "Your basic attacks inflict Mangled and Haemorrhage, slowing healing and making progress drain away for a while.");
  p("Spies from the Shadows", "General", "tracking", "Crows startled by survivors near you give you a loud noise notification.");
  p("Unrelenting", "General", "basicattack chase", "You recover faster after missing a basic attack.");
  p("Whispers", "General", "tracking", "You hear the Entity whispering whenever a survivor is within a wide range of you.");
  p("Cull the Weak", "General", "obsession slowdown", "Each time you hook someone other than your obsession, everyone else repairs, heals and sabotages slower while the obsession lives. The obsession unhooks and heals others faster.");
  p("Keep Them Waiting", "General", "obsession basicattack chase", "Basic attack hits on survivors other than your obsession build tokens that shorten your attack cooldown. Hitting the obsession costs tokens.");
  p("See How They Run", "General", "obsession haste chase", "Losing your obsession in a chase earns tokens of movement speed, each of which is used up by an attack.");
  p("No Holds Barred", "General", "genblock slowdown", "Each time a generator is completed, the generator with the most progress is blocked for a while and highlighted for you.");
  p("Scourge Hook: Weeping Wounds", "General", "scourge antiheal slowdown hook", "Survivors rescued from a scourge hook suffer Haemorrhage, and once healed they heal and repair slower until they are hurt again.");
  p("Hex: Fortune's Fool", "General", "hex status stealth", "The first time you hook each survivor, a totem lights up and leaves them Oblivious until it is cleansed. Other survivors cannot touch that totem for a while.");

  // ---- Killers ----
  p("Unnerving Presence", "The Trapper", "terror slowdown", "Survivors inside your terror radius get more frequent skill checks with smaller success zones.");
  p("Brutal Strength", "The Trapper", "antiloop chase regression", "You break pallets and walls, and damage generators, noticeably faster.");
  p("Agitation", "The Trapper", "carry hook basement", "You move faster while carrying a survivor, with a larger terror radius.");
  p("Predator", "The Wraith", "tracking chase aura", "When a survivor gets away from you in a chase, their aura is revealed for a few seconds.");
  p("Bloodhound", "The Wraith", "tracking", "Pools of blood are much brighter and stay visible for longer.");
  p("Shadowborn", "The Wraith", "antiblind haste", "Being blinded gives you a burst of speed.");
  p("Enduring", "The Hillbilly", "antiloop chase", "Pallet stuns last much less time.");
  p("Lightborn", "The Hillbilly", "antiblind items", "You cannot be blinded, and you see the aura of anyone who tries.");
  p("Tinkerer", "The Hillbilly", "stealth tracking", "When a generator reaches most of its progress you get a loud notification and become Undetectable for a while. Once per generator.");
  p("Stridor", "The Nurse", "tracking chase", "Survivors' breathing and grunts of pain are louder to you.");
  p("Thanatophobia", "The Nurse", "slowdown antiheal", "Every injured, dying or hooked survivor slows down repairing, sabotaging and cleansing for the whole team.");
  p("A Nurse's Calling", "The Nurse", "aura antiheal", "Shows the auras of survivors who are healing or being healed within range.");
  p("Save the Best for Last", "The Shape", "obsession basicattack chase", "Hitting survivors other than your obsession builds tokens that shorten your attack cooldown. Hitting the obsession costs tokens.");
  p("Play with Your Food", "The Shape", "obsession haste chase", "Letting your obsession escape a chase earns tokens of movement speed, each of which is used up by an attack.");
  p("Dying Light", "The Shape", "obsession slowdown", "Each time you hook someone other than your obsession, everyone else repairs, heals and sabotages slower while the obsession lives.");
  p("Hex: The Third Seal", "The Hag", "hex status", "Survivors you hit lose the ability to see auras until the hex totem is cleansed.");
  p("Hex: Ruin", "The Hag", "hex regression", "Every generator not being worked on regresses automatically. The hex ends when a survivor dies or the totem is cleansed.");
  p("Hex: Devour Hope", "The Hag", "hex exposed haste", "Earn tokens when survivors are rescued while you are away: first speed after hooking, then everyone is Exposed, then you can kill by hand.");
  p("Overwhelming Presence", "The Doctor", "terror items", "Items used inside your terror radius run down much faster.");
  p("Monitor & Abuse", "The Doctor", "terror stealth", "Your terror radius is smaller outside chases and larger during them.");
  p("Overcharge", "The Doctor", "regression", "Damaging a generator sets up a very hard skill check for the next survivor who touches it, and its regression speeds up over time.");
  p("Beast of Prey", "The Huntress", "stealth chase", "You become Undetectable once Bloodlust kicks in during a chase.");
  p("Territorial Imperative", "The Huntress", "basement tracking aura", "You see the aura of any survivor who enters the basement while you are away from it. Has a cooldown.");
  p("Hex: Huntress Lullaby", "The Huntress", "hex slowdown", "Missed skill checks cost more progress, and each hook shortens the warning survivors get before a skill check.");
  p("Knock Out", "The Cannibal", "slug", "Survivors you down with a basic attack are hidden from distant teammates and briefly crawl slower and cannot see well.");
  p("Barbecue & Chilli", "The Cannibal", "aura hook tracking", "After hooking a survivor, you see the auras of everyone far away from that hook for a few seconds.");
  p("Franklin's Demise", "The Cannibal", "items basicattack", "Your basic attacks knock items out of survivors' hands, and dropped items lose charges until picked up.");
  p("Fire Up", "The Nightmare", "chase antiloop", "Each completed generator makes you a little faster at breaking, vaulting, picking up and dropping.");
  p("Remember Me", "The Nightmare", "obsession endgame", "Each hit on your obsession adds time to how long the exit gates take to open for everyone else.");
  p("Blood Warden", "The Nightmare", "endgame hook", "Once a gate is open, hooking a survivor blocks both exits for up to a minute, and you see anyone standing in the gate areas.");
  p("Scourge Hook: Hangman's Trick", "The Pig", "scourge hook aura", "You are warned when a hook is sabotaged, and while carrying a survivor you see anyone lurking near a scourge hook.");
  p("Surveillance", "The Pig", "tracking regression", "Regressing generators are highlighted and change colour when a survivor touches them, and repair noises carry further.");
  p("Make Your Choice", "The Pig", "exposed hook", "When a survivor is unhooked while you are far away, the rescuer screams and is Exposed for a minute.");
  p("Bamboozle", "The Clown", "antiloop chase", "You vault windows faster, and a window you vault is blocked for survivors for a while.");
  p("Coulrophobia", "The Clown", "antiheal terror", "Survivors inside your terror radius heal much more slowly, with faster healing skill checks.");
  p("Pop Goes the Weasel", "The Clown", "regression hook", "After hooking a survivor, the next generator you damage within the time limit instantly loses a large share of its current progress.");
  p("Spirit Fury", "The Spirit", "antiloop chase", "After you break a couple of pallets, the next pallet that stuns you shatters on the spot.");
  p("Hex: Haunted Ground", "The Spirit", "hex exposed", "Two trapped hex totems appear. Cleansing either one makes every survivor Exposed for a minute.");
  p("Rancor", "The Spirit", "obsession endgame exposed tracking", "Each completed generator shows you where every survivor is. Once the gates are powered your obsession is Exposed and can be killed by hand.");
  p("Discordance", "The Legion", "tracking aura", "Generators being repaired by two or more survivors within range are highlighted for you.");
  p("Mad Grit", "The Legion", "carry basicattack", "While carrying a survivor your missed attacks have no cooldown, and landing a hit pauses the carried survivor's wiggling.");
  p("Iron Maiden", "The Legion", "lockers exposed tracking", "You search lockers faster, and survivors who leave a locker scream and are Exposed for a while.");
  p("Corrupt Intervention", "The Plague", "genblock slowdown", "At the start of the trial the three generators furthest from you are blocked for two minutes, or until the first survivor goes down.");
  p("Infectious Fright", "The Plague", "slug scream tracking", "Downing a survivor makes every other survivor inside your terror radius scream and reveal where they are.");
  p("Dark Devotion", "The Plague", "obsession stealth terror", "Hitting your obsession moves your terror radius onto them and leaves you Undetectable for a while.");
  p("I'm All Ears", "The Ghost Face", "aura chase antiloop", "A survivor who performs a rushed action near you has their aura revealed for a few seconds. Has a cooldown.");
  p("Thrilling Tremors", "The Ghost Face", "genblock tracking", "After you pick up a survivor, every generator not being repaired is blocked and highlighted for a while.");
  p("Furtive Chase", "The Ghost Face", "obsession stealth haste", "Hooking your obsession makes you Undetectable with a speed boost, and whoever rescues them becomes the new obsession.");
  p("Surge", "The Demogorgon", "regression", "Downing a survivor with a basic attack makes nearby generators explode and start regressing.");
  p("Cruel Limits", "The Demogorgon", "antiloop chase", "Each time a generator is completed, every window and vault is blocked for survivors for a while.");
  p("Mindbreaker", "The Demogorgon", "status slowdown", "Survivors repairing generators are Blind and Exhausted, lingering for a few seconds after they stop.");
  p("Zanshin Tactics", "The Oni", "antiloop aura chase", "You see the auras of nearby pallets, breakable walls and windows.");
  p("Blood Echo", "The Oni", "status hook antiheal", "Hooking a survivor inflicts Haemorrhage and Exhausted on every injured survivor.");
  p("Nemesis", "The Oni", "obsession aura status", "Anyone who stuns or blinds you becomes your obsession, turns Oblivious and has their aura shown to you briefly.");
  p("Gearhead", "The Deathslinger", "tracking aura", "After a survivor loses a health state, survivors who hit good repair skill checks have their auras revealed for a while.");
  p("Dead Man's Switch", "The Deathslinger", "genblock hook", "After hooking a survivor, any generator a survivor lets go of becomes blocked until the timer runs out.");
  p("Hex: Retribution", "The Deathslinger", "hex aura status totems", "Cleansing a dull totem leaves the survivor Oblivious, and when any hex totem is cleansed you see every survivor's aura.");
  p("Forced Penance", "The Executioner", "antiheal status", "Survivors who take a protection hit are Broken for a long while.");
  p("Trail of Torment", "The Executioner", "stealth regression", "Damaging a generator makes you Undetectable until it stops regressing or you injure someone. Survivors can see which generator it is.");
  p("Deathbound", "The Executioner", "status antiheal scream", "When a survivor heals another far away from you, the healer screams and becomes Oblivious whenever they stray from that teammate.");
  p("Dragon's Grip", "The Blight", "exposed regression scream", "After you damage a generator, the first survivor to touch it screams, reveals their position and is Exposed for a minute.");
  p("Hex: Blood Favour", "The Blight", "hex antiloop chase", "When you hit a survivor, pallets near them cannot be pulled down for several seconds.");
  p("Hex: Undying", "The Blight", "hex totems aura", "Survivors near dull totems have their auras revealed, and if another hex is cleansed it moves to this totem instead.");
  p("Hoarder", "The Twins", "items tracking", "You are alerted whenever a survivor opens a chest or picks up an item nearby, and the map gets extra chests.");
  p("Oppression", "The Twins", "regression", "Damaging a generator also starts several other random generators regressing, with a hard skill check for anyone working on them.");
  p("Coup de Grâce", "The Twins", "basicattack chase", "Each completed generator gives you a token, which is spent to make your next lunge reach much further.");
  p("Starstruck", "The Trickster", "exposed carry", "While you carry a survivor, any survivor inside your terror radius is Exposed, lingering for a while after.");
  p("Hex: Crowd Control", "The Trickster", "hex antiloop chase", "A window is blocked for a while after a survivor rush-vaults through it.");
  p("No Way Out", "The Trickster", "endgame genblock", "Earn a token for each different survivor you hook. When someone first touches an exit switch, both gates are blocked for a time per token.");
  p("Lethal Pursuer", "The Nemesis", "aura tracking", "You see every survivor's aura at the start of the trial, and all your aura reveals last a little longer.");
  p("Hysteria", "The Nemesis", "status stealth", "Injuring a healthy survivor makes every injured survivor Oblivious for a while.");
  p("Eruption", "The Nemesis", "regression aura scream", "Generators you have damaged explode when you down a survivor: they lose progress and anyone repairing them screams and is revealed.");
  p("Deadlock", "The Cenobite", "genblock slowdown", "Whenever a generator is completed, the other generator with the most progress is blocked for a while.");
  p("Hex: Plaything", "The Cenobite", "hex stealth status", "The first time you hook each survivor they are cursed and Oblivious until they cleanse their own hex totem.");
  p("Scourge Hook: Gift of Pain", "The Cenobite", "scourge antiheal slowdown hook", "Survivors rescued from a scourge hook are Mangled and bleeding, and once healed they repair and heal slower until hurt again.");
  p("Grim Embrace", "The Artist", "genblock hook aura", "The first time you hook each survivor all generators are blocked briefly. After the fourth they block for longer and you see the obsession.");
  p("Scourge Hook: Pain Resonance", "The Artist", "scourge regression hook", "Hooking a different survivor on a scourge hook spends a token to blow up the generator with the most progress, costing it a large chunk.");
  p("Hex: Pentimento", "The Artist", "hex totems slowdown", "You can relight cleansed totems. Each relit totem slows survivors' repairing, healing, recovering and gate opening in turn.");
  p("Scourge Hook: Floods of Rage", "The Onryō", "scourge aura hook", "When a survivor is rescued from a scourge hook, every other survivor's aura is revealed for a few seconds.");
  p("Call of Brine", "The Onryō", "regression tracking", "A generator you damage regresses faster for a minute, and you are notified each time a survivor hits a good skill check on it.");
  p("Merciless Storm", "The Onryō", "slowdown genblock", "A generator nearing completion throws a stream of skill checks at survivors. Missing one or letting go blocks the generator for a while.");
  p("Dissolution", "The Dredge", "antiloop chase", "Shortly after you injure a survivor, a pallet they fast-vault inside your terror radius breaks as they clear it.");
  p("Darkness Revealed", "The Dredge", "aura lockers tracking", "Searching a locker reveals the auras of all survivors standing near any locker.");
  p("Septic Touch", "The Dredge", "antiheal status terror", "Survivors who heal inside your terror radius suffer Blindness and Exhausted, lingering after they stop.");
  p("Superior Anatomy", "The Mastermind", "antiloop chase", "When a survivor rush-vaults near you, your next window vault is much faster. Has a cooldown.");
  p("Awakened Awareness", "The Mastermind", "aura carry", "While carrying a survivor you see the auras of other survivors within range.");
  p("Terminus", "The Mastermind", "endgame antiheal", "When the gates are powered, injured, dying and hooked survivors are Broken until shortly after a gate is opened.");
  p("Nowhere to Hide", "The Knight", "aura regression tracking", "Damaging a generator reveals the auras of all survivors near you for a few seconds.");
  p("Hex: Face the Darkness", "The Knight", "hex scream tracking", "Injuring a survivor lights a totem and curses them: every other survivor outside your terror radius screams at intervals, revealing themselves.");
  p("Hubris", "The Knight", "exposed antiloop", "A survivor who stuns you is Exposed for a while. Has a cooldown.");
  p("Game Afoot", "The Skull Merchant", "obsession haste antiloop", "Hitting the survivor you have chased the longest makes them your obsession, and breaking things while chasing the obsession speeds you up.");
  p("THWACK!", "The Skull Merchant", "scream tracking antiloop", "After hooking a survivor, the next pallet or wall you break makes nearby survivors scream and reveal their auras.");
  p("Leverage", "The Skull Merchant", "antiheal hook", "Each hook earns a token, and each token slows survivors' healing for a while after a hook.");
  p("Genetic Limits", "The Singularity", "status antiheal", "Survivors become Exhausted for a while whenever they finish a heal.");
  p("Forced Hesitation", "The Singularity", "slug hinder", "When a survivor goes down, every other survivor close to them is slowed for several seconds.");
  p("Machine Learning", "The Singularity", "stealth haste regression", "After you damage a generator, completing it leaves you Undetectable with a speed boost for a while.");
  p("Ultimate Weapon", "The Xenomorph", "lockers scream status tracking", "After you search a locker, survivors who enter your terror radius scream, reveal their position and suffer Blindness. Has a cooldown.");
  p("Rapid Brutality", "The Xenomorph", "haste basicattack chase", "You can no longer gain Bloodlust, but every basic attack that lands gives you a speed boost.");
  p("Alien Instinct", "The Xenomorph", "aura hook status", "Hooking a survivor reveals the furthest injured survivor's aura and leaves them Oblivious.");
  p("Hex: Two Can Play", "The Good Guy", "hex antiblind", "A survivor who stuns or blinds you a few times lights a totem, after which survivors who stun or blind you are blinded themselves.");
  p("Friends 'til the End", "The Good Guy", "obsession exposed aura hook", "Hooking someone other than the obsession reveals and Exposes the obsession. Hooking the obsession makes a random survivor scream and take their place.");
  p("Batteries Included", "The Good Guy", "haste chase", "You move faster while near a completed generator, lingering briefly after you leave.");
  p("Unbound", "The Unknown", "haste antiloop chase", "After a survivor is injured, vaulting a window gives you a speed boost for a while.");
  p("Unforeseen", "The Unknown", "stealth terror regression", "Damaging a generator moves your terror radius onto that generator and makes you Undetectable for a while.");
  p("Undone", "The Unknown", "regression genblock", "Survivors' missed skill checks earn you tokens, which are spent when you damage a generator to strip extra progress and block it.");
  p("Weave Attunement", "The Lich", "items aura status", "Dropped and depleted items reveal survivors near them, and picking one up leaves the survivor Oblivious for a while.");
  p("Languid Touch", "The Lich", "status tracking", "A survivor who startles a crow near you becomes Exhausted for a few seconds.");
  p("Dark Arrogance", "The Lich", "antiloop chase", "You vault faster, but stuns and blinds affect you for longer.");
  p("Hex: Wretched Fate", "The Dark Lord", "hex obsession slowdown", "After the first generator is completed a totem lights up, and your obsession repairs much slower while it stands.");
  p("Human Greed", "The Dark Lord", "items aura tracking", "You see unopened chests and any survivor lingering near them, and you can kick open chests shut again.");
  p("Dominance", "The Dark Lord", "totems items", "The first time each totem and chest is touched by a survivor, it is blocked for a while and highlighted for you.");
  p("All-Shaking Thunder", "The Houndmaster", "basicattack chase", "After dropping from a height, your lunge attacks reach further for a while. Has a cooldown.");
  p("Scourge Hook: Jagged Compass", "The Houndmaster", "scourge hook aura", "Hooks that survivors are rescued from become scourge hooks, and hooking on a scourge hook reveals the generator with the most progress.");
  p("No Quarter", "The Houndmaster", "antiheal status", "A survivor about to finish healing themselves faces a run of tricky skill checks, and failing one leaves them Broken for a while.");
  p("Hex: Nothing But Misery", "The Ghoul", "hex hinder basicattack chase", "After several basic attack hits a totem lights up, and from then on each basic attack hit slows the survivor for a few seconds.");
  p("Forever Entwined", "The Ghoul", "carry basicattack hook", "Hitting survivors builds tokens that make you faster at picking up, dropping and hooking.");
  p("None Are Free", "The Ghoul", "endgame antiloop hook", "Earn a token the first time you hook each survivor. When the last generator is done, windows and standing pallets are blocked for a time per token.");
  p("Help Wanted", "The Animatronic", "regression basicattack", "Generators you damage become compromised, up to three at once. When one is completed, for a while your basic attacks recover faster and every unattended generator regresses on its own.");
  p("Phantom Fear", "The Animatronic", "scream tracking aura", "A survivor who looks at you while inside your terror radius screams and has their aura revealed. Has a cooldown.");
  p("Haywire", "The Animatronic", "endgame", "When a survivor lets go of an exit gate switch that is nearly open, the gate's progress starts draining away.");
  p("Wandering Eye", "The Krasue", "aura chase tracking", "Starting a chase reveals the auras of all other injured survivors near you for a few seconds. Has a cooldown.");
  p("Ravenous", "The Krasue", "carry hook exposed scream", "Each survivor's first hook earns a token that makes you carry and hook faster. At four tokens every survivor screams and is Exposed for a long while.");
  p("Hex: Overture of Doom", "The Krasue", "hex stealth terror", "Curses the generator furthest from the totem. When a survivor repairs it for a few seconds, your terror radius moves to that generator and you become Undetectable for a while.");
  p("Hex: Hive Mind", "The First", "hex regression aura", "Your first hook lights a totem that shows you every generator's progress. Once four generators are done, the rest explode, lose progress and regress, and the hex ends.");
  p("Secret Project", "The First", "genblock stealth totems", "Whenever a totem is blessed or cleansed, a random generator is blocked for a while. Whenever any generator becomes blocked, you turn Undetectable.");
  p("Turn Back the Clock", "The First", "regression hook", "For a while after hooking a survivor, you can make a nearby generator explode from a distance, costing it progress and starting it regressing.");
  p("Hex: Scared to Death", "The Slasher", "hex scream hinder antiloop", "Lights a totem once you have hooked three different survivors. Breaking a pallet during a chase then makes nearby survivors scream and slows them briefly.");
  p("Rampage", "The Slasher", "antiblind haste antiloop", "Breaking pallets and walls earns tokens. When you are blinded or pallet-stunned you gain speed for each token for a while. Has a cooldown.");
  p("Silent Shadow", "The Slasher", "stealth hook endgame", "You are Undetectable for several seconds after each hook, and for the rest of the trial once the exit gates are powered.");
  p("Celestial Witness", "The Judgment", "obsession aura tracking", "Every half minute, if your obsession is far away you see their aura briefly. If not, the survivor furthest from you becomes the obsession.");
  p("Hex: Under Your Thumb", "The Judgment", "hex chase tracking", "Lights a totem when a survivor gains a hook state. It caps how much speed boost running survivors can have, and reveals nearby survivors whenever they gain one.");
  p("Lay Waste", "The Judgment", "regression", "A generator you damage regresses faster the more progress it has. Has a cooldown.");

  // ---- Newer chapters: add them here as they come out ----

  window.DBD_PERKS = Object.assign(window.DBD_PERKS || {}, { killer: list });
})();
