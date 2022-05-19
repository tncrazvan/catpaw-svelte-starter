<?php

namespace {

    use function app\api\pages\home;
    use CatPaw\Web\Attributes\Produces;
    use CatPaw\Web\Attributes\StartWebServer;

    use CatPaw\Web\Utilities\Route;

    #[StartWebServer]
    function main() {
        Route::get("/api/pages/", #[Produces("application/json")] fn() => home());
    }
}
