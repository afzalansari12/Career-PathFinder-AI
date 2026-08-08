import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <UserButton />
    </header>
  );
}