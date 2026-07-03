# IKEA CJM - Skapa Workspace

Vite + React + TypeScript starter prepared for IKEA Skapa design system integration.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Connect to Skapa

This workspace includes a starter integration layer under `src/skapa`.

1. Configure npm access to your private registry.
2. Install your Skapa package.
3. Replace placeholders in:
   - `src/skapa/skapaConfig.ts`
   - `src/skapa/SkapaProvider.tsx`
   - `src/skapa/skapaProbe.ts`

## MCP Setup (Skapa Source of Truth)

Use the Skapa MCP server for component, token, and pattern questions.

1. Quick install:

```bash
npx add-mcp @ingka/skapa-design-system-mcp@latest
```

2. Project MCP config is stored in `.vscode/mcp.json` and includes:
   - `playwright`
   - `skapa-design-system`

3. Trust and start servers when prompted in VS Code.

4. If MCP is unavailable, use `references/skapa-tokens.md` for token-faithful values and mark other UI details as best-effort approximations.

## Private Registry Template

Create a local `.npmrc` from `.npmrc.example` and replace placeholder values.

```bash
cp .npmrc.example .npmrc
```

## Scripts

- `npm run dev` - run Vite dev server
- `npm run typecheck` - run TypeScript project checks
- `npm run build` - typecheck and production build
- `npm run lint` - run Oxlint
- `npm run preview` - preview production build
