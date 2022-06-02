<?php

namespace {
    use function app\api\pages\home;
    use CatPaw\Web\Attributes\StartWebServer;

    use CatPaw\Web\Utilities\Route;

    #[StartWebServer]
    function main(): void {
        Route::get("/api/pages/", home());
    }
}
