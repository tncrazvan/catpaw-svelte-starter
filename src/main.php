<?php

use function Amp\File\exists;
use function Amp\File\isDirectory;
use CatPaw\Web\Attributes\IgnoreOpenAPI;
use function CatPaw\Web\fileServer;

use CatPaw\Web\Server;
use CatPaw\Web\Services\OpenApiService;

function main():void {
    $server = Server::create(
        apiPrefix: '/api',
        api: "./server/api",
        www: "./server/www",
    );
    $server->router->get('/openapi', #[IgnoreOpenAPI] fn (OpenApiService $oa) => $oa->getData());
    $server->setFileServer(
        fileServer(
            server: $server,
            fallback: "index.html",
            overwrite: function(string $fileName) use ($server) {
                // Required for SPA mode
                if (isDirectory($fileName) || !exists($fileName)) {
                    return "$server->www/index.html";
                }
                return $fileName;
            }
        )
    );
    $server->start();
}