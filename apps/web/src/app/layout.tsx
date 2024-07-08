import "./globals.css";
import type { Metadata } from "next";
import { Providers, ThemeProvider } from "../lib/providers";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "one for all",
  description: "one stop solution for ai notes, online program learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="#2E78C7" height={2} />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
