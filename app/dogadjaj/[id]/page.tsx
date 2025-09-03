interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-stone-800 mb-6">Događaj #{params.id}</h1>
      <p className="text-lg text-stone-600">
        Ova stranica će biti implementirana uskoro.
      </p>
    </main>
  );
}
