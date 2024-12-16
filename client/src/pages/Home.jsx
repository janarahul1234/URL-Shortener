import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Header />

      <section className="min-h-screen px-8 py-20 grid place-items-center">
        <div className="grid gap-9">
          <div className="text-center">
            <h1 className="text-gray-900 text-[2rem] sm:text-6xl leading-tight sm:leading-tight font-semibold mb-5">
              Easily Shorten
              <br />
              Links & Share Smarter
              <br />
              Across Platforms
            </h1>

            <p className="max-w-[31rem] text-gray-600 justify-self-center">
              Connect with your audience, manage links effectively, and unlock
              the potential of QR codes—all on one powerful platform.
            </p>
          </div>

          <Button className="justify-self-center" asChild>
            <Link to="/dashboard">Shorten your Link</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
