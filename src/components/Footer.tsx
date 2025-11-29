import { Scale, Mail, Phone, MapPin, Twitter, Github, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Github', href: '#', icon: Github },
    { name: 'Facebook', href: '#', icon: Facebook },
  ];

  const quickLinks = [
    { name: 'Dashboard', href: '/app' },
    { name: 'Documents', href: '/app/documents' },
    { name: 'Lawyers', href: '/app/lawyers' },
    { name: 'Legal Updates', href: '/app/updates' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Legal Notice', href: '#' },
  ];

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">QanunAI</h3>
                <p className="text-xs text-foreground-muted">Document Analyzer</p>
              </div>
            </div>
            <p className="text-foreground-muted text-sm leading-relaxed">
              AI-powered legal document analysis and risk assessment platform. 
              Simplifying legal workflows for professionals worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-background rounded-lg hover:bg-primary hover:text-primary-foreground transition-smooth"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-foreground-muted hover:text-primary transition-smooth text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-foreground-muted hover:text-primary transition-smooth text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a 
                  href="mailto:contact@qanunai.com"
                  className="text-foreground-muted hover:text-primary transition-smooth text-sm"
                >
                  contact@qanunai.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a 
                  href="tel:+1234567890"
                  className="text-foreground-muted hover:text-primary transition-smooth text-sm"
                >
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <address className="text-foreground-muted text-sm not-italic">
                  123 Legal Street<br />
                  New York, NY 10001<br />
                  United States
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground-muted text-sm">
              © {new Date().getFullYear()} QanunAI. All rights reserved.
            </p>
            <p className="text-foreground-muted text-sm mt-2 md:mt-0">
              Built with ❤️ for legal professionals
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;