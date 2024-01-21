<?php
use App\Todo;
use App\TodoService;
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\Body;
use CatPaw\Web\Attributes\Consumes;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;
use function CatPaw\Web\success;

return
#[Summary('Add a new todo to the list.')]
#[ProducesItem(Todo::class, APPLICATION_JSON, new Todo)]
#[Consumes(Todo::class, APPLICATION_JSON, new Todo)]
fn (TodoService $todos, #[Body] string $description) => success($todos->add($description))->as(APPLICATION_JSON)->item();
