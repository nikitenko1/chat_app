const Avatar = ({ size, src, alt }) => {
  return (
    <div
      className={`${
        size ? 'w-[40px] h-[40px]' : 'w-16 h-16'
      } rounded-full shrink-0 bg-white drop-shadow-md outline outline-1 outline-gray-600 hover:outline-offset-2`}
    >
      <img src={src} alt={alt} className="rounded-full w-full h-full" />
    </div>
  );
};

export default Avatar;
