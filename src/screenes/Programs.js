import React, {useEffect, useState} from "react";
import axios from 'axios';
import defaultBackground from "../default-background.jpeg";

const Programs = ({ configurationId, width, height }) => {
    const [programs, setPrograms] = useState([])
    const background = localStorage.getItem('background');
    const [data, setData] = useState({});
    const [isProgramOpen, setIsProgramOpen] = useState(false);
    const handleProgramClick = (id) => {
        setIsProgramOpen(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/programs/${id}`)
                setData(response.data.payload[0]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData().then();
    };
    useEffect(() => {
        axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/programs`)
            .then(response => setPrograms(response.data.items))
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
                    <div className={'program-list'}>
                        {programs.map(program => (
                            <div key={program.id} className={'program'}>
                                <div className={'program-icon'}
                                     onClick={()=>handleProgramClick(program.id)}
                                     style={{
                                         width: '100px',
                                         height: '100px',
                                         backgroundImage: `url(${process.env.PUBLIC_URL}/${program.icon_path})`
                                     }}></div>
                                <h6 className={'program-name'}>{program.name}</h6>
                            </div>
                        ))}
                    </div>
                    {isProgramOpen &&
                        <div className={'confirm'}>
                            <div className={'icon-mode'} onClick={() => setIsProgramOpen(false)}>
                                <i className={'icon-mode mdi mdi-close'}></i>
                            </div>
                            <div>Выполнен запуск программы {data.name} по пути {data.path1}</div>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export {Programs};