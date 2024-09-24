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

import CadastroMagia from "./pages/CadastroMagia";
import ListaMagia from "./pages/ListaMagia";

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
          <Route path="/CadastroMagia" component={CadastroMagia} />
          <Route path="/ListaMagia" component={ListaMagia} />
          <Route path="/AssistenteDev" component={AssistenteDev} />
          <Route
            path="/PaginaModificarPlanejamento"
            component={PaginaModificarPlanejamento}
          />
          <Route path="/" exact component={ListaMagia} />
        </Switch>
      </Router>
    </IonApp>
  );
};

export default App;
