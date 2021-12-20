import React from 'react';
import List from '../../components/invoice-model/list';
class ShipForm extends React.Component {
  render() {
    return (
      <div>
        <List
          transportType="2"
          invoiceDetailPath="/invoice/shipDetail"
          formName="/ship/form"
        />
      </div>
    );
  }
}

export default ShipForm;
