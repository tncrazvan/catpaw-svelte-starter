<?php
use App\Todo;
use App\TodoService;
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\Body;
use CatPaw\Web\Attributes\Consumes;
use CatPaw\Web\Attributes\OperationId;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;
use const CatPaw\Web\OK;
use function CatPaw\Web\success;

return
#[OperationId('createTodo')]
#[Summary('Add a new todo to the list.')]
#[ProducesItem(OK, APPLICATION_JSON, 'on success', Todo::class, new Todo)]
#[Consumes(APPLICATION_JSON, Todo::class, new Todo)]
fn (TodoService $todos, #[Body] string $description) => success($todos->add($description))->as(APPLICATION_JSON)->item();
