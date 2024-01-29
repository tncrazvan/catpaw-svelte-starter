<?php
use function CatPaw\Core\anyError;
use function CatPaw\Core\env;
use CatPaw\Core\Unsafe;

use const CatPaw\Web\APPLICATION_JSON;
use CatPaw\Web\Attributes\IgnoreOpenApi;
use CatPaw\Web\FileServer;
use CatPaw\Web\Server;
use CatPaw\Web\Services\OpenApiService;

use function CatPaw\Web\success;

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
            ->get('/api/openapi', #[IgnoreOpenApi] fn (OpenApiService $oa) => success($oa->getData())->as(APPLICATION_JSON))
            ->try($error)
            or yield $error;

        $fileServer = FileServer::createForSpa($server)->try($error) or yield $error;

        $server->setFileServer($fileServer);

        $server->start()->await()->try($error) or yield $error;
    });
}
