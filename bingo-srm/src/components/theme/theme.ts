import { PaletteMode, ThemeOptions } from "@mui/material";
import { createContext } from "react";

interface ColorContextSchema {
  toggleColorMode: () => void;
}
export const ColorContext = createContext<ColorContextSchema>(
  {} as ColorContextSchema,
);

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#3c94ea",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#6C63FF",
            light: "#f3f1ff",
          },
          background: {
            default: "#f7f7f7",
            paper: "#ffffff",
          },
          error: {
            main: "#f95873",
          },
          text: {
            primary: "#333333",
            secondary: "#9898af",
          },
        }
      : {
          primary: {
            main: "#4e9dea",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#6C63FF",
            light: "#f3f1ff",
          },
          background: {
            default: "#242835",
            paper: "#1a1a26",
          },
          error: {
            main: "#f95873",
          },
        }),
  },

  typography: {
    htmlFontSize: 16,
    fontSize: 14,
    fontFamily:
      '"Apple SD Gothic Neo", "Malgun Gothic", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.005em",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.005em",
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: "0em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: "0.00938em",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: "0.00714em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0.01071em",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: "0.03333em",
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
      textTransform: "uppercase",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: 500,
          letterSpacing: "0.02em",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiCheckbox: {
      defaultProps: {
        size: "small",
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
          },
        },
      },
    },

    MuiSvgIcon: {
      defaultProps: {
        fontSize: "small",
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          letterSpacing: "0.01em",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
        },
      },
    },
  },
});

export { getDesignTokens };
