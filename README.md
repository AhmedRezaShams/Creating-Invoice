# Invoice Creation Application

This is a comprehensive invoice creation web application built with Next.js. It guides users through a seamless, multi-step process to generate, review, and send professional invoices. The application leverages Redux for robust state management and Material-UI for a clean, modern user interface.

![alt text](https://github.com/AhmedRezaShams/Creating-Invoice/blob/dev_reza/public/c1.png?raw=true)


## Features

*   **Multi-Step Workflow:** An intuitive four-step process (Setup, Details, Review, Send) simplifies invoice creation.
*   **Flexible Invoice Types:** Create invoices from tracked time and expenses or build them from scratch with free-form line items.
*   **Client & Project Management:** Select clients and link billable hours and expenses from specific projects.
*   **Dynamic Line Items:** Easily add, edit, and remove line items for services and products.
*   **Automated Calculations:** Automatically computes subtotals, taxes, discounts, and the final amount due.
*   **Invoice Customization:** Add detailed notes, payment instructions, terms & conditions, and a thank-you message using rich text editors.
*   **Interactive Preview:** Review a live preview of the invoice before sending.
*   **File Attachments:** Attach relevant files or expense reports to the invoice.
*   **Integrated Emailing:** Compose and send the invoice email directly from the application.

## Core Components

The application's architecture is centered around a clear, step-based process managed by Redux.

*   **`views/invoice/create/`**: Contains the main components for each step of the invoice creation flow:
    *   **`Setup.jsx`**: Configure the invoice type, select a client, and choose projects to include.
    *   **`Details.jsx`**: Define invoice metadata, manage line items, and set tax/discounts.
    *   **`Review.jsx`**: Provides a full preview of the final invoice and handles file attachments.
    *   **`Send.jsx`**: Manages the email composition and sending process.
*   **`redux-store/slices/CreateInvoiceSlice.js`**: A centralized Redux Toolkit slice that manages the entire state of the invoice creation process, from UI steps to detailed invoice data.
*   **`components/`**: A collection of reusable UI elements like `CommonTable`, `CommonSection`, `CommonRichText`, and `GlobalModal` to ensure a consistent look and feel across the application.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** JavaScript (with React)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **UI Library:** [Material-UI (MUI)](https://mui.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & MUI `sx` prop
*   **Icons:** [Tabler Icons](https://tabler-icons.io/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/AhmedRezaShams/Creating-Invoice.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd Creating-Invoice
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Starts the development server with hot-reloading.
*   `npm run build`: Creates a production-ready build of the application.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Runs ESLint to analyze the code for potential errors and style issues.
