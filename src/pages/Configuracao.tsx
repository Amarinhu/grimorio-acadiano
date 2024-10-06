import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import usaSQLiteDB from "../composables/usaSQLiteDB";
import TituloBotaoVoltar from "../components/BarraSuperior";
import armazenamento from "../armazenamento";
import CirculoCarregamento from "../components/CirculoDeCarregamento";
import magiasJson from "../json/magias.json";
import {
  bug,
  build,
  closeCircle,
  cloudUpload,
  cog,
  navigateSharp,
  reloadCircle,
  server,
  serverOutline,
  trash,
  trashBin,
  warning,
} from "ionicons/icons";
import { useHistory } from "react-router";

const AssistenteDev: React.FC = () => {
  const [BancoItens, definirBancoItens] = useState<Array<any>>();
  const [estadoCarregamento, definirCarregamento] = useState(false);
  const { executarAcaoSQL, iniciado } = usaSQLiteDB();

  const navegar = useHistory();

  const tabelas = [
    "MAGIAGRIMORIO",
    "APRIMORAMENTO",
    "MAGIA",
    "EXECUCAO",
    "ALCANCE",
    "DURACAO",
    "RESISTENCIA",
    "MANA",
    "NIVEL",
    "NATUREZA",
    "ESCOLA",
    "ALVO",
    "AREA",
    "GRIMORIO",
  ];

  useEffect(() => {
    carregaDados();
  }, [iniciado]);

  const recarregarPagina = () => {
    location.reload();
  };

  const carregaDados = async () => {
    try {
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        /*const respostaSQLSelect = await db?.query(respostaTarefasQuery);*/
        /*definirBancoItens(respostaSQLSelect?.values);*/
      });
    } catch (erro) {
      console.log(erro);
      definirBancoItens([]);
    }
  };

  const baixaMagiasT20 = async () => {
    definirCarregamento(true);
    try {
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        const comandoSQLDelAprim = `DELETE FROM APRIMORAMENTO 
        WHERE ID_MAGIA IN (SELECT ID FROM MAGIA WHERE ID_SINCRONISMO BETWEEN 1 AND 204);`;
        const comandoSQLdel = `DELETE FROM MAGIA WHERE ID_SINCRONISMO BETWEEN 1 AND 204;`;
        await db?.query(comandoSQLDelAprim);
        await db?.query(comandoSQLdel);
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      try {
        /*const resposta = await fetch("https://locahost/magias");

      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`);
      }
      const dadosAPI = await resposta.json();
      console.log(dadosAPI);*/
        const dadosAPI = magiasJson;

        if (dadosAPI.length > 0) {
          for (const dado of dadosAPI) {
            const comandoSQL = `
          INSERT OR REPLACE INTO MAGIA (
        ID_MANA, OUTROMANA, ID_NIVEL, OUTRONIVEL, 
        ID_NATUREZA, OUTRONATUREZA, ID_ESCOLA, OUTROESCOLA, 
        ID_EXECUCAO, OUTROEXECUCAO, ALVO, ID_AREA, 
        OBSAREA, ID_ALCANCE, OUTROALCANCE, ID_DURACAO, 
        OUTRODURACAO, ID_RESISTENCIA, OUTRORESISTENCIA, OBSRESISTENCIA, 
        DESCRICAO, MECANICA, NOMEALTERNATIVO, NOMEVERDADEIRO, NOME, 
        EFEITO, ORIGEM, ORIGEMSIGLA, ID_SINCRONISMO
          ) 
          VALUES
              (?, ?, ?, ?, 
              ?, ?, ?, ?, 
              ?, ?, ?, ?, 
              ?, ?, ?, ?, 
              ?, ?, ?, ?, 
              ?, ?, ?, ?, ?, 
              ?, ?, ?, ?); `;
            const execucaoTratado =
              dado.EXECUCAO_ID == 999 ? dado.OUTROEXECUCAO : "";
            const alcanceTratado =
              dado.ALCANCE_ID == 999 ? dado.OUTROALCANCE : "";
            const duracaoTratado =
              dado.DURACAO_ID == 999 ? dado.OUTRODURACAO : "";
            const dadosSQL: any = [
              dado.MANA_ID,
              "",
              dado.NIVEL_ID,
              "",
              dado.NATUREZA_ID,
              "",
              dado.ESCOLA_ID,
              "",
              dado.EXECUCAO_ID,
              execucaoTratado,
              dado.ALVO,
              dado.AREA_ID,
              dado.OBSAREA,
              dado.ALCANCE_ID,
              alcanceTratado,
              dado.DURACAO_ID,
              duracaoTratado,
              dado.RESISTENCIA_ID,
              "",
              dado.OBSRESISTENCIA,
              "",
              dado.MAGIA_MECANICA,
              dado.NOMEALTERNATIVO,
              dado.NOMEVERDADEIRO,
              dado.NOME,
              dado.MAGIA_EFEITO,
              dado.MAGIA_ORIGEM,
              dado.MAGIA_ORIGEMSIGLA,
              dado.ID_SINCRONISMO,
            ];

            await executarAcaoSQL(
              async (db: SQLiteDBConnection | undefined) => {
                console.log(comandoSQL, dadosSQL);
                await db?.query(comandoSQL, dadosSQL);

                const resultadoID: any = await db?.query(
                  "SELECT last_insert_rowid() AS ID"
                );

                console.log(resultadoID);

                if (dado.APRIMORAMENTO.length > 0) {
                  for (const aprimoramento of dado.APRIMORAMENTO) {
                    const comandoSQLAprim = `INSERT OR REPLACE INTO APRIMORAMENTO
                (ID_MAGIA, CUSTO, DESCRICAO, TRUQUE) VALUES (?,?,?,?) `;
                    const arrayAprim = [
                      resultadoID.values?.[0].ID,
                      aprimoramento.CUSTO,
                      aprimoramento.DESCRICAO,
                      null,
                    ];
                    console.log(comandoSQLAprim, arrayAprim);
                    await db?.query(comandoSQLAprim, arrayAprim);
                  }
                }
              }
            );
          }
        }
      } catch (error) {
        console.error("Erro capturando dados:", error);
      } finally {
        definirCarregamento(false);
        navegar.replace("/");
      }
    }
  };

  return (
    <IonPage>
      <TituloBotaoVoltar titulo="Configuração" icone={cog} />
      {estadoCarregamento ? (
        <IonToolbar color="warning" className="ion-text-center">
          {" "}
          <IonText>
            <strong>Aguarde. Por gentileza...</strong>
          </IonText>
        </IonToolbar>
      ) : null}

      <IonContent color="tertiary">
        {estadoCarregamento ? <CirculoCarregamento /> : null}
        <IonCard color="secondary">
          <IonCardContent>
            <IonButtons>
              <IonButton onClick={baixaMagiasT20}>
                <IonIcon
                  slot="start"
                  className="icon-large"
                  icon={cloudUpload}
                ></IonIcon>
                <IonLabel>Baixar Magias do Livro T20</IonLabel>
              </IonButton>
            </IonButtons>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AssistenteDev;
