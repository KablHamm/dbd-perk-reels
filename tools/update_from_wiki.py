"""
Refresh perk descriptions and icons from the Dead by Daylight wiki, and find new perks.

The app's "Check for new perks" button runs this for you (start the app with
"Start Perk Randomiser.bat"). You can also run it by hand:

    python tools/update_from_wiki.py          check only
    python tools/update_from_wiki.py --add    also add any new perks to the app

It rewrites data/descriptions.js with the wiki's current description for every perk,
downloads any icons missing from the icons folder, and lists perks that are on the wiki
but not yet in data/survivor-perks.js or data/killer-perks.js. With --add, a line is
written into those files for each new perk, with build tags guessed from its description.
"""
import json, os, re, sys, time, unicodedata, urllib.parse, urllib.request
from html.parser import HTMLParser

PAGE = "https://deadbydaylight.wiki.gg/wiki/Perks"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIDES = ("survivor", "killer")
BLOCK_TAGS = {"p", "div", "ul", "ol", "dl", "dd", "dt", "table", "tr", "h3", "h4"}
INSERT_BEFORE = "\n  window.DBD_PERKS = Object.assign("

# Words in a description that suggest a build tag. Used only for perks added automatically;
# edit the tags in the data files afterwards if a guess is off.
TAG_HINTS = {
    "survivor": {
        "stealth": r"scratch marks|grunts of pain|pools of blood|elusive",
        "gens": r"repair|generator",
        "healing": r"\bheal",
        "selfheal": r"self-heal|heal yourself|healing progress",
        "chase": r"chase|vault|pallet",
        "exhaustion": r"exhausted",
        "haste": r"haste",
        "aura": r"\baura",
        "altruism": r"unhook(?:ing)? (?:a|another|other)|protection hit",
        "antitunnel": r"after being unhooked",
        "antislug": r"dying state|recovery",
        "endurance": r"endurance",
        "endgame": r"exit gate|hatch",
        "totems": r"totem",
        "items": r"\bitem|chest|toolbox|med-kit|flashlight",
        "sabotage": r"sabotag",
        "wiggle": r"wiggl",
        "stun": r"\bstun",
        "blind": r"\bblind(?!ness)",
        "lockers": r"locker",
        "basement": r"basement",
        "team": r"other survivors|all survivors|survivors within",
        "obsession": r"obsession",
    },
    "killer": {
        "regression": r"regress|explode",
        "genblock": r"block(?:s|ed)? (?:the |that |a |all )?(?:\w+ )?generator|generators? (?:is|are|becomes?) blocked",
        "slowdown": r"action speed|repair speed|skill check",
        "aura": r"\baura",
        "tracking": r"loud noise|location is revealed|reveal their",
        "chase": r"chas",
        "antiloop": r"pallet|vault|window|breakable wall",
        "haste": r"haste",
        "totems": r"totem",
        "hook": r"\bhook",
        "carry": r"carrying",
        "basement": r"basement",
        "endgame": r"exit gate",
        "stealth": r"undetectable",
        "terror": r"terror radius",
        "antiheal": r"\bheal|mangled|haemorrhage|broken status",
        "slug": r"dying state",
        "exposed": r"exposed",
        "obsession": r"obsession",
        "status": r"oblivious|blindness|exhausted",
        "hinder": r"hindered",
        "scream": r"scream",
        "items": r"\bitem",
        "antiblind": r"blinded",
        "lockers": r"locker",
        "basicattack": r"basic attack",
    },
}
NAME_TAGS = {"hex:": "hex", "boon:": "boon", "scourge hook:": "scourge", "teamwork:": "team"}


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()


def slug(name):
    """Same rule the app uses to match a perk to its icon file and description."""
    s = unicodedata.normalize("NFD", name)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def tidy(text):
    text = text.replace("\xa0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r" +([,.;:!?%)])", r"\1", text)   # gaps left behind by inline icons
    text = re.sub(r"\( +", "(", text)
    text = re.sub(r"\n•\s*\n", "\n", text)            # empty bullets
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


def guess_tags(side, name, desc):
    text = desc.lower()
    scored = []
    for tag, pattern in TAG_HINTS[side].items():
        hits = len(re.findall(pattern, text))
        if hits:
            scored.append((hits, tag))
    tags = [tag for _, tag in sorted(scored, key=lambda s: -s[0])][:4]
    for prefix, tag in NAME_TAGS.items():
        if name.lower().startswith(prefix):
            tags = [tag] + [t for t in tags if t != tag][:3]
    return tags


def full_owner(side, owner):
    owner = owner.strip()
    if not owner or owner.lower() == "all":
        return "General"
    if side == "killer" and not owner.lower().startswith("the "):
        return "The " + owner
    return owner


class PerkTables(HTMLParser):
    """Collects icon, name, description and character from each row of the page's tables."""

    def __init__(self):
        super().__init__()
        self.tables, self.depth, self.row, self.cell = [], 0, None, -1

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "table":
            self.depth += 1
            if self.depth == 1:
                self.tables.append([])
            return
        if self.depth != 1:
            return
        if tag == "tr":
            self.row, self.cell = {"img": "", "name": "", "desc": "", "owner": ""}, -1
        elif self.row is None:
            return
        elif tag in ("td", "th"):
            self.cell += 1
        elif tag == "img":
            if self.cell == 0 and not self.row["img"]:
                self.row["img"] = a.get("data-src") or a.get("src") or ""
        elif self.cell == 2:
            if tag == "br":
                self.row["desc"] += "\n"
            elif tag == "li":
                self.row["desc"] += "\n• "
            elif tag in BLOCK_TAGS:
                self.row["desc"] += "\n"

    def handle_endtag(self, tag):
        if tag == "table":
            self.depth -= 1
        elif self.depth == 1 and tag == "tr" and self.row is not None:
            if self.row["img"] and self.row["name"].strip():
                self.tables[-1].append(self.row)
            self.row = None
        elif self.depth == 1 and self.row is not None and self.cell == 2 and tag in BLOCK_TAGS | {"li"}:
            self.row["desc"] += "\n"

    def handle_data(self, data):
        if self.depth == 1 and self.row is not None:
            if self.cell == 1:
                self.row["name"] += data
            elif self.cell == 2:
                self.row["desc"] += data.replace("\n", " ")
            elif self.cell == 3:
                self.row["owner"] += data


def add_to_data_file(side, perks):
    """Write a p(...) line for each perk just above the end of the side's data file."""
    path = os.path.join(ROOT, "data", f"{side}-perks.js")
    with open(path, encoding="utf-8") as f:
        text = f.read()
    at = text.rfind(INSERT_BEFORE)
    if at < 0:
        raise RuntimeError(f"Could not find where to add perks in data/{side}-perks.js")
    q = lambda s: json.dumps(s, ensure_ascii=False)
    lines = "".join(
        f"  p({q(p['name'])}, {q(p['owner'])}, {q(' '.join(p['tags']))}, \"\");\n" for p in perks
    )
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text[:at] + "\n" + lines.rstrip("\n") + text[at:])


def run(add=False):
    """Refresh descriptions and icons. Returns what was found; adds new perks if add is True."""
    parser = PerkTables()
    parser.feed(get(PAGE).decode("utf-8", "replace"))
    tables = [t for t in parser.tables if len(t) > 100]
    if len(tables) != 2:
        raise RuntimeError("The wiki page layout has changed: expected one survivor and one killer table.")

    descriptions, new_perks, failed, new_icons = {}, [], [], 0
    for side, rows in zip(SIDES, tables):
        with open(os.path.join(ROOT, "data", f"{side}-perks.js"), encoding="utf-8") as f:
            known = {slug(n) for n in re.findall(r'^\s*p\("((?:[^"\\]|\\.)*)"', f.read(), re.M)}
        os.makedirs(os.path.join(ROOT, "icons", side), exist_ok=True)
        descriptions[side] = {}
        for row in rows:
            name = " ".join(row["name"].split())
            key = slug(name)
            desc = tidy(row["desc"])
            descriptions[side][key] = desc
            if key not in known:
                known.add(key)
                new_perks.append({
                    "side": side,
                    "name": name,
                    "owner": full_owner(side, " ".join(row["owner"].split())),
                    "tags": guess_tags(side, name, desc),
                })

            dest = os.path.join(ROOT, "icons", side, key + ".png")
            if os.path.exists(dest) and os.path.getsize(dest) > 500:
                continue
            src = row["img"].split("?")[0]
            # thumbnails look like /images/thumb/<file>/<size>px-<file>; fetch the original
            m = re.match(r"(.*/images)/thumb/(.+?\.png)/[^/]+$", src)
            url = urllib.parse.urljoin(PAGE, f"{m.group(1)}/{m.group(2)}" if m else src)
            try:
                data = get(url)
                if not data.startswith(b"\x89PNG"):
                    raise ValueError("not a PNG")
                with open(dest, "wb") as f:
                    f.write(data)
                new_icons += 1
            except Exception as e:
                failed.append(f"{name} ({e})")
            time.sleep(0.15)

    with open(os.path.join(ROOT, "data", "descriptions.js"), "w", encoding="utf-8", newline="\n") as f:
        f.write("// Generated by tools/update_from_wiki.py from " + PAGE + "\n")
        f.write("// Do not edit by hand: re-run the script to refresh it.\n")
        f.write("window.DBD_DESCRIPTIONS = ")
        json.dump(descriptions, f, ensure_ascii=False, indent=1)
        f.write(";\n")

    added = 0
    if add:
        for side in SIDES:
            mine = [p for p in new_perks if p["side"] == side]
            if mine:
                add_to_data_file(side, mine)
                added += len(mine)

    return {
        "survivor": len(descriptions["survivor"]),
        "killer": len(descriptions["killer"]),
        "newPerks": new_perks,
        "added": added,
        "newIcons": new_icons,
        "failedIcons": failed,
    }


def main():
    print("Reading", PAGE)
    result = run(add="--add" in sys.argv[1:])
    print(f"Descriptions: {result['survivor']} survivor, {result['killer']} killer")
    print(f"New icons downloaded: {result['newIcons']}")
    if result["failedIcons"]:
        print("Icons that could not be downloaded:")
        print("\n".join("  " + line for line in result["failedIcons"]))
    if not result["newPerks"]:
        print("Every perk on the wiki is already in the app.")
    else:
        print("Added to the app:" if result["added"] else "On the wiki but not in the app yet (run again with --add):")
        for p in result["newPerks"]:
            print(f"  {p['side']}: {p['name']} ({p['owner']}) [{' '.join(p['tags'])}]")


if __name__ == "__main__":
    main()
