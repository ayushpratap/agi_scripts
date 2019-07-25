  /*
      Filename    : oai.middleware.js
      Description :
  */
  //------------------------------------------------------------------------------
  require('magic-globals');
  const CONFIG = require('../config/config');
  const logger = CONFIG.logger;
  const net = require('net');
  const oai = {};
  const SV9100 = "SV9100";
  const SV9500 = "SV9500";
  var flag=0;
  //const logger = CONFIG.logger;
  var numArr = {
                "0": 0x0a,
                "1": 0x01,
                "2": 0x02,
                "3": 0x03,
                "4": 0x04,
                "5": 0x05,
                "6": 0x06,
                "7": 0x07,
                "8": 0x08,
                "9": 0x09
              };
  //------------------------------------------------------------------------------

  //logger.info('Starting up the OAI middleware');

  /****************************************************** CONNECT PACKETS *************************************************************************************************/
  /* ----> */var connect_to_sv9500_1              = Buffer.from([0x60,0x1c,0x80,0x02,0x00,0x00,0xa3,0x03,0x06,0x01,0x00,0xa4,0x11,0x08,0x0f,0x4e,0x45,0x43,0x20,0x43,0x26,0x43,0x20,0x28,0x4f,0x41,0x49,0x29,0x20,0x58]);
  /* <---- */var connect_from_sv9500_1            = Buffer.from([0x61,0x0c,0x80,0x02,0x00,0x00,0x81,0x01,0x00,0xa3,0x03,0x06,0x01,0x00]);
  /* ----> */var connect_to_sv9500_2              = Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x01,0x02,0x01,0x28,0x30,0x0b,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0x82,0x01,0x95]);
  /* ----> */var connect_to_sv9500_3              = Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x03,0x02,0x01,0x28,0x30,0x0b,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0x82,0x01,0x62]);
  /* <---- */var connect_from_sv500_2             = Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x01,0x30,0x08,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01]);
  /* ----> */var connect_to_sv9500_4              = Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x05,0x02,0x01,0x28,0x30,0x0b,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0x82,0x01,0xb5]);
  /* <---- */var connect_from_sv9500_3            = Buffer.from([0xa3,0x15,0x30,0x13,0x02,0x01,0x03,0x02,0x01,0x02,0x30,0x0b,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0x81,0x01,0x02]);
  /* <---- */var connect_from_sv9500_4            = Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x05,0x30,0x08,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01]);
  /* ----> */var connect_to_sv9500_5              = Buffer.from([0xa1,0x32,0x30,0x30,0x02,0x01,0x07,0x02,0x01,0x95,0x30,0x28,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0x82,0x1e,0x49,0x48,0x32,0x30,0x30,0x30,0x61,0x74,0x74,0x74,0x74,0x74,0x74,0x64,0x73,0x63,0x56,0x61,0x6c,0x69,0x64,0x61,0x74,0x65,0x32,0x30,0x30,0x30,0x2e,0x00]);
  /* <---- */var connect_from_sv9500_5            = Buffer.from([0x30,0x82,0x00,0x1f,0x02,0x02,0x02,0x98,0x02,0x01,0xb5,0x30,0x82,0x00,0x14,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0x82,0x0a,0x49,0x59,0x32,0x30,0x30,0x30,0x31,0x30,0x31,0x0a]);
  /* ----> */var connect_to_sv9500_6              = Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x09,0x02,0x01,0x29,0x30,0x0b,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0x82,0x01,0x95]);
  /* <---- */var connect_from_sv9500_6            = Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x09,0x30,0x08,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01]);
  /* ----> */var connect_to_sv9500_7              = Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x0b,0x02,0x01,0x29,0x30,0x0b,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0x82,0x01,0xb5]);
  /* <---- */var connect_from_sv9500_7            = Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x0b,0x30,0x08,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01]);
  /************************************************************************************************************************************************************************/

  /****************************************************** OPEN SWITCH CONTROL *********************************************************************************************/
  /* ----> */var switch_control_to_sv9500         = Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x15,0x02,0x01,0x28,0x30,0x0b,0xa0,0x06,0x04,0x01,0x00,0x04,0x01,0x01,0x82,0x01,0x69]); 
  /* <---- */var switch_control_from_sv9500       = Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x15,0x30,0x08,0xa0,0x06,0x04,0x01,0x00,0x04,0x01,0x01]);
  /************************************************************************************************************************************************************************/

  /****************************************************** END CALL ********************************************************************************************************/
  /* ----> */var endcall_to_sv9500                = Buffer.from([0xa1,0x23,0x30,0x21,0x02,0x01,0x11,0x02,0x01,0x69,0x30,0x19,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x02,0xa2,0x0f,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x04,0x02,0x08,0x0a,0x0a]);
  /***
    Source extension to terminate call            = endcall_to_sv9500[33],endcall_to_sv9500[34],endcall_to_sv9500[35],endcall_to_sv9500[36] 
  ***/
  /* <---- */var endcall_from_sv9500              = Buffer.from([0xa2,0x2f,0x30,0x2d,0x02,0x01,0x11,0x30,0x28,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x02,0xa1,0x1e,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x02,0x08,0x0a,0x0a,0xa1,0x0d,0x04,0x01,0x01,0x04,0x02,0x02,0x04,0x04,0x04,0x00,0xa0,0x00,0x0b]);
  /***
    Source extension to terminate call            = endcall_from_sv9500[30],endcall_from_sv9500[31],endcall_from_sv9500[32],endcall_from_sv9500[33],
  ***/
  /************************************************************************************************************************************************************************/

  /****************************************************** MAKE CALL *******************************************************************************************************/
  /* ----> */var makecall_to_sv9500               = Buffer.from([0xa1,0x34,0x30,0x32,0x02,0x01,0x19,0x02,0x01,0x69,0x30,0x2a,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0xa2,0x0f,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x04,0x02,0x08,0x0a,0x0a,0xa3,0x06,0x80,0x04,0x02,0x08,0x0a,0x01,0x84,0x01,0x02,0x85,0x01,0x03,0x86,0x01,0x01]);
  /***
    Source extension to make call                 = makecall_to_sv9500[33],makecall_to_sv9500[34],makecall_to_sv9500[35],makecall_to_sv9500[36]
    Destination extension to make call            = makecall_to_sv9500[41],makecall_to_sv9500[42],makecall_to_sv9500[43],makecall_to_sv9500[44]
  ***/
  /* <---- */var makecall_from_sv9500             = Buffer.from([0xa2,0x2f,0x30,0x2d,0x02,0x01,0x19,0x30,0x28,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0xa1,0x1e,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x02,0x08,0x0a,0x0a,0xa1,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x02,0x08,0x0a,0x01]);
  /************************************************************************************************************************************************************************/

  /****************************************************** OPEN MONITORING *************************************************************************************************/
  /* ----> */var open_monitoring_to_sv9500        = Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x1b,0x02,0x01,0x28,0x30,0x0b,0xa0,0x06,0x04,0x01,0x00,0x04,0x01,0x01,0x82,0x01,0x68]);
  /* <---- */var open_monitoring_from_sv9500      = Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x1b,0x30,0x08,0xa0,0x06,0x04,0x01,0x00,0x04,0x01,0x01]);
  /************************************************************************************************************************************************************************

  /****************************************************** OPEN STATUS NOTIFY **********************************************************************************************/
  /* ----> */var open_notify_to_sv9500            = Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x0f,0x02,0x01,0x28,0x30,0x0b,0xa0,0x06,0x04,0x01,0x00,0x04,0x01,0x01,0x82,0x01,0xb8]);
  /* <---- */var open_notify_from_sv9500          = Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x0f,0x30,0x08,0xa0,0x06,0x04,0x01,0x00,0x04,0x01,0x01]);
  /************************************************************************************************************************************************************************/

  /****************************************************** START MONITOR ***************************************************************************************************/
  /* ----> */var start_monitor_to_sv9500          = Buffer.from([0xa1,0x24,0x30,0x22,0x02,0x01,0x25,0x02,0x01,0x68,0x30,0x1a,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x7f,0x82,0x01,0x00,0xa3,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x04,0x02,0x08,0x0a,0x01]);
  /***
    Station to be monitored                      =  start_monitor_to_sv9500[34],start_monitor_to_sv9500[35],start_monitor_to_sv9500[36],start_monitor_to_sv9500[37]
  ***/
  /* <---- */var start_monitor_from_sv9500        = Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x25,0x30,0x08,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x7f]);
  /************************************************************************************************************************************************************************/

  /****************************************************** MONITOR NOTIFY **************************************************************************************************/
  /* <---- */var monitor_notify_from_sv9500       = Buffer.from([0xa1,0x81,0x3a,0x30,0x81,0x37,0x02,0x02,0x1e,0x9e,0x02,0x01,0xb8,0x30,0x81,0x2d,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x02,0x82,0x01,0x00,0xa3,0x0f,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x02,0x08,0x0a,0x01,0xa4,0x0f,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x02,0x08,0x0a,0x0a]);
  //var monitor_notify_from_sv9500       = Buffer.from([0xa1,0x81,0x39,0x30,0x81,0x36,0x02,0x01,0x58,0x02,0x01,0xb8,0x30,0x81,0x2d,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x02,0x82,0x01,0x00,0xa3,0x0f,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x02,0x08,0x0a,0x0a,0xa4,0x0f,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x02,0x08,0x0a,0x01]);
  /***
    Source station addresss                       = monitor_notify_from_sv9500[57],monitor_notify_from_sv9500[58],monitor_notify_from_sv9500[59],monitor_notify_from_sv9500[60]
    Destination station address                   = monitor_notify_from_sv9500[40],monitor_notify_from_sv9500[41],monitor_notify_from_sv9500[42],monitor_notify_from_sv9500[43]
  ***/
  /************************************************************************************************************************************************************************/

  /****************************************************** MAKE CONFERENCE *************************************************************************************************/
  /* ----> */var makeConference_to_sv9500         = Buffer.from([0xa1,0x3f,0x30,0x3d,0x02,0x01,0x29,0x02,0x01,0x69,0x30,0x35,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x08,0xa2,0x0f,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x04,0x02,0x08,0x0a,0x0a,0xa3,0x06,0x80,0x04,0x03,0x0a,0x03,0x04,0x86,0x01,0x02,0xa7,0x0f,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x04,0x02,0x08,0x0a,0x01]);
  /***
    Station A                                     = makeConference_to_sv9500[33],makeConference_to_sv9500[34],makeConference_to_sv9500[35],makeConference_to_sv9500[36]
    Station B                                     = makeConference_to_sv9500[61],makeConference_to_sv9500[62],makeConference_to_sv9500[63],makeConference_to_sv9500[64]
    Station C                                     = makeConference_to_sv9500[41],makeConference_to_sv9500[42],makeConference_to_sv9500[43],makeConference_to_sv9500[44]
  ***/
  /* <---- */var makeConference_from_sv9500       = Buffer.from([0xa2,0x2f,0x30,0x2d,0x02,0x01,0x29,0x30,0x28,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x08,0xa1,0x1e,0xa0,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x02,0x08,0x0a,0x0a,0xa1,0x0d,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x04,0x03,0x0a,0x03,0x04]);
  /***
    Station A                                     = makeConference_from_sv9500[30],makeConference_from_sv9500[31],makeConference_from_sv9500[32],makeConference_from_sv9500[33]
    Station C                                     = makeConference_from_sv9500[45],makeConference_from_sv9500[46],makeConference_from_sv9500[47],makeConference_from_sv9500[48]
  ***/
  /************************************************************************************************************************************************************************/

  //------------------------------------------------------------------------------
  //  SV9100 Packets
  //------------------------------------------------------------------------------
  //****************************** Connect ***************************************
  //  60:1c:80:02:00:00:a3:03:06:01:00:a4:11:08:0f:4e:45:43:20:43:26:43:20:28:4f:41:49:29:20:58
  var connect_to_sv9100           =   Buffer.from([0x60,0x1c,0x80,0x02,0x00,0x00,0xa3,0x03,0x06,0x01,0x00,0xa4,0x11,0x08,0x0f,0x4e,0x45,0x43,0x20,0x43,0x26,0x43,0x20,0x28,0x4f,0x41,0x49,0x29,0x20,0x58]);
  //  61:0c:80:02:00:00:81:01:00:a3:03:06:01:00
  var connect_from_sv9100         =   Buffer.from([0x61,0x0c,0x80,0x02,0x00,0x00,0x81,0x01,0x00,0xa3,0x03,0x06,0x01,0x00]);
  //******************************************************************************
  //********************** Open Switch Control ***********************************
  //  a1:15:30:13:02:01:07:02:01:28:30:0b:a0:06:04:01:00:04:01:01:82:01:69
  var switch_control_to_sv9100    =   Buffer.from([0xa1,0x15,0x30,0x13,0x02,0x01,0x07,0x02,0x01,0x28,0x30,0x0b,0xa0,0x06,0x04,0x01,0x00,0x04,0x01,0x01,0x82,0x01,0x69]);
  //  a2:0f:30:0d:02:01:07:30:08:a0:06:04:01:00:04:01:01
  var switch_control_from_sv9100  =   Buffer.from([0xa2,0x0f,0x30,0x0d,0x02,0x01,0x07,0x30,0x08,0xa0,0x06,0x04,0x01,0x00,0x04,0x01,0x01]);
  //******************************************************************************
  //**************************** Terminate call **********************************
  //  0xa1,0x34,0x30,0x32,0x02,0x01,0x09,0x02,0x01,0x69,0x30,0x2a,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x02,0xa2,0x0e,0xa0,0x0c,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x03,0x01,0x0a,0x01,0xa3,0x10,0xa1,0x0e,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x05,0x09,0x02,0x02,0x02,0x02
  var endcall_to_sv9100           =   Buffer.from([0xa1,0x34,0x30,0x32,0x02,0x01,0x09,0x02,0x01,0x69,0x30,0x2a,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x02,0xa2,0x0e,0xa0,0x0c,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x03,0x01,0x0a,0x01,0xa3,0x10,0xa1,0x0e,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x05,0x09,0x02,0x02,0x02,0x02]);
  //  a2:2d:30:2b:02:01:09:30:26:a0:06:04:01:01:04:01:02:a1:1c:a0:0c:04:01:01:04:02:00:0a:04:03:01:0a:01:a1:0c:04:01:01:04:02:00:0a:04:03:01:0a:02
  var endcall_from_sv9100         =   Buffer.from([0xa2,0x2d,0x30,0x2b,0x02,0x01,0x09,0x30,0x26,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x02,0xa1,0x1c,0xa0,0x0c,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x03,0x01,0x0a,0x01,0xa1,0x0c,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x03,0x01,0x0a,0x02]);
  //******************************************************************************
  //**************************** Make call ***************************************
  //  a1:32:30:30:02:01:0f:02:01:69:30:28:a0:06:04:01:01:04:01:01:a2:0e:a0:0c:04:01:01:04:02:00:00:04:03:01:0a:02:a3:05:80:03:01:0a:01:84:01:02:85:01:03:86:01:01
  var makecall_to_sv9100          =   Buffer.from([0xa1,0x32,0x30,0x30,0x02,0x01,0x0f,0x02,0x01,0x69,0x30,0x28,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0xa2,0x0e,0xa0,0x0c,0x04,0x01,0x01,0x04,0x02,0x00,0x00,0x04,0x03,0x01,0x0a,0x02,0xa3,0x05,0x80,0x03,0x01,0x0a,0x01,0x84,0x01,0x02,0x85,0x01,0x03,0x86,0x01,0x01]);
  //  a2:2d:30:2b:02:01:0f:30:26:a0:06:04:01:01:04:01:01:a1:1c:a0:0c:04:01:01:04:02:00:0a:04:03:01:0a:02:a1:0c:04:01:01:04:02:00:0a:04:03:01:0a:01
  var makecall_from_sv9100        =   Buffer.from([0xa2,0x2d,0x30,0x2b,0x02,0x01,0x0f,0x30,0x26,0xa0,0x06,0x04,0x01,0x01,0x04,0x01,0x01,0xa1,0x1c,0xa0,0x0c,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x03,0x01,0x0a,0x02,0xa1,0x0c,0x04,0x01,0x01,0x04,0x02,0x00,0x0a,0x04,0x03,0x01,0x0a,0x01]);
  //******************************************************************************


  //oai.makeCall = function(numberType,callNumber,sourceAddress,callback) 
  oai.makeCall = function(source,destination,callback){
    //logger.info('Function execution start : oai.makeCall()');
    
    var stringSourceAddress           = source.toString();
    var stringDestinationAddress      = destination.toString();

    //logger.debug('source : %s , destination : %s',stringSourceAddress,stringDestinationAddress);
    
    
  //------------------------------------------------------------------------------
    // Add the source adress to end call packets
    endcall_to_sv9500[33]         = numArr[stringSourceAddress[0]];
    endcall_to_sv9500[34]         = numArr[stringSourceAddress[1]];
    endcall_to_sv9500[35]         = numArr[stringSourceAddress[2]];
    endcall_to_sv9500[36]         = numArr[stringSourceAddress[3]];

    // Add the source address to make call packets
    makecall_to_sv9500[33]        = numArr[stringSourceAddress[0]];
    makecall_to_sv9500[34]        = numArr[stringSourceAddress[1]];
    makecall_to_sv9500[35]        = numArr[stringSourceAddress[2]];
    makecall_to_sv9500[36]        = numArr[stringSourceAddress[3]];

    // Add the destination to make call packets
    makecall_to_sv9500[41]        = numArr[stringDestinationAddress[0]];
    makecall_to_sv9500[42]        = numArr[stringDestinationAddress[1]];
    makecall_to_sv9500[43]        = numArr[stringDestinationAddress[2]];
    makecall_to_sv9500[44]        = numArr[stringDestinationAddress[3]];
  //------------------------------------------------------------------------------
    //  Add source to end call packets for SV9100
    endcall_to_sv9100[33]  = numArr[stringSourceAddress[0]];  
    endcall_to_sv9100[34]  = numArr[stringSourceAddress[1]];
    endcall_to_sv9100[35]  = numArr[stringSourceAddress[2]];
    
    //  We do not need to add destination address as it is static set to : 92222
    
    //  Add source to make call packets for SV9100
    makecall_to_sv9100[33]  = numArr[stringSourceAddress[0]];
    makecall_to_sv9100[34]  = numArr[stringSourceAddress[1]];
    makecall_to_sv9100[35]  = numArr[stringSourceAddress[2]];
    //  Add destination to make call packets for SV9100
    makecall_to_sv9100[40]  = numArr[stringDestinationAddress[0]];
    makecall_to_sv9100[41]  = numArr[stringDestinationAddress[1]];
    makecall_to_sv9100[42]  = numArr[stringDestinationAddress[2]];

    var flag = 0;
    // Create connection
    logger.info('Flag = %d',flag);
    var client = net.createConnection(CONFIG.oai_port,CONFIG.oai_ip);
    logger.debug('Client socket to OAI object : %o',client);
    client.on('connect',function(){
      logger.info('Connected to (%s) at IP (%s) and port (%s)',CONFIG.sip_server,CONFIG.oai_ip,CONFIG.oai_port);
      flag = 1;
      logger.debug('Flag set to = %d',flag);
      switch(CONFIG.sip_server){
        case "SV9100":
          logger.info('Write connect_to_sv9100');
          logger.debug('connect_to_sv9100 => %o',connect_to_sv9100);
          client.write(connect_to_sv9100);
        break;
        case "SV9500":
          logger.info('Write connect_to_sv9500_1');
          logger.debug('connect_to_sv9500_1 => %o',connect_to_sv9500_1);
          client.write(connect_to_sv9500_1);
        break;
        default:
          logger.error('ERROR : OAI_1 , [%s]',__file);
        break;
      }
    });
    client.on('end',()=>{
      logger.info('[%s] , Disconnected from the server',__file);
    });

    client.on('error', function(error){
      logger.error(error);
    });
    
    client.on('data',function(data){
      logger.info('Data received');
      // Open switch control
      if(1 == flag){
        logger.info('Flag = %d',flag);
        logger.debug('DATA => %o',data);
        flag = 2;
        logger.info('Value of Flag changed to = %d',flag);
        switch(CONFIG.sip_server){
          case "SV9100":
            logger.info('Write switch_control_to_sv9100');
            logger.debug('switch_control_to_sv9100 => %o',switch_control_to_sv9100);
            client.write(switch_control_to_sv9100);
          break;
          case "SV9500":
            logger.info('Write switch_control_to_sv9500');
            logger.debug('switch_control_to_sv9500 => %o',switch_control_to_sv9500);
            client.write(switch_control_to_sv9500);
          break;
          default:
            logger.error('ERROR : OAI_2 , [%s]',__file);
          break;
        }
      }
      else if(2 == flag){ // Terminate call
        logger.info('Flag = %d',flag);
        logger.debug('DATA => %o',data);
        flag = 3;
        logger.debug('Flag set to = %d',flag);
        switch(CONFIG.sip_server){
          case "SV9100":
            logger.info('Write endcall_to_sv9500');
            logger.debug('endcall_to_sv9100 => %o',endcall_to_sv9500);
            client.write(endcall_to_sv9500);
          break;
          case "SV9500":
            logger.info('Write endcall_to_sv9500');
            logger.debug('endcall_to_sv9100 => %o',endcall_to_sv9500);
            client.write(endcall_to_sv9500);
          break;
          default:
            logger.error('ERROR : OAI_3 , [%s]',__file);
          break;
        }
      }
      else if(3 == flag){ // Make call
        logger.info('Flag = %d',flag);
        logger.debug('DATA => %o',data);
        flag = 4;
        logger.debug('Flag set to = %d',flag);
        switch(CONFIG.sip_server){
          case "SV9100":
            logger.info('Write makecall_to_sv9100');
            logger.debug('makecall_to_sv9100 => %o',makecall_to_sv9100);
            client.write(makecall_to_sv9100);
          break;
          case "SV9500":
            logger.info('Write makecall_to_sv9500');
            logger.debug('makecall_to_sv9100 => %o',makecall_to_sv9500);
            client.write(makecall_to_sv9500);
          break;
          default:
            logger.error('ERROR : OAI_4 , [%s]',__file);
          break;
        }
       }
       else if(4 == flag){  //  Callback
        logger.info('Flag = %d',flag);
        logger.debug('DATA => %o',data);
        flag = 0;
        logger.debug('Flag set to = %d',flag);
        logger.info('Sending callback');
        callback("1");
       }
       else{
         logger.info('[%s] , Unhandled case',__file);
        // Do nothing
        //logger.debug('Default case');
       }
    });
  }
  //oai.makeCallMulti = function(source,destinationA,destinationB,callbackMulti){
  oai.makeCallMulti = function(source,destinationA,destinationB,callbackMulti){
    logger.info("oai.makeCallMulti , [%s]",__file);
    var stringStattionA               = source.toString();
    var stringStattionB               = destinationB.toString();
    var stringStattionC               = destinationB.toString();
    /*console.log(stringStattionA);
    console.log(stringStattionB);
    console.log(stringStattionC);*/
    //callbackMulti(1);
    // Add the source adress to end call packets
    endcall_to_sv9500[33]             = numArr[source[0]];
    endcall_to_sv9500[34]             = numArr[source[1]];
    endcall_to_sv9500[35]             = numArr[source[2]];
    endcall_to_sv9500[36]             = numArr[source[3]];

    // Add the source address to make call packets
    makecall_to_sv9500[33]            = numArr[source[0]];
    makecall_to_sv9500[34]            = numArr[source[1]];
    makecall_to_sv9500[35]            = numArr[source[2]];
    makecall_to_sv9500[36]            = numArr[source[3]];

    // Add the destination to make call packets
    makecall_to_sv9500[41]            = numArr[destinationA[0]];
    makecall_to_sv9500[42]            = numArr[destinationA[1]];
    makecall_to_sv9500[43]            = numArr[destinationA[2]];
    makecall_to_sv9500[44]            = numArr[destinationA[3]];

    // Add the destination in monitor packets
    start_monitor_to_sv9500[34]       = numArr[destinationA[0]];
    start_monitor_to_sv9500[35]       = numArr[destinationA[1]];
    start_monitor_to_sv9500[36]       = numArr[destinationA[2]];
    start_monitor_to_sv9500[37]       = numArr[destinationA[3]];

    /*console.log("/*-/*-/*-");
    console.log(numArr[destinationA[0]]);
    console.log(numArr[destinationA[1]]);
    console.log(numArr[destinationA[2]]);
    console.log(numArr[destinationA[3]]);
    console.log("/*-/*-/*-");*/

    //Add the destination in monitor notify packet
    monitor_notify_from_sv9500[40]    = numArr[destinationA[0]];  
    monitor_notify_from_sv9500[41]    = numArr[destinationA[1]];  
    monitor_notify_from_sv9500[42]    = numArr[destinationA[2]];  
    monitor_notify_from_sv9500[43]    = numArr[destinationA[3]];

    // Add the source in monitor notify packet  
    monitor_notify_from_sv9500[57]    = numArr[source[0]];
    monitor_notify_from_sv9500[58]    = numArr[source[1]];
    monitor_notify_from_sv9500[59]    = numArr[source[2]];
    monitor_notify_from_sv9500[60]    = numArr[source[3]];

    // Add StattionA , StattionB and StattionC in make conference pakcet
    // source
    makeConference_to_sv9500[33]      = numArr[source[0]];
    makeConference_to_sv9500[34]      = numArr[source[1]];
    makeConference_to_sv9500[35]      = numArr[source[2]];
    makeConference_to_sv9500[36]      = numArr[source[3]];
    //destinationA
    makeConference_to_sv9500[61]      = numArr[destinationA[0]];
    makeConference_to_sv9500[62]      = numArr[destinationA[1]];
    makeConference_to_sv9500[63]      = numArr[destinationA[2]];
    makeConference_to_sv9500[64]      = numArr[destinationA[3]];
    //StationC
    makeConference_to_sv9500[41]      = numArr[destinationB[0]];
    makeConference_to_sv9500[42]      = numArr[destinationB[1]];
    makeConference_to_sv9500[43]      = numArr[destinationB[2]];
    makeConference_to_sv9500[44]      = numArr[destinationB[3]];

    var flag          = 0;
    var monitorStart  = 0;
    var openMoitoring = 0;
    var openNotify    = 0;

    logger.info('IP =>[ %s] , PORT => [%s]',CONFIG.oai_ip,CONFIG.oai_port);
    const client = net.createConnection(CONFIG.oai_port,CONFIG.oai_ip);
    client.on('connect',function(){
      logger.info('Connected to (%s) at IP (%s) and port (%s)',CONFIG.sip_server,CONFIG.oai_ip,CONFIG.oai_port);
      flag = 1;
      logger.info('[%s] , Flag set to = %d',__file,flag);
      // Send first packet
      logger.info('[%s] , monitorStart = %d',__file,monitorStart);
      logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
      logger.info('[%s] , openNotify = %d',__file,openNotify);
      logger.info('Write connect_to_sv9500_1');
      logger.debug('connect_to_sv9500_1 => %o',connect_to_sv9500_1);
      client.write(connect_to_sv9500_1);
      //writeData(client,connect_to_sv9500_1);
    });
    // On receivng data
    client.on('data',function(data){
      logger.info('Data received');
      if(1 == flag && 
        0 == monitorStart && 
        0 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag = 2;
        logger.info('[%s] , Value of Flag changed to = %d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',openNotify);
        logger.info('[%s] , Writing connect_to_sv9500_2',__file);
        client.write(connect_to_sv9500_2);
        //writeData(client,connect_to_sv9500_2); 
        logger.info('[%s] , Writing connect_to_sv9500_3',__file);
        client.write(connect_to_sv9500_3);
        //writeData(client,connect_to_sv9500_3);
      }
      else if(2 == flag && 
        0 == monitorStart && 
        0 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag=3;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing connect_to_sv9500_4',__file);
        client.write(connect_to_sv9500_4);
        //writeData(client,connect_to_sv9500_4);
      }    
      else if(3 == flag && 
        !(data.length == connect_from_sv9500_4.length) && 
        0 == monitorStart && 
        0 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag=4;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing connect_to_sv9500_5');
        client.write(connect_to_sv9500_5);
        //writeData(client,connect_to_sv9500_5); 
      }
      else if(4 == flag && 
        0 == monitorStart && 
        0 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag = 5;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing connect_to_sv9500_6');
        client.write(connect_to_sv9500_6);
        //writeData(client,connect_to_sv9500_6);  
      }
      else if(5 == flag && 
        0 == monitorStart && 
        0 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag = 6;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing connect_to_sv9500_7');
        client.write(connect_to_sv9500_7);
        //writeData(client,connect_to_sv9500_7);  
      }
      else if(6 == flag && 
        0 == monitorStart && 
        0 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag=7;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing switch_control_to_sv9500');
        client.write(switch_control_to_sv9500);
        //writeData(client,switch_control_to_sv9500);
      }
      else if(7 == flag && 
        0 == monitorStart && 
        0 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag = 8;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing endcall_to_sv9500');
        client.write(endcall_to_sv9500);
        //writeData(client,endcall_to_sv9500);
      }
      else if(8 == flag && 
        0 == monitorStart && 
        0 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag = 9;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing makecall_to_sv9500');
        client.write(makecall_to_sv9500);
        //writeData(client,makecall_to_sv9500);
      }
      else if(9 == flag && 
        0 == monitorStart && 
        0 == openMoitoring && 
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag = 10;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing open_monitoring_to_sv9500');
        client.write(open_monitoring_to_sv9500);
        //writeData(client,open_monitoring_to_sv9500);
        openMoitoring = 1;
      }
      else if(10 == flag && 
        0 == monitorStart && 
        1 == openMoitoring &&
        0 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag = 11;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing open_notify_to_sv9500');
        client.write(open_notify_to_sv9500);
        //writeData(client,open_notify_to_sv9500);
        openNotify = 1;
      }
      else if(11 == flag && 
        0 == monitorStart && 
        1 == openMoitoring && 
        1 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        flag = 12;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        logger.info('[%s] , Writing start_monitor_to_sv9500');
        client.write(start_monitor_to_sv9500);
        //writeData(client,start_monitor_to_sv9500);
        monitorStart = 1;
      }
      else if(12 == flag && 
          1 == monitorStart && 
          1 == openMoitoring && 
          1 == openNotify)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        if(monitor_notify_from_sv9500.length == data.length)
        {
          flag = 13;
          logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
          logger.info('[%s] , Writing makeConference_to_sv9500');
          client.write(makeConference_to_sv9500);
          //writeData(client,makeConference_to_sv9500);
        }
      }
      else if(13 == flag)
      {
        logger.info('[%s] , Flag = %d',__file,flag);
        logger.debug('[%s] , DATA => %o',__file,data);
        logger.info('[%s] , monitorStart = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify = %d',__file,openNotify);
        flag = 0;
        monitorStart = 0;
        openMoitoring = 0;
        openNotify = 0;
        logger.info('[%s] , Value of Flag changed to =%d',__file,flag);
        logger.info('[%s] , monitorStart changed to = %d',__file,monitorStart);
        logger.info('[%s] , openMoitoring changed to = %d',__file,openMoitoring);
        logger.info('[%s] , openNotify changed to = %d',__file,openNotify);
        logger.info('Send the callbackMulti');
        client.destroy();
        callbackMulti("1");
      }
      else
      {
        logger.info('[%s] , Unhandaled case',__file);
      }
    });
  }
  function writeData(client,data){
    logger.log('[%s] , Writing DATA',__file);
    client.write(data);
  }

  module.exports = oai;
