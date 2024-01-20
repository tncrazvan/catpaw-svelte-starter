<?php
use App\Todo;
use App\TodoService;
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\ProducesPage;
use CatPaw\Web\Attributes\Summary;
use CatPaw\Web\Page;
use function CatPaw\Web\success;

return
#[Summary('Find a page of todos from the list.')]
#[ProducesPage(Todo::class, APPLICATION_JSON, new Todo)]
fn (TodoService $todos, Page $page) => success($todos->findAll($page))->page($page);
