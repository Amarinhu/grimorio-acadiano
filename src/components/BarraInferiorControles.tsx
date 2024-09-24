import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonMenuButton,
  IonToolbar,
  IonFooter,
} from "@ionic/react";
import {
  body,
  book,
  flame,
  grid,
  logoBitcoin,
  menu,
  personCircle,
  rose,
} from "ionicons/icons";
import "./BarraInferiorControles.css";
import MenuLateral from "./MenuLateral";
import { Capacitor } from "@capacitor/core";

const botoesInformacoes = [{ nome: "Magias", url: "/", icon: flame }];

const iosPlat = Capacitor.getPlatform() === "ios";

const BarraInferior: React.FC = () => {
  return (
    <>
      <MenuLateral />
      <IonFooter style={{ height: iosPlat ? "5rem" : "3.5rem" }}>
        <IonTabs>
          <IonRouterOutlet
            id="main"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          ></IonRouterOutlet>
          <IonTabBar color="primary" slot="bottom">
            {botoesInformacoes.map((botao, indice) => (
              <IonTabButton key={indice} tab={botao.nome} href={botao.url}>
                <IonIcon color="light" icon={botao.icon}></IonIcon>
                <IonLabel>{botao.nome}</IonLabel>
              </IonTabButton>
            ))}
            <IonTabButton>
              <IonMenuButton autoHide={false}>
                <IonIcon icon={menu}></IonIcon>
              </IonMenuButton>
              <IonLabel>Menu</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonFooter>
    </>
  );
};

export default BarraInferior;
