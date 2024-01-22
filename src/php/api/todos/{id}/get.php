<?php
use App\Todo;
use App\TodoService;
use const CatPaw\Web\__APPLICATION_JSON;
use const CatPaw\Web\__NOT_FOUND;
use const CatPaw\Web\__OK;
use CatPaw\Web\Attributes\OperationId;
use CatPaw\Web\Attributes\ProducesErrorItem;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;
use function CatPaw\Web\failure;
use function CatPaw\Web\success;

return
#[OperationId("FindTodoItem")]
#[Summary('Find one todo from the list.')]
#[ProducesItem(__OK, __APPLICATION_JSON, 'on success', Todo::class, new Todo)]
#[ProducesErrorItem(__NOT_FOUND, __APPLICATION_JSON, 'when todo is not found')]
static function(TodoService $todos, string $id) {
    if (!$todo = $todos->findOne($id)) {
        return failure("Todo not found.", __NOT_FOUND)->as(__APPLICATION_JSON)->item();
    }
    return success($todo)->as(__APPLICATION_JSON)->item();
};
