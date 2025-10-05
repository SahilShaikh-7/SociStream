export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} sahil shaikh. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
