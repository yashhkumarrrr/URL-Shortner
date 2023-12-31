import './home.css';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import MuiAlert from '@mui/material/Alert';
import { useState, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';

import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const validationSchema = yup.object({
    input: yup
        .string('Enter long URL')
        .url('Enter a valid URL')
        .required('URL is Required'),
});

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 61,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            // left: 0,
            // top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

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

    const logoDark = require('./images/logo-dark.webp')

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

    return (
        <>
            <div className='WebApp'>
                <div>
                    <div className='header'>
                        <div className='header-img'>
                            <a
                                target='_blank'
                                rel='noreferrer'
                                aria-label="Home"
                                href='https://yashhkumarrrr.netlify.app'
                            >
                                <img className='header-logo' alt='Logo' src={logoDark} />
                            </a>
                        </div>

                        <div>
                            <FormControlLabel
                                id='header-toggle-mode'
                                control={<MaterialUISwitch defaultChecked />}
                            />
                        </div>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className='home-body'>
                    <div className='home-head'>
                        Shorty URL
                    </div>

                    <div className='home-textfield'>
                        <input
                            name='input'
                            autoComplete='off'
                            onBlur={formik.handleBlur}
                            value={formik.values.input}
                            onChange={formik.handleChange}
                            placeholder='Paste Your URL Here *'
                        // helperText={formik.touched.input && formik.errors.input}
                        // error={formik.touched.input && Boolean(formik.errors.input)}
                        />
                        {formik.touched.input &&
                            <div className='contact-form-error'>{formik.errors.input}</div>
                        }
                    </div>

                    <div className='home-btn'>
                        <button
                            type='submit'
                            className='contact-form-btn'
                        >
                            Submit
                        </button>
                    </div>

                    <div className='home-textfield'>
                        <input
                            value={result}
                            placeholder='Shorten URL'
                        />
                    </div>

                    <div className='home-btn'>
                        <button
                            id='home-btn-copy'
                            onClick={handleCopy}
                        >
                            Copy
                        </button>
                    </div>
                </form>

                <div
                    className='footer'
                >
                    Developed by -&nbsp;
                    <a
                        target='_blank'
                        rel='noreferrer'
                        className='footer-link'
                        href='https://yashhkumarrrr.netlify.app/'
                    >
                        Yash
                    </a>
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