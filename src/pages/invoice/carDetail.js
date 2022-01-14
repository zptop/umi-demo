import Detail from '../../components/invoice-model/detail.js';
const CarDetail = () => {
  return (
    <>
      <Detail
        transport_type="1"
        formName="/car/form"
        exportWaybillType="300101"
      />
    </>
  );
};

export default CarDetail;
