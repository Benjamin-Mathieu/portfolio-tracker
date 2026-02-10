module.exports = {
    purge: ['./src/**/*.vue', './src/**/*.js'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'dark-bg': '#212429',
                'crypto-green': 'greenyellow',
            },
        },
    },
    variants: {
        extend: {
            opacity: ['group-hover'],
            visibility: ['group-hover'],
            textColor: ['group-hover'],
            backgroundColor: ['hover', 'active'],
            scale: ['hover', 'active'],
            transform: ['hover', 'group-hover'],
        },
    },
    plugins: [],
}
