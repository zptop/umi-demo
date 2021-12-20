import React from 'react';
import List from '../../components/invoice-model/list';
class CarForm extends React.Component {
  render() {
    return (
      <div>
        <List
          transportType="1"
          invoiceDetailPath="/invoice/carDetail"
          formName="/car/form"
        />
      </div>
    );
  }
}

export default CarForm;
