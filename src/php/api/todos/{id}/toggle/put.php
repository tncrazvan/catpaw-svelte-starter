<?php
use App\Todo;
use App\TodoService;
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;
use function CatPaw\Web\success;

return
#[Summary('Toggle a todo from the list.')]
#[ProducesItem(Todo::class, APPLICATION_JSON, new Todo)]
fn (TodoService $todos, string $id) => success($todos->toggle($id))->as(APPLICATION_JSON)->item();
