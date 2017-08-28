# Refactoring Pipelines

This repo is for people who are mostly familiar with JavaScript to work through the Martin Fowler article [Refactoring with Loops and Collection Pipelines](https://martinfowler.com/articles/refactoring-pipelines.html). The `problems.js` file contains the initial code before each refactor. The `solutions.js` contains my solutions to the problems for comparison. The `tests.js` file contains tests that ensure that refactors do not break the public interface of the functions.

## How to play
1. `npm install`
1. `npm test` (or `npm run test:watch` if you want tests to automatically run after every save)
1. Following the article, making changes to `problems.js`
1. If you get stuck, refer to `solutions.js`
    1. For "Identifiers" section, underscore.js will be your friend

## Acknowledgements
* Martin Fowler for original article
* MDN for [how to simulate set intersections and differences](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Iterating_Sets)
