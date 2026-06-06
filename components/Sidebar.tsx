import Link from 'next/link';
import { Home, FilePlus, FileText, Package, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'New Bill', href: '/new-bill', icon: FilePlus },
  { name: 'Bills', href: '/bills', icon: FileText },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="p-5 border-b border-slate-100">
        <h1 className="text-lg font-semibold text-slate-800">Billing</h1>
      </div>
      <nav className="flex-1 px-3 space-y-1 mt-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm"
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-3 text-[10px] text-center text-slate-300 border-t border-slate-100">
        v1.0
      </div>
    </aside>
  );
}
