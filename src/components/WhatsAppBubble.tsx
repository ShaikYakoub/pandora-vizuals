'use client';

import React from 'react';

interface WhatsAppBubbleProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppBubble({
  phoneNumber = '916309897003',
  defaultMessage = 'Hi Pandora Visuals, I would like to inquire about a project.',
}: WhatsAppBubbleProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-24 sm:bottom-7 right-5 sm:right-8 z-[60] pointer-events-auto"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Pandora Visuals on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(37,211,102,0.35)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.55)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {/* Official WhatsApp Logo SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2C8.268 2 2 8.268 2 16c0 2.593.705 5.02 1.933 7.103L2.2 29.8l6.892-1.713A13.916 13.916 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 2.4c6.406 0 11.6 5.194 11.6 11.6 0 6.406-5.194 11.6-11.6 11.6-2.186 0-4.23-.607-5.975-1.666l-.428-.26-4.233 1.053 1.066-4.137-.282-.445A11.545 11.545 0 0 1 4.4 16c0-6.406 5.194-11.6 11.6-11.6zm-5.496 6.442c-.235 0-.618.088-.941.44-.323.352-1.234 1.206-1.234 2.94 0 1.733 1.264 3.407 1.44 3.642.176.235 2.451 3.917 6.02 5.346 2.966 1.188 3.568.95 4.215.892.646-.059 2.083-.852 2.377-1.674.294-.822.294-1.527.206-1.674-.088-.147-.323-.235-.676-.411-.352-.176-2.083-1.028-2.406-1.145-.323-.117-.558-.176-.793.176-.235.352-.91 1.145-1.116 1.38-.205.235-.411.264-.764.088-.352-.176-1.488-.549-2.833-1.748-1.047-.933-1.753-2.088-1.959-2.44-.206-.353-.022-.544.154-.719.158-.158.353-.411.529-.617.176-.206.235-.352.353-.587.117-.235.059-.441-.03-.617s-.793-1.91-1.087-2.614c-.286-.687-.577-.593-.793-.605-.205-.01-.441-.012-.676-.012z"
          />
        </svg>
      </a>
    </aside>
  );
}
