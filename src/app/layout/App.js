import KanbanBoard from "../../features/KanbanBoard";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <KanbanBoard />
      </Router>
    </div>
  );
}

export default App;
