import Link from "next/link";

export default function Home() {
  return (
    <div className="w-dvw h-dvh flex items-center justify-center bg-background">
      <main className="text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8">Student Portal</h1>
        <Link
          href="/auth/login"
          className="inline-block px-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          Login
        </Link>
      </main>
    </div>
  );
}
