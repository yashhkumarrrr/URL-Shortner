import './home.css';
import axios from 'axios';
import * as yup from 'yup';
import * as React from 'react';
import { useFormik } from 'formik';
import Qrcode from 'react-qr-code';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Switch from '@mui/material/Switch';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useState, useRef, forwardRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormControlLabel from '@mui/material/FormControlLabel';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { Button } from '@mui/material';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const validationSchema1 = yup.object({
    feedback: yup
        .string('Enter your Message')
        .required("Can't be empty"),
});

const validationSchema2 = yup.object({
    link: yup
        .string('Enter your Message')
        .url('Enter a valid URL')
        .required("Please enter URL first"),
});

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 61,
    height: 34,
    padding: 8,
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
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#E0E0E0',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#77589B' : '#1d74c6',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#ff0000' : '#616161',
        borderRadius: 20 / 2,
    },
}));

function Home(props) {

    const appName = 'URL Shortner'
    const qrCodeRef = useRef(null)
    const [result, setResult] = useState('')
    const logo = require('./files/logo.webp')
    const report = require('./files/report.webp')

    const [value, setValue] = useState('');
    const [state, setState] = useState({ right: false })
    const [feedbackType, setFeedbackType] = useState('')
    const [drawerReport, setDrawerReport] = useState('none')
    const [drawerSuggest, setDrawerSuggest] = useState('none')
    const [snackbarContent, setSnackbarContent] = useState('')
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [successSnackbar, setSuccessSnackbar] = useState(true)
    const [drawerFeedback, setDrawerFeedback] = useState('flex')
    const [qrCode, setQRCode] = useState('https://yashhkumarrrr.netlify.app');

    const openSnackbar = () => {
        setIsSnackbarOpen(true)
    };

    const closeSnackbar = (reason) => {
        if (reason === 'clickAway') {
            return;
        }
        setIsSnackbarOpen(false)
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const formik1 = useFormik({
        initialValues: {
            type: '',
            webapp: '',
            feedback: '',
        },
        validationSchema: validationSchema1,
        onSubmit: () => {
            try {
                axios.post('https://64869defbeba6297278ef763.mockapi.io/feedback', {
                    webapp: appName,
                    type: feedbackType,
                    feedback: formik1.values.feedback,
                });
                setSuccessSnackbar(true)
                setSnackbarContent('Message sent successfully!!')
                openSnackbar()
                setDrawerFeedback('flex')
                setDrawerReport('none')
                setDrawerSuggest('none')
                formik1.resetForm()
            }
            catch (e) {
                setSuccessSnackbar(false);
                setSnackbarContent('Message not Delivered!!')
                openSnackbar();
                setDrawerFeedback('flex')
                setDrawerReport('none')
                setDrawerSuggest('none')
            }
        },
    });

    const formik2 = useFormik({
        initialValues: {
            link: '',
        },
        validationSchema: validationSchema2,
        onSubmit: () => {
            try {
                axios.get(
                    `https://tinyurl.com/api-create.php?url=${value}`
                )
                    .then(
                        (response) => {
                            setResult(response.data)
                            setQRCode(value);
                        }
                    )
                    .catch(
                        () => {
                            setSuccessSnackbar(false)
                            setSnackbarContent('Unable to process the link!')
                            openSnackbar()
                            setResult('')
                        }
                    )
                // event.preventDefault();
            }
            catch (e) {
                setSuccessSnackbar(false)
                setSnackbarContent('Empty field!!')
                openSnackbar()
                setResult('')
                setQRCode('')
                // event.preventDefault();
            }
        },
    });

    const theme = createTheme({
        typography: {
            fontSize: 14,
            fontFamily: 'Poppins'
        },
    });

    const handleSubmit = (event) => {
        if (value !== '') {
            axios.get(
                `https://tinyurl.com/api-create.php?url=${value}`
            )
                .then(
                    (response) => {
                        setResult(response.data)
                        setQRCode(value);
                    }
                )
                .catch(
                    () => {
                        setSuccessSnackbar(false)
                        setSnackbarContent('Unable to process the link!')
                        openSnackbar()
                        setResult('')
                    }
                )
            event.preventDefault();
        }
        else {
            setSuccessSnackbar(false)
            setSnackbarContent('Empty field!!')
            openSnackbar()
            setResult('')
            setQRCode('')
            event.preventDefault();
        }
    }

    const handleCopy = () => {
        try {
            if (result === '') {
                setSuccessSnackbar(false)
                setSnackbarContent('Nothing to Copy!')
                openSnackbar()
            }
            else {
                setSuccessSnackbar(true)
                setSnackbarContent('Successfully Copied!')
                openSnackbar()
                navigator.clipboard.writeText(result);
            }
        }
        catch (error) {
            console.log(error)
            setSuccessSnackbar(false)
            setSnackbarContent('Some Error Occurred!')
            openSnackbar()
        }
    }

    const handleDownload = () => {
        if (qrCodeRef.current) {
            html2canvas(qrCodeRef.current, { useCORS: true }).then((canvas) => {
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };

    return (
        <>
            <div className={`body-${props.isDark ? 'dark' : 'light'}`}>

                {/* Header */}

                <div className={`header-${props.isDark ? 'dark' : 'light'}`}>
                    <div>
                        <Link
                            to='#'
                            aria-label="Home"
                            className={`header-logo-link-${props.isDark ? 'dark' : 'light'}`}
                        >
                            <div className='header-logo'>
                                <div className='header-logo-div'>
                                    <img
                                        alt='Logo'
                                        src={logo}
                                        className='header-img'
                                    />
                                </div>

                                <div className='header-logo-name'>
                                    URL Shortner
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className='header-btns'>
                        <div className='feedback-icon-div'>
                            <React.Fragment>
                                <ThemeProvider theme={theme}>
                                    <Tooltip TransitionComponent={Zoom} title="Provide Feedback" disableInteractive>
                                        <IconButton
                                            aria-label='Provide Feedback'
                                            onClick={toggleDrawer('right', true)}
                                        >
                                            <ErrorOutlineOutlinedIcon
                                                sx={{ fontSize: 33 }}
                                                className={`feedback-icons-${props.isDark ? 'dark' : 'light'}`}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </ThemeProvider>

                                {['right'].map((anchor) => (
                                    <React.Fragment key={anchor}>
                                        <Drawer
                                            anchor={anchor}
                                            open={state[anchor]}
                                            onClose={toggleDrawer(anchor, false)}
                                        >
                                            <Box
                                                sx={{ display: `${drawerFeedback}`, flexDirection: 'column' }}
                                                className={`feedback-box-${props.isDark ? 'dark' : 'light'}`}
                                            >
                                                <div className='feedback-head'>
                                                    <div>
                                                        Send Feedback
                                                    </div>

                                                    <div>
                                                        <ThemeProvider theme={theme}>
                                                            <Tooltip TransitionComponent={Zoom} title="Close" disableInteractive>
                                                                <IconButton onClick={toggleDrawer(anchor, false)}>
                                                                    <CloseIcon className={`feedback-icons-${props.isDark ? 'dark' : 'light'}`} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </ThemeProvider>
                                                    </div>
                                                </div>

                                                <div className='feedback-body'>
                                                    <div className='feedback-img'>
                                                        <img src={report} alt='Report' height='180px' />
                                                    </div>

                                                    <div
                                                        className={`feedback-links-${props.isDark ? 'dark' : 'light'}`}
                                                        onClick={() => {
                                                            setDrawerFeedback('none')
                                                            setDrawerReport('flex')
                                                            setFeedbackType('Issue')
                                                        }}>
                                                        <div>
                                                            <ReportProblemOutlinedIcon
                                                                sx={{ fontSize: 25 }}
                                                                className={`feedback-links-icon-${props.isDark ? 'dark' : 'light'}`}
                                                            />
                                                        </div>

                                                        <div>
                                                            Report an Issue
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`feedback-links-${props.isDark ? 'dark' : 'light'}`}
                                                        onClick={() => {
                                                            setDrawerFeedback('none')
                                                            setDrawerSuggest('flex')
                                                            setFeedbackType('Suggestion')
                                                        }}>
                                                        <div>
                                                            <LightbulbOutlinedIcon
                                                                sx={{ fontSize: 25 }}
                                                                className={`feedback-links-icon-${props.isDark ? 'dark' : 'light'}`}
                                                            />
                                                        </div>

                                                        <div>
                                                            Suggest an Idea
                                                        </div>
                                                    </div>
                                                </div>
                                            </Box>

                                            <Box
                                                sx={{ display: `${drawerReport}`, flexDirection: 'column' }}
                                                className={`feedback-box-${props.isDark ? 'dark' : 'light'}`}
                                            >
                                                <div className='feedback-head'>
                                                    <div>
                                                        <ThemeProvider theme={theme}>
                                                            <Tooltip TransitionComponent={Zoom} title="Back" disableInteractive>
                                                                <IconButton onClick={() => {
                                                                    setDrawerFeedback('flex')
                                                                    setDrawerReport('none')
                                                                    setFeedbackType('')
                                                                    formik1.resetForm()
                                                                }}>
                                                                    <ArrowBackIcon className={`feedback-icons-${props.isDark ? 'dark' : 'light'}`} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </ThemeProvider>
                                                    </div>

                                                    <div>
                                                        Report an issue
                                                    </div>

                                                    <ThemeProvider theme={theme}>
                                                        <Tooltip TransitionComponent={Zoom} title="Close" disableInteractive>
                                                            <IconButton onClick={toggleDrawer(anchor, false)}>
                                                                <CloseIcon className={`feedback-icons-${props.isDark ? 'dark' : 'light'}`} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </ThemeProvider>
                                                </div>

                                                <form onSubmit={formik1.handleSubmit} className='feedback-body'>
                                                    <div className='feedback-body-1'>
                                                        <div className='feedback-body-1-1'>
                                                            <div className='feedback-body-1-1-1'>
                                                                Describe the Issue or Bug
                                                            </div>

                                                            <div className='feedback-body-1-1-2'>
                                                                <textarea
                                                                    rows={10}
                                                                    name='feedback'
                                                                    autoComplete='off'
                                                                    onBlur={formik1.handleBlur}
                                                                    value={formik1.values.feedback}
                                                                    onChange={formik1.handleChange}
                                                                    placeholder='Type your Message'
                                                                    className={`feedback-textarea-${props.isDark ? 'dark' : 'light'}`}
                                                                />
                                                                {formik1.touched.feedback &&
                                                                    <div className='feebdback-form-error'>{formik1.errors.feedback}</div>
                                                                }
                                                            </div>

                                                            <div className='feedback-body-1-1-3'>
                                                                Please don't include any sensitive information
                                                            </div>
                                                        </div>

                                                        <div className='feedback-body-1-2'>
                                                            The information provided by you above will not be kept in encrypted form, so be sure that you didn't provide any personal or confidential information which others could misuse. For any help regarding any problem, you can email me at <a href='mailto:yashhkumarrrr@gmail.com' target='_blank' rel="noreferrer" className={`feedback-body-1-2-link-${props.isDark ? 'dark' : 'light'}`}>yashhkumarrrr@gmail.com</a>
                                                        </div>
                                                    </div>

                                                    <div className='feedback-body-2'>
                                                        <button
                                                            type='submit'
                                                            className={`feedback-body-2-btn-${props.isDark ? 'dark' : 'light'}`}
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                </form>
                                            </Box>

                                            <Box
                                                sx={{ display: `${drawerSuggest}`, flexDirection: 'column' }}
                                                className={`feedback-box-${props.isDark ? 'dark' : 'light'}`}
                                            >
                                                <div className='feedback-head'>
                                                    <div>
                                                        <ThemeProvider theme={theme}>
                                                            <Tooltip TransitionComponent={Zoom} title="Back" disableInteractive>
                                                                <IconButton onClick={() => {
                                                                    setDrawerFeedback('flex')
                                                                    setDrawerSuggest('none')
                                                                    setFeedbackType('')
                                                                    formik1.resetForm()
                                                                }}>
                                                                    <ArrowBackIcon className={`feedback-icons-${props.isDark ? 'dark' : 'light'}`} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </ThemeProvider>
                                                    </div>

                                                    <div>
                                                        Suggest an Idea
                                                    </div>

                                                    <ThemeProvider theme={theme}>
                                                        <Tooltip TransitionComponent={Zoom} title="Close" disableInteractive>
                                                            <IconButton onClick={toggleDrawer(anchor, false)}>
                                                                <CloseIcon className={`feedback-icons-${props.isDark ? 'dark' : 'light'}`} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </ThemeProvider>
                                                </div>

                                                <form className='feedback-body'>
                                                    <div className='feedback-body-1'>
                                                        <div className='feedback-body-1-1'>
                                                            <div className='feedback-body-1-1-1'>
                                                                Provide your valuable suggestion
                                                            </div>

                                                            <div className='feedback-body-1-1-2'>
                                                                <textarea
                                                                    rows={10}
                                                                    name='feedback'
                                                                    autoComplete='off'
                                                                    onBlur={formik1.handleBlur}
                                                                    value={formik1.values.feedback}
                                                                    onChange={formik1.handleChange}
                                                                    placeholder='Type your Message'
                                                                    className={`feedback-textarea-${props.isDark ? 'dark' : 'light'}`}
                                                                />
                                                                {formik1.touched.feedback &&
                                                                    <div className='feebdback-form-error'>{formik1.errors.feedback}</div>
                                                                }
                                                            </div>

                                                            <div className='feedback-body-1-1-3'>
                                                                Please don't include any sensitive information
                                                            </div>
                                                        </div>

                                                        <div className='feedback-body-1-2'>
                                                            The information provided by you above will not be kept in encrypted form, so be sure that you didn't provide any personal or confidential information which others could misuse. For any help regarding any problem, you can email me at <a href='mailto:yashhkumarrrr@gmail.com' target='_blank' rel="noreferrer" className={`feedback-body-1-2-link-${props.isDark ? 'dark' : 'light'}`}>yashhkumarrrr@gmail.com</a>
                                                        </div>
                                                    </div>

                                                    <div className='feedback-body-2'>
                                                        <button
                                                            onClick={formik1.handleSubmit}
                                                            className={`feedback-body-2-btn-${props.isDark ? 'dark' : 'light'}`}
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                </form>
                                            </Box>
                                        </Drawer>
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        </div>

                        <div className='feedback-icon-div'>
                            <ThemeProvider theme={theme}>
                                <Tooltip TransitionComponent={Zoom} title="Toggle Theme" disableInteractive>
                                    <FormControlLabel
                                        id='header-toggle-mode-btn'
                                        control={<MaterialUISwitch
                                            checked={props.isDark}
                                            aria-label='Toggle Mode'
                                            onChange={props.toggleTheme}
                                        />}
                                    />
                                </Tooltip>
                            </ThemeProvider>
                        </div>
                    </div>
                </div>

                {/* Body */}

                <div id='home'>
                    <div className='home-body'>
                        <div className='home-head'>
                            URL Shortner
                        </div>

                        <form onSubmit={handleSubmit} className='home-input-body'>
                            <input
                                value={value}
                                className='home-input'
                                placeholder='Paste Your URL Here'
                                onChange={(e) => setValue(e.target.value)}
                            />

                            <IconButton
                                type='submit'
                                aria-label='Shorten URL'
                                className='home-submit-btn'
                            >
                                <LinkIcon sx={{ fontSize: 30 }} />
                            </IconButton>
                        </form>

                        <div className='home-qr-btn-div'>
                            <Button
                                id='home-qr-btn'
                                color='secondary'
                                variant='contained'
                                // onClick={formik2.resetForm()}
                            >
                                Clear
                            </Button>

                            <Button
                                id='home-qr-btn'
                                color='secondary'
                                variant='contained'
                            >
                                Genetrate QR
                            </Button>
                        </div>

                        <div className='home-input-body'>
                            <input
                                readOnly
                                value={result}
                                className='home-input'
                                placeholder='Shorten URL'
                            />

                            <IconButton
                                onClick={handleCopy}
                                aria-label='Shorten URL'
                                className='home-submit-btn'
                            >
                                <ContentCopyIcon sx={{ fontSize: 25 }} />
                            </IconButton>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='home-qr-div'>
                        <div ref={qrCodeRef} className='home-qr'>
                            <Qrcode value={qrCode} />
                        </div>
                    </div>

                    <div>
                        <Button
                            color='success'
                            variant='contained'
                            onClick={handleDownload}
                        >
                            Download QR Code
                        </Button>
                    </div>
                </div>

                {/* Footer */}

                <div className='footer'>
                    Developed by&nbsp;
                    <Link
                        target='_blank'
                        id={`footer-link-${props.isDark ? 'dark' : 'light'}`}
                        to='https://yashhkumarrrr.netlify.app'
                    >
                        &copy; yashhkumarrrr
                    </Link>
                </div>

                <Snackbar open={isSnackbarOpen} autoHideDuration={1500} onClose={closeSnackbar}>
                    <Alert onClose={closeSnackbar} severity={(successSnackbar) ? 'success' : 'error'} sx={{ width: '100%', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '300' }}>
                        {snackbarContent}
                    </Alert>
                </Snackbar>
            </div >
        </>
    );
}

export default Home;