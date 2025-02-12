# Next.js and Supabase Starter Kit with FOB Escrow Integration

A full-stack application that combines modern web development with blockchain smart contracts. This starter kit uses Next.js with Supabase for authentication and backend functionality, while integrating Hardhat-based smart contracts to manage an escrow service (FOBEscrow). The project also includes a fully responsive UI built with Tailwind CSS and shadcn/ui components, and supports deployment on Vercel.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Architecture & Structure](#architecture--structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Running the Application](#running-the-application)
  - [Development Server](#development-server)
  - [Testing](#testing)
  - [Smart Contract Compilation & Deployment](#smart-contract-compilation--deployment)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Additional Scripts & Tools](#additional-scripts--tools)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Full-Stack Integration:** Seamlessly combines Next.js (both App and Pages Router) with Supabase for SSR and authentication.
- **Blockchain Escrow:** Smart contracts implemented in Solidity (FOBEscrow and FOBEscrowFactory) for managing escrow transactions.
- **Secure Authentication:** Wallet-based authentication using MetaMask and JWT tokens.
- **UI Components:** Styled with Tailwind CSS and shadcn/ui for a modern, responsive design.
- **Testing:** Comprehensive tests using Jest, Chai, and Hardhat for both API endpoints and smart contract functionality.
- **Deployment Ready:** Supports deployment to Vercel with environment variable management.
- **Local Development:** Easy-to-follow instructions to set up both the frontend/backend and the blockchain development environment.

## Demo

Watch the demo video below for a quick walk-through of the application:

[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

Replace `YOUR_VIDEO_ID` with the actual video ID of your demo video.

---

## Architecture & Structure

- **Frontend:**  
  - Built with Next.js using both Server and Client Components.
  - Uses Supabase for backend services and authentication.
  - UI components styled with Tailwind CSS and shadcn/ui.
  - Wallet integration via ethers.js for blockchain interactions.

- **Smart Contracts:**  
  - **FOBEscrow.sol:** Manages escrow transactions through state transitions (Created, ExportCleared, LoadedOnBoard, Completed, Refunded).
  - **FOBEscrowFactory.sol:** Factory contract to dynamically deploy new escrow instances.
  - Tested using Hardhat along with integration/unit tests.

- **Backend & API:**  
  - API routes for authentication and user session management.
  - Uses JWT for securing routes and managing sessions.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- [MetaMask](https://metamask.io/) browser extension for wallet connectivity
- [Supabase](https://supabase.com/) account and project for backend services
- (Optional) [Hardhat](https://hardhat.org/) CLI for smart contract development

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AmmariAbdelmounaim/fob-escrow
   cd fob-escrow
   ```

2. **Install dependencies:**

   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```
   Or using pnpm:
   ```bash
   pnpm install
   ```

### Configuration

1. **Supabase Setup:**

   - Rename the environment example file:
     ```bash
     cp .env.example .env.local
     ```
   - Update `.env.local` with your Supabase project URL and API key:
     ```
     NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
     JWT_SECRET=<YOUR_JWT_SECRET>
     ```
   
2. **Blockchain Environment (Hardhat):**

   - Ensure that Hardhat is installed as a dev dependency.
   - Review the `hardhat.config.ts` file to configure networks and solidity version.
   - (Optional) Set up additional environment variables if needed for deployments.

---

## Running the Application

### Development Server

Start the Next.js development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Testing

- **API Tests:** Run Next.js API route tests using:
  ```bash
  npm run test:api
  ```
- **Smart Contract Tests:** Run Hardhat tests for your Solidity contracts:
  ```bash
  npm run test:contracts
  ```

### Smart Contract Compilation & Deployment

1. **Compile Contracts:**

   ```bash
   npx hardhat compile
   ```

2. **Run Contract Tests:**

   ```bash
   npx hardhat test
   ```

3. **Deploy Contracts:**

   Use the provided deployment script:
   ```bash
   npx hardhat run scripts/deploy.ts --network <your-network>
   ```

   You can also use Hardhat Ignition modules if needed for advanced deployment strategies.

---

## Deployment

- **Vercel Deployment:**  
  The project is set up for easy deployment on Vercel. Upon connecting your GitHub repository, Vercel will automatically detect and set required environment variables if configured properly (refer to the Vercel docs).

- **Production Setup:**  
  For a production-ready deployment, ensure all environment variables (including Supabase credentials and any blockchain network details) are securely set.

---

## Project Structure

```
.
├── app/                    # Next.js app directory (pages, components, API routes)
│   ├── globals.css         # Global styles & Tailwind CSS configuration
│   ├── layout.tsx          # App layout and metadata
│   └── (protected)/        # Protected routes and dashboard pages
├── components/             # Reusable UI components (e.g., Card, Button)
├── contracts/              # Solidity smart contracts (FOBEscrow, FOBEscrowFactory)
├── scripts/                # Deployment and utility scripts (e.g., deploy.ts, trackBalances.ts)
├── tests/                  # Testing suites for API routes and smart contracts
│   ├── api/                # API tests using Jest and Testing Library
│   └── contracts/          # Hardhat tests for smart contracts
├── hardhat.config.ts       # Hardhat configuration file
├── package.json            # Project scripts and dependencies
├── postcss.config.js       # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## Usage

- **Authentication & Wallet Connection:**  
  Users can connect their MetaMask wallet and sign messages to authenticate. The authentication flow leverages Supabase and JWT for secure session management.

- **Smart Contract Interactions:**  
  The frontend (via hooks in `hooks/useEscrow.ts`) allows users to interact with the smart contracts:
  - **Confirm Export Clearance:** Seller confirmation with a unique export declaration hash.
  - **Confirm Loaded On Board:** Carrier confirmation indicating cargo is loaded.
  - **Release Payment / Refund Buyer:** Buyer or seller can trigger payment release upon transaction completion or refund if necessary.
  
- **Tracking Balances:**  
  A utility script (`scripts/trackBalances.ts`) is provided to display live balances of the buyer, seller, and escrow contract on-chain.

---

## Additional Scripts & Tools

- **Deployment Scripts:**  
  - `scripts/deploy.ts`: Deploys the FOBEscrowFactory contract.
  - `scripts/trackBalances.ts`: Monitors and logs live Ethereum balances.

- **Testing Frameworks:**  
  - Hardhat for smart contract compilation and testing.
  - Jest and Testing Library for API route tests.
  - Chai for assertions in smart contract tests.

- **UI & Styling:**  
  - Tailwind CSS for utility-first styling.
  - shadcn/ui components for modern, responsive interface elements.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Submit a pull request for review.

For major changes, please open an issue first to discuss what you would like to change.

