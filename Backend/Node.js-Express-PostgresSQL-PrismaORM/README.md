# node.js-express-postgressql-prismaorm

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
/////////////////////////////////////////

//////////////////////////////

// first
bun init
bun add typescript tsx @types/node --dev
bun x tsc --init

// second
bun add prisma @types/pg --dev
bun add @prisma/client @prisma/adapter-pg pg dotenv

//third
bunx --bun prisma

//fourth
bunx --bun prisma init --datasource-provider postgresql --output ../generated/prisma

//fifth
// add DATABASE_URL in .env file

//sixth
// add prisma schema in prisma/schema.prisma file

//seventh
bunx --bun prisma migrate dev --name init
bunx --bun prisma generate

//eighth
lib/prisma.ts

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

then all express & other code

bun add express @types/express
