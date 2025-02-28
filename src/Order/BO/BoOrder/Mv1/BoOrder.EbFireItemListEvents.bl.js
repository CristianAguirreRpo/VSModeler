"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function ebFireItemListEvents
 * @deprecated
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function ebFireItemListEvents(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

//################################################
//###          OBSOLETE!!                      ###
//###  Handled in the framework                ###
//###  Events called after item/line change    ###
//################################################

//*************************************************************************************************************
// New Event Handling with Buffering
// 
// Events are buffered in ebBufferItemListEvents(), a timer is started
// When the timer is finished ebFireItemListEvents() is called, here the handling of the buffered events starts
// The handling itself is done in ebHandleItemListEvents()
// ebForceItemListEvents() can be called (should be called from a process) to force the clearance of the buffer
//*************************************************************************************************************

var promise;
var deferreds = [];

//check whether stepper timers are still running or if numpad is open
if(Utils.listStepperTimeoutRunning())
{
  //timers are still running, so just restart our own
  var eventTimer = me.getEventTimer();
  if(Utils.isDefined(eventTimer))
  {
    clearTimeout(eventTimer);
  }
  eventTimer = setTimeout(
    function()
    {
      me.ebFireItemListEvents();
    },
    750
  );
  me.setEventTimer(eventTimer);

  promise = when.resolve();
}
else
{
  //no timers are running, so fire off the events
  var buffer = me.getItemListEventBuffer();

  me.setItemListEventBuffer([]);

  if(Utils.isDefined(buffer) && buffer.length > 0)
  {
    promise = me.ebHandleItemListEvents(buffer)
      .then(
      function()
      {
        me.setItemListEventBufferingActive("0");
        if(me.getItemListEventBuffer().length > 0)
        {
          var eventTimer = me.getEventTimer();
          if(Utils.isDefined(eventTimer))
          {
            clearTimeout(eventTimer);
          }
          eventTimer = setTimeout(
            function()
            {
              me.ebFireItemListEvents();
            },
            750
          );
          me.setEventTimer(eventTimer);
        }

        me.setItemListEventBufferingActive("1");
      }
    );
  }
  else
  {
    promise = when.resolve();
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}