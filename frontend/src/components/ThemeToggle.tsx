import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
}
