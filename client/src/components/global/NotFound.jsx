import { Link } from 'react-router-dom';
import HeadInfo from '../../utils/HeadInfo';

const NotFound = () => {
  return (
    <>
      <HeadInfo title="Let's work | 404" />
      <div className="flex items-center justify-center flex-col w-full h-screen">
        <img
          src={`${process.env.PUBLIC_URL}/images/logo.png`}
          alt="Let's work"
        />
        <h1 className="font-medium text-3xl mt-5">Inspace | 404 Not Found</h1>
        <Link
          to="/"
          className="bg-sky-400 rounded-md px-4 py-3 transition-[background] hover:bg-sky-500 mt-5 text-white"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
