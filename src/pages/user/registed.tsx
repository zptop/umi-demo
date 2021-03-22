import React, { useState } from 'react';
import config from '../../../config/config';
import { timeCutdown } from '../../util/tools';
import { getCode } from '../../sevice/user';
import {
    Form,
    Input,
    Row,
    Col,
    Button,
    message
} from 'antd';
import './registed.less';
import { connect } from 'dva';
const namespace = 'user';
const mapDispatchProps = (dispatch: any) => {
    return {
        doRegFn: (value: any) => {
            dispatch({
                type: namespace + '/doreg',
                value
            })
        }
    }
}

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const Registed = (props: any) => {
    const [form] = Form.useForm();
    const [imgUrl, setImgUrl] = useState(config.baseUrl.dev + "/login/regpicverify");
    let [sendSmsText, setSendSmsText] = useState('获取验证码');
    let [sendSmsTextDisabled, setSendSmsTextDisabled] = useState(false);
    const onFinish = (values: any) => {
        props.doRegFn(values);
    };

    const getSmsTextFn = () => {
        let mobile = form.getFieldValue('mobile'),
            code = form.getFieldValue('code');
        if (!mobile) {
            message.warning("注册手机号不能为空");
            return false;
        } else if (!/^1[3-9]\d{9}$/.test(mobile)) {
            message.warning("手机号格式不正确");
            return false;
        }
        if (!code) {
            message.warning("图形验证码不能为空");
            return false;
        }
        getCode({ mobile, code }).then((res: any): void => {
            if (res.code == 0) {
                var t = timeCutdown(60, 1000, (n: any): void => {
                    if (n <= 0) {
                        setSendSmsTextDisabled(false);
                        setSendSmsText("重新获取");
                    } else {
                        setSendSmsTextDisabled(true);
                        setSendSmsText("重新获取(" + n + ")");
                    }
                });
            } else {
                message.warning(res.msg || '系统错误');
                form.setFieldsValue({'code':''});
                setImgUrl(imgUrl + "?t=" + new Date());
            }
        }).catch((err: string) => {
            message.warning(err);
        });
    };

    const validateCompanyName = (rule: any, val: string, callback: any): Promise<any> => {
        let r_spec = new RegExp(
            "[`~!@#$^&*=|{}':;',\\[\\].<>《》/?~！@#￥……&*——|{}【】‘；：”“'。，、？ ]"
        );
        if (val && val.length < 5) {
            return Promise.reject("公司名称输入不规范(5-40位)");
        } else if (val && r_spec.test(val)) {
            return Promise.reject("公司名称不能包含特殊字符");
        } else {
            return Promise.resolve();
        }
    };
    const mobileValidator = (rule: any, val: string, callback: any): Promise<any> => {
        if (val && !/^1[3456789]\d{9}$/.test(val)) {
            return Promise.reject('手机号码格式不正确');
        }
        return Promise.resolve();
    };
    //验证密码
    const verify_password = (rule: any, val: string, callback: any): Promise<any> => {
        let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
        var regTeShu = new RegExp(reg);

        if (val && !regTeShu.test(val)) {
            return Promise.reject("密码长度6~16位，包含数字、大小写字母、符号中的至少2种");
        } else {
            return Promise.resolve();
        }
    };

    return (
        <div className="registed-content">
            <div className="top">
                <img src={require('../../assets/logo.png')} />
                        水陆联运网撮合交易平台
            </div>
            <div className="coupon-tips">
                注册即
            <span>送6000元！</span>综合成本低至
            <span>2.86%！</span>
            </div>
            <h3>注册</h3>
            <Form
                className="registed-form"
                {...formItemLayout}
                form={form}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="company_name"
                    label="公司名称"
                    rules={[
                        {
                            required: true,
                            message: '公司名称不能为空',
                        },
                        {
                            validator: validateCompanyName
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="mobile"
                    label="注册手机号"
                    rules={[
                        {
                            required: true,
                            message: '手机号不能为空'
                        },
                        {
                            validator: mobileValidator
                        }
                    ]}
                >
                    <Input maxLength={11} />
                </Form.Item>


                <Form.Item label="图形验证码" className="code">
                    <Row gutter={24}>
                        <Col span={19}>
                            <Form.Item
                                name="code"
                                noStyle
                                rules={[
                                    {
                                        required: true,
                                        message: '图形验证码不能为空',
                                    },
                                ]}
                            >
                                <Input maxLength={4} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <img src={imgUrl} className="code-img" onClick={_ => setImgUrl(imgUrl + "?t=" + new Date())} />
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item label="短信验证码" className="code">
                    <Row gutter={24}>
                        <Col span={19}>
                            <Form.Item
                                name="smscode"
                                noStyle
                                rules={[
                                    {
                                        required: true,
                                        message: '短信验证码不能为空',
                                    },
                                ]}
                            >
                                <Input maxLength={4} />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Button className="code-img btn" disabled={sendSmsTextDisabled} onClick={getSmsTextFn}>{sendSmsText}</Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '密码不能为空',
                        },
                        {
                            validator: verify_password
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="repassword"
                    label="密码确认"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请再次输入密码',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule: any, value: string) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('两次输入的密码不一致');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="invite_code"
                    label="邀请码"
                >
                    <Input maxLength={4} />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">注册</Button>
                </Form.Item>
            </Form>
            <div className="copyright">
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

export default connect(null, mapDispatchProps)(Registed);