const siderMenu = [
    {
        key: '/car/index',
        icon: 'iconcheliangyundan',
        func_id: 2100,
        title: '车辆运单'
    },
    {
        key: '/ship/index',
        icon: 'iconcheliangyundan',
        func_id: 2200,
        title: '船舶运单'
    },
    {
        key: '/invoice/car',
        icon: 'iconcheliangfapiao',
        func_id: 3100,
        title: '车辆发票'
    },
    {
        key: '/invoice/ship',
        icon: 'iconcheliangfapiao',
        func_id: 3200,
        title: '船舶发票'
    },
    {
        key: '/apply/index',
        icon: 'iconfukuanshenqingshenpi',
        func_id: 4100,
        title: '付款申请审批'
    },
    {
        key: '/apply/history',
        icon: 'iconfukuanshenqinggenzong',
        func_id: 4200,
        title: '付款申请跟踪'
    },
    {
        key: '/wallet/index',
        icon: 'iconqiyeqianbao',
        func_id: 5100,
        title: '企业钱包'
    },
    {
        key: '/wallet/coupon',
        icon: 'iconwodeyouhuiquan',
        func_id: 5120,
        title: '我的优惠券'
    },
    {
        key: '/CarrierInfo/lists',
        icon: 'iconsijiguanli',
        func_id: 5300,
        title: '司机管理'
    },
    {
        key: '/shipowner/index',
        icon: 'iconchuandongguanli',
        func_id: 5400,
        title: '船东管理'
    },
    {
        key: '/system',
        icon: 'iconchuandongguanli',
        func_id: 6100,
        title: '系统管理',
        sub_items: [
            {
                key: '/system/account',
                icon: 'iconzizhanghaoguanli',
                func_id: 6110,
                title: '子账号管理'
            },
            {
                key: '/system/role',
                icon: 'iconjiaose',
                func_id: 6120,
                title: '角色管理'
            },
            {
                key: '/system/apply',
                icon: 'iconfukuanshenpiliucheng',
                func_id: 6130,
                title: '付款审批流程'
            },
            {
                key: '/system/profile',
                icon: 'iconqiyeguanli',
                func_id: 6140,
                title: '企业信息'
            },
        ]
    },
];

export default siderMenu;