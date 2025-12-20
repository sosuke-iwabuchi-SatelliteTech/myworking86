<?php

namespace Tests\Unit\Services;

use App\Services\ImageUrlService;
use Carbon\Carbon;
use Tests\TestCase;

class ImageUrlServiceTest extends TestCase
{
    public function test_get_url_without_timestamp()
    {
        $service = new ImageUrlService();
        config(['gacha.image_host' => 'https://example.com']);

        $url = $service->getUrl('/images/test.png');

        $this->assertEquals('https://example.com/images/test.png', $url);
    }

    public function test_get_url_with_timestamp()
    {
        $service = new ImageUrlService();
        config(['gacha.image_host' => 'https://example.com']);

        $updatedAt = Carbon::create(2023, 1, 1, 12, 0, 0);
        $url = $service->getUrl('/images/test.png', $updatedAt);

        $expectedTimestamp = $updatedAt->timestamp;
        $this->assertEquals("https://example.com/images/test.png?v={$expectedTimestamp}", $url);
    }
}
