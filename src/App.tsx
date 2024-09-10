import { Index } from "./screens";
import { StateProvider } from "./state/state";

const App = () => (
  <StateProvider>
    <Index />
  </StateProvider>
);

export default App;
