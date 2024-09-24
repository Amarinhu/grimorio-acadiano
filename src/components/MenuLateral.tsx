import React from "react";
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonImg,
  IonHeader,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router";
import { exit, cog } from "ionicons/icons";
import "./MenuLateral.css";
import armazenamento from "../armazenamento";
import LogoAssistente from "../assets/logo-assistente-acadiano.png";

const MenuLateral: React.FC = () => {
  const navegar = useHistory();

  const caminhosMenu = async (pagina: string, nome: string) => {
    if (nome === "Sair") {
      await armazenamento.remove("token");
      await armazenamento.remove("tempoLimite");
      await armazenamento.remove("foto");
      navegar.replace(pagina);
    } else {
      navegar.push(pagina);
    }
  };

  const caminhos = [{ nome: "Dev Tools", url: "/AssistenteDev", icon: cog }];

  return (
    <IonMenu contentId="main">
      <IonContent color="primary">
        <div className="circula-img limita-img">
          <IonImg src={LogoAssistente} />
        </div>
        <IonHeader style={{ color: "yellow" }}>Assitente Acadiano</IonHeader>
        {caminhos.map((item, index) => (
          <IonMenuToggle key={index}>
            <IonItem
              color="tertiary"
              routerLink={item.url}
              onClick={() => caminhosMenu(item.url, item.nome)}
            >
              <IonIcon color="primary" icon={item.icon} slot="start" />
              <IonLabel>{item.nome}</IonLabel>
            </IonItem>
          </IonMenuToggle>
        ))}
        <div className="ion-text-center custom-versao">
          <IonText>Ver. 0.1.0</IonText>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default MenuLateral;
