export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
