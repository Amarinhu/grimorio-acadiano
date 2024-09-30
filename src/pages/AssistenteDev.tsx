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
} from "@ionic/react";
import { useEffect, useState } from "react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import usaSQLiteDB from "../composables/usaSQLiteDB";
import TituloBotaoVoltar from "../components/BarraSuperior";
import armazenamento from "../armazenamento";
import CirculoCarregamento from "../components/CirculoDeCarregamento";
import {
  bug,
  build,
  closeCircle,
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

  const deletarTabela = async () => {
    try {
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        for (const tabela of tabelas) {
          await db?.query(`DROP TABLE IF EXISTS ${tabela};`);
        }
      });
    } catch (erro) {
      console.log(erro);
    }
  };

  const [comandoSQL, definirComandoSQL] = useState<string>();
  const [dadosSQL, definirDadosSQL] = useState<any>();

  const executaSQL = () => {
    if (comandoSQL) {
      executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        const resultado = await db?.query(comandoSQL);
        definirDadosSQL(resultado?.values);

        console.log(typeof resultado);
        console.log(resultado?.values);
      });
      console.log("Comando Executado : " + comandoSQL);
    }
  };

  const capturaComandoSQL = (evento: CustomEvent) => {
    const valor = (evento.target as HTMLInputElement).value;
    definirComandoSQL(valor);
  };

  const paraCarregamento = () => {
    if (estadoCarregamento == true) {
      definirCarregamento(false);
    } else {
      definirCarregamento(true);
    }
    console.log(BancoItens);
  };

  const limparTabelas = async () => {
    try {
      await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
        for (const tabela of tabelas) {
          const resultado = await db?.query(`DELETE FROM ${tabela};`);
        }
      });

      await carregaDados();

      recarregarPagina();
    } catch (erro) {
      console.log(erro);
    }
  };

  const testarArbitrario = async () => {
    try {
      definirCarregamento(true);
    } catch (erro) {
      console.log(erro);
    } finally {
      definirCarregamento(false);
    }
  };

  const mostraBanco = async () => {
    await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
      for (const tabela of tabelas) {
        console.log(tabela.toUpperCase());
        const resultado = await db?.query(`SELECT * FROM ${tabela};`);
        console.log(resultado);
      }
    });
  };

  const insercao = async () => {
    const comandosSQL = [
      `INSERT OR REPLACE INTO EXECUCAO (ID, DESCRICAO)
      VALUES (1, 'Padrão'), (2, 'Livre'), (3, 'Reação'), (4, 'Completa'), (999, 'Outros');`,
      `INSERT OR REPLACE INTO ALCANCE (ID, DESCRICAO)
      VALUES (1, 'Pessoal'), (2, 'Toque'), (3, 'Curto'), (4, 'Médio.'), (5, 'Longo '), (6, 'Ilimitado '), (999, 'Outros');`,
      `INSERT OR REPLACE INTO MANA(ID, ICONE, DESCRICAO)
      VALUES (1,'🔴', 'Vermelho'), (2,'⚫', 'Preto'), (3,'⚪', 'Branco'), (4,'🟢', 'Verde'), 
      (5,'🔵', 'Azul'),(6,'🟣', 'Roxo'), (998, 'x', 'Nenhum'), (999,'Ø','Outro')`,
      `INSERT OR REPLACE INTO NIVEL (ID, NIVEL)
      VALUES (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5'), (6, '6'), (999, 'Ø');`,
      `INSERT OR REPLACE INTO NATUREZA(ID, ICONE, DESCRICAO)
      VALUES (1,'🙏', 'Divino'), (2,'✨', 'Arcana'), (998, 'x', 'Nenhum'), (999,'Ø','Outro')`,
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

    await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
      for (const comando of comandosSQL) {
        await db?.query(comando);
      }
    });
  };

  const navegar = useHistory();
  const voltarMagias = () => {
    navegar.goBack();
  };

  return (
    <IonPage>
      <TituloBotaoVoltar titulo="Assistente Dev" icone={build} />
      <IonContent color="tertiary">
        <IonCard color="warning">
          <IonCardContent>
            <div className="ion-text-center">
              <p>
                <IonIcon style={{ fontSize: "3rem" }} icon={warning} />
              </p>
              <p>
                <IonText>
                  <p style={{ fontWeight: "bold" }}>
                    Você entrou no Menu Do Desenvolvedor! Prossiga apenas se
                    estiver absolutamente certo do que está fazendo.
                  </p>
                  <br></br>
                  <p style={{ fontWeight: "bold" }}>Você foi avisado</p>
                </IonText>
              </p>
              <IonButton onClick={voltarMagias}>
                <IonLabel>Sair</IonLabel>
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard color="secondary">
          <IonCardContent>
            <IonButtons>
              <IonButton onClick={limparTabelas}>
                <IonIcon
                  slot="start"
                  className="icon-large"
                  icon={trashBin}
                ></IonIcon>
                <IonLabel>Limpa Tab</IonLabel>
              </IonButton>

              <IonButton onClick={deletarTabela}>
                <IonIcon
                  slot="start"
                  className="icon-large"
                  icon={trash}
                ></IonIcon>
                <IonLabel>Deleta Tab</IonLabel>
              </IonButton>
            </IonButtons>
          </IonCardContent>
        </IonCard>

        <IonCard color="secondary">
          <IonCardContent>
            <IonButtons>
              <IonButton onClick={testarArbitrario}>
                <IonIcon
                  slot="start"
                  className="icon-large"
                  icon={bug}
                ></IonIcon>
                <IonLabel>Wild Card</IonLabel>
              </IonButton>
              <IonButton onClick={mostraBanco}>
                <IonIcon
                  slot="start"
                  className="icon-large"
                  icon={server}
                ></IonIcon>
                <IonLabel>Ver Banco</IonLabel>
              </IonButton>
            </IonButtons>
          </IonCardContent>
        </IonCard>

        <IonCard color="secondary">
          <IonCardContent>
            <IonButtons>
              <IonButton onClick={executaSQL}>
                <IonIcon
                  slot="start"
                  className="icon-large"
                  icon={serverOutline}
                ></IonIcon>
                <IonLabel>Executa SQL</IonLabel>
              </IonButton>
            </IonButtons>
            <IonTextarea
              autoGrow={true}
              onIonInput={capturaComandoSQL}
              placeholder="Insira o comando SQL"
            ></IonTextarea>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader color="light">Resultado SQL</IonCardHeader>
          <div>
            {dadosSQL
              ? Object.entries(dadosSQL).map(([chave, valor]) => (
                  <div
                    key={chave}
                    style={{
                      backgroundColor: "black",
                      color: "#008000",
                      paddingBottom: "0.5rem",
                      paddingTop: "0.5rem",
                      paddingRight: "0.5rem",
                      paddingLeft: "1rem",
                    }}
                  >
                    <strong>{chave}:</strong> {JSON.stringify(valor, null, 2)}
                    <br></br>
                  </div>
                ))
              : null}
          </div>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AssistenteDev;
