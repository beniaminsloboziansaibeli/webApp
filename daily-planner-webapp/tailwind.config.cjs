module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-600': 'var(--primary-600)',
        surface: 'var(--surface)',
        'card-glass': 'var(--card-glass)',
        muted: 'var(--muted)',
        success: 'var(--success)',
        danger: 'var(--danger)'
      },
      borderRadius: {
        md: '12px',
        lg: '16px'
      },
      boxShadow: {
        soft: 'var(--shadow-soft)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
