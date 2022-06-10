<?php

namespace app\api\pages;

use CatPaw\Web\Attributes\Consumes;
use CatPaw\Web\Attributes\GET;
use CatPaw\Web\Attributes\Path;
use CatPaw\Web\Attributes\Produces;
use CatPaw\Web\Attributes\PUT;
use CatPaw\Web\Attributes\RequestBody;

#[Path("/api/pages/")]
class HomePage {
    private array $state = [
        "clicks" => 0
    ];

    #[GET]
    #[Produces("application/json")]
    public function get() {
        return $this->state;
    }

    #[PUT]
    #[Consumes("application/json")]
    public function put(
        #[RequestBody] array $state
    ) {
        $this->state = $state;
    }
}