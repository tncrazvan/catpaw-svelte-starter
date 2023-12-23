<?php
use CatPaw\Web\Attributes\ProducesItem;
use CatPaw\Web\Attributes\Summary;

return
#[Summary("Find one todo from the list.")]
#[ProducesItem(Todo::class)]
fn (TodoService $todos, string $id) => $todos->findOne($id);