<?php
use App\TodoService;
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\OperationId;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;
use const CatPaw\Web\OK;
use function CatPaw\Web\success;

return
#[OperationId("deleteTodo")]
#[Summary('Remove an todo from the list.')]
#[ProducesItem(OK, APPLICATION_JSON, 'on success', 'bool', true)]
fn (TodoService $todos, string $id) => success($todos->remove($id))->as(APPLICATION_JSON)->item();
