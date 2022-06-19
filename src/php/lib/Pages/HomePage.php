<?php

namespace App\Pages;

use CatPaw\Web\Attributes\Path;


use function CatPaw\Web\lazy;

use CatPaw\Web\Utilities\SPA;

#[Path("/")]
class HomePage extends SPA {
    protected function setState(array $state, array &$session):void {
        $session['state'] = $state;
    }

    protected function getState(callable $id, array &$session): array {
        $session['state'] = [
            "clicks"  => 0,
            "message" => lazy($id('message'), 'This is a lazy message')->push($session['message'])->build(),
            ...($session['state'] ?? [])
            
        ];

        
        return $session['state'];
    }
}