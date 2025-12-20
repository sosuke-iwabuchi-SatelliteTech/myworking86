<?php

namespace App\Services;

use Carbon\Carbon;

class ImageUrlService
{
    /**
     * Get the full URL for an image path with cache buster if provided.
     *
     * @param string $path
     * @param Carbon|null $updatedAt
     * @return string
     */
    public function getUrl(string $path, ?Carbon $updatedAt = null): string
    {
        $host = config('gacha.image_host');
        // Ensure path starts with / if host doesn't end with / and path doesn't start with /
        // But usually typically we just concat. Let's stick to simple concat as per previous code, 
        // but maybe clean up slashes if needed. For now, simple concat to match previous behavior safely.

        $url = $host . $path;

        if ($updatedAt) {
            $url .= '?v=' . $updatedAt->timestamp;
        }

        return $url;
    }
}
