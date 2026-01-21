export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">EMS</h1>
          <div className="flex items-center gap-4">
            {/* Add navigation items here */}
          </div>
        </div>
      </nav>
    </header>
  );
}
