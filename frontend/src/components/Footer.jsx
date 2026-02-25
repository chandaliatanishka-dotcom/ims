import { Package } from "lucide-react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="brand-row">
          <Package size={20} />
          <span className="brand-title">StockFlow</span>
        </div>
        <p className="muted">© 2025 StockFlow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;