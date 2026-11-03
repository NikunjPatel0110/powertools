import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner grid-4-footer">
        <div>
          <div className="navbar-brand" style={{ marginBottom: 12 }}>AkmultiTools</div>
          <p className="body-sm" style={{ color: 'var(--secondary)', maxWidth: 360, marginBottom: 16 }}>
            The premier procurement platform for industrial professionals. High-density data, uncompromising quality, and technical precision.
          </p>
          <div className="body-sm" style={{ color: 'var(--secondary)' }}>© 2024 AkmultiTools. Precision Engineered.</div>
        </div>
        <div>
          <h4>Legal</h4>
          <a href="#" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Privacy Policy</a>
          <a href="#" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Terms of Service</a>
        </div>
        <div>
          <h4>Support & Contact</h4>
          <a href="#" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Shipping Info</a>
          <a href="#" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Return Policy</a>
          <a href="mailto:support@akmultitools.com" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>support@akmultitools.com</a>
        </div>
      </div>
    </footer>
  )
}
