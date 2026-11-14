(() => {
  "use strict";

  const DATA = Object.assign({ survivor: [], killer: [] }, window.DBD_PERKS);
  const SIDE_KEY = "dbd-perk-randomiser.side";
  const $ = (sel, root = document) => root.querySelector(sel);
  const other = (side) => (side === "survivor" ? "killer" : "survivor");

  /* ------------------------------------------------------------------
     Tags: the labels shown on perks, per side.
     ------------------------------------------------------------------ */
  const TAGS = {
    survivor: {
      stealth: "Stealth", gens: "Gen speed", healing: "Healing", selfheal: "Self-heal", chase: "Chase",
      exhaustion: "Exhaustion", haste: "Speed", aura: "Aura reading", altruism: "Altruism",
      antitunnel: "Anti-tunnel", antislug: "Anti-slug", endurance: "Endurance", endgame: "Endgame",
      boon: "Boon", totems: "Totems", items: "Items & chests", sabotage: "Sabotage", wiggle: "Wiggle",
      stun: "Stuns", blind: "Blinds", selfunhook: "Self-unhook", lockers: "Lockers", basement: "Basement",
      team: "Teamwork", solo: "Solo queue", obsession: "Obsession",
    },
    killer: {
      regression: "Gen regression", genblock: "Gen blocking", slowdown: "Slowdown", aura: "Aura reading",
      tracking: "Tracking", chase: "Chase", antiloop: "Anti-loop", haste: "Speed", hex: "Hex", totems: "Totems",
      scourge: "Scourge hook", hook: "Hooks", carry: "Carrying", basement: "Basement", endgame: "Endgame",
      stealth: "Stealth", terror: "Terror radius", antiheal: "Anti-heal", slug: "Slugging", exposed: "Exposed",
      obsession: "Obsession", status: "Status effects", hinder: "Hindered", scream: "Screams",
      items: "Items", antiblind: "Anti-blind", lockers: "Lockers", basicattack: "Basic attacks",
    },
  };

  /* ------------------------------------------------------------------
     Build types for "Ask for a build".
     words: phrases to look for in what the player typed.
     tags:  how much each perk tag counts towards that build.
     chip:  show as a quick-pick button.
     To teach it a new build type, add an entry here.
     ------------------------------------------------------------------ */
  const BUILDS = {
    survivor: [
      { label: "Stealth", chip: true, words: ["stealth", "sneak", "hide", "hidden", "hiding", "quiet", "silent", "immersed", "ninja"], tags: { stealth: 3, lockers: 0.5 } },
      { label: "Gen rush", chip: true, words: ["gen rush", "genrush", "gen speed", "generator", "gens", "gen ", "repair", "gen jockey", "efficien"], tags: { gens: 3 } },
      { label: "Healing", chip: true, words: ["heal", "medic", "nurse", "support", "med-kit", "medkit"], tags: { healing: 3, selfheal: 1.5 } },
      { label: "Chase", chip: true, words: ["chase", "loop", "juke", "exhaustion", "speed", "fast", "run the killer", "distract"], tags: { chase: 3, exhaustion: 1.5, haste: 1.5 } },
      { label: "Altruism", chip: true, words: ["altruis", "save", "rescue", "unhook", "hero", "protect", "bodyblock", "body block"], tags: { altruism: 3, endurance: 1 } },
      { label: "Anti-tunnel", chip: true, words: ["tunnel", "camp"], tags: { antitunnel: 3, endurance: 1 } },
      { label: "Anti-slug", chip: true, words: ["slug", "pick myself up", "bleed out", "get back up"], tags: { antislug: 3 } },
      { label: "Endgame", chip: true, words: ["endgame", "end game", "escape", "exit", "gate", "hatch", "clutch"], tags: { endgame: 3 } },
      { label: "Boons & totems", chip: true, words: ["boon", "totem", "hex", "cleanse", "bless"], tags: { boon: 3, totems: 2.5 } },
      { label: "Aura reading", chip: true, words: ["aura", "info", "wallhack", "see the killer", "awareness", "track", "beginner", "new player", "noob", "learning"], tags: { aura: 3 } },
      { label: "Sabotage", chip: true, words: ["sabo", "wiggle", "hook denial", "deny hook", "annoy", "toxic", "troll"], tags: { sabotage: 3, wiggle: 3, stun: 1, blind: 1 } },
      { label: "Flashlight & stuns", chip: true, words: ["flashlight", "blind", "flashbang", "pallet save", "stun", "bully", "head on"], tags: { blind: 3, stun: 3 } },
      { label: "Solo queue", chip: true, words: ["solo", "self suff", "self-suff", "selfish", "alone", "by myself", "self heal", "self-heal", "self care", "self-care"], tags: { solo: 3, selfheal: 2.5, antislug: 1.5, selfunhook: 1.5 } },
      { label: "Looter", chip: true, words: ["item", "chest", "loot", "plunder", "toolbox", "treasure"], tags: { items: 3 } },
      { label: "Teamwork", words: ["team", "swf", "squad", "friend", "together", "duo"], tags: { team: 3, altruism: 0.5 } },
      { label: "Second chance", words: ["second chance", "endurance", "tank", "hard to kill", "unkillable", "survive"], tags: { endurance: 3, antitunnel: 2, antislug: 2, selfunhook: 1.5 } },
      { label: "Basement", words: ["basement", "invocation"], tags: { basement: 3 } },
      { label: "Lockers", words: ["locker"], tags: { lockers: 3 } },
      { label: "Obsession", words: ["obsession"], tags: { obsession: 3 } },
    ],
    killer: [
      { label: "Gen regression", chip: true, words: ["regress", "slowdown", "slow down", "gen defen", "kick", "gen control", "stall", "3 gen", "three gen", "anti gen", "gens", "gen ", "generator"], tags: { regression: 3, genblock: 2.5, slowdown: 2.5 } },
      { label: "Hex", chip: true, words: ["hex", "totem", "curse"], tags: { hex: 3, totems: 2 } },
      { label: "Aura reading", chip: true, words: ["aura", "info", "track", "find", "wallhack", "see survivors", "beginner", "new player", "noob", "learning"], tags: { aura: 3, tracking: 2.5 } },
      { label: "Chase", chip: true, words: ["chase", "loop", "pallet", "vault", "window", "speed", "fast", "haste"], tags: { chase: 3, antiloop: 3, haste: 2 } },
      { label: "Endgame", chip: true, words: ["endgame", "end game", "noed", "exit", "gate", "late game"], tags: { endgame: 3 } },
      { label: "Stealth", chip: true, words: ["stealth", "sneak", "undetectable", "jumpscare", "jump scare", "surprise", "quiet", "silent"], tags: { stealth: 3 } },
      { label: "Anti-heal", chip: true, words: ["heal", "hit and run", "hit & run", "mangled", "sloppy", "keep them injured"], tags: { antiheal: 3 } },
      { label: "Slugging", chip: true, words: ["slug", "snowball", "bleed out"], tags: { slug: 3, exposed: 1 } },
      { label: "Scourge hooks", chip: true, words: ["scourge", "hook"], tags: { scourge: 3, hook: 2 } },
      { label: "Instant downs", chip: true, words: ["exposed", "instadown", "insta down", "insta-down", "instant down", "one shot", "one-shot", "one hit"], tags: { exposed: 3 } },
      { label: "Obsession", chip: true, words: ["obsession"], tags: { obsession: 3 } },
      { label: "Terror radius", chip: true, words: ["terror", "heartbeat", "skill check"], tags: { terror: 3, slowdown: 1 } },
      { label: "Basement", chip: true, words: ["basement", "carry", "agitation"], tags: { basement: 3, carry: 2.5, hook: 1 } },
      { label: "Status effects", words: ["blind", "oblivious", "exhaust", "debuff", "status", "hinder"], tags: { status: 3, hinder: 2 } },
      { label: "Screams", words: ["scream"], tags: { scream: 3 } },
      { label: "Anti-item", words: ["item", "flashlight", "franklin", "chest", "toolbox"], tags: { items: 3, antiblind: 3 } },
      { label: "Lockers", words: ["locker"], tags: { lockers: 3 } },
      { label: "Basic attacks", words: ["m1", "basic attack", "lunge"], tags: { basicattack: 3 } },
    ],
  };

  // Phrases that only make sense for one side, used to switch sides automatically.
  const SIDE_HINTS = {
    survivor: ["gen rush", "genrush", "survivor", "anti-tunnel", "anti tunnel", "anti-slug", "anti slug", "flashlight save", "pallet save", "boon", "self heal", "self-heal"],
    killer: ["killer", "hex", "regress", "slowdown", "gen kick", "scourge", "anti-loop", "anti loop", "anti-heal", "anti heal", "noed", "instadown", "slugging"],
  };

  const PREFIXES = [["Hex: ", "hex"], ["Boon: ", "boon"], ["Scourge Hook: ", "scourge"], ["Invocation: ", "invocation"], ["Teamwork: ", "teamwork"]];
  const SMALL_WORDS = /^(of|the|a|an|and|for|to|in|is|with|from|your)$/i;

  /* ------------------------------------------------------------------
     State
     ------------------------------------------------------------------ */
  const state = {
    side: "survivor",
    build: { survivor: [], killer: [] },
    note: { survivor: "", killer: "" },
    spinning: false,
    filterTag: "",
    shownPerk: null,
  };

  const reels = [...document.querySelectorAll(".reel")];
  const spinBtn = $("#spinBtn");
  const browseBtn = $("#browseBtn");
  const askInput = $("#askInput");
  const perkDialog = $("#perkDialog");
  const browseDialog = $("#browseDialog");

  function perksFor(side) {
    return DATA[side];
  }

  /* ------------------------------------------------------------------
     Characters I own
     Characters you untick are remembered on this device, and their perks are left out of
     spins and suggested builds. General perks are always in. Only the unticked ones are
     stored, so characters from new chapters start out ticked.
     ------------------------------------------------------------------ */
  const OWNED_KEY = "dbd-perk-randomiser.not-owned";
  const notOwned = { survivor: new Set(), killer: new Set() };
  try {
    const saved = JSON.parse(localStorage.getItem(OWNED_KEY)) || {};
    for (const side of ["survivor", "killer"]) (saved[side] || []).forEach((name) => notOwned[side].add(name));
  } catch { /* nothing saved, or storage unavailable */ }
  function saveOwned() {
    const plain = { survivor: [...notOwned.survivor], killer: [...notOwned.killer] };
    try { localStorage.setItem(OWNED_KEY, JSON.stringify(plain)); } catch { /* storage unavailable */ }
  }
  const sideOf = (perk) => (DATA.killer.includes(perk) ? "killer" : "survivor");
  const inPool = (perk) => !notOwned[sideOf(perk)].has(perk.owner);
  // The perks spins and suggestions may pick from.
  function poolFor(side) {
    return perksFor(side).filter((perk) => !notOwned[side].has(perk.owner));
  }
  function renderOwners() {
    const side = state.side;
    const owners = [...new Set(perksFor(side).map((p) => p.owner))].filter((o) => o !== "General").sort((a, b) => a.localeCompare(b));
    $("#ownersTitle").textContent = side === "killer" ? "Killers I own" : "Survivors I own";
    const boxes = owners.map((owner) => {
      const wrap = el("label", "chip");
      const box = el("input");
      box.type = "checkbox";
      box.checked = !notOwned[side].has(owner);
      box.addEventListener("change", () => {
        if (box.checked) notOwned[side].delete(owner); else notOwned[side].add(owner);
        saveOwned();
        renderOwnersCount();
      });
      wrap.append(box, owner);
      return wrap;
    });
    $("#ownersList").replaceChildren(...boxes);
    renderOwnersCount();
  }
  function renderOwnersCount() {
    const side = state.side;
    $("#ownersCount").textContent = `${poolFor(side).length} of ${perksFor(side).length} perks are in your pool.`;
  }
  function setAllOwners(owned) {
    const side = state.side;
    notOwned[side].clear();
    if (!owned) perksFor(side).forEach((p) => { if (p.owner !== "General") notOwned[side].add(p.owner); });
    saveOwned();
    renderOwners();
  }

  /* ------------------------------------------------------------------
     Small DOM helpers
     ------------------------------------------------------------------ */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function perkKind(perk) {
    const hit = PREFIXES.find(([prefix]) => perk.name.startsWith(prefix));
    return hit ? hit[1] : "";
  }
  function initials(name) {
    let base = name;
    for (const [prefix] of PREFIXES) if (base.startsWith(prefix)) base = base.slice(prefix.length);
    const words = base.replace(/[^\p{L}\p{N}\s-]/gu, "").split(/[\s-]+/).filter((w) => w && !SMALL_WORDS.test(w));
    return words.slice(0, 3).map((w) => w[0].toUpperCase()).join("") || name.trim()[0] || "?";
  }
  // Icons live in icons/<side>/<perk-name-as-a-slug>.png, e.g. icons/survivor/sprint-burst.png.
  // A perk can point somewhere else with its own icon path; perks with no image show initials.
  function slug(name) {
    return name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function iconPath(perk) {
    if (perk.icon) return perk.icon;
    return `icons/${DATA.killer.includes(perk) ? "killer" : "survivor"}/${slug(perk.name)}.png`;
  }
  // Full description from data/descriptions.js (generated from the wiki), falling back to the
  // short summary written in the perk files.
  const FULL = Object.assign({ survivor: {}, killer: {} }, window.DBD_DESCRIPTIONS);
  function describe(perk) {
    return FULL[DATA.killer.includes(perk) ? "killer" : "survivor"][slug(perk.name)] || perk.desc;
  }
  function fillGem(gem, perk) {
    gem.className = "gem " + perkKind(perk);
    gem.replaceChildren();
    const src = iconPath(perk);
    if (src) {
      const img = el("img");
      img.alt = "";
      img.src = src;
      img.onerror = () => gem.replaceChildren(el("span", "", initials(perk.name)));
      gem.append(img);
    } else {
      gem.append(el("span", "", initials(perk.name)));
    }
    return gem;
  }
  function makeTile(perk) {
    const tile = el("span", "tile");
    if (!perk) {
      tile.classList.add("empty");
      tile.append(el("span", "tname", "?"));
      return tile;
    }
    tile.append(fillGem(el("span"), perk), el("span", "tname", perk.name), el("span", "towner", perk.owner));
    return tile;
  }
  function shuffled(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /* ------------------------------------------------------------------
     Reels
     ------------------------------------------------------------------ */
  function setReel(reel, perk) {
    $(".strip", reel).replaceChildren(makeTile(perk));
    reel.setAttribute("aria-label", perk ? `${perk.name}. Show description` : "Empty perk slot");
  }
  function renderReels() {
    reels.forEach((reel, i) => {
      reel.classList.remove("landed");
      setReel(reel, state.build[state.side][i]);
    });
    $("#buildNote").textContent = state.note[state.side];
  }
  function setBusy(busy) {
    state.spinning = busy;
    spinBtn.disabled = busy;
    $("#askBtn").disabled = busy;
    reels.forEach((reel) => (reel.disabled = busy));
    document.querySelectorAll(".side-toggle button").forEach((b) => (b.disabled = busy));
  }

  // Spin all four reels and land them on `target` (an array of four perks).
  function spinTo(target, note) {
    if (state.spinning || target.length < reels.length) return;
    const side = state.side;
    const pool = poolFor(side);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previous = state.build[side];
    state.build[side] = target;
    state.note[side] = note || "";
    $("#buildNote").textContent = "";
    setBusy(true);

    const landings = reels.map((reel, i) => new Promise((resolve) => {
      const strip = $(".strip", reel);
      const land = () => {
        setReel(reel, target[i]);
        reel.classList.remove("spinning");
        reel.classList.add("landed");
        resolve();
      };
      if (still) return land();

      // Strip runs top to bottom: [target, ...random filler, what was showing].
      // It starts scrolled to the bottom and rolls downwards until the target is in view.
      const filler = Array.from({ length: 16 + i * 7 }, () => pool[Math.floor(Math.random() * pool.length)]);
      const sequence = [target[i], ...filler, previous[i] || null];
      strip.replaceChildren(...sequence.map(makeTile));
      reel.classList.remove("landed");
      reel.classList.add("spinning");
      const start = -((sequence.length - 1) / sequence.length) * 100;
      const roll = strip.animate(
        [
          { transform: `translateY(${start}%)`, filter: "blur(2.5px)" },
          { transform: `translateY(${start * 0.12}%)`, filter: "blur(2px)", offset: 0.72 },
          { transform: "translateY(0)", filter: "blur(0)" },
        ],
        { duration: 1500 + i * 480, easing: "cubic-bezier(.3,.1,.3,1)", fill: "both" }
      );
      roll.onfinish = () => { roll.cancel(); land(); };
    }));

    Promise.all(landings).then(() => {
      setBusy(false);
      $("#buildNote").textContent = state.note[side];
    });
  }

  function spinRandom() {
    const pool = poolFor(state.side);
    if (pool.length < 4) return;
    spinTo(shuffled(pool).slice(0, 4), "");
  }

  /* ------------------------------------------------------------------
     Ask for a build
     ------------------------------------------------------------------ */
  const includesAny = (text, phrases) => phrases.some((phrase) => text.includes(phrase));
  const matchBuilds = (side, text) => BUILDS[side].filter((b) => includesAny(text, b.words) || text.includes(b.label.toLowerCase()));

  function suggest(rawQuery) {
    const query = " " + rawQuery.toLowerCase().replace(/\s+/g, " ").trim() + " ";
    if (!query.trim()) return;

    // Work out which side the request is for.
    let side = state.side;
    let matched = matchBuilds(side, query);
    const hintsOther = includesAny(query, SIDE_HINTS[other(side)]) && !includesAny(query, SIDE_HINTS[side]);
    if (hintsOther || !matched.length) {
      const otherMatched = matchBuilds(other(side), query);
      if (otherMatched.length) { side = other(side); matched = otherMatched; }
    }

    const pool = poolFor(side);
    const named = pool.filter((p) => query.includes(p.name.toLowerCase()));
    if (!matched.length && !named.length) {
      $("#buildNote").textContent = "I don't know that kind of build yet. Try one of the suggestions below, or a perk name.";
      return;
    }
    if (side !== state.side) setSide(side);

    // Score every perk against the matched build types. A perk's first tag counts for more.
    const weights = {};
    matched.forEach((b) => Object.entries(b.tags).forEach(([tag, w]) => (weights[tag] = (weights[tag] || 0) + w)));
    const scored = pool
      .filter((p) => !named.includes(p))
      .map((perk) => ({
        perk,
        score: perk.tags.reduce((sum, tag, i) => sum + (weights[tag] || 0) * (i === 0 ? 1.5 : 1), 0),
      }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    // Take the named perks first, then draw the rest from the best matches, favouring higher
    // scores but leaving room for variety so asking twice gives a different mix.
    const picks = named.slice(0, 4);
    const candidates = scored.slice(0, Math.max(10, Math.ceil(scored.length * 0.45)));
    const allowsStacking = (perk) =>
      side !== "survivor" || !perk.tags.includes("exhaustion") || !picks.some((p) => p.tags.includes("exhaustion"));
    while (picks.length < 4 && candidates.length) {
      const total = candidates.reduce((sum, c) => sum + c.score ** 2, 0);
      let roll = Math.random() * total;
      let index = candidates.findIndex((c) => (roll -= c.score ** 2) <= 0);
      if (index < 0) index = candidates.length - 1;
      const [choice] = candidates.splice(index, 1);
      // Survivor exhaustion perks share one cooldown, so only ever take one.
      if (allowsStacking(choice.perk)) picks.push(choice.perk);
    }
    const matchCount = picks.length;
    if (picks.length < 4) {
      picks.push(...shuffled(pool.filter((p) => !picks.includes(p))).slice(0, 4 - picks.length));
    }

    const labels = matched.map((b) => b.label);
    const title = labels.length ? `${labels.join(" + ")} build` : "Build around " + named.map((p) => p.name).join(", ");
    const tail = matchCount < 4
      ? ` Only ${matchCount} perk${matchCount === 1 ? "" : "s"} fit, so the rest are random.`
      : " Ask again for a different mix.";
    spinTo(shuffled(picks), title + "." + tail);
  }

  function renderAskChips() {
    const chips = BUILDS[state.side].filter((b) => b.chip).map((b) => {
      const chip = el("button", "chip", b.label);
      chip.type = "button";
      chip.addEventListener("click", () => {
        askInput.value = b.label + " build";
        suggest(b.label);
      });
      return chip;
    });
    $("#askChips").replaceChildren(...chips);
    const sample = BUILDS[state.side].filter((b) => b.chip).slice(0, 2).map((b) => b.label.toLowerCase() + " build");
    askInput.placeholder = "e.g. " + sample.join(", ");
  }

  /* ------------------------------------------------------------------
     Side switch
     ------------------------------------------------------------------ */
  function setSide(side) {
    state.side = side;
    document.documentElement.dataset.side = side;
    document.querySelectorAll(".side-toggle button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.side === side)));
    browseBtn.textContent = `All ${side} perks`;
    $("#ownersBtn").textContent = side === "killer" ? "My killers" : "My survivors";
    state.filterTag = "";
    try { localStorage.setItem(SIDE_KEY, side); } catch { /* storage unavailable */ }
    renderAskChips();
    renderReels();
  }

  /* ------------------------------------------------------------------
     Perk description
     ------------------------------------------------------------------ */
  function showPerk(perk) {
    if (!perk) return;
    const side = perk.side || (DATA.killer.includes(perk) ? "killer" : "survivor");
    state.shownPerk = perk;
    fillGem($("#perkGem"), perk);
    $("#perkName").textContent = perk.name;
    $("#perkOwner").textContent = perk.owner + (inPool(perk) ? "" : " · not in your pool");
    $("#perkDesc").textContent = describe(perk);
    $("#perkTags").replaceChildren(...perk.tags.filter((t) => TAGS[side][t]).map((t) => el("span", "chip", TAGS[side][t])));
    perkDialog.showModal();
  }

  /* ------------------------------------------------------------------
     All perks
     ------------------------------------------------------------------ */
  function renderBrowse() {
    const side = state.side;
    const all = perksFor(side).slice().sort((a, b) => a.name.localeCompare(b.name));
    const search = $("#browseSearch").value.trim().toLowerCase();
    const shown = all.filter((p) => {
      if (state.filterTag && !p.tags.includes(state.filterTag)) return false;
      if (!search) return true;
      const haystack = [p.name, p.owner, p.desc, describe(p), ...p.tags.map((t) => TAGS[side][t] || "")].join(" ").toLowerCase();
      return haystack.includes(search);
    });

    $("#browseTitle").textContent = side === "killer" ? "Killer perks" : "Survivor perks";
    $("#browseCount").textContent = shown.length === all.length ? `${all.length} perks` : `${shown.length} of ${all.length}`;

    const tagChips = Object.entries(TAGS[side]).map(([tag, label]) => {
      const chip = el("button", "chip" + (state.filterTag === tag ? " on" : ""), label);
      chip.type = "button";
      chip.setAttribute("aria-pressed", String(state.filterTag === tag));
      chip.addEventListener("click", () => {
        state.filterTag = state.filterTag === tag ? "" : tag;
        renderBrowse();
      });
      return chip;
    });
    $("#browseTags").replaceChildren(...tagChips);

    const cards = shown.map((perk) => {
      const card = el("button", "perk-card" + (inPool(perk) ? "" : " excluded"));
      card.type = "button";
      const text = el("span");
      text.append(el("span", "tname", perk.name), el("span", "towner", perk.owner));
      card.append(fillGem(el("span"), perk), text);
      card.addEventListener("click", () => showPerk(perk));
      return card;
    });
    $("#perkList").replaceChildren(...(cards.length ? cards : [el("p", "empty-list", "No perks match that search.")]));
  }

  /* ------------------------------------------------------------------
     Check for new perks
     Asks the local server (server.py) to compare the app with the wiki. This only works
     when the app was started with "Start Perk Randomiser.bat", not opened as a file.
     ------------------------------------------------------------------ */
  const updateDialog = $("#updateDialog");
  let reloadOnClose = false;

  // Online copy (GitHub Pages): the daily job keeps data/pending-perks.json up to date with
  // the perks it is holding back. Show them with a date box each. The page cannot change the
  // repository itself, so "Send" opens GitHub with a ready-written message for the job to read.
  async function showOnlinePending(status, list) {
    const repoUrl = location.hostname.endsWith(".github.io")
      ? `https://github.com/${location.hostname.split(".")[0]}/${location.pathname.split("/").filter(Boolean)[0] || ""}`
      : "";
    // With a GitHub key saved on this device, Send talks to GitHub directly (one press).
    // Without one, Send is a link that opens GitHub with the message filled in.
    const key = savedKey();
    const api = repoUrl.replace("https://github.com/", "https://api.github.com/repos/");
    $("#updateSetup").replaceChildren();
    status.textContent = "Checking…";
    let pending = [];
    try {
      const response = await fetch("data/pending-perks.json?t=" + Date.now());
      if (response.ok) pending = await response.json();
    } catch { /* treated as nothing waiting */ }
    if (!Array.isArray(pending) || !pending.length) {
      status.textContent = "No new perks are waiting. This online copy checks the wiki by itself once a day, and any new perks it finds will show up here so you can set their release date.";
      return;
    }
    const intro = "These perks are on the wiki but are held back until their release date. ";
    status.textContent = !repoUrl ? intro
      : key ? intro + "Pick a date and press Send. Pick today to add the perks now. Changes show here a couple of minutes later."
        : intro + "Pick a date and press Send. GitHub opens with the message already written: press its green Create button to confirm. Pick today to add the perks now. Changes show here a couple of minutes later.";

    const today = new Date().toISOString().slice(0, 10);
    list.replaceChildren(...pending.map((group) => {
      const item = el("li", "", group.owner);
      item.append(el("small", "", `${group.side} · ${group.perks.map((p) => p.name).join(", ")}`));
      const row = el("div", "date-row");
      const label = el("label", "", group.release ? "Scheduled for" : "Release date");
      const input = el("input");
      input.type = "date";
      input.min = today;
      input.value = group.release || "";
      label.append(input);
      row.append(label);
      item.append(row);
      if (repoUrl && key) {
        const send = el("button", "btn", "Send");
        send.type = "button";
        const note = el("small", "send-note");
        send.addEventListener("click", async () => {
          if (!input.value) { note.textContent = "Pick a date first, then press Send."; return; }
          send.disabled = true;
          note.textContent = "Sending…";
          try {
            const response = await fetch(api + "/issues", {
              method: "POST",
              headers: { Authorization: "Bearer " + key, Accept: "application/vnd.github+json" },
              body: JSON.stringify({
                title: `Release date: ${group.owner}`,
                body: `Add ${group.owner}'s perks to the app on ${input.value}`,
              }),
            });
            if (response.status === 201) {
              note.textContent = "Sent. It will show as scheduled here in a couple of minutes.";
            } else if (response.status === 401) {
              note.textContent = "The saved key no longer works (it may have expired). Remove it below and set up a new one.";
            } else if (response.status === 403 || response.status === 404) {
              note.textContent = "The saved key is not allowed to do this. It needs Issues: Read and write on this repository.";
            } else {
              note.textContent = `GitHub refused the request (error ${response.status}). Try again later.`;
            }
          } catch {
            note.textContent = "Could not reach GitHub. Check your connection and try again.";
          } finally {
            send.disabled = false;
          }
        });
        row.append(send);
        item.append(note);
      } else if (repoUrl) {
        // A real link (not a script-opened window) so pop-up blockers leave it alone.
        const send = el("a", "btn", "Send");
        send.target = "_blank";
        send.rel = "noopener";
        const note = el("small", "send-note");
        const refresh = () => {
          if (input.value) {
            const title = encodeURIComponent(`Release date: ${group.owner}`);
            const body = encodeURIComponent(`Add ${group.owner}'s perks to the app on ${input.value}`);
            send.href = `${repoUrl}/issues/new?title=${title}&body=${body}`;
            note.textContent = "";
          } else {
            send.removeAttribute("href");
          }
        };
        input.addEventListener("input", refresh);
        input.addEventListener("change", refresh);
        send.addEventListener("click", () => {
          refresh();
          note.textContent = input.value
            ? "GitHub should have opened in a new tab. Press its green Create button there to finish. If no tab opened, allow pop-ups for this site and press Send again."
            : "Pick a date first, then press Send.";
        });
        refresh();
        row.append(send);
        item.append(note);
      }
      return item;
    }));
    if (repoUrl) renderKeySetup(repoUrl, api, key, () => showOnlinePending(status, list));
  }

  // The GitHub key is kept only in this browser (never in the app's files). It lets Send
  // post the date message for you, so you don't have to open GitHub each time.
  const KEY_STORE = "dbd-perk-randomiser.github-key";
  function savedKey() {
    try { return localStorage.getItem(KEY_STORE) || ""; } catch { return ""; }
  }
  function renderKeySetup(repoUrl, api, key, rerender) {
    const box = $("#updateSetup");
    const repoName = repoUrl.split("/").pop();
    if (key) {
      const remove = el("button", "chip", "Remove key from this device");
      remove.type = "button";
      remove.addEventListener("click", () => {
        try { localStorage.removeItem(KEY_STORE); } catch { /* storage unavailable */ }
        rerender();
      });
      box.replaceChildren(el("p", "hint", "One-press sending is set up on this device."), remove);
      return;
    }

    const details = el("details");
    details.append(el("summary", "", "Send without opening GitHub (one-time setup)"));
    const steps = el("ol");
    const first = el("li", "", "Open ");
    const link = el("a", "", "GitHub's new token page");
    link.href = "https://github.com/settings/personal-access-tokens/new";
    link.target = "_blank";
    link.rel = "noopener";
    first.append(link, " and give the token any name.");
    steps.append(
      first,
      el("li", "", `Under Repository access choose "Only select repositories" and pick ${repoName}.`),
      el("li", "", 'Under Permissions, Repository permissions, set Issues to "Read and write".'),
      el("li", "", "Generate the token, copy it, and paste it below."),
    );
    const input = el("input");
    input.type = "password";
    input.placeholder = "Paste the token here";
    input.autocomplete = "off";
    input.setAttribute("aria-label", "GitHub token");
    const save = el("button", "btn", "Save");
    save.type = "button";
    const row = el("div", "date-row");
    row.append(input, save);
    const note = el("p", "hint");
    note.textContent = "The token is stored only in this browser. It can do nothing except open issues on this one repository.";
    save.addEventListener("click", async () => {
      const value = input.value.trim();
      if (!value) return;
      note.textContent = "Checking the token…";
      try {
        const response = await fetch(api, { headers: { Authorization: "Bearer " + value, Accept: "application/vnd.github+json" } });
        if (!response.ok) {
          note.textContent = "GitHub did not accept that token. Check you copied all of it and that it can access this repository.";
          return;
        }
        localStorage.setItem(KEY_STORE, value);
        rerender();
      } catch {
        note.textContent = "Could not check the token. Check your connection, and that this browser allows the site to save data.";
      }
    });
    details.append(steps, row, note);
    box.replaceChildren(details);
  }

  // dates: release dates typed into the window, as { "<side>|<character>": "YYYY-MM-DD" }.
  async function checkForPerks(dates) {
    const add = Boolean(dates);
    const status = $("#updateStatus");
    const list = $("#updateList");
    const addButton = $("#updateAdd");
    const needsServer = 'This needs the app to be started with "Start Perk Randomiser.bat" in the app folder. Close this tab, double-click that file, and try again.';
    addButton.hidden = true;
    $("#updateSetup").replaceChildren();
    if (!add) list.replaceChildren();
    if (!updateDialog.open) updateDialog.showModal();

    if (location.protocol === "file:") {
      status.textContent = needsServer;
      return;
    }
    if (!["localhost", "127.0.0.1"].includes(location.hostname)) {
      // The online copy has no server to ask: a daily job on GitHub does the check instead.
      await showOnlinePending(status, list);
      return;
    }
    status.textContent = add ? "Saving…" : "Checking the wiki… this can take a few seconds.";
    $("#updateClose").disabled = true;
    try {
      const response = await fetch("api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates: dates || null }),
      });
      const isJson = (response.headers.get("Content-Type") || "").includes("json");
      if (!isJson) {
        status.textContent = needsServer;
        return;
      }
      const result = await response.json();
      if (!response.ok) {
        status.textContent = "The wiki could not be checked: " + (result.error || "unknown error") + ".";
        return;
      }

      reloadOnClose = true; // descriptions and icons were refreshed on disk
      const names = (group) => group.perks.map((p) => p.name).join(", ");
      const addedNow = result.released.reduce((sum, group) => sum + group.perks.length, 0);
      const lines = [];
      if (addedNow) lines.push(`Added ${addedNow} ${addedNow === 1 ? "perk" : "perks"} to the app: ${result.released.map(names).join(", ")}.`);
      if (!result.pending.length) {
        lines.push(`You're up to date. The wiki lists ${result.survivor} survivor and ${result.killer} killer perks, and the app has them all.`);
      } else {
        lines.push("These perks are on the wiki but not in the app yet. Perks often show up before their chapter is out, so give each a release date and it will be added on that day. Pick today to add it now.");
      }
      status.textContent = lines.join(" ");

      // One row per character waiting for release, each with its own date box.
      const today = new Date().toISOString().slice(0, 10);
      list.replaceChildren(...result.pending.map((group) => {
        const item = el("li", "", group.owner);
        item.append(el("small", "", `${group.side} · ${names(group)}`));
        const label = el("label", "", group.release ? "Scheduled for" : "Release date");
        const input = el("input");
        input.type = "date";
        input.min = today;
        input.value = group.release || "";
        input.dataset.key = `${group.side}|${group.owner}`;
        input.dataset.saved = group.release || "";
        label.append(input);
        item.append(label);
        return item;
      }));
      addButton.hidden = !result.pending.length;
    } catch {
      status.textContent = needsServer;
    } finally {
      $("#updateClose").disabled = false;
    }
  }
  $("#checkBtn").addEventListener("click", () => checkForPerks(false));
  $("#updateAdd").addEventListener("click", () => {
    const dates = {};
    document.querySelectorAll("#updateList input[type=date]").forEach((input) => {
      if (input.value && input.value !== input.dataset.saved) dates[input.dataset.key] = input.value;
    });
    if (Object.keys(dates).length) checkForPerks(dates);
  });
  $("#updateClose").addEventListener("click", () => updateDialog.close());
  updateDialog.addEventListener("close", () => { if (reloadOnClose) location.reload(); });

  /* ------------------------------------------------------------------
     Wiring
     ------------------------------------------------------------------ */
  document.querySelectorAll(".side-toggle button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.side === state.side || state.spinning) return;
      setSide(button.dataset.side);
      if (!state.build[state.side].length) spinRandom();
    });
  });
  spinBtn.addEventListener("click", spinRandom);
  reels.forEach((reel, i) => reel.addEventListener("click", () => showPerk(state.build[state.side][i])));
  $("#askForm").addEventListener("submit", (event) => {
    event.preventDefault();
    suggest(askInput.value);
  });
  browseBtn.addEventListener("click", () => {
    $("#browseSearch").value = "";
    renderBrowse();
    browseDialog.showModal();
  });
  $("#browseSearch").addEventListener("input", renderBrowse);
  $("#ownersBtn").addEventListener("click", () => {
    renderOwners();
    $("#ownersDialog").showModal();
  });
  $("#ownersAll").addEventListener("click", () => setAllOwners(true));
  $("#ownersNone").addEventListener("click", () => setAllOwners(false));

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      // Close from a Close/Cancel button, or from a click on the backdrop.
      const box = dialog.getBoundingClientRect();
      const outside = event.target === dialog &&
        (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom);
      if (event.target.closest("[data-close]") || outside) dialog.close();
    });
  });

  let savedSide = "survivor";
  try { savedSide = localStorage.getItem(SIDE_KEY) === "killer" ? "killer" : "survivor"; } catch { /* storage unavailable */ }
  setSide(savedSide);
  spinRandom();
})();
