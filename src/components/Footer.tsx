
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto py-4 border-t border-border/40">
      <div className="container max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <div className="mb-2 md:mb-0">
          <p>&copy; {new Date().getFullYear()} Face Recognition App</p>
        </div>
        
        <div className="flex items-center space-x-1">
          <Shield className="h-3.5 w-3.5" />
          <p>All processing happens locally on your device</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
