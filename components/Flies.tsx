const Flies = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              animation: `
                      fly${i} ${3 + i}s infinite linear,
                      bob ${1 + i}s infinite ease-in-out
                    `,
              transformOrigin: "center",
            }}
          >
            <span className="text-4xl">🪰</span>
          </div>
        ))}
        <style jsx>{`
          @keyframes fly0 {
            0% {
              transform: translate(-200px, -200px) rotate(0deg);
            }
            25% {
              transform: translate(200px, -150px) rotate(90deg);
            }
            50% {
              transform: translate(150px, 200px) rotate(180deg);
            }
            75% {
              transform: translate(-150px, 150px) rotate(270deg);
            }
            100% {
              transform: translate(-200px, -200px) rotate(360deg);
            }
          }
          @keyframes fly1 {
            0% {
              transform: translate(180px, -180px) rotate(0deg);
            }
            25% {
              transform: translate(-170px, 190px) rotate(90deg);
            }
            50% {
              transform: translate(-180px, -170px) rotate(180deg);
            }
            75% {
              transform: translate(190px, -190px) rotate(270deg);
            }
            100% {
              transform: translate(180px, -180px) rotate(360deg);
            }
          }
          @keyframes fly2 {
            0% {
              transform: translate(-160px, 160px) rotate(0deg);
            }
            25% {
              transform: translate(210px, -140px) rotate(90deg);
            }
            50% {
              transform: translate(-210px, -210px) rotate(180deg);
            }
            75% {
              transform: translate(-140px, 210px) rotate(270deg);
            }
            100% {
              transform: translate(-160px, 160px) rotate(360deg);
            }
          }
          @keyframes bob {
            0%,
            100% {
              margin-top: -12px;
            }
            50% {
              margin-top: 12px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Flies;
