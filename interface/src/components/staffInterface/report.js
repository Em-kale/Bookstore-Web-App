import React, {useState, useEffect} from 'react'

//material ui imports
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

function Report(props){
    let axios = require('axios')
    //initialize some variables to be used
    const[reportArray, setReportArray] = useState([])
    const[totalAmount, setTotalAmount] = useState(0)
    //get some variables from staffInterface
    //including the function to be called when the dialog is closed
    const {
        open,
        handleClose,
        type} = props
    
    //useEffect is called upon rendering
    //ie. when the page loads or the type of dialog is changed
    //this function makes a call to the endpoint to get the report data 
    //from the database
    useEffect(()=>{
        if(type){
        //configure endpoint info
        let config = {method: 'get', url: '/getreport/' + type}
        //call endpoint
        axios(config)
        .then(function (response) {
            setReportArray(response.data.result)
            let total = 0; 
            let i; 
            //calculate the total expenses or total revenues
            for(i = 0; i<response.data.result.length; i++){
                total += parseFloat(response.data.result[i].amount); 
            }
            setTotalAmount(total); 
        })
        .catch(function (error) {
            console.log("error", error);
        })
    }}, [type])

    //call function in staffInterface to close dialog
    function onClose(){
        handleClose();
    }

    //define a variable with all the components for each report
    let reports
    if(reportArray){
     reports=reportArray.map((report)=>{
        return(
            <Grid container>
                <Grid item xs={6}>
                    <Typography>Order: {report.order_num}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Amount: {report.amount}</Typography>
                </Grid>
            </Grid>
        )
    })
    }
    return(
        <Dialog open={open} onBackdropClick={onClose} onClose={onClose}>
            {
                type == "revenue" ? 
                <Grid container>
                    <Grid item>
                        <Typography variant="h6">Revenues</Typography>
                    </Grid>
                    {reports}
                    <Grid item>
                        Total Amount: {totalAmount}
                    </Grid>
                </Grid>: 
                <Grid container>
                    <Grid item>
                        <Typography variant="h6">Expenses</Typography>
                    </Grid>
                    {reports}
                    <Grid item>
                        Total Amount: {totalAmount}
                    </Grid>
                </Grid>
            }
        </Dialog>
    )
}
export default Report