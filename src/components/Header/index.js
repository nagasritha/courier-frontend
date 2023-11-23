import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Header extends Component{
    state={
        admin:''
    }
    
    componentDidMount(){
        this.verifyAdmin()
       }
   
    verifyAdmin=async ()=>{
        const token=Cookies.get('jwt_token');
        const url='https://courier-tracking.onrender.com/verify-admin';
        const responseData=await fetch(url,{
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`
                }
        })
        const jsondata=await responseData.json()
        if(jsondata.admin==="True"){
            this.setState({admin:true})
        }else{
            this.setState({admin:false})
        }

    }

   logout=()=>{
        Cookies.remove('jwt_token')
    }
   
   render(){
    const {admin}=this.state
    return <nav>
        <Link to='/'><img alt='logo' src='https://res.cloudinary.com/dkredoejm/image/upload/v1700725960/logo_cm3ffn.png' className='logo'/></Link>
        <div className='nav-2'>
        {admin && <Link to="/admin"><p className='admin'>AdminPallet</p></Link>}
        <Link to='/login'><button type='button' onClick={this.logout} className='submit-button'>Logout</button></Link>
        </div>
    </nav>
}
}

export default Header