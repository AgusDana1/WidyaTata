import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WidyaTata AI - Administrasi Kegiatan & Anggaran Cerdas untuk Bali",
  description:
    "Sistem informasi tata kelola administrasi akademik, kepanitiaan, dan asisten anggaran cerdas untuk BEM, OSIS, Pramuka, dan Komunitas Pemuda Bali.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
