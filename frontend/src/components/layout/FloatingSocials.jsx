import React from 'react';

const SocialIcon = ({ type }) => {
  switch (type) {
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
          <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.146.564 4.198 1.637 6.01L.226 23.364l5.474-1.436A11.956 11.956 0 0012.03 24c6.645 0 12.03-5.385 12.03-12.03S18.677 0 12.031 0zm6.592 17.15c-.279.791-1.634 1.458-2.25 1.543-.615.086-1.4.156-4.004-1.026-3.21-1.464-5.263-4.993-5.426-5.21-.161-.215-1.295-1.724-1.295-3.292s.827-2.339 1.118-2.651c.29-.312.633-.39.843-.39.21 0 .42.001.605.01.206.01.482-.078.753.57.291.691.996 2.428 1.082 2.6.086.173.144.376.037.592-.107.216-.161.346-.322.536-.16.19-.34.417-.483.57-.16.173-.332.366-.145.69.186.324.83 1.373 1.776 2.213 1.222 1.084 2.253 1.417 2.585 1.57.332.152.525.13.722-.093.197-.223.83-1.018 1.053-1.365.222-.347.444-.29.744-.176.3.113 1.91.9 2.239 1.062.33.161.547.241.628.375.081.134.081.776-.198 1.567z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      );
    default:
      return null;
  }
};

export default function FloatingSocials() {
  const whatsappMessage = encodeURIComponent("Namaste! Mujhe aapke services (Bantwara, Mapi, wagera) ke baare mein jaankari chahiye thi. Kripya meri madad karein.");
  const socialLinks = [
    {
      id: 'whatsapp',
      url: `https://wa.me/917979835440?text=${whatsappMessage}`, 
      bgClass: 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]',
      iconColor: 'text-green-500 group-hover:text-white',
      label: 'WhatsApp',
    },
    {
      id: 'youtube',
      url: '#', 
      bgClass: 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]',
      iconColor: 'text-red-600 group-hover:text-white',
      label: 'YouTube',
    },
    {
      id: 'facebook',
      url: '#', 
      bgClass: 'bg-[#1877F2] shadow-[0_0_20px_rgba(24,119,242,0.6)]',
      iconColor: 'text-[#1877F2] group-hover:text-white',
      label: 'Facebook',
    },
    {
      id: 'instagram',
      url: '#', 
      bgClass: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.6)]',
      iconColor: 'text-pink-600 group-hover:text-white',
      label: 'Instagram',
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[999] flex flex-col gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {socialLinks.map((link, index) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ animationDelay: `${index * 100}ms` }}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:scale-110"
        >
          {/* Fill background on hover */}
          <div className={`absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${link.bgClass}`} />
          
          {/* Icon */}
          <div className={`relative z-10 transition-colors duration-300 ${link.iconColor}`}>
            <SocialIcon type={link.id} />
          </div>
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-2 shadow-xl">
            {link.label}
            {/* Triangle pointer */}
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-[5px] border-transparent border-l-gray-900" />
          </span>
        </a>
      ))}
    </div>
  );
}
