<?php

class Todo {
    public function __construct(
        public string $id = '',
        public string $description = '',
        public bool $checked = false,
    ) {
    }
}