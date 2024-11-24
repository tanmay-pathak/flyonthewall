const Hero = () => {
  return (
    <>
      <div className="text-center mt-2">
        <h1 className="mb-8 text-balance text-6xl font-bold text-zinc-800">
          Meeting Notes Assistant
        </h1>
      </div>
      <div className="max-w-3xl text-center mx-auto">
        <p className="mb-12 text-lg text-gray-600 text-balance leading-relaxed">
          Upload your meeting transcript and get an AI-powered summary with
          action items, key points, and attendees.
          <br />
          <span className="mt-4 block text-sm text-gray-500 italic">
            To export your transcript from Google Docs as a .txt file, go to
            File → Download → Plain text.
          </span>
        </p>
      </div>
    </>
  );
};

export default Hero;
