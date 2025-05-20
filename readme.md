# SolanaWiz 🧙‍♂️✨

SolanaWiz is a Next.js application designed to provide users with advanced tools and insights for the Solana cryptocurrency ecosystem. It leverages AI-powered analysis and comprehensive data visualization to help users make informed decisions.

## 🚀 Features

The application includes the following key sections:

*   **Hero Section**: Engaging landing view.
*   **Sentiment Analysis**: Real-time AI-driven market sentiment (bullish/bearish signals).
*   **Features Grid / Hex Chart**: Overview of core platform capabilities.
*   **DeFi Trends**: Insights into the latest Decentralized Finance trends.
*   **Token Analytics**: Visualizations of token price histories and other relevant metrics.
*   **Strategy Simulator**: Test AI-generated trading strategies.

## 🛠️ Tech Stack

*   **Frontend**: Next.js, React, TypeScript
*   **Styling**: Tailwind CSS, shadcn/ui (likely, based on component structure)
*   **AI Integration**: Genkit (for flows like sentiment analysis and strategy generation)
*   **Solana Integration**: `@solana/web3.js`, `@solana/wallet-adapter`
*   **Charting**: Recharts
*   **Form Handling**: React Hook Form, Zod
*   **UI Components**: Radix UI primitives

## ⚙️ Getting Started

### Prerequisites

*   Node.js (version specified in `engines` in `package.json` if available, otherwise latest LTS)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd solanawiz 
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running the Development Server

To start the Next.js development server:

```bash
npm run dev
```
This will typically start the application on `http://localhost:9002`.

To start the Genkit development server (for AI flows):
```bash
npm run genkit:dev
```
Or with watch mode:
```bash
npm run genkit:watch
```

### Building for Production

To build the application for production:

```bash
npm run build
```

### Starting the Production Server

To start the production server after building:

```bash
npm run start
```

### Linting and Type Checking

*   To lint the code:
    ```bash
    npm run lint
    ```
*   To perform a TypeScript type check:
    ```bash
    npm run typecheck
    ```

## 📄 Main Application Page

The primary entry point and structure of the application can be found in `src/app/page.tsx`.

## 🤝 Contributing

Details on contributing to the project will be added here.

## 📜 License

Specify your project's license here (e.g., MIT).
