<?php

use CatPaw\Traits\create;

class Todo {
    use create;
    public string $id          = '';
    public string $description = '';
    public bool $checked       = false;
}