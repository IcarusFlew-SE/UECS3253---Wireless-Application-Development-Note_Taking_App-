export const tokens = {
    colors: {
        primary: { base: '#8579f3ff', light: '#a89fff', muted: '#7c6ff722'},
        accent: {
            teal: '#14b8a6', 
            gold: '#eab308', 
            rose: '#f43f5e',
            mint: '#22c55e', 
            sky: '#388BDF', 
            coral: '#f97316'
        },
        text: {
            primary: '#e2e0f0', 
            title: '#dddaf5',
            secondary: '#6b6b8a', 
            muted: '#5a5a80',
            subtle: '#4A4A64', 
            faint: '#3A3A58'
        },
        bg: {
            app: '#0E1020',
            deep: '#0A0D1A',
            surface: { 
                1: '#16182B', 
                2: '#1D1F36', 
                3: '#242641', 
                nav: '#121427' 
            },
        },
        border: { 
            primary: '#2D3152', 
            secondary: '#252947' 
        },
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
        secondaryBg: 'rgba(20, 20, 40, 0.6)',
        primary: '#7C6FF7',
        text: '#E2E0F0',
        subtext: '#6B6B8A',
        border: 'rgba(226, 224, 240, 0.1)',
        accent: '#14B8A6',
        glassBg: 'rgba(255, 255, 255, 0.05)',
    },
    light: {
        background: '#f8f9fe',
        secondaryBg: 'rgba(255, 255, 255, 0.6)',
        primary: '#7C6FF7',
        text: '#1A1A2E',
        subtext: '#6B6B8A',
        border: 'rgba(26, 26, 46, 0.1)',
        accent: '#14B8A6',
        glassBg: 'rgba(255, 255, 255, 0.6)',
    }
};
