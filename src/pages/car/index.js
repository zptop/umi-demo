import WaybillIndex from '../../components/waybill-model/index';

const CarIndex = () => {
  return (
    <div>
      <WaybillIndex
        transportType="1"
        addForm="/car/form"
        payPath="/car/pay"
        exportWaybillType="300101"
      />
    </div>
  );
};

export default CarIndex;
