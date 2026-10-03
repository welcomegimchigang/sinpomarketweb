import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        market: {
          seal: "#8C6239", // 광장시장 스타일 황토색 한자 직인 컬러
          "seal-light": "#A07248",
          yellow: "#E5A93C", // 스토리마켓 옐로우 배너 컬러
          "yellow-dark": "#C88B25",
          darkbar: "#222222", // 포트폴리오 필터 다크 바
          darkfooter: "#181818", // 다크 푸터
          cyan: "#00ACC1", // 최근소식 청록색 링크 타이틀
        },
      },
      fontFamily: {
        sans: ["'Noto Sans KR'", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
