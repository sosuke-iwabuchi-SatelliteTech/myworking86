import os
import random
import json
import argparse
import sys

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

def generate_svg_content(name, type_cat, rarity):
    """Generates SVG content based on rarity and type."""
    config = RARITY_CONFIG[rarity]
    complexity = config["complexity"]

    # Base colors
    bg_color = config["bg_color"]
    border_color = config["border"]

    # Deterministic "Random" colors based on name hash
    import hashlib
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
                    f.write(generate_svg_content(name, "Animal", rarity))

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
                    f.write(generate_svg_content(name, "Yokai", rarity))

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
