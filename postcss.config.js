let tailwindPlugin

try {
  tailwindPlugin = require('@tailwindcss/postcss')
} catch {
  tailwindPlugin = require('tailwindcss')
}

module.exports = {
  plugins: [tailwindPlugin, require('autoprefixer')],
}
