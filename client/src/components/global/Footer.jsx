import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col md:gap-3 gap-12 md:px-20 px-8 py-8 bg-slate-600 text-white">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <img
            src={`${process.env.PUBLIC_URL}/images/logo.png`}
            alt="Let's work"
            width={60}
            height={60}
          />
          <h1>&copy;Let&apos;s work</h1>
        </div>
        <p className="mb-3">
          We transform the way candidates find jobs and companies hire talent.
        </p>
        <p>&copy; {new Date().getFullYear()} Let&apos;s work, Inc.</p>
      </div>
      <div className="flex flex-col gap-2 flex-1 md:px-40">
        <Link to="/">About</Link>
        <Link to="/">Careers</Link>
        <Link to="/">Internships</Link>
        <Link to="/">Press</Link>
        <Link to="/">Blog</Link>
        <Link to="/">Contact</Link>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <h1 className="font-bold text-gray-400">Candidate</h1>
        <Link to="/">Job Board</Link>
        <Link to="/">Career Advice</Link>
        <Link to="/">Help for Jobseekers</Link>
        <Link to="/" className="outline-0">
          Jobseeker Guide
        </Link>
      </div>
    </div>
  );
};

export default Footer;
