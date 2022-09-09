import React from 'react'

// this.props.location.state.detail.user
const Error=(props)=> {

    
    const LoginErrors=() => {
        let LoginErrors="";
        if(props.Error.length>0){
            LoginErrors=<div className="alert alert-warning" style={{height: "100%"
                ,margin: "0"}}>
                {props.Error}
            </div>;     
        }
        return LoginErrors
    }
    

    return (
        <div >
            {LoginErrors()}

        </div>   
    );
 
}

export default Error;
