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
        await sqlite.current.isConnection("DomoBD", false)
      ).result;

      if (consistencia.result && verificacaoConexao) {
        db.current = await sqlite.current.retrieveConnection("DomoBD", false);
      } else {
        db.current = await sqlite.current.createConnection(
          "DomoBD",
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
      CREATE TABLE IF NOT EXISTS MAGIA (
        ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        ID_MANA INTEGER, 
        ID_NIVEL INTEGER, 
        ID_NATUREZA INTEGER, 
        ID_ESCOLA INTEGER, 
        ID_EXECUCAO INTEGER,
        ALVO TEXT,
        ID_AREA INTEGER, 
        OBSAREA TEXT,
        ID_ALCANCE INTEGER,
        ID_DURACAO INTEGER, 
        ID_RESISTENCIA INTEGER, 
        OBSRESISTENCIA TEXT,
        DESCRICAO TEXT, 
        MECANICA TEXT, 
        NOMEALTERNATIVO TEXT, 
        NOMEVERDADEIRO TEXT,
        NOME TEXT
    );

      CREATE TABLE IF NOT EXISTS APRIMORAMENTO (
      ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      ID_MAGIA INTEGER,
      CUSTO INTEGER,
      APRIMORAMENTO TEXT,
      TRUQUE INTEGER
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
    );`;

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
