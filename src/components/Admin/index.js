import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {CirclesWithBar} from 'react-loader-spinner'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Popup from 'reactjs-popup'
import Header from '../Header'
import './index.css'

class Admin extends Component{
    state={
        id:'',
        status:'loading',
        data:[],
        productName:"",
        imageUrl:"",
        starting:"",
        ending:"",
        orderDate:'',
        error:'',
    }

    updateName=(event)=>{
        this.setState({productName:event.target.value})
    }

    updateImage=(event)=>{
        this.setState({imageUrl:event.target.value})
    }

    updateStarting=(event)=>{
        this.setState({starting:event.target.value})
    }

    updateEnding=(event)=>{
        this.setState({ending:event.target.value})
    }

    updateOrder=(event)=>{
        this.setState({orderDate:event.target.value})
    }

    componentDidMount(){
        this.getData()
    }

    getData=async ()=>{
      this.setState({status:"loading"})
      const url='https://courier-tracking.onrender.com/all-products';
      const token=Cookies.get('jwt_token');
      const options={
        method:'GET',
        headers:{
        "Authorization": `Bearer ${token}`
        }
      }
      const details=await fetch(url,options)
      if(details.status===200){
        const jsonData=await details.json()
        if(jsonData.length!==0){
        const updatedData=jsonData.map(item=>({
            productName:item.product_name,
            startingPoint:item.starting_point,
            endingPoint:item.ending_point,
            orderDate:item.order_date,
            id:item.id,
            imgUrl:item.image_url
        }))
        this.setState({status:'success',data:updatedData})
    }else{
        this.setState({status:"empty"})
    }
      }
      else{
        this.setState({status:"failure"})
      }

    }

    failureView=()=><div className='empty'>
        <h2>Something went wrong, Please try again</h2>
        <button type='button' onClick={this.getData} className='pagination-buttons'>Retry</button>
    </div>

    emptyView=()=><div className='empty'>
    <img src='https://res.cloudinary.com/dkredoejm/image/upload/v1699463696/empty_dpwv00.png' alt='empty' className='empty'/>
    <h2 style={{color:'white'}}>It's empty, Nothing to display here</h2>
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
 
    updateId=(id)=>{
        console.log('event triggrerd')
        this.setState({id:id})
    }

    card=(item)=>{
        const {productName,imgUrl,orderDate,id,endingPoint,}=item
        return <div key={id} className='product-card'>
            <Link to={`/product/${id}`}><img src={imgUrl} alt={productName} className='card-product'/></Link>
            <div className='margin-left'>
                <h3>{productName}</h3>
                <p><b>Ordered At: </b>{orderDate}</p>
                <p><b>Destination: </b>{endingPoint}</p>
            </div>
            <div className='flex-column'>
                <Popup trigger={<button type='button' className='but'><CiEdit size={40}/></button>} modal>
                {close=>{
                        const {productName,imageUrl,starting,ending,error,orderDate}=this.state
                        return <div>
                            <form className='login' style={{"backgroundColor":'white'}} onSubmit={this.edit}>
                                   <h1>Edit Courier Details</h1>
                                   <label className='label' htmlFor='pro-name'>Product Name</label>
                                   <input type='text' value={productName} id='pro-name' placeholder='Enter product name' onChange={this.updateName} className='input'/>
                                   <label className='label' htmlFor='imageUrl'>Image Url</label>
                                   <input type='text' value={imageUrl} id='imageUrl' placeholder='Enter image url' onChange={this.updateImage} className='input'/>
                                   <label className='label' htmlFor='start'>Starting Point</label>
                                   <input type='text' value={starting} id='start' placeholder='Enter Starting Location' onChange={this.updateStarting} className='input'/>
                                   <label className='label' htmlFor='end'>Destination</label>
                                   <input type='text' value={ending} id='end' placeholder='Enter Destination' onChange={this.updateEnding} className='input'/>
                                   <label className='label' htmlFor='orderedDate'>OrderedDate</label>
                                   <input type='date' value={orderDate} id='orderdDate' placeholder='Enter ordered Date' onChange={this.updateOrder} className='input'/>
                                   <p className='error'>{error}</p>
                                   <div>
                                     <button className='submit-button' type='submit' onClick={()=>this.updateId(id)}>Update</button>
                                     <button onClick={()=>close()} className='submit-button'>close</button>
                                   </div>
                            </form>
                        </div>
                    }}
                </Popup>
                <button type='button' className='but' onClick={()=>this.delete(id)}><MdDelete size={40}/></button>
            </div>
        </div>
    }

    success=()=>{
        const {data}=this.state
        return data.map(item=>this.card(item))
    }

    getResult=()=>{
        const {status}=this.state
        switch (status){
            case 'success':
                return this.success()
            case 'failure':
                return this.failureView()
            case 'loading':
                return this.loadingView()
            case 'empty':
                return this.emptyView()
            default:
                return null;                
        }
    }

    addData=async (event)=>{
      event.preventDefault();
      const {productName,imageUrl,starting,ending,orderDate}=this.state
      if(productName===''||imageUrl===''||starting===''||ending===''||orderDate===''){
        this.setState({error:'Fill the form completely'})
      }else{
        const url='https://courier-tracking.onrender.com/add-product'
        const token=Cookies.get(`jwt_token`)
        const details={
            "productName":productName,
            "imageUrl":imageUrl,
            "startingPoint":starting,
            "endingPoint":ending,
            "orderDate":orderDate
            }
        console.log(details)    
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
        console.log(responseData)
        this.setState({productName:"",
        imageUrl:"",
        starting:"",
        ending:"",
        orderDate:'',
        error:''})
        this.getData()
      }
    }

    edit=async (event)=>{
        event.preventDefault();
        const {productName,imageUrl,id,starting,ending,orderDate}=this.state
        if(productName===''||imageUrl===''||starting===''||ending===''||orderDate===''){
          this.setState({error:'Fill the form completely'})
        }else{
          const url=`https://courier-tracking.onrender.com/add-product/${id}`
          const token=Cookies.get(`jwt_token`)
          const details={
              "productName":productName,
              "imageUrl":imageUrl,
              "startingPoint":starting,
              "endingPoint":ending,
              "orderDate":orderDate
              }
          console.log(details)    
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
          console.log(responseData)
          this.setState({productName:"",
          imageUrl:"",
          starting:"",
          ending:"",
          orderDate:'',
          error:''})
        }
        this.getData()
    }

    delete=async (id)=>{
      const url=`https://courier-tracking.onrender.com/product/${id}`
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

    render(){
        const {status,data}=this.state
        console.log(data,status)
        return <div>
            <Header/>
            
            <div className='home-container'>
            <div className='backButton'>
                <Popup modal trigger={<button type='button' className='submit-button'>Add Product</button>}>
                    {close=>{
                        const {productName,imageUrl,starting,ending,error,orderDate}=this.state
                        return <div>
                            <form className='login' style={{"backgroundColor":'white'}} onSubmit={this.addData}>
                                   <h1>Add Courier Details</h1>
                                   <label className='label' htmlFor='pro-name'>Product Name</label>
                                   <input type='text' value={productName} id='pro-name' placeholder='Enter product name' onChange={this.updateName} className='input'/>
                                   <label className='label' htmlFor='imageUrl'>Image Url</label>
                                   <input type='text' value={imageUrl} id='imageUrl' placeholder='Enter image url' onChange={this.updateImage} className='input'/>
                                   <label className='label' htmlFor='start'>Starting Point</label>
                                   <input type='text' value={starting} id='start' placeholder='Enter Starting Location' onChange={this.updateStarting} className='input'/>
                                   <label className='label' htmlFor='end'>Destination</label>
                                   <input type='text' value={ending} id='end' placeholder='Enter Destination' onChange={this.updateEnding} className='input'/>
                                   <label className='label' htmlFor='orderedDate'>OrderedDate</label>
                                   <input type='date' value={orderDate} id='orderdDate' placeholder='Enter ordered Date' onChange={this.updateOrder} className='input'/>
                                   <p className='error'>{error}</p>
                                   <div>
                                     <button className='submit-button' type='submit'>Add</button>
                                     <button onClick={()=>close()} className='submit-button'>close</button>
                                   </div>
                            </form>
                        </div>
                    }}
                </Popup>
            </div>
                {this.getResult()}
            </div>
        </div>
    }
}

export default Admin