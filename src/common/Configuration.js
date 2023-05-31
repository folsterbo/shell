import React, {useEffect, useState} from "react";
import axios from "axios";
import {ThemeToggle} from "./ThemeToggle";
import {BackgroundImage} from "./BackgroundImage";

const Configuration = ({onConfigurationChange}) => {
    const [background, setBackground] = useState(localStorage.getItem('background'));
    const [update, setUpdate] = useState(0);
    const [configurationsList, setConfigurationsList] = useState([]);
    const [changeConfigMode, setChangeConfigMode] = useState(false);
    const [addConfigMode, setAddConfigMode] = useState(false);
    const [editConfigMode, setEditConfigMode] = useState(false);
    const [is_night_mode, setIsNightMode] = useState(0);
    const [configuration, setConfiguration] = useState({
        id: null,
        configuration_name: "",
        width: 1920,
        height: 1024,
        desktop_wallpaper_path: null,
        is_night_mode: 0,
        created_at: null,
        updated_at: null,
        deleted_at: null
    });
    const [configuration_id, setConfigurationId] = useState(0);
    const handleDeleteConfiguration = (id) => {
        const fetchData = async () => {
            await axios.delete(`http://localhost:8181/api/v1/shell/configurations/${id}`)
                .catch(error => console.error(error));
        };
        fetchData().then(() => setUpdate(update + 1));
    };
    const handleCreateMode = () => {
        setChangeConfigMode (true)
        setAddConfigMode(true)
    };
    const handleEditConfiguration = (id) => {
        setConfigurationId(id)
        setChangeConfigMode (true)
        setEditConfigMode (true)
    };
    const handleInputChange = event => {
        const {name, value} = event.target;
        setConfiguration(prevData => ({...prevData, [name]: value}));
    };
    const handleCreateSubmit = (event) => {
        event.preventDefault();
        const newConfigurationData = {data: configuration}

        const fetchData = async () => {
            await axios.post(`http://localhost:8181/api/v1/shell/configurations`, newConfigurationData)
                .catch(error => console.error(error));
        };
        fetchData().then(() => setUpdate(update + 1));
        setAddConfigMode(false)
        setChangeConfigMode (false)
    };
    const handleEditSubmit = (event) => {
        event.preventDefault();
        const newConfigurationData = {data: configuration}
        const fetchData = async () => {
            await axios.put(`http://localhost:8181/api/v1/shell/configurations/${configuration_id}`, newConfigurationData)
                .catch(error => console.error(error));
        };
        fetchData().then(() => setUpdate(update + 1));
        setEditConfigMode(false)
        setChangeConfigMode (false)
    };
    const handleConfigurationChange = (id) => {
        setConfigurationId(id);
        onConfigurationChange(id);
    };
    const handleNightMode = () => {
        if (is_night_mode === 0) {
            setIsNightMode(1);
            configuration.is_night_mode = 1;
        } else {
            setIsNightMode(0);
            configuration.is_night_mode = 0;
        }
        console.log(is_night_mode)
    };
    useEffect(() => {
        localStorage.setItem('background', background);
    }, [background]);
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:8181/api/v1/shell/configurations')
                .then(response => {
                    setConfigurationsList(response.data.items)
                })
                .catch(error => {
                    console.log(error);
                });
        };
        fetchData().then();
    }, [update]);
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`http://localhost:8181/api/v1/shell/configurations/${configuration_id}`)
                .then(response => setConfiguration(response.data.payload[0]))
                .catch(error => {
                    console.log(error);
                });
        };
        fetchData().then();
    }, [configuration_id]);
    return (
        <div>
            <BackgroundImage onChange={setBackground}/>
            <div className={'table'}>
                <div className={'table-header'}>
                    <div className={'header-cell'} style={{width: '30px'}}></div>
                    <div className={'header-cell'} style={{width: '250px'}}>Наименование</div>
                    <div className={'header-cell'} style={{width: '160px'}}>Ширина экрана (px)</div>
                    <div className={'header-cell'} style={{width: '150px'}}>Высота экрана (px)</div>
                    <div className={'header-cell'} style={{width: '40px'}}>Тема</div>
                    <div className={'header-cell'} style={{width: '30px'}}></div>
                    <div className={'header-cell'} style={{width: '30px'}}></div>
                </div>
                <div className={'table-body'}>
                    {configurationsList.map((item) => (
                        <div key={item.id} className={`table-row ${item.id === 1 && ('active')}`} onClick={() => handleConfigurationChange(item.id)}>
                            <div className={'cell'} style={{width: '30px'}}>
                                {item.id === 1 && <i className={'mdi mdi-check-bold'} title={'Активная конфигурация'}></i>}
                            </div>
                            <div className={'cell'} style={{width: '250px'}}>{item.configuration_name}</div>
                            <div className={'cell'} style={{width: '160px'}}>{item.width}</div>
                            <div className={'cell'} style={{width: '150px'}}>{item.height}</div>
                            <div className={'cell'} style={{width: '40px'}}>
                                {item.is_night_mode === 0 && <i className={'mdi mdi-white-balance-sunny'} title={'Светлая тема'}></i>}
                                {item.is_night_mode === 1 && <i className={'mdi mdi-moon-waning-crescent'} title={'Темная тема'}></i>}
                            </div>
                            <div onClick={() => handleDeleteConfiguration(item.id)} style={{width: '30px'}}><i className={'mdi mdi-trash-can-outline'} title={'Удалить'}></i></div>
                            <div onClick={() => handleEditConfiguration(item.id)} style={{width: '30px'}}><i className={'mdi mdi-pencil-outline'} title={'Редактировать'}></i></div>
                        </div>
                    ))}
                </div>
            </div>
            {!changeConfigMode && <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div className={`btn btn-add`} onClick={handleCreateMode} style={{marginTop: '8px'}}>
                    <i className={'mdi mdi-plus'} style={{fontSize: '24px', marginRight: '4px'}}></i>
                    Добавить конфигурацию
                </div>
            </div>}
            {changeConfigMode && (
                <div className={'table-row-edit'}>
                    <div className={'cell'} style={{width: '30px'}}></div>
                    <div className={'cell'} style={{width: '250px'}}>
                        <input
                            type="text"
                            placeholder={'Наименование'}
                            name="configuration_name"
                            value={configuration.configuration_name || ''}
                            onChange={handleInputChange}
                            className={'input'}
                            style={{marginRight: '16px'}}
                        />
                    </div>
                    <div className={'cell'} style={{width: '160px'}}>
                        <input type="number" max={16000} name="width" value={configuration.width || ''} onChange={handleInputChange}
                               className={'input'}
                               style={{width: '70px'}}/>
                    </div>
                    <div className={'cell'} style={{width: '150px'}}>
                        <input type="number" max={16000} name="height" value={configuration.height || ''} onChange={handleInputChange}
                               className={'input'}
                               style={{width: '70px'}}/>
                    </div>
                    <div className={'cell'} style={{width: '40px'}}>
                        <ThemeToggle nightMode={configuration.is_night_mode} onToggle={handleNightMode}/>
                    </div>
                    <div className={'cell'} style={{width: '30px'}}>
                        {addConfigMode && (<div className={'icon-mode'} style={{marginRight: '8px'}} onClick={handleCreateSubmit}>
                            <i className={'mdi mdi-content-save-outline'} title={'Создать конфигурацию'}></i>
                        </div>)}
                        {editConfigMode && (<div className={'icon-mode'} style={{marginRight: '8px'}} onClick={handleEditSubmit}>
                            <i className={'mdi mdi-content-save-outline'} title={'Создать конфигурацию'}></i>
                        </div>)}
                    </div>
                    {/*<div className={'cell'} style={{width: '30px'}}></div>
                    <div style={{display: 'flex', alignItems: 'center', marginRight: '8px'}}>
                        <div style={{marginRight: '4px'}}>X:</div>
                        <input type="number" max={16000} name="width" value={configuration.width || ''} onChange={handleInputChange}
                               className={'input'}
                               style={{width: '70px'}}/>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: '4px'}}>Y:</div>
                        <input type="number" max={16000} name="height" value={configuration.height || ''} onChange={handleInputChange}
                               className={'input'}
                               style={{width: '70px'}}/>
                    </div>
                    {addConfigMode && (<div className={'icon-mode'} style={{marginRight: '8px'}} onClick={handleCreateSubmit}>
                        <i className={'mdi mdi-content-save-outline'} title={'Создать конфигурацию'}></i>
                    </div>)}
                    {editConfigMode && (<div className={'icon-mode'} style={{marginRight: '8px'}} onClick={handleEditSubmit}>
                        <i className={'mdi mdi-content-save-outline'} title={'Создать конфигурацию'}></i>
                    </div>)}*/}

                </div>
            )}
        </div>
    );
};

export {Configuration};