"""
Refresh perk descriptions and icons from the Dead by Daylight wiki, and find new perks.

The app's "Check for new perks" button runs this for you (start the app with
"Start Perk Randomiser.bat"). You can also run it by hand:

    python tools/update_from_wiki.py            check, and add perks whose release date has come
    python tools/update_from_wiki.py --add      add every waiting perk straight away
    python tools/update_from_wiki.py --github   what the daily job on GitHub runs (see below)

It rewrites data/descriptions.js with the wiki's current description for every perk and
downloads any icons missing from the icons folder.

Perks usually appear on the wiki before their chapter is released, so a new perk is not
added to the app straight away. It goes into data/pending-perks.json, grouped by character,
and waits for a release date. On that date a line is written into data/survivor-perks.js
or data/killer-perks.js for each perk, with build tags guessed from its description.

Where the date comes from:
  - On GitHub (--github): the job opens an issue per character asking for the date. Reply
    to the issue with e.g. "2026-12-02", "2 December 2026" or "now".
  - On your PC: the "Check for new perks" window asks for it.
"""
import datetime, html, json, os, re, subprocess, sys, time, unicodedata, urllib.parse, urllib.request
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


PENDING = os.path.join(ROOT, "data", "pending-perks.json")
MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]


def today_iso():
    return datetime.datetime.now(datetime.timezone.utc).date().isoformat()


def load_pending():
    """Perks waiting for their release date: a list of groups, one per character."""
    try:
        with open(PENDING, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except (OSError, ValueError):
        return []


def save_pending(pending):
    with open(PENDING, "w", encoding="utf-8", newline="\n") as f:
        json.dump(pending, f, ensure_ascii=False, indent=1)
        f.write("\n")


def group_key(group):
    return f"{group['side']}|{group['owner']}"


def parse_date(text):
    """Read a date out of a reply. Returns YYYY-MM-DD, or None if there isn't one."""
    t = " ".join(str(text).lower().split())
    found = None
    m = re.search(r"\b(\d{4})-(\d{1,2})-(\d{1,2})\b", t)
    if m:
        found = (int(m[1]), int(m[2]), int(m[3]))
    if not found:
        m = re.search(r"\b(\d{1,2})[/.](\d{1,2})[/.](\d{4})\b", t)          # day/month/year
        if m:
            found = (int(m[3]), int(m[2]), int(m[1]))
    if not found:
        m = re.search(r"\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([a-z]{3,9})\.?,?\s+(\d{4})\b", t)
        if m and m[2][:3] in MONTHS:
            found = (int(m[3]), MONTHS.index(m[2][:3]) + 1, int(m[1]))
    if not found:
        m = re.search(r"\b([a-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b", t)
        if m and m[1][:3] in MONTHS:
            found = (int(m[3]), MONTHS.index(m[1][:3]) + 1, int(m[2]))
    if found:
        try:
            return datetime.date(*found).isoformat()
        except ValueError:
            return None
    if re.search(r"\b(now|today)\b", t):
        return today_iso()
    return None


PORTRAIT_PAGES = ("https://deadbydaylight.wiki.gg/wiki/Survivors", "https://deadbydaylight.wiki.gg/wiki/Killers")
# each portrait on those pages says which side it belongs to, then links to the character by name
PORTRAIT_RE = re.compile(
    r'class="charPortraitRoleBg (survivor|killer)"></div>\s*<div class="charPortraitImage[^"]*">\s*'
    r'<a [^>]*title="([^"]+)"[^>]*>\s*<img [^>]*src="([^"]+Portrait[^"]*\.png)[^"]*"')
PORTRAIT_SIZE = 128   # pixels; the wiki's originals are 512, far more than the app shows


def fetch_portraits():
    """
    Download any character portrait the app doesn't have yet, as portraits/<side>/<character>.png.
    Returns (new, failed). A problem here never stops the perk update.
    """
    new, failed = 0, []
    seen = set()
    for page in PORTRAIT_PAGES:
        try:
            page_html = get(page).decode("utf-8", "replace")
        except Exception as e:
            failed.append(f"portraits page {page} ({e})")
            continue
        for side, title, src in PORTRAIT_RE.findall(page_html):
            name = html.unescape(title)
            key = slug(name)
            if (side, key) in seen:
                continue
            seen.add((side, key))
            folder = os.path.join(ROOT, "portraits", side)
            os.makedirs(folder, exist_ok=True)
            dest = os.path.join(folder, key + ".png")
            if os.path.exists(dest) and os.path.getsize(dest) > 500:
                continue
            path = src.split("?")[0]
            file = path.rsplit("/", 1)[-1]
            small = path.replace("/images/", "/images/thumb/", 1) + f"/{PORTRAIT_SIZE}px-{file}"
            for candidate in (small, path):          # the small version first, the original if there isn't one
                try:
                    data = get(urllib.parse.urljoin(page, candidate))
                    if not data.startswith(b"\x89PNG"):
                        raise ValueError("not a PNG")
                    with open(dest, "wb") as f:
                        f.write(data)
                    new += 1
                    break
                except Exception as e:
                    error = e
            else:
                failed.append(f"{name} portrait ({error})")
            time.sleep(0.15)
    return new, failed


def run(dates=None, add_all=False):
    """
    Refresh descriptions and icons, park newly found perks in the pending list, and add the
    perks whose release date has arrived.

    dates:   {"<side>|<character>": "a date"} to set release dates on pending groups.
    add_all: add every pending perk now, whatever its date.
    """
    pending = load_pending()
    waiting = {s: {slug(p["name"]) for g in pending if g["side"] == s for p in g["perks"]} for s in SIDES}
    in_app = {}
    found = []
    parser = PerkTables()
    parser.feed(get(PAGE).decode("utf-8", "replace"))
    tables = [t for t in parser.tables if len(t) > 100]
    if len(tables) != 2:
        raise RuntimeError("The wiki page layout has changed: expected one survivor and one killer table.")

    descriptions, failed, new_icons = {}, [], 0
    for side, rows in zip(SIDES, tables):
        with open(os.path.join(ROOT, "data", f"{side}-perks.js"), encoding="utf-8") as f:
            known = {slug(n) for n in re.findall(r'^\s*p\("((?:[^"\\]|\\.)*)"', f.read(), re.M)}
        in_app[side] = set(known)
        os.makedirs(os.path.join(ROOT, "icons", side), exist_ok=True)
        descriptions[side] = {}
        for row in rows:
            name = " ".join(row["name"].split())
            key = slug(name)
            desc = tidy(row["desc"])
            descriptions[side][key] = desc
            if key not in known and key not in waiting[side]:
                known.add(key)
                owner = full_owner(side, " ".join(row["owner"].split()))
                found.append({"side": side, "name": name, "owner": owner})
                group = next((g for g in pending if g["side"] == side and g["owner"] == owner), None)
                if group is None:
                    group = {"side": side, "owner": owner, "perks": [], "release": None, "issue": None}
                    pending.append(group)
                group["perks"].append({"name": name, "tags": guess_tags(side, name, desc)})

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

    try:
        new_portraits, portrait_failures = fetch_portraits()
        new_icons += new_portraits
        failed += portrait_failures
    except Exception as e:      # portraits are a nicety; perks still update without them
        failed.append(f"portraits ({e})")

    with open(os.path.join(ROOT, "data", "descriptions.js"), "w", encoding="utf-8", newline="\n") as f:
        f.write("// Generated by tools/update_from_wiki.py from " + PAGE + "\n")
        f.write("// Do not edit by hand: re-run the script to refresh it.\n")
        f.write("window.DBD_DESCRIPTIONS = ")
        json.dump(descriptions, f, ensure_ascii=False, indent=1)
        f.write(";\n")

    # Forget pending perks that have since been added to the app by hand.
    for group in pending:
        group["perks"] = [p for p in group["perks"] if slug(p["name"]) not in in_app[group["side"]]]
    pending = [g for g in pending if g["perks"]]

    # Record any release dates we were given.
    for group in pending:
        given = (dates or {}).get(group_key(group))
        if given and parse_date(given):
            group["release"] = parse_date(given)

    # Add the groups whose day has come.
    today = today_iso()
    released = [g for g in pending if add_all or (g.get("release") and g["release"] <= today)]
    for side in SIDES:
        due = [dict(p, owner=g["owner"]) for g in released if g["side"] == side for p in g["perks"]]
        if due:
            add_to_data_file(side, due)
    pending = [g for g in pending if g not in released]
    save_pending(pending)

    return {
        "survivor": len(descriptions["survivor"]),
        "killer": len(descriptions["killer"]),
        "inApp": {s: len(in_app[s]) + sum(len(g["perks"]) for g in released if g["side"] == s) for s in SIDES},
        "found": found,
        "released": released,
        "pending": pending,
        "newIcons": new_icons,
        "failedIcons": failed,
    }


# ---------------------------------------------------------------------------------------
# GitHub: ask for release dates through issues. Used by .github/workflows/update-perks.yml
# ---------------------------------------------------------------------------------------
def gh(path, payload=None, method=None):
    cmd = ["gh", "api", path]
    if method:
        cmd += ["-X", method]
    if payload is not None:
        cmd += ["--input", "-"]
    r = subprocess.run(cmd, input=json.dumps(payload).encode() if payload is not None else None, capture_output=True)
    if r.returncode:
        raise RuntimeError(f"{path}: {r.stderr.decode(errors='replace').strip()}")
    return json.loads(r.stdout or b"{}")


def perk_names(group):
    return "\n".join(f"- {p['name']}" for p in group["perks"])


def github_sync():
    repo = os.environ["GITHUB_REPOSITORY"]
    owner = repo.split("/")[0].lower()
    comment = lambda issue, body: gh(f"repos/{repo}/issues/{issue}/comments", {"body": body})

    # 1. Read the repository owner's replies on the open "when do these release?" issues.
    dates, unreadable = {}, []
    for group in load_pending():
        if not group.get("issue"):
            continue
        comments = gh(f"repos/{repo}/issues/{group['issue']}/comments?per_page=100")
        mine = [c for c in comments if c["user"]["login"].lower() == owner]
        if not mine:
            continue
        wanted = parse_date(mine[-1]["body"])
        if wanted and wanted != group.get("release"):          # a new date, or a changed one
            dates[group_key(group)] = wanted
        elif not wanted and comments[-1]["user"]["login"].lower() == owner:   # not answered yet
            unreadable.append(group["issue"])

    # 1b. Read dates sent from the app's "Send" button: issues the owner opened that are
    #     titled "Release date: <character>" with the date in the text.
    requests = []
    for issue in gh(f"repos/{repo}/issues?state=open&creator={owner}&per_page=50"):
        title = issue["title"]
        if "pull_request" in issue or not title.lower().startswith("release date:"):
            continue
        who = title.split(":", 1)[1].strip().lower()
        group = next((g for g in load_pending() if g["owner"].lower() == who), None)
        wanted = parse_date(issue.get("body") or "")
        if group and wanted:
            dates[group_key(group)] = wanted
            requests.append((issue["number"], f"Thanks. {group['owner']}'s perks will be added to the app on **{wanted}** "
                                              "(straight away if that is today)."))
        elif not group:
            requests.append((issue["number"], "No perks are waiting for a character with that name, so nothing was changed."))
        else:
            requests.append((issue["number"], "I couldn't find a date in that message, so nothing was changed. "
                                              "Use the Send button in the app again, or write a date like `2026-12-02`."))

    # 2. Check the wiki, apply those dates, add whatever is due.
    result = run(dates=dates)
    for number, reply in requests:
        comment(number, reply)
        gh(f"repos/{repo}/issues/{number}", {"state": "closed"}, method="PATCH")

    # 3. Report back on the issues, and open one for each newly found character.
    for group in result["released"]:
        if group.get("issue"):
            comment(group["issue"], f"Added to the app today:\n{perk_names(group)}")
            gh(f"repos/{repo}/issues/{group['issue']}", {"state": "closed"}, method="PATCH")
    for group in result["pending"]:
        if not group.get("issue"):
            issue = gh(f"repos/{repo}/issues", {
                "title": f"New perks found: {group['owner']} - when should they be added?",
                "assignees": [repo.split("/")[0]],
                "body": (
                    f"The wiki now lists {group['side']} perks for **{group['owner']}** that are not in the app yet:\n\n"
                    f"{perk_names(group)}\n\n"
                    "Perks often appear on the wiki before their chapter is released, so they are being held back.\n\n"
                    "**Reply to this issue with the release date** and they will be added to the app that morning. "
                    "Any of these work: `2026-12-02`, `2 December 2026`, `02/12/2026`. Reply `now` to add them straight away."
                ),
            })
            group["issue"] = issue["number"]
        elif group_key(group) in dates:
            comment(group["issue"], f"Thanks. These perks will be added to the app on **{group['release']}**. "
                                    "Reply with a different date if that changes.")
    for issue in unreadable:
        comment(issue, "I couldn't find a date in that reply. Please reply with something like "
                       "`2026-12-02`, `2 December 2026` or `02/12/2026`, or `now` to add the perks straight away.")
    save_pending(result["pending"])
    return result


def main():
    args = sys.argv[1:]
    print("Reading", PAGE)
    result = github_sync() if "--github" in args else run(add_all="--add" in args)
    print(f"Descriptions: {result['survivor']} survivor, {result['killer']} killer")
    print(f"New icons downloaded: {result['newIcons']}")
    if result["failedIcons"]:
        print("Icons that could not be downloaded:")
        print("\n".join("  " + line for line in result["failedIcons"]))
    for p in result["found"]:
        print(f"New on the wiki: {p['name']} ({p['owner']}, {p['side']})")
    for g in result["released"]:
        print(f"Added to the app: {g['owner']}: " + ", ".join(p["name"] for p in g["perks"]))
    for g in result["pending"]:
        when = g.get("release") or "no release date yet"
        print(f"Waiting ({when}): {g['owner']}: " + ", ".join(p["name"] for p in g["perks"]))
    if not (result["found"] or result["released"] or result["pending"]):
        print("Every perk on the wiki is already in the app.")


if __name__ == "__main__":
    main()
