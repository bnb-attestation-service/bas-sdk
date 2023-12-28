This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install dependencies:

```bash
pnpm install
```

run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To begin editing the page, simply modify the app/page.tsx file. The page will automatically update as you make changes to the file.

For experimenting with the BAS SDK, you can view and edit the code in usehooks/useBAS.ts.

### Playground

In the playground, there are 3 buttons available for you to interact with the BAS SDK: `registerSchema`, `attestOnchain`, and `attestOffchainWithGreenField`. You have the flexibility to modify the parameters and create your own schemas and attestations using the code in `app/page.tsx`.

Upon successful execution of any of the 3 methods, a link will be generated at the bottom of the page. This link will direct you to BAScan for detailed information about the schema or attestation.