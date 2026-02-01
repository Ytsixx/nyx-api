export default {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        'saira': ['Saira', 'sans-serif'],
      },
      keyframes: {
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }
        },
        blink: {
          "50%": {
            borderColor: "transparent"
          },
          "100%": {
            borderColor: "black"
          }
        }
      },
      animation: {
        typing: "typing 2s steps(20) infinite alternate, blink .7s infinite"
      }
    },
  },
  plugins: [
    await import('@tailwindcss/typography'),
    await import('@tailwindcss/forms'),
    await import('@tailwindcss/aspect-ratio'),
    await import('tailwindcss-animated')
  ],
}