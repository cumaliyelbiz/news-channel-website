"use client";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const SocialSidebar = () => {
  const socialLinks = [
    { icon: Facebook, color: "bg-blue-600", url: "#" },
    { icon: Twitter, color: "bg-sky-400", url: "#" },
    { icon: Instagram, color: "bg-pink-600", url: "#" },
    { icon: Linkedin, color: "bg-blue-700", url: "#" },
    { icon: Youtube, color: "bg-red-600", url: "#" },
  ];

  return (
    <div className="fixed left-0 top-1/3 z-50 flex flex-col">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${link.color} p-3 text-white hover:scale-110 transition-transform duration-200`}
        >
          <link.icon size={20} />
        </a>
      ))}
    </div>
  );
};

export default SocialSidebar;
