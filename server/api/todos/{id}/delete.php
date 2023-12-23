<?php

use CatPaw\Web\Attributes\Summary;

return 
#[Summary("Remove an todo from the list.")]
fn (TodoService $todos, string $id) => $todos->remove($id);