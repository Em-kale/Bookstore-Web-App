import React, {useState} from 'react'
import Report from './report'

//material ui imports for consistent front end elements
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import { AccordionDetails } from '@mui/material'
import { AccordionSummary } from '@mui/material'
import TextField from '@mui/material/TextField'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Snackbar from '@mui/material/Snackbar'

function StaffInterface(){
    //declaration of variables used on this page
    const [bookName, setBookName] = useState("")
    const [publisher, setPublisher] = useState("")
    const [author, setAuthor] = useState("")
    const [price, setPrice] = useState("")
    const [ISBN, setISBN] = useState("")
    const [pages, setPages] = useState("")
    const [copies, setCopies] = useState("")
    const [publisherTake, setPublisherTake] = useState("")
    const [genre, setGenre] = useState("")
    const [open, setOpen] = useState(false)
    const [type, setType] = useState("")
    const [snackbarOpen, setSnackBarOpen] = useState(false)

    let axios = require('axios'); 

    //function to close the snackbar, called after preset amount of time
    function handleSnackbarClose(){
        setSnackBarOpen(false)
    }

    //functions to update the variables keeping track of textfield inputs
    function updateBookName(TextField){
        setBookName(TextField.target.value)
    }
    function updateAuthor(TextField){
        setAuthor(TextField.target.value) 
    }
    function updatePrice(TextField){
        setPrice(TextField.target.value)
    }
    function updateISBN(TextField){
        setISBN(TextField.target.value)
    }
    function updatePages(TextField){
        setPages(TextField.target.value)
    }
    function updateCopies(TextField){
        setCopies(TextField.target.value)
    } 
    function updatePublisher(TextField){
        setPublisher(TextField.target.value)
    }
    function updatePublisherTake(TextField){
        setPublisherTake(TextField.target.value)
    }
    function updateGenre(TextField){
        setGenre(TextField.target.value)
    }
    //set dialog's open state to open when clicked,
    //also set the type of dialog display to use
    function handleOpen(type){
        setType(type)
        setOpen(true)
    }
    //set the dialog's open state to false when closed
    function handleClose(){
        setOpen(false)
    }
    function handleAdd(){
        let config = {method: 'get', url: '/addbook/' + ISBN + "-" + publisher + "-" +
        bookName + "-" + author + "-" + genre + "-" + pages + "-" + publisherTake + "-" +
        price + "-" + copies + "-" + sessionStorage.getItem("logged_in")}

        //call the api endpooint to make the call to add a book to the database
        axios(config)
        .then(function (response) {
            console.log("added book")
        }
        )
        .catch(function (error) {
            console.log("error", error);
        });
        //set the snack bar notification as open
        setSnackBarOpen(true); 
    }
    return(
    <>  
        {
            //checks to ensure that the user is logged in
        sessionStorage.getItem("logged_in") ?
        <>
            <Grid container rowSpacing={4} justifyContent='center' style={{marginTop: 50}}>
                <Grid item xs={8}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} style = {{backgroundColor: "#8ca7bd"}}>
                            <Typography>Add Books</Typography>
                        </AccordionSummary>
                        <AccordionDetails style = {{backgroundColor: "#9dbbd4"}}>
                            <Grid container rowSpacing={1} justifyContent="center">
                                <Grid item xs={6}>
                                    <TextField label="Title" 
                                    onChange={updateBookName}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label="Author" 
                                    onChange={updateAuthor}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label="ISBN"
                                    onChange={updateISBN}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label="Publisher"
                                    onChange={updatePublisher}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label="Price"
                                    onChange={updatePrice}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label="Pages"
                                    onChange={updatePages}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label="Copies"
                                    onChange={updateCopies}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label="Genre"
                                    onChange={updateGenre}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Publisher Percentage"
                                    onChange={updatePublisherTake}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" onClick={handleAdd}>Add</Button>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent='center' spacing={2}>
                        <Grid item>
                             <Button style={{maxWidth: 200}} 
                             onClick={()=>{handleOpen("revenue")}} 
                             variant="contained">
                                 Generate Revenue Report
                             </Button>
                        </Grid>
                        <Grid item>
                             <Button style={{maxWidth: 200}} 
                             onClick={()=>{handleOpen("expense")}} 
                             variant="contained">
                                 Generate Expense Report
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Report open={open} type={type} handleClose={handleClose}/>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Order Added"
             />
        </> : <>Not Logged In</>
        }
    </>
    )
}
export default StaffInterface