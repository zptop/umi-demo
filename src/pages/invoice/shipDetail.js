import Detail from '../../components/invoice-model/detail.js';
const ShipDetail = () => {
  return (
    <>
      <Detail
        transport_type="2"
        formName="/ship/form"
        exportWaybillType="300102"
      />
    </>
  );
};

export default ShipDetail;
