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
import { exit, cog, key, colorPalette, diamond } from "ionicons/icons";
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

  const caminhos = [
    { nome: "Configurações", url: "/Configuracao", icon: cog },
    { nome: "Dev Tools", url: "/AssistenteDev", icon: key },
    /*{ nome: "Me Apoie!!", url: "/Apoio", icon: colorPalette },*/
  ];

  const redApoio = () => {
    navegar.push("/Apoio");
  };

  const versao = "1.1.0";

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
              <IonIcon icon={item.icon} slot="start" />
              <IonLabel>{item.nome}</IonLabel>
            </IonItem>
          </IonMenuToggle>
        ))}
        <IonItem onClick={redApoio} button lines="none" color="ouroprimario" detail={true}>
          <IonIcon icon={diamond} slot="start" size="large" />
          <IonLabel>Me Apoie!</IonLabel>
        </IonItem>

        <div className="ion-text-center custom-versao">
          <IonText>Ver. {versao}</IonText>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default MenuLateral;
