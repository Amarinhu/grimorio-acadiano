import React from "react";
import { IonButton } from '@ionic/react'
import './BotaoAdicionar.css'
import { useHistory } from 'react-router-dom'

interface BotaoAdicionar{
    caminho: string;
}

const BotaoAdicionarItem: React.FC<BotaoAdicionar> = ({ caminho }) => {
    const navegar = useHistory()
    
    const caminhoNavegar = () =>
    {
        navegar.push(caminho);
    };

    return (
        <IonButton onClick={caminhoNavegar} className="custom-botao" color="tertiary">+</IonButton>
    );
};

export default BotaoAdicionarItem;