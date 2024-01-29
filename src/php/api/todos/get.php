<?php
use App\Todo;
use App\TodoService;
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\OperationId;
use CatPaw\Web\Attributes\ProducesPage;
use CatPaw\Web\Attributes\Summary;
use const CatPaw\Web\OK;
use CatPaw\Web\Page;
use function CatPaw\Web\success;

return
#[OperationId("findTodoPage")]
#[Summary('Find a page of todos from the list.')]
#[ProducesPage(OK, APPLICATION_JSON, 'on success', Todo::class, new Todo)]
fn (TodoService $todos, Page $page) => success($todos->findAll($page))->as(APPLICATION_JSON)->page($page);
