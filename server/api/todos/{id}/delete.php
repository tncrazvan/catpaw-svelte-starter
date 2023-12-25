<?php

use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;

return 
#[Summary('Remove an todo from the list.')]
#[ProducesItem('bool', APPLICATION_JSON, true)]
fn (TodoService $todos, string $id) => $todos->remove($id);