<?php

namespace {

    use CatPaw\Web\Attributes\Produces;
    use CatPaw\Web\Attributes\StartWebServer;
    use CatPaw\Web\Utilities\Route;

    use function app\api\pages\home;

    #[StartWebServer]
    function main()
    {
        Route::get("/api/pages/", #[Produces("application/json")] fn () =>home());
    }
}
