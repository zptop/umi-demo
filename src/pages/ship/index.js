import WaybillIndex from '../../components/waybill-model/index';
const ShipIndex = () => {
  return (
    <div>
      <WaybillIndex
        transportType="2"
        addForm="/ship/form"
        exportWaybillType="300102"
      />
    </div>
  );
};
export default ShipIndex;
