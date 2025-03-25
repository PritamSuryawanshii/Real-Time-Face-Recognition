
import { Scan, User } from "lucide-react";

interface HeaderProps {
  facesDetected: number;
}

const Header = ({ facesDetected }: HeaderProps) => {
  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scan className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-medium">Face Recognition</h1>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1.5 glass px-2.5 py-1 rounded-full text-sm">
            <User className="h-4 w-4 text-primary/70" />
            <span>
              {facesDetected === 0 ? (
                "No faces detected"
              ) : (
                `${facesDetected} ${facesDetected === 1 ? 'face' : 'faces'} detected`
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
