<?php

use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\ProducesPage;

use CatPaw\Web\Attributes\Summary;
use function CatPaw\Web\ok;

use CatPaw\Web\Page;

return
#[Summary('Find a page of todos from the list.')]
#[ProducesPage(Todo::class, APPLICATION_JSON, new Todo)] fn (TodoService $todos, Page $page) => ok($todos->findAll($page))->page($page);