import "expect-puppeteer";
import { Browser, Page, BrowserContext } from 'puppeteer';
const timeout = 5000;
import { Tape } from '../src/tape';
import { BinaryValues } from '../src/common';

import "jest-environment-puppeteer";

declare module globalThis {
  let tape: Tape;
}

describe(
  '/ (Home Page)',
  () => {
    //let page : Page;
    beforeAll(async () => {
      await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });

    }, timeout);

    it('ORIGINAL_WINDOW_WIDTH should have correct value', async () => {
      const ORIGINAL_WINDOW_WIDTH = await page.evaluate(() => (window as any).ORIGINAL_WINDOW_WIDTH );
      expect(ORIGINAL_WINDOW_WIDTH).toBe(210);
    });

    it('tape should be defined', async () => {
      const tape = await page.evaluate(() => globalThis.tape );
      expect(tape).toBeDefined();
    });

    it('tape current location should be 0', async () => {
      const l = await page.evaluate(() => globalThis.tape.currentLocationIndex);
      expect(l).toBe(0);
    });

    it('tape current location should be -1', async () => {
      const l = await page.evaluate(() => 
      {
        globalThis.tape.currentLocationIndex = -1;
        return globalThis.tape.currentLocationIndex;
      } );
      expect(l).toBe(-1);
    });

    // it('should put test in debug mode', async () => {
    //   await jestPuppeteer.debug();
    // }, 60000);

    it('tape current value should be one', async () => {
      const v:BinaryValues = await page.evaluate(() => {
        globalThis.tape.write(1);
        return globalThis.tape.read();
      } );
      expect(v).toBe(BinaryValues.One);
    }, 1000000);

    it('tape current location should be -2', async () => {
      const l:BinaryValues = await page.evaluate(() => {
        globalThis.tape.moveRight();
        return globalThis.tape.currentLocationIndex;
      } );
      expect(l).toBe(-2);
    });
  }
);

