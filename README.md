# gphotos-scraper

A google photos album scraper

## Description

gphotos-scraper allow you to get basic photos information from a shared album such:

- public url
- filename
- description
- file size
- image size
- creation date

1. [Instalation steps](#instalation)
2. [Technology stack](#technology)

<a name="instalation"></a>

### Instalation steps

1. Clone this repository to destination folder:

`git clone https://github.com/jmsalazardev/gphotos-scraper.git`

`cd gphotos-scraper`

2. Install dependencies:

`npm install`

3. Configure prisma using the .env file:

`cp .env.example .env`

4. Generate the database schema using prisma:

`npm run db:push`

5. Generate the database client:

`npm run db:generate`

6. Build:

`npm run build`

<a name="usage"></a>

### Usage

`./bin/index.js sync https://photos.app.goo.gl/gZ1jq1L16cTenTwT7`

<a name="technology"></a>

### Technology stack

- [Prisma ORM](https://www.prisma.io)
- [Typescript](https://www.typescriptlang.org/)
- [Husky](https://github.com/typicode/husky)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
