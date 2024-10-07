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
  IonList,
  IonModal,
  IonPage,
  IonRow,
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
import { useHistory, useLocation } from "react-router";
import { createGesture, Gesture } from "@ionic/react";

const Grimorio: React.FC = () => {
  const [carregamento, defCarregamento] = useState<boolean>(false);
  const [mostraMensagem, defMostraMensagem] = useState<boolean>(false);

  const [qtdFiltro, defQtdFiltro] = useState<Array<number>>([0]);

  const [corToast, defCorToast] = useState<string>("");
  const [toastTexto, defToastTexto] = useState<string>("");

  const [mostraModalOpcoes, defMostraModalOpcoes] = useState(false);

  const [filtro, defFiltro] = useState<Array<any>>([]);
  const [magiaItens, defMagiaItens] = useState<Array<any>>([]);
  const { executarAcaoSQL, iniciado } = usaSQLiteDB();
  const navegar = useHistory();

  const url = useLocation();
  const parametros = new URLSearchParams(url.search);
  const idGrimorio = parametros.get("idGrimorio");

  const [modalSel, defModalSel] = useState<number>(0);
  const [mostraModalTipo, defMostraModalTipo] = useState(false);

  const [mostraFiltro, defMostraFiltro] = useState<boolean>(true);

  const tiposFiltro = [
    "Nome",
    "Mana",
    "Círculo",
    "Natureza",
    "Escola",
    "Execução",
    "Alvo",
    "Área",
    "Alcance",
    "Duração",
    "Resistência",
    "Descrição",
    "Mecânica",
    "Nomes Alternativos",
    "Nome Verdadeiro",
    "Origem",
  ];

  useEffect(() => {
    buscaDados();
  }, [iniciado]);

  const converteParaTabela = (tipo: string, valor: string) => {
    let tabelaTipo = [];
    let tabelaValor = [];
    switch (tipo) {
      case "Nome":
        tabelaTipo.push(" (MAGIA.NOME LIKE ?) ");
        tabelaValor.push(valor);
        break;
      case "Mana":
        tabelaTipo.push(" (MANA.DESCRICAO LIKE ? OR MAGIA.OUTROMANA LIKE ?) ");
        tabelaValor.push(valor, valor);
        break;
      case "Círculo":
        tabelaTipo.push(" (NIVEL.NIVEL LIKE ? OR MAGIA.OUTRONIVEL LIKE ?) ");
        tabelaValor.push(valor, valor);
        break;
      case "Natureza":
        tabelaTipo.push(
          " (NATUREZA.DESCRICAO LIKE ? OR MAGIA.OUTRONATUREZA LIKE ?) "
        );
        tabelaValor.push(valor, valor);
        break;
      case "Escola":
        tabelaTipo.push(
          " (ESCOLA.DESCRICAO LIKE ? OR MAGIA.OUTROESCOLA LIKE ?) "
        );
        tabelaValor.push(valor, valor);
        break;
      case "Execução":
        tabelaTipo.push(
          " (EXECUCAO.DESCRICAO LIKE ? OR MAGIA.OUTROEXECUCAO LIKE ?) "
        );
        tabelaValor.push(valor, valor);
        break;
      case "Alvo":
        tabelaTipo.push(" MAGIA.ALVO LIKE ? ");
        tabelaValor.push(valor);
        break;
      case "Área":
        tabelaTipo.push(" (AREA.DESCRICAO LIKE ? OR MAGIA.OUTROAREA LIKE ?) ");
        tabelaValor.push(valor, valor);
        break;
      case "Alcance":
        tabelaTipo.push(
          " (ALCANCE.DESCRICAO LIKE ? OR MAGIA.OUTROALCANCE LIKE ?) "
        );
        tabelaValor.push(valor, valor);
        break;
      case "Duração":
        tabelaTipo.push(
          " (DURACAO.DESCRICAO LIKE ? OR MAGIA.OUTRODURACAO LIKE ?) "
        );
        tabelaValor.push(valor, valor);
        break;
      case "Resistência":
        tabelaTipo.push(
          " (RESISTENCIA.DESCRICAO LIKE ? OR MAGIA.OUTRORESISTENCIA LIKE ?) "
        );
        tabelaValor.push(valor, valor);
        break;
      case "Descrição":
        tabelaTipo.push(" MAGIA.DESCRICAO LIKE ? ");
        tabelaValor.push(valor);
        break;
      case "Mecânica":
        tabelaTipo.push(" MAGIA.MECANICA LIKE ? ");
        tabelaValor.push(valor);
        break;
      case "Nomes Alternativos":
        tabelaTipo.push(" MAGIA.NOMEALTERNATIVO LIKE ? ");
        tabelaValor.push(valor);
        break;
      case "Nome Verdadeiro":
        tabelaTipo.push(" MAGIA.NOMEVERDADEIRO LIKE ? ");
        tabelaValor.push(valor);
        break;
      case "Origem":
        tabelaTipo.push(" (MAGIA.ORIGEM LIKE ? OR MAGIA.ORIGEMSIGLA LIKE ?) ");
        tabelaValor.push(valor, valor);
        break;
    }

    const retorno = [tabelaTipo, tabelaValor];

    return retorno;
  };

  const buscaDados = async () => {
    let comandoSQL = `SELECT 
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
      MAGIA.ORIGEMSIGLA AS MAGIA_ORIGEMSIGLA,
      MAGIA.EFEITO AS MAGIA_EFEITO
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
        INNER JOIN MAGIAGRIMORIO ON MAGIA.ID = MAGIAGRIMORIO.ID_MAGIA
        INNER JOIN GRIMORIO ON MAGIAGRIMORIO.ID_GRIMORIO = GRIMORIO.ID
         WHERE GRIMORIO.ID = ${idGrimorio} `;

    let comando = [];
    let array = [];

    if (filtro && filtro.length > 0) {
      for (const filtroSel of filtro) {
        if (filtroSel.tipo !== "" && filtroSel.evento !== "") {
          const tabelaConvertida = converteParaTabela(
            filtroSel.tipo,
            filtroSel.evento
          );

          console.log(tabelaConvertida);

          comando.push(tabelaConvertida?.[0]);

          for (const parametro of tabelaConvertida?.[1]) {
            array.push(`%${parametro}%`);
          }
        }
      }

      if (comando.length > 0 && array.length > 0) {
        comandoSQL += " AND ";
        comandoSQL += comando.join(" AND ");
      }
    }

    comandoSQL += " ORDER BY MAGIA.NOME ";

    try {
      defCarregamento(true);
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        console.log(comandoSQL);
        const resultado = await db?.query(comandoSQL, array);
        if (resultado && resultado.values) {
          defMagiaItens(resultado?.values);
        }
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      console.log(magiaItens);
      defCarregamento(false);
    }
  };

  const filtraDados = () => {
    buscaDados();
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

  const retirarMagia = async (idMagia: number) => {
    try {
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        await db?.query(
          ` DELETE FROM MAGIAGRIMORIO WHERE ID_MAGIA = ? AND ID_GRIMORIO = ? `,
          [idMagia, idGrimorio]
        );
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      filtraDados();
      defCorToast("warning");
      defToastTexto("Magia retirada do grimório!");
      defMostraMensagem(true);
      defMostraModalOpcoes(false);
    }
  };

  const redVerMagia = (idMagia: number) => {
    navegar.push(`/VerMagia?idMagia=${idMagia}`);
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

  const selecionaModal = (id: number) => {
    defModalSel(id);
    defMostraModalTipo(true);
  };

  const capFiltroValor = ({
    id,
    tipo,
    evento,
  }: {
    id: number;
    tipo: string;
    evento: CustomEvent;
  }) => {
    const valorInput = evento.detail.value;
    defFiltro((prevArray) => {
      const novoFiltro = [...prevArray];
      const valorEncontradoIndice = novoFiltro.findIndex(
        (item) => item.id === id
      );

      if (valorEncontradoIndice !== -1) {
        novoFiltro[valorEncontradoIndice].evento = valorInput;
      } else {
        novoFiltro.push({ id: id, tipo: tipo, evento: valorInput });
      }

      return novoFiltro;
    });
  };

  const capFiltroTipo = ({
    id,
    tipo,
    evento,
  }: {
    id: number;
    tipo: string;
    evento: CustomEvent;
  }) => {
    const valorInput = evento.detail.value;
    defFiltro((prevArray) => {
      const novoFiltro = [...prevArray];
      const valorEncontradoIndice = novoFiltro.findIndex(
        (item) => item.id === id
      );

      if (valorEncontradoIndice !== -1) {
        novoFiltro[valorEncontradoIndice].tipo = tipo;
      } else {
        novoFiltro.push({ id: id, tipo: tipo, evento: valorInput });
      }

      return novoFiltro;
    });
  };

  const capTipo = (valor: string) => {
    const id = modalSel;
    const tipo = valor.toString();
    const evento = new CustomEvent("placeholder", {
      detail: { value: "" },
    });
    capFiltroTipo({ id: id, tipo: tipo, evento: evento });
    defMostraModalTipo(false);
  };

  const addFiltro = () => {
    defQtdFiltro((prevArray) => [
      ...prevArray,
      prevArray[prevArray.length - 1] + 1,
    ]);
  };

  const delFiltro = (valor: number) => {
    const novoArrayqtd = qtdFiltro.filter((item) => item !== valor);
    console.log(novoArrayqtd);
    defQtdFiltro(novoArrayqtd);

    const novoArrayApt = filtro.filter((item, indice) => indice !== valor);
    console.log(novoArrayApt);
    defFiltro(novoArrayApt);
  };

  const colapsaFiltro = () => {
    if (mostraFiltro == true) {
      defMostraFiltro(false);
    } else {
      defMostraFiltro(true);
    }

    console.log(mostraFiltro);
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
  /**/

  return (
    <IonPage>
      <IonHeader>
        <BarraSuperior icone={book} titulo={"Grimório"} />
      </IonHeader>
      <IonContent color="tertiary">
        <IonCard color="secondary">
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol>
                <IonCardTitle className="ion-text-center">
                  <strong>🏹 Ártemis de Feitiço</strong>
                </IonCardTitle>
              </IonCol>
              <IonCol onClick={colapsaFiltro} size="2">
                <IonButton fill="clear">
                  <IonIcon icon={filter}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
            {mostraFiltro ? (
              <div>
                {qtdFiltro.map((valor, indice) => (
                  <IonRow key={indice}>
                    <IonCol size="4" style={{ padding: "0px" }}>
                      <IonItem
                        className="ion-text-center"
                        button
                        lines="none"
                        color="secondary"
                        onClick={() => selecionaModal(indice)}
                      >
                        <IonLabel>
                          {filtro && filtro[indice] && filtro[indice].tipo
                            ? filtro[indice].tipo
                            : "TIPO"}
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    <IonCol style={{ padding: "0px" }}>
                      {" "}
                      <IonItem color="secondary" lines="none">
                        <IonInput
                          className="ion-text-center"
                          onIonInput={(e) =>
                            capFiltroValor({
                              id: indice,
                              tipo: "",
                              evento: e,
                            })
                          }
                          placeholder="Insira para pesquisar"
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                    {indice === 0 ? (
                      <IonCol style={{ padding: "0px" }} size="2">
                        <IonButton fill="clear" onClick={addFiltro}>
                          <IonIcon icon={add} />
                        </IonButton>
                      </IonCol>
                    ) : null}
                    {indice === qtdFiltro.length - 1 && qtdFiltro.length > 1 ? (
                      <IonCol style={{ padding: "0px" }} size="2">
                        <IonButton
                          fill="clear"
                          onClick={() => delFiltro(valor)}
                        >
                          <IonIcon icon={remove} />
                        </IonButton>
                      </IonCol>
                    ) : null}
                  </IonRow>
                ))}
                <IonRow class="ion-justify-content-center ion-align-items-center">
                  <IonCol size="2">
                    <IonButton fill="clear" onClick={filtraDados}>
                      <IonIcon icon={search} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </div>
            ) : null}
          </IonGrid>
        </IonCard>
        {!carregamento ? (
          <div>
            {magiaItens.map((magia, indice) => (
              <IonCard
                ref={(a) => (botaoRefs.current[indice] = a)}
                onMouseDown={() => segurarBotao(magia.ID, magia.NOME, indice)}
                onTouchStart={() => segurarBotao(magia.ID, magia.NOME, indice)}
                onMouseUp={cancelarSegurar}
                onTouchEnd={cancelarSegurar}
                key={magia.ID}
                color={defCorCard(magia.MANA_ID).corSecundaria}
              >
                <IonCardHeader>
                  <IonCardTitle>
                    <IonRow>
                      <IonCol size="10">
                        {magia.MANA_ID !== 999
                          ? magia.MANA_ICONE + " "
                          : `[${magia.OUTROMANA}]` + " "}
                        {magia.NOME}
                      </IonCol>
                      <IonCol
                        onClick={() => redVerMagia(magia.ID)}
                        className="ion-text-center"
                        size="2"
                      >
                        <IonIcon icon={eye} />
                      </IonCol>
                    </IonRow>
                  </IonCardTitle>
                  <IonCardSubtitle>
                    <IonRow>
                      <IonCol size="10">
                        {magia.NATUREZA_ID !== 999
                          ? magia.NATUREZA_ICONE + " "
                          : null}
                        {magia.NATUREZA_ID !== 999
                          ? magia.NATUREZA_DESCRICAO + " "
                          : magia.OUTRONATUREZA + " "}
                        {magia.NIVEL_ID !== 999
                          ? magia.NIVEL_DESCRICAO + " "
                          : magia.OUTRONIVEL + " "}
                        (
                        {magia.ESCOLA_ID !== 999
                          ? magia.ESCOLA_ICONE + " "
                          : null}
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
                    {magia.EXECUCAO_DESCRICAO &&
                    magia.EXECUCAO_DESCRICAO !== "" ? (
                      <>
                        <strong>Execução:</strong>{" "}
                        {magia.EXECUCAO_ID !== 999
                          ? magia.EXECUCAO_DESCRICAO + "; "
                          : magia.OUTROEXECUCAO + "; "}
                      </>
                    ) : null}
                    {magia.ALCANCE_DESCRICAO &&
                    magia.ALCANCE_DESCRICAO !== "" ? (
                      <>
                        <strong>Alcance:</strong>{" "}
                        {magia.ALCANCE_ID !== 999
                          ? magia.ALCANCE_DESCRICAO + "; "
                          : magia.OUTROALCANCE + "; "}
                      </>
                    ) : null}
                    {magia.MAGIA_EFEITO && magia.MAGIA_EFEITO !== "" ? (
                      <>
                        <strong>Efeito:</strong> {magia.MAGIA_EFEITO + "; "}
                      </>
                    ) : null}
                    {magia.ALVO && magia.ALVO !== "" ? (
                      <>
                        <strong>Alvo:</strong> {magia.ALVO + "; "}
                      </>
                    ) : null}
                    {magia.AREA_DESCRICAO &&
                    magia.AREA_DESCRICAO !== "" &&
                    magia.AREA_ID !== 998 ? (
                      <>
                        <strong>Area: </strong>{" "}
                        {magia.AREA_ID !== 999
                          ? magia.AREA_DESCRICAO + " "
                          : null}
                        {magia.OBSAREA + "; "}
                      </>
                    ) : null}
                    {magia.DURACAO_DESCRICAO &&
                    magia.DURACAO_DESCRICAO !== "" &&
                    magia.DURACAO_ID !== 998 ? (
                      <>
                        <strong>Duração:</strong>{" "}
                        {magia.DURACAO_ID !== 999
                          ? magia.DURACAO_DESCRICAO + " "
                          : magia.OUTRODURACAO + "; "}
                      </>
                    ) : null}
                    {magia.RESISTENCIA_DESCRICAO &&
                    magia.RESISTENCIA_DESCRICAO !== "" &&
                    magia.RESISTENCIA_ID !== 998 ? (
                      <>
                        <strong>Resistência:</strong>{" "}
                        {magia.RESISTENCIA_ID !== 999
                          ? magia.RESISTENCIA_DESCRICAO + " "
                          : magia.OUTRORESISTENCIA}
                        {magia.OBSRESISTENCIA + "; "}
                      </>
                    ) : null}
                  </p>
                  <p>{magia.MAGIA_DESCRICAO}</p>
                  <p>{magia.MAGIA_MECANICA}</p>
                </IonCardContent>
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
                color="warning"
                fill="clear"
                onClick={() => redVerMagia(cardSel)}
              >
                <IonIcon slot="start" icon={eye} />
                <IonLabel>Ver</IonLabel>
              </IonButton>
            </div>
            <div className="ion-text-center">
              <IonButton
                onClick={() => retirarMagia(cardSel)}
                color="warning"
                fill="clear"
              >
                <IonIcon slot="start" icon={trash} />
                <IonLabel>Retirar</IonLabel>
              </IonButton>
            </div>
          </IonCard>
        </IonModal>
        <IonModal
          isOpen={mostraModalTipo}
          onDidDismiss={() => defMostraModalTipo(false)}
        >
          <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
            {tiposFiltro?.map((tipo, indice) => (
              <IonItem
                className="ion-text-center"
                button
                key={indice}
                color="secondary"
                onClick={() => capTipo(tipo)}
              >
                <IonLabel style={{ fontSize: "1.3rem" }}>{tipo}</IonLabel>
              </IonItem>
            ))}
            <div className="ion-text-center">
              <IonButton
                fill="clear"
                color="secondary"
                onClick={() => defMostraModalTipo(false)}
              >
                <IonIcon color="danger" slot="start" icon={closeCircle} />
                <IonLabel color="danger">CANCELAR</IonLabel>
              </IonButton>
            </div>
          </IonList>
        </IonModal>
        <IonToast
          color={corToast}
          isOpen={mostraMensagem}
          message={toastTexto}
          onDidDismiss={() => defMostraMensagem(false)}
          duration={2000}
        ></IonToast>
        {carregamento ? <CirculoCarregamento /> : null}
      </IonContent>
    </IonPage>
  );
};

export default Grimorio;
