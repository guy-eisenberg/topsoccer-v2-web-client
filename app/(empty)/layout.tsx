export default function EmptyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-2 md:h-full md:overflow-y-auto">
      {children}
    </div>
  );
}
