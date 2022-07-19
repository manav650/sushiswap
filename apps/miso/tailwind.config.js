module.exports = {
  presets: [require('@sushiswap/ui/tailwind')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/wagmi/{components,systems}/**/*.tsx',
    '../../packages/ui/{,!(node_modules)/**/}*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
}
