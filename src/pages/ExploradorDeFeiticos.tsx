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
  IonTitle,
  IonToast,
} from "@ionic/react";
import {
  add,
  arrowBackCircle,
  arrowForwardCircle,
  book,
  closeCircle,
  copy,
  eye,
  fileTray,
  filter,
  flame,
  folder,
  grid,
  pencil,
  remove,
  search,
  trash,
} from "ionicons/icons";
import CirculoCarregamento from "../components/CirculoDeCarregamento";
import BarraInferior from "../components/BarraInferiorControles";
import usaSQLiteDB from "../composables/usaSQLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import BotaoAdicionarItem from "../components/BotaoAdicionar";
import { useHistory } from "react-router";
import { createGesture, Gesture } from "@ionic/react";

const ListaMagia: React.FC = () => {
  const [carregamento, defCarregamento] = useState<boolean>(false);
  const [mostraMensagem, defMostraMensagem] = useState<boolean>(false);

  const [pagina, defPagina] = useState<number>(0);

  const [qtdFiltro, defQtdFiltro] = useState<Array<number>>([0]);

  const [mostraFiltro, defMostraFiltro] = useState<boolean>(true);

  const [corToast, defCorToast] = useState<string>("");
  const [toastTexto, defToastTexto] = useState<string>("");

  const [mostraModalOpcoes, defMostraModalOpcoes] = useState(false);
  const [mostraModalTipo, defMostraModalTipo] = useState(false);
  const [mostraModalGrimorio, defMostraModalGrimorio] = useState(false);

  const [filtro, defFiltro] = useState<Array<any>>([]);

  const [modalSel, defModalSel] = useState<number>(0);

  const [magiaItens, defMagiaItens] = useState<Array<any>>([]);
  const [magiaItensTotal, defMagiaItensTotal] = useState<Array<any>>([]);

  const { executarAcaoSQL, iniciado } = usaSQLiteDB();
  const navegar = useHistory();

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

  useEffect(() => {
    buscaDados();
  }, [iniciado]);

  const buscaDados = async (pagina?: number) => {
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
         `;

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
        comandoSQL += ` WHERE `;
        comandoSQL += comando.join(" AND ");
      }
    }

    /*console.log(comandoSQL, array);*/

    comandoSQL += `
    ORDER BY MAGIA.NOME
  `;
  
  

    try {
      defCarregamento(true);
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        if (!pagina || pagina <= 0) {
          console.log("RODOU A RESULTADO TOTAL ");
          const resultadoTotal = await db?.query(comandoSQL, array);
          if (resultadoTotal && resultadoTotal.values) {
            defMagiaItensTotal(resultadoTotal?.values);
          }
        }

        const resultado = await db?.query(comandoSQL, array);
        console.log(resultado);

        if (resultado && resultado.values) {
          let totalLocal = 40;
          if (pagina) {
            totalLocal = pagina + 40;
          }
          const batch40 = resultado.values.slice(pagina, totalLocal);
          console.log(batch40);
          defMagiaItens(batch40);
        }
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      /*console.log(magiaItens);*/
      defCarregamento(false);
    }
  };

  const filtraDados = (pagina?: number) => {
    if (pagina) {
      buscaDados(pagina);
    } else {
      buscaDados();
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

  const deletarMagia = async (idMagia: number) => {
    try {
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        await db?.query(` DELETE FROM APRIMORAMENTO WHERE ID_MAGIA = ? `, [
          idMagia,
        ]);
        await db?.query(` DELETE FROM MAGIA WHERE ID = ? `, [idMagia]);
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      filtraDados();
      defCorToast("success");
      defToastTexto("Magia deletada com sucesso");
      defMostraMensagem(true);
      defMostraModalOpcoes(false);
    }
  };

  const redEdicaoMagia = (idMagia: number) => {
    navegar.push(`/EditorDeFeiticos?idMagia=${idMagia}`);
  };

  const redVerMagia = (idMagia: number) => {
    navegar.push(`/VerMagia?idMagia=${idMagia}`);
  };

  const redClonarMagia = (idMagia: number) => {
    navegar.push(`/EditorDeFeiticos?idMagia=${idMagia}&copia=true`);
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

  const selecionaModal = (id: number) => {
    defModalSel(id);
    defMostraModalTipo(true);
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

  const colapsaFiltro = () => {
    if (mostraFiltro == true) {
      defMostraFiltro(false);
    } else {
      defMostraFiltro(true);
    }

    console.log(mostraFiltro);
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
  /**/

  const voltarPagina = () => {
    if (pagina - 40 >= 0) {
      try {
        defPagina(pagina - 40);
      } catch (erro) {
        console.error(erro);
      } finally {
        filtraDados(pagina - 40);
      }
    }
  };

  const avancarPagina = () => {
    if (pagina + 40 <= magiaItensTotal.length) {
      try {
        defPagina(pagina + 40);
      } catch (erro) {
        console.error(erro);
      } finally {
        filtraDados(pagina + 40);
      }
    }
  };

  const teste = () => {
    console.log(magiaItens);
    console.log(magiaItensTotal);
    console.log(Math.ceil(magiaItensTotal.length / 40));
  };

  return (
    <IonPage>
      <IonHeader>
        <BarraSuperior icone={flame} titulo={"Magias"} />
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
                    <IonButton fill="clear" onClick={() => filtraDados()}>
                      <IonIcon icon={search} />
                    </IonButton>
                    {/*
                  <IonButton onClick={teste}>
                    <IonIcon icon={add} />
                  </IonButton>
                */}
                  </IonCol>
                </IonRow>
              </div>
            ) : null}
          </IonGrid>
        </IonCard>

        {magiaItensTotal && magiaItensTotal.length > 0 ? (
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-align-items-center">
              <IonCol
                onClick={voltarPagina}
                size="5"
                style={{ padding: "0px" }}
                className="ion-text-center"
              >
                <IonIcon icon={arrowBackCircle} size="large" />
              </IonCol>
              <IonCol
                onClick={teste}
                size="2"
                style={{ padding: "0px" }}
                className="ion-text-center"
              >
                {pagina / 40 + 1}/{Math.ceil(magiaItensTotal.length / 40)}
              </IonCol>
              <IonCol
                onClick={avancarPagina}
                size="5"
                style={{ padding: "0px" }}
                className="ion-text-center"
              >
                <IonIcon icon={arrowForwardCircle} size="large" />
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : null}

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
                <IonCardHeader
                  style={{ paddingBottom: "0px", paddingTop: "0.8rem" }}
                >
                  <IonCardTitle>
                    <IonRow>
                      <IonCol class="ion-align-items-center" size="10">
                        {magia.MANA_ID !== 999
                          ? magia.MANA_ID !== 998
                            ? magia.MANA_ICONE + " "
                            : null
                          : `[${magia.OUTROMANA}]` + " "}
                        {magia.NOME}
                      </IonCol>
                      <IonCol
                        onClick={() => redEdicaoMagia(magia.ID)}
                        className="ion-text-center"
                        size="2"
                      >
                        <IonIcon icon={pencil} />
                      </IonCol>
                    </IonRow>
                  </IonCardTitle>
                  <IonCardSubtitle>
                    <IonRow>
                      <IonCol size="10" style={{ padding: "0px" }}>
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
                      <IonCol
                        style={{ padding: "0px" }}
                        onClick={() => iniciarSegurar(magia.ID, magia.NOME)}
                        className="ion-text-center"
                        size="2"
                      >
                        <IonIcon
                          style={{ height: "1.3rem", width: "1.3rem" }}
                          icon={grid}
                        ></IonIcon>
                      </IonCol>
                    </IonRow>
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonRow>
                    <IonCol size="10" style={{ padding: "0px" }}>
                      {" "}
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
                        {magia.ALVO && magia.ALVO !== "" ? (
                          <>
                            <strong>Alvo:</strong> {magia.ALVO + "; "}
                          </>
                        ) : null}
                        {magia.MAGIA_EFEITO && magia.MAGIA_EFEITO !== "" ? (
                          <>
                            <strong>Efeito:</strong> {magia.MAGIA_EFEITO + "; "}
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
                              : magia.OUTRORESISTENCIA + " "}
                            {magia.OBSRESISTENCIA + "; "}
                          </>
                        ) : null}
                      </p>
                    </IonCol>
                    <IonCol className="ion-text-center">
                      <strong>{magia.MAGIA_ORIGEMSIGLA}</strong>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px", textAlign : "justify" }}>
                      <p>{magia.MAGIA_MECANICA}</p>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : null}
        {magiaItensTotal && magiaItensTotal.length > 0 && !carregamento ? (
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-align-items-center">
              <IonCol
                onClick={voltarPagina}
                size="5"
                style={{ padding: "0px" }}
                className="ion-text-center"
              >
                <IonIcon icon={arrowBackCircle} size="large" />
              </IonCol>
              <IonCol
                onClick={teste}
                size="2"
                style={{ padding: "0px" }}
                className="ion-text-center"
              >
                {pagina / 40 + 1}/{Math.ceil(magiaItensTotal.length / 40)}
              </IonCol>
              <IonCol
                onClick={avancarPagina}
                size="5"
                style={{ padding: "0px" }}
                className="ion-text-center"
              >
                <IonIcon icon={arrowForwardCircle} size="large" />
              </IonCol>
            </IonRow>
          </IonGrid>
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
                onClick={() => defMostraModalGrimorio(true)}
                color="success"
                fill="clear"
              >
                <IonIcon slot="start" icon={book} />
                <IonLabel>Guardar</IonLabel>
              </IonButton>
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
                color="warning"
                fill="clear"
                onClick={() => redEdicaoMagia(cardSel)}
              >
                <IonIcon slot="start" icon={pencil} />
                <IonLabel>Editar</IonLabel>
              </IonButton>
            </div>
            <div className="ion-text-center">
              <IonButton
                color="warning"
                fill="clear"
                onClick={() => redClonarMagia(cardSel)}
              >
                <IonIcon slot="start" icon={copy} />
                <IonLabel>Clonar</IonLabel>
              </IonButton>
            </div>
            <div className="ion-text-center">
              <IonButton
                onClick={() => deletarMagia(cardSel)}
                color="danger"
                fill="clear"
              >
                <IonIcon slot="start" icon={trash} />
                <IonLabel>Excluir</IonLabel>
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
      <BotaoAdicionarItem caminho="/EditorDeFeiticos" />
      <BarraInferior />
    </IonPage>
  );
};

export default ListaMagia;
