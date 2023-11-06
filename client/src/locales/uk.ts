export default {
  hello: "Привіт",
  welcome: "Привіт {name}!",
  about: {
    you: "Привіт {name}! Тобі {age} років",
  },
  scope: {
    test: "Скоп",
    more: {
      test: "Скоп",
      param: "Скоп з параметром {param}",
      and: {
        more: {
          test: "Скоп",
        },
      },
      "stars#one": "1 зірка на GitHub",
      "stars#other": "{count} зірок на GitHub",
    },
  },
  missing: {
    translation: {
      in: {
        fr: "Це має працювати",
      },
    },
  },
  "cows#one": "Корова",
  "cows#other": "{count} корів",
} as const;
