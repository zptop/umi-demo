import React from 'react';
import { Link } from 'umi';
import { Card, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './login.less';
import { connect } from 'dva';
import md5 from 'js-md5';
import sha1 from 'js-sha1';
import { getRandomStr } from '../../util/tools'

const namespace = 'user';

// const mapStateToProps = (state) => {
//     const isLogin = state[namespace].isLogin;
//     return {
//         isLogin
//     }
// }

const mapDispatchProps = (dispatch) => {
    return {
        doLoginFn: (value) => {
            dispatch({
                type: namespace + '/doLogin',
                value
            })
        }
    }
}

const mobileValidator = (rule, val, callback) => {
    if (!val) callback();
    if (!/^1[3456789]\d{9}$/.test(val)) {
        return Promise.reject('手机号码格式不正确');
    }
    return Promise.resolve();
};

@connect(null, mapDispatchProps)

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const onFinish = (values) => {
            let copyValues = { ...values }
            copyValues = {
                ...copyValues,
                password: getRandomStr() +
                    sha1(md5(copyValues.password.toString())) +
                    getRandomStr()
            }
            this.props.doLoginFn(copyValues);
        };
        return (
            <div>
                <div className={styles.login_page_container}>
                    <div className={styles.top}>
                        <img src={require('../../assets/logo.png')} />
                        水陆联运网撮合交易平台
                    </div>
                    <div className={styles.login_form}>
                        <Card title="水陆联运网" bordered={false} style={{ width: 380 }}>
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: '账号不能为空' }, { validator: mobileValidator }]}
                                >
                                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入手机号" maxLength={11} />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: '密码不能为空' }]}
                                >
                                    <Input
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="请输入密码"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <a className="login-form-forgot" href="">忘记密码</a>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" block htmlType="submit">登录</Button>
                                    <Link className={styles.reg_btn} to="/registed">注册</Link>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                    <p className={styles.screen_notice}>
                        请使用IE10以上浏览器打开，推荐使用chrome、firefox
                        等现代浏览器。屏幕分辨率不小于1360x760。
                    </p>
                </div>
                <div className={styles.copyright}>

                    <p>Copyright ©2011-2020 www.ship56.net All Rights Reserved.</p>
                    <div>
                        <a
                            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32058202010569"
                            target="_blank"
                            rel="noopener"
                        >
                            <img src="http://static.ship56.net/img/ghs.png" />
                        </a>
                        <a
                            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32058202010569"
                            target="_blank"
                            rel="noopener"
                        >苏公网安备 32058202010569号</a>
                        增值电信业务经营许可证苏B1-20140002 增值电信业务经营许可证苏B2-20140003 苏ICP备12023245号-1
                    </div>

                </div>
            </div>
        )
    }
}

export default Login;