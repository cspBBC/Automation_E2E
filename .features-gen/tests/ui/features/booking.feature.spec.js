// Generated from: tests\ui\features\booking.feature
import { test } from "playwright-bdd";

test.describe('Booking navigation', () => {

  test('Navigate to Facility Catalogue', { tag: ['@ui'] }, async ({ Given, page }) => { 
    await Given('user opens the Allocate application', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\ui\\features\\booking.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":["@ui"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given user opens the Allocate application","stepMatchArguments":[]}]},
]; // bdd-data-end