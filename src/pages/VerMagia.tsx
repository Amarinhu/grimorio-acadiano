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
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonRow,
  IonToast,
} from "@ionic/react";
import { book, copy, eye, flame, pencil, search, trash } from "ionicons/icons";
import CirculoCarregamento from "../components/CirculoDeCarregamento";
import BarraInferior from "../components/BarraInferiorControles";
import usaSQLiteDB from "../composables/usaSQLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useHistory, useLocation } from "react-router";
import { createGesture, Gesture } from "@ionic/react";

type Magia = {
  NOME: string;
  ALVO: string;
  NOMEVERDADEIRO: string;
  NOMEALTERNATIVO: string;
  MAGIA_DESCRICAO: string;
  MAGIA_MECANICA: string;
  OBSAREA?: string | null;
  OBSRESISTENCIA?: string | null;
  OUTRONATUREZA?: string | null;
  OUTRORESISTENCIA?: string | null;
  OUTRODURACAO?: string | null;
  OUTROALCANCE?: string | null;
  OUTROEXECUCAO?: string | null;
  OUTROESCOLA?: string | null;
  OUTRONIVEL?: string | null;
  OUTROMANA?: string | null;
  MANA_DESCRICAO: string;
  MANA_ID: number;
  MANA_ICONE?: string | null;
  NIVEL_DESCRICAO: string;
  NIVEL_ID: number;
  NATUREZA_DESCRICAO: string;
  NATUREZA_ICONE?: string | null;
  NATUREZA_ID: number;
  ESCOLA_DESCRICAO: string;
  ESCOLA_ICONE?: string | null;
  ESCOLA_ID: number;
  EXECUCAO_DESCRICAO: string;
  EXECUCAO_ID: number;
  ALCANCE_DESCRICAO: string;
  ALCANCE_ID: number;
  AREA_DESCRICAO: string;
  AREA_ID: number;
  DURACAO_DESCRICAO: string;
  DURACAO_ID: number;
  RESISTENCIA_DESCRICAO: string;
  RESISTENCIA_ID: number;
  MAGIA_ORIGEM: string;
  MAGIA_ORIGEMSIGLA: string;
};

const Grimorio: React.FC = () => {
  const [carregamento, defCarregamento] = useState<boolean>(false);
  const [mostraMensagem, defMostraMensagem] = useState<boolean>(false);
  const [telaCorPrimaria, defTelaCorPrimaria] = useState<string>("secondary");
  const [telaCorSecundaria, defTelaCorSecundaria] = useState<string>("primary");
  const [telaCorTerciaria, defTelaCorTerciaria] = useState<string>("tertiary");

  const { executarAcaoSQL, iniciado } = usaSQLiteDB();

  const [aprimoramento, defAprimoramento] = useState<Array<any>>([]);

  const [magiaSelecionada, defMagiaSelecionada] = useState<Magia | null>();

  const url = useLocation();
  const parametros = new URLSearchParams(url.search);
  const idMagia = parametros.get("idMagia");

  useEffect(() => {
    if (idMagia) {
      defCarregamento(true);
      const carregaVerDados = async () => {
        const comandoSQL = `SELECT 
            MAGIA.NOME,
            MAGIA.ALVO,
            MAGIA.NOMEVERDADEIRO,
            MAGIA.NOMEALTERNATIVO,
            MAGIA.DESCRICAO AS MAGIA_DESCRICAO,
            MAGIA.MECANICA AS MAGIA_MECANICA,
            MAGIA.OBSAREA AS OBSAREA,
            MAGIA.OBSRESISTENCIA AS OBSRESISTENCIA,
            MAGIA.OUTRONATUREZA,
            MAGIA.OUTRORESISTENCIA,
            MAGIA.OUTRODURACAO,
            MAGIA.OUTROALCANCE,
            MAGIA.OUTROEXECUCAO,
            MAGIA.OUTROESCOLA,
            MAGIA.OUTRONATUREZA,
            MAGIA.OUTRONIVEL,
            MAGIA.OUTROMANA,
            MANA.DESCRICAO AS MANA_DESCRICAO,
            MANA.ID AS MANA_ID,
            MANA.ICONE AS MANA_ICONE,
            NIVEL.NIVEL AS NIVEL_DESCRICAO,
            NIVEL.ID AS NIVEL_ID,
            NATUREZA.DESCRICAO AS NATUREZA_DESCRICAO,
            NATUREZA.ICONE AS NATUREZA_ICONE,
            NATUREZA.ID AS NATUREZA_ID,
            ESCOLA.DESCRICAO AS ESCOLA_DESCRICAO,
            ESCOLA.ICONE AS ESCOLA_ICONE,
            ESCOLA.ID AS ESCOLA_ID,
            EXECUCAO.DESCRICAO AS EXECUCAO_DESCRICAO,
            EXECUCAO.ID AS EXECUCAO_ID,
            ALCANCE.DESCRICAO AS ALCANCE_DESCRICAO,
            ALCANCE.ID AS ALCANCE_ID,
            AREA.DESCRICAO AS AREA_DESCRICAO,
            AREA.ID AS AREA_ID,
            DURACAO.DESCRICAO AS DURACAO_DESCRICAO,
            DURACAO.ID AS DURACAO_ID,
            RESISTENCIA.DESCRICAO AS RESISTENCIA_DESCRICAO,
            RESISTENCIA.ID AS RESISTENCIA_ID,
            MAGIA.ORIGEM AS MAGIA_ORIGEM,
            MAGIA.ORIGEMSIGLA AS MAGIA_ORIGEMSIGLA
              FROM 
                  MAGIA
              INNER JOIN MANA ON MAGIA.ID_MANA = MANA.ID
              INNER JOIN NIVEL ON MAGIA.ID_NIVEL = NIVEL.ID
              INNER JOIN NATUREZA ON MAGIA.ID_NATUREZA = NATUREZA.ID
              INNER JOIN ESCOLA ON MAGIA.ID_ESCOLA = ESCOLA.ID
              INNER JOIN EXECUCAO ON MAGIA.ID_EXECUCAO = EXECUCAO.ID
              INNER JOIN ALCANCE ON MAGIA.ID_ALCANCE = ALCANCE.ID
              INNER JOIN AREA ON MAGIA.ID_AREA = AREA.ID
              INNER JOIN DURACAO ON MAGIA.ID_DURACAO = DURACAO.ID
              INNER JOIN RESISTENCIA ON MAGIA.ID_RESISTENCIA = RESISTENCIA.ID
            WHERE MAGIA.ID = ${idMagia} `;

        const comandoSQLAprim = `
            SELECT * FROM APRIMORAMENTO WHERE ID_MAGIA = ${idMagia}`;

        try {
          let resultado: { values: any[] } | undefined;
          await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
            resultado = (await db?.query(comandoSQL)) as {
              values: any[];
            };
          });
          if (resultado && resultado.values && resultado.values.length > 0) {
            defMagiaSelecionada(resultado.values?.[0]);
            definirCoresMana(resultado.values?.[0].MANA_ID);
            console.log(resultado.values?.[0]);
          }

          let resultadoAprim: { values: any[] } | undefined;
          await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
            resultadoAprim = (await db?.query(comandoSQLAprim)) as {
              values: any[];
            };
          });
          if (
            resultadoAprim &&
            resultadoAprim.values &&
            resultadoAprim.values.length > 0
          ) {
            defAprimoramento(resultadoAprim.values);
            console.log(resultadoAprim.values);
          }
        } catch (erro) {
          console.error(erro);
        } finally {
          defCarregamento(false);
        }
      };

      carregaVerDados();
    }
  }, [iniciado]);

  const definirCoresMana = (valor: number) => {
    switch (valor) {
      case 1:
        defTelaCorPrimaria("vermelhosecundario");
        defTelaCorSecundaria("vermelhoprimario");
        defTelaCorTerciaria("vermelhoterciario");
        break;
      case 2:
        defTelaCorPrimaria("pretosecundario");
        defTelaCorSecundaria("pretoprimario");
        defTelaCorTerciaria("pretoterciario");
        break;
      case 3:
        defTelaCorPrimaria("brancosecundario");
        defTelaCorSecundaria("brancoprimario");
        defTelaCorTerciaria("brancoterciario");
        break;
      case 4:
        defTelaCorPrimaria("verdesecundario");
        defTelaCorSecundaria("verdeprimario");
        defTelaCorTerciaria("verdeterciario");
        break;
      case 5:
        defTelaCorPrimaria("azulsecundario");
        defTelaCorSecundaria("azulprimario");
        defTelaCorTerciaria("azulterciario");
        break;
      case 6:
        defTelaCorPrimaria("roxosecundario");
        defTelaCorSecundaria("roxoprimario");
        defTelaCorTerciaria("roxoterciario");
        break;
      default:
        defTelaCorPrimaria("secondary");
        defTelaCorSecundaria("primary");
        defTelaCorTerciaria("tertiary");
        break;
    }
  };

  const teste = () => {
    console.log(telaCorPrimaria);
    console.log(telaCorSecundaria);
    console.log(telaCorTerciaria);
    definirCoresMana(4);
  };

  return (
    <IonPage>
      <IonHeader>
        <BarraSuperior
          corBarra={telaCorSecundaria}
          icone={eye}
          titulo={"Grimório"}
        />
      </IonHeader>
      <IonContent color={telaCorTerciaria}>
        {/*<IonButton onClick={teste}>TESTE</IonButton>*/}

        {!carregamento ? (
          <IonCard style={{ paddingTop: "1.5rem" }} color={telaCorSecundaria}>
            <IonCardTitle
              style={{ fontWeight: "bold", fontSize: "1.5rem" }}
              className="ion-text-center"
            >
              {magiaSelecionada && magiaSelecionada.MANA_ID !== 999
                ? `${magiaSelecionada.MANA_ICONE} `
                : `[${magiaSelecionada?.OUTROMANA}] `}
              {magiaSelecionada ? magiaSelecionada.NOME : null}
            </IonCardTitle>
            <br></br>
            <IonCardTitle className="ion-text-center">
              {magiaSelecionada && magiaSelecionada.NATUREZA_ID !== 999
                ? `${magiaSelecionada.NATUREZA_ICONE} ${magiaSelecionada.NATUREZA_DESCRICAO} `
                : `${magiaSelecionada?.OUTRONATUREZA} `}
              {magiaSelecionada && magiaSelecionada.NIVEL_ID !== 999
                ? `${magiaSelecionada.NIVEL_DESCRICAO} (${magiaSelecionada.ESCOLA_ICONE} ${magiaSelecionada.ESCOLA_DESCRICAO})`
                : `${magiaSelecionada?.OUTRONIVEL} (${magiaSelecionada?.OUTROESCOLA})`}
            </IonCardTitle>
            <IonCardContent>
              <IonGrid style={{ padding: "0px" }}>
                <IonRow>
                  <IonCol style={{ padding: "0px" }}>
                    {magiaSelecionada &&
                    magiaSelecionada.EXECUCAO_DESCRICAO &&
                    magiaSelecionada.EXECUCAO_DESCRICAO !== "" ? (
                      <div>
                        <strong>Execução: </strong>
                        {magiaSelecionada &&
                        magiaSelecionada.EXECUCAO_ID !== 999
                          ? `${magiaSelecionada.EXECUCAO_DESCRICAO}`
                          : `${magiaSelecionada.OUTROEXECUCAO}`}
                      </div>
                    ) : null}
                    {magiaSelecionada &&
                    magiaSelecionada.ALCANCE_DESCRICAO &&
                    magiaSelecionada.ALCANCE_DESCRICAO !== "" ? (
                      <div>
                        <strong>Alcance: </strong>
                        {magiaSelecionada && magiaSelecionada.ALCANCE_ID !== 999
                          ? `${magiaSelecionada.ALCANCE_DESCRICAO}`
                          : `${magiaSelecionada.OUTROALCANCE}`}
                      </div>
                    ) : null}{" "}
                    {magiaSelecionada &&
                    magiaSelecionada.ALVO &&
                    magiaSelecionada.ALVO !== "" ? (
                      <div>
                        <strong>Alvos: </strong>
                        {magiaSelecionada.ALVO}
                      </div>
                    ) : null}{" "}
                    {magiaSelecionada &&
                    magiaSelecionada.AREA_ID !== 998 &&
                    magiaSelecionada.AREA_DESCRICAO &&
                    magiaSelecionada.AREA_DESCRICAO !== "" ? (
                      <div>
                        <strong>Área: </strong>
                        {magiaSelecionada && magiaSelecionada.AREA_ID !== 999
                          ? `${magiaSelecionada.AREA_DESCRICAO} ${magiaSelecionada.OBSAREA}`
                          : `${magiaSelecionada.OBSAREA}`}
                      </div>
                    ) : null}{" "}
                    {magiaSelecionada &&
                    magiaSelecionada.DURACAO_ID !== 998 &&
                    magiaSelecionada.DURACAO_DESCRICAO &&
                    magiaSelecionada.DURACAO_DESCRICAO !== "" ? (
                      <div>
                        <strong>Duração: </strong>
                        {magiaSelecionada && magiaSelecionada.DURACAO_ID !== 999
                          ? `${magiaSelecionada.DURACAO_DESCRICAO}`
                          : `${magiaSelecionada.OUTRODURACAO}`}
                      </div>
                    ) : null}{" "}
                    {magiaSelecionada &&
                    magiaSelecionada.RESISTENCIA_ID !== 998 &&
                    magiaSelecionada.RESISTENCIA_DESCRICAO &&
                    magiaSelecionada.RESISTENCIA_DESCRICAO !== "" ? (
                      <div>
                        <strong>Resistência: </strong>
                        {magiaSelecionada &&
                        magiaSelecionada.RESISTENCIA_ID !== 999
                          ? `${magiaSelecionada.RESISTENCIA_DESCRICAO} ${magiaSelecionada.OBSRESISTENCIA}`
                          : `${magiaSelecionada.OUTRORESISTENCIA} ${magiaSelecionada.OBSRESISTENCIA}`}
                      </div>
                    ) : null}{" "}
                  </IonCol>
                </IonRow>
                {magiaSelecionada && magiaSelecionada.MAGIA_DESCRICAO !== "" ? (
                  <IonRow>
                    <IonCol>
                      <strong>Descrição: </strong>
                      {magiaSelecionada.MAGIA_DESCRICAO}
                    </IonCol>
                  </IonRow>
                ) : null}
                {magiaSelecionada && magiaSelecionada.MAGIA_MECANICA !== "" ? (
                  <IonRow>
                    <IonCol>
                      <strong>Mecânica: </strong>
                      {magiaSelecionada.MAGIA_MECANICA}
                    </IonCol>
                  </IonRow>
                ) : null}
                {aprimoramento.map((valor, indice) => (
                  <IonRow key={indice}>
                    <IonCol>
                      <strong>
                        +{aprimoramento?.[indice]?.CUSTO || null} PM :{" "}
                      </strong>
                      {aprimoramento?.[indice]?.DESCRICAO || null}{" "}
                    </IonCol>
                  </IonRow>
                ))}
                {magiaSelecionada && magiaSelecionada.NOMEALTERNATIVO ? (
                  <IonRow>
                    <IonCol>
                      <strong>Nomes Alternativos:</strong>{" "}
                      {magiaSelecionada.NOMEALTERNATIVO}
                    </IonCol>
                  </IonRow>
                ) : null}
                {magiaSelecionada && magiaSelecionada.NOMEVERDADEIRO ? (
                  <IonRow>
                    <IonCol>
                      <strong>Nome Verdadeiro:</strong>{" "}
                      {magiaSelecionada.NOMEVERDADEIRO}
                    </IonCol>
                  </IonRow>
                ) : null}
                {magiaSelecionada ? (
                  <IonRow>
                    <IonCol>
                      <strong>Origem:</strong>{" "}
                      {magiaSelecionada.MAGIA_ORIGEMSIGLA
                        ? magiaSelecionada.MAGIA_ORIGEMSIGLA
                        : null}{" "}
                      {magiaSelecionada.MAGIA_ORIGEM
                        ? `- ${magiaSelecionada.MAGIA_ORIGEM}`
                        : null}
                    </IonCol>
                  </IonRow>
                ) : null}
              </IonGrid>
            </IonCardContent>
          </IonCard>
        ) : null}

        {carregamento ? <CirculoCarregamento /> : null}
      </IonContent>
    </IonPage>
  );
};

export default Grimorio;
