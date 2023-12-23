<?php

use CatPaw\Web\Attributes\ProducesPage;
use CatPaw\Web\Attributes\Summary;

use function CatPaw\Web\ok;
use CatPaw\Web\Page;


return
#[Summary("Find a page of todos from the list.")]
#[ProducesPage(Todo::class)] fn (TodoService $todos, Page $page) => ok($todos->findAll($page))->page($page);