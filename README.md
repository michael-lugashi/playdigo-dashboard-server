# Playdigo Dashboard Server

A TypeScript-based backend server for the Playdigo Dashboard application. This server provides API endpoints and business logic for managing Playdigo's dashboard functionality.

## Features

- RESTful API endpoints
- Google Cloud integration
- JWT-based authentication
- Type-safe development with TypeScript
- Environment-based configuration
- Logging with Winston
- Input validation with Zod

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **Logging**: Winston
- **Google Cloud**: googleapis
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js (v22 or higher recommended)
- npm or yarn
- Google Cloud credentials (if using Google services)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/michael-lugashi/playdigo-dashboard-server.git
cd playdigo-dashboard-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
JWT_AUTH_TOKEN_SECRET
NODE_ENV
PORT
```

## Development

Run the development server:

```bash
npm run dev
```

or use vscode launch.json for debugging

The server will start with hot-reloading enabled.

## Available Scripts

- `npm run dev` - Start development server with hot-reloading
- `npm run start` - Start production server
- `npm run build` - Build the project
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── app.ts              # Main application entry point
├── core/              # Core application components
├── features/          # Feature-specific modules
├── interfaces/        # TypeScript interfaces
└── utils/            # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
