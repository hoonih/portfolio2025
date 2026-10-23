import { GlobalStyle } from "./styles/GlobalStyle.ts";
import RootRoute from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <GlobalStyle />
        <RootRoute />
    </BrowserRouter>
  )
}

export default App
