<?php

namespace App\Services;

class GachaService
{
    private const ITEMS = [
        [ 'id' => 'ur-x-1', 'name' => 'セレスティアルドラゴン', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 天空のセレスティアルドラゴン', 'imageUrl' => '/gacha/ur-x-1-celestial-dragon.png' ],
        [ 'id' => 'ur-x-2', 'name' => 'ダイヤモンドフェニックス', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 金剛のダイヤモンドフェニックス', 'imageUrl' => '/gacha/ur-x-2-diamond-phoenix.png' ],
        [ 'id' => 'ur-x-3', 'name' => 'サムライしょうぐん', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 亡霊のサムライ将軍', 'imageUrl' => '/gacha/ur-x-3-samurai-warlord.png' ],
        [ 'id' => 'ur-x-4', 'name' => 'ししおう', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 黄金の獅子王', 'imageUrl' => '/gacha/ur-x-4-golden-lion-king.png' ],
        [ 'id' => 'ur-x-5', 'name' => 'しゅごしゃ', 'rarity' => 'UR', 'description' => 'URランクのスペシャル景品: 古代樹の守護者', 'imageUrl' => '/gacha/ur-x-5-ancient-tree-guardian.png' ],
        [ 'id' => 'ur-a-1', 'name' => 'ドラゴン', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 伝説のドラゴン', 'imageUrl' => '/gacha/ur-a-1-dragon.svg' ],
        [ 'id' => 'ur-a-2', 'name' => 'フェニックス', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 灼熱のフェニックス', 'imageUrl' => '/gacha/ur-a-2-phoenix.svg' ],
        [ 'id' => 'ur-a-3', 'name' => 'グリフォン', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 天空のグリフォン', 'imageUrl' => '/gacha/ur-a-3-griffin.svg' ],
        [ 'id' => 'ur-a-4', 'name' => 'ペガサス', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 星空のペガサス', 'imageUrl' => '/gacha/ur-a-4-pegasus.svg' ],
        [ 'id' => 'ur-a-5', 'name' => 'クラーケン', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 深海の覇者クラーケン', 'imageUrl' => '/gacha/ur-a-5-kraken.svg' ],
        [ 'id' => 'ur-a-6', 'name' => 'ヒドラ', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 無限の首ヒドラ', 'imageUrl' => '/gacha/ur-a-6-hydra.svg' ],
        [ 'id' => 'ur-a-7', 'name' => 'キメラ', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 混沌のキメラ', 'imageUrl' => '/gacha/ur-a-7-chimera.svg' ],
        [ 'id' => 'ur-a-8', 'name' => 'ケルベロス', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 冥界の番犬ケルベロス', 'imageUrl' => '/gacha/ur-a-8-cerberus.svg' ],
        [ 'id' => 'ur-a-9', 'name' => 'リヴァイアサン', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 渦潮のリヴァイアサン', 'imageUrl' => '/gacha/ur-a-9-leviathan.svg' ],
        [ 'id' => 'ur-a-10', 'name' => 'ベヒモス', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 大地の主ベヒモス', 'imageUrl' => '/gacha/ur-a-10-behemoth.svg' ],
        [ 'id' => 'ur-a-11', 'name' => 'バジリスク', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 石化のバジリスク', 'imageUrl' => '/gacha/ur-a-11-basilisk.svg' ],
        [ 'id' => 'ur-a-12', 'name' => 'スフィンクス', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 謎かけスフィンクス', 'imageUrl' => '/gacha/ur-a-12-sphinx.svg' ],
        [ 'id' => 'ur-a-13', 'name' => 'イエティ', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 雪山の王者イエティ', 'imageUrl' => '/gacha/ur-a-13-yeti.svg' ],
        [ 'id' => 'ur-a-14', 'name' => 'ビッグフット', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 巨足のビッグフット', 'imageUrl' => '/gacha/ur-a-14-bigfoot.svg' ],
        [ 'id' => 'ur-a-15', 'name' => 'ネッシー', 'rarity' => 'UR', 'description' => 'URランクのどうぶつ: 幻のネッシー', 'imageUrl' => '/gacha/ur-a-15-loch-ness-monster.svg' ],
        [ 'id' => 'ur-y-1', 'name' => 'ヤマタノオロチ', 'rarity' => 'UR', 'description' => 'URランクのようかい: 災厄のヤマタノオロチ', 'imageUrl' => '/gacha/ur-y-1-yamata-no-orochi.svg' ],
        [ 'id' => 'ur-y-2', 'name' => 'きゅうびのキツネ', 'rarity' => 'UR', 'description' => 'URランクのようかい: 金色の九尾の狐', 'imageUrl' => '/gacha/ur-y-2-kyubi-no-kitsune.svg' ],
        [ 'id' => 'ur-y-3', 'name' => 'しゅてんどうじ', 'rarity' => 'UR', 'description' => 'URランクのようかい: 鬼神酒呑童子', 'imageUrl' => '/gacha/ur-y-3-shuten-doji.svg' ],
        [ 'id' => 'ur-y-4', 'name' => 'おおてんぐ', 'rarity' => 'UR', 'description' => 'URランクのようかい: 暴風の大天狗', 'imageUrl' => '/gacha/ur-y-4-daitengu.svg' ],
        [ 'id' => 'ur-y-5', 'name' => 'ぬらりひょん', 'rarity' => 'UR', 'description' => 'URランクのようかい: 妖怪総大将ぬらりひょん', 'imageUrl' => '/gacha/ur-y-5-nurarihyon.svg' ],
        [ 'id' => 'ur-y-6', 'name' => 'がしゃどくろ', 'rarity' => 'UR', 'description' => 'URランクのようかい: 巨大な骸骨がしゃどくろ', 'imageUrl' => '/gacha/ur-y-6-gashadokuro.svg' ],
        [ 'id' => 'ur-y-7', 'name' => 'たまものまえ', 'rarity' => 'UR', 'description' => 'URランクのようかい: 絶世の美女玉藻前', 'imageUrl' => '/gacha/ur-y-7-tamamo-no-mae.svg' ],
        [ 'id' => 'ur-y-8', 'name' => 'すとくてんのう', 'rarity' => 'UR', 'description' => 'URランクのようかい: 怨霊崇徳天皇', 'imageUrl' => '/gacha/ur-y-8-emperor-sutoku.svg' ],
        [ 'id' => 'ur-y-9', 'name' => 'たいらのまさかど', 'rarity' => 'UR', 'description' => 'URランクのようかい: 荒ぶる魂平将門', 'imageUrl' => '/gacha/ur-y-9-taira-no-masakado.svg' ],
        [ 'id' => 'ur-y-10', 'name' => 'おおたけまる', 'rarity' => 'UR', 'description' => 'URランクのようかい: 剛力の鬼大嶽丸', 'imageUrl' => '/gacha/ur-y-10-otakemaru.svg' ],
        [ 'id' => 'ur-y-11', 'name' => 'うしおに', 'rarity' => 'UR', 'description' => 'URランクのようかい: 猛毒の牛鬼', 'imageUrl' => '/gacha/ur-y-11-ushi-oni.svg' ],
        [ 'id' => 'ur-y-12', 'name' => 'らいじん', 'rarity' => 'UR', 'description' => 'URランクのようかい: 轟く雷神', 'imageUrl' => '/gacha/ur-y-12-raijin.svg' ],
        [ 'id' => 'ur-y-13', 'name' => 'ふうじん', 'rarity' => 'UR', 'description' => 'URランクのようかい: 吹き荒れる風神', 'imageUrl' => '/gacha/ur-y-13-fujin.svg' ],
        [ 'id' => 'ur-y-14', 'name' => 'やたがらす', 'rarity' => 'UR', 'description' => 'URランクのようかい: 導きの八咫烏', 'imageUrl' => '/gacha/ur-y-14-yatagarasu.svg' ],
        [ 'id' => 'ur-y-15', 'name' => 'きりん', 'rarity' => 'UR', 'description' => 'URランクのようかい: 聖獣麒麟', 'imageUrl' => '/gacha/ur-y-15-kirin.svg' ],
        [ 'id' => 'sr-a-1', 'name' => 'ライオン', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 百獣の王ライオン', 'imageUrl' => '/gacha/sr-a-1-lion.svg' ],
        [ 'id' => 'sr-a-2', 'name' => 'トラ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 孤高のトラ', 'imageUrl' => '/gacha/sr-a-2-tiger.svg' ],
        [ 'id' => 'sr-a-3', 'name' => 'ゾウ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 巨体のゾウ', 'imageUrl' => '/gacha/sr-a-3-elephant.svg' ],
        [ 'id' => 'sr-a-4', 'name' => 'ゴリラ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 怪力ゴリラ', 'imageUrl' => '/gacha/sr-a-4-gorilla.svg' ],
        [ 'id' => 'sr-a-5', 'name' => 'シロクマ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 氷原のシロクマ', 'imageUrl' => '/gacha/sr-a-5-polar-bear.svg' ],
        [ 'id' => 'sr-a-6', 'name' => 'サイ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 突進するサイ', 'imageUrl' => '/gacha/sr-a-6-rhino.svg' ],
        [ 'id' => 'sr-a-7', 'name' => 'カバ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 大口のカバ', 'imageUrl' => '/gacha/sr-a-7-hippo.svg' ],
        [ 'id' => 'sr-a-8', 'name' => 'ヒグマ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 暴れん坊ヒグマ', 'imageUrl' => '/gacha/sr-a-8-grizzly-bear.svg' ],
        [ 'id' => 'sr-a-9', 'name' => 'ヒョウ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 密林のヒョウ', 'imageUrl' => '/gacha/sr-a-9-leopard.svg' ],
        [ 'id' => 'sr-a-10', 'name' => 'ジャガー', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 黄金のジャガー', 'imageUrl' => '/gacha/sr-a-10-jaguar.svg' ],
        [ 'id' => 'sr-a-11', 'name' => 'オオカミ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 荒野のオオカミ', 'imageUrl' => '/gacha/sr-a-11-wolf.svg' ],
        [ 'id' => 'sr-a-12', 'name' => 'ワシ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 天空の狩人ワシ', 'imageUrl' => '/gacha/sr-a-12-eagle.svg' ],
        [ 'id' => 'sr-a-13', 'name' => 'サメ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 海のハンターサメ', 'imageUrl' => '/gacha/sr-a-13-shark.svg' ],
        [ 'id' => 'sr-a-14', 'name' => 'クジラ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 大海原のクジラ', 'imageUrl' => '/gacha/sr-a-14-whale.svg' ],
        [ 'id' => 'sr-a-15', 'name' => 'ワニ', 'rarity' => 'SR', 'description' => 'SRランクのどうぶつ: 沼地の支配者ワニ', 'imageUrl' => '/gacha/sr-a-15-crocodile.svg' ],
        [ 'id' => 'sr-y-1', 'name' => 'てんぐ', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 空飛ぶ天狗', 'imageUrl' => '/gacha/sr-y-1-tengu.png' ],
        [ 'id' => 'sr-y-2', 'name' => 'カッパ', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 川辺の王者河童', 'imageUrl' => '/gacha/sr-y-2-kappa.png' ],
        [ 'id' => 'sr-y-3', 'name' => 'オニ', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 赤き鬼', 'imageUrl' => '/gacha/sr-y-3-oni.png' ],
        [ 'id' => 'sr-y-4', 'name' => 'ゆきおんな', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 吹雪の雪女', 'imageUrl' => '/gacha/sr-y-4-yuki-onna.png' ],
        [ 'id' => 'sr-y-5', 'name' => 'ろくろくび', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 長首のろくろ首', 'imageUrl' => '/gacha/sr-y-5-rokurokubi.png' ],
        [ 'id' => 'sr-y-6', 'name' => 'うみぼうず', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 海の怪物海坊主', 'imageUrl' => '/gacha/sr-y-6-umibozu.png' ],
        [ 'id' => 'sr-y-7', 'name' => 'ぬえ', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 夜の怪鳥鵺', 'imageUrl' => '/gacha/sr-y-7-nue.png' ],
        [ 'id' => 'sr-y-8', 'name' => 'つちぐも', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 忍び寄る土蜘蛛', 'imageUrl' => '/gacha/sr-y-8-tsuchigumo.png' ],
        [ 'id' => 'sr-y-9', 'name' => 'じょろうぐも', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 誘惑の女郎蜘蛛', 'imageUrl' => '/gacha/sr-y-9-jorogumo.png' ],
        [ 'id' => 'sr-y-10', 'name' => 'わにゅうどう', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 炎の輪入道', 'imageUrl' => '/gacha/sr-y-10-wanyudo.png' ],
        [ 'id' => 'sr-y-11', 'name' => 'かまいたち', 'rarity' => 'SR', 'description' => 'SRランクのようかい: つむじ風の鎌鼬', 'imageUrl' => '/gacha/sr-y-11-kamaitachi.png' ],
        [ 'id' => 'sr-y-12', 'name' => 'かさおばけ', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 踊る傘お化け', 'imageUrl' => '/gacha/sr-y-12-kasa-obake.png' ],
        [ 'id' => 'sr-y-13', 'name' => 'ちょうちんおばけ', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 笑う提灯お化け', 'imageUrl' => '/gacha/sr-y-13-chochin-obake.png' ],
        [ 'id' => 'sr-y-14', 'name' => 'いったんもめん', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 空舞う一反木綿', 'imageUrl' => '/gacha/sr-y-14-ittan-momen.png' ],
        [ 'id' => 'sr-y-15', 'name' => 'ぬりかべ', 'rarity' => 'SR', 'description' => 'SRランクのようかい: 鉄壁のぬりかべ', 'imageUrl' => '/gacha/sr-y-15-nurikabe.png' ],
        [ 'id' => 'r-a-1', 'name' => 'キリン', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 首長キリン', 'imageUrl' => '/gacha/r-a-1-giraffe.svg' ],
        [ 'id' => 'r-a-2', 'name' => 'シマウマ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 白黒シマウマ', 'imageUrl' => '/gacha/r-a-2-zebra.svg' ],
        [ 'id' => 'r-a-3', 'name' => 'カンガルー', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: ボクサーカンガルー', 'imageUrl' => '/gacha/r-a-3-kangaroo.svg' ],
        [ 'id' => 'r-a-4', 'name' => 'パンダ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 人気者パンダ', 'imageUrl' => '/gacha/r-a-4-panda.svg' ],
        [ 'id' => 'r-a-5', 'name' => 'コアラ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: ユーカリ好きのコアラ', 'imageUrl' => '/gacha/r-a-5-koala.svg' ],
        [ 'id' => 'r-a-6', 'name' => 'チーター', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 音速のチーター', 'imageUrl' => '/gacha/r-a-6-cheetah.svg' ],
        [ 'id' => 'r-a-7', 'name' => 'バッファロー', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 荒くれバッファロー', 'imageUrl' => '/gacha/r-a-7-buffalo.svg' ],
        [ 'id' => 'r-a-8', 'name' => 'ヘラジカ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 森の賢者ヘラジカ', 'imageUrl' => '/gacha/r-a-8-moose.svg' ],
        [ 'id' => 'r-a-9', 'name' => 'ラクダ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 砂漠の旅人ラクダ', 'imageUrl' => '/gacha/r-a-9-camel.svg' ],
        [ 'id' => 'r-a-10', 'name' => 'ダチョウ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 爆走ダチョウ', 'imageUrl' => '/gacha/r-a-10-ostrich.svg' ],
        [ 'id' => 'r-a-11', 'name' => 'ハヤブサ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 急降下ハヤブサ', 'imageUrl' => '/gacha/r-a-11-falcon.svg' ],
        [ 'id' => 'r-a-12', 'name' => 'フクロウ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 夜更かしフクロウ', 'imageUrl' => '/gacha/r-a-12-owl.svg' ],
        [ 'id' => 'r-a-13', 'name' => 'イルカ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 賢いイルカ', 'imageUrl' => '/gacha/r-a-13-dolphin.svg' ],
        [ 'id' => 'r-a-14', 'name' => 'タコ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: ８本足のタコ', 'imageUrl' => '/gacha/r-a-14-octopus.svg' ],
        [ 'id' => 'r-a-15', 'name' => 'コブラ', 'rarity' => 'R', 'description' => 'Rランクのどうぶつ: 猛毒コブラ', 'imageUrl' => '/gacha/r-a-15-cobra.svg' ],
        [ 'id' => 'r-y-1', 'name' => 'ざしきわらし', 'rarity' => 'R', 'description' => 'Rランクのようかい: 幸福の座敷童子', 'imageUrl' => '/gacha/r-y-1-zashiki-warashi.svg' ],
        [ 'id' => 'r-y-2', 'name' => 'たぬき', 'rarity' => 'R', 'description' => 'Rランクのようかい: 化け上手な化け狸', 'imageUrl' => '/gacha/r-y-2-tanuki.svg' ],
        [ 'id' => 'r-y-3', 'name' => 'キツネ', 'rarity' => 'R', 'description' => 'Rランクのようかい: いたずら妖狐', 'imageUrl' => '/gacha/r-y-3-kitsune.svg' ],
        [ 'id' => 'r-y-4', 'name' => 'ねこまた', 'rarity' => 'R', 'description' => 'Rランクのようかい: 尻尾二つの猫又', 'imageUrl' => '/gacha/r-y-4-nekomata.svg' ],
        [ 'id' => 'r-y-5', 'name' => 'いぬがみ', 'rarity' => 'R', 'description' => 'Rランクのようかい: 呪いの犬神', 'imageUrl' => '/gacha/r-y-5-inugami.svg' ],
        [ 'id' => 'r-y-6', 'name' => 'あかなめ', 'rarity' => 'R', 'description' => 'Rランクのようかい: 風呂場の垢嘗', 'imageUrl' => '/gacha/r-y-6-akaname.svg' ],
        [ 'id' => 'r-y-7', 'name' => 'あずきあらい', 'rarity' => 'R', 'description' => 'Rランクのようかい: 音を立てる小豆洗い', 'imageUrl' => '/gacha/r-y-7-azukiarai.svg' ],
        [ 'id' => 'r-y-8', 'name' => 'すなかけばばあ', 'rarity' => 'R', 'description' => 'Rランクのようかい: 砂を撒く砂かけ婆', 'imageUrl' => '/gacha/r-y-8-sunakake-baba.svg' ],
        [ 'id' => 'r-y-9', 'name' => 'こなきじじい', 'rarity' => 'R', 'description' => 'Rランクのようかい: 重くなる子泣き爺', 'imageUrl' => '/gacha/r-y-9-konaki-jiji.svg' ],
        [ 'id' => 'r-y-10', 'name' => 'かわこぞう', 'rarity' => 'R', 'description' => 'Rランクのようかい: 川遊びの川小僧', 'imageUrl' => '/gacha/r-y-10-kappa-(river-child).svg' ],
        [ 'id' => 'r-y-11', 'name' => 'とうふこぞう', 'rarity' => 'R', 'description' => 'Rランクのようかい: 豆腐を持つ豆腐小僧', 'imageUrl' => '/gacha/r-y-11-tofu-kozo.svg' ],
        [ 'id' => 'r-y-12', 'name' => 'ひとつめこぞう', 'rarity' => 'R', 'description' => 'Rランクのようかい: 一つ目小僧', 'imageUrl' => '/gacha/r-y-12-hitotsume-kozo.svg' ],
        [ 'id' => 'r-y-13', 'name' => 'のっぺらぼう', 'rarity' => 'R', 'description' => 'Rランクのようかい: 顔のないのっぺらぼう', 'imageUrl' => '/gacha/r-y-13-noppera-bo.svg' ],
        [ 'id' => 'r-y-14', 'name' => 'ふたくちおんな', 'rarity' => 'R', 'description' => 'Rランクのようかい: 大食い二口女', 'imageUrl' => '/gacha/r-y-14-futakuchi-onna.svg' ],
        [ 'id' => 'r-y-15', 'name' => 'バク', 'rarity' => 'R', 'description' => 'Rランクのようかい: 夢を食べる獏', 'imageUrl' => '/gacha/r-y-15-baku.svg' ],
        [ 'id' => 'uc-a-1', 'name' => 'キツネ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: こそこそキツネ', 'imageUrl' => '/gacha/uc-a-1-fox.svg' ],
        [ 'id' => 'uc-a-2', 'name' => 'アライグマ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 洗い上手なアライグマ', 'imageUrl' => '/gacha/uc-a-2-raccoon.svg' ],
        [ 'id' => 'uc-a-3', 'name' => 'アナグマ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 穴掘りアナグマ', 'imageUrl' => '/gacha/uc-a-3-badger.svg' ],
        [ 'id' => 'uc-a-4', 'name' => 'ビーバー', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: ダム作りビーバー', 'imageUrl' => '/gacha/uc-a-4-beaver.svg' ],
        [ 'id' => 'uc-a-5', 'name' => 'カワウソ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 手先の器用なカワウソ', 'imageUrl' => '/gacha/uc-a-5-otter.svg' ],
        [ 'id' => 'uc-a-6', 'name' => 'シカ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 臆病なシカ', 'imageUrl' => '/gacha/uc-a-6-deer.svg' ],
        [ 'id' => 'uc-a-7', 'name' => 'ヤギ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 手紙を食べるヤギ', 'imageUrl' => '/gacha/uc-a-7-goat.svg' ],
        [ 'id' => 'uc-a-8', 'name' => 'ヒツジ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: ふわふわヒツジ', 'imageUrl' => '/gacha/uc-a-8-sheep.svg' ],
        [ 'id' => 'uc-a-9', 'name' => 'ブタ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 食いしん坊ブタ', 'imageUrl' => '/gacha/uc-a-9-pig.svg' ],
        [ 'id' => 'uc-a-10', 'name' => 'ウシ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: のんびりウシ', 'imageUrl' => '/gacha/uc-a-10-cow.svg' ],
        [ 'id' => 'uc-a-11', 'name' => 'ウマ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 駆け足ウマ', 'imageUrl' => '/gacha/uc-a-11-horse.svg' ],
        [ 'id' => 'uc-a-12', 'name' => 'イヌ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 忠実なイヌ', 'imageUrl' => '/gacha/uc-a-12-dog.svg' ],
        [ 'id' => 'uc-a-13', 'name' => 'ネコ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 気まぐれネコ', 'imageUrl' => '/gacha/uc-a-13-cat.svg' ],
        [ 'id' => 'uc-a-14', 'name' => 'ウサギ', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 跳ねるウサギ', 'imageUrl' => '/gacha/uc-a-14-rabbit.svg' ],
        [ 'id' => 'uc-a-15', 'name' => 'リス', 'rarity' => 'UC', 'description' => 'UCランクのどうぶつ: 木登りリス', 'imageUrl' => '/gacha/uc-a-15-squirrel.svg' ],
        [ 'id' => 'uc-y-1', 'name' => 'からかさ', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 忘れられた唐傘', 'imageUrl' => '/gacha/uc-y-1-karakasa.svg' ],
        [ 'id' => 'uc-y-2', 'name' => 'ばけぞうり', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 古びた化け草履', 'imageUrl' => '/gacha/uc-y-2-bake-zori.svg' ],
        [ 'id' => 'uc-y-3', 'name' => 'もくもくれん', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 障子の目目連', 'imageUrl' => '/gacha/uc-y-3-mokumokuren.svg' ],
        [ 'id' => 'uc-y-4', 'name' => 'けうけげん', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 毛むくじゃら毛羽毛現', 'imageUrl' => '/gacha/uc-y-4-keukegen.svg' ],
        [ 'id' => 'uc-y-5', 'name' => 'しりめ', 'rarity' => 'UC', 'description' => 'UCランクのようかい: お尻に目がある尻目', 'imageUrl' => '/gacha/uc-y-5-shirime.svg' ],
        [ 'id' => 'uc-y-6', 'name' => 'べとべとさん', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 足音のべとべとさん', 'imageUrl' => '/gacha/uc-y-6-betobeto-san.svg' ],
        [ 'id' => 'uc-y-7', 'name' => 'こだま', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 山の精霊木霊', 'imageUrl' => '/gacha/uc-y-7-kodama.svg' ],
        [ 'id' => 'uc-y-8', 'name' => 'アマビエ', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 疫病退散アマビエ', 'imageUrl' => '/gacha/uc-y-8-amabie.svg' ],
        [ 'id' => 'uc-y-9', 'name' => 'にんぎょ', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 哀愁の人魚', 'imageUrl' => '/gacha/uc-y-9-ningyo.svg' ],
        [ 'id' => 'uc-y-10', 'name' => 'かわうそ', 'rarity' => 'UC', 'description' => 'UCランクのようかい: いたずら化け獺', 'imageUrl' => '/gacha/uc-y-10-kawauso.svg' ],
        [ 'id' => 'uc-y-11', 'name' => 'ムジナ', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 人真似ムジナ', 'imageUrl' => '/gacha/uc-y-11-mujina.svg' ],
        [ 'id' => 'uc-y-12', 'name' => 'さとり', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 心をこっそり読む覚', 'imageUrl' => '/gacha/uc-y-12-satori.svg' ],
        [ 'id' => 'uc-y-13', 'name' => 'やまびこ', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 響く山彦', 'imageUrl' => '/gacha/uc-y-13-yama-biko.svg' ],
        [ 'id' => 'uc-y-14', 'name' => 'キジムナー', 'rarity' => 'UC', 'description' => 'UCランクのようかい: ガジュマルの精キジムナー', 'imageUrl' => '/gacha/uc-y-14-kijimuna.svg' ],
        [ 'id' => 'uc-y-15', 'name' => 'ガジュマル', 'rarity' => 'UC', 'description' => 'UCランクのようかい: 絡みつくガジュマル', 'imageUrl' => '/gacha/uc-y-15-gajumaru.svg' ],
        [ 'id' => 'c-a-1', 'name' => 'ネズミ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: ちょこまかネズミ', 'imageUrl' => '/gacha/c-a-1-mouse.svg' ],
        [ 'id' => 'c-a-2', 'name' => 'ドブネズミ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 地下道のドブネズミ', 'imageUrl' => '/gacha/c-a-2-rat.svg' ],
        [ 'id' => 'c-a-3', 'name' => 'ニワトリ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 早起きニワトリ', 'imageUrl' => '/gacha/c-a-3-chicken.svg' ],
        [ 'id' => 'c-a-4', 'name' => 'アヒル', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: ガーガーアヒル', 'imageUrl' => '/gacha/c-a-4-duck.svg' ],
        [ 'id' => 'c-a-5', 'name' => 'ガチョウ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: お騒がせガチョウ', 'imageUrl' => '/gacha/c-a-5-goose.svg' ],
        [ 'id' => 'c-a-6', 'name' => 'ハト', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 公園のハト', 'imageUrl' => '/gacha/c-a-6-pigeon.svg' ],
        [ 'id' => 'c-a-7', 'name' => 'カラス', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: ゴミ捨て場のカラス', 'imageUrl' => '/gacha/c-a-7-crow.svg' ],
        [ 'id' => 'c-a-8', 'name' => 'スズメ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: チュンチュンスズメ', 'imageUrl' => '/gacha/c-a-8-sparrow.svg' ],
        [ 'id' => 'c-a-9', 'name' => 'カエル', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 雨降りのカエル', 'imageUrl' => '/gacha/c-a-9-frog.svg' ],
        [ 'id' => 'c-a-10', 'name' => 'ヒキガエル', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: イボイボヒキガエル', 'imageUrl' => '/gacha/c-a-10-toad.svg' ],
        [ 'id' => 'c-a-11', 'name' => 'トカゲ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 尻尾切りのトカゲ', 'imageUrl' => '/gacha/c-a-11-lizard.svg' ],
        [ 'id' => 'c-a-12', 'name' => 'カメ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: のろまなカメ', 'imageUrl' => '/gacha/c-a-12-turtle.svg' ],
        [ 'id' => 'c-a-13', 'name' => 'カタツムリ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 家持ちカタツムリ', 'imageUrl' => '/gacha/c-a-13-snail.svg' ],
        [ 'id' => 'c-a-14', 'name' => 'アリ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: 働き者のアリ', 'imageUrl' => '/gacha/c-a-14-ant.svg' ],
        [ 'id' => 'c-a-15', 'name' => 'ハチ', 'rarity' => 'C', 'description' => 'Cランクのどうぶつ: ブンブンハチ', 'imageUrl' => '/gacha/c-a-15-bee.svg' ],
        [ 'id' => 'c-y-1', 'name' => 'あしがるおばけ', 'rarity' => 'C', 'description' => 'Cランクのようかい: 落ち武者足軽お化け', 'imageUrl' => '/gacha/c-y-1-ashigaru.svg' ],
        [ 'id' => 'c-y-2', 'name' => 'ゆうれい', 'rarity' => 'C', 'description' => 'Cランクのようかい: うらめしや幽霊', 'imageUrl' => '/gacha/c-y-2-yurei.svg' ],
        [ 'id' => 'c-y-3', 'name' => 'ひとだま', 'rarity' => 'C', 'description' => 'Cランクのようかい: 青白い人魂', 'imageUrl' => '/gacha/c-y-3-hitodama.svg' ],
        [ 'id' => 'c-y-4', 'name' => 'おにび', 'rarity' => 'C', 'description' => 'Cランクのようかい: 彷徨う鬼火', 'imageUrl' => '/gacha/c-y-4-onibi.svg' ],
        [ 'id' => 'c-y-5', 'name' => 'きつねび', 'rarity' => 'C', 'description' => 'Cランクのようかい: 狐の嫁入り狐火', 'imageUrl' => '/gacha/c-y-5-kitsunebi.svg' ],
        [ 'id' => 'c-y-6', 'name' => 'つくもがみ', 'rarity' => 'C', 'description' => 'Cランクのようかい: ガラクタ付喪神', 'imageUrl' => '/gacha/c-y-6-tsukumogami.svg' ],
        [ 'id' => 'c-y-7', 'name' => 'ほねおんな', 'rarity' => 'C', 'description' => 'Cランクのようかい: ガリガリ骨女', 'imageUrl' => '/gacha/c-y-7-hone-onna.svg' ],
        [ 'id' => 'c-y-8', 'name' => 'テケテケ', 'rarity' => 'C', 'description' => 'Cランクのようかい: 下半身がないテケテケ', 'imageUrl' => '/gacha/c-y-8-teke-teke.svg' ],
        [ 'id' => 'c-y-9', 'name' => 'トイレのはなこさん', 'rarity' => 'C', 'description' => 'Cランクのようかい: ３番目のトイレの花子さん', 'imageUrl' => '/gacha/c-y-9-hanako-san.svg' ],
        [ 'id' => 'c-y-10', 'name' => 'くちさけおんな', 'rarity' => 'C', 'description' => 'Cランクのようかい: マスクをした口裂け女', 'imageUrl' => '/gacha/c-y-10-kuchisake-onna.svg' ],
        [ 'id' => 'c-y-11', 'name' => 'じんめんけん', 'rarity' => 'C', 'description' => 'Cランクのようかい: 喋る人面犬', 'imageUrl' => '/gacha/c-y-11-jinmenken.svg' ],
        [ 'id' => 'c-y-12', 'name' => 'ツチノコ', 'rarity' => 'C', 'description' => 'Cランクのようかい: 発見されたツチノコ', 'imageUrl' => '/gacha/c-y-12-tsuchinoko.svg' ],
        [ 'id' => 'c-y-13', 'name' => 'ケサランパサラン', 'rarity' => 'C', 'description' => 'Cランクのようかい: 謎の毛玉ケサランパサラン', 'imageUrl' => '/gacha/c-y-13-kesaran-pasaran.svg' ],
        [ 'id' => 'c-y-14', 'name' => 'ほうきがみ', 'rarity' => 'C', 'description' => 'Cランクのようかい: 掃除好き箒神', 'imageUrl' => '/gacha/c-y-14-hahakigami.svg' ],
        [ 'id' => 'c-y-15', 'name' => 'ブルブル', 'rarity' => 'C', 'description' => 'Cランクのようかい: 寒がりの震々', 'imageUrl' => '/gacha/c-y-15-buruburu.svg' ],
    ];

    private const RARITY_WEIGHTS = [
        'UR' => 1,
        'SR' => 4,
        'R' => 15,
        'UC' => 30,
        'C' => 50,
    ];

    public function pull(): array
    {
        $totalWeight = array_sum(self::RARITY_WEIGHTS);
        $random = mt_rand(1, $totalWeight);

        $currentWeight = 0;
        $selectedRarity = 'C';

        foreach (self::RARITY_WEIGHTS as $rarity => $weight) {
            $currentWeight += $weight;
            if ($random <= $currentWeight) {
                $selectedRarity = $rarity;
                break;
            }
        }

        $candidates = array_filter(self::ITEMS, fn($item) => $item['rarity'] === $selectedRarity);

        if (empty($candidates)) {
             $candidates = array_filter(self::ITEMS, fn($item) => $item['rarity'] === 'C');
        }

        $candidates = array_values($candidates);
        $item = $candidates[array_rand($candidates)];
        
        // Prepend Image Host
        $imageHost = env('VITE_GACHA_IMAGE_HOST', '');
        $item['imageUrl'] = $imageHost . $item['imageUrl'];
        
        return $item;
    }
}

