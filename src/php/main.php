<?php
use function CatPaw\Core\anyError;
use function CatPaw\Core\env;
use CatPaw\Core\Unsafe;
use CatPaw\Web\Attributes\IgnoreOpenAPI;
use CatPaw\Web\FileServer;
use CatPaw\Web\Server;
use CatPaw\Web\Services\OpenApiService;

/**
 * @return Unsafe<void>
 */
function main() {
    return anyError(function() {
        $server = Server::create(
            interface: env('interface'),
            www: env('www'),
            api: env('api'),
            apiPrefix: env('apiPrefix'),
        )->try($error)
        or yield $error;

        $server
            ->router
            ->get('/api/openapi', #[IgnoreOpenAPI] fn (OpenApiService $oa) => $oa->getData())
            ->try($error)
            or yield $error;

        $fileServer = FileServer::createForSpa($server)->try($error) or yield $error;

        $server->setFileServer($fileServer);

        $server->start()->await()->try($error) or yield $error;
    });
}
