import React from "react";

const Login = () => {

    return (
        <div className={'login'}>
            <div className={'login-item'}>
                <div className={'icon-mode'} style={{marginRight: '4px'}}>
                    <i className={'mdi mdi-account-circle-outline'}></i>
                </div>
                Пользователь
            </div>
            <div className={'login-item'}>Сессия</div>
            <div className={'login-item'}>
                <div className={'icon-mode'} style={{marginRight: '4px'}}>
                    <i className={'mdi mdi-currency-usd'}></i>
                </div>
                Баланс
            </div>
        </div>
    );
};

export {Login};