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
        $item1 = new Todo( id: uuid(), description:'1st item', checked: false );
        $item2 = new Todo( id: uuid(), description:'2nd item', checked: false );
        $item3 = new Todo( id: uuid(), description:'3rd item', checked: false );
        $item4 = new Todo( id: uuid(), description:'4th item', checked: false );
        $item5 = new Todo( id: uuid(), description:'5th item', checked: false );

        $this->items[$item1->id] = $item1;
        $this->items[$item2->id] = $item2;
        $this->items[$item3->id] = $item3;
        $this->items[$item4->id] = $item4;
        $this->items[$item5->id] = $item5;
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
        $id               = uuid();
        $item             = new Todo( id: $id, description: $description, checked: false );
        $this->items[$id] = $item;
        return $item;
    }

    public function remove(string $id):bool {
        unset($this->items[$id]);
        return true;
    }
}