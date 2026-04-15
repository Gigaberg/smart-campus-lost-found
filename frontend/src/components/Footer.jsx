import { Link } from 'react-router-dom';

/**
 * Footer — demonstrates:
 * - <footer> semantic element
 * - <nav> inside footer
 * - <ul> / <li> for link lists
 * - <address> semantic element
 * - <table> for category reference
 * - <section> grouping
 */
const Footer = () => {
  return (
    <footer className="bg-[#1a3a2a] text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Section 1: About */}
        <section aria-labelledby="footer-about">
          <h3 id="footer-about" className="font-bold text-amber-400 mb-3 text-sm uppercase tracking-wider">
            Campus Lost &amp; Found
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            A platform for students and staff to report lost items and reunite them with their owners.
          </p>

        </section>

        {/* Section 2: Quick links — uses <nav> + <ul>/<li> */}
        <section aria-labelledby="footer-links">
          <h3 id="footer-links" className="font-bold text-amber-400 mb-3 text-sm uppercase tracking-wider">
            Quick Links
          </h3>
          <nav aria-label="Footer navigation">
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-amber-400 transition">🏠 Browse Items</Link></li>
              <li><Link to="/items/new" className="hover:text-amber-400 transition">📝 Post an Item</Link></li>
              <li><Link to="/inbox" className="hover:text-amber-400 transition">📬 Inbox</Link></li>
              <li><Link to="/register" className="hover:text-amber-400 transition">👤 Register</Link></li>
              <li><Link to="/login" className="hover:text-amber-400 transition">🔑 Login</Link></li>
            </ul>
          </nav>
        </section>

        {/* Section 3: Category table */}
        <section aria-labelledby="footer-categories">
          <h3 id="footer-categories" className="font-bold text-amber-400 mb-3 text-sm uppercase tracking-wider">
            Item Categories
          </h3>
          {/* <table> demonstrates the HTML table element from the syllabus */}
          <table className="text-xs text-white/70 w-full border-collapse">
            <thead>
              <tr className="text-amber-400/80 border-b border-white/10">
                <th className="text-left py-1 pr-4 font-semibold">Category</th>
                <th className="text-left py-1 font-semibold">Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5"><td className="py-1 pr-4">Electronics</td><td>Phone, Laptop, Earbuds</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-4">Clothing</td><td>Jacket, Cap, Scarf</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-4">Books</td><td>Textbook, Notebook</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-4">Keys</td><td>Room key, Car key</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-4">ID / Cards</td><td>Student ID, Bank card</td></tr>
              <tr><td className="py-1 pr-4">Bags</td><td>Backpack, Handbag</td></tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} Campus Lost &amp; Found. Built with HTML, CSS &amp; React.</p>
      </div>
    </footer>
  );
};

export default Footer;
