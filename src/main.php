<?php

use function CatPaw\Core\env;

use CatPaw\Core\Unsafe;
use CatPaw\Web\Attributes\IgnoreOpenAPI;
use CatPaw\Web\FileServer;


use CatPaw\Web\Server;
use CatPaw\Web\Services\OpenApiService;

/**
 * @return Unsafe<void>
 */
function main():Unsafe {
    $server = Server::create(
        interface: env('interface'),
        www: env('www'),
        api: env('api'),
        apiPrefix: env('apiPrefix'),
    );

    if ($server->error) {
        return $server;
    }

    $server->value->router->get('/openapi', #[IgnoreOpenAPI] fn (OpenApiService $oa) => $oa->getData());
    $fileServer = FileServer::createForSpa($server->value);

    if ($fileServer->error) {
        return $fileServer;
    }

    $server->value->setFileServer($fileServer->value);
    $server->value->start()->await();
}