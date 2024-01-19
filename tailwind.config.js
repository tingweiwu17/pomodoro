/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,html}"],
  theme: {
    extend: {
      width: {
        allW: "620px",
        contentW: "467px",
      },
      colors: {
        pomoRed: "rgb(186,73,73)",
        btnColor: "rgba(255,255,255,0.2)",
        bgGray: "rgba(255,255,255,0.1)",
        checked: "rgba(0,0,0,0.1)",
        formGray: "rgb(239,239,239)",
        cancelbtn: "rgb(136,136,136)",
        pomoColor: "rgb(85,85,85)",
        addbtn: "rgb(0,0,0,0.4)",
        checkIcon: "rgb(223,223,223)",
        numColor: "rgb(187,187,187)",
        timeColor: "rgba(255,255,255,0.7)",
        on: "rgba(132, 199, 51, 0.8)",
        off: "rgb(204, 204, 204)",
        select: "rgb(235,235,235)",
        finished: "rgb(55,149,128)",
      },
      fontSize: {
        startBtn: "22px",
        clock: "120px",
      },
    },
  },
  plugins: [],
};
