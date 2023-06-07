import {createTheme} from '@mui/material/styles';
import colors from '../assets/scss/_themes-vars.module.scss'

import themePalette from './palette';
import componentStyleOverrides from './compStyleOverride'
import themeTypography from './typography'
const theme = (customization: any) => {
    const color = colors
    const themeOption = customization.isDarkMode
        ? {
            colors: color,
            heading: color.paper,
            paper: color.darkPrimaryLight,
            backgroundDefault: color.darkPaper,
            background: color.darkPrimaryLight,
            darkTextPrimary: color.paper,
            darkTextSecondary: color.paper,
            textDark: color.paper,
            menuSelected: color.darkSecondaryDark,
            menuSelectedBack: color.darkSecondaryLight,
            divider: color.darkPaper,
            customization
        }
        : {
            colors: color,
            heading: color.grey900,
            paper: color.paper,
            backgroundDefault: color.paper,
            background: color.primaryLight,
            darkTextPrimary: color.grey700,
            darkTextSecondary: color.grey500,
            textDark: color.grey900,
            menuSelected: color.secondaryDark,
            menuSelectedBack: color.secondaryLight,
            divider: color.grey200,
            customization
        }

    const themes = createTheme({
        computed: undefined, methods: undefined, watch: undefined,
        direction: 'ltr',
        palette: themePalette(themeOption),
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        typography: themeTypography(themeOption)
    });
    themes.components = componentStyleOverrides(themeOption)
    return themes
}

export default theme;