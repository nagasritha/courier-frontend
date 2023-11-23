import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'
import './index.css'

class Login extends Component{
    state={
        username:'',
        email:'',
        password:'',
        error:''
    }

    updateName=(event)=>{
      this.setState({username:event.target.value})
    }
    
    updateEmail=(event)=>{
        this.setState({email:event.target.value})
    }

    updatePassword=(event)=>{
        this.setState({password:event.target.value})
    }

    success=(token)=>{
        Cookies.set("jwt_token",token,{expires:30});
        <Navigate to='/'/>
    }

    submitForm= async (event)=>{
        event.preventDefault();
        console.log("I am called");
        const {username,email,password}=this.state
        const userDetails={"username":username,"email":email,"password":password}
        const options={
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userDetails)
        }
        const url="https://courier-tracking.onrender.com/login"
        const details=await fetch(url,options)
        if(details.status===200){
        const response=await details.json()
        console.log(response);
        this.setState({error:''});
        this.success(response.jwtToken)
        }else{
            this.setState({error:"Invalid Credentials"})
        }
    }

    render(){
        const {username,email,password,error}=this.state
        const token=Cookies.get('jwt_token');
        if(token!==undefined){
            return <Navigate to='/'/>
        }
        return <div className='login-bg'>
            <form className='login' onSubmit={this.submitForm}>
                <h1><center>Login Form</center></h1>
            <label className='label' htmlFor='name'>USERNAME</label>
            <input className='input' type='text' placeholder='Enter your name' onChange={this.updateName} id='name' value={username}/>
            <label className='label' htmlFor='email'>EMAIl</label>
            <input type='text' className='input' placeholder="Enter your Email" onChange={this.updateEmail} id='Email' value={email}/>
            <label className='label' htmlFor='password'>PASSWORD</label>
            <input type='password' className='input' placeholder="Enter Password" onChange={this.updatePassword} id="password" value={password}/>
            <button type="submit" className='submit-button'>Submit</button>
            <p className='error'>{error}</p>
            </form>
        </div>
    }
}

export default Login