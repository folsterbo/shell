import {Outlet} from "react-router-dom";
import {Menu} from './Menu';
import {Login} from './Login';

const Layout = () => {
    return (
        <div className={'main-wrapper'}>
            <Menu></Menu>
            <div className={'main-content'}>
                <Login></Login>
                <Outlet>
                </Outlet>
            </div>
        </div>
    );
};

export {Layout};