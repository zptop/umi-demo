import { useState } from 'react';
import AuditList from './audit-list';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

export default function ApplyIndex() {
  const [curTabKey, setCurTabKey] = useState('1');
  const changeTabs = activeKey => {
    setCurTabKey(activeKey);
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={changeTabs}>
        <TabPane tab="待审核" key="1">
          {curTabKey === '1' ? <AuditList flag="wait_list" /> : <div></div>}
        </TabPane>
        <TabPane tab="已审核" key="2">
          {curTabKey === '2' ? <AuditList flag="finish_list" /> : <div></div>}
        </TabPane>
        <TabPane tab="问题单处理" key="3">
          {curTabKey === '3' ? <AuditList flag="special_list" /> : <div></div>}
        </TabPane>
      </Tabs>
    </div>
  );
}
