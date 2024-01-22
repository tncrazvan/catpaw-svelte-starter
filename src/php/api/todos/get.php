<?php
use App\Todo;
use App\TodoService;
use const CatPaw\Web\__APPLICATION_JSON;
use const CatPaw\Web\__OK;
use CatPaw\Web\Attributes\OperationId;
use CatPaw\Web\Attributes\ProducesPage;
use CatPaw\Web\Attributes\Summary;
use CatPaw\Web\Page;
use function CatPaw\Web\success;

return
#[OperationId("findTodoPage")]
#[Summary('Find a page of todos from the list.')]
#[ProducesPage(__OK, __APPLICATION_JSON, 'on success', Todo::class, new Todo)]
fn (TodoService $todos, Page $page) => success($todos->findAll($page))->as(__APPLICATION_JSON)->page($page);
