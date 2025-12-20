<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PrizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['id' => 'ur-x-1', 'name' => 'セレスティアルドラゴン', 'type' => 'special', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 天空のセレスティアルドラゴン', 'image_url' => '/gacha/ur-x-1-celestial-dragon.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-x-2', 'name' => 'ダイヤモンドフェニックス', 'type' => 'special', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 金剛のダイヤモンドフェニックス', 'image_url' => '/gacha/ur-x-2-diamond-phoenix.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-x-3', 'name' => 'サムライしょうぐん', 'type' => 'special', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 亡霊のサムライ将軍', 'image_url' => '/gacha/ur-x-3-samurai-warlord.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-x-4', 'name' => 'ししおう', 'type' => 'special', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 黄金の獅子王', 'image_url' => '/gacha/ur-x-4-golden-lion-king.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-x-5', 'name' => 'しゅごしゃ', 'type' => 'special', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 古代樹の守護者', 'image_url' => '/gacha/ur-x-5-ancient-tree-guardian.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-1', 'name' => 'ドラゴン', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 伝説のドラゴン', 'image_url' => '/gacha/ur-a-1-dragon.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-2', 'name' => 'フェニックス', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 灼熱のフェニックス', 'image_url' => '/gacha/ur-a-2-phoenix.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-3', 'name' => 'グリフォン', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 天空のグリフォン', 'image_url' => '/gacha/ur-a-3-griffin.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-4', 'name' => 'ペガサス', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 星空のペガサス', 'image_url' => '/gacha/ur-a-4-pegasus.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-5', 'name' => 'クラーケン', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 深海の覇者クラーケン', 'image_url' => '/gacha/ur-a-5-kraken.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-6', 'name' => 'ヒドラ', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 無限の首ヒドラ', 'image_url' => '/gacha/ur-a-6-hydra.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-7', 'name' => 'キメラ', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 混沌のキメラ', 'image_url' => '/gacha/ur-a-7-chimera.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-8', 'name' => 'ケルベロス', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 冥界の番犬ケルベロス', 'image_url' => '/gacha/ur-a-8-cerberus.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-9', 'name' => 'リヴァイアサン', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 渦潮のリヴァイアサン', 'image_url' => '/gacha/ur-a-9-leviathan.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-10', 'name' => 'ベヒモス', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 大地の主ベヒモス', 'image_url' => '/gacha/ur-a-10-behemoth.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-11', 'name' => 'バジリスク', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 石化のバジリスク', 'image_url' => '/gacha/ur-a-11-basilisk.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-12', 'name' => 'スフィンクス', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 謎かけスフィンクス', 'image_url' => '/gacha/ur-a-12-sphinx.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-13', 'name' => 'イエティ', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 雪山の王者イエティ', 'image_url' => '/gacha/ur-a-13-yeti.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-14', 'name' => 'ビッグフット', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 巨足のビッグフット', 'image_url' => '/gacha/ur-a-14-bigfoot.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-a-15', 'name' => 'ネッシー', 'type' => 'animal', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 幻のネッシー', 'image_url' => '/gacha/ur-a-15-loch-ness-monster.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-1', 'name' => 'ヤマタノオロチ', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 災厄のヤマタノオロチ', 'image_url' => '/gacha/ur-y-1-yamata-no-orochi.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-2', 'name' => 'きゅうびのキツネ', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 金色の九尾の狐', 'image_url' => '/gacha/ur-y-2-kyubi-no-kitsune.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-3', 'name' => 'しゅてんどうじ', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 鬼神酒呑童子', 'image_url' => '/gacha/ur-y-3-shuten-doji.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-4', 'name' => 'おおてんぐ', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 暴風の大天狗', 'image_url' => '/gacha/ur-y-4-daitengu.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-5', 'name' => 'ぬらりひょん', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 妖怪総大将ぬらりひょん', 'image_url' => '/gacha/ur-y-5-nurarihyon.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-6', 'name' => 'がしゃどくろ', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 巨大な骸骨がしゃどくろ', 'image_url' => '/gacha/ur-y-6-gashadokuro.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-7', 'name' => 'たまものまえ', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 絶世の美女玉藻前', 'image_url' => '/gacha/ur-y-7-tamamo-no-mae.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-8', 'name' => 'すとくてんのう', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 怨霊崇徳天皇', 'image_url' => '/gacha/ur-y-8-emperor-sutoku.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-9', 'name' => 'たいらのまさかど', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 荒ぶる魂平将門', 'image_url' => '/gacha/ur-y-9-taira-no-masakado.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-10', 'name' => 'おおたけまる', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 剛力の鬼大嶽丸', 'image_url' => '/gacha/ur-y-10-otakemaru.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-11', 'name' => 'うしおに', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 猛毒の牛鬼', 'image_url' => '/gacha/ur-y-11-ushi-oni.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-12', 'name' => 'らいじん', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 轟く雷神', 'image_url' => '/gacha/ur-y-12-raijin.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-13', 'name' => 'ふうじん', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 吹き荒れる風神', 'image_url' => '/gacha/ur-y-13-fujin.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-14', 'name' => 'やたがらす', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 導きの八咫烏', 'image_url' => '/gacha/ur-y-14-yatagarasu.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'ur-y-15', 'name' => 'きりん', 'type' => 'yokai', 'rarity' => 'UR', 'description' => 'URランクのようかい: 聖獣麒麟', 'image_url' => '/gacha/ur-y-15-kirin.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-1', 'name' => 'ライオン', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 百獣の王ライオン', 'image_url' => '/gacha/sr-a-1-lion.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-2', 'name' => 'トラ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 孤高のトラ', 'image_url' => '/gacha/sr-a-2-tiger.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-3', 'name' => 'ゾウ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 巨体のゾウ', 'image_url' => '/gacha/sr-a-3-elephant.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-4', 'name' => 'ゴリラ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 怪力ゴリラ', 'image_url' => '/gacha/sr-a-4-gorilla.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-5', 'name' => 'シロクマ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 氷原のシロクマ', 'image_url' => '/gacha/sr-a-5-polar-bear.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-6', 'name' => 'サイ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 突進するサイ', 'image_url' => '/gacha/sr-a-6-rhino.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-7', 'name' => 'カバ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 大口のカバ', 'image_url' => '/gacha/sr-a-7-hippo.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-8', 'name' => 'ヒグマ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 暴れん坊ヒグマ', 'image_url' => '/gacha/sr-a-8-grizzly-bear.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-9', 'name' => 'ヒョウ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 密林のヒョウ', 'image_url' => '/gacha/sr-a-9-leopard.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-10', 'name' => 'ジャガー', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 黄金のジャガー', 'image_url' => '/gacha/sr-a-10-jaguar.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-11', 'name' => 'オオカミ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 荒野のオオカミ', 'image_url' => '/gacha/sr-a-11-wolf.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-12', 'name' => 'ワシ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 天空の狩人ワシ', 'image_url' => '/gacha/sr-a-12-eagle.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-13', 'name' => 'サメ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 海のハンターサメ', 'image_url' => '/gacha/sr-a-13-shark.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-14', 'name' => 'クジラ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 大海原のクジラ', 'image_url' => '/gacha/sr-a-14-whale.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-a-15', 'name' => 'ワニ', 'type' => 'animal', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 沼地の支配者ワニ', 'image_url' => '/gacha/sr-a-15-crocodile.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-1', 'name' => 'てんぐ', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 空飛ぶ天狗', 'image_url' => '/gacha/sr-y-1-tengu.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-2', 'name' => 'カッパ', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 川辺の王者河童', 'image_url' => '/gacha/sr-y-2-kappa.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-3', 'name' => 'オニ', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 赤き鬼', 'image_url' => '/gacha/sr-y-3-oni.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-4', 'name' => 'ゆきおんな', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 吹雪の雪女', 'image_url' => '/gacha/sr-y-4-yuki-onna.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-5', 'name' => 'ろくろくび', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 長首のろくろ首', 'image_url' => '/gacha/sr-y-5-rokurokubi.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-6', 'name' => 'うみぼうず', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 海の怪物海坊主', 'image_url' => '/gacha/sr-y-6-umibozu.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-7', 'name' => 'ぬえ', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 夜の怪鳥鵺', 'image_url' => '/gacha/sr-y-7-nue.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-8', 'name' => 'つちぐも', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 忍び寄る土蜘蛛', 'image_url' => '/gacha/sr-y-8-tsuchigumo.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-9', 'name' => 'じょろうぐも', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 誘惑の女郎蜘蛛', 'image_url' => '/gacha/sr-y-9-jorogumo.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-10', 'name' => 'わにゅうどう', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 炎の輪入道', 'image_url' => '/gacha/sr-y-10-wanyudo.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-11', 'name' => 'かまいたち', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: つむじ風の鎌鼬', 'image_url' => '/gacha/sr-y-11-kamaitachi.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-12', 'name' => 'かさおばけ', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 踊る傘お化け', 'image_url' => '/gacha/sr-y-12-kasa-obake.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-13', 'name' => 'ちょうちんおばけ', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 笑う提灯お化け', 'image_url' => '/gacha/sr-y-13-chochin-obake.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-14', 'name' => 'いったんもめん', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 空舞う一反木綿', 'image_url' => '/gacha/sr-y-14-ittan-momen.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'sr-y-15', 'name' => 'ぬりかべ', 'type' => 'yokai', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 鉄壁のぬりかべ', 'image_url' => '/gacha/sr-y-15-nurikabe.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-1', 'name' => 'キリン', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 首長キリン', 'image_url' => '/gacha/r-a-1-giraffe.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-2', 'name' => 'シマウマ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 白黒シマウマ', 'image_url' => '/gacha/r-a-2-zebra.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-3', 'name' => 'カンガルー', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: ボクサーカンガルー', 'image_url' => '/gacha/r-a-3-kangaroo.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-4', 'name' => 'パンダ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 人気者パンダ', 'image_url' => '/gacha/r-a-4-panda.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-5', 'name' => 'コアラ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: ユーカリ好きのコアラ', 'image_url' => '/gacha/r-a-5-koala.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-6', 'name' => 'チーター', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 音速のチーター', 'image_url' => '/gacha/r-a-6-cheetah.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-7', 'name' => 'バッファロー', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 荒くれバッファロー', 'image_url' => '/gacha/r-a-7-buffalo.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-8', 'name' => 'ヘラジカ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 森の賢者ヘラジカ', 'image_url' => '/gacha/r-a-8-moose.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-9', 'name' => 'ラクダ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 砂漠の旅人ラクダ', 'image_url' => '/gacha/r-a-9-camel.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-10', 'name' => 'ダチョウ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 爆走ダチョウ', 'image_url' => '/gacha/r-a-10-ostrich.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-11', 'name' => 'ハヤブサ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 急降下ハヤブサ', 'image_url' => '/gacha/r-a-11-falcon.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-12', 'name' => 'フクロウ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 夜更かしフクロウ', 'image_url' => '/gacha/r-a-12-owl.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-13', 'name' => 'イルカ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 賢いイルカ', 'image_url' => '/gacha/r-a-13-dolphin.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-14', 'name' => 'タコ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: ８本足のタコ', 'image_url' => '/gacha/r-a-14-octopus.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-a-15', 'name' => 'コブラ', 'type' => 'animal', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 猛毒コブラ', 'image_url' => '/gacha/r-a-15-cobra.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-1', 'name' => 'ざしきわらし', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 幸福の座敷童子', 'image_url' => '/gacha/r-y-1-zashiki-warashi.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-2', 'name' => 'たぬき', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 化け上手な化け狸', 'image_url' => '/gacha/r-y-2-tanuki.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-3', 'name' => 'キツネ', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: いたずら妖狐', 'image_url' => '/gacha/r-y-3-kitsune.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-4', 'name' => 'ねこまた', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 尻尾二つの猫又', 'image_url' => '/gacha/r-y-4-nekomata.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-5', 'name' => 'いぬがみ', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 呪いの犬神', 'image_url' => '/gacha/r-y-5-inugami.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-6', 'name' => 'あかなめ', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 風呂場の垢嘗', 'image_url' => '/gacha/r-y-6-akaname.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-7', 'name' => 'あずきあらい', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 音を立てる小豆洗い', 'image_url' => '/gacha/r-y-7-azukiarai.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-8', 'name' => 'すなかけばばあ', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 砂を撒く砂かけ婆', 'image_url' => '/gacha/r-y-8-sunakake-baba.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-9', 'name' => 'こなきじじい', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 重くなる子泣き爺', 'image_url' => '/gacha/r-y-9-konaki-jiji.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-10', 'name' => 'かわこぞう', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 川遊びの川小僧', 'image_url' => '/gacha/r-y-10-kappa-(river-child).svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-11', 'name' => 'とうふこぞう', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 豆腐を持つ豆腐小僧', 'image_url' => '/gacha/r-y-11-tofu-kozo.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-12', 'name' => 'ひとつめこぞう', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 一つ目小僧', 'image_url' => '/gacha/r-y-12-hitotsume-kozo.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-13', 'name' => 'のっぺらぼう', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 顔のないのっぺらぼう', 'image_url' => '/gacha/r-y-13-noppera-bo.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-14', 'name' => 'ふたくちおんな', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 大食い二口女', 'image_url' => '/gacha/r-y-14-futakuchi-onna.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'r-y-15', 'name' => 'バク', 'type' => 'yokai', 'rarity' => 'R', 'description' => 'Rランクのようかい: 夢を食べる獏', 'image_url' => '/gacha/r-y-15-baku.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-1', 'name' => 'キツネ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: こそこそキツネ', 'image_url' => '/gacha/uc-a-1-fox.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-2', 'name' => 'アライグマ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 洗い上手なアライグマ', 'image_url' => '/gacha/uc-a-2-raccoon.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-3', 'name' => 'アナグマ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 穴掘りアナグマ', 'image_url' => '/gacha/uc-a-3-badger.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-4', 'name' => 'ビーバー', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: ダム作りビーバー', 'image_url' => '/gacha/uc-a-4-beaver.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-5', 'name' => 'カワウソ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 手先の器用なカワウソ', 'image_url' => '/gacha/uc-a-5-otter.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-6', 'name' => 'シカ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 臆病なシカ', 'image_url' => '/gacha/uc-a-6-deer.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-7', 'name' => 'ヤギ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 手紙を食べるヤギ', 'image_url' => '/gacha/uc-a-7-goat.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-8', 'name' => 'ヒツジ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: ふわふわヒツジ', 'image_url' => '/gacha/uc-a-8-sheep.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-9', 'name' => 'ブタ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 食いしん坊ブタ', 'image_url' => '/gacha/uc-a-9-pig.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-10', 'name' => 'ウシ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: のんびりウシ', 'image_url' => '/gacha/uc-a-10-cow.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-11', 'name' => 'ウマ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 駆け足ウマ', 'image_url' => '/gacha/uc-a-11-horse.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-12', 'name' => 'イヌ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 忠実なイヌ', 'image_url' => '/gacha/uc-a-12-dog.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-13', 'name' => 'ネコ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 気まぐれネコ', 'image_url' => '/gacha/uc-a-13-cat.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-14', 'name' => 'ウサギ', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 跳ねるウサギ', 'image_url' => '/gacha/uc-a-14-rabbit.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-a-15', 'name' => 'リス', 'type' => 'animal', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 木登りリス', 'image_url' => '/gacha/uc-a-15-squirrel.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-1', 'name' => 'からかさ', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 忘れられた唐傘', 'image_url' => '/gacha/uc-y-1-karakasa.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-2', 'name' => 'ばけぞうり', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 古びた化け草履', 'image_url' => '/gacha/uc-y-2-bake-zori.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-3', 'name' => 'もくもくれん', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 障子の目目連', 'image_url' => '/gacha/uc-y-3-mokumokuren.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-4', 'name' => 'けうけげん', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 毛むくじゃら毛羽毛現', 'image_url' => '/gacha/uc-y-4-keukegen.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-5', 'name' => 'しりめ', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: お尻に目がある尻目', 'image_url' => '/gacha/uc-y-5-shirime.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-6', 'name' => 'べとべとさん', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 足音のべとべとさん', 'image_url' => '/gacha/uc-y-6-betobeto-san.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-7', 'name' => 'こだま', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 山の精霊木霊', 'image_url' => '/gacha/uc-y-7-kodama.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-8', 'name' => 'アマビエ', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 疫病退散アマビエ', 'image_url' => '/gacha/uc-y-8-amabie.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-9', 'name' => 'にんぎょ', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 哀愁の人魚', 'image_url' => '/gacha/uc-y-9-ningyo.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-10', 'name' => 'かわうそ', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: いたずら化け獺', 'image_url' => '/gacha/uc-y-10-kawauso.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-11', 'name' => 'ムジナ', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 人真似ムジナ', 'image_url' => '/gacha/uc-y-11-mujina.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-12', 'name' => 'さとり', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 心をこっそり読む覚', 'image_url' => '/gacha/uc-y-12-satori.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-13', 'name' => 'やまびこ', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 響く山彦', 'image_url' => '/gacha/uc-y-13-yama-biko.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-14', 'name' => 'キジムナー', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: ガジュマルの精キジムナー', 'image_url' => '/gacha/uc-y-14-kijimuna.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'uc-y-15', 'name' => 'ガジュマル', 'type' => 'yokai', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 絡みつくガジュマル', 'image_url' => '/gacha/uc-y-15-gajumaru.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-1', 'name' => 'ネズミ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: ちょこまかネズミ', 'image_url' => '/gacha/c-a-1-mouse.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-2', 'name' => 'ドブネズミ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 地下道のドブネズミ', 'image_url' => '/gacha/c-a-2-rat.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-3', 'name' => 'ニワトリ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 早起きニワトリ', 'image_url' => '/gacha/c-a-3-chicken.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-4', 'name' => 'アヒル', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: ガーガーアヒル', 'image_url' => '/gacha/c-a-4-duck.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-5', 'name' => 'ガチョウ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: お騒がせガチョウ', 'image_url' => '/gacha/c-a-5-goose.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-6', 'name' => 'ハト', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 公園のハト', 'image_url' => '/gacha/c-a-6-pigeon.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-7', 'name' => 'カラス', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: ゴミ捨て場のカラス', 'image_url' => '/gacha/c-a-7-crow.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-8', 'name' => 'スズメ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: チュンチュンスズメ', 'image_url' => '/gacha/c-a-8-sparrow.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-9', 'name' => 'カエル', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 雨降りのカエル', 'image_url' => '/gacha/c-a-9-frog.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-10', 'name' => 'ヒキガエル', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: イボイボヒキガエル', 'image_url' => '/gacha/c-a-10-toad.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-11', 'name' => 'トカゲ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 尻尾切りのトカゲ', 'image_url' => '/gacha/c-a-11-lizard.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-12', 'name' => 'カメ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: のろまなカメ', 'image_url' => '/gacha/c-a-12-turtle.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-13', 'name' => 'カタツムリ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 家持ちカタツムリ', 'image_url' => '/gacha/c-a-13-snail.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-14', 'name' => 'アリ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 働き者のアリ', 'image_url' => '/gacha/c-a-14-ant.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-a-15', 'name' => 'ハチ', 'type' => 'animal', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: ブンブンハチ', 'image_url' => '/gacha/c-a-15-bee.png', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-1', 'name' => 'あしがるおばけ', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 落ち武者足軽お化け', 'image_url' => '/gacha/c-y-1-ashigaru.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-2', 'name' => 'ゆうれい', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: うらめしや幽霊', 'image_url' => '/gacha/c-y-2-yurei.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-3', 'name' => 'ひとだま', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 青白い人魂', 'image_url' => '/gacha/c-y-3-hitodama.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-4', 'name' => 'おにび', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 彷徨う鬼火', 'image_url' => '/gacha/c-y-4-onibi.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-5', 'name' => 'きつねび', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 狐の嫁入り狐火', 'image_url' => '/gacha/c-y-5-kitsunebi.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-6', 'name' => 'つくもがみ', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: ガラクタ付喪神', 'image_url' => '/gacha/c-y-6-tsukumogami.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-7', 'name' => 'ほねおんな', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: ガリガリ骨女', 'image_url' => '/gacha/c-y-7-hone-onna.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-8', 'name' => 'テケテケ', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 下半身がないテケテケ', 'image_url' => '/gacha/c-y-8-teke-teke.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-9', 'name' => 'トイレのはなこさん', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: ３番目のトイレの花子さん', 'image_url' => '/gacha/c-y-9-hanako-san.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-10', 'name' => 'くちさけおんな', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: マスクをした口裂け女', 'image_url' => '/gacha/c-y-10-kuchisake-onna.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-11', 'name' => 'じんめんけん', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 喋る人面犬', 'image_url' => '/gacha/c-y-11-jinmenken.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-12', 'name' => 'ツチノコ', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 発見されたツチノコ', 'image_url' => '/gacha/c-y-12-tsuchinoko.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-13', 'name' => 'ケサランパサラン', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 謎の毛玉ケサランパサラン', 'image_url' => '/gacha/c-y-13-kesaran-pasaran.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-14', 'name' => 'ほうきがみ', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 掃除好き箒神', 'image_url' => '/gacha/c-y-14-hahakigami.svg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 'c-y-15', 'name' => 'ブルブル', 'type' => 'yokai', 'rarity' => 'C', 'description' => 'Cランクのようかい: 寒がりの震々', 'image_url' => '/gacha/c-y-15-buruburu.svg', 'created_at' => now(), 'updated_at' => now()],
        ];

        // Calculate hash ignoring timestamps
        $hashItems = array_map(function ($item) {
            unset($item['created_at'], $item['updated_at']);

            return $item;
        }, $items);
        $currentHash = md5(json_encode($hashItems));
        $className = self::class;

        // Check version
        $lastVersion = DB::table('seeder_versions')->where('seeder_class', $className)->first();

        if ($lastVersion && $lastVersion->hash === $currentHash && config('app.env') !== 'testing') {
            // Skip if hash is same and not in testing environment
            $this->command->info("Skipping $className: No changes detected.");

            return;
        }

        $this->command->info("Executing $className: Applying changes...");

        // Perform "wash" (Refresh data)
        DB::transaction(function () use ($items, $className, $currentHash) {
            // Upsert items
            // Using DB::table()->upsert() for performance
            // We need to ensure columns match the table schema
            DB::table('prizes')->upsert(
                array_map(function ($item) {
                    return array_merge($item, [
                        'created_at' => $item['created_at'] ?? now(),
                        'updated_at' => now(),
                    ]);
                }, $items),
                ['id'], // unique identifier
                ['name', 'type', 'rarity', 'description', 'image_url', 'updated_at'] // columns to update
            );

            // Delete items not in the list
            $ids = array_column($items, 'id');
            DB::table('prizes')->whereNotIn('id', $ids)->delete();

            // Update version
            DB::table('seeder_versions')->updateOrInsert(
                ['seeder_class' => $className],
                ['hash' => $currentHash, 'updated_at' => now()]
            );
        });

        $this->command->info("$className completed successfully.");
    }
}
