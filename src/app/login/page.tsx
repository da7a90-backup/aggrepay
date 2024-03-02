import Form from "@/components/Form";

export default function Home() {
  return (
    <main className="flex bg-neutral-100 min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <Form />
      </div>
    </main>
  );
}
