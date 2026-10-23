import { GlobalStyle } from "./styles/GlobalStyle.ts";
import RootRoute from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";
import LanguageProvider from "./i18n/LanguageProvider.tsx";

function App() {
  return (
    <BrowserRouter>
        <LanguageProvider>
            <GlobalStyle />
            <RootRoute />
        </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
