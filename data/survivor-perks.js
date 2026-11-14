/*
  SURVIVOR PERKS
  ==============
  To add a perk when a new chapter comes out, copy one of the lines below and edit it:

    p("Perk Name", "Character Name", "tag1 tag2", "Short description of what it does.");

  - Tags drive the "Ask for a build" suggestions. Put the most important tag first.
    Survivor tags: stealth gens healing selfheal chase exhaustion haste aura altruism
                   antitunnel antislug endurance endgame boon totems items sabotage
                   wiggle stun blind selfunhook lockers basement team solo obsession
  - Icon: save a PNG as icons/survivor/<perk-name>.png, using lower case with dashes for
    spaces and punctuation, e.g. "We'll Make It" -> icons/survivor/we-ll-make-it.png.
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
  p("Dark Sense", "General", "aura gens", "When a generator is completed, the killer's aura is revealed to you the next time they come close.");
  p("Déjà Vu", "General", "gens aura", "Reveals the three generators that sit closest together and lets you repair those ones a little faster.");
  p("Hope", "General", "endgame haste", "Once the exit gates are powered, you move faster for the rest of the trial.");
  p("Kindred", "General", "aura solo altruism", "While you are on the hook, everyone can see each other's auras, plus the killer's aura when they stay near the hook.");
  p("Lightweight", "General", "stealth chase", "Your scratch marks fade sooner and are spaced less evenly, making you harder to follow.");
  p("No One Left Behind", "General", "endgame altruism", "Once the gates are powered you heal and unhook faster, see teammates' auras, and survivors you unhook get a speed boost.");
  p("Plunderer's Instinct", "General", "items", "Shows the auras of nearby chests and dropped items, and improves the quality of what you pull out of chests.");
  p("Premonition", "General", "stealth", "Gives you an audible warning when you look in the direction of a nearby killer. Has a cooldown.");
  p("Resilience", "General", "gens healing chase", "While injured you repair, heal, vault, sabotage, cleanse and open gates slightly faster.");
  p("Slippery Meat", "General", "selfunhook", "Gives you extra attempts to escape the hook on your own, with better odds on each attempt.");
  p("Small Game", "General", "totems", "Alerts you when you are looking towards a nearby totem and keeps count of how many totems are left.");
  p("Spine Chill", "General", "stealth", "Lights up when the killer is nearby with a clear line of sight to you, and you act a little faster while it is lit.");
  p("This Is Not Happening", "General", "gens healing", "While injured, the great skill check zone is noticeably bigger for repairing, healing and sabotaging.");
  p("We'll Make It", "General", "healing altruism", "After you unhook someone, you heal other survivors much faster for a while.");
  p("Bound by Obsession", "General", "aura obsession gens", "Whenever the killer reads your aura you see theirs, and you repair, heal and cleanse a little faster while it lasts. As the obsession, your aura is shown to the killer every so often.");
  p("Down to the Last", "General", "endgame solo stealth", "Being hooked and repairing generators earn tokens that help teammates open the gates faster. As the last survivor with enough tokens, you can open the hatch without a key and your aura is hidden for a while.");
  p("Will to Live", "General", "antitunnel stun obsession", "For a while after being unhooked, if the killer grabs or picks you up you can hit a skill check to stab them, stunning them and breaking free. Once per trial, and you become the obsession.");

  // ---- Original survivors ----
  p("Bond", "Dwight Fairfield", "aura team solo", "Shows you the auras of teammates within a generous range.");
  p("Prove Thyself", "Dwight Fairfield", "gens team", "You and other survivors repair faster for each extra person working on generators near you.");
  p("Leader", "Dwight Fairfield", "team healing altruism", "Survivors near you heal, sabotage, unhook, cleanse and open gates faster. The effect lingers briefly when they leave.");
  p("Quick & Quiet", "Meg Thomas", "stealth chase lockers", "Your next rushed vault or locker entry makes no loud noise. Has a cooldown.");
  p("Sprint Burst", "Meg Thomas", "exhaustion chase haste", "When you start running you break into a short sprint. Causes Exhausted.");
  p("Adrenaline", "Meg Thomas", "endgame healing exhaustion haste", "When the exit gates are powered you instantly heal one health state and sprint for a few seconds.");
  p("Empathy", "Claudette Morel", "aura healing", "Shows the auras of injured and dying teammates across a large range.");
  p("Botany Knowledge", "Claudette Morel", "healing", "You heal considerably faster, at the cost of med-kits being less efficient.");
  p("Self-Care", "Claudette Morel", "selfheal healing", "Lets you heal yourself without a med-kit, at reduced speed.");
  p("Iron Will", "Jake Park", "stealth", "Greatly reduces your grunts of pain while injured. Does not work while Exhausted.");
  p("Calm Spirit", "Jake Park", "stealth totems", "You never startle crows and you hold back screams, but you open chests and work on totems more slowly.");
  p("Saboteur", "Jake Park", "sabotage altruism", "See hook auras whenever a survivor is being carried, and sabotage hooks without a toolbox. Has a cooldown.");
  p("Balanced Landing", "Nea Karlsson", "exhaustion chase stealth", "Falls are quieter and stagger you less, and landing from a height gives you a sprint. Causes Exhausted.");
  p("Urban Evasion", "Nea Karlsson", "stealth", "You move while crouched as fast as you walk.");
  p("Streetwise", "Nea Karlsson", "items team", "Items used by you and nearby teammates run down more slowly.");
  p("Sole Survivor", "Laurie Strode", "solo stealth endgame", "Each teammate who dies widens a zone in which the killer cannot read your aura. As the last one alive you repair and open the gate or hatch faster.");
  p("Object of Obsession", "Laurie Strode", "aura obsession", "Whenever the killer reads your aura, you see theirs too. As the obsession, you and the killer are revealed to each other periodically.");
  p("Decisive Strike", "Laurie Strode", "antitunnel stun obsession", "For a while after being unhooked, if the killer picks you up you can hit a skill check to stun them and break free.");
  p("Open-Handed", "Ace Visconti", "aura team", "Increases the range of every survivor's aura-reading abilities.");
  p("Up the Ante", "Ace Visconti", "selfunhook team", "Raises the luck of every survivor for each survivor still alive.");
  p("Ace in the Hole", "Ace Visconti", "items", "Items you pull from chests come with add-ons attached, and you keep your add-ons if you escape.");
  p("Left Behind", "Bill Overbeck", "endgame solo aura", "When you are the last survivor alive, you can see the hatch's aura from a distance.");
  p("Borrowed Time", "Bill Overbeck", "antitunnel altruism endurance", "Survivors you unhook keep their Endurance and speed boost for longer.");
  p("Unbreakable", "Bill Overbeck", "antislug", "You recover faster while dying, and once per trial you can fully pick yourself up.");
  p("Technician", "Feng Min", "gens stealth", "Your repair noises carry less far and failed skill checks don't cause an explosion, though they cost more progress.");
  p("Lithe", "Feng Min", "exhaustion chase haste", "A rushed vault sends you into a short sprint. Causes Exhausted.");
  p("Alert", "Feng Min", "aura chase", "The killer's aura is revealed to you whenever they break a pallet or wall, or damage a generator.");
  p("We're Gonna Live Forever", "David King", "altruism healing endurance antislug", "You heal dying survivors much faster, and altruistic plays let you grant Endurance to the next survivor you pick up.");
  p("Dead Hard", "David King", "exhaustion chase endurance antitunnel", "Activates after you are unhooked. While injured and running, press the ability button to shrug off a hit for a split second. Causes Exhausted.");
  p("No Mither", "David King", "antislug stealth", "You are injured for the whole trial, but you bleed and grunt less and can always pick yourself up from the dying state.");
  p("Wake Up!", "Quentin Smith", "endgame", "Once the gates are powered you see the gate switches from afar and open them faster.");
  p("Pharmacy", "Quentin Smith", "items selfheal healing", "You open chests faster and quieter, and are guaranteed an emergency med-kit when you search while injured.");
  p("Vigil", "Quentin Smith", "exhaustion team", "You and nearby teammates recover faster from Exhausted and several other negative status effects.");
  p("Tenacity", "Detective Tapp", "antislug stealth", "You crawl faster, can recover while crawling, and make less noise while dying.");
  p("Detective's Hunch", "Detective Tapp", "aura totems items", "Each time a generator is completed, you see the auras of generators, chests and totems near you.");
  p("Stake Out", "Detective Tapp", "gens", "Time spent near the killer without being chased earns tokens, each of which turns a good skill check into a great one.");
  p("Dance With Me", "Kate Denson", "stealth chase lockers", "You leave no scratch marks for a few seconds after a rushed vault or bursting out of a locker. Has a cooldown.");
  p("Windows of Opportunity", "Kate Denson", "chase aura", "Shows the auras of nearby pallets, breakable walls and windows.");
  p("Boil Over", "Kate Denson", "wiggle sabotage", "Your wiggling throws the killer around more, hides nearby hook auras from them, and drops from a height give you wiggle progress.");
  p("Diversion", "Adam Francis", "stealth", "After spending time near the killer unnoticed, throw a pebble that creates a loud noise and fake scratch marks elsewhere.");
  p("Deliverance", "Adam Francis", "selfunhook altruism", "After safely unhooking someone else, your own first self-unhook attempt is guaranteed to succeed. Leaves you Broken for a while.");
  p("Autodidact", "Adam Francis", "healing", "Your healing skill checks start out weak but each one you hit makes the following ones stronger.");
  p("Breakdown", "Jeff Johansen", "sabotage aura", "The hook you are rescued from breaks for a long time, and you see the killer's aura briefly.");
  p("Aftercare", "Jeff Johansen", "aura team altruism", "You and anyone you have rescued or healed (or who did the same for you) see each other's auras until you are next hooked.");
  p("Distortion", "Jeff Johansen", "stealth", "Tokens block the killer's attempts to read your aura and hide your scratch marks for a moment. Tokens come back during chases.");
  p("Solidarity", "Jane Romero", "selfheal healing altruism", "While you are injured, healing another survivor without a med-kit heals you too.");
  p("Poised", "Jane Romero", "stealth gens", "After a generator is completed you leave no scratch marks for several seconds.");
  p("Head On", "Jane Romero", "stun lockers exhaustion", "After a few seconds in a locker, burst out to stun a killer standing next to it. Causes Exhausted.");
  p("Flip-Flop", "Ash Williams", "wiggle antislug", "Part of your recovery progress while dying is converted into wiggle progress when the killer picks you up.");
  p("Buckle Up", "Ash Williams", "antislug altruism aura", "You can gauge how recovered dying survivors are, and picking one up reveals the killer's aura and helps you both get away.");
  p("Mettle of Man", "Ash Williams", "endurance altruism", "After taking enough protection hits you gain Endurance that absorbs one hit while injured, after which the killer can see your aura at range.");
  p("Better Together", "Nancy Wheeler", "gens aura team", "The generator you are repairing is shown to teammates, and when someone is downed you briefly see everyone's auras.");
  p("Fixated", "Nancy Wheeler", "stealth chase", "You walk faster and can see your own scratch marks.");
  p("Inner Strength", "Nancy Wheeler", "selfheal totems lockers", "After cleansing a totem, hiding in a locker for a few seconds heals you one health state.");
  p("Babysitter", "Steve Harrington", "altruism antitunnel aura", "Survivors you unhook leave no scratch marks or blood for a moment and get a speed boost, and you see the killer's aura briefly.");
  p("Camaraderie", "Steve Harrington", "team altruism", "During your second hook stage, a teammate coming close pauses your hook timer for a while.");
  p("Second Wind", "Steve Harrington", "selfheal healing", "After healing another survivor for a full health state, you automatically heal yourself a while after you are next unhooked.");
  p("Lucky Break", "Yui Kimura", "stealth chase", "While injured you leave no blood pools or scratch marks for a limited total time, which is topped up by healing others.");
  p("Any Means Necessary", "Yui Kimura", "chase aura", "You see the auras of dropped pallets and can stand them back up. Has a cooldown.");
  p("Breakout", "Yui Kimura", "wiggle sabotage altruism", "While you stay near a carried survivor you move faster and they wiggle free faster.");
  p("Off the Record", "Zarina Kassir", "antitunnel stealth endurance", "For a long while after being unhooked your aura is hidden, your grunts are silenced and you have Endurance, until you do something conspicuous.");
  p("Red Herring", "Zarina Kassir", "stealth lockers", "After repairing a generator for a few seconds, entering a locker triggers a loud noise at that generator.");
  p("For the People", "Zarina Kassir", "healing altruism", "Instantly heal another survivor one health state by giving up one of your own. You become Broken for a while.");
  p("Soul Guard", "Cheryl Mason", "antislug endurance", "You gain Endurance after getting up from the dying state, and if you are cursed by a hex you can pick yourself up.");
  p("Blood Pact", "Cheryl Mason", "obsession haste healing", "See the obsession's aura when either of you is injured. After one of you heals the other, you both move faster while close together.");
  p("Repressed Alliance", "Cheryl Mason", "gens", "After repairing for a while, you can block your generator so the killer cannot damage it for a short time.");
  p("Visionary", "Felix Richter", "gens aura", "Shows the auras of generators within range.");
  p("Desperate Measures", "Felix Richter", "healing altruism", "You heal and unhook faster for every injured, hooked or dying survivor.");
  p("Built to Last", "Felix Richter", "items", "A few times per trial, hiding in a locker with a depleted item refills a good share of its charges.");
  p("Appraisal", "Élodie Rakoto", "items", "Tokens let you rummage through already-opened chests for extra items, and you rummage faster.");
  p("Deception", "Élodie Rakoto", "stealth lockers", "Sprinting into a locker fakes an entry instead: it makes the noise, but you carry on running without scratch marks for a moment.");
  p("Power Struggle", "Élodie Rakoto", "wiggle stun", "While being carried, once you have wiggled far enough you can drop a nearby standing pallet to stun the killer and escape.");
  p("Fast Track", "Yun-Jin Lee", "gens", "Each time another survivor is hooked you bank tokens, which are spent as bonus progress on your next great repair skill check.");
  p("Smash Hit", "Yun-Jin Lee", "exhaustion stun chase", "Stunning the killer with a pallet sends you into a sprint. Causes Exhausted.");
  p("Self-Preservation", "Yun-Jin Lee", "stealth", "When a nearby teammate is hit, your scratch marks, blood and grunts are hidden for several seconds.");
  p("Counterforce", "Jill Valentine", "totems", "You cleanse totems faster, more so with each one, and every cleanse reveals the totem furthest from you.");
  p("Resurgence", "Jill Valentine", "healing selfheal", "You instantly gain a large chunk of healing progress when you are unhooked or unhook yourself.");
  p("Blast Mine", "Jill Valentine", "stun blind gens", "After repairing for a while, rig a generator with a trap that stuns and blinds the killer when they damage it.");
  p("Bite the Bullet", "Leon S. Kennedy", "stealth healing", "Healing makes no noise for you or your patient, and failed healing skill checks don't alert the killer.");
  p("Flashbang", "Leon S. Kennedy", "blind items lockers", "After enough repair progress, craft a flash grenade inside a locker that blinds and deafens anyone nearby.");
  p("Rookie Spirit", "Leon S. Kennedy", "gens aura", "After hitting a few good skill checks while repairing, you see the auras of regressing generators for the rest of the trial.");
  p("Clairvoyance", "Mikaela Reid", "aura totems endgame", "After cleansing or blessing a totem, hold the ability button empty-handed to see gate switches, generators, hooks, chests and the hatch.");
  p("Boon: Circle of Healing", "Mikaela Reid", "boon healing", "Bless a totem. Survivors inside its range heal each other much faster and see the auras of injured survivors.");
  p("Boon: Shadow Step", "Mikaela Reid", "boon stealth", "Bless a totem. Survivors inside its range have their auras and scratch marks hidden from the killer.");
  p("Overcome", "Jonah Vasquez", "exhaustion chase haste", "When you are injured, the speed boost from the hit lasts a couple of seconds longer. Causes Exhausted.");
  p("Corrective Action", "Jonah Vasquez", "gens team", "Tokens automatically turn a teammate's failed skill check into a good one while they work alongside you.");
  p("Boon: Exponential", "Jonah Vasquez", "boon antislug", "Bless a totem. Survivors inside its range recover faster and can pick themselves up from the dying state.");
  p("Parental Guidance", "Yoichi Asakawa", "stealth stun", "After stunning the killer by any means, your scratch marks, blood and grunts are hidden for several seconds.");
  p("Empathic Connection", "Yoichi Asakawa", "healing aura team", "Injured teammates can see your aura from afar, and you heal others faster.");
  p("Boon: Dark Theory", "Yoichi Asakawa", "boon haste chase", "Bless a totem. Survivors inside its range move slightly faster, lingering briefly after they leave.");
  p("Inner Focus", "Haddie Kaur", "aura chase", "You can see your own scratch marks, and the killer's aura is revealed when a nearby teammate loses a health state.");
  p("Residual Manifest", "Haddie Kaur", "blind items", "Blinding the killer leaves them with Blindness for a while, and you can rummage an opened chest once for a flashlight.");
  p("Overzealous", "Haddie Kaur", "gens totems", "After cleansing or blessing a totem you repair faster until you next lose a health state.");
  p("Wiretap", "Ada Wong", "gens aura", "After repairing for a while, bug a generator so the killer's aura is shown to everyone whenever they come near it.");
  p("Reactive Healing", "Ada Wong", "selfheal healing", "While you are injured, a nearby teammate losing a health state fills in part of your missing healing progress.");
  p("Low Profile", "Ada Wong", "solo stealth endgame", "When you become the last survivor standing, your scratch marks, blood and grunts are hidden for a long time.");
  p("Better Than New", "Rebecca Chambers", "healing team", "Survivors you finish healing work faster at healing, chests and totems until they next lose a health state.");
  p("Reassurance", "Rebecca Chambers", "altruism team solo", "Standing near a hooked survivor lets you pause their hook timer for a good while. Once per hook stage.");
  p("Hyperfocus", "Rebecca Chambers", "gens healing", "Each great skill check in a row makes the next ones faster, more frequent and worth more bonus progress.");
  p("Potential Energy", "Vittorio Toscano", "gens", "After repairing uninterrupted for a while, bank your repair work as tokens and unload them into a different generator later.");
  p("Fogwise", "Vittorio Toscano", "aura gens", "Hitting a great skill check while repairing reveals the killer's aura for a few seconds.");
  p("Quick Gambit", "Vittorio Toscano", "gens chase team", "While you are being chased near a generator, teammates working on it repair faster.");
  p("Cut Loose", "Thalita Lyra", "stealth chase", "After a rushed vault in a chase, your further rushed vaults are silent for a few seconds. Has a cooldown.");
  p("Friendly Competition", "Thalita Lyra", "gens team", "After finishing a generator alongside a teammate, you both repair faster for a while.");
  p("Teamwork: Power of Two", "Thalita Lyra", "team haste healing", "After you finish healing another survivor, you both move faster for as long as you stay close together.");
  p("Blood Rush", "Renato Lyra", "exhaustion chase", "When you are one hook from death, you can give up a health state once to instantly clear Exhausted, then heal back automatically after a delay.");
  p("Background Player", "Renato Lyra", "altruism sabotage blind exhaustion", "When the killer picks up another survivor, you break into a sprint for a few seconds. Causes Exhausted.");
  p("Teamwork: Collective Stealth", "Renato Lyra", "team stealth healing", "After another survivor finishes healing you, neither of you leaves scratch marks while you stay close together.");
  p("Troubleshooter", "Gabriel Soma", "aura chase gens", "While chased you see the aura of the generator with the most progress, and the killer's aura after you drop a pallet.");
  p("Made for This", "Gabriel Soma", "haste chase endurance", "You run slightly faster while suffering from Deep Wound, and gain brief Endurance after healing another survivor.");
  p("Scavenger", "Gabriel Soma", "items gens", "While holding an empty toolbox, great skill checks build tokens that fully recharge it, at the cost of repairing slower for a short time.");
  p("Dramaturgy", "Nicolas Cage", "haste chase exhaustion", "While healthy, run with high knees for a burst of speed followed by a random outcome: more speed, an item, being Exposed, or a scream.");
  p("Scene Partner", "Nicolas Cage", "aura", "Looking at the killer while inside their terror radius makes you scream, then reveals their aura for a few seconds.");
  p("Plot Twist", "Nicolas Cage", "selfheal stealth antislug", "While injured, silently drop into the dying state on purpose and then fully recover on your own. Recharges when the gates are powered.");
  p("Lucky Star", "Ellen Ripley", "stealth lockers aura", "Hiding in a locker stops your blood and grunts; when you step out you see teammates and the nearest generator for a moment.");
  p("Chemical Trap", "Ellen Ripley", "chase gens", "After repairing for a while, trap a dropped pallet so the killer is slowed when they break it.");
  p("Light-Footed", "Ellen Ripley", "stealth chase", "While healthy your running footsteps are silent. Goes on cooldown after a rushed action.");
  p("Champion of Light", "Alan Wake", "blind haste chase", "You move faster while shining a flashlight, and blinding the killer slows them for a few seconds.");
  p("Boon: Illumination", "Alan Wake", "boon aura totems items", "Bless a totem. Survivors inside its range see chests and generators highlighted, and you cleanse and bless faster.");
  p("Deadline", "Alan Wake", "gens healing", "While injured, skill checks appear more often and in random spots, with a smaller penalty for missing.");
  p("Invocation: Weaving Spiders", "Sable Ward", "basement gens team", "Complete a long ritual in the basement to permanently reduce the work needed on every remaining generator. You are Broken for the rest of the trial.");
  p("Strength in Shadows", "Sable Ward", "basement selfheal aura", "Heal yourself without a med-kit while in the basement, and see the killer's aura briefly when you finish.");
  p("Wicked", "Sable Ward", "basement selfunhook aura", "Your self-unhook attempts in the basement always succeed, and you see the killer's aura for a long time after any unhook.");
  p("Mirrored Illusion", "Aestri Yazar / Baermar Uraz", "stealth", "After enough repair progress, conjure a static illusion of yourself beside a totem, chest, generator or exit gate.");
  p("Bardic Inspiration", "Aestri Yazar / Baermar Uraz", "team gens healing", "Give a short performance and roll a d20: the roll decides how big a skill check bonus nearby survivors get.");
  p("Still Sight", "Aestri Yazar / Baermar Uraz", "aura", "Standing still for a few seconds reveals the killer, generators and chests near you until you move.");
  p("Finesse", "Lara Croft", "chase", "While healthy your fast vaults are quicker. Has a cooldown.");
  p("Hardened", "Lara Croft", "stealth aura items totems", "After opening a chest and cleansing or blessing a totem, anything that would make you scream reveals the killer's aura to you instead.");
  p("Specialist", "Lara Croft", "gens items", "Opening or rummaging chests earns tokens, which are spent on a great skill check to cut the work a generator still needs.");
  p("Eyes of Belmont", "Trevor Belmont", "aura", "The killer's aura is revealed briefly whenever a generator is completed, and all your killer aura reveals last longer.");
  p("Exultation", "Trevor Belmont", "stun items", "Stunning the killer with a pallet upgrades the rarity of the item you are holding and restores some charges. Has a cooldown.");
  p("Moment of Glory", "Trevor Belmont", "selfheal items", "After opening chests, the next time you are injured you become Broken and then automatically heal after a delay.");
  p("Invocation: Treacherous Crows", "Taurie Cain", "basement aura team", "Complete a ritual in the basement so that crows startled by the killer reveal their aura to everyone. You are Broken for the rest of the trial.");
  p("Clean Break", "Taurie Cain", "selfheal healing", "After healing someone else, you can choose to become Broken for a while and then be healed automatically, as long as you stay on your feet.");
  p("Shoulder the Burden", "Taurie Cain", "altruism antitunnel", "Once per trial, unhook a survivor and take one of their hook stages onto yourself. You scream and become Exposed for a moment.");
  p("Do No Harm", "Orela Rose", "healing altruism", "You heal other survivors faster, with a bigger bonus the more hook stages they have been through.");
  p("Duty of Care", "Orela Rose", "altruism team haste", "While healthy, taking a protection hit gives nearby teammates a burst of speed.");
  p("Rapid Response", "Orela Rose", "aura exhaustion lockers", "The killer's aura is revealed for a moment whenever you become Exhausted, and you can rush out of a locker to make yourself Exhausted on purpose.");

  // ---- Newer chapters ----
  p("Apocalyptic Ingenuity", "Rick Grimes", "chase items", "You see broken pallets nearby, and after searching a chest you can rebuild one as a fragile pallet that shatters when dropped.");
  p("Come and Get Me!", "Rick Grimes", "altruism stealth team", "After unhooking someone, crouch still and activate to hide the grunts, blood and scratch marks of injured and dying survivors near you. You scream and show the killer your aura.");
  p("Teamwork: Toughen Up", "Rick Grimes", "team stealth blind stun", "While injured, your grunts, blood and scratch marks are suppressed for a while when a nearby teammate blinds or pallet-stuns the killer.");
  p("Conviction", "Michonne Grimes", "antislug healing", "After healing another survivor, the next time you are dying you can get back on your feet once partly recovered. You are Broken and collapse again after a short time.");
  p("Last Stand", "Michonne Grimes", "stun chase", "After a long time near the killer without being chased, a rushed vault right next to them stuns them. Once per trial.");
  p("Teamwork: Throw Down", "Michonne Grimes", "team stun blind endurance", "Blinding or pallet-stunning the killer gives nearby injured teammates Endurance for several seconds.");
  p("Ghost Notes", "Vee Boonyasak", "exhaustion stealth chase", "While Exhausted, your scratch marks fade much faster and you recover from Exhausted a little quicker.");
  p("One-Two-Three-Four!", "Vee Boonyasak", "team gens healing", "Give a performance with a run of skill checks. Nearby survivors then get skill checks more often while healing and repairing for a while. Has a long cooldown.");
  p("Road Life", "Vee Boonyasak", "selfheal gens", "While injured, great repair skill checks earn tokens and failed ones lose them. With enough tokens you can heal yourself without a med-kit, slightly faster than normal.");
  p("Extrasensory Perception", "Eleven", "aura stealth", "Crouch for a few seconds to see survivors, the killer and most objects in a widening radius. You are harder to track but Oblivious while it lasts. Has a cooldown.");
  p("We See You", "Eleven", "aura team", "Earn a token each time the killer reveals your aura. At four tokens, the killer's aura is revealed to every survivor for several seconds.");
  p("Teamwork: Soft-Spoken", "Eleven", "team gens stealth", "Your generator's repair noise carries less far for each other survivor working on it with you, and you repair slightly faster with company.");
  p("Bada Bada Boom", "Dustin Henderson", "chase gens", "After enough repair progress, trap a window so the killer is heavily slowed when they vault through it.");
  p("Change of Plan", "Dustin Henderson", "items healing lockers", "Spend a token inside a locker to swap the toolbox you are holding for a med-kit of the same rarity.");
  p("Teamwork: Full Circuit", "Dustin Henderson", "team gens", "The good skill check zone grows for each other survivor repairing with you, and you repair slightly faster with company.");
  p("A Place For Us", "Kwon Tae-young", "healing stealth obsession", "Healing another survivor makes both of you harder to track, and it lasts a good while longer if you finish healing the obsession.");
  p("Five Moves Ahead", "Kwon Tae-young", "chase aura", "While chased or inside the terror radius you see the five nearest pallets, and you get moving again sooner after dropping one. Has a cooldown.");
  p("Flow State", "Kwon Tae-young", "healing altruism totems", "Each completed generator earns a token, and each token makes you heal, unhook and cleanse or bless totems faster.");
  p("Cross-Examination", "Shane Wiigwaas", "stealth", "While inside the terror radius and not being chased, you see a trail of marks the killer leaves behind. Standing on one makes you harder to track for a few seconds.");
  p("Lend a Hand", "Shane Wiigwaas", "healing totems team", "After cleansing or blessing a totem, once per teammate you can give the survivor you are healing a small permanent head start on their heals.");
  p("Wide Open Throttle", "Shane Wiigwaas", "chase haste", "Fast-vaulting a dropped pallet gives you a burst of speed and stands the pallet back up, though it is blocked for a minute. Has a cooldown.");
  p("Boon: Steadfast", "Aurora Stardotter", "boon gens aura", "Bless a totem. Generators inside its range regress more slowly and are repaired faster, and survivors in range can see them.");
  p("Fruits of Your Labor", "Aurora Stardotter", "gens selfheal haste", "Each completed generator earns a token. When you finish repairing one yourself, every token gives you a moment of speed and a chunk of healing progress.");
  p("Salvation's Cry", "Aurora Stardotter", "aura team chase", "When the killer starts chasing you, you briefly see your teammates, and teammates who aren't being chased see you and the killer for a few seconds.");
  p("Best Gift Ever", "Sienna Shaw", "items blind", "Spend a token the first time you drop each type of item to sacrifice it for a bonus that depends on the item, such as blinding the killer when you stun them.");
  p("Shared Trauma", "Sienna Shaw", "altruism exhaustion team", "Taking a protection hit lets you and nearby survivors recover from Exhausted even while running for a while. You also see the auras of Exhausted survivors.");
  p("Valkyrie's Rage", "Sienna Shaw", "stun chase", "After you have been chased for long enough, your next pallet stun lasts much longer.");

  window.DBD_PERKS = Object.assign(window.DBD_PERKS || {}, { survivor: list });
})();
