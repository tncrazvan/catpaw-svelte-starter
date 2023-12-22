<?php

use CatPaw\Web\Attributes\IgnoreOpenAPI;
use CatPaw\Web\Server;
use CatPaw\Web\Services\OpenAPIService;

function main():void {
    $server = Server::create(interfaces: "127.0.0.1:8000");
    $server->router->get('/openapi', #[IgnoreOpenAPI] fn (OpenAPIService $oa) => $oa->getData());
    $server->start();
}