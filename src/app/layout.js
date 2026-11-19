import "./globals.css";

export const metadata = {
  title: "HelpNest | Ask. Help. Grow.",
  description:
    "HelpNest is a community platform where people can ask for help, share knowledge, and solve problems together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}