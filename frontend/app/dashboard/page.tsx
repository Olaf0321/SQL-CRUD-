import ItemList from '../componenets/ItemList'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <ItemList />
      </div>
    </main>
  );
}
