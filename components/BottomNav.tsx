import Link from 'next/link';
import { Home, FilePlus, FileText, Package } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Bills', href: '/bills', icon: FileText },
  { name: 'New', href: '/new-bill', icon: FilePlus, primary: true },
  { name: 'Products', href: '/products', icon: Package },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              item.primary ? 'relative' : 'text-slate-500'
            }`}
          >
            {item.primary ? (
              <div className="bg-primary text-white p-3 rounded-full shadow-lg -mt-6">
                <item.icon className="w-5 h-5" />
              </div>
            ) : (
              <>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{item.name}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
