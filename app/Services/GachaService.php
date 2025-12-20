<?php

namespace App\Services;

class GachaService
{
    private const RARITY_WEIGHTS = [
        'UR' => 1,
        'SR' => 4,
        'R' => 15,
        'UC' => 30,
        'C' => 50,
    ];

    protected $imageUrlService;

    public function __construct(ImageUrlService $imageUrlService)
    {
        $this->imageUrlService = $imageUrlService;
    }

    /**
     * ガチャを引く
     *
     * @return array
     */
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

        // DBから該当レアリティのアイテムを取得
        $candidates = \App\Models\Prize::where('rarity', $selectedRarity)->get();

        if ($candidates->isEmpty()) {
            $candidates = \App\Models\Prize::where('rarity', 'C')->get();
        }

        $prize = $candidates->random();
        $item = $prize->toArray();

        // image_url -> imageUrl への変換とホスト付与はAPIリソースやフロント側で行うべきだが、
        // 現状の仕様に合わせてここで変換する。フロントエンドの修正後に整理する。
        // DBのカラム名は image_url だが、フロントエンドは imageUrl を期待しているためキーを変更する
        $item['imageUrl'] = $item['image_url'];
        unset($item['image_url']);

        // Prepend Image Host with Cache Buster
        $item['imageUrl'] = $this->imageUrlService->getUrl($item['imageUrl'], $prize->updated_at);

        return $item;
    }
}
