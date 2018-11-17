// From "Simply JavaScript" by Kevin Yank and Cameron Adams. {LN0}
var Core = {};

// W3C DOM 2 Events model
if (document.addEventListener)
{
  Core.addEventListener = function(target, type, listener)
  {
    target.addEventListener(type, listener, false);
  };

  Core.removeEventListener = function(target, type, listener)
  {
    target.removeEventListener(type, listener, false);
  };

  Core.preventDefault = function(event)
  {
    event.preventDefault();
  };

  Core.stopPropagation = function(event)
  {
    event.stopPropagation();
  };
}
// Internet Explorer Events model
else if (document.attachEvent)
{
  Core.addEventListener = function(target, type, listener)
  {
    // prevent adding the same listener twice, since DOM 2 Events ignores
    // duplicates like this
    if (Core._findListener(target, type, listener) != -1) return;

    // listener2 calls listener as a method of target in one of two ways,
    // depending on what this version of IE supports, and passes it the global
    // event object as an argument
    var listener2 = function()
    {
      var event = window.event;

      if (Function.prototype.call)
      {
        listener.call(target, event);
      }
      else
      {
        target._currentListener = listener;
        target._currentListener(event)
        target._currentListener = null;
      }
    };

    // add listener2 using IE's attachEvent method
    target.attachEvent("on" + type, listener2);

    // create an object describing this listener so we can clean it up later
    var listenerRecord =
    {
      target: target,
      type: type,
      listener: listener,
      listener2: listener2
    };

    // get a reference to the window object containing target
    var targetDocument = target.document || target;
    var targetWindow = targetDocument.parentWindow;

    // create a unique ID for this listener
    var listenerId = "l" + Core._listenerCounter++;

    // store a record of this listener in the window object
    if (!targetWindow._allListeners) targetWindow._allListeners = {};
    targetWindow._allListeners[listenerId] = listenerRecord;

    // store this listener's ID in target
    if (!target._listeners) target._listeners = [];
    target._listeners[target._listeners.length] = listenerId;

    // set up Core._removeAllListeners to clean up all listeners on unload
    if (!targetWindow._unloadListenerAdded)
    {
      targetWindow._unloadListenerAdded = true;
      targetWindow.attachEvent("onunload", Core._removeAllListeners);
    }
  };

  Core.removeEventListener = function(target, type, listener)
  {
    // find out if the listener was actually added to target
    var listenerIndex = Core._findListener(target, type, listener);
    if (listenerIndex == -1) return;

    // get a reference to the window object containing target
    var targetDocument = target.document || target;
    var targetWindow = targetDocument.parentWindow;

    // obtain the record of the listener from the window object
    var listenerId = target._listeners[listenerIndex];
    var listenerRecord = targetWindow._allListeners[listenerId];

    // remove the listener, and remove its ID from target
    target.detachEvent("on" + type, listenerRecord.listener2);
    target._listeners.splice(listenerIndex, 1);

    // remove the record of the listener from the window object
    delete targetWindow._allListeners[listenerId];
  };

  Core.preventDefault = function(event)
  {
    event.returnValue = false;
  };

  Core.stopPropagation = function(event)
  {
    event.cancelBubble = true;
  };

  Core._findListener = function(target, type, listener)
  {
    // get the array of listener IDs added to target
    var listeners = target._listeners;
    if (!listeners) return -1;

    // get a reference to the window object containing target
    var targetDocument = target.document || target;
    var targetWindow = targetDocument.parentWindow;

    // searching backward (to speed up onunload processing), find the listener
    for (var i = listeners.length - 1; i >= 0; i--)
    {
      // get the listener's ID from target
      var listenerId = listeners[i];

      // get the record of the listener from the window object
      var listenerRecord = targetWindow._allListeners[listenerId];

      // compare type and listener with the retrieved record
      if (listenerRecord.type == type && listenerRecord.listener == listener)
      {
        return i;
      }
    }
    return -1;
  };

  Core._removeAllListeners = function()
  {
    var targetWindow = this;

    for (id in targetWindow._allListeners)
    {
      var listenerRecord = targetWindow._allListeners[id];
      listenerRecord.target.detachEvent(
          "on" + listenerRecord.type, listenerRecord.listener2);
      delete targetWindow._allListeners[id];
    }
  };

  Core._listenerCounter = 0;
}

Core.addClass = function(target, theClass)                      // ``When we’re adding a class, we have to take the same amount of care as we did when comparing it. The main thing we have to be careful about here is to not overwrite an element’s existing classes. Also, to make it easy to remove a class, we shouldn’t add a class to an element that already has that class. To make sure we don’t, we’ll use Core.hasClass inside Core.addClass :``(K.Y)
{
  if (!Core.hasClass(target, theClass))                         // ``The first conditional statement inside Core.addClass uses Core.hasClass to check whether or not the target element already has the class we’re trying to add. If it does, there’s no need to add the class again.``(K.Y)
  {
    if (target.className == "")                                 // ``If the target doesn’t have the class, we have to check whether that element has any classes at all. If it has none (that is, the className is an empty string), it’s safe to assign theClass directly to target.className .``(K.Y)
    {
      target.className = theClass;
    }
    else                                                        // ``But if the element has some preexisting classes, we have to follow the syntax for multiple classes, whereby each class is separated by a space. Thus, we add a space to the end of className , followed by theClass . Then we’re done.``(K.Y)
    {
      target.className += " " + theClass;
    }
  }
};

Core.getElementsByClass = function(theClass)                    // create a function to find a group of elements by class from anywhere in the JavaScript code. {LN0} | ``We’ve called our new function Core.getElementsByClass, and our function definition contains one argument  theClass which is the class we use to construct our regular expression.``(K.Y)
{
  var elementArray = [];                                        // This is a group of elements, it needs a variable of type Array. {LN0}

  if (typeof document.all != "undefined")                       // Check if the Browser has the Microsoft special object that contains all the elements in the document "document.all".{LN0} : ``The conditional statement uses the typeof operator to check for the existence of document.all . typeof checks the data type of the value that follows it, and produces a string that describes the value’s type (for instance, "number" , "string" , "object" , etc.). Even if the value is null , it will still return a type ( "object" ), but if you supply typeof with a variable or property name that hasn’t been assigned any value whatsoever, it will return the string "undefined". This technique, called object detection, is the safest way of testing whether an object such as document.all exists. If typeof returns "undefined" , we know that the browser doesn’t implement that feature.``(K.Y)
  {
    elementArray = document.all;
  }
  else
  {
    elementArray = document.getElementsByTagName("*");          // ``Whichever part of the conditional statement the browser decides to execute, we end up correctly assigning to elementArray a node list of every element in the document.``(K.Y)
  }

  var matchedArray = [];
  var pattern = new RegExp("(^| )" + theClass + "( |$)");       // ``this is a regular expression, (..) help us search strings for a particular pattern. In this case, our regular expression uses the variable theClass as the class we want to match against; theClass will be passed into our function as an argument.``(K.Y)

  for (var i = 0; i < elementArray.length; i++)                 // ``Once we’ve set up our regular expression with that class name, we use a for loop to step through each of the elements in elementArray.``(K.Y)
  {
    if (pattern.test(elementArray[i].className))                // ``Every time we move through the for loop, we use the pattern regular expression, testing the current element’s class attribute against it. We do this by passing the element’s className property a string value to the regular expression’s test method. Every element node has a className property, which corresponds directly to that element’s class attribute in the HTML. When pattern.test is run, it checks the string argument that’s passed to it against the regular expression. If the string matches the regular expression (that is, it contains the specified class name), it will return true ; if the string doesn’t match the regular expression, it will return false. In this way, we can use a regular expression test as the condition for an if statement.``(K.Y)
    {
      matchedArray[matchedArray.length] = elementArray[i];      // ``the conditional statement tell us if the current element has a class that matches the one we’re looking for. (..) Within the if statement we wrote in the previous step, we add any newly matched elements to the end of matchedArray , using its current length as the index of the new element ``(K.Y)
    }
  }                                                             // ``Once the for loop has finished executing, all of the elements in the document that have the required class will be referenced inside matchedArray.``(K.Y)

  return matchedArray;                                          // ``we include a return statement that passes matchedArray back to the statement that called Core.getElementsByClass.``(K.Y)
};

Core.hasClass = function(target, theClass)                      // ``When we’re checking to see whether className contains a particular class, we need to use a special search (..) we can use that same regular expression to create a function that will tell us whether or not an element has a particular class attached to it: Core.hasClass takes two arguments: an element and a class. The class is used inside the regular expression and compared with the className of the element.``(K.Y)
{
  var pattern = new RegExp("(^| )" + theClass + "( |$)");

  if (pattern.test(target.className))                           // ``If the pattern.test method returns true, it means that the element does have the specified class, and we can return true from the function.``(K.Y)
  {
    return true;
  }

  return false;                                                 // ``If pattern.test returns false, Core.hasClass returns false by default.``(K.Y)
};

Core.removeClass = function(target, theClass)                   // ``In Core.removeClass, instead of using the regular expression to check whether or not the target element has the class, we assume that it does have the class, and in- stead use the regular expression to replace the class with an empty string, effectively removing it from className.``(K.Y)
{
  var pattern = new RegExp("(^| )" + theClass + "( |$)");

  target.className = target.className.replace(pattern, "$1");   // ``To do this, we use a built-in string method called replace. This method takes a regular expression and a replacement string, then replaces the occurrences that match the regular expression with the replacement string. In this case, we’re using an empty string as the replacement, so any matches will be erased. If the class exists inside className, it will disappear.``(K.Y)
  target.className = target.className.replace(/ $/, "");        // ``The second call to replace just tidies up className, removing any extraneous spaces that might be hanging around after the class was removed (some browsers will choke if any spaces are present at the start of className).``(K.Y)
};

Core.getComputedStyle = function(element, styleProperty)
{
  var computedStyle = null;

  if (typeof element.currentStyle != "undefined")
  {
    computedStyle = element.currentStyle;
  }
  else
  {
    computedStyle = document.defaultView.getComputedStyle(element, null);
  }

  return computedStyle[styleProperty];
};

Core.start = function(runnable)
{
  Core.addEventListener(window, "load", runnable.init);
};
