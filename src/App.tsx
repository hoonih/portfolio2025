import {GlobalStyle} from "./styles/styles.ts";
import RootRoute from "./routes";
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
