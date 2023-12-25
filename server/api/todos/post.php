<?php
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\Body;
use CatPaw\Web\Attributes\ProducesItem;

use CatPaw\Web\Attributes\Summary;

return 
#[Summary('Add a new todo to the list.')]
#[ProducesItem(Todo::class, APPLICATION_JSON, new Todo)]
fn (TodoService $todos, #[Body] string $description) => $todos->add($description);