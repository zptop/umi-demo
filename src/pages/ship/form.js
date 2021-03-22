import Form from '../../components/waybill-model/form';
import Port from './port';
const ShipForm = () => {
    return (
        <div>
            <Form transportType="2" addr={Port}/>
        </div>
    )
}

export default ShipForm;