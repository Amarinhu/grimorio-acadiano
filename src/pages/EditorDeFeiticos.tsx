import { useEffect, useState } from "react";
import BarraSuperior from "../components/BarraSuperior";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
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
  IonText,
  IonTextarea,
  IonToast,
} from "@ionic/react";
import { brush, flame, radioButtonOff, radioButtonOn } from "ionicons/icons";
import CirculoCarregamento from "../components/CirculoDeCarregamento";
import usaSQLiteDB from "../composables/usaSQLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { recarregarPagina } from "../globalConstants/globalFunctions";
import { useLocation } from "react-router-dom";

const PaginaBase: React.FC = () => {
  const [carregamento, defCarregamento] = useState<boolean>(false);
  const [mostraMensagem, defMostraMensagem] = useState<boolean>(false);
  const [corToast, defCorToast] = useState<string>("");
  const [toastTexto, defToastTexto] = useState<string>("");
  const { executarAcaoSQL, iniciado, iniciaTabelas } = usaSQLiteDB();

  const [telaCorPrimaria, defTelaCorPrimaria] = useState<string>("secondary");
  const [telaCorSecundaria, defTelaCorSecundaria] = useState<string>("primary");
  const [telaCorTerciaria, defTelaCorTerciaria] = useState<string>("tertiary");

  const [descricao, defDescricao] = useState<string>("");
  const [mecanica, defMecanica] = useState<string>("");

  const [outroMana, defOutraMana] = useState<string>("");
  const [outroNivel, defOutroNivel] = useState<string>("");
  const [outroNatureza, defOutroNatureza] = useState<string>("");
  const [outroEscola, defOutroEscola] = useState<string>("");
  const [outroExecucao, defOutroExecucao] = useState<string>("");
  const [outroAlcance, defOutroAlcance] = useState<string>("");
  const [outroDuracao, defOutroDuracao] = useState<string>("");
  const [outroResistencia, defOutroResistencia] = useState<string>("");

  const [nome, defNome] = useState<string>("");
  const [alvo, defAlvo] = useState<string>("");
  const [obsArea, defObsArea] = useState<string>("");
  const [obsResistencia, defObsResistencia] = useState<string>("");
  const [nomeVerdadeiro, defNomeVerdadeiro] = useState<string>("");
  const [nomeAlternativo, defNomesAlternativos] = useState<string>("");
  const [origem, defOrigem] = useState<string>();
  const [origemSigla, defOrigemSigla] = useState<string>();

  const [manaItens, defManaItens] = useState<Array<any>>([]);
  const [manaSelecionada, defManaSelecionada] = useState<any>();
  const [mostraModalMana, defMostraModalMana] = useState(false);

  const [nivelItens, defNivelItens] = useState<Array<any>>([]);
  const [nivelSelecionada, defNivelSelecionada] = useState<any>();
  const [mostraModalNivel, defMostraModalNivel] = useState(false);

  const [naturezaItens, defNaturezaItens] = useState<Array<any>>([]);
  const [naturezaSelecionada, defNaturezaSelecionada] = useState<any>();
  const [mostraModalNatureza, defMostraModalNatureza] = useState(false);

  const [escolaItens, defEscolaItens] = useState<Array<any>>([]);
  const [escolaSelecionada, defEscolaSelecionada] = useState<any>();
  const [mostraModalEscola, defMostraModalEscola] = useState(false);

  const [execucaoItens, defExecucaoItens] = useState<Array<any>>([]);
  const [execucaoSelecionada, defExecucaoSelecionada] = useState<any>();
  const [mostraModalExecucao, defMostraModalExecucao] = useState(false);

  const [duracaoItens, defDuracaoItens] = useState<Array<any>>([]);
  const [duracaoSelecionada, defDuracaoSelecionada] = useState<any>();
  const [mostraModalDuracao, defMostraModalDuracao] = useState(false);

  const [alcanceItens, defAlcanceItens] = useState<Array<any>>([]);
  const [alcanceSelecionada, defAlcanceSelecionada] = useState<any>();
  const [mostraModalAlcance, defMostraModalAlcance] = useState(false);

  const [areaItens, defAreaItens] = useState<Array<any>>([]);
  const [areaSelecionada, defAreaSelecionada] = useState<any>();
  const [mostraModalArea, defMostraModalArea] = useState(false);

  const [resistenciaItens, defResistenciaItens] = useState<Array<any>>([]);
  const [resistenciaSelecionada, defResistenciaSelecionada] = useState<any>();
  const [mostraModalResistencia, defMostraModalResistencia] = useState(false);

  const [consoleLog, defConsoleLog] = useState<Array<string>>([]);

  const url = useLocation();

  const parametros = new URLSearchParams(url.search);

  const idMagia = parametros.get("idMagia");

  useEffect(() => {
    if (idMagia) {
      const carregaDadosEdicao = async () => {
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
            INNER JOIN RESISTENCIA ON MAGIA.ID_RESISTENCIA = RESISTENCIA.ID
          WHERE MAGIA.ID = ${idMagia}`;
        try {
          let resultado: { values: any[] } | undefined;
          await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
            resultado = (await db?.query(comandoSQL)) as {
              values: any[];
            };
          });
          console.log(resultado);
          if (resultado && resultado.values) {
            const valores = resultado.values?.[0];
            defNome(valores.NOME);
            defAlcanceSelecionada(valores.ALCANCE_ID);
            defOutroAlcance(valores.OUTROALCANCE);
            defManaSelecionada(valores.MANA_ID);
            definirCoresMana(valores.MANA_ID);
            defOutraMana(valores.OUTROMANA);
            defNivelSelecionada(valores.NIVEL_ID);
            defOutroNivel(valores.OUTRONIVEL);
            defNaturezaSelecionada(valores.NATUREZA_ID);
            defOutroNatureza(valores.OUTRONATUREZA);
            defEscolaSelecionada(valores.ESCOLA_ID);
            defOutroEscola(valores.OUTROESCOLA);
            defExecucaoSelecionada(valores.EXECUCAO_ID);
            defOutroExecucao(valores.OUTROEXECUCAO);
            defAlvo(valores.ALVO);
            defAreaSelecionada(valores.AREA_ID);
            defObsArea(valores.OBSAREA);
            defDuracaoSelecionada(valores.DURACAO_ID);
            defOutroDuracao(valores.OUTRODURACAO);
            defResistenciaSelecionada(valores.RESISTENCIA_ID);
            defOutroResistencia(valores.OUTRORESISTENCIA);
            defObsResistencia(valores.OBSRESISTENCIA);
            defDescricao(valores.MAGIA_DESCRICAO);
            defMecanica(valores.MAGIA_MECANICA);
            defNomesAlternativos(valores.NOMEALTERNATIVO);
            defNomeVerdadeiro(valores.NOMEVERDADEIRO);
            defOrigemSigla(valores.MAGIA_ORIGEMSIGLA);
            defOrigem(valores.MAGIA_ORIGEM);
          }
        } catch (erro) {
          console.error(erro);
        }
      };

      carregaDadosEdicao();
    }
  }, [iniciado]);

  useEffect(() => {
    const carregaMana = async () => {
      const comandoSQL = `SELECT * FROM MANA`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defManaItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    const carregaAlcance = async () => {
      const comandoSQL = `SELECT * FROM ALCANCE`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defAlcanceItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    const carregaDuracao = async () => {
      const comandoSQL = `SELECT * FROM DURACAO`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defDuracaoItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    const carregaNivel = async () => {
      const comandoSQL = `SELECT * FROM NIVEL`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defNivelItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    const carregaNatureza = async () => {
      const comandoSQL = `SELECT * FROM NATUREZA`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defNaturezaItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    const carregaEscola = async () => {
      const comandoSQL = `SELECT * FROM ESCOLA`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defEscolaItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    const carregaExecucao = async () => {
      const comandoSQL = `SELECT * FROM EXECUCAO`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defExecucaoItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    const carregaResistencia = async () => {
      const comandoSQL = `SELECT * FROM RESISTENCIA`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defResistenciaItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    const carregaArea = async () => {
      const comandoSQL = `SELECT * FROM AREA`;
      try {
        let resultado: { values: any[] } | undefined;
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          resultado = (await db?.query(comandoSQL)) as {
            values: any[];
          };
        });
        if (resultado && resultado.values) {
          defAreaItens(resultado?.values);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    try {
      const carregaDados = async () => {
        defCarregamento(true);
        await carregaMana();
        await carregaNivel();
        await carregaNatureza();
        await carregaEscola();
        await carregaExecucao();
        await carregaDuracao();
        await carregaResistencia();
        await carregaAlcance();
        await carregaArea();
      };
      carregaDados();
    } catch (erro) {
      console.error(erro);
    } finally {
      defCarregamento(false);
    }
  }, [iniciado]);

  const verificaOutros = (id: number) => {
    if (id == 999) {
      return true;
    } else {
      return false;
    }
  };

  const criarMagia = async () => {
    let outraRes = "";
    let outraDur = "";
    let outraAlc = "";
    let outraExe = "";
    let outraEsc = "";
    let outraNat = "";
    let outraNiv = "";
    let outraMan = "";

    if (verificaOutros(resistenciaSelecionada)) {
      outraRes = outroResistencia;
    }
    if (verificaOutros(duracaoSelecionada)) {
      outraDur = outroDuracao;
    }
    if (verificaOutros(alcanceSelecionada)) {
      outraAlc = outroAlcance;
    }
    if (verificaOutros(execucaoSelecionada)) {
      outraExe = outroExecucao;
    }
    if (verificaOutros(escolaSelecionada)) {
      outraEsc = outroEscola;
    }
    if (verificaOutros(naturezaSelecionada)) {
      outraNat = outroNatureza;
    }
    if (verificaOutros(nivelSelecionada)) {
      outraNiv = outroNivel;
    }
    if (verificaOutros(manaSelecionada)) {
      outraMan = outroMana;
    }
    let comandoSQL = "";

    if (idMagia) {
      comandoSQL = `
      UPDATE MAGIA 
        SET 
        ID_MANA = ?, ID_NIVEL = ?, ID_NATUREZA = ?, 
        ID_ESCOLA = ?, ID_EXECUCAO = ?, ALVO = ?, 
        ID_AREA = ?, OBSAREA = ?, ID_ALCANCE = ?, 
        ID_DURACAO = ?, ID_RESISTENCIA = ?, OBSRESISTENCIA = ?, 
        DESCRICAO = ?, MECANICA = ?, NOMEALTERNATIVO = ?, 
        NOMEVERDADEIRO = ?, NOME = ?, ORIGEM = ?, 
        ORIGEMSIGLA = ?, OUTRORESISTENCIA = ?, OUTRODURACAO = ?, 
        OUTROALCANCE = ?, OUTROEXECUCAO = ?, OUTROESCOLA = ?, 
        OUTRONATUREZA = ?, OUTRONIVEL = ?, OUTROMANA = ? 
      WHERE MAGIA.ID = ${idMagia} `;
    } else {
      comandoSQL = ` INSERT INTO MAGIA 
      (ID_MANA, ID_NIVEL, ID_NATUREZA, 
      ID_ESCOLA, ID_EXECUCAO, ALVO, 
      ID_AREA, OBSAREA, ID_ALCANCE, 
      ID_DURACAO, ID_RESISTENCIA, OBSRESISTENCIA, 
      DESCRICAO, MECANICA, NOMEALTERNATIVO, 
      NOMEVERDADEIRO, NOME, ORIGEM, ORIGEMSIGLA,
      OUTRORESISTENCIA, OUTRODURACAO, OUTROALCANCE, 
      OUTROEXECUCAO, OUTROESCOLA, OUTRONATUREZA, 
      OUTRONIVEL, OUTROMANA) 
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
    }

    console.log(comandoSQL, [
      manaSelecionada,
      nivelSelecionada,
      naturezaSelecionada,
      escolaSelecionada,
      execucaoSelecionada,
      alvo,
      areaSelecionada ?? 998,
      obsArea,
      alcanceSelecionada,
      duracaoSelecionada ?? 998,
      resistenciaSelecionada ?? 998,
      obsResistencia,
      descricao,
      mecanica,
      nomeAlternativo,
      nomeVerdadeiro,
      nome,
      origem == "" || origem == null ? "Desconhecido" : origem,
      origemSigla == "" || origemSigla == null ? "N.N." : origemSigla,
      outraRes,
      outraDur,
      outraAlc,
      outraExe,
      outraEsc,
      outraNat,
      outraNiv,
      outraMan,
    ]);

    if (
      manaSelecionada &&
      nivelSelecionada &&
      naturezaSelecionada &&
      escolaSelecionada &&
      execucaoSelecionada &&
      alcanceSelecionada &&
      nome
    ) {
      try {
        await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
          await db?.query(comandoSQL, [
            manaSelecionada,
            nivelSelecionada,
            naturezaSelecionada,
            escolaSelecionada,
            execucaoSelecionada,
            alvo,
            areaSelecionada ?? 998,
            obsArea,
            alcanceSelecionada,
            duracaoSelecionada ?? 998,
            resistenciaSelecionada ?? 998,
            obsResistencia,
            descricao,
            mecanica,
            nomeAlternativo,
            nomeVerdadeiro,
            nome,
            origem == "" || origem == null ? "Desconhecido" : origem,
            origemSigla == "" || origemSigla == null ? "N.N." : origemSigla,
            outraRes,
            outraDur,
            outraAlc,
            outraExe,
            outraEsc,
            outraNat,
            outraNiv,
            outraMan,
          ]);
          defCorToast("success");
          if (idMagia) {
            defToastTexto(`Magia '${nome}' alterada com sucesso!`);
          } else {
            defToastTexto(`Magia '${nome}' criada com sucesso!`);
          }

          defMostraMensagem(true);
        });
      } catch (erro) {
        console.error(erro);
        defCorToast("danger");
        defToastTexto("ERRO: " + erro);
        defMostraMensagem(true);
      }
    } else {
      const dadosFaltando = [];

      switch (true) {
        case !manaSelecionada:
          dadosFaltando.push("(Mana)");
        case !nivelSelecionada:
          dadosFaltando.push("(Círculo)");
        case !naturezaSelecionada:
          dadosFaltando.push("(Natureza)");
        case !escolaSelecionada:
          dadosFaltando.push("(Escola)");
        case !execucaoSelecionada:
          dadosFaltando.push("(Execução)");
        case !alcanceSelecionada:
          dadosFaltando.push("(Alcance)");
        case !nome:
          dadosFaltando.push("(Nome)");
      }

      defCorToast("danger");
      defToastTexto("DADOS OBRIGATÓRIOS FALTANDO: " + dadosFaltando.join(", "));
      defMostraMensagem(true);
    }
  };

  const consoleMagiaInfo = () => {
    const magiaInfo = [
      `NOME: ${nome}`,
      `ID_MANA: ${manaSelecionada} - ${manaItens
        .filter((item) => item.ID === manaSelecionada)
        .map((item) => item.DESCRICAO)}`,
      `ID_NIVEL: ${nivelSelecionada} - ${nivelItens
        .filter((item) => item.ID === nivelSelecionada)
        .map((item) => item.NIVEL)}º Círculo`,
      `ID_NATUREZA: ${naturezaSelecionada} - ${naturezaItens
        .filter((item) => item.ID === naturezaSelecionada)
        .map((item) => item.DESCRICAO)}`,
      `ID_ESCOLA: ${escolaSelecionada} - ${escolaItens
        .filter((item) => item.ID === escolaSelecionada)
        .map((item) => item.DESCRICAO)}`,
      `ID_EXECUCAO: ${execucaoSelecionada} - ${execucaoItens
        .filter((item) => item.ID === execucaoSelecionada)
        .map((item) => item.DESCRICAO)}`,
      `ALVO: ${alvo}`,
      `ID_AREA: ${areaSelecionada} - ${areaItens
        .filter((item) => item.ID === areaSelecionada)
        .map((item) => item.DESCRICAO)}`,
      `OBS_AREA: ${obsArea}`,
      `ID_ALCANCE: ${alcanceSelecionada} - ${alcanceItens
        .filter((item) => item.ID === alcanceSelecionada)
        .map((item) => item.DESCRICAO)}`,
      `ID_DURACAO: ${duracaoSelecionada} - ${duracaoItens
        .filter((item) => item.ID === duracaoSelecionada)
        .map((item) => item.DESCRICAO)}`,
      `ID_RESISTENCIA: ${resistenciaSelecionada} - ${resistenciaItens
        .filter((item) => item.ID === resistenciaSelecionada)
        .map((item) => item.DESCRICAO)}`,
      `OBS_RESISTENCIA: ${obsResistencia}`,
      `DESCRICAO: ${descricao}`,
      `MECANICA: ${mecanica}`,
      `NOMES ALTERNATIVOS: ${nomeAlternativo}`,
      `NOME VERDADEIRO: ${nomeVerdadeiro}`,
    ];
    defConsoleLog(magiaInfo);
    console.log(magiaInfo);

    defToastTexto("Informação da magia inserida no console!");
    defMostraMensagem(true);
  };

  const capOrigem = (valor: any) => {
    console.log("Alvo Observacao: " + valor.detail.value);
    defOrigem(valor.detail.value);
  };

  const capOrigemSigla = (valor: any) => {
    console.log("Alvo Observacao: " + valor.detail.value);
    defOrigemSigla(valor.detail.value);
  };

  const capObsArea = (valor: any) => {
    console.log("Alvo Observacao: " + valor.detail.value);
    defObsArea(valor.detail.value);
  };

  const capObsResistencia = (valor: any) => {
    console.log("Alvo Observacao: " + valor.detail.value);
    defObsResistencia(valor.detail.value);
  };

  const capArea = (valor: any) => {
    console.log("Area: " + valor);
    defAreaSelecionada(valor);
    defMostraModalArea(false);
  };

  const capNome = (valor: any) => {
    console.log("Nome: " + valor.detail.value);
    defNome(valor.detail.value);
  };

  const capOutraMana = (valor: any) => {
    console.log("Outra Mana: " + valor.detail.value);
    defOutraMana(valor.detail.value);
  };

  const capOutraNatureza = (valor: any) => {
    console.log("Outra Natureza: " + valor.detail.value);
    defOutroNatureza(valor.detail.value);
  };

  const capOutraEscola = (valor: any) => {
    console.log("Outra Escola: " + valor.detail.value);
    defOutroEscola(valor.detail.value);
  };

  const capAlvo = (valor: any) => {
    console.log("Alvo: " + valor.detail.value);
    defAlvo(valor.detail.value);
  };

  const capOutraExecucao = (valor: any) => {
    console.log("Outra Execucao: " + valor.detail.value);
    defOutroExecucao(valor.detail.value);
  };

  const capOutroAlcance = (valor: any) => {
    console.log("Outra Alcance: " + valor.detail.value);
    defOutroAlcance(valor.detail.value);
  };

  const capOutroDuracao = (valor: any) => {
    console.log("Outra Alcance: " + valor.detail.value);
    defOutroDuracao(valor.detail.value);
  };

  const capOutroResistencia = (valor: any) => {
    console.log("Outra Alcance: " + valor.detail.value);
    defOutroResistencia(valor.detail.value);
  };

  const capOutroNivel = (valor: any) => {
    console.log("Outra Mana: " + valor.detail.value);
    defOutroNivel(valor.detail.value);
  };

  const capNomesAlternativos = (valor: any) => {
    console.log("Nomes Alternativos: " + valor.detail.value);
    defNomesAlternativos(valor.detail.value);
  };

  const capNomeVerdadeiro = (valor: any) => {
    console.log("Nome Verdadeiro: " + valor.detail.value);
    defNomeVerdadeiro(valor.detail.value);
  };

  const capDescricao = (valor: any) => {
    console.log("Descricao: " + valor.detail.value);
    defDescricao(valor.detail.value);
  };

  const capMecanica = (valor: any) => {
    console.log("Mecanica: " + valor.detail.value);
    defMecanica(valor.detail.value);
  };

  const capDuracao = (valor: any) => {
    console.log("Duracao Selecionado: " + valor);
    defDuracaoSelecionada(valor);
    defMostraModalDuracao(false);
  };

  const capAlcance = (valor: any) => {
    console.log("Duracao Selecionado: " + valor);
    defAlcanceSelecionada(valor);
    defMostraModalAlcance(false);
  };

  const capNatureza = (valor: any) => {
    console.log("Natureza Selecionado: " + valor);
    defNaturezaSelecionada(valor);
    defMostraModalNatureza(false);
  };

  const capEscola = (valor: any) => {
    console.log("Escola Selecionado: " + valor);
    defEscolaSelecionada(valor);
    defMostraModalEscola(false);
  };

  const capExecucao = (valor: any) => {
    console.log("Escola Selecionado: " + valor);
    defExecucaoSelecionada(valor);
    defMostraModalExecucao(false);
  };

  const capResistencia = (valor: any) => {
    console.log("Escola Selecionado: " + valor);
    defResistenciaSelecionada(valor);
    defMostraModalResistencia(false);
  };

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

  const capMana = (valor: any) => {
    console.log("Mana Selecionado: " + valor);

    console.log(manaItens);
    definirCoresMana(valor);

    defManaSelecionada(valor);
    defMostraModalMana(false);
  };

  const capNivel = (valor: any) => {
    console.log("Nível Selecionado: " + valor);
    defNivelSelecionada(valor);
    defMostraModalNivel(false);
  };

  const insercao = async () => {
    try {
      const comandosSQL = [
        `INSERT OR REPLACE INTO EXECUCAO (ID, DESCRICAO)
        VALUES (1, 'Padrão'), (2, 'Livre'), (3, 'Reação'), (4, 'Completa'), (999, 'Outros');`,
        `INSERT OR REPLACE INTO ALCANCE (ID, DESCRICAO)
        VALUES (1, 'Pessoal'), (2, 'Toque'), (3, 'Curto'), (4, 'Médio'), (5, 'Longo '), (6, 'Ilimitado '), (999, 'Outros');`,
        `INSERT OR REPLACE INTO MANA(ID, ICONE, DESCRICAO)
        VALUES (1,'🔴', 'Vermelho'), (2,'⚫', 'Preto'), (3,'⚪', 'Branco'), (4,'🟢', 'Verde'), 
        (5,'🔵', 'Azul'),(6,'🟣', 'Roxo'), (998, 'x', 'Nenhum'), (999,'Ø','Outro')`,
        `INSERT OR REPLACE INTO NIVEL (ID, NIVEL)
        VALUES (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5'), (6, '6'), (999, 'Ø');`,
        `INSERT OR REPLACE INTO NATUREZA(ID, ICONE, DESCRICAO)
        VALUES (1,'🙏', 'Divino'), (2,'✨', 'Arcana'), (3,'📖', 'Universal'), (998, 'x', 'Nenhum'), (999,'Ø','Outro')`,
        `INSERT OR REPLACE INTO ESCOLA(ID, ICONE, DESCRICAO)
        VALUES (1, '🛡️', 'Abjuração'), (2, '🔮', 'Adivinhação'), (3, '🌀', 'Convocação'), 
        (4, '❤️', 'Encantamento'), (5, '👁️‍🗨️', 'Ilusão'), (6, '🔥', 'Evocação'), (7, '☠️', 'Necromancia'), 
        (8, '⚗️', 'Transmutação'), (998, 'x', 'Nenhum'), (999, 'Ø', 'Outro');`,
        `INSERT OR REPLACE INTO DURACAO(ID, DESCRICAO)
        VALUES (1, 'Instantânea'), (2, 'Cena'), (3, 'Sustentada'), (4, 'Permanente'), (998, 'Nenhum'), (999, 'Outro');`,
        `INSERT OR REPLACE INTO RESISTENCIA (ID,DESCRICAO)
        VALUES (1, 'Reflexos'), (2, 'Vontade'), (3, 'Fortitude'), (998, 'Nenhum'), (999, 'Outro');`,
        `INSERT OR REPLACE INTO AREA (ID,DESCRICAO)
          VALUES (1, 'Cilindro'), (2, 'Cone'), (3, 'Esfera'), (4, 'Linha'), (5, 'Quadrado'), (998, 'Nenhum'), (999, 'Outro');`,
      ];

      await iniciaTabelas();

      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        await db?.query(`SELECT * FROM MAGIA`);
        for (const comando of comandosSQL) {
          await db?.query(comando);
        }
      });
    } catch (erro) {
      console.error(erro);
    } finally {
      recarregarPagina();
    }
  };

  const itensCarregados = () => {
    const verif =
      manaItens &&
      nivelItens &&
      naturezaItens &&
      escolaItens &&
      execucaoItens &&
      areaItens &&
      alcanceItens &&
      duracaoItens &&
      resistenciaItens &&
      manaItens.length > 0 &&
      nivelItens.length > 0 &&
      naturezaItens.length > 0 &&
      escolaItens.length > 0 &&
      execucaoItens.length > 0 &&
      areaItens.length > 0 &&
      alcanceItens.length > 0 &&
      duracaoItens.length > 0 &&
      resistenciaItens.length > 0;

    return verif;
  };

  return (
    <IonPage>
      <IonHeader>
        <BarraSuperior
          corBarra={telaCorSecundaria}
          icone={flame}
          titulo={"Magias"}
        />
      </IonHeader>
      {!carregamento ? (
        <IonContent color={telaCorTerciaria}>
          <IonButton color={telaCorPrimaria} onClick={insercao}>
            <IonLabel>Iniciar Banco</IonLabel>
          </IonButton>
          <IonButton color={telaCorPrimaria} onClick={consoleMagiaInfo}>
            <IonLabel>Log Itens - Console</IonLabel>
          </IonButton>
          <p style={{ backgroundColor: "black", color: "green" }}>
            {consoleLog.map((item, chave) => (
              <div>
                <IonText key={chave}>{item}</IonText>
                <br />
              </div>
            ))}
          </p>
          {itensCarregados() ? (
            <IonCard color={telaCorSecundaria}>
              <IonCardHeader
                style={{ paddingBottom: "0px", paddingTop: "0px" }}
              >
                <IonCardTitle>
                  <IonInput
                    color={telaCorPrimaria}
                    label={nome ? "" : "Insira o nome da magia"}
                    onIonInput={capNome}
                    value={nome}
                    labelPlacement="floating"
                  ></IonInput>
                </IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonGrid style={{ padding: "0px" }}>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        className="ion-text-center"
                        lines="none"
                        button
                        onClick={() => defMostraModalMana(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>{manaSelecionada ? "" : "Mana"}</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {manaSelecionada
                              ? manaItens?.find(
                                  (mana) => mana.ID === manaSelecionada
                                )?.ICONE +
                                " " +
                                manaItens?.find(
                                  (mana) => mana.ID === manaSelecionada
                                )?.DESCRICAO
                              : null}
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {manaSelecionada && manaSelecionada == 999 ? (
                      <IonCol>
                        <IonRow>
                          <IonItem
                            className="ion-text-center"
                            lines="none"
                            color={telaCorSecundaria}
                          >
                            <IonInput
                              value={outroMana}
                              onIonInput={capOutraMana}
                              labelPlacement="floating"
                              color={telaCorPrimaria}
                              label={outroMana ? "" : "Mana?"}
                            />
                          </IonItem>
                        </IonRow>
                      </IonCol>
                    ) : null}
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        className="ion-text-center"
                        lines="none"
                        button
                        onClick={() => defMostraModalNivel(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>{nivelSelecionada ? "" : "Círculo"}</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {nivelSelecionada
                              ? nivelItens?.find(
                                  (nivel) => nivel.ID === nivelSelecionada
                                )?.NIVEL + "º Círculo"
                              : null}
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {nivelSelecionada && nivelSelecionada == 999 ? (
                      <IonCol>
                        <IonRow>
                          <IonItem
                            className="ion-text-center"
                            lines="none"
                            color={telaCorSecundaria}
                          >
                            <IonInput
                              onIonInput={capOutroNivel}
                              value={outroNivel}
                              inputMode="numeric"
                              color={telaCorPrimaria}
                              labelPlacement="floating"
                              label={outroNivel ? "" : "Nível?"}
                            />
                          </IonItem>
                        </IonRow>
                      </IonCol>
                    ) : null}
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        className="ion-text-center"
                        lines="none"
                        button
                        onClick={() => defMostraModalNatureza(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>{naturezaSelecionada ? "" : "Natureza"}</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {naturezaSelecionada
                              ? naturezaItens?.find(
                                  (natureza) =>
                                    natureza.ID === naturezaSelecionada
                                )?.ICONE +
                                " " +
                                naturezaItens?.find(
                                  (natureza) =>
                                    natureza.ID === naturezaSelecionada
                                )?.DESCRICAO
                              : null}
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {naturezaSelecionada && naturezaSelecionada == 999 ? (
                      <IonCol>
                        <IonRow>
                          <IonItem
                            className="ion-text-center"
                            lines="none"
                            color={telaCorSecundaria}
                          >
                            <IonInput
                              onIonInput={capOutraNatureza}
                              value={outroNatureza}
                              inputMode="numeric"
                              color={telaCorPrimaria}
                              labelPlacement="floating"
                              label={outroNatureza ? "" : "Natureza?"}
                            />
                          </IonItem>
                        </IonRow>
                      </IonCol>
                    ) : null}
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        className="ion-text-center"
                        lines="none"
                        button
                        onClick={() => defMostraModalEscola(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>{escolaSelecionada ? "" : "Escola"}</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {escolaSelecionada
                              ? escolaItens?.find(
                                  (escola) => escola.ID === escolaSelecionada
                                )?.ICONE +
                                " " +
                                escolaItens?.find(
                                  (escola) => escola.ID === escolaSelecionada
                                )?.DESCRICAO
                              : null}
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {escolaSelecionada && escolaSelecionada == 999 ? (
                      <IonCol>
                        <IonRow>
                          <IonItem
                            className="ion-text-center"
                            lines="none"
                            color={telaCorSecundaria}
                          >
                            <IonInput
                              onIonInput={capOutraEscola}
                              inputMode="numeric"
                              value={outroEscola}
                              color={telaCorPrimaria}
                              labelPlacement="floating"
                              label={outroEscola ? "" : "Escola?"}
                            />
                          </IonItem>
                        </IonRow>
                      </IonCol>
                    ) : null}
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        className="ion-text-center"
                        lines="none"
                        button
                        onClick={() => defMostraModalExecucao(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>{execucaoSelecionada ? "" : "Execução"}</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {execucaoSelecionada
                              ? execucaoItens?.find(
                                  (execucao) =>
                                    execucao.ID === execucaoSelecionada
                                )?.DESCRICAO
                              : null}
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {execucaoSelecionada && execucaoSelecionada == 999 ? (
                      <IonCol>
                        <IonRow>
                          <IonItem
                            className="ion-text-center"
                            lines="none"
                            color={telaCorSecundaria}
                          >
                            <IonInput
                              onIonInput={capOutraExecucao}
                              inputMode="numeric"
                              value={outroExecucao}
                              color={telaCorPrimaria}
                              labelPlacement="floating"
                              label={outroExecucao ? "" : "Execução?"}
                            />
                          </IonItem>
                        </IonRow>
                      </IonCol>
                    ) : null}
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonInput
                          onIonInput={capAlvo}
                          color={telaCorPrimaria}
                          value={alvo}
                          label="Alvo"
                          labelPlacement="floating"
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        lines="none"
                        button
                        onClick={() => defMostraModalArea(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>Área</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {
                              areaItens?.find(
                                (area) => area.ID === areaSelecionada
                              )?.DESCRICAO
                            }
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonInput
                          onIonInput={capObsArea}
                          value={obsArea}
                          color={telaCorPrimaria}
                          label="Observação Área"
                          labelPlacement="floating"
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        lines="none"
                        button
                        onClick={() => defMostraModalAlcance(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>Alcance</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {
                              alcanceItens?.find(
                                (alcance) => alcance.ID === alcanceSelecionada
                              )?.DESCRICAO
                            }
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {alcanceSelecionada && alcanceSelecionada == 999 ? (
                      <IonCol>
                        <IonRow>
                          <IonItem
                            className="ion-text-center"
                            lines="none"
                            color={telaCorSecundaria}
                          >
                            <IonInput
                              onIonInput={capOutroAlcance}
                              value={outroAlcance}
                              inputMode="numeric"
                              color={telaCorPrimaria}
                              labelPlacement="floating"
                              label={outroAlcance ? "" : "Alcance?"}
                            />
                          </IonItem>
                        </IonRow>
                      </IonCol>
                    ) : null}
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        lines="none"
                        button
                        onClick={() => defMostraModalDuracao(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>Duração</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {
                              duracaoItens?.find(
                                (duracao) => duracao.ID === duracaoSelecionada
                              )?.DESCRICAO
                            }
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {duracaoSelecionada && duracaoSelecionada == 999 ? (
                      <IonCol>
                        <IonRow>
                          <IonItem
                            className="ion-text-center"
                            lines="none"
                            color={telaCorSecundaria}
                          >
                            <IonInput
                              onIonInput={capOutroDuracao}
                              inputMode="numeric"
                              value={outroDuracao}
                              color={telaCorPrimaria}
                              labelPlacement="floating"
                              label={outroDuracao ? "" : "Duração?"}
                            />
                          </IonItem>
                        </IonRow>
                      </IonCol>
                    ) : null}
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem
                        lines="none"
                        button
                        onClick={() => defMostraModalResistencia(true)}
                        color={telaCorSecundaria}
                      >
                        <IonLabel>
                          <h3>Resistencia</h3>
                          <p style={{ fontSize: "1.1rem" }}>
                            {
                              resistenciaItens?.find(
                                (resistencia) =>
                                  resistencia.ID === resistenciaSelecionada
                              )?.DESCRICAO
                            }
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                    {resistenciaSelecionada && resistenciaSelecionada == 999 ? (
                      <IonCol>
                        <IonRow>
                          <IonItem
                            className="ion-text-center"
                            lines="none"
                            color={telaCorSecundaria}
                          >
                            <IonInput
                              onIonInput={capOutroResistencia}
                              inputMode="numeric"
                              value={outroResistencia}
                              color={telaCorPrimaria}
                              labelPlacement="floating"
                              label={outroResistencia ? "" : "Resistencia?"}
                            />
                          </IonItem>
                        </IonRow>
                      </IonCol>
                    ) : null}
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonInput
                          color={telaCorPrimaria}
                          labelPlacement="floating"
                          label="Observação Resistência"
                          value={obsResistencia}
                          onIonInput={capObsResistencia}
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonTextarea
                          color={telaCorPrimaria}
                          autoGrow={true}
                          value={descricao}
                          label="Descrição"
                          labelPlacement="floating"
                          onIonInput={capDescricao}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonTextarea
                          color={telaCorPrimaria}
                          autoGrow={true}
                          label="Mecânica"
                          value={mecanica}
                          labelPlacement="floating"
                          onIonInput={capMecanica}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonInput
                          color={telaCorPrimaria}
                          labelPlacement="floating"
                          value={nomeAlternativo}
                          label="Nomes Alternativos"
                          onIonInput={capNomesAlternativos}
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonInput
                          color={telaCorPrimaria}
                          labelPlacement="floating"
                          label="Nome Verdadeiro"
                          value={nomeVerdadeiro}
                          onIonInput={capNomeVerdadeiro}
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="3" style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonInput
                          color={telaCorPrimaria}
                          labelPlacement="floating"
                          label="Sigla"
                          value={origemSigla}
                          onIonInput={capOrigemSigla}
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                    <IonCol style={{ padding: "0px" }}>
                      <IonItem lines="none" color={telaCorSecundaria}>
                        <IonInput
                          color={telaCorPrimaria}
                          labelPlacement="floating"
                          value={origem}
                          label="Origem"
                          onIonInput={capOrigem}
                        ></IonInput>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ padding: "0px" }}>
                      <div className="ion-text-center">
                        <IonButton color={telaCorPrimaria} onClick={criarMagia}>
                          <IonIcon slot="start" icon={brush} />
                          <IonLabel>
                            {idMagia ? "Alterar Magia!" : "Criar Magia!"}
                          </IonLabel>
                        </IonButton>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ) : null}
          <IonToast
            color={corToast}
            isOpen={mostraMensagem}
            message={toastTexto}
            onDidDismiss={() => defMostraMensagem(false)}
            duration={5000}
          ></IonToast>
          {carregamento ? <CirculoCarregamento /> : null}

          <IonModal
            isOpen={mostraModalMana}
            onDidDismiss={() => defMostraModalMana(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {manaItens?.map((mana, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capMana(mana.ID)}
                  color={telaCorSecundaria}
                >
                  {mana.ID === manaSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {mana.ICONE} - {mana.DESCRICAO}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>

          <IonModal
            isOpen={mostraModalNatureza}
            onDidDismiss={() => defMostraModalNatureza(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {naturezaItens?.map((natureza, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capNatureza(natureza.ID)}
                  color={telaCorSecundaria}
                >
                  {natureza.ID === naturezaSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {natureza.ICONE} - {natureza.DESCRICAO}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>

          <IonModal
            isOpen={mostraModalEscola}
            onDidDismiss={() => defMostraModalEscola(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {escolaItens?.map((escola, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capEscola(escola.ID)}
                  color={telaCorSecundaria}
                >
                  {escola.ID === escolaSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {escola.ICONE} - {escola.DESCRICAO}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>

          <IonModal
            isOpen={mostraModalDuracao}
            onDidDismiss={() => defMostraModalDuracao(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {duracaoItens?.map((duracao, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capDuracao(duracao.ID)}
                  color={telaCorSecundaria}
                >
                  {duracao.ID === duracaoSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {duracao.DESCRICAO}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>

          <IonModal
            isOpen={mostraModalExecucao}
            onDidDismiss={() => defMostraModalExecucao(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {execucaoItens?.map((execucao, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capExecucao(execucao.ID)}
                  color={telaCorSecundaria}
                >
                  {execucao.ID === execucaoSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {execucao.DESCRICAO}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>

          <IonModal
            isOpen={mostraModalAlcance}
            onDidDismiss={() => defMostraModalAlcance(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {alcanceItens?.map((alcance, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capAlcance(alcance.ID)}
                  color={telaCorSecundaria}
                >
                  {alcance.ID === alcanceSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {alcance.DESCRICAO}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>

          <IonModal
            isOpen={mostraModalArea}
            onDidDismiss={() => defMostraModalArea(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {areaItens?.map((area, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capArea(area.ID)}
                  color={telaCorSecundaria}
                >
                  {area.ID === areaSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {area.DESCRICAO}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>

          <IonModal
            isOpen={mostraModalResistencia}
            onDidDismiss={() => defMostraModalResistencia(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {resistenciaItens?.map((resistencia, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capResistencia(resistencia.ID)}
                  color={telaCorSecundaria}
                >
                  {resistencia.ID === resistenciaSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {resistencia.DESCRICAO}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>

          <IonModal
            isOpen={mostraModalNivel}
            onDidDismiss={() => defMostraModalNivel(false)}
          >
            <IonList style={{ marginTop: "auto", marginBottom: "auto" }}>
              {nivelItens?.map((nivel, indice) => (
                <IonItem
                  className="ion-text-center"
                  button
                  key={indice}
                  onClick={() => capNivel(nivel.ID)}
                  color={telaCorSecundaria}
                >
                  {nivel.ID === nivelSelecionada ? (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOn}
                      color={telaCorPrimaria}
                    ></IonIcon>
                  ) : (
                    <IonIcon
                      style={{ marginRight: "0.5rem" }}
                      slot="start"
                      icon={radioButtonOff}
                    ></IonIcon>
                  )}
                  <IonLabel style={{ fontSize: "1.3rem" }}>
                    {nivel.NIVEL}º Círculo
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonModal>
        </IonContent>
      ) : null}
    </IonPage>
  );
};

export default PaginaBase;
