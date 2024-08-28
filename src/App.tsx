import { ThemeProvider } from "@emotion/react";
import { ImageAreaSelector } from "./component/ImageAreaSelector";
import theme from "./styles/theme";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <ImageAreaSelector />
    </ThemeProvider>
  );
}
