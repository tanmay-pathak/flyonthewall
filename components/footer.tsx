import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-white border-t border-zuPrimary mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-500">
              Powered by{" "}
              <a
                href="https://dub.sh/together-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors  underline-offset-4 underline"
              >
                Together AI
              </a>
              . Created by Jasmine, Jon, Max, and Tanmay.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
