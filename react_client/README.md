# Glitchbomb

A blockchain game built with React and Cairo smart contracts.

## Project Structure

- `react_client/` - Frontend built with React, TanStack Router, and Dojo
- `contracts/` - Cairo smart contracts for the blockchain game logic

## Getting Started

Create a `.env` file:

```bash
VITE_DEFAULT_CHAIN=SN_SEPOLIA
```

Start Torii (from the root `glitchbomb/` directory):

```bash
torii --config torii_sepolia.toml
```

Then install dependencies and start the dev server:

```bash
bun install
bun dev
```
