import { Github, Linkedin, Twitter, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

        {/* ── Built by ── */}
        <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
          Built with{" "}
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />{" "}
          by{" "}
          <span className="text-primary font-semibold font-mono">&lt;Tuser /&gt;</span>
        </p>

        {/* ── Copyright ── */}
        <p className="text-xs text-muted-foreground order-last md:order-0">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>

        {/* ── Social icons ── */}
        <div className="flex gap-3">
          {[
            { icon: Github,   href: "https://github.com/tuser579"                                    },
            { icon: Linkedin, href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388" },
            { icon: Twitter,  href: "https://twitter.com"                                            },
          ].map(({ icon: Icon, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;