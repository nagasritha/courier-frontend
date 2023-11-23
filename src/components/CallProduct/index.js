import {useParams} from 'react-router-dom'
import Product from '../Product'

const CallProduct=()=>{
    const {id} = useParams();
    return <Product id={id}/>
}

export default CallProduct