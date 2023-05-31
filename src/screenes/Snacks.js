import React, {useEffect, useState} from "react";
import axios from 'axios';
import defaultBackground from "../default-background.jpeg";
import {Modal} from "../common/Modal";

const Snacks = ({ configurationId, width, height }) => {
    const [snacks, setSnacks] = useState([])
    const background = localStorage.getItem('background');
    const [modalActive, setModalActive] = useState(false)
    const [data, setData] = useState({});
    const handleSnackClick = (id) => {
        setModalActive(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/goods/${id}`)
                setData(response.data.payload[0]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData().then();
    };
    useEffect(() => {
        axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/goods`)
            .then(response => setSnacks(response.data.items.filter(item => item.good_type_id === 2)))
            .catch(error => console.error(error));
    }, [configurationId]);
    return (
        <div className={'content'}>
            <div className={'screen-wrapper'}>
                <div style={{
                    backgroundImage: `url(${background || defaultBackground})`,
                    width: `${width}px`,
                    height: `${height}px`
                }}
                     className={'screen'}>
                    <div className={'game-list'}>
                        {snacks.map(snack => (
                            <div key={snack.id} className={'game'}>
                                <div className={'game-cover'}
                                     onClick={()=>handleSnackClick(snack.id)}
                                     style={{
                                         width: '150px',
                                         height: '200px',
                                         backgroundImage: `url(${process.env.PUBLIC_URL}/${snack.cover_file_path})`
                                     }}></div>
                                <h6 className={'game-name'}>{snack.id} {snack.description}</h6>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={'game-cover'}
                     style={{
                         width: '500px',
                         height: '300px',
                         backgroundImage: `url(${process.env.PUBLIC_URL}/${data.cover_file_path})`
                     }}></div>
            </Modal>
        </div>
    );
};

export {Snacks};