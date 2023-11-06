export default {
  hello: "Hello",
  welcome: "Hello {name}!",
  about: {
    you: "Hello {name}! You have {age} yo",
  },
  scope: {
    test: "A scope",
    more: {
      test: "A scope",
      param: "A scope with {param}",
      and: {
        more: {
          test: "A scope",
        },
      },
      "stars#one": "1 star on GitHub",
      "stars#other": "{count} stars on GitHub",
    },
  },
  missing: {
    translation: {
      in: {
        fr: "This should work",
      },
    },
  },
  "cows#one": "A cow",
  "cows#other": "{count} cows",
} as const;
