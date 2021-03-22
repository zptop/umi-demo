
import Form from '../../components/waybill-model/form';
import Area from './area';
const CarForm = ()=>{
    return(
        <div>
            <Form transportType="1" addr={Area}/>
        </div>
    )
}

export default CarForm;