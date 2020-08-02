import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircleApi from './lib/circle-api';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      margin: theme.spacing(6, 0, 3),
    },
    label: {
      color: '#7B7F9E',
      fontSize: '12px',
      textAlign: 'center'
    },
    input: {
        padding: 0,
        color: '#fff',
        textAlign: 'center',
        fontSize: 24, 
        display: 'inline-block',
        width: '50px !important'
    },
    select: {
        padding: 0,
        color: '#fff',
        textAlign: 'center',
        fontSize: 24, 
        display: 'inline-block',
        borderColor: '#282a36',
        borderRadius: 12,
        backgroundColor: '#212330',
        textAlign: 'center',
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 5,
        paddingRight: 5,
        lineHeight: 50,
    },
    inputWrapper: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 24, 
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#282a36',
        borderRadius: 12,
        backgroundColor: '#212330',
        textAlign: 'center',
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 25,
        paddingRight: 25,
    },
    currency: {
        //marginTop: 15,
        marginRight: 10,
        position: 'relative',
        top: 5,
    },
    cardIcon: {
        marginLeft: 10,
        position: 'relative',
        marginTop: -3,
        height: 40
    },
    button: {
        backgroundColor: '#3936BE',
        color: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 12,
        fontSize: 36,
    }
  }));

export default function PaymentForm() {


    const [cards, setCards] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [paymentId, setPaymentId] = React.useState(null);

    /*constructor(props){
        super(props);

        // test wallet id: 1000025934
        this.state ={
            loading: false,
            error: false,
            paymentId: null,
            success: false,
            cards: []
        }

        this.createPayment = this.createPayment.bind(this);
        this.checkPayment = this.checkPayment.bind(this);
    }*/

    async function createPayment() {
        setLoading(true)
        
       let payment = await CircleApi.createPayment({
            email: 'ruan@segment.money',
            phoneNumber: '+27646909349',
            //sessionId: 'xxx',
            cvv: '111',
            cardId: 'db18ed0c-69f4-4fb5-ae37-891e6067f434',
            amount: 10,
            number: '4200000000000000',
            currency: 'USD'
        });

        //console.log(payment.data)
        

        let interval = setInterval(() => {
            if (success || error) {
                clearInterval(interval)
            }
            checkPayment(payment.data.id);
        }, 2000);
    }

    async function checkPayment(paymentID) {
        //console.log(paymentID)
        if (paymentID !== null) {
            let payment = await CircleApi.getPayment(paymentID);
            console.log(payment)
            if (payment.status == 'confirmed' || payment.status == 'success') {
                setLoading(false);
            } else if (payment.status == 'failed' || payment.status == 'payment_failed') {
                setLoading(false);
                setError(true);
            }
        }
    }

    async function getCards() {
        setLoading(true);

       let cards = await CircleApi.getCard();

       setCards(cards.data);
       setLoading(false);
    }
    

    React.useEffect(() => {
        if (cards.length === 0) {
            getCards();
        }
    }, [cards]);

    
        const classes = useStyles();
        if (loading) {
            return <LinearProgress />
        }
        else {
            return (
                <React.Fragment>
                    <Typography variant="h6" gutterBottom color="white" className={classes.label} >
                        You are paying:
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} >
                        <div className={classes.inputWrapper}>
                            <img src="ars.png" alt="alternative" className={classes.currency} />
                            ARS $
                            <Input variant="filled" required id="amount" 
                            classes={{
                                root: classes.input, // class name, e.g. `classes-nesting-root-x`
                            }}
                            value="10" disableUnderline={true}  />
                        </div>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" gutterBottom color="white" className={classes.label} style={{marginTop: 20}} >
                        From: 
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} >
                        <div className={classes.selectWrapper}>
                            <Select variant="filled" required id="amount" 
                                classes={{
                                    root: classes.select, // class name, e.g. `classes-nesting-root-x`
                                }}
                                fullWidth
                                //onChange={handleChange}
                                defaultValue={cards[0]}
                                renderValue={selected => {
                                    return (
                                        <div
                                            style={{
                                                whiteSpace: 'normal',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <React.Fragment>
                                                <Typography style={{
                                                    lineHeight: '35px',
                                                    maxWidth: '70%',
                                                    overflow: 'hidden',
                                                    height: 35,
                                                }}>
                                                    {selected.id}
                                                </Typography>
                                                <img src="marstercard.png" alt="alternative" className={classes.cardIcon} style={{height: '20'}} />
                                            </React.Fragment>
                                        </div>
                                    );
                                }}
                            >
                                {cards.map(value => {
                                        return (
                                            <React.Fragment>
                                                <Typography>
                                                    {value.id}
                                                </Typography> 
                                            </React.Fragment>
                                        );
                                    })}
                            </Select>
                        </div>
                        </Grid>

                        <Grid item xs={12}>
                        <Button color="secondary" variant={'primary'} fullWidth className={classes.button} onClick={() => createPayment()}>
                            Pay Now
                        </Button>
                        </Grid>
                    </Grid>
                </React.Fragment>
            )
        }
    
}