<?php

namespace app\pages;

use CatPaw\Web\Attributes\Path;
use CatPaw\Web\Utilities\SPA;

#[Path("/")]
class HomePage extends SPA {
    protected $state = [
        "clicks" => 0
    ];

    protected function setState($state) {
        $this->state = $state;
    }

    protected function getState() {
        return $this->state;
    }
}