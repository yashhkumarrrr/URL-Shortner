import './home.css';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import { useState, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const validationSchema = yup.object({
    input: yup
        .string('Enter long URL')
        .url('Enter a valid URL')
        .required('URL is Required'),
});

function Home() {

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickAway') {
            return;
        }
        setOpen(false);
    };

    const [result, setResult] = useState('');

    const formik = useFormik({
        initialValues: {
            input: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            const fetchData = async () => {
                try {
                    const res = await axios(`https://api.shrtco.de/v2/shorten?url=${formik.values.input}`);
                    setResult(res.data.result.full_short_link);
                }
                catch (err) {
                    handleClick();
                    formik.resetForm();
                }
            }
            fetchData();
        },
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
    }

    const theme = createTheme({
        typography: {
            body1: {
                fontSize: '1.1rem',
                fontFamily: 'Poppins',
                '@media (max-width: 950px)': {
                    fontSize: '1rem',
                },
                '@media (max-width: 550px)': {
                    fontSize: '0.9rem',
                },
                '@media (max-width: 450px)': {
                    fontSize: '0.8rem',
                },
            }
        },
    });

    return (
        <>
            <div className='home-body'>
                <form onSubmit={formik.handleSubmit} className='home-section'>
                    <div className='home-segment'>
                        <div className='home-heading'>
                            Shorty URL
                        </div>

                        <div className='home-textfield'>
                            <ThemeProvider theme={theme}>
                                <Typography variant='body1'>
                                    <TextField
                                        fullWidth
                                        name='input'
                                        variant='standard'
                                        onBlur={formik.handleBlur}
                                        value={formik.values.input}
                                        label='Paste Your URL Here *'
                                        onChange={formik.handleChange}
                                        helperText={formik.touched.input && formik.errors.input}
                                        error={formik.touched.input && Boolean(formik.errors.input)}
                                    />
                                </Typography>
                            </ThemeProvider>
                        </div>

                        <div className='home-btn'>
                            <Button
                                type='submit'
                                variant='contained'
                                id='home-btn-submit'
                            >
                                Submit
                            </Button>
                        </div>

                        <div className='home-textfield'>
                            <ThemeProvider theme={theme}>
                                <Typography variant='body1'>
                                    <TextField
                                        focused
                                        fullWidth
                                        value={result}
                                        variant='outlined'
                                        label='Shorten URL'
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Typography>
                            </ThemeProvider>
                        </div>

                        <div className='home-btn'>
                            <Button
                                color='secondary'
                                id='home-btn-copy'
                                variant='contained'
                                onClick={handleCopy}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>
                </form>

                <div
                    className='footer-body'
                >
                    Developed by -&nbsp;
                    <Link
                        className='footer-link'
                        to='https://yashhkumarrrr.netlify.app/'
                    >
                        Yash
                    </Link>
                </div>

                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Unable to process the Link
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}

export default Home;