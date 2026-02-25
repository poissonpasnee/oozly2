export const metadata = {
  title: "Oozly2",
  description: "Oozly2"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
