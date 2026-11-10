import CartDemo from "@/components/cart-demo";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-start gap-8 px-16 py-24">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Automated Testing CI Lab
          </h1>
          <p className="mt-2 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            A tiny Next.js shop. Every push runs lint, unit tests, a production
            build, and end-to-end tests on GitHub Actions.
          </p>
        </div>
        <CartDemo />
      </main>
    </div>
  );
}
