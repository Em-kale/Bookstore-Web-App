import React, {useState} from 'react'

//material ui imports
//material ui imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'
import Link from '@mui/material/Link'
import Snackbar from '@mui/material/Link'

const useStyles = makeStyles((theme) => ({
    textField:  {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
         },
        "& .MuiInputLabel-outlined": {
            color: "white"
        },
    },
    input: {
        color: 'white', 
    }
}));


function Login(props){

    const classes = useStyles()

    //initialize variables to be used
    const[pass, setPass] = useState("")
    const[user, setUser] = useState("")
    const[name, setName] = useState("")

    let axios = require('axios')
    let config
    //get the type of login it is (employee or customer)
    //and whether it is login ot registration form from parent
    const{
        loginType,
        formType
    } = props 

    function handleSubmit(){
        //configure endpoint info depending on loginType
        if(loginType == 'staff'){
            config = {method: 'get', url: '/loginuser/' + user + "-" + pass + '-true/'}
        }
        else if(loginType == 'customer'){
            config = {method: 'get', url: '/loginuser/' + user + "-" + pass + '-false/'}
        }
        //call server code to make query to get if user + password pair is in database
        axios(config)
        .then(function (response) {
            response = (response.data);
            if(loginType==='staff' && response.status==='true'){
                //add user to sessionStorage so code can tell
                //who is logged in
                sessionStorage.setItem('logged_in', user)
                //redirect to staff page
                document.location.href = '/staff'
            }
            else if(loginType==='customer' && response.status==='true'){
                //add user to sessionStorage so code can tell
                //who is logged in
                sessionStorage.setItem('logged_in', user)
                //redirect to customer page
                document.location.href = '/customer'
            }
            else{
                alert('Login Failed. Incorrect Username or Password.')
            }      
        })
        .catch(function (error) {
            console.log("error", error);
        });
        
        //alert("Failure to Log In")
    }
    //functions to keep track of current textfield content
    function handleUserChange(event){
        setUser(event.target.value)
    }
    function handlePassChange(event){
        setPass(event.target.value)
    }
    function handleNameChange(event){
        setName(event.target.value)
    }
    //function to handle registration
    function handleRegister(){
        //configure endpoint info dependent on if the user is staff or customer
        if(loginType=='staff'){
            config = {method: 'get', url: '/newuser/' + user + "-" + name + "-" + pass + '-TRUE'}
        }
        else{
            config = {method: 'get', url: '/newuser/' + user + "-" + name + "-" + pass + '-FALSE'}
        }
        //call server to execute query to add user to database
        axios(config)
        .then(function (response) {
        })
        .catch(function (error) {
        console.log(error);
        });
    }

    let linkURL = '/register-' + `${loginType}`

    return(
        <>
        <Grid style={{marginTop: 20}} container direction='column' spacing={5}>
            <Grid item>
                <TextField 
                value={user}
                onChange={handleUserChange}
                className={classes.textField}
                label = "username"
                inputProps={{className: classes.input }}
                />
            </Grid>
            <>
            {
                formType == 'register' ? 
                    <Grid item>
                        <TextField 
                        value={name}
                        className={classes.textField}
                        onChange={handleNameChange}
                        label = "Name"
                        inputProps={{className: classes.input }}
                        />
                    </Grid>
                    : <></>
                }
            </>
            <Grid item>
                <TextField 
                value={pass}
                className={classes.textField}
                onChange={handlePassChange}
                label = "password"
                inputProps={{className: classes.input }}
                />
            </Grid>
            
            
         
            <>
            {
            formType == 'register'? 
                <Grid item style={{marginTop: 5}}>
                  <Button onClick={handleRegister} href={`${loginType}` + "-login"} variant='contained'>Register</Button>
                </Grid >: 
                <>
                <Grid item style={{marginTop: 5}}>
                <Button onClick={handleSubmit} variant='contained'>Submit</Button>
                </Grid>
                <Grid item>
                    <Link underline='hover' color='#7dabf5' href={linkURL}>
                        <Typography color='#7dabf5'>
                        register {loginType}
                        </Typography>
                    </Link>
                </Grid>
                </>
            }
            </>
        
        </Grid>
        </>
    )
}

export default Login