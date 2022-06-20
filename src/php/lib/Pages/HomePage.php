<?php

namespace App\Pages;

use CatPaw\Web\Attributes\Path;
use function CatPaw\Web\lazy;
use CatPaw\Web\Utilities\SPA;

#[Path("/")]
class HomePage extends SPA {
    private array $state = [];

    protected function setState(array $state, array &$session):void {
        $this->state = $state;
    }

    protected function getState(callable $path, array &$session): array {
        return [
            "clicks"  => lazy($path('clicks'), 0)->push($session['clicks'])->build(),
            "message" => lazy($path('message'), 'This is a lazy message')->push($session['message'])->build(),
            ...($this->state ?? [])
        ];
    }
}