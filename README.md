# Cypress CI watcher

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
[![Using TypeScript](https://img.shields.io/badge/%3C/%3E-TypeScript-0072C4.svg)](https://www.typescriptlang.org/)
[![Tested with Jest](https://img.shields.io/badge/tested_with-Jest-99424f.svg)](https://github.com/facebook/jest)

## Support CI
1. we support travis ci for now.


## Get started
1. to run the cypress watcher locally, you should have a slack webhook url and save it in env
   ```
   SLACK_WEBHOOK_URL_ME=[secure]

   ```

   or you can set it in your ci provider as `SLACK_WEBHOOK_URL_ME=[secure]`

2. yarn install


3. yarn cypress-ci-watcher
(you can run params as cypress run)

4. then your cypress will run, and if cypress test failed, you should see a message in slack channel you set webhook rul


you can use the cypress run params to add config to cypress: like --spec to decide which folder you want to test
see cypress run commands

## License

This project was inspired by [cypress.co](https://github.com/cypress-io/cypress).

Copyright (c) 2020-present, jzsplk
