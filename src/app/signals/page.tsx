import Link from 'next/link'

export default function SignalHome() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Forex Signals</h1>
        <p className="text-gray-600 text-center">
          Select your access mode to continue
        </p>

        <div className="space-y-4">
          <Link
            href="/signals/user"
            className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Signals (User)
          </Link>

          <Link
            href="/signals/admin"
            className="block w-full px-4 py-2 text-center bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Post Signals (Admin)
          </Link>
        </div>
      </div>
    </div>
  )
}