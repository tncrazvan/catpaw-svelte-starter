<?php
use CatPaw\Web\Attributes\Body;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;

return 
#[Summary("Add a new todo to the list.")]
#[ProducesItem(Todo::class)]
fn (TodoService $todos, #[Body] string $description) => $todos->add($description);