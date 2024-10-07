import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonIcon,
  IonModal,
  IonImg,
  IonItem,
  IonToast,
} from "@ionic/react";
import BarraSuperior from "../components/BarraSuperior";
import { cash, copy, diamond, mail, qrCode } from "ionicons/icons";
import qrCodePix from "../assets/qrcode-pix.png";

const Apoio: React.FC = () => {
  const [mostraModalPix, defMostraModalPix] = useState(false);
  const [mostraMensagem, defMostraMensagem] = useState<boolean>(false);
  const [corToast, defCorToast] = useState<string>("");
  const [toastTexto, defToastTexto] = useState<string>("");

  const pixKey =
    "00020126500014BR.GOV.BCB.PIX0128assistenteacadiano@gmail.com52040000530398654045.005802BR5901N6001C62220518AssistenteAcadiano6304BDEA";

  const pixCopiaCola = () => {
    try {
      navigator.clipboard.writeText(pixKey);
    } catch (erro) {
      console.error(erro);
    } finally {
      defCorToast("success");
      defToastTexto("Pix Copia e Cola copiado para a área de transferência");
      defMostraMensagem(true);
      defMostraModalPix(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <BarraSuperior icone={diamond} titulo="Apoio" corBarra="ouroprimario" />
      </IonHeader>
      <IonContent className="ion-padding" color="ourosecundario">
        <IonCard color="ouroprimario">
          <IonCardHeader className="ion-text-center">
            <IonCardTitle>Suporte meu trabalho!</IonCardTitle>
          </IonCardHeader>
        </IonCard>

        <IonCard color="ouroprimario">
          <IonCardHeader>
            <IonCardTitle>1. Faça uma Doação</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ textAlign: "justify" }}>
            Se você vê futuro no que faço, gosta ou acredita no projeto, pode me
            ajudar financeiramente. Agradeço desde já! Aqui está meu PIX:
            <IonButton
              onClick={() => defMostraModalPix(true)}
              color="ourosecundario"
              expand="block"
            >
              <IonIcon slot="start" icon={qrCode} />
              <IonLabel>
                <strong>Apoiar via PIX</strong>
              </IonLabel>
            </IonButton>
            <em>
              (Se você colocar seu email e nome no pix eu irei agradecer
              individualmente cada um).
            </em>
          </IonCardContent>
        </IonCard>

        <IonCard color="ouroprimario">
          <IonCardHeader>
            <IonCardTitle>2. Me dê feedback!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ textAlign: "justify" }}>
            O projeto só melhora com sua ajuda. Seja um elogio, crítica ou
            sugestão, tudo é importante para evoluirmos juntos! Nós mande um
            email.
            <IonButton
              color="ourosecundario"
              expand="block"
              href="mailto:assistenteacadiano@gmail.com"
              target="_blank"
            >
              <IonIcon slot="start" icon={mail} />
              <IonLabel>
                <strong>Enviar Email</strong>
              </IonLabel>
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard color="ouroprimario">
          <IonCardHeader>
            <IonCardTitle>3. Espalhe a Palavra!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ textAlign: "justify" }}>
            Uma forma de ajudar é espalhar a palavra.{" "}
            <strong>Quem não é visto não é lembrado!</strong> Quanto mais
            pessoas apoiando o projeto e dando feedback, melhor o projeto fica.
            Estou sempre animado para ouvir suas ideias! Poste no Reddit, redes
            de Tormenta, seja no WhatsApp, Telegram, Instagram, ou qualquer
            outro lugar. Qualquer ajuda é extremamente valiosa!
          </IonCardContent>
        </IonCard>

        <IonModal
          isOpen={mostraModalPix}
          onDidDismiss={() => defMostraModalPix(false)}
          className="custom-modal"
        >
          <IonCard
            color="primary"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          >
            <IonCardContent style={{ padding: "0px" }}>
              <IonItem lines="none" color="ouroprimario">
                <IonImg src={qrCodePix} />
              </IonItem>
              <IonItem
                onClick={pixCopiaCola}
                color="ouroprimario"
                lines="none"
                style={{ justifyContent: "center" }}
              >
                <IonButton
                  color="ouroprimario"
                  size="large"
                  expand="block"
                  style={{ maxWidth: "300px" }}
                >
                  <IonIcon slot="start" icon={copy} />
                  <IonLabel>Pix Copia e Cola</IonLabel>
                </IonButton>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </IonModal>

        <IonToast
          color={corToast}
          isOpen={mostraMensagem}
          message={toastTexto}
          onDidDismiss={() => defMostraMensagem(false)}
          duration={2000}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default Apoio;
