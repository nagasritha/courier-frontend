import {Component} from 'react'
import Header from '../Header'
import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import {CirclesWithBar} from 'react-loader-spinner'
import { IoLocationSharp } from "react-icons/io5"
import './index.css'

class Product extends Component{
    state={
        events:[],
        product:'',
        status:true,
        location:'',
        date:'',
        editableId:'',
        message:'',
    }

    updateEditableId=(id)=>{
        console.log(id)
        this.setState({editableId:id})
    }

    componentDidMount(){
        this.getData()
    }

    getData= async ()=>{
        this.setState({status:'loading'})
        const {id}=this.props
        const token=Cookies.get("jwt_token")
        const url=`https://courier-tracking.onrender.com/product/${id}`;
        const responseData=await fetch(url,{
           method:"GET",
           headers:{
               "Authorization": `Bearer ${token}`
              }
       })
       if(responseData.status===200){
        const data=await responseData.json()
        console.log(data.eventDetails.length)
        console.log(data)
        const updatedData1={
            imgUrl:data.response1.image_url,
            productName:data.response1.product_name,
            id:data.response1.id,
            endingPoint:data.response1.ending_point,
            startingPoint:data.response1.starting_point,
            orderDate:data.response1.order_date
         }
         if(data.eventDetails.length===0){
            return this.setState({product:updatedData1,status:'success',empty:true})
         }else{
            const updatedData2=data.eventDetails.map(item=>({
                id:item.id,
                deliverBy:item.deliver_by,
                location:item.location,
                productId:item.product_id
             }))
             this.setState({product:updatedData1,events:updatedData2,status:'success',empty:false})
            
        }
       }else{
        this.setState({status:'failure'})
       }
        
    }

    updateLocation=(event)=>{
        this.setState({location:event.target.value});
    }

    updatedDate=(event)=>{
        this.setState({date:event.target.value});
    }

    failureView=()=><div className='empty'>
        <h2>Something went wrong, Please try again</h2>
        <button type='button' onClick={this.getData} className='pagination-buttons'>Retry</button>
    </div>

    emptyView=()=><div className='empty'>
    <img src='https://res.cloudinary.com/dkredoejm/image/upload/v1699463696/empty_dpwv00.png' alt='empty' className='empty-image'/>
    <h2>It's empty, Nothing to display here</h2>
    </div>

    loadingView=()=><div className='empty'>
        <CirclesWithBar
  height="100"
  width="100"
  color="#4fa94d"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  outerCircleColor=""
  innerCircleColor=""
  barColor=""
  ariaLabel='circles-with-bar-loading'
/>
    </div>

    displayItem=(item)=>{
        const {location,deliverBy,id}=item
        return <div className='item' key={id}>
            <div className='icon'><IoLocationSharp size={30}/></div>
            <div className='margin-left'>
            <h1 className='location'><b>{location}</b></h1>
            <b><p>{deliverBy}</p></b>
            </div>
            <div style={{"marginLeft":"auto","paddingRight":"20px"}}>
            <Popup modal trigger={<button className='but'><CiEdit size={40}/></button>}>
              {close=>{
                const {date,location,message}=this.state
                return <form className='login' onSubmit={this.edit} style={{'backgroundColor':"white"}}>
                    <h1>Edit Track</h1>
                    <label className='label' id='location'>Location</label>
                    <input type='text' className='input' value={location} id='location' onChange={this.updateLocation} placeholder='Enter Location'/>
                    <label className='label' htmlFor='d'>Date</label>
                    <input type='date' value={date} className='input' id='d' onChange={this.updatedDate}/>
                    <p>{message}</p>
                    <div>
                      <button type='submit' onClick={()=>this.updateEditableId(id)} className='submit-button'>Update</button>
                      <button type='button' className='submit-button' onClick={()=>close()}>Close</button>
                    </div>
                    
                </form>
              }}
            </Popup>
            <button type='button' className='but' onClick={()=>this.delete(id)}><MdDelete size={40}/></button>
            </div>
        </div>
    }

    successView=()=>{
        const {product,events,empty}=this.state
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
                
                </div>
                <div className='backButton'>
                <Popup modal trigger={<button type='button' className='submit-button'>Add Locations</button>}>
                {close=>{
                const {date,location,message}=this.state
                return <form className='login' onSubmit={this.add} style={{'backgroundColor':"white"}}>
                    <h1>Add Track</h1>
                    <label className='label' id='location'>Location</label>
                    <input type='text' className='input' value={location} id='location' onChange={this.updateLocation} placeholder='Enter Location'/>
                    <label className='label' htmlFor='d'>Date</label>
                    <input type='date' value={date} className='input' id='d' onChange={this.updatedDate}/>
                    <p>{message}</p>
                    <div>
                      <button type='submit' className='submit-button'>Add</button>
                      <button type='button' className='submit-button' onClick={()=>close()}>Close</button>
                    </div>
                    
                </form>
              }}
                </Popup>
            </div>
                {empty?this.emptyView():<div className='stream'>
                    {events.map(item=>this.displayItem(item))}
                </div>}
                
            </div>   
    }

    getResult=()=>{
        const {status}=this.state
        switch (status){
            case 'loading':
                return this.loadingView()
            case 'success':
                return this.successView()
            case 'failure':
                return this.failureView()
            default:
                return null            
        }
    }

    delete=async (id)=>{
        const url=`https://courier-tracking.onrender.com/event/${id}`
        const token=Cookies.get('jwt_token')
        const options={
          method:'DELETE',
          headers:{
              "Authorization": `Bearer ${token}`
          }
        }
        const data=await fetch(url,options)
        const responseData=await data.json()
        console.log(responseData)
        this.getData()
      }

    edit=async (event)=>{
        event.preventDefault();
        const {editableId}=this.state;
        const {location,date}=this.state
        if(location===''||date===''){
            this.setState({message:"Fill the form completly"})
        }else{
        const {id}=this.props
        const details={
            "location":location,
            "deliverBy":date,
            "productId":id
                }
        const url=`https://courier-tracking.onrender.com/event/${editableId}`
        const token=Cookies.get("jwt_token");
        const options={
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify(details)
        }
        const data=await fetch(url,options);
        const responseData=await data.json();
        this.setState({message:responseData.message,location:'',date:''})     
        this.getData()
    }
    }
    
    add=async(event)=>{
        event.preventDefault();
        const {location,date}=this.state
        if(location===''||date===''){
            this.setState({message:"Fill the form completly"})
        }else{
        const {id}=this.props
        const details={
            "location":location,
            "deliverBy":date,
            "productId":id
                }
        const url=`https://courier-tracking.onrender.com/event/`
        const token=Cookies.get("jwt_token");
        const options={
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify(details)
        }
        const data=await fetch(url,options);
        const responseData=await data.json();
        this.setState({message:responseData.message,location:'',date:''})     
        this.getData()
    }

    }

    render(){
        return <div>
            <Header/>
            <div className='home-container'>
                {this.getResult()}
            </div>
        </div>
    }
}

export default Product
