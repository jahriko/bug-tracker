import { Cog6ToothIcon } from "@heroicons/react/24/outline"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <Cog6ToothIcon className="h-16 w-16 animate-[spin_3s_linear_infinite] text-gray-800 dark:text-gray-200" />
          <Cog6ToothIcon className="-ml-4 h-12 w-12 animate-[spin_3s_linear_infinite] animate-[spin_reverse_3s_linear_infinite] text-gray-800 dark:text-gray-200" />
        </div>
      </div>
      <h2 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-200">Under Maintenance</h2>
    </div>
  )
}
