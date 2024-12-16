import { Link } from "react-router-dom";

import Logo from "./Logo";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0">
      <div className="max-w-[1080px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
