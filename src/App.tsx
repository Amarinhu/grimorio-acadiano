import React, { useEffect, useState } from "react";
import { IonApp, setupIonicReact } from "@ionic/react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import "./global.css";
import "./theme/variables.css";

import EditorDeFeiticos from "./pages/EditorDeFeiticos";
import ExploradorDeFeiticos from "./pages/ExploradorDeFeiticos";
import Grimorio from "./pages/Grimorio";
import VerMagia from "./pages/VerMagia";

import AssistenteDev from "./pages/AssistenteDev";

import PaginaModificarPlanejamento from "./pages/123";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <Router>
        <Switch>
          <Route path="/EditorDeFeiticos" component={EditorDeFeiticos} />
          <Route path="/Grimorio" component={Grimorio} />
          <Route path="/VerMagia" component={VerMagia} />
          
          <Route path="/ExploradorDeFeiticos" component={ExploradorDeFeiticos} />
          <Route path="/AssistenteDev" component={AssistenteDev} />
          <Route
            path="/PaginaModificarPlanejamento"
            component={PaginaModificarPlanejamento}
          />
          <Route path="/" exact component={ExploradorDeFeiticos} />
        </Switch>
      </Router>
    </IonApp>
  );
};

export default App;
