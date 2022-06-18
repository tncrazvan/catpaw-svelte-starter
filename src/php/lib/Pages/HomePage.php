<?php

namespace App\Pages;

use function App\lazy;
use CatPaw\Attributes\Entry;
use CatPaw\Web\Attributes\Path;

use CatPaw\Web\Utilities\SPA;

#[Path("/")]
class HomePage extends SPA {
    protected array $state = [];

    #[Entry]
    public function setup() {
        $this->state = [
            "clicks"  => 0,
            "message" => lazy("This is a lazy message")
        ];
    }

    protected function setState(array $state) {
        $this->state = $state;
    }

    protected function getState(): array {
        return $this->state;
    }
}