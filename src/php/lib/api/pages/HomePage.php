<?php

namespace app\api\pages;

use CatPaw\Web\Attributes\Produces;
use Closure;

/**
 * @return Closure
 */
function home(): Closure {
	return #[Produces("application/json")] fn() => [
        "name" => "world"
    ];
}
