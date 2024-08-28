import "@emotion/react";
import { Theme } from "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colorNeutral700: string;
    colorNeutral500: string;
    colorNeutral400: string;
    colorNeutral300: string;
    colorNeutral200: string;
    colorNeutral150: string;
    colorNeutral100: string;
    colorWarning: string;
    colorPrimary: string;
    colorPrimary100: string;
  }
}
const theme: Theme = {
  colorNeutral700: "#000000",
  colorNeutral500: "#D4DADE",
  colorNeutral400: "#9D9695",
  colorNeutral300: "#D7DADD",
  colorNeutral200: "#ebf0f3",
  colorNeutral150: "#f4f9fa",
  colorNeutral100: "#FFFFFF",
  colorWarning: "#F16C5D",
  colorPrimary: "#1267db",
  colorPrimary100: "#6A8BBD",
};

export default theme;
