import React, { useState, useEffect } from 'react';
import { Layout, Dropdown, Menu, Tabs } from 'antd';
import { forEach, hasChild } from '../util/tools';
import { Link, history } from 'umi';
import { logout, checkLogin } from '../sevice/user';
import styles from './index.less';
import siderMenu from '../router/siderMenu';
import children from '../router/children';
import { connect } from 'dva';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;
import {
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  createFromIconfontCN,
  DownOutlined,
} from '@ant-design/icons';
const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_1595958_oyt95e2w0ng.js'],
});

const namespace = 'user';
const mapStateToProps = state => {
  return {
    userInfo: state[namespace].userInfo,
    access: state[namespace].access,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    checkLoginFn: value => {
      dispatch({
        type: namespace + '/checkLogin',
        value,
      });
    },
  };
};

/**
 * header下拉菜单
 */
const downClick = ({ key }) => {
  if (key == 1) {
    console.log(key);
  } else {
    logout().then(res => {
      if (res.code == 0) {
        history.push('/login');
        localStorage.removeItem('x-auth-token');
      }
    });
  }
};
const menu = (
  <Menu onClick={downClick}>
    <Menu.Item key="1">修改密码</Menu.Item>
    <Menu.Item key="2">退出登录</Menu.Item>
  </Menu>
);

/**
 * 构建左侧菜单方法
 */
const makeSiderMenu = data => {
  return data.map(item => {
    if (item.sub_items) {
      return (
        <SubMenu
          key={item.key}
          title={
            <span>
              <IconFont type={item.icon} />
              <span>{item.title}</span>
            </span>
          }
        >
          {makeSiderMenu(item.sub_items)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.key}>
          <Link to={item.key}>
            <IconFont type={item.icon} />
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
      );
    }
  });
};

const BasicLayout = props => {
  const [collapsed, setScollapsed] = useState(false);
  const [menuList, setMenuList] = useState([]);

  /**
   * 接口返回的菜单和siderMenu中的路由比对,得到左侧菜单
   */
  const getMenuByRouter = (list, access) => {
    var res = [],
      ind = 0,
      arr = [];
    if (list && list.length && access && access.length) {
      res = [...list].filter(x =>
        [...access].some(function(y, index) {
          if (x.sub_items && y.sub_items) {
            arr = getMenuByRouter(children, y.sub_items);
            ind = index;
          }
          return y.func_id == x.func_id;
        }),
      );
    }
    // if (ind && arr) {
    //     res[ind].sub_items = arr;
    // }
    return res;
  };

  useEffect(() => {
    let menuList = getMenuByRouter(siderMenu, props.access);
    setMenuList(menuList);
  }, [props.access]);

  const toggle = () => {
    setScollapsed(!collapsed);
  };
  const onChange = () => {};

  return (
    <Layout>
      <Sider
        width={256}
        style={{
          minHeight: '100vh',
          color: 'white',
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className={styles.logo_con}>
          <img src={require('../assets/logo.png')} />
          水陆联运网
        </div>
        <Menu defaultSelectedKeys={['/car/index']} mode="inline" theme="dark">
          {makeSiderMenu(menuList)}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            textAlign: 'center',
            padding: 0,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: toggle,
            },
          )}
          <span>
            <IconFont type="iconqiye" />
            &nbsp;&nbsp;{props.userInfo.COMPANYNAME}
          </span>
          <Dropdown overlay={menu}>
            <a
              className={styles.ant_dropdown_link}
              onClick={e => e.preventDefault()}
            >
              您好, {props.userInfo.SHIPPERNAME}&nbsp;&nbsp;
              <DownOutlined />
            </a>
          </Dropdown>
        </Header>
        <Tabs defaultActiveKey="1" onChange={onChange}></Tabs>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              background: '#fff',
              minHeight: 360,
            }}
          >
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          撮合交易后台系统react版本 ©2020 Created by zp_top
        </Footer>
      </Layout>
    </Layout>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(BasicLayout);
