import { useEffect, useState } from "react";
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
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonToast,
} from "@ionic/react";
import { flame, home, pencil, text } from "ionicons/icons";
import CirculoCarregamento from "../components/CirculoDeCarregamento";
import BarraInferior from "../components/BarraInferiorControles";
import usaSQLiteDB from "../composables/usaSQLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import BotaoAdicionarItem from "../components/BotaoAdicionar";
import { useHistory } from "react-router";

const ListaMagia: React.FC = () => {
  const [carregamento, defCarregamento] = useState<boolean>(false);
  const [mostraMensagem, defMostraMensagem] = useState<boolean>(false);
  const [texto, definirTexto] = useState<string>("");

  const [magiaItens, defMagiaItens] = useState<Array<any>>([]);
  const { executarAcaoSQL, iniciado, iniciaTabelas } = usaSQLiteDB();
  const navegar = useHistory();

  useEffect(() => {
    const buscaDados = async () => {
      const comandoSQL = `SELECT 
        MAGIA.ID,
        MANA.ID AS MANA_ID,
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
        MANA.ICONE AS MANA_ICONE,
        NIVEL.ID AS NIVEL_ID,
        NIVEL.NIVEL AS NIVEL_DESCRICAO,
        NATUREZA.ID AS NATUREZA_ID,
        NATUREZA.DESCRICAO AS NATUREZA_DESCRICAO,
        NATUREZA.ICONE AS NATUREZA_ICONE,
        ESCOLA.ID AS ESCOLA_ID,
        ESCOLA.DESCRICAO AS ESCOLA_DESCRICAO,
        ESCOLA.ICONE AS ESCOLA_ICONE,
        EXECUCAO.ID AS EXECUCAO_ID,
        EXECUCAO.DESCRICAO AS EXECUCAO_DESCRICAO,
        ALCANCE.ID AS ALCANCE_ID,
        ALCANCE.DESCRICAO AS ALCANCE_DESCRICAO,
        AREA.ID AS AREA_ID,
        AREA.DESCRICAO AS AREA_DESCRICAO,
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
          INNER JOIN RESISTENCIA ON MAGIA.ID_RESISTENCIA = RESISTENCIA.ID;
          `;
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        const resultado = await db?.query(comandoSQL);
        if (resultado && resultado.values && resultado.values.length > 0) {
          defMagiaItens(resultado?.values);
        }
        console.log(resultado);
      });
    };
    buscaDados();
  }, [iniciado]);

  const funcao = () => {
    defMostraMensagem(true);
  };

  const capturaTexto = (evento: CustomEvent) => {
    const elementoHtml = evento.target as HTMLInputElement;
    const valor = elementoHtml.value;
    definirTexto(valor);
  };

  const onOffCarregamento = () => {
    if (carregamento == false) {
      defCarregamento(true);
    } else {
      defCarregamento(false);
    }
  };

  const defCorCard = (valor: number) => {
    let corPrimaria = "";
    let corSecundaria = "";
    let corTerciaria = "";
    switch (valor) {
      case 1:
        corPrimaria = "vermelhosecundario";
        corSecundaria = "vermelhoprimario";
        corTerciaria = "vermelhoterciario";
        break;
      case 2:
        corPrimaria = "pretosecundario";
        corSecundaria = "pretoprimario";
        corTerciaria = "pretoterciario";
        break;
      case 3:
        corPrimaria = "brancosecundario";
        corSecundaria = "brancoprimario";
        corTerciaria = "brancoterciario";
        break;
      case 4:
        corPrimaria = "verdesecundario";
        corSecundaria = "verdeprimario";
        corTerciaria = "verdeterciario";
        break;
      case 5:
        corPrimaria = "azulsecundario";
        corSecundaria = "azulprimario";
        corTerciaria = "azulterciario";
        break;
      case 6:
        corPrimaria = "roxosecundario";
        corSecundaria = "roxoprimario";
        corTerciaria = "roxoterciario";
        break;
      default:
        corPrimaria = "secondary";
        corSecundaria = "primary";
        corTerciaria = "tertiary";
        break;
    }

    return {
      corPrimaria: corPrimaria,
      corSecundaria: corSecundaria,
      corTerciaria: corTerciaria,
    };
  };

  const redEdicaoMagia = () => {
    /*navegar.push("/EdicaoMagia");*/
  };

  return (
    <IonPage>
      <IonHeader>
        <BarraSuperior icone={flame} titulo={"Magias"} />
      </IonHeader>
      <IonContent color="tertiary">
        {magiaItens.map((magia) => (
          <IonCard
            key={magia.ID}
            color={defCorCard(magia.MANA_ID).corSecundaria}
          >
            <IonCardHeader>
              <IonCardTitle>
                <IonRow>
                  <IonCol size="10">
                    {magia.MANA_ID !== 999
                      ? magia.MANA_ICONE
                      : `[${magia.OUTROMANA}]`}{" "}
                    {magia.NOME}
                  </IonCol>
                  <IonCol
                    onClick={redEdicaoMagia}
                    className="ion-text-center"
                    size="2"
                  >
                    <IonIcon icon={pencil} />
                  </IonCol>
                </IonRow>
              </IonCardTitle>
              <IonCardSubtitle>
                <IonRow>
                  <IonCol size="10">
                    {" "}
                    {magia.NATUREZA_ID !== 999
                      ? magia.NATUREZA_ICONE
                      : null}{" "}
                    {magia.NATUREZA_ID !== 999
                      ? magia.NATUREZA_DESCRICAO
                      : magia.OUTRONATUREZA}{" "}
                    {magia.NIVEL_ID !== 999
                      ? magia.NIVEL_DESCRICAO
                      : magia.OUTRONIVEL}{" "}
                    ({magia.ESCOLA_ID !== 999 ? magia.ESCOLA_ICONE : null}{" "}
                    {magia.ESCOLA_ID !== 999
                      ? magia.ESCOLA_DESCRICAO
                      : magia.OUTROESCOLA}
                    )
                  </IonCol>
                  <IonCol className="ion-text-center" size="2">
                    <strong>{magia.MAGIA_ORIGEMSIGLA}</strong>
                  </IonCol>
                </IonRow>
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p style={{ paddingBottom: "0.3rem" }}>
                {magia.EXECUCAO_DESCRICAO && magia.EXECUCAO_DESCRICAO !== "" ? (
                  <>
                    <strong>Execução:</strong>{" "}
                    {magia.EXECUCAO_ID !== 999
                      ? magia.EXECUCAO_DESCRICAO
                      : magia.OUTROEXECUCAO}
                    ;{" "}
                  </>
                ) : null}
                {magia.ALCANCE_DESCRICAO && magia.ALCANCE_DESCRICAO !== "" ? (
                  <>
                    <strong>Alcance:</strong>{" "}
                    {magia.ALCANCE_ID !== 999
                      ? magia.ALCANCE_DESCRICAO
                      : magia.OUTROALCANCE}
                    ;{" "}
                  </>
                ) : null}
                {magia.ALVO && magia.ALVO !== "" ? (
                  <>
                    <strong>Alvo:</strong> {magia.ALVO};{" "}
                  </>
                ) : null}
                {magia.AREA_DESCRICAO &&
                magia.AREA_DESCRICAO !== "" &&
                magia.AREA_ID !== 998 ? (
                  <>
                    <strong>Area: </strong>{" "}
                    {magia.AREA_ID !== 999 ? magia.AREA_DESCRICAO : null}{" "}
                    {magia.OBSAREA};{" "}
                  </>
                ) : null}
                {magia.DURACAO_DESCRICAO &&
                magia.DURACAO_DESCRICAO !== "" &&
                magia.DURACAO_ID !== 998 ? (
                  <>
                    <strong>Duração:</strong>{" "}
                    {magia.DURACAO_ID !== 999
                      ? magia.DURACAO_DESCRICAO
                      : magia.OUTRODURACAO}
                    ;{" "}
                  </>
                ) : null}
                {magia.RESISTENCIA_DESCRICAO &&
                magia.RESISTENCIA_DESCRICAO !== "" &&
                magia.RESISTENCIA_ID !== 998 ? (
                  <>
                    <strong>Resistência:</strong>{" "}
                    {magia.RESISTENCIA_ID !== 999
                      ? magia.RESISTENCIA_DESCRICAO
                      : magia.OUTRORESISTENCIA}{" "}
                    {magia.OBSRESISTENCIA};
                  </>
                ) : null}
              </p>
              <p>{magia.MAGIA_MECANICA}</p>
            </IonCardContent>
          </IonCard>
        ))}
        <IonToast
          isOpen={mostraMensagem}
          message={texto}
          onDidDismiss={() => defMostraMensagem(false)}
          duration={5000}
        ></IonToast>
        {carregamento ? <CirculoCarregamento /> : null}
      </IonContent>
      <BotaoAdicionarItem caminho="/CadastroMagia" />
      <BarraInferior />
    </IonPage>
  );
};

export default ListaMagia;
