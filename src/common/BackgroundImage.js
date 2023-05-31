import React from 'react';

const BackgroundImage = ({ onChange }) => {
    const handleButtonClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                localStorage.setItem('background', reader.result);
                onChange(reader.result);
            };
        };
        input.click();
    };
    return (
        <div onClick={handleButtonClick} className={'icon-mode'}>
            <i className={'mdi mdi-monitor-screenshot'} title={'Обои рабочего стола'}></i>
        </div>
    );
};

export {BackgroundImage};