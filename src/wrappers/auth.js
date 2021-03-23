
import { Redirect } from 'umi';

export default (props) => {
    const isLogin = localStorage.getItem('x-auth-token');
    if (isLogin) {
        return <div>{props.children}</div>
    } else {
        localStorage.removeItem('x-auth-token');
        return <Redirect to="/login" />;
    }
}