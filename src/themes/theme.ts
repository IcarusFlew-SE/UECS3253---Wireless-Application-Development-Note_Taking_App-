export const tokens = {
    colors: {
        primary: { base: '#8579f3ff', light: '#a89fff', muted: '#7c6ff722'},
        accent: {
            teal: '#14b8a6', gold: '#eab308', rose: '#f43f5e',
            mint: '#22c55e', sky: '#388bdf8', coral: '#f97316'
        },
        text: {
            primary: '#e2e0f0', title: '#dddaf5',
            secondary: '#6b6b8a', muted: '#5a5a80',
            subtle: '4a4a6a', faint: '3a3a58'
        },
        bg: {
            app: '#0d0e1a', deep: '#0a0a18',
            surface: { 1: '#141428', 2: '#1a1a2e', 3: '#1c1c30', nav: '#111122'}
        },
        border: { primary: '#2a2a40', secondary: '1e1e32'}
    },
    spacing: { xs: '2px', sm: '4px', md: '6px', base: '8px', lg: '10px', xl: '12px', xxl: '14px', '3xl': '16px'},
    radius: { xz: '4px', sm: '6px', md: '8px', lg: '10px', xl: '12px', xxl: '20px', full: '9999px'},
    type: {
        logo: {size: '13px', weight: 500, lineHeight: 1.2},
        screenTitle: {size: '13px', weight: 500, lineHeight: 1.3},
        noteTitle: {size: '9px', weight: 500, lineHeight: 1.3},
        body: {size: '9px', weight: 400, lineHeight: 1.6},
        label: {size: '8px', weight: 500, letterSpacing: '0.5px', textTransform: 'uppercase'},
        chip: {size: '8px', weight: 500, letterSpacing: '0.5px'},
        tabLabel: {size: '8px', weight: 500},
        metadata: {size: '7px', weight: 400}
    },
    animation: {
        fast: { duration: '100ms', ease: 'ease-in-out'},
        normal: {duration: '150ms', ease: 'ease-in-out'},
        slow: {duration: '200ms', ease: 'ease-out'}
    }
};

export const theme = {
    dark: {
        background: '#0d0e1a',
        secondaryBg: '#141428',
        primary: '#7C6FF7',
        text: '#E2E0F0',
        subtext: '#6B6B8A',
        border: '#2A2A40',
        accent: '#14B8A6'
    },
    light: {
        background: '#f8f9fe',
        secondaryBg: '#FFFFFF',
        primary: '#7C6FF7',
        text: '#1A1A2E',
        subtext: '#6B6B8A',
        border: '#E2E0F0',
        accent: '#14B8A6',
    }
};
