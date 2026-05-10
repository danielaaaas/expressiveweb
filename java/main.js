  // typewriter function for the notebook
    function typeWriter(text, elementId, speed = 30) {
        const el = document.getElementById(elementId);
        el.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(timer);
        }, speed);
    }

// room dictionary ( stores title and text for each room )
const rooms = {
    'master-bedroom': {
        title: 'master bedroom',
        text: 'the best hiding place from the dangers of the dark, where everyone packed together like sardines but love was always found here...even with an elbow in your face or a knee between your shoulder blades.'
    },

    'main-hallway': {
        title: 'main hallway',
        text: 'this hallway felt as much a room as anything else, where siblings at odds would use the air between them to pass messages back and forth.'
    },

    'bedroom-closet': {
        title: 'bedroom closet',
        text: 'the borderlands between one home and the next.'
    },

    'hallway-closet': {
        title: 'hallway closet',
        text: 'a place to leave your secrets...'
    },

    'bathroom': {
        title: 'bathroom',
        text: 'a place to leave a message or two...'
    },

    'living-room': {
        title: 'living room',
        text: 'this place was everything - a bedroom that looked like a creatures maw when the lights were off, where parties were thrown, dinners eaten, clothes dried, ideas blossomed.'
    },

    'kitchen': {
        title: 'kitchen',
        text: 'where meals were made and the scent of a home once left behind forever lingered in the air.'
    },

    'front-closet': {
        title: 'front closet',
        text: 'a vaccuum of things lost, where memory has splotches of darkness like lacunae...'
    },

    'front-hallway': {
        title: 'front hallway',
        text: 'another place that seemed like its own room, where kids hung out and wrote on the door painted in chalkboard grey, played games, existed as though the world itself was not right outside their canvas for imagination.'
    }
};

const roomItems = {
    'master-bedroom:journal': {
        title: 'journal',
        text: 'the first scratched notes and tiny drawings lived here, folded in corners where only familiar hands would look.'
    },
    'main-hallway:radio': {
        title: 'radio',
        text: 'it hummed between stations all afternoon, catching songs halfway through and somehow still feeling complete.'
    },
    'kitchen:mug': {
        title: 'mug',
        text: 'tea stains and chipped enamel; proof that comfort can survive even when everything else changes shape.'
    },
    'living-room:lamp': {
        title: 'lamp',
        text: 'it kept one small circle of warmth alive late at night, when conversations got quiet and real.'
    }
};

const bathroomHotspotEntries = {
    'hit-sink': {
        title: 'sink',
        text: 'the sink remembers hurried mornings, soap bubbles, and those rare quiet minutes alone.'
    },
    'hit-tub': {
        title: 'tub',
        text: 'the tub held long exhale moments, where steam turned the room soft and time slowed down.'
    },
    'hit-toilet': {
        title: 'toilet',
        text: 'one of those ordinary anchors of home life; not glamorous, but always part of the daily rhythm.'
    },
    'hit-cabinet': {
        title: 'cabinet',
        text: 'medicine, hair ties, and half-forgotten things lived behind this little door for years.'
    }
};

const visited = {};

/** Master bedroom memory vignette (apartment one): hover tips + window cycles SVG layers */
const bedroomMemoryHoverTips = {
    'hit-fan': 'the blades counted summer nights in slow arcs; sleep arrived easier when something else kept moving.',
    'hit-clock': 'numbers jumped when no one was watching — wrong time, right mood.',
    'hit-water': 'condensation drew thin roads on the glass; the room pretended it wasn\'t thirsty.',
    'hit-tv': 'blue light pooled on the wall like a second sky, half-heard voices stitching stories together.',
    'hit-window': 'click: let the outside forget which version it was supposed to be.'
};

let bedroomOutsideSceneIndex = 0;
let bedroomClockIntervalId = null;
let bedroomFanCtx = null;
let bedroomFanOsc = null;

/** Main hallway memory vignette (apartment one): hover tips, photo cycle on revisit, ghost frame, ambient hum */
const hallwayMemoryHoverTips = {
    'hit-frame-a': 'a half-remembered group photo. faces shift between visits.',
    'hit-frame-b': 'someone watching back from behind the glass.',
    'hit-frame-c': 'a horizon you almost recognize. one bird, always.',
    'hit-frame-d': 'this one always hangs crooked. no one straightens it anymore.',
    'hit-frame-e': 'two siblings, mid-blink, mid-secret.',
    'hit-frame-f': 'a small landscape that smells like late summer.',
    'hit-shelf': 'a vase, a candle, a folded note no one reads.',
    'hit-paint': 'the paint curls up like an old envelope.',
    'hit-empty': 'click: read what was left behind the frames.'
};

/** Click → memory scene/dialogue. Surfaces a brief fragment in the tip line. */
const hallwayMemoryClickFragments = {
    'hit-frame-a': 'we crowded together for that one. someone\'s eyes were closed. nobody asked who.',
    'hit-frame-b': 'she was practicing the look she\'d use later, in every other photograph.',
    'hit-frame-c': 'we were promised the trip the year after. the bird stayed.',
    'hit-frame-d': 'they argued the whole afternoon. the table is still set in the photo.',
    'hit-frame-e': 'they had a code only the two of them knew. the wall remembers it humming.',
    'hit-frame-f': 'someone said: this is where we were happiest. nobody disagreed.'
};

/** Hidden messages found behind the frames (ghost-frame click). Cycled. */
const hallwayHiddenMessages = [
    'behind the frames: a name written in pencil, scratched out, written again.',
    'behind the frames: a phone number with no area code and no one to call.',
    'behind the frames: a small drawing of the apartment, with one room missing.'
];
let hallwayHiddenMessageIndex = 0;

const HALLWAY_PHOTO_VARIANTS = ['photo-a-1', 'photo-a-2', 'photo-a-3'];
const HALLWAY_VISIT_KEY = 'hallway-memory-visits-v1';
let hallwayHumCtx = null;
let hallwayHumOsc = null;
let hallwayShadowDriftId = null;

/** Kitchen memory vignette (apartment one): hover tips + click memories for food, magnets, notes */
const kitchenMemoryHoverTips = {
    'hit-butter-tub': 'the butter tub never had butter inside. always beans.',
    'hit-pasta': 'leftover pasta that somehow tasted better at midnight.',
    'hit-foil': 'a foil-wrapped bowl. nobody remembers what it was.',
    'hit-yogurt': 'a yogurt cup that has been here too long.',
    'hit-pickles': 'the pickles outlived everyone\'s patience.',
    'hit-time-item': 'this shelf rearranges itself depending on the hour.',
    'hit-condiments': 'the sauces stayed put. the labels did not.',
    'hit-milk-bin': 'milk, jam, juice. the holy trinity of breakfast leftovers.',
    'hit-mystery-bin': 'a softening stick of butter. a tupperware nobody opened.',
    'hit-soda': 'flat by morning, opened anyway.',
    'hit-stack': 'mismatched lids on mismatched bottoms. a household law.',
    'hit-eggs': 'six eggs. always six. never seven, never five.',
    'hit-cheese': 'a wedge of cheese in waxed paper. older than it should be.',
    'hit-crisper': 'the crisper drawer: where vegetables went to think.',
    'hit-fog': 'click: let the cold fog say something.',
    'hit-magnet-heart': 'someone bought this magnet at a gas station. it stuck.',
    'hit-magnet-star': 'a star for a fridge that was a sky.',
    'hit-note-1': 'a grocery list from a week that already happened.',
    'hit-magnet-photo': 'a photo magnet of three small people, frozen mid-laugh.',
    'hit-magnet-pizza': 'a pizza shop that closed years ago. the number still works.',
    'hit-note-drawing': 'a child\'s drawing. a smile, a sun, a small red heart.',
    'hit-clip': 'a green clip holding a note no one reads anymore.',
    'hit-receipt': 'a receipt for one large coffee and three pastries. a good day.',
    'hit-impossible': 'a small cold moon, hovering. probably nothing.',
    'hit-moka': 'the moka pot, sighing softly to itself on the counter.',
    'hit-mug': 'a small ceramic mug, chipped on the rim. somebody\'s favourite.',
    'hit-counter': 'the counter where everything got placed and forgotten.'
};

/** Click → memory fragment surfaced in the HUD tip line. */
const kitchenMemoryClickFragments = {
    'hit-butter-tub': 'every household had one: a butter tub with beans, a cookie tin with sewing thread. proof of trust between hands.',
    'hit-pasta': 'tuesday\'s pasta. eaten cold over the sink, standing up, by someone who could not sleep.',
    'hit-foil': 'they always wrapped it before anyone could ask what it was. that was the point.',
    'hit-yogurt': 'she promised she would eat it tomorrow. tomorrow kept arriving.',
    'hit-pickles': 'the jar opened with a small breath, like the room was relieved.',
    'hit-time-item': 'whatever was on this shelf, you ate. that was the rule.',
    'hit-condiments': 'every bottle had a small dried halo around the cap. a tiny calendar of meals.',
    'hit-milk-bin': 'the milk carton was reused for a hundred things. a measuring cup, a flowerpot, a confession.',
    'hit-mystery-bin': 'this bin held the things you did not want to throw away yet.',
    'hit-soda': 'someone drank from the bottle. someone always did.',
    'hit-stack': 'no lid ever fit. somehow they were stacked perfectly anyway.',
    'hit-eggs': 'always six. they came in, they came out, the count never changed.',
    'hit-cheese': 'the wedge that survived three holidays. a quiet hero.',
    'hit-crisper': 'inside, an onion sprouting green. nobody had the heart to throw it.',
    'hit-moka': 'the moka pot lived its whole life on this counter. coffee at six in the morning, again at midnight, again whenever someone needed an excuse to keep talking.',
    'hit-mug': 'the chip on the rim came from a fall nobody confessed to. it kept being everyone\'s favourite anyway.',
    'hit-counter': 'this corner of counter saw every cup, every grocery bag, every half-finished argument. it remembers nothing and everything.'
};

/** Magnet/note clicks reveal hidden dialogue snippets. */
const kitchenMagnetDialogue = {
    'hit-magnet-heart': '"i love you" — written in marker, faded into the magnet itself.',
    'hit-magnet-star': '"wish on it" — and you did, didn\'t you.',
    'hit-note-1': 'eggs / milk / forget the rest. (it was always forget the rest.)',
    'hit-magnet-photo': '"come back when the light is the same" — written on the back, never read by the people in the photo.',
    'hit-magnet-pizza': '"call when you get there." nobody ever did, and somehow nobody minded.',
    'hit-note-drawing': '"for mama, from the smallest one." stuck up here forever.',
    'hit-clip': 'a phone number. half-erased. you almost remember the area code.',
    'hit-receipt': 'on the back, in pencil: "this was a good morning. remember it."'
};

/** Cold fog hidden text fragments cycled on click. */
const kitchenFogMessages = [
    'cold fog clears: "stay a while."',
    'cold fog clears: "everyone ate. that was the point."',
    'cold fog clears: "leave the light on for whoever is still awake."'
];
let kitchenFogIndex = 0;

const KITCHEN_TIME_VARIANTS = ['time-morning', 'time-afternoon', 'time-evening', 'time-night'];
let kitchenHumCtx = null;
let kitchenHumOsc = null;

/** Living room memory vignette (apartment one): TV channels, cabinet objects, bunk-bed corner, couch edge */
const livingroomMemoryHoverTips = {
    'hit-tv': 'click: change the channel. some of them broadcast things that never happened.',
    'hit-tv-knobs': 'channels turned with a thunk that everyone in the house could hear.',
    'hit-tv-grille': 'the speaker carried voices that sometimes weren\'t on tv at all.',
    'hit-antenna': 'rabbit ears, angled by hand into shapes only one person remembered.',
    'hit-remote': 'the remote with a missing battery cover. it still worked.',
    'hit-doily': 'the lace doily, ironed flat, replaced every spring.',
    'hit-figurine-1': 'a porcelain ballerina, mid-spin, mid-listening.',
    'hit-photo-1': 'a small framed photo. nobody in it lives here anymore.',
    'hit-figurine-2': 'a ceramic bird that one of the kids almost broke twice.',
    'hit-candle': 'a candle lit only on certain nights, for reasons never explained.',
    'hit-books': 'paperbacks no one finished. spines split open on a single page each.',
    'hit-photo-2': 'the family photo. the one everyone says they hate. the one nobody throws out.',
    'hit-clock': 'a clock that gained two minutes a week. nobody adjusted it.',
    'hit-vase': 'a vase with a single dried flower. the water hasn\'t been changed in months.',
    'hit-trinket': 'a small wooden box with a key on top. the key fits nothing visible.',
    'hit-photo-3': 'a photograph laid down flat, like the room is letting it rest.',
    'hit-cabinet': 'the display cabinet. everything important got placed here, then forgotten.',
    'hit-bunk-top': 'the top bunk. higher up than seemed possible at the time.',
    'hit-bunk-blanket-top': 'the teal blanket. crocheted by someone who would not say by whom.',
    'hit-bunk-bottom': 'the bottom bunk. sometimes you slept here when you were too tired to climb.',
    'hit-bunk-blanket-bottom': 'the rose blanket. it always smelled like the room itself.',
    'hit-ladder': 'the ladder. five rungs, climbed and re-climbed.',
    'hit-bunk-star': 'a glow-in-the-dark star. it remembers being charged by a lamp, once.',
    'hit-couch': 'the corner of the couch. a thousand small ceremonies happened here.'
};

/** Click on cabinet objects, bunk parts, etc. surfaces a small story in the HUD line. */
const livingroomMemoryClickFragments = {
    'hit-tv-knobs': 'four channels. five if the antenna was held just so. six on a good night.',
    'hit-tv-grille': 'the news at six. the cartoons. the static between. all of it became one song.',
    'hit-antenna': 'someone always had to stand and hold the antenna for somebody else to see clearly.',
    'hit-remote': 'the remote was lost so often it had a system: under the cushion, under the cushion, under the cushion, on top of the tv.',
    'hit-doily': 'the lace was older than anyone in the room. it would outlive most of them too.',
    'hit-figurine-1': 'she danced for years on the same square inch. nobody ever wound her up.',
    'hit-photo-1': 'this is the photo nobody admits to having taken.',
    'hit-figurine-2': 'the bird was a gift. nobody remembers from whom. everyone remembers it landing here.',
    'hit-candle': 'the candle was lit when somebody needed it. the room understood without asking.',
    'hit-books': 'the books were borrowed. the books were never returned. the books are at home.',
    'hit-photo-2': 'in the photo, everybody is looking somewhere else. it is still the best one.',
    'hit-clock': 'the clock\'s two extra minutes a week meant by spring it was already in summer.',
    'hit-vase': 'the flower kept its colour for a strange amount of time. nobody mentioned it.',
    'hit-trinket': 'the box held nothing important and that was the whole point.',
    'hit-photo-3': 'someone laid it down so they wouldn\'t have to look. then forgot they had.',
    'hit-cabinet': 'the cabinet was the room\'s memory. everything proven, sealed behind glass.',
    'hit-bunk-top': 'whispering down through the slats. the slats remembering everything they heard.',
    'hit-bunk-blanket-top': 'on summer nights it was kicked all the way to the foot. on winter nights it was not enough.',
    'hit-bunk-bottom': 'the bottom bunk slept three when it had to. nobody remembers how.',
    'hit-bunk-blanket-bottom': 'the rose blanket went through two washes a month and never quite faded.',
    'hit-ladder': 'someone always slipped on the third rung. it kept being the third rung.',
    'hit-bunk-star': 'the star\'s glow was always brightest the first ten seconds. then again at three a.m. when nobody was watching.',
    'hit-couch': 'the corner of the couch was claimed and re-claimed. the cushion remembers everyone who won.'
};

/** Bathroom memory vignette (apartment one): mirror + sink + Dominican products */
const bathroomMemoryHoverTips = {
    'hit-mirror': 'the mirror. fogged. it remembers everything that has ever stood in front of it. the foggy patches can be wiped.',
    'hit-cabinet': 'the medicine cabinet edge. the hinges squeak in a rhythm you remember in your bones.',
    'hit-fixture': 'the vanity light. one bulb has always been a little dimmer than the others.',
    'hit-counter': 'the counter. cool marble. it has a small ring where every glass has ever sat.',
    'hit-faucet': 'the faucet. it drips at exactly the rhythm somebody once sang along to.',
    'hit-sink': 'the sink. cold porcelain. somebody small used to need a stool to reach it.',
    'hit-toothbrush-cup': 'the cup. mint ceramic. four toothbrushes, three people, nobody asks whose is whose.',
    'hit-vick': 'vick vaporub. the smell of being fussed over. of a hand on a forehead. of okay, okay.',
    'hit-crece-pelo': 'crece pelo. a green jar that has always been there. the smell of clean, brushed, shiny hair.',
    'hit-hair-oil': 'aceite de coco. warmed in palms. combed through. the smell of sunday afternoon hair.',
    'hit-agua-violetas': 'agua de violetas. the purple bottle. the smell of being a baby and being very loved.',
    'hit-mantequilla': 'mantequilla de cacao. for chapped lips. for any small unhappiness, really.',
    'hit-soap': 'the soap dispenser. peach-pink, half full, the pump always a little sticky.',
    'hit-towel': 'the pink towel. always slightly damp. always slightly warm. always at hand.',
    'hit-wipe-1': 'a foggy patch with something written behind it.',
    'hit-wipe-2': 'a foggy patch with something written behind it.',
    'hit-wipe-3': 'a foggy patch with something written behind it.'
};

const bathroomMemoryClickFragments = {
    'hit-mirror': 'you press a fingertip to the cool glass. somebody else, a long time ago, pressed theirs to the same spot.',
    'hit-cabinet': 'the cabinet swings open a half-inch. you see: a thermometer, a half-used inhaler, three expired prescriptions, a single hairpin.',
    'hit-fixture': 'one bulb flickers. for half a second the bathroom is a different color of warm.',
    'hit-counter': 'a faint ring on the marble. somebody set a coffee mug here once and walked away forever.',
    'hit-faucet': 'you turn it. the water comes out cold first, then warm, the way it always has.',
    'hit-sink': 'somebody small once dropped a tooth in here. somebody bigger fished it out.',
    'hit-toothbrush-cup': 'you pick up the blue one. it is somebody else\'s. you put it back exactly where it was.',
    'hit-vick': 'you unscrew the lid. eucalyptus and menthol. you are seven years old and you can\'t breathe and someone is rubbing your chest.',
    'hit-crece-pelo': 'you scoop a little. it smells like sunday. somebody braiding. somebody\'s hands on your scalp. you are very small and very still.',
    'hit-hair-oil': 'a single drop on your finger. it smells like every summer you ever had.',
    'hit-agua-violetas': 'you tip the bottle. one drop on your wrist. you are a baby. somebody is holding you. somebody is whispering.',
    'hit-mantequilla': 'you uncap it. a thin sweet smell. somebody dabbing it on your lips before bed.',
    'hit-soap': 'one pump. a small pink ribbon of soap. the smell of every washed hand in this house.',
    'hit-towel': 'you press your face into it. it smells like home. you don\'t know what home smells like anywhere else.'
};

// What's hidden behind each foggy wipe patch
const BATHROOM_WIPE_REVEALS = {
    'hit-wipe-1': 'you wipe a patch clear with the side of your hand. underneath: te quiero, written in someone\'s finger from a long time ago.',
    'hit-wipe-2': 'you wipe. a phone number with one digit smeared. you almost remember whose it was.',
    'hit-wipe-3': 'you wipe. the word "vuelve." you don\'t know who wrote it or who it was for.'
};

const BATHROOM_WIPE_STEAM_BACK_MS = 6500;

let bathroomHumCtx = null;
let bathroomHumOsc = null;
let bathroomDripTimer = null;
const bathroomWipeTimers = {};

/** Front closet memory vignette (apartment one): the utility closet — shelves of household archaeology */
const frontclosetMemoryHoverTips = {
    'hit-grocery-bags': 'a bundle of reused grocery bags. crinkled, perpetually multiplying, never thrown out.',
    'hit-bin-top': 'the cardboard bin on the top shelf. its label changes depending on who last labeled it.',
    'hit-shoeboxes-top': 'two shoeboxes nobody quite remembers buying shoes for.',
    'hit-seasonal': 'string lights and an ornament box. retired in january, exhumed in december.',
    'hit-cleaners': 'three spray bottles in a polite row. one of them is older than you.',
    'hit-towels': 'a stack of towels in colors that haven\'t been sold in decades.',
    'hit-cans': 'canned food. some of these dates would alarm you. nobody checks the dates.',
    'hit-radio': 'an old beige radio. the dial is still warm from a station that doesn\'t exist anymore.',
    'hit-tapes': 'a stack of cassette tapes. the labels are in handwriting you almost recognize.',
    'hit-rotary-phone': 'a beige rotary phone. it doesn\'t plug into anything in this house.',
    'hit-phantom': 'something on the third shelf. you can\'t quite remember what was here last time.',
    'hit-magazines': 'a leaning stack of old magazines. the cover stories are all about the future.',
    'hit-jar': 'a jar of buttons and screws and small unidentifiable hardware. saved for what.',
    'hit-detergent': 'a half-full jug of detergent in a discontinued color.',
    'hit-bucket': 'the yellow bucket. used once a year, exactly, and put back wet exactly once.',
    'hit-vacuum': 'a beige canister vacuum. the kind with a hose that escapes its clip.',
    'hit-broom': 'a broom and a dustpan. the broom is older than the dustpan by about a decade.',
    'hit-clear-bins': 'two stacked plastic bins. the top one is labeled HOLIDAY. the bottom one isn\'t labeled.',
    'hit-paper-bags': 'a stack of folded paper bags. the kind kept "in case." in case has not yet arrived.',
    'hit-electronics-box': 'an ELECTRA box. it has been moved every move and never opened.',
    'hit-boots': 'two boots that don\'t quite match anymore but used to.',
    'hit-floor-bin': 'the KEEPSAKES bin. heavier than it looks. nobody opens it. nobody throws it out.',
    'hit-deeper': 'the dark behind the shelves. it goes back further than the wall should allow.'
};

const frontclosetMemoryClickFragments = {
    'hit-grocery-bags': 'crinkle. they expand the second you touch them, like they were waiting.',
    'hit-bin-top': 'you lift the lid a little. the things inside have rearranged themselves since last time.',
    'hit-shoeboxes-top': 'inside the top one: receipts, a key for a lock that is no longer in the apartment.',
    'hit-seasonal': 'one of the bulbs flickers warm for a second, even though nothing is plugged in.',
    'hit-cleaners': 'the green one still says "new formula!" — the formula is forty years old now.',
    'hit-towels': 'the cream one was a wedding gift. nobody remembers whose wedding.',
    'hit-cans': 'a can of something that no longer exists. the company stopped making it the year you were born.',
    'hit-radio': 'you turn the dial. for half a second you hear a voice you used to know.',
    'hit-tapes': 'side B of the top one is labeled "for sunday mornings." you don\'t own a tape player anymore.',
    'hit-rotary-phone': 'the receiver is warm. the dial spins back on its own.',
    'hit-phantom': 'whatever was here before, this isn\'t it. it was the right shape for a while, though.',
    'hit-magazines': 'the cover story: "the apartment of the future." the apartment of the future looks like this one.',
    'hit-jar': 'one button is missing from the shirt you remember. it might be in here. you don\'t check.',
    'hit-detergent': 'the cap is sticky. you can almost smell the brand of laundry from a different decade.',
    'hit-bucket': 'inside the bucket: a sponge that has been dry for so long it remembers being a sponge.',
    'hit-vacuum': 'you press the foot switch. it makes the small wounded sound of an old motor agreeing.',
    'hit-broom': 'the bristles still hold one strand of long hair. nobody in this apartment has long hair.',
    'hit-clear-bins': 'through the cloudy plastic: tinsel, baubles, a velvet santa whose face has gone grey.',
    'hit-paper-bags': 'between two bags: a grocery list in handwriting you don\'t recognize. the items add up to a meal.',
    'hit-electronics-box': 'you give it a small shake. something inside shifts. it has been shifting for years.',
    'hit-boots': 'inside the left boot: a folded receipt for a pair of laces. the laces are still in the boot.',
    'hit-floor-bin': 'KEEPSAKES: the lid lifts a half-inch and you decide, again, not to look further.',
    'hit-deeper': 'you lean in. somewhere further back you can almost hear two people having a quiet, ordinary conversation.'
};

// rotating label on the top cardboard bin — different word every visit
const FRONTCLOSET_BIN_VARIANTS = ['fc-bin-top-label-a', 'fc-bin-top-label-b', 'fc-bin-top-label-c', 'fc-bin-top-label-d'];
const FRONTCLOSET_BIN_TIPS = [
    'the TAXES bin. the dates on the folders inside go back further than the apartment.',
    'the PHOTOS bin. all corners worn soft from being lifted down and put back up.',
    'the BABY bin. it is heavier than a baby was. it always has been.',
    'the bin labeled "??". even the label is uncertain. the contents stayed.'
];

// phantom item on shelf 3 rotates between three things and the hover tip changes accordingly
const FRONTCLOSET_PHANTOM_VARIANTS = ['fc-phantom-a', 'fc-phantom-b', 'fc-phantom-c'];
const FRONTCLOSET_PHANTOM_TIPS = [
    'a red toolbox. the latch is bent in the same place it was bent when it arrived in this apartment.',
    'a floral sewing kit. small needles, mismatched thread, a thimble worn shiny.',
    'a blue cookie tin. it has held cookies exactly once. it holds buttons now. or it holds nothing.'
];
const FRONTCLOSET_PHANTOM_CLICKS = [
    'inside: a wrench, a few mixed screws, the small handle of something that broke years ago.',
    'inside: a folded square of fabric somebody was going to mend. they never did.',
    'inside: a single ribbon. nothing else. you remember it being heavier.'
];

// "deeper" voice fragments — random one each time you click into the dark
const FRONTCLOSET_DEEPER_VOICES = [
    'somewhere in the dark you almost hear: "...not the blue one, the other one..."',
    'somewhere further back, somebody laughs, very softly. it stops as soon as you listen for it.',
    'the dark answers in your own voice, from a long time ago. you can\'t make out the words.',
    'two people are talking about dinner. you can hear the cadence but not the meal.'
];

const FRONTCLOSET_VISIT_KEY = 'frontcloset.visitCount';
let frontclosetHumCtx = null;
let frontclosetHumOsc = null;
let frontclosetCreakTimer = null;

/** Hallway closet memory vignette (apartment one): hanging clothes, shelf, shoe boxes, storage bin */
const hallwayclosetMemoryHoverTips = {
    'hit-bulb': 'a single warm bulb. it remembers being pulled on by a string that was always slightly too short.',
    'hit-shelf': 'the top shelf. nobody could reach the back of it without standing on something.',
    'hit-hatbox': 'red hat box. it always smelled faintly of old velvet and pencil shavings.',
    'hit-blankets': 'folded blankets. wool, cotton, and one knitted by hand. each one holds a different winter.',
    'hit-bin-top': 'the WINTER bin. mittens, scarves, the sweater that never fit anybody quite right.',
    'hit-basket': 'the basket of in-between things: gloves, scarves, half a pair of earmuffs.',
    'hit-rod': 'the closet rod. it sagged a little in the middle, every year a little more.',
    'hit-garment-1': 'the floral blouse. faded perfume, sun-warmed cotton, a hint of someone else\'s laundry soap.',
    'hit-garment-2': 'the long wool coat. smells of cold air, mothballs, and the lining of pockets.',
    'hit-garment-3': 'the denim jacket. sun-bleached at the shoulders. cigarette smoke nobody admits to.',
    'hit-garment-4': 'a dress that changes every time you remember it. tonight it smells like this.',
    'hit-garment-5': 'a small striped shirt. baby shampoo and milk and soft afternoon light.',
    'hit-garment-6': 'cream cable-knit sweater. lanolin, cedar, the back of a closet for years.',
    'hit-back-depth': 'the back of the closet. it goes further back than it should. it always has.',
    'hit-shoeboxes': 'three shoe boxes, stacked askew. nobody owns the shoes inside.',
    'hit-floor-shoes': 'a small pair of shoes pushed behind everything. somebody hid them on purpose.',
    'hit-bin-floor': 'the KEEPSAKES bin. heavier than it looks. nobody opens it. nobody throws it out.'
};

const hallwayclosetMemoryClickFragments = {
    'hit-bulb': 'pull-string light. on, off, on, off. the click was its own small ritual.',
    'hit-shelf': 'on top: things that mattered enough to keep but not enough to use.',
    'hit-hatbox': 'inside: a stack of postcards, two birthday candles, and a single dried flower.',
    'hit-blankets': 'tucked between the cream and the teal: a folded note in handwriting nobody recognizes.',
    'hit-bin-top': 'opened it once a year, in october. closed it again in march.',
    'hit-basket': 'one glove always missing. the other glove always patient.',
    'hit-rod': 'the rod knew the weight of every season. it carried them all without complaint.',
    'hit-garment-1': 'pocket: a movie ticket stub, soft at the edges, the title worn off.',
    'hit-garment-2': 'pocket: a bus token, a folded receipt, a single peppermint still in its wrapper.',
    'hit-garment-3': 'pocket: a guitar pick. the band on the radio that summer. you remember.',
    'hit-garment-4': 'this dress was worn to one specific evening and never quite returned to ordinary life.',
    'hit-garment-5': 'this shirt fit somebody for exactly one summer. then it fit nobody. then it stayed.',
    'hit-garment-6': 'pocket: a small smooth stone, picked up on a walk that nobody else remembers.',
    'hit-back-depth': 'you reach in. your hand keeps going. the wall is further than the closet should be.',
    'hit-shoeboxes': 'PHOTOS: a stack of polaroids, mostly of feet, mostly of grass, mostly of light.',
    'hit-floor-shoes': 'they belonged to somebody who outgrew them in a single season. they fit nobody now.',
    'hit-bin-floor': 'KEEPSAKES: ribbons, ticket stubs, a single broken sunglass arm, three letters never sent.'
};

// Each of the 6 garment slots rotates through its own variants on every visit.
// `offset` per garment makes each cycle land on a different combination, so
// "different years coexist" is literally what surfaces every time you reopen.
const HALLWAYCLOSET_GARMENT_CONFIG = [
    {
        hotspotId: 'hit-garment-1',
        offset: 0,
        variants: ['hc-outfit-1a', 'hc-outfit-1b', 'hc-outfit-1c'],
        tips: [
            'floral cream blouse. faded perfume, sun-warmed cotton, somebody else\'s laundry soap.',
            'pale yellow blouse, thin stripes. lemon soap and a slow afternoon.',
            'powder blue button-down. small brass buttons, the smell of an iron just put down.'
        ]
    },
    {
        hotspotId: 'hit-garment-2',
        offset: 1,
        variants: ['hc-outfit-2a', 'hc-outfit-2b', 'hc-outfit-2c'],
        tips: [
            'long dark wool coat. cold air, mothballs, the lining of pockets.',
            'navy peacoat. wool, salt, the back of a closet by the sea.',
            'olive trench with a belt. dust, summer rain, a crumpled bus ticket in the loop.'
        ]
    },
    {
        hotspotId: 'hit-garment-3',
        offset: 2,
        variants: ['hc-outfit-3a', 'hc-outfit-3b', 'hc-outfit-3c'],
        tips: [
            'faded denim jacket. sun-bleached at the shoulders. cigarette smoke nobody admits to.',
            'black leather jacket. cold zipper, motor oil, an evening that ended too late.',
            'tan corduroy jacket. autumn leaves, library paste, a teacher\'s perfume.'
        ]
    },
    {
        hotspotId: 'hit-garment-4',
        offset: 3,
        variants: ['hc-outfit-4a', 'hc-outfit-4b', 'hc-outfit-4c', 'hc-outfit-4d'],
        tips: [
            'a long maroon dress. heavy. dignified. quiet.',
            'a pale slip dress. cool linen, end-of-summer.',
            'small denim overalls. somebody\'s six-year-old self, hung in front of you.',
            'a forest-green velvet dress. the kind worn in december, once.'
        ]
    },
    {
        hotspotId: 'hit-garment-5',
        offset: 4,
        variants: ['hc-outfit-5a', 'hc-outfit-5b', 'hc-outfit-5c'],
        tips: [
            'a small striped shirt. baby shampoo and milk and soft afternoon light.',
            'a school polo. chalk dust, eraser shavings, a snack-time orange.',
            'pink flannel pajamas with little stars. soap, sleep, the smell of being clean.'
        ]
    },
    {
        hotspotId: 'hit-garment-6',
        offset: 5,
        variants: ['hc-outfit-6a', 'hc-outfit-6b', 'hc-outfit-6c'],
        tips: [
            'cream cable-knit sweater. lanolin, cedar, the back of a closet for years.',
            'red holiday sweater. pine needles, sugar cookies, candle wax.',
            'olive striped sweatshirt. grass stains, gym chalk, a long-ago p.e. class.'
        ]
    }
];
const HALLWAYCLOSET_VISIT_KEY = 'hallwaycloset.visitCount';
let hallwayclosetHumCtx = null;
let hallwayclosetHumOsc = null;

/** Front hallway memory vignette (apartment one): the front door, threshold, keys, coat, shoes */
const fronthallwayMemoryHoverTips = {
    'hit-door': 'the front door, from the inside. thicker than it ever actually was.',
    'hit-peephole': 'click: lean in and look through. the building hallway outside is never quite the same.',
    'hit-chain': 'the chain lock. small, brass-bright, slid into place on certain nights.',
    'hit-knob': 'the doorknob. cold first. then warm in the palm.',
    'hit-kickplate': 'the kick plate. a thousand small shoes scuffed it.',
    'hit-under-door': 'the strip of light that meant somebody was still awake out there.',
    'hit-mat': 'the welcome mat. it stopped saying welcome a long time ago.',
    'hit-keys': 'the house keys. the spare keys. the keys that no longer fit anything.',
    'hit-spare-key': 'a single key, hung apart from the others. nobody remembered which lock.',
    'hit-key-board': 'the hook board. picked up at a market. mounted slightly crooked.',
    'hit-mail': 'the mail pocket. bills, postcards, a letter never opened.',
    'hit-note': 'a folded note, pinned at an angle. read once, kept forever.',
    'hit-light-switch': 'the entry light switch. the one everyone reached for in the dark.',
    'hit-coat': 'the coat that nobody owned and everybody wore.',
    'hit-coat-hook': 'the brass hook. it held more than coats.',
    'hit-shoes': 'shoes lined up. the order changed. somebody always rearranged them.'
};

const fronthallwayMemoryClickFragments = {
    'hit-door': 'the door was opened, the door was closed, the door was opened, the door was closed.',
    'hit-chain': 'the chain rattled even when it was at rest. some sounds are made by memory.',
    'hit-knob': 'turning the knob meant you were either leaving or arriving. nothing else.',
    'hit-kickplate': 'a thousand shoes. a thousand entries. a thousand exits. one plate.',
    'hit-under-door': 'a thin warm line, sometimes amber, sometimes blue. always somebody else\'s light.',
    'hit-mat': 'HOME. faded so soft you only see it when you already know it\'s there.',
    'hit-keys': 'every key on the ring opened a door that mattered. you can\'t remember which is which now.',
    'hit-spare-key': 'the spare key opened nothing visible. it stayed there anyway.',
    'hit-key-board': 'somebody mounted it. somebody else straightened it. somebody never noticed.',
    'hit-mail': 'the letter never opened was the most important one. or the least. you decide.',
    'hit-note': '"call me when you get home." you never did. the pin held the note up anyway.',
    'hit-light-switch': 'flicked on for arrivals. flicked off for departures. flicked on by mistake at three a.m.',
    'hit-coat': 'the coat hung there for years. no one wore it. it kept the door company.',
    'hit-coat-hook': 'the hook held the coat that held the smell that held the year.',
    'hit-shoes': 'sneakers on the left. dress shoes on the right. that was the rule. that\'s the rule.'
};

const FRONTHALLWAY_PEEPHOLE_SCENES = [
    'a hallway you don\'t recognize. the doors all wear different numbers than yours.',
    'the same hallway, but every door is open. every room beyond is empty.',
    'a long corridor. somebody at the far end, walking away, never reaching the end.',
    'the hallway carpet is the wrong color tonight. olive green, where it used to be brown.',
    'a flickering ceiling light. it spells your name in morse, then forgets how.',
    'the hallway is your hallway. but the apartment opposite has your number on its door.',
    'nothing. just the small ring of warm light. somebody was here a moment ago.'
];

const FRONTHALLWAY_KNOCK_TIPS = [
    'three knocks. nobody on the other side.',
    'a knock from the wrong direction. inside out, almost.',
    'somebody clearing their throat. or the building settling.'
];

const FRONTHALLWAY_UNDER_STRIPS = ['fh-under-strip-warm', 'fh-under-strip-cool', 'fh-under-strip-green', 'fh-under-strip-red'];

let fronthallwayHumCtx = null;
let fronthallwayHumOsc = null;
let fronthallwayUnderCycleId = null;
let fronthallwayKnockId = null;

const LIVINGROOM_CHANNELS = ['channel-1', 'channel-2', 'channel-3', 'channel-4'];
const LIVINGROOM_CHANNEL_TIPS = [
    'channel one: the static. somewhere inside, a face you almost recognize.',
    'channel two: an empty room you have stood in before. somebody is still in the doorway.',
    'channel three: a hand reaching out of the screen, slow as memory.',
    'channel four: a small bouncing creature, very pleased with itself.'
];
const LIVINGROOM_CHANNEL_LABELS = ['01', '02', '03', '04'];
let livingroomChannelIndex = 0;
let livingroomShuffleId = null;
let livingroomHumCtx = null;
let livingroomHumOsc = null;

const NOTEBOOK_SHELL_DEFAULT = 'elements/room-shell-only.svg';
const NOTEBOOK_SHELL_BATHROOM = 'elements/room-shell-bathroom-notebook.svg';
const NOTEBOOK_SHELL_MASTER = 'elements/room-shell-master-bedroom.svg';
const NOTEBOOK_SHELL_KITCHEN_FRIDGE = 'elements/room-shell-kitchen-fridge.svg';
const NOTEBOOK_SHELL_NO_WINDOW = 'elements/room-shell-no-window.svg';

/**
 * Notebook left-panel diorama (`<object class="notebook-shell-embed">`).
 * Return null to use NOTEBOOK_SHELL_DEFAULT (`room-shell-only.svg`, with window).
 * Bathroom mirror hotspots use NOTEBOOK_SHELL_BATHROOM directly, not this map.
 */
function notebookShellForRoom(roomId) {
    if (roomId === 'master-bedroom' || roomId === 'bedroom-one') {
        return NOTEBOOK_SHELL_MASTER;
    }
    if (roomId === 'kitchen') {
        return NOTEBOOK_SHELL_KITCHEN_FRIDGE;
    }
    if (roomId === 'main-hallway' || roomId === 'front-hallway' || roomId === 'front-closet') {
        return NOTEBOOK_SHELL_NO_WINDOW;
    }
    return null;
}

/** Swapping only the data attribute on object often does not reload; replace the node. */
function replaceNotebookShellEmbed(src) {
    const old = document.querySelector('#notebook .notebook-shell-embed');
    if (!old || !old.parentNode) return;
    const next = document.createElement('object');
    next.className = 'notebook-shell-embed';
    next.setAttribute('type', 'image/svg+xml');
    next.setAttribute('data', src);
    next.setAttribute('aria-hidden', 'true');
    old.parentNode.replaceChild(next, old);
}

Object.keys(visited).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('visited');
});

function openNotebookEntry(title, text, showRoomShell = true, shellSrc = null) {
    const notebook = document.getElementById('notebook');
    if (notebook) {
        if (showRoomShell) {
            notebook.classList.add('notebook--with-diorama');
            replaceNotebookShellEmbed(shellSrc || NOTEBOOK_SHELL_DEFAULT);
        } else {
            notebook.classList.remove('notebook--with-diorama');
            replaceNotebookShellEmbed(NOTEBOOK_SHELL_DEFAULT);
        }
    }

    const notebookTitle = document.getElementById('notebook-title');
    const notebookText = document.getElementById('notebook-text');

    if (notebookTitle.textContent !== title) {
        typeWriter(text, 'notebook-text');
    } else {
        notebookText.textContent = text;
    }

    notebookTitle.textContent = title;
    notebook.classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

document.querySelectorAll('.room-item').forEach((itemEl) => {
    itemEl.addEventListener('click', (event) => {
        event.stopPropagation();
        const roomId = itemEl.dataset.room;
        const itemId = itemEl.dataset.item;
        const data = roomItems[`${roomId}:${itemId}`];
        if (!data) return;

        visited[roomId] = true;
        const roomEl = document.getElementById(roomId);
        if (roomEl) roomEl.classList.add('visited');

        openNotebookEntry(data.title, data.text, true, notebookShellForRoom(roomId));
    });
});

// click listener for rooms
document.querySelectorAll('.room').forEach(room => {
  room.addEventListener('click', () => {
    const id = room.id;

    // bedroom closet should lead to apartment numero dos
    // test updt
    if (id === 'bedroom-closet') {
        // show the note first 
        const note = document.getElementById('door-note');
        const noteOverlay = document.getElementById('door-note-overlay');
        note.classList.add('visible');
        noteOverlay.classList.add('visible');

        // if yes...proceed with original transition. rmbr to add door asset
        document.getElementById('note-yes').onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
            const door = document.getElementById('door-transition');
            door.classList.add('active');
            setTimeout(() => {
                window.location.href = 'https://danielaaaas.github.io/unhogartemporal/aptdos/index.html';
            }, 1500);
        };

        // if no, stay in the room - open the bedroom-closet memory vignette
        // (the closet you stay in if you choose not to leave for apt 2)
        document.getElementById('note-no').onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
            visited[id] = true;
            room.classList.add('visited');
            openBedroomClosetMemory();
        };
    return;
}

// bathroom — mirror + sink + Dominican products memory vignette (apt one)
    if (id === 'bathroom') {
        visited[id] = true;
        room.classList.add('visited');
        openBathroomMemory();
        return;
    }

    // master bedroom — intimate pixel vignette (apt one)
    if (id === 'master-bedroom') {
        visited[id] = true;
        room.classList.add('visited');
        openBedroomMemory();
        return;
    }

    // main hallway — focused photo-wall memory vignette (apt one)
    if (id === 'main-hallway') {
        visited[id] = true;
        room.classList.add('visited');
        openHallwayMemory();
        return;
    }

    // kitchen — open-fridge memory vignette (apt one)
    if (id === 'kitchen') {
        visited[id] = true;
        room.classList.add('visited');
        openKitchenMemory();
        return;
    }

    // living room — CRT television memory vignette (apt one)
    if (id === 'living-room') {
        visited[id] = true;
        room.classList.add('visited');
        openLivingRoomMemory();
        return;
    }

    // front hallway — apartment door / threshold memory vignette (apt one)
    if (id === 'front-hallway') {
        visited[id] = true;
        room.classList.add('visited');
        openFrontHallwayMemory();
        return;
    }

// hallway closet — clothes, shelf, shoe boxes memory vignette (apt one)
    if (id === 'hallway-closet') {
        visited[id] = true;
        room.classList.add('visited');
        openHallwayClosetMemory();
        return;
    }

// front closet — utility shelves of household archaeology memory vignette (apt one)
    if (id === 'front-closet') {
        visited[id] = true;
        room.classList.add('visited');
        openFrontClosetMemory();
        return;
    }

    const data = rooms[id];
    if (!data) return;

    // this will mark a room as visited
    visited[id] = true;
    room.classList.add('visited');

    openNotebookEntry(data.title, data.text, true, notebookShellForRoom(id));
  });
});

// closes the notebook
function closeNotebook() {
    const notebook = document.getElementById('notebook');
    notebook.classList.remove('open', 'notebook--with-diorama');
    replaceNotebookShellEmbed(NOTEBOOK_SHELL_DEFAULT);
    document.getElementById('overlay').classList.remove('active');
}

document.getElementById('close-button').addEventListener('click', closeNotebook);

// or closing it with the esc key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeNotebook();
    closeMirror();
    closeBedroomMemory();
    closeHallwayMemory();
    closeKitchenMemory();
    closeLivingRoomMemory();
    closeFrontHallwayMemory();
    closeHallwayClosetMemory();
    closeFrontClosetMemory();
    closeBathroomMemory();
    if (typeof closeBedroomClosetMemory === 'function') closeBedroomClosetMemory();
  }
});

// bathroom mirror draft
function openMirror () {
    document.getElementById('mirror-overlay').classList.add('active');
    document.getElementById('mirror-input').value = '';
    document.getElementById('mirror-message').textContent = '';
    document.getElementById('mirror-message').classList.remove('fade-out');
    setTimeout(() => {
        document.getElementById('mirror-input').focus();
    }, 300);
}

function closeMirror () {
    document.getElementById('mirror-overlay').classList.remove('active');
}

function setupMirrorRoomHotspots() {
    const roomObject = document.getElementById('mirror-room-svg');
    if (!roomObject) return;

    const bindHotspots = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;

        const svgRoot = svgDoc.documentElement;
        if (!svgRoot || svgRoot.dataset.hotspotsBound === 'true') return;

        Object.entries(bathroomHotspotEntries).forEach(([hotspotId, entry]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;

            hotspot.style.cursor = "url('https://64.media.tumblr.com/821cf7001bf745e2ddca3d248163c513/894ac02f0d28ad70-56/s1280x1920/b524d63c6de82323756b1603e624961da509144e.png'), auto";
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                closeMirror();
                openNotebookEntry(entry.title, entry.text, true, NOTEBOOK_SHELL_BATHROOM);
            });
        });

        svgRoot.dataset.hotspotsBound = 'true';
    };

    roomObject.addEventListener('load', bindHotspots);
    bindHotspots();
}

setupMirrorRoomHotspots();

/* ============================
   Bathroom memory vignette (apt one)
   Mirror + sink + Dominican products. The mirror inside this vignette opens
   the existing writable steam-mirror modal (openMirror) on click.
   ============================ */

function openBathroomMemory() {
    const roomObject = document.getElementById('bathroom-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bathroom-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bathroom-memory-tip');
    if (tip) tip.textContent = 'hover for fragments. click foggy patches to wipe the mirror. click anything to remember.';
    startBathroomHum();
    setupBathroomMemorySvgRuntime();
}

function closeBathroomMemory() {
    const overlay = document.getElementById('bathroom-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopBathroomHum();
    // re-fog any wiped patches so next visit starts fresh
    Object.keys(bathroomWipeTimers).forEach((k) => {
        clearTimeout(bathroomWipeTimers[k]);
        delete bathroomWipeTimers[k];
    });
    const roomObject = document.getElementById('bathroom-memory-svg');
    const svgDoc = roomObject?.contentDocument;
    if (svgDoc) {
        ['br-wipe-1', 'br-wipe-2', 'br-wipe-3'].forEach((id) => {
            const el = svgDoc.getElementById(id);
            if (el) el.setAttribute('opacity', '1');
        });
    }
}

function startBathroomHum() {
    stopBathroomHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        bathroomHumCtx = new Ctx();
        // soft humid bathroom hum: low fluorescent buzz + extractor fan tone
        bathroomHumOsc = bathroomHumCtx.createOscillator();
        const gain = bathroomHumCtx.createGain();
        bathroomHumOsc.type = 'sine';
        bathroomHumOsc.frequency.value = 60;
        gain.gain.value = 0.022;
        bathroomHumOsc.connect(gain);
        gain.connect(bathroomHumCtx.destination);
        bathroomHumOsc.start();
        if (bathroomHumCtx.state === 'suspended') bathroomHumCtx.resume();

        // periodic faucet drip (matches the visual drip animation roughly)
        const scheduleDrip = () => {
            const wait = 5500 + Math.random() * 4000;
            bathroomDripTimer = setTimeout(() => {
                try {
                    if (!bathroomHumCtx) return;
                    const t = bathroomHumCtx.currentTime;
                    const dripOsc = bathroomHumCtx.createOscillator();
                    const dripGain = bathroomHumCtx.createGain();
                    dripOsc.type = 'sine';
                    dripOsc.frequency.setValueAtTime(680, t);
                    dripOsc.frequency.exponentialRampToValueAtTime(220, t + 0.18);
                    dripGain.gain.setValueAtTime(0.0001, t);
                    dripGain.gain.exponentialRampToValueAtTime(0.045, t + 0.012);
                    dripGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
                    dripOsc.connect(dripGain);
                    dripGain.connect(bathroomHumCtx.destination);
                    dripOsc.start(t);
                    dripOsc.stop(t + 0.25);
                } catch (_) {}
                scheduleDrip();
            }, wait);
        };
        scheduleDrip();
    } catch (_) {
        bathroomHumCtx = null;
        bathroomHumOsc = null;
    }
}

function stopBathroomHum() {
    if (bathroomDripTimer) {
        clearTimeout(bathroomDripTimer);
        bathroomDripTimer = null;
    }
    try {
        bathroomHumOsc?.stop();
        bathroomHumCtx?.close?.();
    } catch (_) {}
    bathroomHumOsc = null;
    bathroomHumCtx = null;
}

/** Wipe a steam patch open; queue a slow re-fog so the bathroom stays humid. */
function bathroomWipePatch(svgDoc, hotspotId) {
    const wipeIdMap = {
        'hit-wipe-1': 'br-wipe-1',
        'hit-wipe-2': 'br-wipe-2',
        'hit-wipe-3': 'br-wipe-3'
    };
    const targetId = wipeIdMap[hotspotId];
    if (!targetId) return;
    const target = svgDoc.getElementById(targetId);
    if (!target) return;

    target.setAttribute('opacity', '0');

    if (bathroomWipeTimers[targetId]) clearTimeout(bathroomWipeTimers[targetId]);
    bathroomWipeTimers[targetId] = setTimeout(() => {
        // re-fog gradually by stepping opacity up
        let op = 0;
        const step = () => {
            op += 0.1;
            if (op >= 1) {
                target.setAttribute('opacity', '1');
                delete bathroomWipeTimers[targetId];
                return;
            }
            target.setAttribute('opacity', String(op));
            bathroomWipeTimers[targetId] = setTimeout(step, 220);
        };
        step();
    }, BATHROOM_WIPE_STEAM_BACK_MS);
}

function setupBathroomMemorySvgRuntime() {
    const roomObject = document.getElementById('bathroom-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.bathroomBound === 'true') return;

        const tipEl = document.getElementById('bathroom-memory-tip');
        const defaultTip = 'hover for fragments. click foggy patches to wipe the mirror. click anything to remember.';

        Object.entries(bathroomMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (tipEl) tipEl.textContent = tip;
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // steam wipe patches: clear the patch + reveal the hidden text fragment
        ['hit-wipe-1', 'hit-wipe-2', 'hit-wipe-3'].forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                bathroomWipePatch(svgDoc, hotspotId);
                if (tipEl) tipEl.textContent = BATHROOM_WIPE_REVEALS[hotspotId] || defaultTip;
            });
        });

        // every other product / fixture: surface its memory fragment on click
        Object.entries(bathroomMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        svgRoot.dataset.bathroomBound = 'true';
    };

    if (!roomObject.dataset.bathroomLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.bathroomLoadHooked = 'true';
    }
    bind();
}

const bathroomCloseBtn = document.getElementById('bathroom-memory-close');
if (bathroomCloseBtn) bathroomCloseBtn.addEventListener('click', closeBathroomMemory);

function openBedroomMemory() {
    const roomObject = document.getElementById('bedroom-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bedroom-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bedroom-memory-tip');
    if (tip) {
        tip.textContent = 'hover for fragments. click the window to shift the night outside.';
    }
    startBedroomFanHum();
    setupBedroomMemorySvgRuntime();
}

function closeBedroomMemory() {
    const overlay = document.getElementById('bedroom-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    const roomObject = document.getElementById('bedroom-memory-svg');
    const svgDoc = roomObject?.contentDocument;
    if (svgDoc) resetBedroomCurtain(svgDoc);
    stopBedroomFanHum();
    if (bedroomClockIntervalId) {
        clearInterval(bedroomClockIntervalId);
        bedroomClockIntervalId = null;
    }
}

function startBedroomFanHum() {
    stopBedroomFanHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        bedroomFanCtx = new Ctx();
        bedroomFanOsc = bedroomFanCtx.createOscillator();
        const gain = bedroomFanCtx.createGain();
        bedroomFanOsc.type = 'sine';
        bedroomFanOsc.frequency.value = 62;
        gain.gain.value = 0.032;
        bedroomFanOsc.connect(gain);
        gain.connect(bedroomFanCtx.destination);
        bedroomFanOsc.start();
        if (bedroomFanCtx.state === 'suspended') bedroomFanCtx.resume();
    } catch (_) {
        bedroomFanCtx = null;
        bedroomFanOsc = null;
    }
}

function stopBedroomFanHum() {
    try {
        bedroomFanOsc?.stop();
        bedroomFanCtx?.close?.();
    } catch (_) {}
    bedroomFanOsc = null;
    bedroomFanCtx = null;
}

function randomBedroomClockTime(svgDoc) {
    const el = svgDoc.getElementById('clock-readout');
    if (!el) return;
    const h = Math.floor(Math.random() * 12) + 1;
    const m = Math.floor(Math.random() * 60);
    el.textContent = `${h}:${String(m).padStart(2, '0')}`;
}

function cycleBedroomOutsideScenes(svgDoc) {
    const ids = ['outside-a', 'outside-b', 'outside-c'];
    bedroomOutsideSceneIndex = (bedroomOutsideSceneIndex + 1) % ids.length;
    ids.forEach((id, i) => {
        const g = svgDoc.getElementById(id);
        if (!g) return;
        g.setAttribute('visibility', i === bedroomOutsideSceneIndex ? 'visible' : 'hidden');
    });
}

/** Curtain slides open via Web Animations API (SMIL beginElement is flaky on `<object>` SVG in several browsers). */
function resetBedroomCurtain(svgDoc) {
    const slide = svgDoc.getElementById('curtain-slide');
    const sway = svgDoc.getElementById('curtain-sway-anim');
    if (!slide) return;
    if (typeof slide.getAnimations === 'function') {
        slide.getAnimations().forEach((a) => a.cancel());
    }
    slide.style.transform = 'translate(22px, 0)';
    if (sway && typeof sway.endElement === 'function') {
        try {
            sway.endElement();
        } catch (_) {}
    }
}

function startBedroomCurtainOpen(svgDoc) {
    const slide = svgDoc.getElementById('curtain-slide');
    const sway = svgDoc.getElementById('curtain-sway-anim');
    if (!slide) return;

    if (typeof slide.getAnimations === 'function') {
        slide.getAnimations().forEach((a) => a.cancel());
    }
    slide.style.transform = 'translate(22px, 0)';

    const startSway = () => {
        if (sway && typeof sway.beginElement === 'function') {
            try {
                sway.beginElement();
            } catch (_) {}
        }
    };

    if (typeof slide.animate === 'function') {
        const openAnim = slide.animate(
            [{ transform: 'translate(22px, 0)' }, { transform: 'translate(0, 0)' }],
            { duration: 1150, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
        );
        openAnim.onfinish = startSway;
        return;
    }

    slide.style.transform = 'translate(0, 0)';
    startSway();
}

function setupBedroomMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroom-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.bedroomBound === 'true') {
            bedroomOutsideSceneIndex = 0;
            ['outside-a', 'outside-b', 'outside-c'].forEach((id, i) => {
                const g = svgDoc.getElementById(id);
                if (g) g.setAttribute('visibility', i === 0 ? 'visible' : 'hidden');
            });
            randomBedroomClockTime(svgDoc);
            if (bedroomClockIntervalId) clearInterval(bedroomClockIntervalId);
            bedroomClockIntervalId = window.setInterval(() => randomBedroomClockTime(svgDoc), 2800);
            window.setTimeout(() => startBedroomCurtainOpen(svgDoc), 40);
            return;
        }

        bedroomOutsideSceneIndex = 0;
        ['outside-a', 'outside-b', 'outside-c'].forEach((id, i) => {
            const g = svgDoc.getElementById(id);
            if (g) g.setAttribute('visibility', i === 0 ? 'visible' : 'hidden');
        });

        randomBedroomClockTime(svgDoc);
        if (bedroomClockIntervalId) clearInterval(bedroomClockIntervalId);
        bedroomClockIntervalId = window.setInterval(() => randomBedroomClockTime(svgDoc), 2800);

        const tipEl = document.getElementById('bedroom-memory-tip');

        Object.entries(bedroomMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (tipEl) tipEl.textContent = tip;
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = 'hover for fragments. click the window to shift the night outside.';
            });
        });

        const win = svgDoc.getElementById('hit-window');
        if (win) {
            win.addEventListener('click', (event) => {
                event.stopPropagation();
                cycleBedroomOutsideScenes(svgDoc);
                randomBedroomClockTime(svgDoc);
                if (tipEl) {
                    const msgs = [
                        'the city lights stencil themselves differently each time.',
                        'the moon slides through glass like it owes you nothing.',
                        'rain draws diagonal grammar no one taught you.'
                    ];
                    tipEl.textContent = msgs[bedroomOutsideSceneIndex];
                }
            });
        }

        svgRoot.dataset.bedroomBound = 'true';

        window.setTimeout(() => startBedroomCurtainOpen(svgDoc), 40);
    };

    if (!roomObject.dataset.bedroomLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.bedroomLoadHooked = 'true';
    }
    bind();
}

const bedroomCloseBtn = document.getElementById('bedroom-memory-close');
if (bedroomCloseBtn) bedroomCloseBtn.addEventListener('click', closeBedroomMemory);

/* ============================
   Main hallway memory vignette
   ============================ */

function openHallwayMemory() {
    const roomObject = document.getElementById('hallway-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('hallway-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('hallway-memory-tip');
    if (tip) tip.textContent = 'hover the frames for fragments. click one to step inside its scene.';
    startHallwayHum();
    setupHallwayMemorySvgRuntime();
}

function closeHallwayMemory() {
    const overlay = document.getElementById('hallway-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopHallwayHum();
    if (hallwayShadowDriftId) {
        clearInterval(hallwayShadowDriftId);
        hallwayShadowDriftId = null;
    }
}

function startHallwayHum() {
    stopHallwayHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        hallwayHumCtx = new Ctx();
        hallwayHumOsc = hallwayHumCtx.createOscillator();
        const gain = hallwayHumCtx.createGain();
        // lower, dimmer than the bedroom fan — more like a fluorescent / building hum
        hallwayHumOsc.type = 'sine';
        hallwayHumOsc.frequency.value = 48;
        gain.gain.value = 0.022;
        hallwayHumOsc.connect(gain);
        gain.connect(hallwayHumCtx.destination);
        hallwayHumOsc.start();
        if (hallwayHumCtx.state === 'suspended') hallwayHumCtx.resume();
    } catch (_) {
        hallwayHumCtx = null;
        hallwayHumOsc = null;
    }
}

function stopHallwayHum() {
    try {
        hallwayHumOsc?.stop();
        hallwayHumCtx?.close?.();
    } catch (_) {}
    hallwayHumOsc = null;
    hallwayHumCtx = null;
}

/** Cycle the centre-photo variant based on visit count, persisted in localStorage. */
function applyHallwayPhotoVariant(svgDoc) {
    let visit = 0;
    try {
        visit = parseInt(window.localStorage.getItem(HALLWAY_VISIT_KEY) || '0', 10) || 0;
    } catch (_) { visit = 0; }
    const idx = visit % HALLWAY_PHOTO_VARIANTS.length;
    HALLWAY_PHOTO_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === idx ? 'visible' : 'hidden');
    });
    try {
        window.localStorage.setItem(HALLWAY_VISIT_KEY, String(visit + 1));
    } catch (_) {}
}

/** Subtle shadow drift: tweak the cluster shadow's transform every few seconds. */
function startHallwayShadowDrift(svgDoc) {
    if (hallwayShadowDriftId) clearInterval(hallwayShadowDriftId);
    const shadow = svgDoc.getElementById('cluster-shadow');
    if (!shadow) return;
    let step = 0;
    const offsets = [
        'translate(0,0)',
        'translate(1,0)',
        'translate(0,1)',
        'translate(-1,0)',
        'translate(0,-1)'
    ];
    hallwayShadowDriftId = window.setInterval(() => {
        step = (step + 1) % offsets.length;
        shadow.setAttribute('transform', offsets[step]);
    }, 4200);
}

function setupHallwayMemorySvgRuntime() {
    const roomObject = document.getElementById('hallway-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        // Always re-apply variant + drift on each open (cache-busted reload may or may not hit)
        applyHallwayPhotoVariant(svgDoc);
        startHallwayShadowDrift(svgDoc);

        if (svgRoot.dataset.hallwayBound === 'true') return;

        const tipEl = document.getElementById('hallway-memory-tip');
        const defaultTip = 'hover the frames for fragments. click one to step inside its scene.';

        // Hover hotspots
        Object.entries(hallwayMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (tipEl) tipEl.textContent = tip;
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // Click on a framed photo → reveal its small scene fragment
        Object.entries(hallwayMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        // Click on the ghost / empty frame → cycle hidden messages
        const empty = svgDoc.getElementById('hit-empty');
        if (empty) {
            empty.addEventListener('click', (event) => {
                event.stopPropagation();
                const msg = hallwayHiddenMessages[hallwayHiddenMessageIndex];
                hallwayHiddenMessageIndex =
                    (hallwayHiddenMessageIndex + 1) % hallwayHiddenMessages.length;
                if (tipEl) tipEl.textContent = msg;
            });
        }

        // Peeling paint: a tiny easter-egg fragment
        const paint = svgDoc.getElementById('hit-paint');
        if (paint) {
            paint.style.cursor = 'pointer';
            paint.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = 'a strip of wall comes loose in your hand. underneath: another, older colour.';
            });
        }

        // Shelf trinket click
        const shelf = svgDoc.getElementById('hit-shelf');
        if (shelf) {
            shelf.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = 'the candle was lit for someone, once. the note has nothing inside.';
            });
        }

        svgRoot.dataset.hallwayBound = 'true';
    };

    if (!roomObject.dataset.hallwayLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.hallwayLoadHooked = 'true';
    }
    bind();
}

const hallwayCloseBtn = document.getElementById('hallway-memory-close');
if (hallwayCloseBtn) hallwayCloseBtn.addEventListener('click', closeHallwayMemory);

/* ============================
   Kitchen memory vignette
   ============================ */

function openKitchenMemory() {
    const roomObject = document.getElementById('kitchen-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('kitchen-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('kitchen-memory-tip');
    if (tip) tip.textContent = 'hover for fragments. click food, magnets, or notes to surface a memory.';
    startKitchenHum();
    setupKitchenMemorySvgRuntime();
}

function closeKitchenMemory() {
    const overlay = document.getElementById('kitchen-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopKitchenHum();
}

function startKitchenHum() {
    stopKitchenHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        kitchenHumCtx = new Ctx();
        kitchenHumOsc = kitchenHumCtx.createOscillator();
        const gain = kitchenHumCtx.createGain();
        // refrigerator compressor: a touch deeper and quieter than the bedroom fan
        kitchenHumOsc.type = 'sine';
        kitchenHumOsc.frequency.value = 56;
        gain.gain.value = 0.028;
        kitchenHumOsc.connect(gain);
        gain.connect(kitchenHumCtx.destination);
        kitchenHumOsc.start();
        if (kitchenHumCtx.state === 'suspended') kitchenHumCtx.resume();
    } catch (_) {
        kitchenHumCtx = null;
        kitchenHumOsc = null;
    }
}

function stopKitchenHum() {
    try {
        kitchenHumOsc?.stop();
        kitchenHumCtx?.close?.();
    } catch (_) {}
    kitchenHumOsc = null;
    kitchenHumCtx = null;
}

/** Pick the time-of-day variant for the swappable shelf item. */
function applyKitchenTimeVariant(svgDoc) {
    const h = new Date().getHours();
    let pick = 'time-evening';
    if (h >= 6 && h < 11) pick = 'time-morning';
    else if (h >= 11 && h < 17) pick = 'time-afternoon';
    else if (h >= 17 && h < 22) pick = 'time-evening';
    else pick = 'time-night';
    KITCHEN_TIME_VARIANTS.forEach((id) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', id === pick ? 'visible' : 'hidden');
    });
}

function setupKitchenMemorySvgRuntime() {
    const roomObject = document.getElementById('kitchen-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        // Always re-apply the time-variant on each open
        applyKitchenTimeVariant(svgDoc);

        if (svgRoot.dataset.kitchenBound === 'true') return;

        const tipEl = document.getElementById('kitchen-memory-tip');
        const defaultTip = 'hover for fragments. click food, magnets, or notes to surface a memory.';

        // Hover tips
        Object.entries(kitchenMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (tipEl) tipEl.textContent = tip;
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // Food container clicks reveal memories
        Object.entries(kitchenMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        // Magnet/note clicks reveal hidden dialogue
        Object.entries(kitchenMagnetDialogue).forEach(([hotspotId, line]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = line;
            });
        });

        // Cold fog click cycles a hidden message
        const fog = svgDoc.getElementById('hit-fog');
        if (fog) {
            fog.addEventListener('click', (event) => {
                event.stopPropagation();
                const msg = kitchenFogMessages[kitchenFogIndex];
                kitchenFogIndex = (kitchenFogIndex + 1) % kitchenFogMessages.length;
                if (tipEl) tipEl.textContent = msg;
            });
        }

        // Impossible item click — only meaningful when visible, but always surfaces a small note
        const impossible = svgDoc.getElementById('hit-impossible');
        if (impossible) {
            impossible.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = 'a small cold moon, hovering between the magnets. it leaves no shadow.';
            });
        }

        svgRoot.dataset.kitchenBound = 'true';
    };

    if (!roomObject.dataset.kitchenLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.kitchenLoadHooked = 'true';
    }
    bind();
}

const kitchenCloseBtn = document.getElementById('kitchen-memory-close');
if (kitchenCloseBtn) kitchenCloseBtn.addEventListener('click', closeKitchenMemory);

/* ============================
   Living room memory vignette
   ============================ */

function openLivingRoomMemory() {
    const roomObject = document.getElementById('livingroom-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('livingroom-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('livingroom-memory-tip');
    if (tip) tip.textContent = 'hover for fragments. click the tv to change channels. click anything else to open a story.';
    startLivingRoomHum();
    setupLivingRoomMemorySvgRuntime();
}

function closeLivingRoomMemory() {
    const overlay = document.getElementById('livingroom-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopLivingRoomHum();
    if (livingroomShuffleId) {
        clearInterval(livingroomShuffleId);
        livingroomShuffleId = null;
    }
}

function startLivingRoomHum() {
    stopLivingRoomHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        livingroomHumCtx = new Ctx();
        livingroomHumOsc = livingroomHumCtx.createOscillator();
        const gain = livingroomHumCtx.createGain();
        // CRT mains hum: a touch higher and quieter, evoking the 60Hz transformer whine
        livingroomHumOsc.type = 'sine';
        livingroomHumOsc.frequency.value = 64;
        gain.gain.value = 0.026;
        livingroomHumOsc.connect(gain);
        gain.connect(livingroomHumCtx.destination);
        livingroomHumOsc.start();
        if (livingroomHumCtx.state === 'suspended') livingroomHumCtx.resume();
    } catch (_) {
        livingroomHumCtx = null;
        livingroomHumOsc = null;
    }
}

function stopLivingRoomHum() {
    try {
        livingroomHumOsc?.stop();
        livingroomHumCtx?.close?.();
    } catch (_) {}
    livingroomHumOsc = null;
    livingroomHumCtx = null;
}

function showLivingRoomChannel(svgDoc, idx) {
    livingroomChannelIndex = ((idx % LIVINGROOM_CHANNELS.length) + LIVINGROOM_CHANNELS.length) % LIVINGROOM_CHANNELS.length;
    LIVINGROOM_CHANNELS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === livingroomChannelIndex ? 'visible' : 'hidden');
    });
    const readout = svgDoc.getElementById('lv-channel-readout');
    if (readout) readout.textContent = LIVINGROOM_CHANNEL_LABELS[livingroomChannelIndex];
}

function setupLivingRoomMemorySvgRuntime() {
    const roomObject = document.getElementById('livingroom-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        // Always reset to channel 1 + restart the unpredictable shuffle on each open
        showLivingRoomChannel(svgDoc, 0);
        if (livingroomShuffleId) clearInterval(livingroomShuffleId);
        livingroomShuffleId = window.setInterval(() => {
            // 1-in-3 odds it actually flips on any given tick — gives the "unpredictable" feel
            if (Math.random() < 0.33) {
                const next = Math.floor(Math.random() * LIVINGROOM_CHANNELS.length);
                showLivingRoomChannel(svgDoc, next);
            }
        }, 7200);

        if (svgRoot.dataset.livingroomBound === 'true') return;

        const tipEl = document.getElementById('livingroom-memory-tip');
        const defaultTip = 'hover for fragments. click the tv to change channels. click anything else to open a story.';

        // Hover hotspots
        Object.entries(livingroomMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (tipEl) tipEl.textContent = tip;
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // Object click stories
        Object.entries(livingroomMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        // TV click cycles channels
        const tvHit = svgDoc.getElementById('hit-tv');
        if (tvHit) {
            tvHit.addEventListener('click', (event) => {
                event.stopPropagation();
                showLivingRoomChannel(svgDoc, livingroomChannelIndex + 1);
                if (tipEl) tipEl.textContent = LIVINGROOM_CHANNEL_TIPS[livingroomChannelIndex];
            });
        }

        svgRoot.dataset.livingroomBound = 'true';
    };

    if (!roomObject.dataset.livingroomLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.livingroomLoadHooked = 'true';
    }
    bind();
}

const livingroomCloseBtn = document.getElementById('livingroom-memory-close');
if (livingroomCloseBtn) livingroomCloseBtn.addEventListener('click', closeLivingRoomMemory);

/* ============================
   Front hallway memory vignette
   ============================ */

function openFrontHallwayMemory() {
    const roomObject = document.getElementById('fronthallway-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('fronthallway-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('fronthallway-memory-tip');
    if (tip) tip.textContent = 'hover for fragments. click the peephole to look outside. click anything else to remember.';
    closeFrontHallwayPeephole();
    startFrontHallwayHum();
    setupFrontHallwayMemorySvgRuntime();
}

function closeFrontHallwayMemory() {
    const overlay = document.getElementById('fronthallway-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    closeFrontHallwayPeephole();
    stopFrontHallwayHum();
    if (fronthallwayUnderCycleId) {
        clearInterval(fronthallwayUnderCycleId);
        fronthallwayUnderCycleId = null;
    }
    if (fronthallwayKnockId) {
        clearInterval(fronthallwayKnockId);
        fronthallwayKnockId = null;
    }
}

function startFrontHallwayHum() {
    stopFrontHallwayHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        fronthallwayHumCtx = new Ctx();
        fronthallwayHumOsc = fronthallwayHumCtx.createOscillator();
        const gain = fronthallwayHumCtx.createGain();
        // building-corridor rumble — low + slightly subharmonic
        fronthallwayHumOsc.type = 'sine';
        fronthallwayHumOsc.frequency.value = 52;
        gain.gain.value = 0.022;
        fronthallwayHumOsc.connect(gain);
        gain.connect(fronthallwayHumCtx.destination);
        fronthallwayHumOsc.start();
        if (fronthallwayHumCtx.state === 'suspended') fronthallwayHumCtx.resume();
    } catch (_) {
        fronthallwayHumCtx = null;
        fronthallwayHumOsc = null;
    }
}

function stopFrontHallwayHum() {
    try {
        fronthallwayHumOsc?.stop();
        fronthallwayHumCtx?.close?.();
    } catch (_) {}
    fronthallwayHumOsc = null;
    fronthallwayHumCtx = null;
}

function applyFrontHallwayUnderStrip(svgDoc, stripId) {
    FRONTHALLWAY_UNDER_STRIPS.forEach((id) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        if (id === stripId) {
            node.setAttribute('visibility', 'visible');
            node.setAttribute('opacity', '0.95');
        } else {
            node.setAttribute('visibility', 'hidden');
            node.setAttribute('opacity', '0');
        }
    });
}

function openFrontHallwayPeephole() {
    const view = document.getElementById('fh-peephole-view');
    const text = document.getElementById('fh-peephole-text');
    if (!view || !text) return;
    const sceneIdx = Math.floor(Math.random() * FRONTHALLWAY_PEEPHOLE_SCENES.length);
    text.textContent = FRONTHALLWAY_PEEPHOLE_SCENES[sceneIdx];
    view.classList.add('active');
    view.setAttribute('aria-hidden', 'false');
}

function closeFrontHallwayPeephole() {
    const view = document.getElementById('fh-peephole-view');
    if (!view) return;
    view.classList.remove('active');
    view.setAttribute('aria-hidden', 'true');
}

function setupFrontHallwayMemorySvgRuntime() {
    const roomObject = document.getElementById('fronthallway-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        // each open: reset under-door to warm + restart cycles
        applyFrontHallwayUnderStrip(svgDoc, 'fh-under-strip-warm');

        if (fronthallwayUnderCycleId) clearInterval(fronthallwayUnderCycleId);
        fronthallwayUnderCycleId = window.setInterval(() => {
            // 1-in-3 odds it actually flips on any given tick — feels unpredictable
            if (Math.random() < 0.33) {
                const next = FRONTHALLWAY_UNDER_STRIPS[Math.floor(Math.random() * FRONTHALLWAY_UNDER_STRIPS.length)];
                applyFrontHallwayUnderStrip(svgDoc, next);
            }
        }, 8400);

        const tipEl = document.getElementById('fronthallway-memory-tip');
        const defaultTip = 'hover for fragments. click the peephole to look outside. click anything else to remember.';

        // occasional impossible knock — surfaces a quiet line into the HUD
        if (fronthallwayKnockId) clearInterval(fronthallwayKnockId);
        fronthallwayKnockId = window.setInterval(() => {
            if (Math.random() < 0.18 && tipEl) {
                tipEl.textContent = FRONTHALLWAY_KNOCK_TIPS[Math.floor(Math.random() * FRONTHALLWAY_KNOCK_TIPS.length)];
            }
        }, 26000);

        if (svgRoot.dataset.fronthallwayBound === 'true') return;

        Object.entries(fronthallwayMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (tipEl) tipEl.textContent = tip;
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        Object.entries(fronthallwayMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        // peephole click opens the modal with a randomized "outside" scene
        const peephole = svgDoc.getElementById('hit-peephole');
        if (peephole) {
            peephole.addEventListener('click', (event) => {
                event.stopPropagation();
                openFrontHallwayPeephole();
            });
        }

        svgRoot.dataset.fronthallwayBound = 'true';
    };

    if (!roomObject.dataset.fronthallwayLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.fronthallwayLoadHooked = 'true';
    }
    bind();
}

const fronthallwayCloseBtn = document.getElementById('fronthallway-memory-close');
if (fronthallwayCloseBtn) fronthallwayCloseBtn.addEventListener('click', closeFrontHallwayMemory);

const fronthallwayPeepholeClose = document.getElementById('fh-peephole-close');
if (fronthallwayPeepholeClose) fronthallwayPeepholeClose.addEventListener('click', (event) => {
    event.stopPropagation();
    closeFrontHallwayPeephole();
});

/* ============================
   Front closet memory vignette
   ============================ */

function openFrontClosetMemory() {
    const roomObject = document.getElementById('frontcloset-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('frontcloset-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('frontcloset-memory-tip');
    if (tip) tip.textContent = 'hover for fragments. click any object to remember. click the dark behind the shelves to hear something further in.';
    startFrontClosetHum();
    setupFrontClosetMemorySvgRuntime();
}

function closeFrontClosetMemory() {
    const overlay = document.getElementById('frontcloset-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopFrontClosetHum();
}

function startFrontClosetHum() {
    stopFrontClosetHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        frontclosetHumCtx = new Ctx();
        // very low closet hush — wood + dust + the sound of something old
        frontclosetHumOsc = frontclosetHumCtx.createOscillator();
        const gain = frontclosetHumCtx.createGain();
        frontclosetHumOsc.type = 'sine';
        frontclosetHumOsc.frequency.value = 38;
        gain.gain.value = 0.020;
        frontclosetHumOsc.connect(gain);
        gain.connect(frontclosetHumCtx.destination);
        frontclosetHumOsc.start();
        if (frontclosetHumCtx.state === 'suspended') frontclosetHumCtx.resume();

        // occasional ambient creaks — very short, very dry
        const scheduleCreak = () => {
            const wait = 5500 + Math.random() * 7000;
            frontclosetCreakTimer = setTimeout(() => {
                try {
                    if (!frontclosetHumCtx) return;
                    const t = frontclosetHumCtx.currentTime;
                    const creakOsc = frontclosetHumCtx.createOscillator();
                    const creakGain = frontclosetHumCtx.createGain();
                    creakOsc.type = 'sawtooth';
                    creakOsc.frequency.setValueAtTime(160 + Math.random() * 100, t);
                    creakOsc.frequency.exponentialRampToValueAtTime(70 + Math.random() * 30, t + 0.55);
                    creakGain.gain.setValueAtTime(0.0001, t);
                    creakGain.gain.exponentialRampToValueAtTime(0.018, t + 0.06);
                    creakGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
                    creakOsc.connect(creakGain);
                    creakGain.connect(frontclosetHumCtx.destination);
                    creakOsc.start(t);
                    creakOsc.stop(t + 0.65);
                } catch (_) {}
                scheduleCreak();
            }, wait);
        };
        scheduleCreak();
    } catch (_) {
        frontclosetHumCtx = null;
        frontclosetHumOsc = null;
    }
}

function stopFrontClosetHum() {
    if (frontclosetCreakTimer) {
        clearTimeout(frontclosetCreakTimer);
        frontclosetCreakTimer = null;
    }
    try {
        frontclosetHumOsc?.stop();
        frontclosetHumCtx?.close?.();
    } catch (_) {}
    frontclosetHumOsc = null;
    frontclosetHumCtx = null;
}

/**
 * On every visit, swap the bin label and the phantom item to a different variant.
 * Returns { binIdx, phantomIdx } so hover handlers can read the current state.
 */
function applyFrontClosetRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(FRONTCLOSET_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(FRONTCLOSET_VISIT_KEY, String(visits)); } catch (_) {}

    const binIdx = (visits - 1) % FRONTCLOSET_BIN_VARIANTS.length;
    FRONTCLOSET_BIN_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === binIdx ? 'visible' : 'hidden');
    });

    // phantom shifts on a different cadence so the two changes feel uncoordinated
    const phantomIdx = (visits + 1) % FRONTCLOSET_PHANTOM_VARIANTS.length;
    FRONTCLOSET_PHANTOM_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === phantomIdx ? 'visible' : 'hidden');
    });

    return { binIdx, phantomIdx };
}

function setupFrontClosetMemorySvgRuntime() {
    const roomObject = document.getElementById('frontcloset-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        // every open: rotate the rotating things and stash the current state on
        // the SVG root so hover handlers always read whatever is visible right now.
        const rotations = applyFrontClosetRotations(svgDoc);
        svgRoot._fcRotations = rotations;

        if (svgRoot.dataset.frontclosetBound === 'true') return;

        const tipEl = document.getElementById('frontcloset-memory-tip');
        const defaultTip = 'hover for fragments. click any object to remember. click the dark behind the shelves to hear something further in.';

        Object.entries(frontclosetMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                if (hotspotId === 'hit-bin-top') {
                    const idx = (svgRoot._fcRotations || {}).binIdx ?? 0;
                    tipEl.textContent = FRONTCLOSET_BIN_TIPS[idx] || tip;
                } else if (hotspotId === 'hit-phantom') {
                    const idx = (svgRoot._fcRotations || {}).phantomIdx ?? 0;
                    tipEl.textContent = FRONTCLOSET_PHANTOM_TIPS[idx] || tip;
                } else {
                    tipEl.textContent = tip;
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        Object.entries(frontclosetMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (!tipEl) return;
                if (hotspotId === 'hit-phantom') {
                    const idx = (svgRoot._fcRotations || {}).phantomIdx ?? 0;
                    tipEl.textContent = FRONTCLOSET_PHANTOM_CLICKS[idx] || fragment;
                } else if (hotspotId === 'hit-deeper') {
                    const pick = FRONTCLOSET_DEEPER_VOICES[Math.floor(Math.random() * FRONTCLOSET_DEEPER_VOICES.length)];
                    tipEl.textContent = pick || fragment;
                } else {
                    tipEl.textContent = fragment;
                }
            });
        });

        svgRoot.dataset.frontclosetBound = 'true';
    };

    if (!roomObject.dataset.frontclosetLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.frontclosetLoadHooked = 'true';
    }
    bind();
}

const frontclosetCloseBtn = document.getElementById('frontcloset-memory-close');
if (frontclosetCloseBtn) frontclosetCloseBtn.addEventListener('click', closeFrontClosetMemory);

/* ============================
   Hallway closet memory vignette
   ============================ */

function openHallwayClosetMemory() {
    const roomObject = document.getElementById('hallwaycloset-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('hallwaycloset-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('hallwaycloset-memory-tip');
    if (tip) tip.textContent = 'hover for the smell of things. click clothes for what their pockets held. click boxes for keepsakes.';
    startHallwayClosetHum();
    setupHallwayClosetMemorySvgRuntime();
}

function closeHallwayClosetMemory() {
    const overlay = document.getElementById('hallwaycloset-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopHallwayClosetHum();
}

function startHallwayClosetHum() {
    stopHallwayClosetHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        hallwayclosetHumCtx = new Ctx();
        hallwayclosetHumOsc = hallwayclosetHumCtx.createOscillator();
        const gain = hallwayclosetHumCtx.createGain();
        // very low closet hush — like the muffled hum of an enclosed wooden space
        hallwayclosetHumOsc.type = 'sine';
        hallwayclosetHumOsc.frequency.value = 44;
        gain.gain.value = 0.018;
        hallwayclosetHumOsc.connect(gain);
        gain.connect(hallwayclosetHumCtx.destination);
        hallwayclosetHumOsc.start();
        if (hallwayclosetHumCtx.state === 'suspended') hallwayclosetHumCtx.resume();
    } catch (_) {
        hallwayclosetHumCtx = null;
        hallwayclosetHumOsc = null;
    }
}

function stopHallwayClosetHum() {
    try {
        hallwayclosetHumOsc?.stop();
        hallwayclosetHumCtx?.close?.();
    } catch (_) {}
    hallwayclosetHumOsc = null;
    hallwayclosetHumCtx = null;
}

/**
 * Rotate every garment slot to the next variant. Returns a map from
 * hotspotId -> the currently visible variant index, so hover handlers can
 * surface the right scent line for whatever is hanging there right now.
 */
function applyHallwayClosetOutfits(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(HALLWAYCLOSET_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(HALLWAYCLOSET_VISIT_KEY, String(visits)); } catch (_) {}

    const currentByHotspot = {};
    HALLWAYCLOSET_GARMENT_CONFIG.forEach((garment) => {
        const idx = (visits - 1 + garment.offset) % garment.variants.length;
        garment.variants.forEach((id, i) => {
            const node = svgDoc.getElementById(id);
            if (node) node.setAttribute('visibility', i === idx ? 'visible' : 'hidden');
        });
        currentByHotspot[garment.hotspotId] = idx;
    });
    return currentByHotspot;
}

function setupHallwayClosetMemorySvgRuntime() {
    const roomObject = document.getElementById('hallwaycloset-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        // every open: rotate every garment slot to a fresh variant.
        // Stash the result on the SVG so hover handlers always read the
        // current state, even after the listeners are bound once.
        const currentByHotspot = applyHallwayClosetOutfits(svgDoc);
        svgRoot._hcCurrentVariants = currentByHotspot;

        if (svgRoot.dataset.hallwayclosetBound === 'true') return;

        const tipEl = document.getElementById('hallwaycloset-memory-tip');
        const defaultTip = 'hover for the smell of things. click clothes for what their pockets held. click boxes for keepsakes.';

        // Build a quick lookup from garment hotspotId -> its config entry
        const garmentConfigByHotspot = {};
        HALLWAYCLOSET_GARMENT_CONFIG.forEach((g) => { garmentConfigByHotspot[g.hotspotId] = g; });

        Object.entries(hallwayclosetMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                const garment = garmentConfigByHotspot[hotspotId];
                if (garment) {
                    const idx = (svgRoot._hcCurrentVariants || {})[hotspotId] ?? 0;
                    tipEl.textContent = garment.tips[idx] || tip;
                } else {
                    tipEl.textContent = tip;
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        Object.entries(hallwayclosetMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        svgRoot.dataset.hallwayclosetBound = 'true';
    };

    if (!roomObject.dataset.hallwayclosetLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.hallwayclosetLoadHooked = 'true';
    }
    bind();
}

const hallwayclosetCloseBtn = document.getElementById('hallwaycloset-memory-close');
if (hallwayclosetCloseBtn) hallwayclosetCloseBtn.addEventListener('click', closeHallwayClosetMemory);

document.getElementById('mirror-submit').addEventListener('click', () => {
    const msg = document.getElementById('mirror-input').value.trim();
    if (!msg) return;

    const display = document.getElementById('mirror-message');
    display.textContent = msg;
    display.classList.remove('fade-out');
    document.getElementById('mirror-input').value = '';

    // fade out after a moment...but i might keep the text instead
    setTimeout(() => {
        display.classList.add('fade-out');
    }, 3000);
});

// text to be submitted with the enter key
document.getElementById('mirror-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('mirror-submit').click();
});

document.getElementById('mirror-close').addEventListener('click', closeMirror);

// for the closet crumble 
function openCloset() {
    document.getElementById('closet-overlay').classList.add('active');
    document.getElementById('closet-input').value = '';
    document.getElementById('closet-text').textContent = '';
    setTimeout(() => {
        document.getElementById('closet-input').focus();
    }, 300);
}

function closeCloset() {
    document.getElementById('closet-overlay').classList.remove('active');
}

function crumbleText(text) {
    const textEl = document.getElementById('closet-text');
    const pile = document.getElementById('crumble-pile');
    // const text = textEl.textContent;
    // if (!text) return;

    // turns number of characters into crumbs
    // const crumbCount = Math.min(text.length * 2, 80);

    // crumble letter by letter 
    let i = text.length;
    const clearTimer = setInterval(() => {
        i--;
        textEl.textContent = text.substring(0, i);
        // add a crumb for every letter
        const crumb = document.createElement('div');
        crumb.classList.add('crumb');
        // size variation like confetti
        const size = 2 + Math.floor(Math.random() * 3);
        crumb.style.width = size + 'px';
        crumb.style.height = size + 'px';
        crumb.style.opacity = 0.4 + Math.random() * 0.6;
        pile.appendChild(crumb);
        if (i<=0) clearInterval(clearTimer);
        }, 40);
}

document.getElementById('closet-submit').addEventListener('click', () => {
    const msg = document.getElementById('closet-input').value.trim();
    if (!msg) return;

    document.getElementById('closet-input').value = '';

    // types the message on the wall first ( this part is giving me a headacheeeeeeee, thankfully it's recycling what i already used )
    typeWriter(msg, 'closet-text', 40);

    // then, once its written, it crumbles
    const crumbleDelay = msg.length * 40 + 800;
    setTimeout(() => crumbleText(msg), crumbleDelay);
});

document.getElementById('closet-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('closet-submit').click();
});

document.getElementById('closet-close').addEventListener('click', closeCloset);
// ============================================================
// BEDROOM CLOSET memory vignette (apartment one) - the closet you
// stay in if you choose not to step through to apt 2. warmer and
// more personal than the hallway closet: hanging clothes from
// different years, folded blankets and a shoe box up top, perfume
// bottles and a hair-product on a low ledge, a backpack slumped on
// the floor. one fabric (slot 3) glows softly when hovered, the way
// a garment seems to remember a scent. fragments occasionally
// surface on their own (a faint ambient bedroom-closet hum +
// scheduled "scent" surfacing).
// ============================================================

const bedroomclosetMemoryHoverTips = {
    'hit-bulb':           'a single bare bulb. you forgot to replace it for years; it was always almost burned out.',
    'hit-blankets':       'folded blankets. the cream one was on the bed every winter.',
    'hit-shoebox-shelf':  'a shoe box you never threw away. the brand stopped existing.',
    'hit-bag':            'an old bag from somewhere before this apartment.',
    'hit-bin':            'a small woven bin. a scarf tip pokes out of it - the one you always forgot to put back.',
    'hit-rod':            'the metal rod. her sleeves used to brush it on the way past.',
    'hit-garment-1':      'a blouse you wore on ordinary mornings. the cuff is a little frayed.',
    'hit-garment-2':      'a knit cardigan. it smells, very faintly, of the soap she used to buy.',
    'hit-garment-3':      'a long dress you only wore once or twice. the satin still warms slightly under your hand.',
    'hit-garment-4':      'a skirt with a worn hem. the inside of the waistband still has her handwriting.',
    'hit-perfume':        'three small bottles. one is almost empty. one stopped being made.',
    'hit-hairproduct':    'a hair product you have not bought in years. the bottle is still half-full.',
    'hit-shoebox-floor':  'shoe boxes stacked on the floor. the top one held the photographs she kept loose.',
    'hit-floorbag':       'a small backpack slumped against the wall. it has been here since the move that\u2014',
    'hit-iron':           'her old clothing iron. the cord still wraps in the same lazy curl. the soleplate has a faint shine where she always set it down.',
    'hit-racket':         'her old tennis racket, lying on its side on the floor. the strings have gone slack.',
    'hit-tennisballs':    'two tennis balls on the floor. the third one keeps moving when you don\u2019t look at it.',
    'hit-ledge-ball':     'a single tennis ball perched on the ledge. it wasn\u2019t there last time you looked.',
    'hit-back':           'the back of the closet. it feels deeper than it should. sometimes you reach into it and your hand finds something from a different year.'
};

// per-garment-slot rotating hover tips (matches visible variant index)
const bedroomclosetGarmentHoverByVariant = {
    'hit-garment-1': [
        'a pale cream blouse with tiny floral specks. the kind of thing she would have ironed on a sunday.',
        'a dusty pink blouse with a peter-pan collar. you can almost see her shoulders inside it.',
        'a faded green tee from a year you can\u2019t place. the print is almost gone.'
    ],
    'hit-garment-2': [
        'a cream knit cardigan with pearl buttons. it still smells, faintly, of her.',
        'an oatmeal sweater with one stripe across the chest. it always shed a little.',
        'a deep terracotta cardigan. the elbows are softer than the rest.'
    ],
    'hit-garment-3': [
        'a long blush satin slip dress. the fabric warms under your hand. it remembers something the rest of the closet has forgotten.',
        'a long sage linen dress with embroidered hem. she wore it the year that\u2014',
        'a deep navy dress with a couple of star sequins. you can almost remember which night.'
    ],
    'hit-garment-4': [
        'a pleated tan midi skirt. the pleats still hold the way she set them.',
        'a long denim skirt. the seam down the front is worn pale.',
        'a charcoal a-line skirt with thin pinstripes. inside the waistband, her handwriting.'
    ]
};

const bedroomclosetMemoryClickFragments = {
    'hit-bulb':           'you tug the chain. nothing changes. the closet has been at this exact warmth for years.',
    'hit-blankets':       'a folded note slipped between two folds. it says only a date. you have been staring at the date for a while.',
    'hit-shoebox-shelf':  'inside the box: a single dried flower, a movie ticket, a strand of hair. you put the lid back on.',
    'hit-bag':            'inside the bag: a metro card from a city that no longer uses them. a receipt for two coffees. a hair tie.',
    'hit-bin':            'you pull the scarf tip. it keeps coming. the bin is deeper than it should be. you stop pulling.',
    'hit-rod':            'the rod is cold against your wrist. you slide a couple of hangers along it; the others do not move.',
    'hit-garment-1':      'in the pocket: a folded receipt for things you do not remember buying. the date is from before this apartment.',
    'hit-garment-2':      'the cardigan still has a tissue in the sleeve. she always tucked one there.',
    'hit-garment-3':      'the satin warms further under your hand. the room dims a little when you close your eyes against the fabric. you do not remember when you last wore it.',
    'hit-garment-4':      'in the inside waistband: her handwriting in faded ballpoint. it says a name and a year. you read it twice.',
    'hit-perfume':        'you press the atomizer. nothing comes out. the room smells like it anyway.',
    'hit-hairproduct':    'the pump still works. the smell goes straight into a year you had not thought about.',
    'hit-shoebox-floor':  'inside the top box: photographs she kept loose, in no order. you stop turning them over after the third one.',
    'hit-floorbag':       'inside: a notebook with three pages used. the rest are blank. the handwriting on the first page is yours.',
    'hit-iron':           'you touch the soleplate, expecting it to be cold. for a second it is faintly warm. then it isn\u2019t. the room smells like a sunday morning, briefly.',
    'hit-racket':         'you lift the racket. the weight is exactly familiar. the grip wrap has gone smooth where her hand used to be. you lay it back down the way you found it.',
    'hit-tennisballs':    'you press one with your thumb. it has lost most of its bounce. you nudge them back together with your foot. you count three. you only see two.',
    'hit-ledge-ball':     'you pick up the third ball. it is warmer than the others. you set it down again and it is, very briefly, somewhere else.',
    'hit-back':           'you reach toward the back of the closet. for a second the wall is further than it should be. then it isn\u2019t.'
};

// fragments that surface ON THEIR OWN every 24-40 seconds while the
// vignette is open - the closet briefly remembering a scent.
const bedroomclosetMemorySurfacingFragments = [
    'a draft moves through the closet. the hangers shift one notch.',
    'the smell of her soap rises briefly. then nothing.',
    'one fabric, very softly, remembers a scent.',
    'the back of the closet darkens a little, then comes back.',
    'a hanger settles a quarter inch lower on the rod.',
    'the cream cardigan smells, for a moment, like a winter that already happened.',
    'a perfume that stopped being made surfaces in the air briefly.',
    'the bulb dims a notch and warms back up.',
    'a fold in the blankets relaxes. nothing was holding it.',
    'the racket lies on the floor where she left it. the head points toward the shoeboxes.',
    'a tennis ball rolls itself a quarter inch across the floor and stops.',
    'you count three tennis balls. then two. then three again.',
    'the iron, on the lower ledge, is faintly warm again for a moment.'
];

// rotating clusters - per-visit so the closet "shifts gently between visits"
const BC_GARMENT_VARIANTS = {
    'bc-outfit-1': ['bc-outfit-1a', 'bc-outfit-1b', 'bc-outfit-1c'],
    'bc-outfit-2': ['bc-outfit-2a', 'bc-outfit-2b', 'bc-outfit-2c'],
    'bc-outfit-3': ['bc-outfit-3a', 'bc-outfit-3b', 'bc-outfit-3c'],
    'bc-outfit-4': ['bc-outfit-4a', 'bc-outfit-4b', 'bc-outfit-4c']
};
const BC_BLANKETS_VARIANTS = ['bc-blankets-a', 'bc-blankets-b', 'bc-blankets-c'];
const BC_BAG_VARIANTS      = ['bc-bag-a',      'bc-bag-b',      'bc-bag-c'];
const BC_FLOORBOX_VARIANTS = ['bc-shoebox-floor-a', 'bc-shoebox-floor-b'];
const BC_VISIT_KEY         = 'bedroomcloset.visitCount';

// per-slot offsets so opening the closet a second time shows a different
// pairing of garments (slots don't rotate in lockstep)
const BC_GARMENT_OFFSETS = {
    'bc-outfit-1': 0,
    'bc-outfit-2': 1,
    'bc-outfit-3': 2,
    'bc-outfit-4': 1
};
const BC_GARMENT_TO_HIT = {
    'bc-outfit-1': 'hit-garment-1',
    'bc-outfit-2': 'hit-garment-2',
    'bc-outfit-3': 'hit-garment-3',
    'bc-outfit-4': 'hit-garment-4'
};

let bcHumCtx = null;
let bcHumOscLow = null;
let bcHumOscMid = null;
let bcHumNoise = null;
let bcHumLfo = null;
let bcSurfacingTimerId = null;

function openBedroomClosetMemory() {
    const roomObject = document.getElementById('bedroomcloset-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bedroomcloset-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bedroomcloset-memory-tip');
    if (tip) tip.textContent = 'hover for the smell of things. one fabric glows when you find it. click any garment for what its pockets remembered. click boxes for keepsakes. fragments may surface on their own.';
    startBedroomClosetPad();
    setupBedroomClosetMemorySvgRuntime();
}

function closeBedroomClosetMemory() {
    const overlay = document.getElementById('bedroomcloset-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (bcSurfacingTimerId) {
        clearTimeout(bcSurfacingTimerId);
        bcSurfacingTimerId = null;
    }
    stopBedroomClosetPad();
}

// the layered closet ambience: a very low wood-room rumble + a quiet
// midrange resonant warmth + a low-passed noise floor (fabric-and-air).
// a slow LFO swells the master gain so the closet softly breathes.
function startBedroomClosetPad() {
    stopBedroomClosetPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        bcHumCtx = new Ctx();

        const masterGain = bcHumCtx.createGain();
        masterGain.gain.value = 0.016;
        masterGain.connect(bcHumCtx.destination);

        // a very low wood-room rumble (~46 Hz)
        bcHumOscLow = bcHumCtx.createOscillator();
        bcHumOscLow.type = 'sine';
        bcHumOscLow.frequency.value = 46;
        const gLow = bcHumCtx.createGain();
        gLow.gain.value = 0.55;
        bcHumOscLow.connect(gLow);
        gLow.connect(masterGain);

        // quiet warm partial above (~196 Hz)
        bcHumOscMid = bcHumCtx.createOscillator();
        bcHumOscMid.type = 'sine';
        bcHumOscMid.frequency.value = 196;
        bcHumOscMid.detune.value = -6;
        const gMid = bcHumCtx.createGain();
        gMid.gain.value = 0.08;
        bcHumOscMid.connect(gMid);
        gMid.connect(masterGain);

        // soft low-passed noise floor (fabric, dust, dim light)
        const bufferSize = 2 * bcHumCtx.sampleRate;
        const noiseBuffer = bcHumCtx.createBuffer(1, bufferSize, bcHumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.50;
        }
        bcHumNoise = bcHumCtx.createBufferSource();
        bcHumNoise.buffer = noiseBuffer;
        bcHumNoise.loop = true;
        const noiseFilter = bcHumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 280;
        const noiseGain = bcHumCtx.createGain();
        noiseGain.gain.value = 0.20;
        bcHumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // very slow LFO (~26s period) - the closet softly breathes
        bcHumLfo = bcHumCtx.createOscillator();
        bcHumLfo.type = 'sine';
        bcHumLfo.frequency.value = 1 / 26;
        const lfoDepth = bcHumCtx.createGain();
        lfoDepth.gain.value = 0.010;
        bcHumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        bcHumOscLow.start();
        bcHumOscMid.start();
        bcHumNoise.start();
        bcHumLfo.start();
        if (bcHumCtx.state === 'suspended') bcHumCtx.resume();
    } catch (_) {
        bcHumCtx = null;
        bcHumOscLow = null;
        bcHumOscMid = null;
        bcHumNoise = null;
        bcHumLfo = null;
    }
}

function stopBedroomClosetPad() {
    try {
        bcHumOscLow?.stop();
        bcHumOscMid?.stop();
        bcHumNoise?.stop();
        bcHumLfo?.stop();
        bcHumCtx?.close?.();
    } catch (_) {}
    bcHumOscLow = null;
    bcHumOscMid = null;
    bcHumNoise = null;
    bcHumLfo = null;
    bcHumCtx = null;
}

// a soft "fabric-rustle" played when a hidden fragment surfaces -
// a quick filtered noise burst with a fast attack and short tail.
function playBedroomClosetRustle() {
    if (!bcHumCtx) return;
    try {
        const now = bcHumCtx.currentTime;
        const sr = bcHumCtx.sampleRate;
        const buf = bcHumCtx.createBuffer(1, Math.floor(sr * 0.6), sr);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * 0.4;
        const src = bcHumCtx.createBufferSource();
        src.buffer = buf;
        const flt = bcHumCtx.createBiquadFilter();
        flt.type = 'bandpass';
        flt.frequency.value = 1400;
        flt.Q.value = 2.4;
        const g = bcHumCtx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.024, now + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0005, now + 0.55);
        src.connect(flt);
        flt.connect(g);
        g.connect(bcHumCtx.destination);
        src.start(now);
        src.stop(now + 0.6);
    } catch (_) {}
}

function applyBedroomClosetRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BC_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BC_VISIT_KEY, String(visits)); } catch (_) {}

    const currentByHotspot = {};

    // garments: each slot rotates with its own offset
    Object.entries(BC_GARMENT_VARIANTS).forEach(([slotKey, variants]) => {
        const offset = BC_GARMENT_OFFSETS[slotKey] || 0;
        const idx = (visits - 1 + offset) % variants.length;
        variants.forEach((id, i) => {
            const node = svgDoc.getElementById(id);
            if (node) node.setAttribute('visibility', i === idx ? 'visible' : 'hidden');
        });
        // mark the visible one as the "current" outfit so the small CSS
        // brightness lift on hover targets the right child
        variants.forEach((id, i) => {
            const node = svgDoc.getElementById(id);
            if (!node) return;
            if (i === idx) node.classList.add('bc-outfit-current');
            else node.classList.remove('bc-outfit-current');
        });
        currentByHotspot[BC_GARMENT_TO_HIT[slotKey]] = idx;
    });

    // blankets: rotates with a different offset
    const blanketsIdx = (visits + 1) % BC_BLANKETS_VARIANTS.length;
    BC_BLANKETS_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === blanketsIdx ? 'visible' : 'hidden');
    });

    // bag (on the shelf): rotates with yet another offset
    const bagIdx = (visits) % BC_BAG_VARIANTS.length;
    BC_BAG_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === bagIdx ? 'visible' : 'hidden');
    });

    // floor shoebox stack: 2 arrangements
    const floorBoxIdx = (visits + 1) % BC_FLOORBOX_VARIANTS.length;
    BC_FLOORBOX_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === floorBoxIdx ? 'visible' : 'hidden');
    });

    return currentByHotspot;
}

function setupBedroomClosetMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroomcloset-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const currentByHotspot = applyBedroomClosetRotations(svgDoc);
        svgRoot._bcCurrentVariants = currentByHotspot;

        if (svgRoot.dataset.bcBound === 'true') {
            scheduleBedroomClosetSurfacing();
            return;
        }

        const tipEl = document.getElementById('bedroomcloset-memory-tip');
        const defaultTip = 'hover for the smell of things. one fabric glows when you find it. click any garment for what its pockets remembered. click boxes for keepsakes. fragments may surface on their own.';

        let pendingTipTimer = null;
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 480);
        };
        const setTipImmediate = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('fading');
            tipEl.classList.remove('surfacing');
            tipEl.textContent = text;
        };
        const setTipSurfacing = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                tipEl.classList.add('surfacing');
                setTimeout(() => {
                    if (!document.getElementById('bedroomcloset-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 3600);
                pendingTipTimer = null;
            }, 520);
        };
        svgRoot._bcSetTipSurfacing = setTipSurfacing;

        Object.entries(bedroomclosetMemoryHoverTips).forEach(([hotspotId, defaultHover]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                const variantTips = bedroomclosetGarmentHoverByVariant[hotspotId];
                if (variantTips) {
                    const idx = (svgRoot._bcCurrentVariants || {})[hotspotId] ?? 0;
                    setTipSlow(variantTips[idx] || defaultHover);
                } else {
                    setTipSlow(defaultHover);
                }
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = bedroomclosetMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
            });
        });

        svgRoot.dataset.bcBound = 'true';
        scheduleBedroomClosetSurfacing();
    };

    if (!roomObject.dataset.bcLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.bcLoadHooked = 'true';
    }
    bind();
}

// schedules a hidden fragment to surface on its own every 24-40 seconds
function scheduleBedroomClosetSurfacing() {
    if (bcSurfacingTimerId) clearTimeout(bcSurfacingTimerId);
    const overlay = document.getElementById('bedroomcloset-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 24000 + Math.floor(Math.random() * 16000);
    bcSurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('bedroomcloset-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('bedroomcloset-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = bedroomclosetMemorySurfacingFragments[Math.floor(Math.random() * bedroomclosetMemorySurfacingFragments.length)];
        if (svgRoot?._bcSetTipSurfacing) {
            svgRoot._bcSetTipSurfacing(fragment);
            playBedroomClosetRustle();
        }
        scheduleBedroomClosetSurfacing();
    }, wait);
}

const bedroomclosetCloseBtn = document.getElementById('bedroomcloset-memory-close');
if (bedroomclosetCloseBtn) bedroomclosetCloseBtn.addEventListener('click', closeBedroomClosetMemory);

