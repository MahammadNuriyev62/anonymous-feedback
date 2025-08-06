import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonymous Feedback",
  description: "Collect anonymous feedback from anyone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta
          property="og:image"
          content={
            "https://i.pinimg.com/564x/33/de/97/33de974459778d84e4831821cd34914c.jpg"
          }
        />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
