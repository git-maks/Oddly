// Original, hand-curated word lists. No runtime downloads or third-party data.
// Each entry is a single PascalCase component; multiword animal names stay readable.
const words = (text) => Object.freeze(text.trim().split(/\s+/));

export const adjectives = words(`
  Able Agile Amber Amiable Ample Arctic Ashen Astral Auburn Autumn Azure
  Balanced Barefoot Beaming Blissful Blooming Blue Bold Bouncy Brave Breezy Bright Brisk Bronze Buoyant
  Calm Candied Careful Caring Casual Cedar Charming Cheerful Cherry Chilly Clever Cloudy Cobalt Cocoa Cozy Crisp Curious
  Dainty Dancing Dapper Daring Dawn Dazzling Deep Dewy Dreamy Drifting Dusky
  Eager Early Earthy Easy Electric Emerald Epic Even
  Fair Faithful Fancy Faraway Fast Fearless Feathered Fern Fierce Fiery Fine Floral Fluffy Flying Fond Forest Foxy Free Fresh Friendly Frosty Fuzzy
  Gentle Giddy Ginger Glacial Glowing Golden Graceful Grand Grassy Gray Green Groovy
  Happy Hardy Hasty Hazy Hearty Hidden Hollow Honest Honey Hopeful Humble Hushed
  Icy Indigo Inky Ivory Jade Jolly Jovial Joyful Jumpy Keen Kind Kindly Kinetic
  Leafy Lemon Light Lilac Lively Lofty Lone Lost Lovely Loyal Lucky Lunar Lush
  Magic Maple Marble Meadow Merry Mellow Midnight Mighty Mild Minty Misty Modest Mossy
  Neat Neon Nimble Noble Noisy Nordic Nutty
  Ocean Olive Onyx Opal Orange
  Pale Pastel Patient Peachy Peppy Perky Petal Pink Placid Playful Plucky Plush Polar Polite Poppy Proud Pure
  Quaint Quick Quiet Quirky
  Radiant Rainy Rapid Ready Regal Restful Rosy Round Royal Ruby Ruddy Rustic
  Sage Sandy Satin Scarlet Secret Serene Shady Sharp Shiny Shy Silent Silky Silver Simple Sleepy Slick Smart Smoky Snappy Snowy Snug Soft Solar Solid Sonic Sparkly Speedy Spry Starry Steady Stellar Still Stormy Sunny Swift
  Tall Tangy Tawny Tender Tiny Toasty Tricky True Tundra Turquoise
  Upbeat Urban Valiant Velvet Verdant Violet Vivid
  Wandering Warm Wavy Whimsy Whirling Whispering Wild Windy Winged Wise Witty Wondrous Woolly
  Yellow Young Zany Zesty Zippy
`);

export const uncommonAdjectives = words(`
  Acanthine Acerbic Adamant Adamantine Aerial Aetheric Alabaster Amaranthine Ambrosial Anfractuous Antic Aphelian Apocryphal Apricity Aquiver Arcadian Arcane Argent Arioso Atavistic Auric Auspicious Austere Azimuthal
  Baroque Benthic Berylline Blithesome Boreal Brumous Bucolic Byronic
  Cadent Caerulean Caliginous Cambrian Canorous Capricious Cassian Catawampus Celadon Cerulean Chimeric Chthonic Cimmerian Citrine Coralline Coruscant Crepuscular Cryptic Cupric Cytherean
  Dappled Deciduous Delphic Diaphanous Dithyrambic Dormant Dulcet
  Eburnean Eldritch Elysian Empyreal Enigmatic Ephemeral Equable Equinoctial Erudite Evanescent Eventide Exuberant
  Faerie Fallow Feral Fervent Filigreed Flaxen Florid Fractal Frangible Fugacious Fulgent Fulgurous Furtive
  Gamboge Gibbous Glabrous Glaucous Gossamer Gracile Granular Gregarious
  Halcyon Heliacal Hermetic Hibernal Hyaline Hypnagogic
  Iambic Ichorous Idyllic Ignivagant Illuvial Imbricate Ineffable Infrasonic Iridescent Isotropic
  Jovian Jubilant Junoesque
  Kaleidic Kermes Kinesthetic
  Laconic Lacustrine Lambent Lapidary Lazuline Liminal Lissome Littoral Logarithmic Lucent Lucid Lugubrious Luminous Lusory
  Macabre Madrigal Malachite Mellifluent Mercurial Meridional Metamorphic Moiric Monadic Monastic Mordant Murmurous Mycelial Myriad Mythic
  Nacreous Nebular Nebulous Nemoral Neoteric Noctilucent Nocturnal Numinous
  Oblique Obsidian Occult Ochre Odic Oleander Olivine Oneiric Opaline Oracular Orbital Oscillating Ossianic Ostrobogulous
  Paludal Panoramic Papery Parabolic Pellucid Penumbral Perihelian Peripatetic Petrichoric Phantasmal Phosphoric Phrygian Pilose Pluvial Prismatic Protean Puckish Pulsatile Pyrrhic
  Quiescent Quincuncial Quixotic
  Raconteur Ravelled Recondite Redolent Reticulate Rhizomatic Riparian Roriferous Rutilant
  Saffron Salient Sanguine Sapient Saturnine Scintillant Selenic Sepulchral Seraphic Serpentine Sidereal Silvan Solivagant Somnolent Sonorous Spindrift Sporadic Stygian Sublunar Susurrant Syzygetic
  Tacit Telluric Tenebrous Tessellated Thaumic Thistly Threnodic Translucent Tremulous Trigonal Tumulose Turbid Tyrian
  Umbral Uncanny Undulant Unfathomed Unhurried Utopian
  Vagant Vagrant Vellum Venatic Verdigris Vermilion Vernal Versatile Vespertine Vestigial Viridian Vitreous Volant Vulpine
  Widdershins Winsome Wistful Wyrd Xanthic Xeric Yonder Yugen Zephyric Zibeline Zodiacal
`);

export const animals = words(`
  Aardvark Albatross Alligator Alpaca Anaconda Anchovy Angelfish Ant Anteater Antelope ArcticFox Armadillo Axolotl
  Baboon Badger Barracuda Bat Bear Beaver Bee Beetle Bison Blackbird Bluebird Bluejay Boa Bobcat Bonobo Buffalo Bumblebee Bunny Butterfly
  Camel Capybara Cardinal Caribou Carp Cassowary Cat Caterpillar Catfish Chameleon Cheetah Chickadee Chicken Chinchilla Chipmunk Cicada Clam Cobra Cockatoo Cod Condor Corgi Cormorant Cougar Coyote Crab Crane Crayfish Cricket Crocodile Crow Cuttlefish
  Deer Dingo Dolphin Donkey Dove Dragonfly Duck Dugong
  Eagle Echidna Eel Egret Elephant Elk Emu Ermine
  Falcon Fawn Ferret Finch Firefly Flamingo Flounder Fox Frog
  Gazelle Gecko Gerbil Gibbon Giraffe Glowworm Goat Goldfinch Goldfish Goose Gopher Gorilla Grasshopper Grouse Guppy
  Haddock Hamster Hare Hawk Hedgehog Heron Herring Hippo Honeybee Hoopoe Hornbill Hornet Horse Hummingbird Husky Hyena
  Ibex Ibis Iguana Impala
  Jackal Jaguar Jay Jellyfish Jerboa
  Kakapo Kangaroo Kestrel Kingfisher Kinkajou Kiwi Koala Koi Komodo Kookaburra
  Ladybug Lark Lemur Leopard Lion Lizard Llama Lobster Locust Loon Lorikeet Loris Lynx
  Macaque Macaw Magpie Mallard Manatee Mandrill MantaRay Marmot Meerkat Mink Minnow Mockingbird Mole Mongoose Moose Moth Mouse Mudskipper
  Narwhal Newt Nightingale Numbat
  Octopus Okapi Opossum Orangutan Orca Oriole Oryx Osprey Ostrich Otter Owl Ox Oyster
  Panda Pangolin Panther Parakeet Parrot Partridge Peacock Pelican Penguin Perch Pheasant Pig Pigeon Pika Pike Platypus PolarBear Pony Porcupine Porpoise Possum Prawn Puffin Puma
  Quail Quetzal Quokka Quoll
  Rabbit Raccoon Ram Raven RedPanda Reindeer Rhino Robin Rooster
  Salamander Salmon Sandpiper Sardine Seal Seahorse Shark Sheep Shrew Shrimp Siamang Silkworm Skink Sloth Snail Snake SnowLeopard Sparrow Spoonbill Squid Squirrel Starfish Starling Stingray Stoat Stork SugarGlider Swallow Swan Swift
  Tamarin Tapir Tarantula Tarsier TasmanianDevil Termite Tern Tiger Toad Tortoise Toucan Trout Tuna Turkey Turtle
  Vicuña Viper Vole Vulture
  Wallaby Walrus Warthog Wasp Waxwing Weasel Whale Wildcat Wildebeest Wolf Wolverine Wombat Woodpecker Wren
  Yak Zebra
`);

export const uncommonAnimals = words(`
  Aardwolf Addax Agouti Akiapolaau Aoudad Aracari Argali Arowana Aurochs Avocet AyeAye
  Babirusa Bandicoot Banteng Barbet Basilisk Batfish Bettong Bilby Binturong Blesbok BlueDuiker Bobolink Bongo Bontebok Budgerigar Bushbaby Bushshrike
  Cacique Caecilian Caiman Caracal Caracara Cavy Chacma Chamois Chevrotain Chough Cisticola Civet Coati Cockle Colugo Copepod Cotinga Coypu Cuscus
  Dassie Dhole DikDik Dipper Douc Drongo Duiker Dunlin
  Eider Eland Eulachon Fennec Finfoot Fossa Francolin Frigatebird Fulmar
  Galago Galah Gar Gaur Genet Gerenuk Gharial Gnu Goosander Grebe Grysbok Guanaco Gudgeon Guillemot
  Hartebeest Hawfinch Hoatzin Hoolock Huemul Hutia Hyrax
  Ibon Indri Jacamar Jacana Jaeger Javelina Junco
  Kagu Kakomistle Kaluga Karakul Kea Kiang Klipspringer Kob Kodkod Kouprey Kudu Kusimanse
  Langur Lapwing Leafbird Lechwe Leptotyphlops Limpkin Linsang Lyrebird
  Malleefowl Mara Margay Markhor Megapode Merganser Moloch Monal Moonrat Motmot Muntjac Muskox
  Nilgai Nudibranch Numbray Nyala Ocelot Olm Onager Oropendola
  Pademelon PallasCat Pangasius Peccary Peeper Phalarope Pichiciego Pipistrelle Plover Pochard Potoo Potto Puku
  Ragfish Ratel Rhea Rockhopper Rook Ruff
  Saiga Saki Sanderling Saola Sapsucker Sengi Serval Shearwater Shoebill Sifaka Siskin Skua Solenodon Springbok Surili
  Tahr Takahē Takin Tamandua Tanuki Tenrec Thornbill Tinamou Topi Treecreeper Trogon Tuatara Tui
  Uakari Urial Vaquita Vervet Viscacha Wapiti Weka Whimbrel Wobbegong Xenops Yapok Yellowhammer Zebu Zokor Zorilla
`);

// Fixed-width syllables keep different syllable recipes distinct before joining.
export const prefixes = words(`
  aer alf amb ara ash aur axi azu bel bri cal cel cer cim cor cry dal del dra dus
  eir eld elm eri eth fal fen fer fyr gal glo gre hal hel hex hyr icy ign ilk iro
  ivy jad jas jor kae kel kin kir kor kry lar lum lun lyr mal mel mir mor myr neb
  nex nix nor nov nyl obs och oli ony ori oth oxy pyr qua qui rav rhy syl tor vex
  vir vox wyr xan xen xyl yor zen zer zin zyr
`);

export const middles = words(`
  ba be bi bo bu ca ce ci co cu da de di do du fa fe fi fo fu ga ge gi go gu
  ha he hi ho hu ka ke ki ko ku la le li lo lu ma me mi mo mu na ne ni no nu
  pa pe pi po pu ra re ri ro ru sa se si so su ta te ti to tu va ve vi vo vu
  xa xe xi xo xu za ze zi zo zu
`);

export const endings = words(`
  ane ant aro ary ast ava avi axe ele elm ena ene eno ent era eri ero esa ese eto
  ial ian ias ica ice ict ido iel ien ier ife ika ila ile ilo ina ine ino ion ior ira
  iri ish ist ite iva ive ivo ixu oda ode odo ola ole oli olo ona one oni ora ore
  ori ose oth oto ous oxa ula ule uli ulo uma ume una une uri uro ust uva uve yne
`);

// ASCII handles work on more platforms. Keep the original words readable above.
const asciiWord = (word) => word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const unique = (list) => Object.freeze([...new Set(list.map(asciiWord))]);
export const cleanAdjectives = unique(adjectives);
export const rareAdjectives = unique(uncommonAdjectives);
export const cleanAnimals = unique(animals);
export const allAdjectives = unique([...adjectives, ...uncommonAdjectives]);
export const allAnimals = unique([...animals, ...uncommonAnimals]);
