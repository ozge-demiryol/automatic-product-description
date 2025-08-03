'use client';

import { Menu } from '@headlessui/react';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function SettingsMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left z-10">
        <Menu.Button className="inline-flex justify-center w-full rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-100 transition">
          <Settings className="w-6 h-6 text-gray-500 hover:text-gray-900 transition" aria-hidden="true" />
        </Menu.Button>

      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link
                href="products/add-product"
                className={`${
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                } block px-4 py-2 text-sm`}
              >
                Ürün Ekle
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }: { active: boolean }) => (
              <Link
                href="/faq"
                className={`${
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                } block px-4 py-2 text-sm`}
              >
                SSS
              </Link>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}