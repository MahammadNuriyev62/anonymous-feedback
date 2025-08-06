import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonymous Feedback",
  description: "Collect anonymous feedback from anyone",
  openGraph: {
    title: "Anonymous Feedback",
    description: "Collect anonymous feedback from anyone",
    images: [
      {
        url: "https://i.pinimg.com/564x/33/de/97/33de974459778d84e4831821cd34914c.jpg",
        width: 500,
        height: 500,
        alt: "Anonymous Feedback Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anonymous Feedback",
    description: "Collect anonymous feedback from anyone",
    images: [
      "https://i.pinimg.com/564x/33/de/97/33de974459778d84e4831821cd34914c.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
