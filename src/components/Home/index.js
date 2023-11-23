import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'
import { IoLocationSharp } from "react-icons/io5"
import Header from '../Header'
import './index.css'

class Home extends Component{
    state={
        id:'',
        form:true,
        events:[],
        product:'',
        empty:false,
    }

    updateid=(event)=>{
        this.setState({id:event.target.value})
    }
    
    updateForm=()=>{
    this.setState(prevState=>({form:!prevState.form}))
  }

    getData= async (event)=>{
     event.preventDefault();
     const {id}=this.state
     this.updateForm()
     const token=Cookies.get("jwt_token")
     const url=`https://courier-tracking.onrender.com/product/${id}`;
     const responseData=await fetch(url,{
        method:"GET",
        headers:{
            "Authorization": `Bearer ${token}`
           }
    })
     const data=await responseData.json()
     console.log(data.eventDetails.length)
     console.log(data)
     if(data.eventDetails.length===0){
        return this.setState({empty:true})
     }else{
     const updatedData1={
        imgUrl:data.response1.image_url,
        productName:data.response1.product_name,
        id:data.response1.id,
        endingPoint:data.response1.ending_point,
        startingPoint:data.response1.starting_point,
        orderDate:data.response1.order_date
     }
     const updatedData2=data.eventDetails.map(item=>({
        id:item.id,
        deliverBy:item.deliver_by,
        location:item.location,
        productId:item.product_id
     }))
     this.setState({product:updatedData1,events:updatedData2,empty:false})
    }
}

    successView=()=>{
        const {product,events}=this.state
        const {imgUrl,productName,orderDate,startingPoint,endingPoint}=product
        return <div>
        <div className='image-align'>
                <img src={imgUrl} alt={productName} className='product'/>
                <div className='padding-left'>
                    <p><b>Product: </b>{productName}</p>
                    <p><b>Ordered At: </b>{orderDate}</p>
                    <p><b>Deliver From: </b>{startingPoint}</p>
                    <p><b>Destination: </b>{endingPoint}</p>
                </div>
                <div className='stream'>
                    {events.map(item=>this.displayItem(item))}
                </div>
                </div>
                
                <div className='backButton'>
                    <button type='button' onClick={this.updateForm} className='submit-button'>Back</button>
                </div>
             </div>   
    }
    
    emptyView=()=>(
        <div className='empty'>
            <img src='https://res.cloudinary.com/dkredoejm/image/upload/v1699463696/empty_dpwv00.png' alt='Empty' className='Empty'/>
            <h3>No Courier details are available with provided Id</h3>
            <button className='submit-button' onClick={this.updateForm}>Back</button>
        </div>
    )

    displayItem=(item)=>{
        const {location,deliverBy,id}=item
        console.log(location,deliverBy)
        return <div className='item' key={id}>
            <div className='icon'><IoLocationSharp size={30}/></div>
            <div className='margin-left'>
            <h1 className='location'><b>{location}</b></h1>
            <b><p>{deliverBy}</p></b>
            </div>
        </div>
    }

    render(){
        const {form,id,empty}=this.state
        const token=Cookies.get("jwt_token");
        if(token===undefined){
            return <Navigate to='/login' replace={true}/>
        }else{
        if(form===true){
            return <div className='login-bg'>
                <Header/>
                <form onSubmit={this.getData} className='login'>
                    <label htmlFor='Courier Id' className='label'>Courier Id</label>
                    <input id='Courier Id' className='input' value={id} placeholder='Enter Courier Id' onChange={this.updateid} type='number'/>
                    <label htmlFor='Product' className='label'>Product Name</label> 
                    <input id='Product' className='input' placeholder='Enter Product Name' type='text'/>
                    <button type='submit' className='submit-button'>GET DATA</button>
                </form>
            </div>
                }
         else{
            return  <div>
            <Header/>
            <div className='home-container'>
                {empty ? this.emptyView():this.successView()}
            </div>
        </div>
         }       
       }

}   
}

export default Home