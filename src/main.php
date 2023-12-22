<?php

use function Amp\File\exists;
use function Amp\File\isDirectory;
use CatPaw\Web\Attributes\IgnoreOpenAPI;
use function CatPaw\Web\fileServer;

use CatPaw\Web\Server;
use CatPaw\Web\Services\OpenAPIService;

function main():void {
    $server = Server::create(interfaces: "127.0.0.1:8000");
    $server->router->get('/openapi', #[IgnoreOpenAPI] fn (OpenAPIService $oa) => $oa->getData());
    $server->router->get("@404", fileServer(
        server: $server,
        fallback: "index.html",
        overwrite: function(string $fileName) use ($server) {
            // Required for SPA mode
            if (isDirectory($fileName) || !exists($fileName)) {
                return "$server->www/index.html";
            }
            return $fileName;
        }
    ));
    $server->start();
}