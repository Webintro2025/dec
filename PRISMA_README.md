Prisma setup and local steps

What I added:
- `prisma/schema.prisma` — initial schema with `Product` and `Category` models.
- `src/app/utils/prisma.js` — Prisma client singleton.
- Updated `src/app/api/products/route.js` to use Prisma instead of Mongoose.
- Updated `package.json` to include `@prisma/client` and `prisma` (you still need to run install).

Local steps you must run (on your machine):

1. Install node packages

```bash
npm install
```

2. Create a Postgres database and set `DATABASE_URL` in your project root `.env` file.
Example .env entry:

```
DATABASE_URL="postgresql://dbuser:dbpass@localhost:5432/decoresia?schema=public"
```

3. Initialize the database and generate Prisma client

```bash
# create migration and push schema
npx prisma migrate dev --name init

# generate client (usually automatic with migrate)
npx prisma generate
```

4. Start your dev server

```bash
npm run dev
```

Notes and next steps:
- This change does not migrate existing MongoDB data. If you need that, I can provide a migration script that reads from Mongo (keeping your `MONGODB_URI`) and writes to Postgres using Prisma.
- Convert the remaining models (`Category`, `User`, `Order`, `Cart`, `CustomerInfo`) to Prisma models in `prisma/schema.prisma` and run migrations.
- Remove Mongoose and the old `dbConnect.js` after you finish migration and verify everything works.
