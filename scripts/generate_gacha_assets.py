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

# --- Specific SVG Generators ---
SPECIFIC_SVGS = {
    # === UNCOMMON (UC) ===
    # Simple shapes, flat colors
    "uc-a-1": """<rect width="100" height="100" fill="#E6E6FA"/>
        <path d="M25,30 L40,80 L80,30 L50,60 Z" fill="#FF8C00"/>
        <circle cx="50" cy="65" r="25" fill="#FF8C00"/>
        <path d="M50,90 L35,65 L65,65 Z" fill="#FFF"/>
        <circle cx="42" cy="60" r="3" fill="black"/><circle cx="58" cy="60" r="3" fill="black"/>
        <circle cx="50" cy="78" r="4" fill="black"/>""",
    "uc-a-2": """<rect width="100" height="100" fill="#F0FFF0"/>
        <circle cx="50" cy="55" r="30" fill="#A9A9A9"/>
        <ellipse cx="50" cy="55" rx="25" ry="12" fill="#333"/>
        <circle cx="40" cy="55" r="3" fill="white"/><circle cx="60" cy="55" r="3" fill="white"/>
        <circle cx="40" cy="55" r="1.5" fill="black"/><circle cx="60" cy="55" r="1.5" fill="black"/>
        <circle cx="50" cy="70" r="3" fill="black"/>""",
    "uc-a-3": """<rect width="100" height="100" fill="#F5F5DC"/>
        <circle cx="50" cy="55" r="30" fill="#333"/>
        <rect x="45" y="25" width="10" height="40" fill="white"/>
        <circle cx="40" cy="55" r="3" fill="white"/><circle cx="60" cy="55" r="3" fill="white"/>""",
    "uc-a-4": """<rect width="100" height="100" fill="#E0F7FA"/>
        <circle cx="50" cy="50" r="30" fill="#8B4513"/>
        <rect x="45" y="70" width="4" height="8" fill="white"/><rect x="51" y="70" width="4" height="8" fill="white"/>
        <circle cx="42" cy="45" r="3" fill="black"/><circle cx="58" cy="45" r="3" fill="black"/>
        <ellipse cx="50" cy="60" rx="10" ry="5" fill="#333"/>""",
    "uc-a-5": """<rect width="100" height="100" fill="#E6E6FA"/>
        <ellipse cx="50" cy="50" rx="25" ry="20" fill="#CD853F"/>
        <circle cx="30" cy="40" r="5" fill="#CD853F"/><circle cx="70" cy="40" r="5" fill="#CD853F"/>
        <circle cx="42" cy="50" r="2" fill="black"/><circle cx="58" cy="50" r="2" fill="black"/>
        <ellipse cx="50" cy="58" rx="8" ry="4" fill="#FFE4B5"/>""",
    "uc-a-6": """<rect width="100" height="100" fill="#F0FFF0"/>
        <path d="M30,20 L35,40 M70,20 L65,40" stroke="#8B4513" stroke-width="3"/>
        <ellipse cx="50" cy="60" rx="20" ry="25" fill="#DEB887"/>
        <circle cx="42" cy="55" r="3" fill="black"/><circle cx="58" cy="55" r="3" fill="black"/>
        <circle cx="50" cy="70" r="3" fill="black"/>""",
    "uc-a-7": """<rect width="100" height="100" fill="#FFFACD"/>
        <path d="M30,30 Q40,50 50,50 Q60,50 70,30" stroke="#A9A9A9" stroke-width="4" fill="none"/>
        <ellipse cx="50" cy="60" rx="20" ry="25" fill="white"/>
        <path d="M50,85 L45,95 L55,95 Z" fill="white"/>
        <circle cx="42" cy="55" r="3" fill="black"/><circle cx="58" cy="55" r="3" fill="black"/>""",
    "uc-a-8": """<rect width="100" height="100" fill="#E0FFFF"/>
        <circle cx="50" cy="50" r="35" fill="white" stroke="#D3D3D3" stroke-width="5" stroke-dasharray="5,5"/>
        <circle cx="50" cy="50" r="20" fill="#333"/>
        <circle cx="42" cy="45" r="2" fill="white"/><circle cx="58" cy="45" r="2" fill="white"/>""",
    "uc-a-9": """<rect width="100" height="100" fill="#FFE4E1"/>
        <circle cx="50" cy="50" r="30" fill="#FFB6C1"/>
        <ellipse cx="50" cy="55" rx="10" ry="8" fill="#FF69B4"/>
        <circle cx="47" cy="55" r="2" fill="black"/><circle cx="53" cy="55" r="2" fill="black"/>
        <path d="M30,30 L35,45 L45,30 Z" fill="#FFB6C1"/><path d="M70,30 L65,45 L55,30 Z" fill="#FFB6C1"/>""",
    "uc-a-10": """<rect width="100" height="100" fill="#F0F8FF"/>
        <circle cx="50" cy="55" r="30" fill="white" stroke="black" stroke-width="2"/>
        <path d="M30,40 Q40,30 45,50 T60,60" fill="black" opacity="0.8"/>
        <ellipse cx="50" cy="70" rx="15" ry="10" fill="#FFC0CB"/>
        <circle cx="45" cy="70" r="2" fill="black"/><circle cx="55" cy="70" r="2" fill="black"/>""",
    "uc-a-11": """<rect width="100" height="100" fill="#FDF5E6"/>
        <ellipse cx="50" cy="50" rx="15" ry="30" fill="#8B4513"/>
        <path d="M50,20 L50,60" stroke="#333" stroke-width="5" opacity="0.5"/>
        <circle cx="45" cy="40" r="2" fill="black"/><circle cx="55" cy="40" r="2" fill="black"/>""",
    "uc-a-12": """<rect width="100" height="100" fill="#FFF8DC"/>
        <circle cx="50" cy="55" r="28" fill="#CD853F"/>
        <path d="M20,40 L30,60 L40,40 Z" fill="#CD853F"/>
        <path d="M80,40 L70,60 L60,40 Z" fill="#CD853F"/>
        <circle cx="42" cy="50" r="3" fill="black"/><circle cx="58" cy="50" r="3" fill="black"/>
        <circle cx="50" cy="65" r="4" fill="black"/>""",
    "uc-a-13": """<rect width="100" height="100" fill="#F5F5F5"/>
        <circle cx="50" cy="55" r="28" fill="white"/>
        <path d="M30,30 L35,50 L45,40 Z" fill="#FFA500"/>
        <path d="M70,30 L65,50 L55,40 Z" fill="#333"/>
        <line x1="20" y1="55" x2="40" y2="55" stroke="black"/><line x1="80" y1="55" x2="60" y2="55" stroke="black"/>
        <circle cx="42" cy="50" r="3" fill="black"/><circle cx="58" cy="50" r="3" fill="black"/>""",
    "uc-a-14": """<rect width="100" height="100" fill="#FFF0F5"/>
        <ellipse cx="50" cy="60" rx="25" ry="20" fill="white"/>
        <ellipse cx="40" cy="30" rx="5" ry="15" fill="white" stroke="#FFC0CB" stroke-width="3"/>
        <ellipse cx="60" cy="30" rx="5" ry="15" fill="white" stroke="#FFC0CB" stroke-width="3"/>
        <circle cx="42" cy="55" r="2" fill="red"/><circle cx="58" cy="55" r="2" fill="red"/>""",
    "uc-a-15": """<rect width="100" height="100" fill="#F0FFF0"/>
        <circle cx="40" cy="60" r="20" fill="#8B4513"/>
        <path d="M50,70 Q70,90 80,60 Q90,30 60,40" fill="#A0522D" stroke="#8B4513"/>
        <circle cx="35" cy="55" r="2" fill="black"/>""",
    "uc-y-1": """<rect width="100" height="100" fill="#F0E68C"/>
        <path d="M20,60 L50,10 L80,60 Z" fill="#800080"/>
        <rect x="48" y="60" width="4" height="30" fill="#DEB887"/>
        <circle cx="50" cy="40" r="10" fill="white"/><circle cx="50" cy="40" r="3" fill="black"/>
        <path d="M45,50 Q50,65 55,50" fill="red"/>""",
    "uc-y-2": """<rect width="100" height="100" fill="#FFFACD"/>
        <ellipse cx="50" cy="50" rx="25" ry="40" fill="#F4A460"/>
        <path d="M50,15 L30,40 M50,15 L70,40" stroke="red" stroke-width="3" fill="none"/>
        <circle cx="40" cy="60" r="4" fill="black"/><circle cx="60" cy="60" r="4" fill="black"/>
        <path d="M40,75 Q50,85 60,75" stroke="black" stroke-width="2" fill="none"/>""",
    "uc-y-3": """<rect width="100" height="100" fill="#D3D3D3"/>
        <rect x="20" y="20" width="60" height="60" fill="#FFF8DC" stroke="#8B4513" stroke-width="4"/>
        <line x1="50" y1="20" x2="50" y2="80" stroke="#8B4513" stroke-width="2"/>
        <line x1="20" y1="50" x2="80" y2="50" stroke="#8B4513" stroke-width="2"/>
        <circle cx="35" cy="35" r="5" fill="black"/><circle cx="65" cy="65" r="5" fill="black"/>
        <circle cx="35" cy="65" r="5" fill="black"/><circle cx="65" cy="35" r="5" fill="black"/>""",
    "uc-y-4": """<rect width="100" height="100" fill="#F5F5DC"/>
        <circle cx="50" cy="50" r="35" fill="#696969"/>
        <path d="M15,50 Q50,10 85,50 Q50,90 15,50" fill="none" stroke="#A9A9A9" stroke-width="2"/>
        <circle cx="40" cy="45" r="4" fill="white"/><circle cx="40" cy="45" r="1.5" fill="black"/>
        <circle cx="60" cy="45" r="4" fill="white"/><circle cx="60" cy="45" r="1.5" fill="black"/>""",
    "uc-y-5": """<rect width="100" height="100" fill="#E6E6FA"/>
        <ellipse cx="50" cy="50" rx="30" ry="25" fill="#FFE4E1"/>
        <circle cx="50" cy="50" r="12" fill="white"/>
        <circle cx="50" cy="50" r="4" fill="black"/>
        <path d="M20,80 L30,60 M80,80 L70,60" stroke="#FFE4E1" stroke-width="5"/>""",
    "uc-y-6": """<rect width="100" height="100" fill="#F0F8FF"/>
        <circle cx="50" cy="40" r="25" fill="#E0FFFF" opacity="0.6"/>
        <path d="M40,40 Q50,50 60,40" stroke="black" stroke-width="2" fill="none"/>
        <rect x="35" y="70" width="10" height="5" fill="#8B4513"/>
        <rect x="55" y="70" width="10" height="5" fill="#8B4513"/>""",
    "uc-y-7": """<rect width="100" height="100" fill="#228B22"/>
        <circle cx="50" cy="40" r="20" fill="white"/>
        <circle cx="50" cy="70" r="10" fill="white"/>
        <circle cx="42" cy="40" r="3" fill="black"/>
        <circle cx="58" cy="40" r="3" fill="black"/>
        <circle cx="50" cy="48" r="2" fill="black"/>""",
    "uc-y-8": """<rect width="100" height="100" fill="#E0FFFF"/>
        <path d="M30,30 L70,30 L60,80 L40,80 Z" fill="#98FB98"/>
        <path d="M50,20 L30,80 M50,20 L70,80" stroke="#FF69B4" stroke-width="2"/>
        <rect x="48" y="40" width="4" height="6" fill="#FFD700"/>
        <circle cx="40" cy="35" r="3" fill="black"/>""",
    "uc-y-9": """<rect width="100" height="100" fill="#E0F7FA"/>
        <circle cx="50" cy="30" r="15" fill="#FFE4C4"/>
        <path d="M35,45 Q50,90 65,45" fill="#FF7F50"/>
        <path d="M30,20 L70,20" stroke="black" stroke-width="1"/>
        <circle cx="45" cy="30" r="2" fill="black"/><circle cx="55" cy="30" r="2" fill="black"/>""",
    "uc-y-10": """<rect width="100" height="100" fill="#F5DEB3"/>
        <ellipse cx="50" cy="50" rx="20" ry="30" fill="#8B4513"/>
        <path d="M30,20 L70,20" stroke="#F4A460" stroke-width="5"/>
        <path d="M40,20 L50,5 L60,20" fill="#F4A460"/>
        <circle cx="45" cy="40" r="2" fill="black"/><circle cx="55" cy="40" r="2" fill="black"/>
        <rect x="60" y="50" width="10" height="20" fill="white" stroke="black"/>""",
    "uc-y-11": """<rect width="100" height="100" fill="#2F4F4F"/>
        <circle cx="50" cy="50" r="25" fill="#696969"/>
        <path d="M20,10 L80,10 L50,90 Z" fill="none" stroke="black" opacity="0.1"/>
        <circle cx="40" cy="50" r="2" fill="white"/><circle cx="60" cy="50" r="2" fill="white"/>
        <path d="M45,20 Q50,10 55,20" fill="#228B22"/>""",
    "uc-y-12": """<rect width="100" height="100" fill="#FFE4B5"/>
        <circle cx="50" cy="50" r="30" fill="#8B4513"/>
        <circle cx="40" cy="45" r="4" fill="white"/><circle cx="40" cy="45" r="1" fill="black"/>
        <circle cx="60" cy="45" r="4" fill="white"/><circle cx="60" cy="45" r="1" fill="black"/>
        <path d="M45,25 Q50,15 55,25" fill="none" stroke="red" stroke-width="2"/>""",
    "uc-y-13": """<rect width="100" height="100" fill="#E6E6FA"/>
        <circle cx="50" cy="60" r="20" fill="#A9A9A9"/>
        <circle cx="25" cy="50" r="10" fill="#A9A9A9"/>
        <circle cx="75" cy="50" r="10" fill="#A9A9A9"/>
        <path d="M45,60 Q50,70 55,60" stroke="black" stroke-width="1" fill="none"/>""",
    "uc-y-14": """<rect width="100" height="100" fill="#F08080"/>
        <circle cx="50" cy="50" r="25" fill="#FF4500"/>
        <path d="M30,20 L40,30 L50,15 L60,30 L70,20" stroke="#FF0000" stroke-width="3" fill="none"/>
        <circle cx="42" cy="45" r="3" fill="white"/><circle cx="58" cy="45" r="3" fill="white"/>
        <path d="M45,60 Q50,65 55,60" stroke="white" stroke-width="2" fill="none"/>""",
    "uc-y-15": """<rect width="100" height="100" fill="#90EE90"/>
        <rect x="40" y="40" width="20" height="40" fill="#8B4513"/>
        <circle cx="50" cy="40" r="30" fill="#228B22"/>
        <circle cx="45" cy="40" r="2" fill="black"/><circle cx="55" cy="40" r="2" fill="black"/>
        <path d="M45,50 Q50,55 55,50" stroke="black" stroke-width="1" fill="none"/>""",

    # === RARE (R) ===
    # More detail, textures (stripes/spots), better shapes
    "r-a-1": """<rect width="100" height="100" fill="#F0E68C"/> <!-- Giraffe -->
        <rect x="45" y="30" width="10" height="60" fill="#DEB887"/> <!-- Neck -->
        <ellipse cx="50" cy="30" rx="15" ry="20" fill="#DEB887"/> <!-- Head -->
        <path d="M40,15 L35,5 M60,15 L65,5" stroke="#8B4513" stroke-width="3"/> <!-- Horns -->
        <circle cx="45" cy="25" r="3" fill="black"/><circle cx="55" cy="25" r="3" fill="black"/>
        <circle cx="50" cy="40" r="5" fill="#8B4513" opacity="0.6"/> <!-- Spots -->
        <circle cx="50" cy="60" r="6" fill="#8B4513" opacity="0.6"/>
        <circle cx="50" cy="80" r="4" fill="#8B4513" opacity="0.6"/>""",
    "r-a-2": """<rect width="100" height="100" fill="#F0F8FF"/> <!-- Zebra -->
        <rect x="40" y="30" width="20" height="60" fill="white"/> <!-- Neck/Body -->
        <ellipse cx="50" cy="30" rx="15" ry="20" fill="white"/> <!-- Head -->
        <path d="M40,30 L60,35 M40,45 L60,50 M40,60 L60,65 M40,75 L60,80" stroke="black" stroke-width="3"/> <!-- Stripes -->
        <path d="M50,15 Q60,15 65,25" stroke="black" stroke-width="4"/> <!-- Mane -->
        <circle cx="45" cy="25" r="3" fill="black"/><circle cx="55" cy="25" r="3" fill="black"/>""",
    "r-a-3": """<rect width="100" height="100" fill="#FFE4B5"/> <!-- Kangaroo -->
        <ellipse cx="50" cy="60" rx="25" ry="35" fill="#D2691E"/> <!-- Body -->
        <circle cx="50" cy="30" r="15" fill="#D2691E"/> <!-- Head -->
        <path d="M35,20 L30,5 M65,20 L70,5" stroke="#D2691E" stroke-width="5"/> <!-- Ears -->
        <circle cx="45" cy="25" r="2" fill="black"/><circle cx="55" cy="25" r="2" fill="black"/>
        <path d="M40,70 Q50,90 60,70" fill="#8B4513"/> <!-- Pouch -->""",
    "r-a-4": """<rect width="100" height="100" fill="#F0FFF0"/> <!-- Panda -->
        <circle cx="30" cy="30" r="10" fill="black"/> <!-- Ears -->
        <circle cx="70" cy="30" r="10" fill="black"/>
        <circle cx="50" cy="50" r="35" fill="white" stroke="black" stroke-width="2"/> <!-- Head -->
        <ellipse cx="40" cy="45" rx="8" ry="6" fill="black"/> <!-- Eye Patch -->
        <ellipse cx="60" cy="45" rx="8" ry="6" fill="black"/>
        <circle cx="40" cy="45" r="2" fill="white"/><circle cx="60" cy="45" r="2" fill="white"/>
        <ellipse cx="50" cy="60" rx="6" ry="4" fill="black"/> <!-- Nose -->""",
    "r-a-5": """<rect width="100" height="100" fill="#E6E6FA"/> <!-- Koala -->
        <circle cx="50" cy="50" r="30" fill="#A9A9A9"/> <!-- Head -->
        <circle cx="25" cy="40" r="12" fill="#808080"/> <!-- Ears -->
        <circle cx="75" cy="40" r="12" fill="#808080"/>
        <ellipse cx="50" cy="60" rx="10" ry="15" fill="#333"/> <!-- Big Nose -->
        <circle cx="40" cy="45" r="3" fill="black"/><circle cx="60" cy="45" r="3" fill="black"/>""",
    "r-a-6": """<rect width="100" height="100" fill="#FFFACD"/> <!-- Cheetah -->
        <circle cx="50" cy="50" r="30" fill="#FFD700"/> <!-- Head -->
        <circle cx="40" cy="45" r="3" fill="#000"/><circle cx="60" cy="45" r="3" fill="#000"/>
        <path d="M40,48 L40,65 M60,48 L60,65" stroke="black" stroke-width="2"/> <!-- Tear lines -->
        <circle cx="35" cy="30" r="2" fill="black" opacity="0.6"/> <!-- Spots -->
        <circle cx="65" cy="30" r="2" fill="black" opacity="0.6"/>
        <circle cx="50" cy="20" r="2" fill="black" opacity="0.6"/>
        <circle cx="30" cy="50" r="2" fill="black" opacity="0.6"/>
        <circle cx="70" cy="50" r="2" fill="black" opacity="0.6"/>""",
    "r-a-7": """<rect width="100" height="100" fill="#F5DEB3"/> <!-- Buffalo -->
        <path d="M20,30 Q50,60 80,30" stroke="#333" stroke-width="8" fill="none"/> <!-- Horns -->
        <rect x="30" y="30" width="40" height="50" rx="10" fill="#8B4513"/> <!-- Face -->
        <rect x="35" y="30" width="30" height="10" fill="#333"/> <!-- Hair -->
        <circle cx="40" cy="50" r="3" fill="black"/><circle cx="60" cy="50" r="3" fill="black"/>
        <ellipse cx="50" cy="70" rx="10" ry="6" fill="#333"/> <!-- Nose -->""",
    "r-a-8": """<rect width="100" height="100" fill="#F0F8FF"/> <!-- Moose -->
        <path d="M10,20 L30,40 M90,20 L70,40" stroke="#5D4037" stroke-width="8"/> <!-- Antlers -->
        <path d="M10,25 L30,45" stroke="#5D4037" stroke-width="4"/>
        <path d="M90,25 L70,45" stroke="#5D4037" stroke-width="4"/>
        <ellipse cx="50" cy="60" rx="20" ry="30" fill="#8B4513"/> <!-- Head -->
        <circle cx="40" cy="55" r="3" fill="black"/><circle cx="60" cy="55" r="3" fill="black"/>
        <ellipse cx="50" cy="80" rx="15" ry="10" fill="#5D4037"/> <!-- Snout -->""",
    "r-a-9": """<rect width="100" height="100" fill="#FFE4C4"/> <!-- Camel -->
        <path d="M20,60 Q35,30 50,60 Q65,30 80,60" fill="#D2691E" stroke="none"/> <!-- Humps -->
        <rect x="20" y="60" width="60" height="30" fill="#D2691E"/>
        <circle cx="85" cy="40" r="10" fill="#D2691E"/> <!-- Head -->
        <rect x="80" y="45" width="5" height="20" fill="#D2691E"/> <!-- Neck -->
        <circle cx="87" cy="38" r="2" fill="black"/>""",
    "r-a-10": """<rect width="100" height="100" fill="#F5F5F5"/> <!-- Ostrich -->
        <ellipse cx="50" cy="65" rx="30" ry="20" fill="#333"/> <!-- Body -->
        <rect x="45" y="25" width="5" height="40" fill="#FFC0CB"/> <!-- Neck -->
        <circle cx="47" cy="20" r="8" fill="#FFC0CB"/> <!-- Head -->
        <circle cx="45" cy="18" r="2" fill="black"/>
        <path d="M52,20 L58,22 L52,24 Z" fill="#FFA500"/> <!-- Beak -->
        <line x1="40" y1="80" x2="35" y2="95" stroke="#FFA500" stroke-width="2"/> <!-- Legs -->
        <line x1="60" y1="80" x2="65" y2="95" stroke="#FFA500" stroke-width="2"/>""",
    "r-a-11": """<rect width="100" height="100" fill="#E0FFFF"/> <!-- Falcon -->
        <path d="M20,40 L50,80 L80,40 L50,20 Z" fill="#708090"/> <!-- Body -->
        <path d="M20,40 L10,60 L30,50 Z" fill="#708090"/> <!-- Wing Tip -->
        <path d="M80,40 L90,60 L70,50 Z" fill="#708090"/> <!-- Wing Tip -->
        <circle cx="50" cy="30" r="10" fill="white"/> <!-- Head -->
        <path d="M45,30 L55,30" stroke="black" stroke-width="2"/> <!-- Mask -->
        <path d="M50,32 L50,38 L55,35 Z" fill="#FFD700"/> <!-- Beak -->""",
    "r-a-12": """<rect width="100" height="100" fill="#2F4F4F"/> <!-- Owl -->
        <ellipse cx="50" cy="50" rx="30" ry="40" fill="#8B4513"/> <!-- Body -->
        <circle cx="35" cy="40" r="12" fill="#D2691E"/> <!-- Eye circle -->
        <circle cx="65" cy="40" r="12" fill="#D2691E"/>
        <circle cx="35" cy="40" r="5" fill="black"/><circle cx="35" cy="40" r="2" fill="white"/>
        <circle cx="65" cy="40" r="5" fill="black"/><circle cx="65" cy="40" r="2" fill="white"/>
        <path d="M50,50 L45,60 L55,60 Z" fill="#FFA500"/> <!-- Beak -->""",
    "r-a-13": """<rect width="100" height="100" fill="#E0F7FA"/> <!-- Dolphin -->
        <path d="M20,60 Q50,20 80,60 Q50,80 20,60" fill="#00CED1"/> <!-- Body -->
        <path d="M50,40 L40,30 L55,35 Z" fill="#00CED1"/> <!-- Fin -->
        <circle cx="35" cy="55" r="3" fill="black"/>
        <path d="M20,60 Q10,50 10,70" fill="#00CED1"/> <!-- Tail -->""",
    "r-a-14": """<rect width="100" height="100" fill="#FFE4E1"/> <!-- Octopus -->
        <circle cx="50" cy="40" r="25" fill="#FF6347"/> <!-- Head -->
        <path d="M30,60 Q20,80 30,90" stroke="#FF6347" stroke-width="8" fill="none"/> <!-- Legs -->
        <path d="M40,63 Q35,85 45,90" stroke="#FF6347" stroke-width="8" fill="none"/>
        <path d="M60,63 Q65,85 55,90" stroke="#FF6347" stroke-width="8" fill="none"/>
        <path d="M70,60 Q80,80 70,90" stroke="#FF6347" stroke-width="8" fill="none"/>
        <circle cx="40" cy="40" r="5" fill="white"/><circle cx="40" cy="40" r="2" fill="black"/>
        <circle cx="60" cy="40" r="5" fill="white"/><circle cx="60" cy="40" r="2" fill="black"/>""",
    "r-a-15": """<rect width="100" height="100" fill="#F0E68C"/> <!-- Cobra -->
        <path d="M40,80 Q50,90 60,80 L60,40 Q80,30 50,20 Q20,30 40,40 Z" fill="#8B4513"/> <!-- Hood -->
        <rect x="45" y="40" width="10" height="50" fill="#CD853F"/> <!-- Body -->
        <circle cx="40" cy="35" r="3" fill="yellow"/><circle cx="60" cy="35" r="3" fill="yellow"/>
        <line x1="40" y1="35" x2="40" y2="38" stroke="black"/> <!-- Slit eye -->
        <line x1="60" y1="35" x2="60" y2="38" stroke="black"/>""",
    "r-y-1": """<rect width="100" height="100" fill="#FFE4E1"/> <!-- Zashiki-warashi -->
        <rect x="30" y="30" width="40" height="20" fill="black"/> <!-- Hair (Bob cut) -->
        <circle cx="50" cy="40" r="20" fill="#FFE4C4"/> <!-- Face -->
        <rect x="25" y="60" width="50" height="40" fill="#800080"/> <!-- Kimono -->
        <circle cx="42" cy="40" r="2" fill="black"/><circle cx="58" cy="40" r="2" fill="black"/>
        <circle cx="40" cy="48" r="3" fill="#FFC0CB" opacity="0.6"/> <!-- Blush -->
        <circle cx="60" cy="48" r="3" fill="#FFC0CB" opacity="0.6"/>""",
    "r-y-2": """<rect width="100" height="100" fill="#DEB887"/> <!-- Tanuki -->
        <circle cx="50" cy="50" r="30" fill="#8B4513"/> <!-- Body -->
        <circle cx="50" cy="40" r="20" fill="#D2691E"/> <!-- Head -->
        <ellipse cx="40" cy="38" rx="6" ry="4" fill="#333"/> <!-- Eye patch -->
        <ellipse cx="60" cy="38" rx="6" ry="4" fill="#333"/>
        <circle cx="50" cy="70" r="15" fill="white"/> <!-- Belly -->
        <circle cx="50" cy="70" r="2" fill="black"/> <!-- Navel -->
        <path d="M45,20 Q50,10 55,20" fill="#228B22"/> <!-- Leaf -->""",
    "r-y-3": """<rect width="100" height="100" fill="#FFF8DC"/> <!-- Kitsune -->
        <path d="M20,20 L30,40 L40,25 Z" fill="#FFA500"/> <!-- Ear -->
        <path d="M80,20 L70,40 L60,25 Z" fill="#FFA500"/> <!-- Ear -->
        <ellipse cx="50" cy="50" rx="25" ry="30" fill="white" stroke="#FFA500" stroke-width="2"/> <!-- Face -->
        <line x1="35" y1="45" x2="45" y2="50" stroke="black"/> <!-- Eye -->
        <line x1="65" y1="45" x2="55" y2="50" stroke="black"/>
        <path d="M45,65 Q50,70 55,65" stroke="red" fill="none"/> <!-- Smile -->
        <circle cx="35" cy="60" r="4" fill="#FF69B4" opacity="0.5"/> <!-- Makeup -->
        <circle cx="65" cy="60" r="4" fill="#FF69B4" opacity="0.5"/>""",
    "r-y-4": """<rect width="100" height="100" fill="#2F4F4F"/> <!-- Nekomata -->
        <circle cx="50" cy="50" r="25" fill="black"/> <!-- Body -->
        <path d="M20,30 L30,50 L40,40 Z" fill="black"/> <!-- Ear -->
        <path d="M80,30 L70,50 L60,40 Z" fill="black"/> <!-- Ear -->
        <ellipse cx="40" cy="50" rx="5" ry="8" fill="yellow"/> <!-- Eye -->
        <ellipse cx="60" cy="50" rx="5" ry="8" fill="yellow"/>
        <line x1="40" y1="45" x2="40" y2="55" stroke="black"/>
        <line x1="60" y1="45" x2="60" y2="55" stroke="black"/>
        <path d="M30,80 Q20,60 30,50" stroke="black" stroke-width="4" fill="none"/> <!-- Tail 1 -->
        <path d="M70,80 Q80,60 70,50" stroke="black" stroke-width="4" fill="none"/> <!-- Tail 2 -->""",
    "r-y-5": """<rect width="100" height="100" fill="#FFFFF0"/> <!-- Inugami -->
        <rect x="30" y="40" width="40" height="60" fill="white"/> <!-- Robe -->
        <circle cx="50" cy="30" r="15" fill="#CD853F"/> <!-- Dog Head -->
        <path d="M35,15 L40,30 L45,20 Z" fill="#CD853F"/>
        <path d="M65,15 L60,30 L55,20 Z" fill="#CD853F"/>
        <circle cx="45" cy="28" r="2" fill="black"/><circle cx="55" cy="28" r="2" fill="black"/>
        <rect x="45" y="40" width="10" height="60" fill="#800080"/> <!-- Scarf -->""",
    "r-y-6": """<rect width="100" height="100" fill="#F08080"/> <!-- Akaname -->
        <ellipse cx="50" cy="50" rx="30" ry="25" fill="#B22222"/> <!-- Red Body -->
        <circle cx="40" cy="40" r="5" fill="yellow"/><circle cx="60" cy="40" r="5" fill="yellow"/>
        <path d="M50,60 Q50,90 70,80" stroke="#FF69B4" stroke-width="6" fill="none"/> <!-- Long Tongue -->
        <line x1="30" y1="20" x2="70" y2="20" stroke="black" stroke-width="2"/> <!-- Hair -->""",
    "r-y-7": """<rect width="100" height="100" fill="#E6E6FA"/> <!-- Azukiarai -->
        <circle cx="50" cy="40" r="20" fill="#FFE4C4"/> <!-- Head -->
        <rect x="25" y="60" width="50" height="40" fill="#4682B4"/> <!-- Clothes -->
        <circle cx="40" cy="35" r="10" fill="white" opacity="0.8"/> <!-- Big Eye -->
        <circle cx="40" cy="35" r="2" fill="black"/>
        <circle cx="60" cy="35" r="10" fill="white" opacity="0.8"/>
        <circle cx="60" cy="35" r="2" fill="black"/>
        <rect x="30" y="70" width="40" height="20" fill="#8B4513"/> <!-- Tray -->
        <circle cx="40" cy="75" r="3" fill="#800000"/> <!-- Bean -->
        <circle cx="50" cy="75" r="3" fill="#800000"/>
        <circle cx="60" cy="75" r="3" fill="#800000"/>""",
    "r-y-8": """<rect width="100" height="100" fill="#F5DEB3"/> <!-- Sunakake-baba -->
        <path d="M30,30 L70,30 L80,90 L20,90 Z" fill="#F0E68C"/> <!-- Kimono -->
        <circle cx="50" cy="30" r="15" fill="#FFE4C4"/> <!-- Head -->
        <path d="M30,30 Q50,10 70,30" fill="gray"/> <!-- Hair -->
        <circle cx="45" cy="30" r="2" fill="black"/><circle cx="55" cy="30" r="2" fill="black"/>
        <circle cx="20" cy="50" r="2" fill="#D2B48C"/><circle cx="80" cy="60" r="2" fill="#D2B48C"/> <!-- Sand -->
        <circle cx="30" cy="80" r="2" fill="#D2B48C"/><circle cx="70" cy="40" r="2" fill="#D2B48C"/>""",
    "r-y-9": """<rect width="100" height="100" fill="#E0FFFF"/> <!-- Konaki-jiji -->
        <rect x="30" y="50" width="40" height="40" fill="#FFC0CB"/> <!-- Baby Bib -->
        <circle cx="50" cy="30" r="20" fill="#FFE4C4"/> <!-- Old Face -->
        <path d="M40,25 Q50,30 60,25" stroke="black" fill="none"/> <!-- Wrinkles -->
        <circle cx="42" cy="35" r="2" fill="black"/><circle cx="58" cy="35" r="2" fill="black"/>
        <rect x="30" y="50" width="40" height="40" fill="none" stroke="red" stroke-width="2"/>""",
    "r-y-10": """<rect width="100" height="100" fill="#90EE90"/> <!-- Kappa River Child -->
        <rect x="40" y="20" width="20" height="10" fill="#228B22"/> <!-- Dish Hair -->
        <ellipse cx="50" cy="20" rx="10" ry="2" fill="#E0FFFF"/> <!-- Dish Water -->
        <circle cx="50" cy="50" r="25" fill="#32CD32"/> <!-- Face -->
        <path d="M45,55 L50,60 L55,55" fill="#FFD700"/> <!-- Beak -->
        <circle cx="40" cy="45" r="3" fill="black"/><circle cx="60" cy="45" r="3" fill="black"/>
        <rect x="30" y="70" width="40" height="30" fill="#32CD32"/> <!-- Body -->""",
    "r-y-11": """<rect width="100" height="100" fill="#F0F8FF"/> <!-- Tofu-kozo -->
        <circle cx="50" cy="40" r="20" fill="#FFE4C4"/> <!-- Head -->
        <rect x="30" y="20" width="40" height="10" fill="#8B4513"/> <!-- Hat -->
        <rect x="35" y="60" width="30" height="40" fill="#ADD8E6"/> <!-- Kimono -->
        <rect x="60" y="50" width="20" height="20" fill="white" stroke="#D3D3D3"/> <!-- Tofu -->
        <path d="M65,55 L70,55" stroke="red" stroke-width="2"/> <!-- Maple leaf? -->""",
    "r-y-12": """<rect width="100" height="100" fill="#FFDEAD"/> <!-- Hitotsume-kozo -->
        <circle cx="50" cy="40" r="25" fill="#FFE4C4"/> <!-- Head -->
        <circle cx="50" cy="40" r="10" fill="white"/> <!-- One Eye -->
        <circle cx="50" cy="40" r="3" fill="black"/>
        <rect x="30" y="65" width="40" height="35" fill="#4169E1"/> <!-- Clothes -->""",
    "r-y-13": """<rect width="100" height="100" fill="#D3D3D3"/> <!-- Noppera-bo -->
        <ellipse cx="50" cy="40" rx="20" ry="25" fill="#FFE4C4"/> <!-- Face -->
        <rect x="30" y="65" width="40" height="35" fill="#2F4F4F"/> <!-- Clothes -->
        <!-- No features on face -->
        <path d="M30,30 Q50,10 70,30" fill="black"/> <!-- Hair -->""",
    "r-y-14": """<rect width="100" height="100" fill="#FFF0F5"/> <!-- Futakuchi-onna -->
        <circle cx="50" cy="40" r="20" fill="#FFE4C4"/> <!-- Head -->
        <path d="M30,20 Q50,5 70,20" fill="black"/> <!-- Hair -->
        <path d="M45,80 Q50,90 55,80" fill="red"/> <!-- Back Mouth (abstracted) -->
        <path d="M20,20 Q50,-10 80,20" stroke="black" stroke-width="4" fill="none"/> <!-- Hair Tentacles -->""",
    "r-y-15": """<rect width="100" height="100" fill="#E6E6FA"/> <!-- Baku -->
        <path d="M30,40 Q50,20 70,40" fill="#DA70D6"/> <!-- Body -->
        <path d="M30,40 L20,60" fill="#DA70D6"/> <!-- Snout -->
        <circle cx="60" cy="40" r="2" fill="black"/>
        <rect x="30" y="60" width="40" height="30" fill="#DA70D6"/>""",

    # === SUPER RARE (SR) ===
    # "Cute" style: Rounded shapes, big eyes, blushing, vibrant/soft colors
    "sr-a-1": """<rect width="100" height="100" fill="#FFF8DC"/> <!-- Lion -->
        <circle cx="50" cy="50" r="38" fill="#FF8C00"/> <!-- Mane -->
        <circle cx="50" cy="50" r="25" fill="#F4A460"/> <!-- Face -->
        <circle cx="40" cy="45" r="4" fill="black"/><circle cx="42" cy="43" r="1.5" fill="white"/> <!-- Eyes with highlight -->
        <circle cx="60" cy="45" r="4" fill="black"/><circle cx="62" cy="43" r="1.5" fill="white"/>
        <ellipse cx="50" cy="55" rx="5" ry="3" fill="#3E2723"/> <!-- Nose -->
        <path d="M45,60 Q50,65 55,60" fill="none" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/> <!-- Mouth -->
        <ellipse cx="35" cy="52" rx="4" ry="2" fill="#FF6347" opacity="0.4"/> <!-- Blush -->
        <ellipse cx="65" cy="52" rx="4" ry="2" fill="#FF6347" opacity="0.4"/>""",
    "sr-a-2": """<rect width="100" height="100" fill="#FFFACD"/> <!-- Tiger -->
        <path d="M25,25 L35,35 L45,25" fill="#FFA500" stroke="#FFA500" stroke-width="5" stroke-linejoin="round"/> <!-- Left Ear -->
        <path d="M75,25 L65,35 L55,25" fill="#FFA500" stroke="#FFA500" stroke-width="5" stroke-linejoin="round"/> <!-- Right Ear -->
        <circle cx="50" cy="50" r="30" fill="#FFA500"/> <!-- Head -->
        <path d="M50,25 L45,35 L55,35 Z" fill="#3E2723"/> <!-- Stripe Top -->
        <path d="M25,50 L35,50 L30,60 Z" fill="#3E2723"/> <!-- Stripe Left -->
        <path d="M75,50 L65,50 L70,60 Z" fill="#3E2723"/> <!-- Stripe Right -->
        <circle cx="40" cy="48" r="4" fill="black"/><circle cx="42" cy="46" r="1.5" fill="white"/>
        <circle cx="60" cy="48" r="4" fill="black"/><circle cx="62" cy="46" r="1.5" fill="white"/>
        <ellipse cx="50" cy="58" rx="4" ry="3" fill="#3E2723"/> <!-- Nose -->""",
    "sr-a-3": """<rect width="100" height="100" fill="#F0F8FF"/> <!-- Elephant -->
        <circle cx="50" cy="45" r="30" fill="#B0C4DE"/> <!-- Head -->
        <circle cx="25" cy="40" r="15" fill="#B0C4DE"/> <!-- Ear Left -->
        <circle cx="75" cy="40" r="15" fill="#B0C4DE"/> <!-- Ear Right -->
        <path d="M45,60 Q50,80 60,65" fill="none" stroke="#B0C4DE" stroke-width="8" stroke-linecap="round"/> <!-- Trunk -->
        <circle cx="40" cy="45" r="4" fill="black"/><circle cx="42" cy="43" r="1.5" fill="white"/>
        <circle cx="60" cy="45" r="4" fill="black"/><circle cx="62" cy="43" r="1.5" fill="white"/>
        <ellipse cx="30" cy="50" rx="3" ry="2" fill="#FFC0CB" opacity="0.5"/> <!-- Blush -->
        <ellipse cx="70" cy="50" rx="3" ry="2" fill="#FFC0CB" opacity="0.5"/>""",
    "sr-a-4": """<rect width="100" height="100" fill="#F5F5F5"/> <!-- Gorilla -->
        <circle cx="50" cy="50" r="35" fill="#4F4F4F"/> <!-- Body/Head -->
        <ellipse cx="50" cy="55" rx="20" ry="15" fill="#696969"/> <!-- Face Area -->
        <circle cx="42" cy="50" r="3" fill="black"/><circle cx="43" cy="49" r="1" fill="white"/>
        <circle cx="58" cy="50" r="3" fill="black"/><circle cx="59" cy="49" r="1" fill="white"/>
        <path d="M45,58 Q50,60 55,58" stroke="black" stroke-width="1.5" fill="none"/> <!-- Nostrils -->
        <rect x="35" y="75" width="30" height="20" rx="5" fill="#4F4F4F"/> <!-- Chest -->""",
    "sr-a-5": """<rect width="100" height="100" fill="#E0FFFF"/> <!-- Polar Bear -->
        <circle cx="25" cy="30" r="10" fill="white"/> <!-- Ear -->
        <circle cx="75" cy="30" r="10" fill="white"/>
        <circle cx="50" cy="50" r="35" fill="white"/> <!-- Face -->
        <circle cx="40" cy="45" r="4" fill="black"/><circle cx="42" cy="43" r="1.5" fill="white"/>
        <circle cx="60" cy="45" r="4" fill="black"/><circle cx="62" cy="43" r="1.5" fill="white"/>
        <ellipse cx="50" cy="55" rx="6" ry="4" fill="#333"/> <!-- Nose -->
        <path d="M50,59 L50,65" stroke="#333" stroke-width="2"/>
        <ellipse cx="30" cy="55" rx="5" ry="3" fill="#FFC0CB" opacity="0.5"/>
        <ellipse cx="70" cy="55" rx="5" ry="3" fill="#FFC0CB" opacity="0.5"/>""",
    "sr-a-6": """<rect width="100" height="100" fill="#E8E8E8"/> <!-- Rhino -->
        <circle cx="50" cy="50" r="32" fill="#A9A9A9"/> <!-- Head -->
        <path d="M48,35 L52,20 L56,35 Z" fill="#D3D3D3" stroke="#A9A9A9" stroke-width="1"/> <!-- Horn -->
        <circle cx="38" cy="48" r="4" fill="black"/><circle cx="40" cy="46" r="1.5" fill="white"/>
        <circle cx="62" cy="48" r="4" fill="black"/><circle cx="64" cy="46" r="1.5" fill="white"/>
        <ellipse cx="30" cy="55" rx="4" ry="2" fill="#FFC0CB" opacity="0.5"/>
        <ellipse cx="70" cy="55" rx="4" ry="2" fill="#FFC0CB" opacity="0.5"/>""",
    "sr-a-7": """<rect width="100" height="100" fill="#E6E6FA"/> <!-- Hippo -->
        <ellipse cx="50" cy="60" rx="30" ry="25" fill="#D8BFD8"/> <!-- Snout -->
        <circle cx="50" cy="35" r="20" fill="#D8BFD8"/> <!-- Head Top -->
        <circle cx="35" cy="25" r="6" fill="#D8BFD8"/> <!-- Ear -->
        <circle cx="65" cy="25" r="6" fill="#D8BFD8"/>
        <circle cx="42" cy="40" r="3" fill="black"/><circle cx="43" cy="39" r="1" fill="white"/>
        <circle cx="58" cy="40" r="3" fill="black"/><circle cx="59" cy="39" r="1" fill="white"/>
        <rect x="40" y="70" width="5" height="8" fill="white" rx="2"/> <!-- Tooth -->
        <rect x="55" y="70" width="5" height="8" fill="white" rx="2"/>""",
    "sr-a-8": """<rect width="100" height="100" fill="#FFF8DC"/> <!-- Grizzly -->
        <circle cx="25" cy="30" r="10" fill="#8B4513"/> <!-- Ear -->
        <circle cx="75" cy="30" r="10" fill="#8B4513"/>
        <circle cx="50" cy="50" r="35" fill="#8B4513"/> <!-- Face -->
        <ellipse cx="50" cy="60" rx="12" ry="8" fill="#D2691E"/> <!-- Snout -->
        <circle cx="40" cy="45" r="4" fill="black"/><circle cx="42" cy="43" r="1.5" fill="white"/>
        <circle cx="60" cy="45" r="4" fill="black"/><circle cx="62" cy="43" r="1.5" fill="white"/>
        <ellipse cx="50" cy="58" rx="4" ry="3" fill="#3E2723"/> <!-- Nose -->""",
    "sr-a-9": """<rect width="100" height="100" fill="#FFFACD"/> <!-- Leopard -->
        <circle cx="20" cy="30" r="8" fill="#FFD700"/> <!-- Ear -->
        <circle cx="80" cy="30" r="8" fill="#FFD700"/>
        <circle cx="50" cy="50" r="32" fill="#FFD700"/> <!-- Head -->
        <circle cx="40" cy="48" r="4" fill="black"/><circle cx="42" cy="46" r="1.5" fill="white"/>
        <circle cx="60" cy="48" r="4" fill="black"/><circle cx="62" cy="46" r="1.5" fill="white"/>
        <ellipse cx="50" cy="55" rx="3" ry="2" fill="black"/> <!-- Nose -->
        <circle cx="30" cy="35" r="3" fill="#8B4513" opacity="0.7"/> <!-- Spot -->
        <circle cx="70" cy="35" r="3" fill="#8B4513" opacity="0.7"/>
        <circle cx="50" cy="25" r="3" fill="#8B4513" opacity="0.7"/>""",
    "sr-a-10": """<rect width="100" height="100" fill="#F0E68C"/> <!-- Jaguar -->
        <circle cx="50" cy="50" r="32" fill="#FFA500"/>
        <circle cx="40" cy="48" r="4" fill="black"/><circle cx="42" cy="46" r="1.5" fill="white"/>
        <circle cx="60" cy="48" r="4" fill="black"/><circle cx="62" cy="46" r="1.5" fill="white"/>
        <ellipse cx="50" cy="55" rx="3" ry="2" fill="black"/>
        <path d="M30,30 L35,35 L30,40" fill="none" stroke="black" stroke-width="2"/> <!-- Rosette mark -->
        <path d="M70,30 L65,35 L70,40" fill="none" stroke="black" stroke-width="2"/>
        <ellipse cx="35" cy="55" rx="4" ry="2" fill="#FF6347" opacity="0.4"/> <!-- Blush -->
        <ellipse cx="65" cy="55" rx="4" ry="2" fill="#FF6347" opacity="0.4"/>""",
    "sr-a-11": """<rect width="100" height="100" fill="#F0F8FF"/> <!-- Wolf -->
        <path d="M25,25 L35,40 L45,30" fill="#A9A9A9"/> <!-- Ear -->
        <path d="M75,25 L65,40 L55,30" fill="#A9A9A9"/>
        <circle cx="50" cy="50" r="30" fill="#A9A9A9"/>
        <ellipse cx="50" cy="60" rx="12" ry="10" fill="white"/> <!-- Muzzle -->
        <circle cx="40" cy="48" r="4" fill="black"/><circle cx="42" cy="46" r="1.5" fill="white"/>
        <circle cx="60" cy="48" r="4" fill="black"/><circle cx="62" cy="46" r="1.5" fill="white"/>
        <ellipse cx="50" cy="55" rx="3" ry="2" fill="black"/>""",
    "sr-a-12": """<rect width="100" height="100" fill="#E0FFFF"/> <!-- Eagle -->
        <path d="M20,50 L50,80 L80,50 L50,20 Z" fill="#8B4513"/> <!-- Body (Diamond shape but cute) -->
        <circle cx="50" cy="40" r="25" fill="#8B4513"/> <!-- Head -->
        <circle cx="42" cy="35" r="4" fill="white"/><circle cx="42" cy="35" r="2" fill="black"/>
        <circle cx="58" cy="35" r="4" fill="white"/><circle cx="58" cy="35" r="2" fill="black"/>
        <path d="M45,45 Q50,55 55,45" fill="#FFD700"/> <!-- Beak -->""",
    "sr-a-13": """<rect width="100" height="100" fill="#E0F7FA"/> <!-- Shark -->
        <circle cx="50" cy="50" r="35" fill="#00CED1"/> <!-- Body -->
        <path d="M50,15 L60,30 L40,30 Z" fill="#00CED1"/> <!-- Fin -->
        <circle cx="35" cy="45" r="4" fill="black"/><circle cx="37" cy="43" r="1.5" fill="white"/>
        <circle cx="65" cy="45" r="4" fill="black"/><circle cx="67" cy="43" r="1.5" fill="white"/>
        <path d="M40,60 Q50,70 60,60" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/> <!-- Smile -->
        <path d="M80,50 L90,40 L90,60 Z" fill="#00CED1"/> <!-- Tail -->""",
    "sr-a-14": """<rect width="100" height="100" fill="#E6E6FA"/> <!-- Whale -->
        <ellipse cx="50" cy="60" rx="35" ry="25" fill="#4682B4"/> <!-- Body -->
        <circle cx="40" cy="55" r="3" fill="black"/><circle cx="41" cy="54" r="1" fill="white"/>
        <path d="M50,35 L45,25 L55,25 Z" fill="#E0FFFF"/> <!-- Spout -->
        <path d="M45,25 Q40,15 35,25" stroke="#E0FFFF" fill="none" stroke-width="2"/>
        <path d="M55,25 Q60,15 65,25" stroke="#E0FFFF" fill="none" stroke-width="2"/>
        <path d="M35,65 Q45,70 50,65" stroke="white" fill="none" stroke-width="2" stroke-linecap="round"/> <!-- Smile -->""",
    "sr-a-15": """<rect width="100" height="100" fill="#F0FFF0"/> <!-- Crocodile -->
        <rect x="25" y="40" width="50" height="40" rx="10" fill="#32CD32"/> <!-- Head -->
        <circle cx="35" cy="40" r="6" fill="#32CD32"/> <!-- Eye Bump -->
        <circle cx="65" cy="40" r="6" fill="#32CD32"/>
        <circle cx="35" cy="38" r="3" fill="black"/><circle cx="36" cy="37" r="1" fill="white"/>
        <circle cx="65" cy="38" r="3" fill="black"/><circle cx="66" cy="37" r="1" fill="white"/>
        <path d="M35,65 Q50,75 65,65" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/> <!-- Smile -->
        <path d="M35,65 L37,60 L39,65 L41,60" fill="none" stroke="white" stroke-width="2"/> <!-- Teeth hint -->""",

    "sr-y-1": """<rect width="100" height="100" fill="#B22222"/> <!-- Tengu -->
        <circle cx="50" cy="40" r="25" fill="#FF4500"/> <!-- Red Face -->
        <rect x="45" y="40" width="10" height="30" rx="5" fill="#FF4500"/> <!-- Long Nose -->
        <rect x="30" y="15" width="40" height="10" fill="black"/> <!-- Cap -->
        <path d="M30,35 L40,40" stroke="black" stroke-width="2"/> <!-- Eyebrow -->
        <path d="M70,35 L60,40" stroke="black" stroke-width="2"/>
        <circle cx="38" cy="45" r="2" fill="black"/><circle cx="62" cy="45" r="2" fill="black"/>
        <path d="M20,60 Q50,90 80,60" fill="white" opacity="0.3"/> <!-- Beard/Wind -->""",
    "sr-y-2": """<rect width="100" height="100" fill="#228B22"/> <!-- Kappa -->
        <circle cx="50" cy="50" r="30" fill="#32CD32"/>
        <ellipse cx="50" cy="25" rx="15" ry="5" fill="#E0FFFF" stroke="#006400"/> <!-- Dish -->
        <path d="M45,55 L50,60 L55,55" fill="#FFD700"/> <!-- Beak -->
        <rect x="20" y="40" width="60" height="40" fill="#006400" rx="10" opacity="0.5"/> <!-- Shell back -->
        <circle cx="40" cy="45" r="3" fill="black"/><circle cx="60" cy="45" r="3" fill="black"/>""",
    "sr-y-3": """<rect width="100" height="100" fill="#8B0000"/> <!-- Oni -->
        <path d="M30,30 L35,10 L40,30 Z" fill="#F0E68C"/> <!-- Horn -->
        <path d="M70,30 L65,10 L60,30 Z" fill="#F0E68C"/> <!-- Horn -->
        <circle cx="50" cy="50" r="30" fill="#DC143C"/> <!-- Red Face -->
        <path d="M40,50 Q50,60 60,50" stroke="black" stroke-width="3" fill="none"/> <!-- Mouth -->
        <rect x="42" y="55" width="5" height="5" fill="white"/> <!-- Fang -->
        <rect x="53" y="55" width="5" height="5" fill="white"/>
        <path d="M30,40 L40,45" stroke="black" stroke-width="3"/> <!-- Eyebrow -->
        <path d="M70,40 L60,45" stroke="black" stroke-width="3"/>""",
    "sr-y-4": """<rect width="100" height="100" fill="#F0F8FF"/> <!-- Yuki-onna -->
        <rect x="20" y="20" width="60" height="80" fill="#E0FFFF"/> <!-- Kimono -->
        <circle cx="50" cy="30" r="15" fill="#F0FFFF"/> <!-- Pale Face -->
        <rect x="30" y="20" width="40" height="20" fill="#4682B4" opacity="0.5"/> <!-- Hair -->
        <circle cx="45" cy="30" r="1" fill="blue"/><circle cx="55" cy="30" r="1" fill="blue"/>
        <path d="M10,10 L20,20 M80,10 L70,20 M10,50 L20,40" stroke="white" stroke-width="2"/> <!-- Snowflakes -->""",
    "sr-y-5": """<rect width="100" height="100" fill="#FFFAF0"/> <!-- Rokurokubi -->
        <rect x="30" y="70" width="40" height="30" fill="#D8BFD8"/> <!-- Kimono Body -->
        <path d="M50,70 Q70,50 50,30 Q30,10 50,10" stroke="#FFE4C4" stroke-width="8" fill="none"/> <!-- Long Neck -->
        <circle cx="50" cy="10" r="10" fill="#FFE4C4"/> <!-- Head at top -->
        <circle cx="47" cy="8" r="1" fill="black"/><circle cx="53" cy="8" r="1" fill="black"/>
        <rect x="30" y="70" width="40" height="5" fill="#800080"/> <!-- Collar -->""",
    "sr-y-6": """<rect width="100" height="100" fill="#191970"/> <!-- Umibozu -->
        <path d="M20,100 L20,50 Q50,0 80,50 L80,100 Z" fill="#2F4F4F"/> <!-- Body -->
        <circle cx="35" cy="40" r="5" fill="yellow"/> <!-- Glowing Eye -->
        <circle cx="65" cy="40" r="5" fill="yellow"/>
        <rect x="0" y="80" width="100" height="20" fill="#00008B" opacity="0.8"/> <!-- Sea -->""",
    "sr-y-7": """<rect width="100" height="100" fill="#556B2F"/> <!-- Nue -->
        <circle cx="40" cy="40" r="15" fill="#FFA500"/> <!-- Monkey Head -->
        <rect x="30" y="50" width="40" height="30" fill="#FFD700"/> <!-- Tiger Body -->
        <path d="M30,50 L35,80 L25,80 Z" fill="#FFD700"/>
        <path d="M70,50 Q90,30 90,50" fill="none" stroke="#228B22" stroke-width="4"/> <!-- Snake Tail -->
        <circle cx="90" cy="50" r="3" fill="#228B22"/> <!-- Snake Head -->""",
    "sr-y-8": """<rect width="100" height="100" fill="#8B4513"/> <!-- Tsuchigumo -->
        <ellipse cx="50" cy="50" rx="20" ry="25" fill="#3E2723"/> <!-- Body -->
        <path d="M30,40 L10,20" stroke="#3E2723" stroke-width="4"/> <!-- Leg -->
        <path d="M70,40 L90,20" stroke="#3E2723" stroke-width="4"/>
        <path d="M30,50 L10,50" stroke="#3E2723" stroke-width="4"/>
        <path d="M70,50 L90,50" stroke="#3E2723" stroke-width="4"/>
        <path d="M30,60 L10,80" stroke="#3E2723" stroke-width="4"/>
        <path d="M70,60 L90,80" stroke="#3E2723" stroke-width="4"/>
        <circle cx="45" cy="40" r="2" fill="red"/><circle cx="55" cy="40" r="2" fill="red"/>""",
    "sr-y-9": """<rect width="100" height="100" fill="#4B0082"/> <!-- Jorogumo -->
        <circle cx="50" cy="30" r="15" fill="#FFE4C4"/> <!-- Woman Head -->
        <ellipse cx="50" cy="60" rx="25" ry="30" fill="#000000"/> <!-- Spider Body -->
        <path d="M25,60 L5,50" stroke="black" stroke-width="3"/>
        <path d="M75,60 L95,50" stroke="black" stroke-width="3"/>
        <rect x="40" y="60" width="20" height="5" fill="red"/> <!-- Back pattern -->
        <rect x="40" y="70" width="20" height="5" fill="red"/>""",
    "sr-y-10": """<rect width="100" height="100" fill="#800000"/> <!-- Wanyudo -->
        <circle cx="50" cy="50" r="40" fill="none" stroke="orange" stroke-width="5"/> <!-- Wheel -->
        <circle cx="50" cy="50" r="25" fill="#A9A9A9"/> <!-- Face in center -->
        <rect x="48" y="10" width="4" height="80" fill="orange"/> <!-- Spokes -->
        <rect x="10" y="48" width="80" height="4" fill="orange"/>
        <circle cx="42" cy="45" r="3" fill="black"/><circle cx="58" cy="45" r="3" fill="black"/>
        <path d="M40,60 Q50,50 60,60" stroke="black" fill="none"/> <!-- Frown -->""",
    "sr-y-11": """<rect width="100" height="100" fill="#D3D3D3"/> <!-- Kamaitachi -->
        <path d="M20,20 Q50,0 80,20 L60,80 L40,80 Z" fill="#F4A460"/> <!-- Weasel Body -->
        <path d="M20,40 L10,30 L30,30" fill="#C0C0C0"/> <!-- Sickle Hand -->
        <path d="M80,40 L90,30 L70,30" fill="#C0C0C0"/>
        <rect x="45" y="40" width="10" height="40" fill="white" opacity="0.5"/> <!-- Wind lines -->""",
    "sr-y-12": """<rect width="100" height="100" fill="#FF69B4"/> <!-- Kasa-obake -->
        <path d="M20,70 L50,10 L80,70 Z" fill="#800080"/> <!-- Umbrella -->
        <circle cx="50" cy="40" r="12" fill="white"/> <!-- Eye -->
        <circle cx="50" cy="40" r="4" fill="black"/>
        <rect x="48" y="70" width="4" height="20" fill="#DEB887"/> <!-- Leg -->
        <path d="M40,60 Q50,80 60,60" fill="red"/> <!-- Tongue -->
        <rect x="40" y="90" width="20" height="5" fill="#8B4513"/> <!-- Geta -->""",
    "sr-y-13": """<rect width="100" height="100" fill="#2F4F4F"/> <!-- Chochin-obake -->
        <ellipse cx="50" cy="50" rx="30" ry="40" fill="#F5DEB3"/> <!-- Lantern -->
        <rect x="30" y="10" width="40" height="5" fill="black"/> <!-- Rim -->
        <rect x="30" y="85" width="40" height="5" fill="black"/>
        <path d="M30,40 L40,35" stroke="black" stroke-width="2"/> <!-- Eye slant -->
        <circle cx="40" cy="40" r="3" fill="yellow"/>
        <path d="M35,60 Q50,80 65,60" fill="black"/> <!-- Mouth -->
        <rect x="40" y="60" width="5" height="5" fill="white"/> <!-- Tooth -->""",
    "sr-y-14": """<rect width="100" height="100" fill="#E6E6FA"/> <!-- Ittan-momen -->
        <path d="M30,10 L70,10 L80,90 L60,80 L40,90 L20,80 Z" fill="white"/> <!-- Cloth Body -->
        <circle cx="40" cy="20" r="2" fill="black"/> <!-- Eyes -->
        <circle cx="60" cy="20" r="2" fill="black"/>
        <path d="M20,30 Q50,40 80,30" stroke="#D3D3D3" fill="none"/> <!-- Fold -->""",
    "sr-y-15": """<rect width="100" height="100" fill="#708090"/> <!-- Nurikabe -->
        <rect x="20" y="20" width="60" height="70" fill="#D3D3D3"/> <!-- Wall -->
        <rect x="20" y="20" width="60" height="5" fill="#A9A9A9"/> <!-- Top Edge -->
        <circle cx="35" cy="40" r="3" fill="black"/> <!-- Eyes -->
        <circle cx="65" cy="40" r="3" fill="black"/>
        <rect x="20" y="80" width="20" height="10" fill="#808080"/> <!-- Feet -->
        <rect x="60" y="80" width="20" height="10" fill="#808080"/>""",

    # === ULTRA RARE (UR) ===
    # Gradients, filters, complex composition, legendary look
    "ur-a-1": """<defs><radialGradient id="dragonFire" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="red"/><stop offset="100%" stop-color="gold"/></radialGradient></defs>
        <rect width="100" height="100" fill="#191970"/>
        <path d="M20,80 Q50,20 80,80" fill="#228B22" stroke="gold" stroke-width="2"/> <!-- Body Arch -->
        <circle cx="50" cy="40" r="15" fill="#32CD32" stroke="gold" stroke-width="2"/> <!-- Head -->
        <path d="M50,40 L60,20 L40,20 Z" fill="gold"/> <!-- Horns -->
        <circle cx="45" cy="40" r="2" fill="red"/><circle cx="55" cy="40" r="2" fill="red"/>
        <path d="M10,90 Q50,50 90,90" stroke="url(#dragonFire)" stroke-width="5" fill="none" opacity="0.8"/> <!-- Fire Breath Aura -->
        <circle cx="50" cy="60" r="5" fill="gold"/> <!-- Orb -->""",
    "ur-a-2": """<defs><linearGradient id="phx" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF4500"/><stop offset="100%" stop-color="#FFD700"/></linearGradient></defs>
        <rect width="100" height="100" fill="#800000"/>
        <path d="M10,50 Q50,0 90,50 L50,90 Z" fill="url(#phx)"/> <!-- Bird Body -->
        <path d="M10,50 L0,30 L20,40 Z" fill="#FFD700"/> <!-- Wing Tip -->
        <path d="M90,50 L100,30 L80,40 Z" fill="#FFD700"/>
        <circle cx="50" cy="30" r="10" fill="#FF8C00"/> <!-- Head -->
        <circle cx="50" cy="30" r="2" fill="white"/>
        <path d="M45,80 L50,100 L55,80" fill="url(#phx)"/> <!-- Tail -->""",
    "ur-a-3": """<rect width="100" height="100" fill="#DAA520"/>
        <path d="M20,40 L50,80 L80,40 L50,20 Z" fill="#CD853F"/> <!-- Lion Body -->
        <path d="M20,40 L10,20 L30,30 Z" fill="white"/> <!-- Wing -->
        <path d="M80,40 L90,20 L70,30 Z" fill="white"/> <!-- Wing -->
        <circle cx="50" cy="30" r="12" fill="white"/> <!-- Eagle Head -->
        <path d="M50,32 L55,38 L45,38 Z" fill="#FFD700"/> <!-- Beak -->
        <circle cx="48" cy="30" r="2" fill="black"/>""",
    "ur-a-4": """<defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect width="100" height="100" fill="#E0FFFF"/>
        <path d="M20,60 Q50,40 80,60" fill="white" stroke="#ADD8E6" stroke-width="2"/> <!-- Body -->
        <circle cx="30" cy="50" r="15" fill="white"/> <!-- Head -->
        <path d="M30,35 L40,10 L35,35" fill="none" stroke="#FFD700" stroke-width="2"/> <!-- Horn -->
        <path d="M50,50 L70,20 L60,50" fill="white" opacity="0.8" filter="url(#glow)"/> <!-- Wing -->
        <circle cx="28" cy="48" r="2" fill="blue"/>""",
    "ur-a-5": """<defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect width="100" height="100" fill="#000080"/>
        <path d="M20,80 Q50,20 80,80" fill="#800080" stroke="#4B0082" stroke-width="2"/> <!-- Head Dome -->
        <rect x="20" y="80" width="10" height="20" fill="#800080"/> <!-- Tentacle -->
        <rect x="40" y="80" width="10" height="20" fill="#800080"/>
        <rect x="60" y="80" width="10" height="20" fill="#800080"/>
        <rect x="80" y="80" width="10" height="20" fill="#800080"/>
        <circle cx="35" cy="50" r="5" fill="red" filter="url(#glow)"/> <!-- Eye -->
        <circle cx="65" cy="50" r="5" fill="red" filter="url(#glow)"/>""",
    "ur-a-6": """<rect width="100" height="100" fill="#2E8B57"/>
        <path d="M30,80 Q50,60 70,80" fill="#228B22"/> <!-- Body Base -->
        <path d="M30,80 L20,40" stroke="#228B22" stroke-width="8"/> <!-- Neck 1 -->
        <circle cx="20" cy="35" r="8" fill="#32CD32"/> <!-- Head 1 -->
        <path d="M50,80 L50,30" stroke="#228B22" stroke-width="8"/> <!-- Neck 2 -->
        <circle cx="50" cy="25" r="8" fill="#32CD32"/> <!-- Head 2 -->
        <path d="M70,80 L80,40" stroke="#228B22" stroke-width="8"/> <!-- Neck 3 -->
        <circle cx="80" cy="35" r="8" fill="#32CD32"/> <!-- Head 3 -->""",
    "ur-a-7": """<rect width="100" height="100" fill="#A52A2A"/>
        <rect x="30" y="50" width="40" height="30" fill="#8B4513"/> <!-- Lion Body -->
        <circle cx="30" cy="40" r="12" fill="#D2691E"/> <!-- Lion Head -->
        <path d="M40,50 L50,30" stroke="#228B22" stroke-width="5"/> <!-- Goat Neck -->
        <circle cx="50" cy="25" r="8" fill="#228B22"/> <!-- Goat Head -->
        <path d="M70,50 Q80,30 90,50" fill="none" stroke="#2F4F4F" stroke-width="4"/> <!-- Snake Tail -->
        <circle cx="90" cy="50" r="3" fill="#2F4F4F"/>""",
    "ur-a-8": """<rect width="100" height="100" fill="#000"/>
        <rect x="30" y="50" width="40" height="30" fill="#333"/> <!-- Body -->
        <circle cx="30" cy="40" r="10" fill="#555"/> <!-- Head 1 -->
        <circle cx="50" cy="35" r="10" fill="#555"/> <!-- Head 2 -->
        <circle cx="70" cy="40" r="10" fill="#555"/> <!-- Head 3 -->
        <circle cx="28" cy="38" r="2" fill="red"/><circle cx="32" cy="38" r="2" fill="red"/>
        <circle cx="48" cy="33" r="2" fill="red"/><circle cx="52" cy="33" r="2" fill="red"/>
        <circle cx="68" cy="38" r="2" fill="red"/><circle cx="72" cy="38" r="2" fill="red"/>""",
    "ur-a-9": """<defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect width="100" height="100" fill="#00CED1"/>
        <path d="M10,50 Q50,20 90,50 Q50,80 10,50" fill="#000080"/> <!-- Body -->
        <path d="M20,50 L90,50" stroke="#40E0D0" stroke-width="2"/> <!-- Scale Line -->
        <circle cx="80" cy="50" r="3" fill="yellow" filter="url(#glow)"/> <!-- Eye -->
        <path d="M10,50 L5,40 L15,40 Z" fill="#000080"/> <!-- Tail Fin -->""",
    "ur-a-10": """<rect width="100" height="100" fill="#5D4037"/>
        <circle cx="50" cy="60" r="35" fill="#3E2723"/> <!-- Body -->
        <rect x="20" y="80" width="15" height="20" fill="#3E2723"/> <!-- Leg -->
        <rect x="65" y="80" width="15" height="20" fill="#3E2723"/>
        <circle cx="40" cy="40" r="5" fill="white"/> <!-- Eye -->
        <path d="M60,50 L80,30" stroke="#EEE" stroke-width="10"/> <!-- Tusk -->""",
    "ur-a-11": """<defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect width="100" height="100" fill="#228B22"/>
        <path d="M30,60 Q50,20 70,60" fill="#006400"/> <!-- Lizard Body -->
        <path d="M20,60 Q50,80 80,60" fill="#006400"/>
        <circle cx="50" cy="40" r="10" fill="#32CD32"/> <!-- Head -->
        <circle cx="50" cy="35" r="2" fill="yellow" filter="url(#glow)"/> <!-- Petrifying Eye -->
        <path d="M40,30 L30,20" stroke="#32CD32" stroke-width="3"/> <!-- Crest -->
        <path d="M60,30 L70,20" stroke="#32CD32" stroke-width="3"/>""",
    "ur-a-12": """<rect width="100" height="100" fill="#F4A460"/>
        <rect x="20" y="50" width="60" height="30" fill="#DAA520"/> <!-- Body -->
        <circle cx="30" cy="35" r="15" fill="#DAA520"/> <!-- Head -->
        <path d="M20,35 L10,60 L30,60 Z" fill="#F0E68C"/> <!-- Headdress -->
        <path d="M70,50 L90,30 L80,80 Z" fill="#DAA520"/> <!-- Wing -->
        <circle cx="28" cy="33" r="2" fill="black"/>""",
    "ur-a-13": """<rect width="100" height="100" fill="#F0FFFF"/>
        <rect x="30" y="30" width="40" height="50" rx="10" fill="white"/> <!-- Body -->
        <circle cx="50" cy="30" r="15" fill="white"/> <!-- Head -->
        <rect x="20" y="40" width="10" height="30" fill="white"/> <!-- Arm -->
        <rect x="70" y="40" width="10" height="30" fill="white"/>
        <circle cx="45" cy="28" r="2" fill="blue"/><circle cx="55" cy="28" r="2" fill="blue"/>""",
    "ur-a-14": """<rect width="100" height="100" fill="#A9A9A9"/>
        <rect x="30" y="30" width="40" height="60" rx="10" fill="#696969"/> <!-- Body -->
        <circle cx="50" cy="30" r="15" fill="#696969"/> <!-- Head -->
        <rect x="15" y="40" width="15" height="40" fill="#696969"/> <!-- Big Arm -->
        <rect x="70" y="40" width="15" height="40" fill="#696969"/>
        <circle cx="45" cy="28" r="2" fill="black"/><circle cx="55" cy="28" r="2" fill="black"/>""",
    "ur-a-15": """<rect width="100" height="100" fill="#008080"/>
        <path d="M20,90 Q50,70 80,90" fill="#20B2AA"/> <!-- Water hump -->
        <path d="M45,90 L45,50" stroke="#20B2AA" stroke-width="8"/> <!-- Neck -->
        <ellipse cx="45" cy="45" rx="10" ry="5" fill="#20B2AA"/> <!-- Head -->
        <circle cx="42" cy="43" r="1" fill="black"/>""",

    "ur-y-1": """<rect width="100" height="100" fill="#4B0082"/> <!-- Yamata no Orochi -->
        <path d="M20,90 Q50,50 80,90" fill="#2F4F4F"/> <!-- Base -->
        <path d="M20,90 L10,50" stroke="#2F4F4F" stroke-width="4"/> <!-- Neck 1 -->
        <circle cx="10" cy="45" r="5" fill="red"/> <!-- Head 1 -->
        <path d="M30,90 L25,40" stroke="#2F4F4F" stroke-width="4"/>
        <circle cx="25" cy="35" r="5" fill="red"/>
        <path d="M50,90 L50,30" stroke="#2F4F4F" stroke-width="4"/>
        <circle cx="50" cy="25" r="5" fill="red"/>
        <path d="M70,90 L75,40" stroke="#2F4F4F" stroke-width="4"/>
        <circle cx="75" cy="35" r="5" fill="red"/>
        <path d="M80,90 L90,50" stroke="#2F4F4F" stroke-width="4"/>
        <circle cx="90" cy="45" r="5" fill="red"/>""",
    "ur-y-2": """<rect width="100" height="100" fill="#FFD700"/> <!-- Kyubi -->
        <circle cx="50" cy="60" r="20" fill="#DAA520"/> <!-- Body -->
        <circle cx="50" cy="40" r="15" fill="#DAA520"/> <!-- Head -->
        <path d="M40,25 L35,10 L45,25 Z" fill="#DAA520"/> <!-- Ear -->
        <path d="M60,25 L65,10 L55,25 Z" fill="#DAA520"/> <!-- Ear -->
        <path d="M30,60 Q10,40 20,20" stroke="#DAA520" stroke-width="5" fill="none"/> <!-- Tail 1 -->
        <path d="M70,60 Q90,40 80,20" stroke="#DAA520" stroke-width="5" fill="none"/> <!-- Tail 2 -->
        <path d="M20,70 Q0,60 10,40" stroke="#DAA520" stroke-width="5" fill="none"/> <!-- Tail 3 -->
        <path d="M80,70 Q100,60 90,40" stroke="#DAA520" stroke-width="5" fill="none"/> <!-- Tail 4 -->""",
    "ur-y-3": """<rect width="100" height="100" fill="#8B0000"/> <!-- Shuten Doji -->
        <rect x="30" y="50" width="40" height="40" fill="#B22222"/> <!-- Robe -->
        <circle cx="50" cy="30" r="20" fill="#FFE4C4"/> <!-- Face -->
        <path d="M40,15 L35,5 L45,15" fill="gold"/> <!-- Horn -->
        <path d="M60,15 L65,5 L55,15" fill="gold"/> <!-- Horn -->
        <rect x="40" y="70" width="20" height="20" fill="#8B4513"/> <!-- Sake Cup -->
        <path d="M30,30 L70,30" fill="black" opacity="0.5"/> <!-- Hair -->""",
    "ur-y-4": """<rect width="100" height="100" fill="#000"/> <!-- Daitengu -->
        <rect x="30" y="40" width="40" height="50" fill="#FF4500"/> <!-- Robe -->
        <circle cx="50" cy="30" r="15" fill="red"/> <!-- Face -->
        <rect x="48" y="30" width="4" height="15" fill="red"/> <!-- Long Nose -->
        <path d="M20,40 L10,20 L30,30 Z" fill="black"/> <!-- Wing -->
        <path d="M80,40 L90,20 L70,30 Z" fill="black"/> <!-- Wing -->
        <rect x="35" y="15" width="30" height="5" fill="black"/> <!-- Hat -->""",
    "ur-y-5": """<rect width="100" height="100" fill="#F5F5DC"/> <!-- Nurarihyon -->
        <path d="M50,10 Q80,10 80,40 L50,40 Z" fill="#FFE4C4"/> <!-- Big Head -->
        <rect x="30" y="40" width="40" height="50" fill="#DAA520"/> <!-- Kimono -->
        <circle cx="50" cy="40" r="10" fill="#FFE4C4"/> <!-- Face Area -->
        <circle cx="45" cy="38" r="1" fill="black"/>
        <path d="M20,80 L80,80" stroke="#8B4513" stroke-width="2"/> <!-- Staff -->""",
    "ur-y-6": """<rect width="100" height="100" fill="#2F4F4F"/> <!-- Gashadokuro -->
        <circle cx="50" cy="40" r="25" fill="#F5F5F5"/> <!-- Skull -->
        <circle cx="40" cy="35" r="5" fill="black"/> <!-- Eye Socket -->
        <circle cx="60" cy="35" r="5" fill="black"/>
        <rect x="45" y="50" width="10" height="10" fill="black"/> <!-- Nose -->
        <rect x="40" y="70" width="20" height="30" fill="#F5F5F5"/> <!-- Spine -->
        <path d="M30,75 L70,75" stroke="#F5F5F5" stroke-width="4"/> <!-- Rib -->""",
    "ur-y-7": """<rect width="100" height="100" fill="#FF69B4"/> <!-- Tamamo no Mae -->
        <rect x="30" y="40" width="40" height="50" fill="#FFC0CB"/> <!-- Kimono -->
        <circle cx="50" cy="30" r="15" fill="#FFE4C4"/> <!-- Face -->
        <path d="M20,20 L30,30 L40,15 Z" fill="#FFA500"/> <!-- Fox Ear -->
        <path d="M80,20 L70,30 L60,15 Z" fill="#FFA500"/> <!-- Fox Ear -->
        <path d="M10,80 Q50,60 90,80" fill="none" stroke="gold" stroke-width="2"/> <!-- Aura -->""",
    "ur-y-8": """<rect width="100" height="100" fill="#483D8B"/> <!-- Emperor Sutoku -->
        <rect x="30" y="40" width="40" height="50" fill="#800080"/> <!-- Robe -->
        <circle cx="50" cy="30" r="15" fill="#D8BFD8"/> <!-- Pale Face -->
        <rect x="35" y="10" width="30" height="10" fill="black"/> <!-- Hat -->
        <path d="M20,50 L10,30 L30,40 Z" fill="black"/> <!-- Wing (Tengu form) -->
        <path d="M80,50 L90,30 L70,40 Z" fill="black"/>
        <circle cx="45" cy="28" r="2" fill="red"/>""",
    "ur-y-9": """<rect width="100" height="100" fill="#000"/> <!-- Taira no Masakado -->
        <rect x="30" y="40" width="40" height="50" fill="#333"/> <!-- Armor -->
        <circle cx="50" cy="30" r="15" fill="#FFE4C4"/> <!-- Head -->
        <path d="M30,10 L70,10 L50,5 Z" fill="gold"/> <!-- Helmet -->
        <path d="M20,50 L10,70" stroke="silver" stroke-width="4"/> <!-- Sword -->""",
    "ur-y-10": """<rect width="100" height="100" fill="#696969"/> <!-- Otakemaru -->
        <rect x="30" y="40" width="40" height="50" fill="#000"/> <!-- Armor -->
        <circle cx="50" cy="30" r="15" fill="#CD5C5C"/> <!-- Face -->
        <path d="M40,15 L35,5 L45,15" fill="gold"/> <!-- Horn -->
        <path d="M60,15 L65,5 L55,15" fill="gold"/>
        <rect x="20" y="40" width="10" height="40" fill="silver"/> <!-- Blade 1 -->
        <rect x="70" y="40" width="10" height="40" fill="silver"/> <!-- Blade 2 -->
        <rect x="45" y="40" width="10" height="40" fill="silver"/> <!-- Blade 3 -->""",
    "ur-y-11": """<rect width="100" height="100" fill="#8B4513"/> <!-- Ushi-oni -->
        <circle cx="50" cy="50" r="30" fill="#8B4513"/> <!-- Spider Body -->
        <path d="M20,30 L10,10" stroke="#8B4513" stroke-width="5"/> <!-- Leg -->
        <path d="M80,30 L90,10" stroke="#8B4513" stroke-width="5"/>
        <rect x="40" y="40" width="20" height="20" fill="#A52A2A"/> <!-- Bull Head -->
        <path d="M40,40 L30,20" stroke="white" stroke-width="3"/> <!-- Horn -->
        <path d="M60,40 L70,20" stroke="white" stroke-width="3"/>""",
    "ur-y-12": """<rect width="100" height="100" fill="#FFD700"/> <!-- Raijin -->
        <circle cx="50" cy="50" r="30" fill="#FF4500"/> <!-- Body -->
        <circle cx="20" cy="20" r="8" fill="gray" stroke="black"/> <!-- Drum -->
        <circle cx="50" cy="10" r="8" fill="gray" stroke="black"/> <!-- Drum -->
        <circle cx="80" cy="20" r="8" fill="gray" stroke="black"/> <!-- Drum -->
        <path d="M40,50 L50,60 L60,40" stroke="yellow" stroke-width="3" fill="none"/> <!-- Bolt -->""",
    "ur-y-13": """<rect width="100" height="100" fill="#00CED1"/> <!-- Fujin -->
        <circle cx="50" cy="50" r="30" fill="#32CD32"/> <!-- Body -->
        <path d="M20,20 Q50,0 80,20 Q100,50 80,80" fill="#F0F8FF" opacity="0.5"/> <!-- Bag of Wind -->
        <path d="M30,50 L20,40" stroke="white" stroke-width="2"/> <!-- Wind line -->""",
    "ur-y-14": """<rect width="100" height="100" fill="#000"/> <!-- Yatagarasu -->
        <circle cx="50" cy="40" r="30" fill="black"/> <!-- Body -->
        <path d="M10,40 L0,20 L20,30 Z" fill="black"/> <!-- Wing -->
        <path d="M90,40 L100,20 L80,30 Z" fill="black"/> <!-- Wing -->
        <path d="M40,80 L35,100" stroke="gold" stroke-width="2"/> <!-- Leg 1 -->
        <path d="M50,80 L50,100" stroke="gold" stroke-width="2"/> <!-- Leg 2 -->
        <path d="M60,80 L65,100" stroke="gold" stroke-width="2"/> <!-- Leg 3 -->
        <circle cx="50" cy="10" r="10" fill="gold" opacity="0.5"/> <!-- Sun Halo -->""",
    "ur-y-15": """<rect width="100" height="100" fill="#FFD700"/> <!-- Kirin -->
        <path d="M20,60 L50,30 L80,60" fill="#DAA520"/> <!-- Body Arch -->
        <circle cx="30" cy="40" r="12" fill="#DAA520"/> <!-- Head -->
        <path d="M30,30 L35,10" fill="gold"/> <!-- Horn -->
        <path d="M50,30 Q60,10 70,30" fill="red" opacity="0.5"/> <!-- Fire Mane -->
        <path d="M20,60 L20,80" stroke="gold" stroke-width="4"/> <!-- Leg -->
        <path d="M80,60 L80,80" stroke="gold" stroke-width="4"/>""",
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
