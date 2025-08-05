import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-[var(--background)] py-4 px-6 shadow-sm justify">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Proje Logosu"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <nav>
          <Link href="/" className="text-gray-200 hover:text-cyan-400 font-medium text-base transition mx-3">
            Ana Sayfa
          </Link>
          <Link href="/products" className="text-gray-200 hover:text-cyan-400 font-medium text-base transition mx-3">
            Ürünler
          </Link>
          <Link href="/faq" className="text-gray-200 hover:text-cyan-400 font-medium text-base transition mx-3">
            SSS
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;