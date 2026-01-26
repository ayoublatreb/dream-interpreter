'use client'

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import soundEffects from '../utils/soundEffects';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsOpen(false);
    soundEffects.playClick();
  };

  const menuItems = [
    { path: '/', label: 'الرئيسية', icon: '🏠' },
    { path: '/about', label: 'عن التطبيق', icon: '✨' },
    { path: '/articles', label: 'مقالات', icon: '📚' },
    { path: '/reviews', label: 'التقييمات', icon: '⭐' },
    { path: '/contact', label: 'اتصل بنا', icon: '📞' },
    { path: '/privacy', label: 'الخصوصية', icon: '🔒' }
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
          }}
        ></div>
      )}

      {/* Navigation Bar */}
      <nav
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        <div className="nav-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>

          {/* Logo Section */}
          <div className="nav-logo" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div
              className="logo-icon"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              ✨
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                letterSpacing: '1px'
              }}>
                تفسير الأحلام
              </span>
              <span style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: '400'
              }}>
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="nav-menu desktop-menu" style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleNavClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: pathname === item.path ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: pathname === item.path ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: pathname === item.path ? '700' : '500',
                  border: pathname === item.path ? '1px solid rgba(102, 126, 234, 0.4)' : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
                {pathname === item.path && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    borderRadius: '2px'
                  }}></div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn" style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            zIndex: 1001,
            position: 'relative'
          }}
          onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`} style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
          maxHeight: isOpen ? '400px' : '0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px' }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleNavClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  color: pathname === item.path ? '#667eea' : 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: pathname === item.path ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: pathname === item.path ? '700' : '500',
                  border: pathname === item.path ? '1px solid rgba(102, 126, 234, 0.4)' : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  marginBottom: '8px',
                  fontSize: '16px'
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Add CSS styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }

        .navbar {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .mobile-overlay {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mobile-menu {
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Additional mobile improvements */
        .mobile-menu-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        /* Ensure proper z-index stacking */
        .navbar {
          will-change: transform, background-color;
          backface-visibility: hidden;
        }

        /* Fix potential mobile menu positioning issues */
        .mobile-menu {
          will-change: transform, opacity, visibility;
        }

        /* Improve mobile menu button accessibility */
        .mobile-menu-btn:focus {
          outline: 2px solid rgba(212, 175, 55, 0.5);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}