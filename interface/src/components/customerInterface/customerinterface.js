import React, {useState} from 'react'

//material ui imports for consistent front end elements
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import Card from '@mui/material/Card'
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { makeStyles, withStyles } from '@mui/styles'


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
      color: "white",
    },
    text: {
        color: "white", 
    }
}));

const BlueRadio = withStyles({
    root: {
      color: "#2196f3",
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

function CustomerInterface(){
    const classes = useStyles(); 
    const [selectedValue, setSelectedValue] = useState("book_name")
    const [search, setSearch] = useState("")
    const [searchResultArray, setSearchResultArray] = useState([])

    let axios = require('axios')

    function handleFilterChange(Radio){
        setSelectedValue(Radio.target.value)
    }

    function handleSearchChange(TextField){
        setSearch(TextField.target.value)
    }

    function handleSubmitSearch(){
        let config = {method: 'get', url: '/api/search/' + search + "." + selectedValue + "/"}
        console.log("searching", config)
        let reply
        axios(config)
        .then(function (response) {
            reply = (response.data);
            setSearchResultArray(reply.status); 
            console.log("account", sessionStorage.getItem("logged_in"))
            console.log("response", reply)
        })
        .catch(function (error) {
            console.log("error", error);
        });

    }

    function handleCartAdd(isbn, copies){
        if(copies > 0){
            console.log("ISBN", isbn)
            let config = {method: 'get', url: '/api/addtocart/' + isbn + "." + sessionStorage.getItem("logged_in") +"/"}
            let reply
            axios(config)
            .then(function (response) {
                reply = (response.data);
                console.log("response", reply)
            })
            .catch(function (error) {
                console.log("error", error);
            });
        }
        else(
            console.log("no copies left")
        )
    }

    let searchResults
    if(searchResultArray){
    if(searchResultArray.length > 0){
        searchResults = searchResultArray.map((result)=>{
            return(
                <Grid style={{marginTop: 10}} item xs={12}>
                    <Card>
                        <Grid container justifyContent="space-evenly" style={{paddingRight: 5, marginRight: 2}}>
                            <Grid item style={{marginTop: 5, marginLeft: 20}}> 
                                <MenuBookIcon  htmlColor='brown' style={{fontSize: 50}}  />
                            </Grid>
                            <Grid item style={{marginTop: 15, marginLeft: 20}}>
                                <Typography variant="h7">Title: {result.book_name}</Typography>
                            </Grid>
                            <Grid item style={{marginTop: 15, marginLeft: 20}}>
                                <Typography variant="h7">Author: {result.author}</Typography>
                            </Grid>
                            <Grid item style={{marginTop: 5, marginLeft: 20}}>
                                <Grid container direction='column'>
                                    <Grid item>
                                        <Typography variant="h7">Genre: {result.genre}</Typography>
                                    </Grid>
                                    <Grid item>
                                         <Typography variant="h7">Pages: {result.num_of_pages}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction='column' style={{marginTop: 5, marginLeft: 20}}>
                                    <Grid item>
                                        <Typography variant="h7">Copies: {result.num_of_copies}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h7">Price: ${result.price}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item style={{marginTop: 10, marginLeft: 20}}>
                                <Button
                                variant="contained"
                                onClick={()=>{handleCartAdd(result.ISBN, result.num_of_copies)}}
                                >
                                Add to Cart</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            )
        })
    }
    }
    return (
    <>  
        {
        sessionStorage.getItem("logged_in") ?
        <>
        <Grid container justifyContent="flex-end" style={{paddingRight: 30}}>
            <Grid item>
                <Button href="/cart" style={{minWidth: 150, minHeight: 50, marginRight: 0}} variant="contained">Cart</Button>
            </Grid>
        </Grid>
        <Grid container 
            style={{
                marginLeft: 0,
                marginTop: 40,
                }}
                alignItems = 'center'
                justifyContent = 'center'
                spacing={2}
            >
            <Grid item>
                <TextField 
                    label='Search'
                    style={{
                        marginLeft: 0,
                        width: 500
                    }}
                    className = {classes.textField}
                    inputProps={{className: classes.input }}
                    onChange={handleSearchChange}
                />
            </Grid>
            <Grid item style={{
                        marginLeft: 0,
                    }}>
                <Button 
                    style={{
                        marginLeft: 0,
                    }}
                    variant="contained"
                    onClick={handleSubmitSearch}>
                    Search
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2} justifyContent='center'>
                    <Grid item xs={12}>
                        <Typography className={classes.text}>Search By:</Typography>
                    </Grid>
                    <Grid item>
                        <BlueRadio 
                            checked={selectedValue == "book_name"}
                            value="book_name"
                            onChange={handleFilterChange}/>
                        <Typography className={classes.text} >Title</Typography>
                    </Grid>
                    <Grid item>
                        <BlueRadio 
                            checked={selectedValue == "genre"} 
                            value="genre" 
                            onChange={handleFilterChange}/>
                        <Typography className={classes.text}>Genre</Typography>
                    </Grid>
                    <Grid item>
                        <BlueRadio 
                            checked={selectedValue=="author"} 
                            value="author" 
                            onChange={handleFilterChange}/>
                        <Typography className={classes.text}>Author</Typography>
                    </Grid> 
                </Grid> 
            </Grid>
            <Grid direction="row" rowSpacing={3}>
                {searchResults}
            </Grid>
        </Grid>
        </>
        :       <>Not Logged In</>
                }
        </>
        )
}
export default CustomerInterface 
