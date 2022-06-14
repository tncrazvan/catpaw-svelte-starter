# Debugging with VSCode (XDebug)

In order to debug with vscode you will need to configure both vscode and xdebug (3.x).

### VSCode configuration

Make new a `./.vscode/launch.json` file in your project and add the following configuration if you don't have it already:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen (paw)",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "runtimeArgs": ["-dxdebug.start_with_request=yes", "-dxdebug.mode=debug"]
    },
    {
      "name": "Launch (paw)",
      "type": "php",
      "request": "launch",
      "program": "${workspaceFolder}/vendor/catpaw/core/scripts/start.php",
      "cwd": "${workspaceFolder}",
      "args": ["${file}"],
      "port": 0,
      "runtimeArgs": ["-dxdebug.start_with_request=yes", "-dxdebug.mode=debug"],
      "env": {
        "XDEBUG_MODE": "debug,develop",
        "XDEBUG_CONFIG": "client_port=${port}"
      }
    }
  ]
}
```

The first configuration will passively listen for xdebug, while the second one will launch the currently opened script.

### XDebug 3.x configuration

In you `php.ini` file add:
```ini
[xdebug]
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
```

# Debugging with PHPStorm (XDebug)

If you're using PHPStorm you will need to start listening for PHP Xdebug connections.

First off pick your php interpreter:

![image](https://user-images.githubusercontent.com/6891346/168439592-3c8609aa-2d30-4995-ace3-8fa19fcef4b0.png)

Then start listening for xdebug connections: ![image](https://user-images.githubusercontent.com/6891346/168439662-558102d8-a94d-4480-a4e5-324f85a47cab.png)

### Xdebug 3.x configuration for PHPStorm

```ini
xdebug.mode=debug
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
xdebug.start_with_request=yes
```

# Start (dev)

During development you need to run both the Vite and the CatPaw servers.<br/>
The Vite server will act as a proxy for your `/api/*` and `*:state` requests, redirecting them to the CatPaw server.<br/>

First off start your CatPaw server using
```bash
composer start
```
or
```bash
./start
```

then start your vite server

```bash
npm run dev
```

all your communication with CatPaw will happen through the Vite proxy, so you'll be working on [http://127.0.0.1:3000](http://127.0.0.1:3000/).

# Start  (prod)

Once you've built your project with 
```
npm run build
```
you can start your server in production by running
```bash
./start
```

### Note

Don't use the Vite server in production, build your project and run the CatPaw server.
