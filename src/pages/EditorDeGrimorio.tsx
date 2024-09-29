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
  camera,
  closeCircle,
  copy,
  eye,
  filter,
  flame,
  pencil,
  remove,
  save,
  search,
  trash,
} from "ionicons/icons";
import CirculoCarregamento from "../components/CirculoDeCarregamento";
import BarraInferior from "../components/BarraInferiorControles";
import usaSQLiteDB from "../composables/usaSQLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useHistory, useLocation } from "react-router";
import BotaoAdicionarItem from "../components/BotaoAdicionar";
import grimorioBase from "../assets/grimoiro-base.png";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

const EditorDeGrimorio: React.FC = () => {
  const [carregamento, defCarregamento] = useState<boolean>(false);
  const [mostraMensagem, defMostraMensagem] = useState<boolean>(false);

  const [corToast, defCorToast] = useState<string>("");
  const [toastTexto, defToastTexto] = useState<string>("");

  const { executarAcaoSQL, iniciado } = usaSQLiteDB();

  const [nome, defNome] = useState<string>("");
  const [usuario, defUsuario] = useState<string>("");
  const [foto, defFoto] = useState<string>("");

  const navegar = useHistory();

  const url = useLocation();
  const parametros = new URLSearchParams(url.search);
  const idGrimorio = parametros.get("idGrimorio");

  useEffect(() => {
    buscaDados();
  }, [iniciado]);

  const buscaDados = async () => {
    if (idGrimorio) {
      let comandoSQL = `SELECT 
        NOME, USUARIO, FOTO FROM GRIMORIO WHERE ID = ${idGrimorio}`;

      try {
        defCarregamento(true);
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          console.log(comandoSQL);
          const resultado = await db?.query(comandoSQL);
          if (resultado && resultado.values) {
            console.log(resultado.values?.[0].FOTO);
            console.log(resultado.values?.[0].USUARIO);
            console.log(resultado.values?.[0].NOME);
            defFoto(resultado.values?.[0].FOTO);
            defNome(resultado.values?.[0].NOME);
            defUsuario(resultado.values?.[0].USUARIO);
          }
        });
      } catch (erro) {
        console.error(erro);
      } finally {
        defCarregamento(false);
      }
    }
  };

  const filtraDados = () => {
    buscaDados();
  };

  const capNome = (valor: any) => {
    console.log("Nome: " + valor.detail.value);
    defNome(valor.detail.value);
  };

  const capUsuario = (valor: any) => {
    console.log("Usuario: " + valor.detail.value);
    defUsuario(valor.detail.value);
  };

  const cadGrimorio = async () => {
    console.log(foto ? foto : grimorioBase, nome, usuario);
    let comandoSQL = "";
    let array = [];
    if (idGrimorio) {
      comandoSQL = `
    INSERT OR REPLACE INTO GRIMORIO (ID, NOME, USUARIO, FOTO) VALUES (?, ?, ?, ?) `;
      array = [idGrimorio, nome, usuario, foto ? foto : grimorioBase];
    } else {
      comandoSQL = `
    INSERT INTO GRIMORIO (NOME, USUARIO, FOTO) VALUES (?, ?, ?) 
    `;
      array = [nome, usuario, foto ? foto : grimorioBase];
    }

    if (nome && usuario) {
      let ultimoId = "";
      try {
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          console.log(comandoSQL, array);
          await db?.query(comandoSQL, array);

          const resultado = await db?.query("SELECT last_insert_rowid() AS ID");
          if (resultado && resultado.values && resultado.values.length > 0) {
            ultimoId = resultado?.values?.[0].ID;
          }
        });
      } catch (erro) {
        console.error(erro);
      } finally {
        if (idGrimorio) {
          defCorToast("warning");
          defToastTexto(`Grimorio '${nome}' alterado com sucesso!`);
          defMostraMensagem(true);
        } else {
          defCorToast("success");
          defToastTexto(`Grimorio '${nome}' criado com sucesso!`);
          defMostraMensagem(true);
          navegar.replace(`/EditorDeGrimorio?idGrimorio=${ultimoId}`);
          location.reload();
        }
      }
    } else {
      const dadosFaltando = [];

      switch (true) {
        case !nome:
          dadosFaltando.push("(Nome)");
        case !usuario:
          dadosFaltando.push("(Usuario)");
      }

      defCorToast("danger");
      defToastTexto("DADOS OBRIGATÓRIOS FALTANDO: " + dadosFaltando.join(", "));
      defMostraMensagem(true);
    }
  };

  const capturarImg = async () => {
    try {
      const imagem = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      const fotoBase64 = imagem.base64String;
      if (fotoBase64) {
        const base64Url = `data:image/jpeg;base64,${fotoBase64}`;
        defFoto(base64Url);
      }
    } catch (erro) {
      console.error(erro);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <BarraSuperior icone={book} titulo={"Grimórios"} />
      </IonHeader>
      <IonContent color="tertiary">
        {!carregamento ? (
          <IonCard color="secondary">
            <IonGrid>
              <IonCardHeader style={{ padding: "0px" }}>
                <IonRow className="ion-justify-content-center">
                  <IonCol size="auto">
                    <IonItem lines="none" color="secondary">
                      <IonImg
                        style={{ height: "8rem", width: "8rem" }}
                        src={foto ? foto : grimorioBase}
                      ></IonImg>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-justify-content-center">
                  <IonCol onClick={capturarImg} size="auto">
                    <IonItem lines="none" color="secondary">
                      <IonButton>
                        <IonIcon icon={camera} />
                      </IonButton>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonCardHeader>
              <IonCardContent style={{ padding: "0px" }}>
                <IonRow>
                  <IonCol>
                    <IonItem
                      className="ion-text-center"
                      lines="none"
                      color="secondary"
                    >
                      <IonInput
                        onIonInput={capNome}
                        value={nome}
                        color="primary"
                        labelPlacement="floating"
                        label="Nome"
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem
                      className="ion-text-center"
                      lines="none"
                      color="secondary"
                    >
                      <IonInput
                        onIonInput={capUsuario}
                        value={usuario}
                        color="primary"
                        labelPlacement="floating"
                        label="Usuário"
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-justify-content-center">
                  <IonCol onClick={cadGrimorio} size="auto">
                    <IonButton>
                      <IonIcon slot="start" icon={save}></IonIcon>
                      <IonLabel>
                        {idGrimorio ? "Editar Grimório" : "Criar Grimório"}
                      </IonLabel>
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonGrid>
          </IonCard>
        ) : null}

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

export default EditorDeGrimorio;
