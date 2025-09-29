# PontoNanny: Smart Babysitter Time Tracking

PontoNanny is a visually stunning, minimalist web application designed for seamless time tracking for babysitters. It provides a simple, elegant interface for a babysitter named Dilma to clock in, clock out, and manage breaks, all with integrated geolocation capture. For the employer, Carla, it offers a comprehensive dashboard with detailed reports, work summaries, and graphical visualizations of hours worked. The application is built on Cloudflare's edge network, ensuring high performance and reliability. There is no authentication; the app operates with two fixed, pre-defined profiles, allowing for instant access to the respective dashboards via a beautiful profile selection screen.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nogueira/nannyDilma)

## ✨ Key Features

-   **Effortless Time Tracking**: Simple, intuitive buttons for clock-in, clock-out, and break management.
-   **Geolocation Capture**: Automatically records the user's location with each time log entry for verification.
-   **Pre-defined User Profiles**: Instant access for two distinct roles—'Dilma' (Babysitter) and 'Carla' (Employer)—with no login required.
-   **Babysitter Dashboard**: A focused interface for Dilma to manage her work day and view today's activity log.
-   **Employer Dashboard**: A comprehensive reporting view for Carla with detailed logs, summaries, and charts.
-   **Modern & Responsive Design**: A beautiful, mobile-first interface that works flawlessly on any device.
-   **High-Performance Backend**: Built on Cloudflare Workers and Durable Objects for speed and reliability.

## 🚀 Technology Stack

-   **Frontend**:
    -   [React](https://react.dev/)
    -   [Vite](https://vitejs.dev/)
    -   [React Router](https://reactrouter.com/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/)
    -   [Framer Motion](https://www.framer.com/motion/) for animations
    -   [Lucide React](https://lucide.dev/) for icons
-   **Backend**:
    -   [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
-   **State Management**:
    -   [Zustand](https://zustand-demo.pmnd.rs/)
-   **Data Persistence**:
    -   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
-   **Utilities**:
    -   [date-fns](https://date-fns.org/) for date manipulation
    -   [Recharts](https://recharts.org/) for data visualization
    -   [Sonner](https://sonner.emilkowal.ski/) for toast notifications

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pontonanny.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd pontonanny
    ```
3.  **Install dependencies:**
    ```bash
    bun install
    ```
4.  **Run the development server:**
    The application will be available at `http://localhost:3000`.
    ```bash
    bun dev
    ```

## 🛠️ Development

The project is structured to separate frontend, backend, and shared logic.

-   `src/`: Contains all the frontend React application code, including pages, components, hooks, and stores.
-   `worker/`: Contains the Hono backend code that runs on Cloudflare Workers, including API routes and entity definitions for Durable Objects.
-   `shared/`: Contains TypeScript types and interfaces shared between the frontend and backend to ensure type safety.

### Available Scripts

-   `bun dev`: Starts the Vite development server for the frontend and the Wrangler dev server for the worker.
-   `bun build`: Builds the frontend application for production.
-   `bun deploy`: Deploys the application to your Cloudflare account.
-   `bun lint`: Runs ESLint to check for code quality and style issues.

## ☁️ Deployment

This project is designed for seamless deployment to Cloudflare's global network.

1.  **Log in to Wrangler:**
    Ensure you are logged into your Cloudflare account via the command line.
    ```bash
    bunx wrangler login
    ```
2.  **Deploy the application:**
    Run the deploy script. This will build the application and deploy the static assets and the Worker function.
    ```bash
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nogueira/nannyDilma)