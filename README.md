# FlashcardHero

FlashcardHero is a modern web application for creating and studying flashcards. Built with React, TypeScript, and Firebase, it offers a seamless learning experience with features like public and private collections, practice mode, and real-time updates.

## Features

- **User Authentication**
  - Email/Password and Google Sign-in
  - Secure user accounts with profile management
  - Protected routes for authenticated users

- **Flashcard Collections**
  - Create and manage personal flashcard collections
  - Public and private visibility options
  - Rich text support for card content
  - Real-time updates using Firebase

- **Study Tools**
  - Interactive practice mode with card flipping
  - Randomize cards for better learning
  - Progress tracking
  - Intuitive navigation between cards

- **Public Collections**
  - Browse and study public collections
  - Search functionality
  - Preview collections before practicing
  - No account required for public collections

## Technology Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - React Router DOM

- **Backend & Services**
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Security Rules
  - Firebase Analytics

- **Development Tools**
  - Vite
  - ESLint
  - PostCSS
  - TypeScript ESLint

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flashcard-hero.git
   cd flashcard-hero
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project and add your configuration:
   - Create a new project in Firebase Console
   - Enable Authentication (Email/Password and Google providers)
   - Enable Cloud Firestore
   - Copy your Firebase configuration to `src/lib/firebase.ts`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/          # Authentication related components
│   ├── collections/   # Collection management components
│   ├── layout/        # Layout components
│   ├── routes/        # Route protection components
│   └── ui/            # Basic UI components
├── contexts/          # React contexts
├── lib/              # External service configurations
├── pages/            # Page components
├── services/         # Business logic and API calls
└── utils/            # Utility functions
```

## Security

The application implements secure Firebase Security Rules to ensure:
- Only authenticated users can create collections
- Users can only modify their own collections
- Public collections are readable by everyone
- Private collections are only accessible to their owners

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
