import { useEffect, useRef, useState } from "react";
import BarraSuperior from "../components/BarraSuperior";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToast,
} from "@ionic/react";
import {
  add,
  book,
  closeCircle,
  copy,
  eye,
  filter,
  flame,
  pencil,
  remove,
  search,
  trash,
} from "ionicons/icons";
import CirculoCarregamento from "../components/CirculoDeCarregamento";
import BarraInferior from "../components/BarraInferiorControles";
import usaSQLiteDB from "../composables/usaSQLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useHistory } from "react-router";
import { createGesture, Gesture } from "@ionic/react";
import BotaoAdicionarItem from "../components/BotaoAdicionar";

const ListaGrimorios: React.FC = () => {
  const [carregamento, defCarregamento] = useState<boolean>(false);
  const [mostraMensagem, defMostraMensagem] = useState<boolean>(false);

  const [corToast, defCorToast] = useState<string>("");
  const [toastTexto, defToastTexto] = useState<string>("");

  const [mostraModalOpcoes, defMostraModalOpcoes] = useState(false);

  const [grimorioItens, defGrimorioItens] = useState<Array<any>>([]);
  const { executarAcaoSQL, iniciado } = usaSQLiteDB();
  const navegar = useHistory();

  useEffect(() => {
    buscaDados();
  }, [iniciado]);

  const buscaDados = async () => {
    let comandoSQL = `SELECT 
    ID, NOME, USUARIO, FOTO FROM GRIMORIO ORDER BY NOME`;

    try {
      defCarregamento(true);
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        const resultado = await db?.query(comandoSQL);
        console.log(resultado);
        if (resultado && resultado.values) {
          defGrimorioItens(resultado?.values);
        }
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      console.log(grimorioItens);
      defCarregamento(false);
    }
  };

  const filtraDados = () => {
    buscaDados();
  };

  const retirarGrimorio = async (idGrimorio: number) => {
    try {
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        await db?.query(` DELETE FROM MAGIAGRIMORIO WHERE ID_GRIMORIO = ? `, [
          idGrimorio,
        ]);
        await db?.query(` DELETE FROM GRIMORIO WHERE ID = ? `, [idGrimorio]);
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      filtraDados();
      defCorToast("warning");
      defToastTexto("Grimório deletado com sucesso!");
      defMostraMensagem(true);
      defMostraModalOpcoes(false);
    }
  };

  const redEditarGrimorio = (idGrimorio: number) => {
    navegar.push(`/EditorDeGrimorio?idGrimorio=${idGrimorio}`);
  };

  /**/
  const botaoRefs = useRef<Array<HTMLIonCardElement | null>>([]);
  const [cardSel, defCardSel] = useState<number>(0);
  const [cardSelNome, defCardSelNome] = useState<string | null>();
  let holdTimeout: NodeJS.Timeout | null = null;

  const iniciarSegurar = (idCard: number, nome: string) => {
    holdTimeout = setTimeout(() => {
      defCardSel(idCard);
      defCardSelNome(nome);
      defMostraModalOpcoes(true);
      console.log(`Botão ${idCard} ${cardSel} foi segurado`);
    }, 500);
  };

  const cancelarSegurar = () => {
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      holdTimeout = null;
    }
  };

  const segurarBotao = (idCard: number, nome: string, cardIndex: number) => {
    const cardElement = botaoRefs.current[cardIndex];
    if (cardElement) {
      const gesto = createGesture({
        el: cardElement,
        gestureName: "segurar-gesto",
        onStart: () => iniciarSegurar(idCard, nome),
        onEnd: cancelarSegurar,
        threshold: 0,
        onMove: () => {},
      });
      gesto.enable();
    }
  };

  const redVerGrimorio = (idGrimorio: number) => {
    navegar.push(`/Grimorio?idGrimorio=${idGrimorio}`);
  };
  /**/

  return (
    <IonPage>
      <IonHeader>
        <BarraSuperior icone={book} titulo={"Grimórios"} />
      </IonHeader>
      <IonContent color="tertiary">
        {!carregamento ? (
          <div>
            {grimorioItens.map((grimorio, indice) => (
              <IonCard
                ref={(a) => (botaoRefs.current[indice] = a)}
                onMouseDown={() =>
                  segurarBotao(grimorio.ID, grimorio.NOME, indice)
                }
                onTouchStart={() =>
                  segurarBotao(grimorio.ID, grimorio.NOME, indice)
                }
                onMouseUp={cancelarSegurar}
                onTouchEnd={cancelarSegurar}
                key={grimorio.ID}
                color="secondary"
              >
                <IonCardHeader>
                  <IonRow className="ion-align-items-center">
                    <IonCol size="3" className="circula-img">
                      <IonImg
                        style={{ height: "4rem", width: "4rem" }}
                        src={grimorio.FOTO}
                      ></IonImg>
                    </IonCol>
                    <IonCol>
                      <IonCardTitle>
                        <IonIcon icon={book} />
                        <IonLabel style={{ paddingLeft: "0.5rem" }}>
                          {grimorio.NOME}
                        </IonLabel>
                      </IonCardTitle>
                      <IonCardSubtitle>{grimorio.USUARIO}</IonCardSubtitle>
                    </IonCol>
                    <IonCol size="2">
                      <IonButton
                        onClick={() => redEditarGrimorio(grimorio.ID)}
                        fill="clear"
                      >
                        <IonIcon icon={pencil} />
                      </IonButton>
                      <IonButton
                        onClick={() => redVerGrimorio(grimorio.ID)}
                        fill="clear"
                      >
                        <IonIcon icon={eye} />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardHeader>
                <IonCardContent></IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : null}
        <IonModal
          isOpen={mostraModalOpcoes}
          onDidDismiss={() => defMostraModalOpcoes(false)}
          className="custom-modal"
        >
          {" "}
          <IonCard
            color="primary"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          >
            <div>
              <IonCardTitle
                color="tertiary"
                className="ion-text-center"
                style={{ paddingBottom: "1rem", paddingTop: "1rem" }}
              >
                "{cardSelNome}"
              </IonCardTitle>
            </div>
            <div className="ion-text-center">
              <IonButton
                onClick={() => redEditarGrimorio(cardSel)}
                color="warning"
                fill="clear"
              >
                <IonIcon slot="start" icon={pencil} />
                <IonLabel>Editar</IonLabel>
              </IonButton>
            </div>
            <div className="ion-text-center">
              <IonButton
                onClick={() => retirarGrimorio(cardSel)}
                color="danger"
                fill="clear"
              >
                <IonIcon slot="start" icon={trash} />
                <IonLabel>Deletar</IonLabel>
              </IonButton>
            </div>
          </IonCard>
        </IonModal>
        <IonToast
          color={corToast}
          isOpen={mostraMensagem}
          message={toastTexto}
          onDidDismiss={() => defMostraMensagem(false)}
          duration={2000}
        ></IonToast>
        <BotaoAdicionarItem caminho="/EditorDeGrimorio" />
        {carregamento ? <CirculoCarregamento /> : null}
      </IonContent>
      <BarraInferior />
    </IonPage>
  );
};

export default ListaGrimorios;
