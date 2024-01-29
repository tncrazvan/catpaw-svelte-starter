<?php
use App\Todo;
use App\TodoService;
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\OperationId;
use CatPaw\Web\Attributes\ProducesErrorItem;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;
use function CatPaw\Web\failure;
use const CatPaw\Web\NOT_FOUND;

use const CatPaw\Web\OK;
use function CatPaw\Web\success;

return
#[OperationId("updateTodo")]
#[Summary('Toggle a todo from the list.')]
#[ProducesItem(OK, APPLICATION_JSON, 'on success', Todo::class, new Todo)]
#[ProducesErrorItem(NOT_FOUND, APPLICATION_JSON, 'when todo is not found')]
static function(TodoService $todos, string $id) {
    if (!$toggled = $todos->toggle($id)) {
        return failure("Couldn't toggle todo because it doesn't exist.", NOT_FOUND)->as(APPLICATION_JSON)->item();
    }
    return success($toggled)->as(APPLICATION_JSON)->item();
};
