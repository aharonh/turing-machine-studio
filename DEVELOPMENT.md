# Turing Machine Studio - Information for developing software


## Prerequisites

You need to have node and npm installed. It is also recommended to use vscode and have chrome installed. 

## Build

The sources are in src folder. They are all combined into a single file in ./dist folder with name of form main.<hash>.js file and an index.html file is generated pointing to it in the same folder. To build and start a local web server that serves the html as the default page at port 8080:

```shell
npm run build
npm start
```

To build for production release:

```shell
NODE_ENV=production npx webpack --config webpack.prod.js
```

## Test

To test, first build, then start, and then run the tests

```shell
npm run build
npm test
```

## Used development tools
the project uses

- webpack - to bundle multiple javascript files into single file for deployment into web page
- html-webpack-plugin so that we generate the html in the dist folder that will have the reference to the javascript file with the correct name containing the hash.
- clean-webpack-plugin to clean up the dist folder on each build
- typescript for type checking
- jest for testing. 
- jest-puppeteer for testing inside chrome browser

## Debug a failed test

To debug a failed test, perform the following steps:

- put a breakpoint in the code where the failed test will be calling in.

- update the failed test to allow for very long timeout. For example, note the 1000s timeout configured for the test below:

```javascript
    it('tape current value should be one', async () => {
      const v:BinaryValues = await page.evaluate(() => {
        globalThis.tape.write(1);
        return globalThis.tape.read();
      } );
      expect(v).toBe(BinaryValues.One);
    }, 1000000);
```

- append test before the failing test:

```javascript
    it('should put test in debug mode', async () => {
      await jestPuppeteer.debug();
    }, 60000);
```

Note the 60s timeout for the test. that is the time we will have to complete later steps described below.

- start the test

```shell
npm test
```

The test will block at the point of debug() call and wait for 60s for you to complete below two steps.

- determine the the PID of the headless browser ran by the test

```shell
sudo netstat -nap | grep $(ps aux | grep headless | head -n1 | awk '{print $2}') | grep LISTEN
```

- in .vscode/launch.json, update the port with the number received

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to Chrome",
            "port": 34465,
            "request": "attach",
            "type": "chrome",
            "webRoot": "${workspaceFolder}"
        }
   ]
}

```

and launch the debugger. at this point, you need to wait for the remaining time from the 60s started countdown above.
Then, the debugger will stop at the breakpoint set in the first step above.
