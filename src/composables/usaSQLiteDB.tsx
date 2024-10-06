import { useEffect, useRef, useState } from "react";
import {
  SQLiteDBConnection,
  SQLiteConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const usaSQLiteDB = () => {
  const db = useRef<SQLiteDBConnection>();
  const sqlite = useRef<SQLiteConnection>();
  const [iniciado, defineIniciado] = useState<boolean>(false);

  useEffect(() => {
    const inicializaDB = async () => {
      if (sqlite.current) return;

      sqlite.current = new SQLiteConnection(CapacitorSQLite);
      const consistencia = await sqlite.current.checkConnectionsConsistency();
      const verificacaoConexao = (
        await sqlite.current.isConnection("AssistenteT20", false)
      ).result;

      if (consistencia.result && verificacaoConexao) {
        db.current = await sqlite.current.retrieveConnection("AssistenteT20", false);
      } else {
        db.current = await sqlite.current.createConnection(
          "AssistenteT20",
          false,
          "no-encryption",
          1,
          false
        );
      }
    };

    inicializaDB().then(() => {
      iniciaTabelas();
      defineIniciado(true);
    });
  }, []);

  const executarAcaoSQL = async (
    acao: (db: SQLiteDBConnection | undefined) => Promise<void>
  ) => {
    try {
      await db.current?.open();
      await acao(db.current);
    } catch (erro) {
      console.log(erro);
    } finally {
      try {
        (await db.current?.isDBOpen())?.result && (await db.current?.close());
      } catch (erro) {
        console.log(erro);
      }
    }
  };

  const iniciaTabelas = async () => {
    await executarAcaoSQL(async (db: SQLiteDBConnection | undefined) => {
      const sqlCriarTabelas = `
      CREATE TABLE IF NOT EXISTS GRIMORIO (
        ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        NOME TEXT,
        USUARIO TEXT,
        FOTO TEXT
      );

      CREATE TABLE IF NOT EXISTS EXECUCAO (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS ALCANCE (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS AREA (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS DURACAO (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS RESISTENCIA (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS ALVO (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS MANA (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      ICONE TEXT,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS NIVEL (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      NIVEL TEXT
    );

      CREATE TABLE IF NOT EXISTS NATUREZA (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      ICONE TEXT,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS ESCOLA (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      ICONE TEXT,
      DESCRICAO TEXT
    );

      CREATE TABLE IF NOT EXISTS MAGIA (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      ID_MANA INTEGER, 
      OUTROMANA TEXT, 
      ID_NIVEL INTEGER, 
      OUTRONIVEL TEXT,
      ID_NATUREZA INTEGER,
      OUTRONATUREZA TEXT, 
      ID_ESCOLA INTEGER, 
      OUTROESCOLA TEXT,
      ID_EXECUCAO INTEGER,
      OUTROEXECUCAO TEXT,
      ALVO TEXT,
      ID_AREA INTEGER, 
      OBSAREA TEXT,
      ID_ALCANCE INTEGER,
      OUTROALCANCE TEXT,
      ID_DURACAO INTEGER, 
      OUTRODURACAO TEXT,
      ID_RESISTENCIA INTEGER, 
      OUTRORESISTENCIA TEXT,
      OBSRESISTENCIA TEXT,
      DESCRICAO TEXT, 
      MECANICA TEXT, 
      NOMEALTERNATIVO TEXT, 
      NOMEVERDADEIRO TEXT,
      NOME TEXT,
      EFEITO TEXT,
      ORIGEM TEXT,
      ORIGEMSIGLA TEXT,
      ID_SINCRONISMO INTEGER UNIQUE,
      FOREIGN KEY (ID_MANA) REFERENCES MANA(ID),
      FOREIGN KEY (ID_NIVEL) REFERENCES NIVEL(ID),
      FOREIGN KEY (ID_NATUREZA) REFERENCES NATUREZA(ID),
      FOREIGN KEY (ID_ESCOLA) REFERENCES ESCOLA(ID),
      FOREIGN KEY (ID_EXECUCAO) REFERENCES EXECUCAO(ID),
      FOREIGN KEY (ID_AREA) REFERENCES AREA(ID),
      FOREIGN KEY (ID_ALCANCE) REFERENCES ALCANCE(ID),
      FOREIGN KEY (ID_DURACAO) REFERENCES DURACAO(ID),
      FOREIGN KEY (ID_RESISTENCIA) REFERENCES RESISTENCIA(ID)
    );

      CREATE TABLE IF NOT EXISTS MAGIAGRIMORIO (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      ID_GRIMORIO INTEGER,
      ID_MAGIA INTEGER,
      FOREIGN KEY (ID_MAGIA) REFERENCES MAGIA(ID),
      FOREIGN KEY (ID_GRIMORIO) REFERENCES GRIMORIO(ID)
    );

      CREATE TABLE IF NOT EXISTS APRIMORAMENTO (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      ID_MAGIA INTEGER,
      CUSTO INTEGER,
      DESCRICAO TEXT,
      TRUQUE INTEGER,
      FOREIGN KEY (ID_MAGIA) REFERENCES MAGIA(ID)
    );
    `;

      try {
        const respostaSQL = await db?.execute(sqlCriarTabelas);
        console.log(`res: ${JSON.stringify(respostaSQL)}`);
      } catch (error) {
        console.error("Erro criando tabelas: ", error);
      }
    });
  };

  return { executarAcaoSQL, iniciado, iniciaTabelas};
};

export default usaSQLiteDB;
