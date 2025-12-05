import os
import argparse
import sys
import hashlib

OUTPUT_DIR = "public/gacha"
DATA_OUTPUT_FILE = "gacha_data_snippet.ts"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- Data Definitions ---

# 15 Animals per rarity
ANIMALS = {
    "UR": [
        "Dragon", "Phoenix", "Griffin", "Pegasus", "Kraken",
        "Hydra", "Chimera", "Cerberus", "Leviathan", "Behemoth",
        "Basilisk", "Sphinx", "Yeti", "Bigfoot", "Loch Ness Monster"
    ],
    "SR": [
        "Lion", "Tiger", "Elephant", "Gorilla", "Polar Bear",
        "Rhino", "Hippo", "Grizzly Bear", "Leopard", "Jaguar",
        "Wolf", "Eagle", "Shark", "Whale", "Crocodile"
    ],
    "R": [
        "Giraffe", "Zebra", "Kangaroo", "Panda", "Koala",
        "Cheetah", "Buffalo", "Moose", "Camel", "Ostrich",
        "Falcon", "Owl", "Dolphin", "Octopus", "Cobra"
    ],
    "UC": [
        "Fox", "Raccoon", "Badger", "Beaver", "Otter",
        "Deer", "Goat", "Sheep", "Pig", "Cow",
        "Horse", "Dog", "Cat", "Rabbit", "Squirrel"
    ],
    "C": [
        "Mouse", "Rat", "Chicken", "Duck", "Goose",
        "Pigeon", "Crow", "Sparrow", "Frog", "Toad",
        "Lizard", "Turtle", "Snail", "Ant", "Bee"
    ]
}

# 15 Yokai per rarity
YOKAI = {
    "UR": [
        "Yamata no Orochi", "Kyubi no Kitsune", "Shuten Doji", "Daitengu", "Nurarihyon",
        "Gashadokuro", "Tamamo no Mae", "Emperor Sutoku", "Taira no Masakado", "Otakemaru",
        "Ushi-oni", "Raijin", "Fujin", "Yatagarasu", "Kirin"
    ],
    "SR": [
        "Tengu", "Kappa", "Oni", "Yuki-onna", "Rokurokubi",
        "Umibozu", "Nue", "Tsuchigumo", "Jorogumo", "Wanyudo",
        "Kamaitachi", "Kasa-obake", "Chochin-obake", "Ittan-momen", "Nurikabe"
    ],
    "R": [
        "Zashiki-warashi", "Tanuki", "Kitsune", "Nekomata", "Inugami",
        "Akaname", "Azukiarai", "Sunakake-baba", "Konaki-jiji", "Kappa (River Child)",
        "Tofu-kozo", "Hitotsume-kozo", "Noppera-bo", "Futakuchi-onna", "Baku"
    ],
    "UC": [
        "Karakasa", "Bake-zori", "Mokumokuren", "Keukegen", "Shirime",
        "Betobeto-san", "Kodama", "Amabie", "Ningyo", "Kawauso",
        "Mujina", "Satori", "Yama-biko", "Kijimuna", "Gajumaru"
    ],
    "C": [
        "Ashigaru", "Yurei", "Hitodama", "Onibi", "Kitsunebi",
        "Tsukumogami", "Hone-onna", "Teke-Teke", "Hanako-san", "Kuchisake-onna",
        "Jinmenken", "Tsuchinoko", "Kesaran-pasaran", "Hahakigami", "Buruburu"
    ]
}

RARITY_CONFIG = {
    "UR": {"bg_color": "#FFD700", "border": "#B8860B", "complexity": 5, "weight": 1},
    "SR": {"bg_color": "#C0C0C0", "border": "#A9A9A9", "complexity": 4, "weight": 4},
    "R":  {"bg_color": "#CD7F32", "border": "#8B4513", "complexity": 3, "weight": 15},
    "UC": {"bg_color": "#90EE90", "border": "#228B22", "complexity": 2, "weight": 30},
    "C":  {"bg_color": "#E0FFFF", "border": "#87CEEB", "complexity": 1, "weight": 50},
}

JAPANESE_NAMES = {
    # Animals UR
    "Dragon": "ドラゴン", "Phoenix": "フェニックス", "Griffin": "グリフォン", "Pegasus": "ペガサス", "Kraken": "クラーケン",
    "Hydra": "ヒドラ", "Chimera": "キメラ", "Cerberus": "ケルベロス", "Leviathan": "リヴァイアサン", "Behemoth": "ベヒモス",
    "Basilisk": "バジリスク", "Sphinx": "スフィンクス", "Yeti": "イエティ", "Bigfoot": "ビッグフット", "Loch Ness Monster": "ネッシー",
    # Animals SR
    "Lion": "ライオン", "Tiger": "トラ", "Elephant": "ゾウ", "Gorilla": "ゴリラ", "Polar Bear": "シロクマ",
    "Rhino": "サイ", "Hippo": "カバ", "Grizzly Bear": "ヒグマ", "Leopard": "ヒョウ", "Jaguar": "ジャガー",
    "Wolf": "オオカミ", "Eagle": "ワシ", "Shark": "サメ", "Whale": "クジラ", "Crocodile": "ワニ",
    # Animals R
    "Giraffe": "キリン", "Zebra": "シマウマ", "Kangaroo": "カンガルー", "Panda": "パンダ", "Koala": "コアラ",
    "Cheetah": "チーター", "Buffalo": "バッファロー", "Moose": "ヘラジカ", "Camel": "ラクダ", "Ostrich": "ダチョウ",
    "Falcon": "ハヤブサ", "Owl": "フクロウ", "Dolphin": "イルカ", "Octopus": "タコ", "Cobra": "コブラ",
    # Animals UC
    "Fox": "キツネ", "Raccoon": "アライグマ", "Badger": "アナグマ", "Beaver": "ビーバー", "Otter": "カワウソ",
    "Deer": "シカ", "Goat": "ヤギ", "Sheep": "ヒツジ", "Pig": "ブタ", "Cow": "ウシ",
    "Horse": "ウマ", "Dog": "イヌ", "Cat": "ネコ", "Rabbit": "ウサギ", "Squirrel": "リス",
    # Animals C
    "Mouse": "ネズミ", "Rat": "ドブネズミ", "Chicken": "ニワトリ", "Duck": "アヒル", "Goose": "ガチョウ",
    "Pigeon": "ハト", "Crow": "カラス", "Sparrow": "スズメ", "Frog": "カエル", "Toad": "ヒキガエル",
    "Lizard": "トカゲ", "Turtle": "カメ", "Snail": "カタツムリ", "Ant": "アリ", "Bee": "ハチ",

    # Yokai UR
    "Yamata no Orochi": "ヤマタノオロチ", "Kyubi no Kitsune": "九尾の狐", "Shuten Doji": "酒呑童子", "Daitengu": "大天狗", "Nurarihyon": "ぬらりひょん",
    "Gashadokuro": "がしゃどくろ", "Tamamo no Mae": "玉藻前", "Emperor Sutoku": "崇徳天皇", "Taira no Masakado": "平将門", "Otakemaru": "大嶽丸",
    "Ushi-oni": "牛鬼", "Raijin": "雷神", "Fujin": "風神", "Yatagarasu": "八咫烏", "Kirin": "麒麟",
    # Yokai SR
    "Tengu": "天狗", "Kappa": "河童", "Oni": "鬼", "Yuki-onna": "雪女", "Rokurokubi": "ろくろ首",
    "Umibozu": "海坊主", "Nue": "鵺", "Tsuchigumo": "土蜘蛛", "Jorogumo": "女郎蜘蛛", "Wanyudo": "輪入道",
    "Kamaitachi": "鎌鼬", "Kasa-obake": "傘お化け", "Chochin-obake": "提灯お化け", "Ittan-momen": "一反木綿", "Nurikabe": "ぬりかべ",
    # Yokai R
    "Zashiki-warashi": "座敷童子", "Tanuki": "化け狸", "Kitsune": "妖狐", "Nekomata": "猫又", "Inugami": "犬神",
    "Akaname": "垢嘗", "Azukiarai": "小豆洗い", "Sunakake-baba": "砂かけ婆", "Konaki-jiji": "子泣き爺", "Kappa (River Child)": "川小僧",
    "Tofu-kozo": "豆腐小僧", "Hitotsume-kozo": "一つ目小僧", "Noppera-bo": "のっぺらぼう", "Futakuchi-onna": "二口女", "Baku": "獏",
    # Yokai UC
    "Karakasa": "唐傘", "Bake-zori": "化け草履", "Mokumokuren": "目目連", "Keukegen": "毛羽毛現", "Shirime": "尻目",
    "Betobeto-san": "べとべとさん", "Kodama": "木霊", "Amabie": "アマビエ", "Ningyo": "人魚", "Kawauso": "化け獺",
    "Mujina": "ムジナ", "Satori": "覚", "Yama-biko": "山彦", "Kijimuna": "キジムナー", "Gajumaru": "ガジュマル",
    # Yokai C
    "Ashigaru": "足軽お化け", "Yurei": "幽霊", "Hitodama": "人魂", "Onibi": "鬼火", "Kitsunebi": "狐火",
    "Tsukumogami": "付喪神", "Hone-onna": "骨女", "Teke-Teke": "テケテケ", "Hanako-san": "トイレの花子さん", "Kuchisake-onna": "口裂け女",
    "Jinmenken": "人面犬", "Tsuchinoko": "ツチノコ", "Kesaran-pasaran": "ケサランパサラン", "Hahakigami": "箒神", "Buruburu": "震々"
}

# --- Specific SVG Generators for Uncommon (UC) Items ---
# Designed to be distinct and use natural colors.
SPECIFIC_SVGS = {
    # --- ANIMALS ---
    "uc-a-1": """<rect width="100" height="100" fill="#E6E6FA"/>
        <path d="M25,30 L40,80 L80,30 L50,60 Z" fill="#FF8C00"/> <!-- Fox: Orange Ears/Head -->
        <circle cx="50" cy="65" r="25" fill="#FF8C00"/>
        <path d="M50,90 L35,65 L65,65 Z" fill="#FFF"/> <!-- Muzzle -->
        <circle cx="42" cy="60" r="3" fill="black"/><circle cx="58" cy="60" r="3" fill="black"/>
        <circle cx="50" cy="78" r="4" fill="black"/>""", # Fox (Kitsune)

    "uc-a-2": """<rect width="100" height="100" fill="#F0FFF0"/>
        <circle cx="50" cy="55" r="30" fill="#A9A9A9"/> <!-- Raccoon: Grey -->
        <ellipse cx="50" cy="55" rx="25" ry="12" fill="#333"/> <!-- Mask -->
        <circle cx="40" cy="55" r="3" fill="white"/><circle cx="60" cy="55" r="3" fill="white"/>
        <circle cx="40" cy="55" r="1.5" fill="black"/><circle cx="60" cy="55" r="1.5" fill="black"/>
        <circle cx="50" cy="70" r="3" fill="black"/>""", # Raccoon (Araiguma)

    "uc-a-3": """<rect width="100" height="100" fill="#F5F5DC"/>
        <circle cx="50" cy="55" r="30" fill="#333"/> <!-- Badger: Black -->
        <rect x="45" y="25" width="10" height="40" fill="white"/> <!-- Stripe -->
        <circle cx="40" cy="55" r="3" fill="white"/><circle cx="60" cy="55" r="3" fill="white"/>""", # Badger (Anaguma)

    "uc-a-4": """<rect width="100" height="100" fill="#E0F7FA"/>
        <circle cx="50" cy="50" r="30" fill="#8B4513"/> <!-- Beaver: Brown -->
        <rect x="45" y="70" width="4" height="8" fill="white"/><rect x="51" y="70" width="4" height="8" fill="white"/> <!-- Teeth -->
        <circle cx="42" cy="45" r="3" fill="black"/><circle cx="58" cy="45" r="3" fill="black"/>
        <ellipse cx="50" cy="60" rx="10" ry="5" fill="#333"/>""", # Beaver

    "uc-a-5": """<rect width="100" height="100" fill="#E6E6FA"/>
        <ellipse cx="50" cy="50" rx="25" ry="20" fill="#CD853F"/> <!-- Otter: Brown -->
        <circle cx="30" cy="40" r="5" fill="#CD853F"/><circle cx="70" cy="40" r="5" fill="#CD853F"/> <!-- Ears -->
        <circle cx="42" cy="50" r="2" fill="black"/><circle cx="58" cy="50" r="2" fill="black"/>
        <ellipse cx="50" cy="58" rx="8" ry="4" fill="#FFE4B5"/>""", # Otter (Kawauso)

    "uc-a-6": """<rect width="100" height="100" fill="#F0FFF0"/>
        <path d="M30,20 L35,40 M70,20 L65,40" stroke="#8B4513" stroke-width="3"/> <!-- Antlers -->
        <ellipse cx="50" cy="60" rx="20" ry="25" fill="#DEB887"/> <!-- Deer: Light Brown -->
        <circle cx="42" cy="55" r="3" fill="black"/><circle cx="58" cy="55" r="3" fill="black"/>
        <circle cx="50" cy="70" r="3" fill="black"/>""", # Deer (Shika)

    "uc-a-7": """<rect width="100" height="100" fill="#FFFACD"/>
        <path d="M30,30 Q40,50 50,50 Q60,50 70,30" stroke="#A9A9A9" stroke-width="4" fill="none"/> <!-- Horns -->
        <ellipse cx="50" cy="60" rx="20" ry="25" fill="white"/> <!-- Goat: White -->
        <path d="M50,85 L45,95 L55,95 Z" fill="white"/> <!-- Beard -->
        <circle cx="42" cy="55" r="3" fill="black"/><circle cx="58" cy="55" r="3" fill="black"/>""", # Goat (Yagi)

    "uc-a-8": """<rect width="100" height="100" fill="#E0FFFF"/>
        <circle cx="50" cy="50" r="35" fill="white" stroke="#D3D3D3" stroke-width="5" stroke-dasharray="5,5"/> <!-- Wool -->
        <circle cx="50" cy="50" r="20" fill="#333"/> <!-- Face -->
        <circle cx="42" cy="45" r="2" fill="white"/><circle cx="58" cy="45" r="2" fill="white"/>""", # Sheep (Hitsuji)

    "uc-a-9": """<rect width="100" height="100" fill="#FFE4E1"/>
        <circle cx="50" cy="50" r="30" fill="#FFB6C1"/> <!-- Pig: Pink -->
        <ellipse cx="50" cy="55" rx="10" ry="8" fill="#FF69B4"/> <!-- Snout -->
        <circle cx="47" cy="55" r="2" fill="black"/><circle cx="53" cy="55" r="2" fill="black"/>
        <path d="M30,30 L35,45 L45,30 Z" fill="#FFB6C1"/><path d="M70,30 L65,45 L55,30 Z" fill="#FFB6C1"/> <!-- Ears -->""", # Pig (Buta)

    "uc-a-10": """<rect width="100" height="100" fill="#F0F8FF"/>
        <circle cx="50" cy="55" r="30" fill="white" stroke="black" stroke-width="2"/> <!-- Cow -->
        <path d="M30,40 Q40,30 45,50 T60,60" fill="black" opacity="0.8"/> <!-- Spots -->
        <ellipse cx="50" cy="70" rx="15" ry="10" fill="#FFC0CB"/> <!-- Muzzle -->
        <circle cx="45" cy="70" r="2" fill="black"/><circle cx="55" cy="70" r="2" fill="black"/>""", # Cow (Ushi)

    "uc-a-11": """<rect width="100" height="100" fill="#FDF5E6"/>
        <ellipse cx="50" cy="50" rx="15" ry="30" fill="#8B4513"/> <!-- Horse: Brown -->
        <path d="M50,20 L50,60" stroke="#333" stroke-width="5" opacity="0.5"/> <!-- Mane -->
        <circle cx="45" cy="40" r="2" fill="black"/><circle cx="55" cy="40" r="2" fill="black"/>""", # Horse (Uma)

    "uc-a-12": """<rect width="100" height="100" fill="#FFF8DC"/>
        <circle cx="50" cy="55" r="28" fill="#CD853F"/> <!-- Dog: Brown -->
        <path d="M20,40 L30,60 L40,40 Z" fill="#CD853F"/> <!-- Left Ear -->
        <path d="M80,40 L70,60 L60,40 Z" fill="#CD853F"/> <!-- Right Ear -->
        <circle cx="42" cy="50" r="3" fill="black"/><circle cx="58" cy="50" r="3" fill="black"/>
        <circle cx="50" cy="65" r="4" fill="black"/>""", # Dog (Inu)

    "uc-a-13": """<rect width="100" height="100" fill="#F5F5F5"/>
        <circle cx="50" cy="55" r="28" fill="white"/> <!-- Cat: White -->
        <path d="M30,30 L35,50 L45,40 Z" fill="#FFA500"/> <!-- Orange Ear -->
        <path d="M70,30 L65,50 L55,40 Z" fill="#333"/> <!-- Black Ear -->
        <line x1="20" y1="55" x2="40" y2="55" stroke="black"/><line x1="80" y1="55" x2="60" y2="55" stroke="black"/> <!-- Whiskers -->
        <circle cx="42" cy="50" r="3" fill="black"/><circle cx="58" cy="50" r="3" fill="black"/>""", # Cat (Neko)

    "uc-a-14": """<rect width="100" height="100" fill="#FFF0F5"/>
        <ellipse cx="50" cy="60" rx="25" ry="20" fill="white"/> <!-- Rabbit -->
        <ellipse cx="40" cy="30" rx="5" ry="15" fill="white" stroke="#FFC0CB" stroke-width="3"/> <!-- Ears -->
        <ellipse cx="60" cy="30" rx="5" ry="15" fill="white" stroke="#FFC0CB" stroke-width="3"/>
        <circle cx="42" cy="55" r="2" fill="red"/><circle cx="58" cy="55" r="2" fill="red"/>""", # Rabbit (Usagi)

    "uc-a-15": """<rect width="100" height="100" fill="#F0FFF0"/>
        <circle cx="40" cy="60" r="20" fill="#8B4513"/> <!-- Squirrel -->
        <path d="M50,70 Q70,90 80,60 Q90,30 60,40" fill="#A0522D" stroke="#8B4513"/> <!-- Tail -->
        <circle cx="35" cy="55" r="2" fill="black"/>""", # Squirrel (Risu)

    # --- YOKAI ---
    "uc-y-1": """<rect width="100" height="100" fill="#F0E68C"/>
        <path d="M20,60 L50,10 L80,60 Z" fill="#800080"/> <!-- Karakasa: Umbrella -->
        <rect x="48" y="60" width="4" height="30" fill="#DEB887"/> <!-- Leg -->
        <circle cx="50" cy="40" r="10" fill="white"/><circle cx="50" cy="40" r="3" fill="black"/> <!-- Eye -->
        <path d="M45,50 Q50,65 55,50" fill="red"/> <!-- Tongue -->""", # Karakasa

    "uc-y-2": """<rect width="100" height="100" fill="#FFFACD"/>
        <ellipse cx="50" cy="50" rx="25" ry="40" fill="#F4A460"/> <!-- Bake-zori -->
        <path d="M50,15 L30,40 M50,15 L70,40" stroke="red" stroke-width="3" fill="none"/> <!-- Strap -->
        <circle cx="40" cy="60" r="4" fill="black"/><circle cx="60" cy="60" r="4" fill="black"/>
        <path d="M40,75 Q50,85 60,75" stroke="black" stroke-width="2" fill="none"/>""", # Bake-zori

    "uc-y-3": """<rect width="100" height="100" fill="#D3D3D3"/>
        <rect x="20" y="20" width="60" height="60" fill="#FFF8DC" stroke="#8B4513" stroke-width="4"/> <!-- Mokumokuren: Shoji -->
        <line x1="50" y1="20" x2="50" y2="80" stroke="#8B4513" stroke-width="2"/>
        <line x1="20" y1="50" x2="80" y2="50" stroke="#8B4513" stroke-width="2"/>
        <circle cx="35" cy="35" r="5" fill="black"/><circle cx="65" cy="65" r="5" fill="black"/>
        <circle cx="35" cy="65" r="5" fill="black"/><circle cx="65" cy="35" r="5" fill="black"/>""", # Mokumokuren

    "uc-y-4": """<rect width="100" height="100" fill="#F5F5DC"/>
        <circle cx="50" cy="50" r="35" fill="#696969"/> <!-- Keukegen: Hairball -->
        <path d="M15,50 Q50,10 85,50 Q50,90 15,50" fill="none" stroke="#A9A9A9" stroke-width="2"/> <!-- Hairs -->
        <circle cx="40" cy="45" r="4" fill="white"/><circle cx="40" cy="45" r="1.5" fill="black"/>
        <circle cx="60" cy="45" r="4" fill="white"/><circle cx="60" cy="45" r="1.5" fill="black"/>""", # Keukegen

    "uc-y-5": """<rect width="100" height="100" fill="#E6E6FA"/>
        <ellipse cx="50" cy="50" rx="30" ry="25" fill="#FFE4E1"/> <!-- Shirime: Butt-like shape (abstract) -->
        <circle cx="50" cy="50" r="12" fill="white"/> <!-- Eye -->
        <circle cx="50" cy="50" r="4" fill="black"/>
        <path d="M20,80 L30,60 M80,80 L70,60" stroke="#FFE4E1" stroke-width="5"/> <!-- Legs -->""", # Shirime

    "uc-y-6": """<rect width="100" height="100" fill="#F0F8FF"/>
        <circle cx="50" cy="40" r="25" fill="#E0FFFF" opacity="0.6"/> <!-- Betobeto-san: Transparent -->
        <path d="M40,40 Q50,50 60,40" stroke="black" stroke-width="2" fill="none"/> <!-- Smile -->
        <rect x="35" y="70" width="10" height="5" fill="#8B4513"/> <!-- Clogs -->
        <rect x="55" y="70" width="10" height="5" fill="#8B4513"/>""", # Betobeto-san

    "uc-y-7": """<rect width="100" height="100" fill="#228B22"/>
        <circle cx="50" cy="40" r="20" fill="white"/> <!-- Kodama: Head -->
        <circle cx="50" cy="70" r="10" fill="white"/> <!-- Body -->
        <circle cx="42" cy="40" r="3" fill="black"/>
        <circle cx="58" cy="40" r="3" fill="black"/>
        <circle cx="50" cy="48" r="2" fill="black"/> <!-- Mouth -->""", # Kodama

    "uc-y-8": """<rect width="100" height="100" fill="#E0FFFF"/>
        <path d="M30,30 L70,30 L60,80 L40,80 Z" fill="#98FB98"/> <!-- Amabie: Body -->
        <path d="M50,20 L30,80 M50,20 L70,80" stroke="#FF69B4" stroke-width="2"/> <!-- Hair -->
        <rect x="48" y="40" width="4" height="6" fill="#FFD700"/> <!-- Beak -->
        <circle cx="40" cy="35" r="3" fill="black"/>""", # Amabie

    "uc-y-9": """<rect width="100" height="100" fill="#E0F7FA"/>
        <circle cx="50" cy="30" r="15" fill="#FFE4E1"/> <!-- Ningyo: Head -->
        <path d="M35,45 Q50,90 65,45" fill="#FF7F50"/> <!-- Fish Tail -->
        <path d="M30,20 L70,20" stroke="black" stroke-width="1"/> <!-- Hair -->
        <circle cx="45" cy="30" r="2" fill="black"/><circle cx="55" cy="30" r="2" fill="black"/>""", # Ningyo

    "uc-y-10": """<rect width="100" height="100" fill="#F5DEB3"/>
        <ellipse cx="50" cy="50" rx="20" ry="30" fill="#8B4513"/> <!-- Kawauso (Yokai) -->
        <path d="M30,20 L70,20" stroke="#F4A460" stroke-width="5"/> <!-- Straw Hat rim -->
        <path d="M40,20 L50,5 L60,20" fill="#F4A460"/> <!-- Hat top -->
        <circle cx="45" cy="40" r="2" fill="black"/><circle cx="55" cy="40" r="2" fill="black"/>
        <rect x="60" y="50" width="10" height="20" fill="white" stroke="black"/> <!-- Sake bottle -->""", # Kawauso

    "uc-y-11": """<rect width="100" height="100" fill="#2F4F4F"/>
        <circle cx="50" cy="50" r="25" fill="#696969"/> <!-- Mujina -->
        <path d="M20,10 L80,10 L50,90 Z" fill="none" stroke="black" opacity="0.1"/> <!-- Shadow -->
        <circle cx="40" cy="50" r="2" fill="white"/><circle cx="60" cy="50" r="2" fill="white"/>
        <path d="M45,20 Q50,10 55,20" fill="#228B22"/> <!-- Leaf on head -->""", # Mujina

    "uc-y-12": """<rect width="100" height="100" fill="#FFE4B5"/>
        <circle cx="50" cy="50" r="30" fill="#8B4513"/> <!-- Satori -->
        <circle cx="40" cy="45" r="4" fill="white"/><circle cx="40" cy="45" r="1" fill="black"/>
        <circle cx="60" cy="45" r="4" fill="white"/><circle cx="60" cy="45" r="1" fill="black"/>
        <path d="M45,25 Q50,15 55,25" fill="none" stroke="red" stroke-width="2"/> <!-- Third Eye slit -->""", # Satori

    "uc-y-13": """<rect width="100" height="100" fill="#E6E6FA"/>
        <circle cx="50" cy="60" r="20" fill="#A9A9A9"/> <!-- Yama-biko -->
        <circle cx="25" cy="50" r="10" fill="#A9A9A9"/> <!-- Big Ears -->
        <circle cx="75" cy="50" r="10" fill="#A9A9A9"/>
        <path d="M45,60 Q50,70 55,60" stroke="black" stroke-width="1" fill="none"/>""", # Yama-biko

    "uc-y-14": """<rect width="100" height="100" fill="#F08080"/>
        <circle cx="50" cy="50" r="25" fill="#FF4500"/> <!-- Kijimuna: Red Body -->
        <path d="M30,20 L40,30 L50,15 L60,30 L70,20" stroke="#FF0000" stroke-width="3" fill="none"/> <!-- Wild Hair -->
        <circle cx="42" cy="45" r="3" fill="white"/><circle cx="58" cy="45" r="3" fill="white"/>
        <path d="M45,60 Q50,65 55,60" stroke="white" stroke-width="2" fill="none"/>""", # Kijimuna

    "uc-y-15": """<rect width="100" height="100" fill="#90EE90"/>
        <rect x="40" y="40" width="20" height="40" fill="#8B4513"/> <!-- Gajumaru: Trunk -->
        <circle cx="50" cy="40" r="30" fill="#228B22"/> <!-- Leaves -->
        <circle cx="45" cy="40" r="2" fill="black"/><circle cx="55" cy="40" r="2" fill="black"/>
        <path d="M45,50 Q50,55 55,50" stroke="black" stroke-width="1" fill="none"/>""", # Gajumaru
}

def generate_svg_content(name, type_cat, rarity, item_id):
    """Generates SVG content based on rarity and type. Prefer specific SVG if available."""

    # Check for specific SVG definition first
    if item_id in SPECIFIC_SVGS:
        content = SPECIFIC_SVGS[item_id]
        return f'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">{content}</svg>'

    # Fallback to procedural generation for other rarities
    config = RARITY_CONFIG[rarity]
    complexity = config["complexity"]

    # Base colors
    bg_color = config["bg_color"]
    border_color = config["border"]

    # Deterministic "Random" colors based on name hash
    h = int(hashlib.sha256(name.encode('utf-8')).hexdigest(), 16)
    hue = h % 360

    primary_color = f"hsl({hue}, 70%, 50%)"
    secondary_color = f"hsl({(hue + 30) % 360}, 70%, 60%)"
    detail_color = f"hsl({(hue + 180) % 360}, 60%, 40%)"

    svg_elements = []

    # 1. Background
    if complexity >= 5: # UR: Gradient
        svg_elements.append(f'''
        <defs>
            <radialGradient id="grad_{hue}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style="stop-color:{bg_color};stop-opacity:1" />
                <stop offset="100%" style="stop-color:{border_color};stop-opacity:1" />
            </radialGradient>
            <filter id="glow_{hue}">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <rect width="100" height="100" fill="url(#grad_{hue})" />
        ''')
    elif complexity >= 3: # R, SR: Solid with pattern
        svg_elements.append(f'<rect width="100" height="100" fill="{bg_color}" />')
        # Add pattern
        for i in range(0, 100, 20):
             svg_elements.append(f'<line x1="{i}" y1="0" x2="{i}" y2="100" stroke="{border_color}" stroke-width="1" opacity="0.3" />')
             svg_elements.append(f'<line x1="0" y1="{i}" x2="100" y2="{i}" stroke="{border_color}" stroke-width="1" opacity="0.3" />')
    else: # C, UC: Solid
        svg_elements.append(f'<rect width="100" height="100" fill="{bg_color}" rx="10" ry="10" />')

    # 2. Main Shape (Body/Face)
    cx, cy = 50, 50
    r = 30 + (complexity * 2)

    shape_type = h % 3
    if shape_type == 0: # Circle
        svg_elements.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{primary_color}" stroke="{border_color}" stroke-width="{complexity}" />')
    elif shape_type == 1: # Rect
        svg_elements.append(f'<rect x="{cx-r}" y="{cy-r}" width="{r*2}" height="{r*2}" fill="{primary_color}" stroke="{border_color}" stroke-width="{complexity}" rx="5" />')
    else: # Triangle
        p1 = f"{cx},{cy-r}"
        p2 = f"{cx+r},{cy+r}"
        p3 = f"{cx-r},{cy+r}"
        svg_elements.append(f'<polygon points="{p1} {p2} {p3}" fill="{primary_color}" stroke="{border_color}" stroke-width="{complexity}" />')

    # 3. Features (Eyes, Mouth) - complexity adds more details
    eye_offset_x = 10 + complexity
    eye_offset_y = 10
    eye_size = 3 + complexity

    # Eyes
    svg_elements.append(f'<circle cx="{cx - eye_offset_x}" cy="{cy - eye_offset_y}" r="{eye_size}" fill="white" />')
    svg_elements.append(f'<circle cx="{cx + eye_offset_x}" cy="{cy - eye_offset_y}" r="{eye_size}" fill="white" />')
    svg_elements.append(f'<circle cx="{cx - eye_offset_x}" cy="{cy - eye_offset_y}" r="{eye_size/2}" fill="black" />')
    svg_elements.append(f'<circle cx="{cx + eye_offset_x}" cy="{cy - eye_offset_y}" r="{eye_size/2}" fill="black" />')

    # Mouth
    if complexity >= 3:
        svg_elements.append(f'<path d="M {cx-10} {cy+10} Q {cx} {cy+20} {cx+10} {cy+10}" stroke="black" stroke-width="2" fill="none" />')
    else:
        svg_elements.append(f'<line x1="{cx-5}" y1="{cy+15}" x2="{cx+5}" y2="{cy+15}" stroke="black" stroke-width="2" />')

    # 4. Details (Decorations) - Specific to type and rarity
    if type_cat == "Yokai":
        # Yokai get "flames" or "aura"
        if complexity >= 4:
            svg_elements.append(f'<circle cx="{cx+35}" cy="{cy-30}" r="8" fill="{secondary_color}" opacity="0.7" />')
            svg_elements.append(f'<circle cx="{cx-35}" cy="{cy-30}" r="8" fill="{secondary_color}" opacity="0.7" />')
    else:
        # Animals get "ears" or "tails" hint
         svg_elements.append(f'<circle cx="{cx-25}" cy="{cy-35}" r="10" fill="{primary_color}" />')
         svg_elements.append(f'<circle cx="{cx+25}" cy="{cy-35}" r="10" fill="{primary_color}" />')

    # UR Glow Effect
    filter_attr = f'filter="url(#glow_{hue})"' if complexity == 5 else ''

    svg_content = f'''<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {filter_attr}>
    {''.join(svg_elements)}
    </svg>'''

    return svg_content

def main():
    parser = argparse.ArgumentParser(description='Generate Gacha Assets')
    parser.add_argument('--rarity', type=str, help='Specific rarity to generate (UR, SR, R, UC, C). If not provided, generates only the TS file.')
    args = parser.parse_args()

    # Collect all items for TS file generation
    items_list = []

    target_rarities = [args.rarity] if args.rarity else []

    # Iterate through all rarities to build the list, but only generate files for the target
    for rarity in ["UR", "SR", "R", "UC", "C"]:

        # Animals
        for i, name in enumerate(ANIMALS[rarity]):
            item_id = f"{rarity.lower()}-a-{i+1}"
            jp_name = JAPANESE_NAMES.get(name, name)
            filename = f"{item_id}-{name.lower().replace(' ', '-')}.svg"
            filepath = os.path.join(OUTPUT_DIR, filename)

            if rarity in target_rarities:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(generate_svg_content(name, "Animal", rarity, item_id))

            items_list.append({
                "id": item_id,
                "name": jp_name,
                "rarity": rarity,
                "description": f"{rarity}ランクのどうぶつ: {jp_name}",
                "imageUrl": f"/gacha/{filename}"
            })

        # Yokai
        for i, name in enumerate(YOKAI[rarity]):
            item_id = f"{rarity.lower()}-y-{i+1}"
            jp_name = JAPANESE_NAMES.get(name, name)
            filename = f"{item_id}-{name.lower().replace(' ', '-')}.svg"
            filepath = os.path.join(OUTPUT_DIR, filename)

            if rarity in target_rarities:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(generate_svg_content(name, "Yokai", rarity, item_id))

            items_list.append({
                "id": item_id,
                "name": jp_name,
                "rarity": rarity,
                "description": f"{rarity}ランクのようかい: {jp_name}",
                "imageUrl": f"/gacha/{filename}"
            })

    # Always generate TypeScript Data Snippet when running without args or as a separate step
    # For now, let's just generate it every time or when requested?
    # Let's generate it only when NO rarity is specified to avoid rewriting it 5 times,
    # OR just write it every time since it's one file. One file is fine.

    ts_content = "export const GACHA_ITEMS: GachaItem[] = [\n"
    for item in items_list:
        ts_content += f"  {{ id: '{item['id']}', name: '{item['name']}', rarity: '{item['rarity']}', description: '{item['description']}', imageUrl: '{item['imageUrl']}' }},\n"
    ts_content += "];\n"

    with open(DATA_OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    if args.rarity:
        print(f"Generated SVGs for {args.rarity}")
    else:
        print("Generated Data Snippet")

if __name__ == "__main__":
    main()
