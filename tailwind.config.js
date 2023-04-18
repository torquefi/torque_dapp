const colors = require('tailwindcss/colors')

function getSemanticColors(color) {
  return {
    light: color[100],
    DEFAULT: color[500],
    dark: color[600],
  }
}

module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  purge: {
    content: ['./next/**/*.tsx', './**/*.tsx'],
    // options: {
    //   safelist: {
    //     // standard: [/^col-span\-/, /^text\-/, /^bg\-/, 'scroll-block'],
    //     greedy: [/^react-select/, /^react-datepicker/, /^swiper/],
    //   },
    // },
  },
  mode: 'jit',
  // purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        accent: {
          light: 'var(--color-accent-light)',
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
        },
        info: getSemanticColors(colors.blue),
        success: getSemanticColors(colors.green),
        warning: getSemanticColors(colors.yellow),
        danger: getSemanticColors(colors.red),
        gray: getSemanticColors(colors.gray),
        trueGray: getSemanticColors(colors.trueGray),
        bluegray: getSemanticColors(colors.blueGray),
        orange: getSemanticColors(colors.orange),
        teal: getSemanticColors(colors.teal),
        cyan: getSemanticColors(colors.cyan),
        purple: getSemanticColors(colors.purple),
        pink: getSemanticColors(colors.pink),
        primaryBtn: '#f037a5',
        secondaryBtn: '#2d46b9',
        paragraphText: {
          light: '#575757',
          DEFAULT: '#575757',
          dark: '#8a8f98',
        },
      },
      fontFamily: {
        // body: ['Open Sans', 'sans-serif'],
        body: ['hk_grotesk', 'sans-serif'],
      },
      // boxShadow: (theme) => {
      //   const colors = {
      //     primary, accent, bluegray
      //   } = theme('colors')
      //   return {
      //     ...buildShadowPalette(colors),
      //   }
      // },
      fontSize: {
        8: '8px',
        9: '9px',
        10: '10px',
        12: '12px',
        13: '13px',
        14: '14px',
        15: '15px',
        16: '16px',
        18: '18px',
        20: '20px',
        24: '24px',
        28: '28px',
        32: '32px',
        40: '40px',
        48: '48px',
        64: '64px',
      },
      borderWidth: {
        0.5: '0.5px',
      },
      maxWidth: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        24: '6rem',
        28: '7rem',
        '4xs': '8rem',
        '3xs': '12rem',
        '2xs': '16rem',
      },
      minWidth: {
        none: 'none',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        24: '6rem',
        28: '7rem',
        '4xs': '8rem',
        '3xs': '12rem',
        '2xs': '16rem',
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
      },
      height: {
        min: 'min-content',
        max: 'max-content',
        18: '4.5rem',
        22: '5.5rem',
      },
      minHeight: {
        none: 'none',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        24: '6rem',
        28: '7rem',
        '4xs': '8rem',
        '3xs': '12rem',
        '2xs': '16rem',
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        min: 'min-content',
      },
      borderRadius: {
        inherit: 'inherit',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        emerge: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fade: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        emergeUp: {
          from: { opacity: 0, transform: 'translateY(4px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideInBottom: {
          from: { opacity: 0, transform: 'translateY(100%)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideOutBottom: {
          from: { opacity: 1, transform: 'translateY(0)' },
          to: { opacity: 0, transform: 'translateY(100%)' },
        },
        slideInLeft: {
          from: { opacity: 0, transform: 'translateX(-100%)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideOutLeft: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(-100%)' },
        },
        slideInRight: {
          from: { opacity: 0, transform: 'translateX(100%)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideOutRight: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(100%)' },
        },
        scaleUp: {
          from: { opacity: 0, transform: 'scale(0)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        scaleDown: {
          from: { opacity: 1, transform: 'scale(1)' },
          to: { opacity: 0, transform: 'scale(0)' },
        },
      },
      zIndex: {
        100: '100',
        200: '200',
        300: '300',
        400: '400',
        500: '500',
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        emerge: 'emerge 0.2s ease-in',
        fade: 'fade .2s ease-out forwards',
        'emerge-up': 'emergeUp .2s ease-in',
        'slide-in-bottom': 'slideInBottom .2s ease-in',
        'slide-out-bottom': 'slideOutBottom .2s ease-out forwards',
        'scale-up': 'scaleUp .2s ease-in',
        'scale-down': 'scaleDown .2s ease-out forwards',
        'slide-in-left': 'slideInLeft .2s ease-in',
        'slide-out-left': 'slideOutLeft .2s ease-out forwards',
        'slide-in-right': 'slideInRight .2s ease-in',
        'slide-out-right': 'slideOutRight .2s ease-out forwards',
      },
    },
  },
  variants: {
    extend: {
      pointerEvents: ['disabled'],
      cursor: ['disabled'],
      opacity: ['disabled'],
      fill: ['hover', 'focus'],
      backgroundColor: ['checked'],
      borderColor: ['checked'],
      textColor: ['checked'],
      scale: ['active', 'group-hover'],
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16),
      }
    : null
}

function makeShadow(name, rgb) {
  const obj = {}

  const nameWithDash = (name ? `${name}-` : '').replace('-DEFAULT', '')
  const defaultName = (name ? name : 'DEFAULT').replace('-DEFAULT', '')

  obj[`${nameWithDash}xs`] = `0 0 0 1px rgba(${rgb}, 0.05)`
  obj[`${nameWithDash}sm`] = `0 1px 2px 0 rgba(${rgb}, 0.05)`
  obj[
    defaultName
  ] = `0 1px 3px 0 rgba(${rgb}, 0.1), 0 1px 2px 0 rgba(${rgb}, 0.06)`
  obj[
    `${nameWithDash}md`
  ] = `0 4px 6px -1px rgba(${rgb}, 0.1), 0 2px 4px -1px rgba(${rgb}, 0.06)`
  obj[
    `${nameWithDash}lg`
  ] = `0 10px 15px -3px rgba(${rgb}, 0.1), 0 4px 6px -2px rgba(${rgb}, 0.05)`
  obj[
    `${nameWithDash}xl`
  ] = `0 20px 25px -5px rgba(${rgb}, 0.1), 0 10px 10px -5px rgba(${rgb}, 0.04)`
  obj[`${nameWithDash}2xl`] = `0 25px 50px -12px rgba(${rgb}, 0.25)`
  obj[`${nameWithDash}inner`] = `inset 0 2px 4px 0 rgba(${rgb}, 0.06)`
  return obj
}

function buildShadowPalette(colors) {
  // default tailwindcss black shadows
  const defaultPalette = {
    ...makeShadow('', '0, 0, 0'),
    outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
    none: 'none',
  }

  const coloredShadowPalette = Object.values(
    Object.entries(colors).reduce((acc, curr) => {
      const [k, v] = curr
      if (
        typeof v === 'string' &&
        v !== 'transparent' &&
        v !== 'currentColor'
      ) {
        const { red, green, blue } = hexToRgb(v)
        acc[k] = makeShadow(k, `${red}, ${green}, ${blue}`)
      }
      if (typeof v === 'object') {
        Object.entries(v).forEach(([_k, _v]) => {
          const { red, green, blue } = hexToRgb(_v)
          acc[`${k}-${_k}`] = makeShadow(
            `${k}-${_k}`,
            `${red}, ${green}, ${blue}`
          )
        })
      }
      return acc
    }, {})
  )

  return coloredShadowPalette.reduce(
    (acc, cur) => ({ ...acc, ...cur }),
    defaultPalette
  )
}
