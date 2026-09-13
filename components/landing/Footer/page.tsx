import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-10 bg-zinc-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-all duration-500">
                <img src="/logo.jpeg" alt="Assist IQ" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Assist IQ
              </span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
              Empowering support teams with lightning-fast automation and intelligent knowledge integration.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-medium text-sm">Product</h4>
            <nav className="flex flex-col gap-3 text-sm text-zinc-400">
              <Link href="#features" className="hover:text-indigo-400 hover:translate-x-1 transition-all">Features</Link>
              <Link href="#pricing" className="hover:text-indigo-400 hover:translate-x-1 transition-all">Pricing</Link>
              <Link href="/changelog" className="hover:text-indigo-400 hover:translate-x-1 transition-all">Changelog</Link>
            </nav>
          </div>

          {/* Company/Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-medium text-sm">Legal</h4>
            <nav className="flex flex-col gap-3 text-sm text-zinc-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="https://twitter.com" className="hover:text-white transition-colors">Twitter / X</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-white/5 flex flex-col md:row justify-between items-center gap-2 text-xs text-zinc-500">
          <p>© {currentYear} Assist IQ. Built for modern businesses.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;