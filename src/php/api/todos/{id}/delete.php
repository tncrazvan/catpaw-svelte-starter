<?php
use App\TodoService;
use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;
use function CatPaw\Web\success;

return
#[Summary('Remove an todo from the list.')]
#[ProducesItem('bool', APPLICATION_JSON, true)]
fn (TodoService $todos, string $id) => success($todos->remove($id))->as(APPLICATION_JSON)->item();
