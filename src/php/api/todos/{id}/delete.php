<?php
use App\TodoService;
use const CatPaw\Web\__APPLICATION_JSON;
use const CatPaw\Web\__OK;
use CatPaw\Web\Attributes\OperationId;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;
use function CatPaw\Web\success;

return
#[OperationId("deleteTodo")]
#[Summary('Remove an todo from the list.')]
#[ProducesItem(__OK, __APPLICATION_JSON, 'on success', 'bool', true)]
fn (TodoService $todos, string $id) => success($todos->remove($id))->as(__APPLICATION_JSON)->item();
