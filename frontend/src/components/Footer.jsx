import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-main">
          <Link to="/" className="footer-brand" aria-label="Interviewly home">
            <span className="footer-brand-mark"><Sparkles size={19}/></span>
            <span><strong>Interviewly</strong><small>Practise with purpose.</small></span>
          </Link>
          <p className="footer-description">A calmer way to prepare, practise and build confidence for your next interview.</p>
          <div className="footer-status"><span/> Your next opportunity starts with practice</div>
        </div>
        <div className="footer-links-group">
          <span className="footer-heading">Explore</span>
          <Link to="/">Home</Link>
          <Link to="/plans">Plans</Link>
          <Link to="/about">About Interviewly</Link>
        </div>
        <div className="footer-links-group">
          <span className="footer-heading">Information</span>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/signin">Sign in <ArrowUpRight size={12}/></Link>
          <Link to="/signup">Create account <ArrowUpRight size={12}/></Link>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Interviewly. All rights reserved.</span>
        <span>Made for your next big step <Heart size={13} fill="currentColor"/></span>
      </div>
    </footer>
  );
}
