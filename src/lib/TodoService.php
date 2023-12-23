<?php

use CatPaw\Attributes\Entry;
use CatPaw\Attributes\Service;
use function CatPaw\uuid;

use CatPaw\Web\Page;



#[Service]
class TodoService {
    /** @var array<Todo> */
    private array $items = [];
    #[Entry] function start():void {
        Todo::create(fn (Todo $item) => [
            $item->checked     = false,
            $item->description = '1st item',
            $item->id          = $id = uuid(),
            $this->items[$id]  = $item,
        ]);

        Todo::create(fn (Todo $item) => [
            $item->checked     = false,
            $item->description = '2nd item',
            $item->id          = $id = uuid(),
            $this->items[$id]  = $item,
        ]);

        Todo::create(fn (Todo $item) => [
            $item->checked     = false,
            $item->description = '3rd item',
            $item->id          = $id = uuid(),
            $this->items[$id]  = $item,
        ]);

        Todo::create(fn (Todo $item) => [
            $item->checked     = false,
            $item->description = '4th item',
            $item->id          = $id = uuid(),
            $this->items[$id]  = $item,
        ]);
    }

    public function findAll(Page $page):array {
        $pieces = array_slice($this->items, $page->start, $page->size);
        $result = [];
        foreach ($pieces as $piece) {
            $result[] = $piece;
        }
        return $result;
    }

    public function findOne(string $id):false|Todo {
        return $this->items[$id] ?? false;
    }

    public function toggle(string $id):false|Todo {
        if (!isset($this->items[$id])) {
            return false;
        }
        $item          = $this->items[$id];
        $item->checked = !$item->checked;
        return $item;
    }

    public function add(string $description):Todo {
        $id   = uuid();
        $item = Todo::create(fn (Todo $item) => [
            $item->checked     = false,
            $item->description = $description,
            $item->id          = $id,
        ]);
        $this->items[$id] = $item;

        return $item;
    }

    public function remove(string $id):bool {
        unset($this->items[$id]);
        return true;
    }
}