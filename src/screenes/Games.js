import React, {useEffect, useState} from "react";
import axios from 'axios';
import defaultBackground from "../default-background.jpeg";
import {Modal} from "../common/Modal";

const Games = ({ configurationId, width, height }) => {
    const [games, setGames] = useState([])
    const [widthCover, setWidthCover] = useState(240);
    const [heightCover, setHeightCover] = useState(150);
    const [showCover, setShowCover] = useState(true);
    const [isGameOpen, setIsGameOpen] = useState(false);
    const [isGameClubOpen, setIsGameClubOpen] = useState(false);
    const background = localStorage.getItem('background');
    const [data, setData] = useState({});
    const [modalActive, setModalActive] = useState(false)
    const [filterActive, setFilterActive] = useState(null)
    const [filterAgeActive, setFilterAgeActive] = useState(null)
    const handleSubmitClick = () => {
        setModalActive(false);
        setIsGameOpen(true)
    };
    const handleSubmitClubClick = () => {
        setModalActive(false);
        setIsGameClubOpen(true)
    };
    const handleGameClick = (id) => {
        setModalActive(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/games/${id}`)
                setData(response.data.payload[0]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData().then();
    };
    useEffect(() => {
        axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/games`)
            .then(response => setGames(response.data.items))
            .catch(error => console.error(error));
    }, [configurationId]);
    function handleFilterGameType(event) {
        if(filterActive === event) {
            setFilterActive(null);
            axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/games`)
                .then(response => setGames(response.data.items))
                .catch(error => console.error(error));
        } else {
            setFilterActive(event);
            setGames(games.filter(item => item.game_type_id === event))
        }
    }
    function handleFilterAge(event) {
        if(filterAgeActive === event) {
            setFilterAgeActive(null);
            axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/games`)
                .then(response => setGames(response.data.items))
                .catch(error => console.error(error));
        } else {
            setFilterAgeActive(event);
            setGames(games.filter(item => item.age_restrictions === event))
        }
    }
    return (
        <>
            <div className={'content'}>
                <div className={'screen-wrapper'}>
                    <div style={{
                        backgroundImage: `url(${background || defaultBackground})`, width: `${width}px`,
                        height: `${height}px`
                    }}
                         className={'screen'}>
                        <div className={'game-list'}>
                            {games.map(game => (
                                <div key={game.id} className={'game'}>
                                    {showCover && (<div className={'game-cover'}
                                                        onClick={()=>handleGameClick(game.id)}
                                                        style={{
                                                            width: `${widthCover}px`,
                                                            height: `${heightCover}px`,
                                                            backgroundImage: `url(${process.env.PUBLIC_URL}/${game.cover_img_path})`
                                                        }}></div>)}
                                    {!showCover && (<div className={'game-icon'}
                                                         onClick={handleGameClick}
                                                         style={{
                                                             width: '100px',
                                                             height: '100px',
                                                             backgroundImage: `url(${process.env.PUBLIC_URL}/${game.icon_path})`
                                                         }}></div>)}
                                    <h6 className={'game-name'}>{game.name}</h6>
                                </div>))}
                        </div>
                        <div style={{position: 'absolute', right: '40px'}}>
                            <h6>Фильтры</h6>
                            <div className={'tabs'}>
                                <div className={`tab info ${filterActive===1 && ('active')}`} onClick={()=>handleFilterGameType(1)}>RPG</div>
                                <div className={`tab info ${filterActive===2 && ('active')}`} onClick={()=>handleFilterGameType(2)}>Стратегия</div>
                                <div className={`tab info ${filterActive===3 && ('active')}`} onClick={()=>handleFilterGameType(3)}>Стрелялка</div>
                            </div>
                            <div className={'tabs'}>
                                <div className={`tab info ${filterAgeActive === 1 && ('active')}`} onClick={()=>handleFilterAge(1)}>0+</div>
                                <div className={`tab info ${filterAgeActive === 6 && ('active')}`} onClick={()=>handleFilterAge(6)}>6+</div>
                                <div className={`tab info ${filterAgeActive === 12 && ('active')}`} onClick={()=>handleFilterAge(12)}>12+</div>
                                <div className={`tab info ${filterAgeActive === 16 && ('active')}`} onClick={()=>handleFilterAge(16)}>16+</div>
                                <div className={`tab info ${filterAgeActive === 18 && ('active')}`} onClick={()=>handleFilterAge(18)}>18+</div>
                            </div>
                        </div>
                        {isGameOpen &&
                            <div className={'confirm'}>
                                <div className={'icon-mode'} onClick={() => setIsGameOpen(false)}>
                                    <i className={'icon-mode mdi mdi-close'}></i>
                                </div>
                                <div>Выполнен запуск игры с личного аккаунта {data.name} по пути {data.path1}</div>
                            </div>}
                        {isGameClubOpen &&
                            <div className={'confirm'}>
                                <div className={'icon-mode'} onClick={() => setIsGameClubOpen(false)}>
                                    <i className={'icon-mode mdi mdi-close'}></i>
                                </div>
                                <div>Выполнен запуск игры с аккаунта клуба {data.name} по пути {data.path1}</div>
                            </div>}
                    </div>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div>
                    <div style={{display: "flex", height: "200px", paddingTop: "100px"}}>Какой аккаунт использовать для запуска игры?</div>

                    <div className={'tabs'}>
                        <div className={'tab info'} onClick={()=>handleSubmitClick()}>Личный аккаунт</div>
                        <div className={'tab info'} onClick={()=>handleSubmitClubClick()}>Аккаунт клуба</div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
export {Games};