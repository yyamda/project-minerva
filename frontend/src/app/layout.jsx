// src/app/layout.jsx
import './globals.css'
import { UserProvider } from './context/UserContext'

export const metadata = {
    title: "Project Athena",
    description: "Your project description",
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <UserProvider>
            {children}
          </UserProvider>
        </body>
      </html>
    );
  }