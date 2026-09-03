import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner grid-4-footer">
        <div>
          <div className="navbar-brand" style={{marginBottom:8}}>IndustrialDirect</div>
          <p className="body-sm" style={{color:'var(--secondary)',maxWidth:360,marginBottom:16}}>
            The premier procurement platform for industrial professionals. High-density data, uncompromising quality, and technical precision.
          </p>
          <div className="body-sm" style={{color:'var(--secondary)'}}>© 2024 IndustrialDirect. Precision Engineered.</div>
        </div>
        <div>
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="#">Shipping Info</a>
          <a href="#">Return Policy</a>
        </div>
      </div>
    </footer>
  )
}
