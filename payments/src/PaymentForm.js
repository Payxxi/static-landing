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
import numeral from 'numeral';

const useStyles = makeStyles((theme) => ({
    root: {
      margin: theme.spacing(6, 0, 3),
    },
    label: {
      color: '#7B7F9E',
      fontSize: '12px',
      textAlign: 'center'
    },
    heading: {
        color: '#fff',
        fontSize: '24px',
        textAlign: 'left',
        lineHeight: '18px',
        marginTop: '10px'
    },
    subHeading: {
        color: '#7B7F9E',
        fontSize: '12px',
        textAlign: 'left'
    },
    input: {
        padding: 0,
        color: '#fff',
        textAlign: 'center',
        fontSize: 24, 
        display: 'inline-block',
        width: '75px !important'
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
    cardWrapper: {
        padding: 0,
        color: '#fff',
        textAlign: 'center',
        fontSize: 24, 
        display: 'block',
        borderColor: '#282a36',
        borderRadius: 12,
        backgroundColor: '#212330',
        textAlign: 'center',
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 10,
        //lineHeight: 50,
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
    },
    loader: {
        width: 235
    },
    success: {
        width: 183,
        marginTop: 71,
        marginBottom: 71,
    },
    circle: {
        width: 44,
        height: 44,
    }
  }));

export default function PaymentForm() {


    const [cards, setCards] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [paymentId, setPaymentId] = React.useState(null);
    const [exchangeRate, setExchangeId] = React.useState(72.38);
    const [paymentAmount, setPaymentAmount] = React.useState(72.38);
    async function createPayment() {
        setProcessing(true)
        
        //console.log(cards);

       let payment = await CircleApi.createPayment({
            email: 'ruan@segment.money',
            phoneNumber: '+27646909349',
            //sessionId: 'xxx',
            cvv: '111',
            cardId: 'db18ed0c-69f4-4fb5-ae37-891e6067f434',
            amount: numeral(paymentAmount/exchangeRate).format('0,0.00'),
            number: '4200000000000000',
            currency: 'USD',
            sourceId: cards[0].id
        });

        //console.log(payment.data)
        
        setPaymentId(payment.data.id)
        
        let interval = setInterval(() => {
            if (success || error) {
                clearInterval(interval)
            }
            //console.log(paymentId)
            checkPayment(payment.data.id);
        }, 2000);

        setTimeout(() => {
            clearInterval(interval);
        }, 5000)
    }

    async function checkPayment(paymentID) {
        //console.log(paymentID)
        if (paymentID !== null) {
            let payment = await CircleApi.getPayment(paymentID);
            //console.log(payment)
            if (payment.status == 'confirmed' || payment.status == 'success') {
                setProcessing(false);
                setSuccess(true);
            } else if (payment.status == 'failed' || payment.status == 'payment_failed') {
                setProcessing(false);
                setError(true);
            }
        }
    }

    async function getCards() {
        setLoading(true);

       let cards = await CircleApi.getCard();


        if (cards.data.length == 0) {
            let cards = await CircleApi.createCard();
        }
        else {
            setCards(cards.data);
            setLoading(false);
        }
    }
    

    React.useEffect(() => {
        if (cards.length === 0) {
            getCards();
        }
    }, [cards]);
        const classes = useStyles();
        if (loading) {
            return (
                <LinearProgress />
            )
        } else if (processing) {
            return (
                <React.Fragment>
                    <Typography variant="h6" gutterBottom color="white" className={classes.label} >
                        Processing payment
                    </Typography>
                    <div className={classes.cardWrapper}>
                        <img src="loader.gif" alt="alternative" className={classes.loader} />
                    </div>

                    <div
                    style={{
                        whiteSpace: 'normal',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: 30,
                    }}>
                        <div style={{
                            whiteSpace: 'normal',
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            
                        }}>
                        
                            <img src="circle.png" alt="alternative" className={classes.circle} style={{height: 25, width: 25, marginRight: 10, position: 'relative', top: 10}} />
                            <div
                            style={{
                                whiteSpace: 'normal',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                            }}>
                                <Typography variant="h6" gutterBottom color="white" className={classes.heading} style={{fontSize: 14, lineHeight: '10px'}}>
                                    Circle Merch
                                </Typography>
                                <Typography variant="h6" gutterBottom color="white" className={classes.subHeading} style={{fontSize: 10}}>
                                    Boston, MA
                                </Typography>
                            </div>
                        </div>
                        <div style={{
                            whiteSpace: 'normal',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="h6" gutterBottom color="white" className={classes.heading} style={{fontSize: 18}}>
                            ARS ${paymentAmount}<br />
                            <span style={{fontSize: 12}}>
                                USD ${numeral(paymentAmount/exchangeRate).format('0,0.00')}
                            </span>
                            </Typography>
                        </div>
                    </div>

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

                        <Typography variant="h6" gutterBottom color="white" className={classes.heading} style={{fontSize: 16, textAlign:'center', marginTop: 10}}>
                            Cancel
                        </Typography>

                </React.Fragment>
            )
        }
        else if (success) {
            return (
                <React.Fragment>
                    <Typography variant="h6" gutterBottom color="white" className={classes.label} >
                        Payment Successful
                    </Typography>
                    <div className={classes.cardWrapper}>
                        <img src="success.gif" alt="alternative" className={classes.success} />
                    </div>

                    <div
                    style={{
                        whiteSpace: 'normal',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: 30,
                    }}>
                        <div style={{
                            whiteSpace: 'normal',
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            
                        }}>
                        
                            <img src="circle.png" alt="alternative" className={classes.circle} style={{height: 25, width: 25, marginRight: 10, position: 'relative', top: 10}} />
                            <div
                            style={{
                                whiteSpace: 'normal',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                            }}>
                                <Typography variant="h6" gutterBottom color="white" className={classes.heading} style={{fontSize: 14, lineHeight: '10px'}}>
                                    Circle Merch
                                </Typography>
                                <Typography variant="h6" gutterBottom color="white" className={classes.subHeading} style={{fontSize: 10}}>
                                    Boston, MA
                                </Typography>
                            </div>
                        </div>
                        <div style={{
                            whiteSpace: 'normal',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="h6" gutterBottom color="white" className={classes.heading} style={{fontSize: 18}}>
                            ARS ${paymentAmount}<br />
                            <span style={{fontSize: 12}}>
                                USD ${numeral(paymentAmount/exchangeRate).format('0,0.00')}
                            </span>
                            </Typography>
                        </div>
                    </div>

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

                        <Typography variant="h6" gutterBottom color="white" className={classes.heading} style={{fontSize: 16, textAlign:'right', marginTop: 10, marginRight: 10}}>
                            Email Receipt
                        </Typography>

                </React.Fragment>
            )
        }
        else {
            return (
                <React.Fragment>
                    <Typography variant="h6" gutterBottom color="white" className={classes.label} >
                        Confirm your payment to:
                    </Typography>
                    <div className={classes.cardWrapper}
                        style={{
                            whiteSpace: 'normal',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            padding: 30,
                            marginBottom: 20
                        }}>
                        <div style={{
                            whiteSpace: 'normal',
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            
                        }}>
                        <Typography variant="h6" gutterBottom color="white" className={classes.heading} >
                            Circle Merch
                        </Typography>
                        <Typography variant="h6" gutterBottom color="white" className={classes.subHeading} >
                            Boston, MA
                        </Typography>
                        </div>
                        <div style={{
                            whiteSpace: 'normal',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between'
                        }}>
                            <img src="circle.png" alt="alternative" className={classes.circle} />
                        </div>
                    </div>
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
                            onChange={(event) => setPaymentAmount(event.target.value)}
                            value={paymentAmount} disableUnderline={true}  />
                        </div>
                        <Typography variant="h6" gutterBottom color="white" className={classes.label} >
                            USD ${numeral(paymentAmount/exchangeRate).format('0,0.00')}
                        </Typography>
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
                        {error && 
                            <Typography color={'red'}>
                                {'There was an error processing your payment'}
                            </Typography> 
                        }

                        <Button color="secondary" variant={'primary'} fullWidth className={classes.button} onClick={() => createPayment()}>
                            Pay Now
                        </Button>
                        </Grid>
                    </Grid>
                </React.Fragment>
            )
        }
    
}