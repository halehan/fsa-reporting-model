export class Constants {
   // static readonly DATE_FMT = 'dd/MMM/yyyy';
    static readonly DATE_FMT = 'MMM-dd-yyyy';
    static readonly DATE_TIME_FMT = `${Constants.DATE_FMT} hh:mm:ss a`;

    static readonly SERVER_URL = '';

    static readonly FACEBOOK_VERIFY_TOKEN = '';
    static readonly FACEBOOK_PAGE_VERIFY_TOKEN = '';
    
    static readonly GOOGLE_API_KEY = '';
    static readonly version = '1.0.4 ' + new Date();

    static readonly REPLY_MESSAGE = 'We have recived your message and have added the request to our queue.  Please standby for a law enforcement representative to respond.' + 
    '\n\n If you would like to share your location that may help us find you in the event that this is applicable.\n\n' +
    'Your Message: \n';

    static readonly credentials = {
      email: '',
      password: '',
      superSecret: "dog"
    }

    static readonly configSworm = {
      driver: 'mssql',
      config: {
      user: 'veba',
      password: 'veba',
      server: '10.100.60.61',
      database: 'CPP_ACCESS',
      log: true }
  }
  
  }