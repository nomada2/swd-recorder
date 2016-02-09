// Generated by CoffeeScript 1.6.3
// except getCssSelectorOF, getElementId and getPathTo handmade customizations
// The code for getCssSelectorOF was partially borrowed from chromium project:
// https://chromium.googlesource.com/chromium/src.git
// 


(function() {
  var SWD_Page_Recorder, addStyle, bye, createCommand, dbg, getInputElementsByTypeAndValue, getPageXY, getCssSelectorOF, getElementId, getPathTo, handler, hello, prev, preventEvent, pseudoGuid, rightClickHandler, say;

  var ELEMENT_NODE = 1;

  say = function(something) {
    if (typeof console !== "undefined" && console !== null) {
      return console.log(something);
    }
  };

  dbg = function(something) {
    if (typeof console !== "undefined" && console !== null) {
      return console.log("DBG:" + something);
    }
  };

  hello = function(something) {
    return dbg("(begin): " + something);
  };

  bye = function(something) {
    return dbg("(end): " + something);
  };

  pseudoGuid = function() {
    var result;
    hello("pseudoGuid");
    result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    result = result.replace(/[xy]/g, function(re_match) {
      var random_value, replacement;
      random_value = Math.random() * 16 | 0;
      replacement = re_match === 'x' ? random_value : random_value & 0x3 | 0x8;
      return replacement.toString(16);
    });
    bye("pseudoGuid");
    return result;
  };

  getInputElementsByTypeAndValue = function(inputType, inputValue) {
    var allDocumentInputElements, inputElement, result, _i, _len;
    hello("getInputElementsByTypeAndValue");
    allDocumentInputElements = document.getElementsByTagName('input');
    result = new Array();
    for (_i = 0, _len = allDocumentInputElements.length; _i < _len; _i++) {
      inputElement = allDocumentInputElements[_i];
      if (inputElement.type === inputType && inputElement.value === inputValue) {
        result.push(inputElement);
      }
    }
    bye("getInputElementsByTypeAndValue");
    return result;
  };
getElementId = function(element) {
         var selector = '';
         hello('getElementId');
 
         if (element instanceof Element && element.nodeType === ELEMENT_NODE && element.id) {
             selector = element.id;
         }
         bye('getElementId');
         return selector;
     };
 
     getCssSelectorOF = function(element) {
         hello('getCssSelectorOF');
         if (!(element instanceof Element))
             return;
         var path = [];
         while (element.nodeType === ELEMENT_NODE) {
             var selector = element.nodeName.toLowerCase();
             if (element.id) {
                 if (element.id.indexOf('-') > -1) {
                     selector += '[id = "' + element.id + '"]';
                 } else {
                     selector += '#' + element.id;
                 }
                 path.unshift(selector);
                 break;
             } else {
                 var element_sibling = element;
                 var sibling_cnt = 1;
                 while (element_sibling = element_sibling.previousElementSibling) {
                     if (element_sibling.nodeName.toLowerCase() == selector)
                         sibling_cnt++;
                 }
                 if (sibling_cnt != 1)
                     selector += ':nth-of-type(' + sibling_cnt + ')';
             }
             path.unshift(selector);
             element = element.parentNode;
         }
         bye('getCssSelectorOF');
         return path.join(' > ');
     };

    getPathTo = function(element) {
        var element_sibling, siblingTagName, siblings, cnt, sibling_count;

        hello("getPathTo");
        var elementTagName = element.tagName.toLowerCase();
        if (element.id != '') {
            return 'id("' + element.id + '")';
            // alternative : 
            // return '*[@id="' + element.id + '"]';
        } else if (element.name && document.getElementsByName(element.name).length === 1) {
            return '//' + elementTagName + '[@name="' + element.name + '"]';
        }
        if (element === document.body) {
            return '/html/' + elementTagName;
        }
        sibling_count = 0;
        siblings = element.parentNode.childNodes;
        siblings_length = siblings.length;
        for (cnt = 0; cnt < siblings_length; cnt++) {
            var element_sibling = siblings[cnt];
            if (element_sibling.nodeType !== ELEMENT_NODE) { // not ELEMENT_NODE
                continue;
            }
            if (element_sibling === element) {
                return getPathTo(element.parentNode) + '/' + elementTagName + '[' + (sibling_count + 1) + ']';
            }
            if (element_sibling.nodeType === 1 && element_sibling.tagName.toLowerCase() === elementTagName) {
                sibling_count++;
            }
        }
        return bye("getPathTo");
    };

  getPageXY = function(element) {
    var x, y;
    hello("getPageXY");
    x = 0;
    y = 0;
    while (element) {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    }
    bye("getPageXY");
    return [x, y];
  };

  createCommand = function(jsonData) {
    var myJSONText;
    hello("createCommand");
    myJSONText = JSON.stringify(jsonData, null, 2);
    document.swdpr_command = myJSONText;
    return bye("createCommand");
  };

  addStyle = function(css) {
    var head, style;
    hello("addStyle");
    head = document.getElementsByTagName('head')[0];
    style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    return bye("addStyle");
  };

  preventEvent = function(event) {
    hello("preventEvent");
    if (event.preventDefault) {
      event.preventDefault();
    }
    event.returnValue = false;
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
    bye("preventEvent");
    return false;
  };

  prev = void 0;

  document.Swd_prevActiveElement = void 0;

  handler = function(event) {
    hello("handler");
    if (document.SWD_Page_Recorder == null) {
      return;
    }
    if (event.target === document.body || prev === event.target) {
      return;
    }
    if (prev) {
      prev.className = prev.className.replace(/\s?\bhighlight\b/, '');
      prev = void 0;
    }
    if (event.target && event.ctrlKey) {
      prev = event.target;
      prev.className += " highlight";
    }
    return bye("handler");
  };

  rightClickHandler = function(event) {
    var JsonData, body, eventPreventingResult, mxy, path, root, target, txy, xpath, css_selector, id;
    hello("rightClickHandler");
    if (document.SWD_Page_Recorder == null) {
      return;
    }
    if (event.ctrlKey) {
      if (event == null) {
        event = window.event;
      }
      target = 'target' in event ? event.target : event.srcElement;
      root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
      mxy = [event.clientX + root.scrollLeft, event.clientY + root.scrollTop];
      path = getPathTo(target);
      txy = getPageXY(target);
      css_selector = getCssSelectorOF(target);
      id = getElementId(target);
      body = document.getElementsByTagName('body')[0];
      xpath = path;
      JsonData = {
        "Command": "GetXPathFromElement",
        "Caller": "EventListener : mousedown",
        "CommandId": pseudoGuid(),
        "CssSelector": css_selector,
        "ElementId": id,
        "XPathValue": xpath
      };
      createCommand(JsonData);
      document.SWD_Page_Recorder.showPos(event, xpath, css_selector, id);
      eventPreventingResult = preventEvent(event);
      bye("rightClickHandler");
      return eventPreventingResult;
    }
  };

  SWD_Page_Recorder = (function() {
    function SWD_Page_Recorder() {}

    SWD_Page_Recorder.prototype.getMainWinElement = function() {
      return document.getElementById('SwdPR_PopUp');
    };

    SWD_Page_Recorder.prototype.displaySwdForm = function(x, y) {
      var el;
      hello("displaySwdForm");
      el = this.getMainWinElement();
      el.style.background = "white";
      el.style.position = "absolute";
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.display = "block";
      el.style.border = "3px solid black";
      el.style.padding = "5px 5px 5px 5px";
      el.style.zIndex = 2147483647;
      return bye("displaySwdForm");
    };

    SWD_Page_Recorder.prototype.showPos = function(event, xpath, css_selector, id) {
      var x, y;
      hello("showPos");
      if (window.event) {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
      } else {
        x = event.clientX + window.scrollX;
        y = event.clientY + window.scrollY;
      }
      x -= 2;
      y -= 2;
      y = y + 15;
      this.displaySwdForm(x, y);
      document.getElementById("SwdPR_PopUp_XPathLocator").innerHTML = xpath;
      document.getElementById("SwdPR_PopUp_CssSelector").innerHTML = css_selector;
      document.getElementById("SwdPR_PopUp_ElementId").innerHTML = id;
      document.getElementById("SwdPR_PopUp_ElementText").innerHTML = pseudoGuid();
      document.getElementById("SwdPR_PopUp_CodeIDText").value = '';
      say(x + ";" + y);
      return bye("showPos");
    };

    SWD_Page_Recorder.prototype.closeForm = function() {
      return document.getElementById('SwdPR_PopUp').style.display = 'none';
    };

    SWD_Page_Recorder.prototype.createElementForm = function() {
      var closeClickHandler, element;
      hello("createElementForm");
      element = document.createElement("div");
      element.id = 'SwdPR_PopUp';
      if (document.body != null) {
        document.body.appendChild(element);
      } else {
        say("createElementForm Failed to inject element SwdPR_PopUp. The document has no body");
      }
      closeClickHandler = "";
            element.innerHTML = '\
        <table id="SWDTable">\
            <tr>\
              <td>Code identifier</td>\
              <td>\
                    <div id="SwdPR_PopUp_Element_Name">\
                        <span id="SwdPR_PopUp_CodeID">\
                            <input type="text" id="SwdPR_PopUp_CodeIDText">\
                        </span>\
                        <span id="SwdPR_PopUp_CodeClose"></span>\
                        <span id="SwdPR_PopUp_CloseButton" onclick="document.SWD_Page_Recorder.closeForm()">X</span>\
                     </div>\
              </td>\
            </tr>\
            <tr>\
              <td>Element</td>\
              <td><span id="SwdPR_PopUp_ElementName">Element</span></td>\
            </tr>\
            <tr>\
              <td>Id:</td>\
              <td><span id="SwdPR_PopUp_ElementId">Element</span></td>\
            </tr>\
            <tr>\
              <td>Text:</td>\
              <td><span id="SwdPR_PopUp_ElementText">Element</span></td>\
            </tr>\
            <tr>\
              <td>XPath:</td>\
              <td><span id="SwdPR_PopUp_XPathLocator">Element</span></td>\
            </tr>\
            <tr>\
              <td>Css:</td>\
              <td><span id="SwdPR_PopUp_CssSelector">Element</span></td>\
            </tr>\
            </table>\
        <input type="button" value="Add element" onclick="document.SWD_Page_Recorder.addElement()">\
        ';
      return bye("createElementForm");
    };

    SWD_Page_Recorder.prototype.addElement = function() {
      var JsonData, XPathLocatorElement, codeIDTextElement;
      hello("addElement");
      codeIDTextElement = document.getElementById("SwdPR_PopUp_CodeIDText");
      CssSelectorElement = document.getElementById("SwdPR_PopUp_CssSelector");
      XPathLocatorElement = document.getElementById("SwdPR_PopUp_XPathLocator");
      JsonData = {
        "Command": "AddElement",
        "Caller": "addElement",
        "CommandId": pseudoGuid(),
        "ElementCodeName": codeIDTextElement.value,
        "ElementCssSelector": CssSelectorElement.firstChild.nodeValue,
        "ElementXPath": XPathLocatorElement.firstChild.nodeValue
      };
      createCommand(JsonData);
      return bye("addElement >");
    };

    return SWD_Page_Recorder;

  })();

  addStyle(".highlight { background-color:silver !important}");

  addStyle("table#SWDTable {             background-color:white;             border-collapse:collapse;           }                       table#SWDTable,table#SWDTable th, table#SWDTable td  {             font-family: Verdana, Arial;             font-size: 10pt;             padding-left:10pt;             padding-right:10pt;             border-bottom: 1px solid black;            }");

  addStyle("input#SwdPR_PopUp_CodeIDText {             display:table-cell;             width:95%;          }");

  addStyle("span#SwdPR_PopUp_CloseButton {              display:table-cell;            -moz-border-radius: 4px;            -webkit-border-radius: 4px;            -o-border-radius: 4px;            border-radius: 4px;            border: 1px solid #ccc;            color: white;            background-color: #980000;            cursor: pointer;            font-size: 10pt;            padding: 0px 2px;            font-weight: bold;            position: absolute;            right: 3px;            top: 8px;          }");

  /*
  addStyle "span#SwdPR_PopUp_CloseButton {  
              display:table-cell; 
              width:10px; 
              border: 2px solid #c2c2c2; 
              padding: 1px 5px; 
              top: -20px; 
              background-color: #980000; 
              border-radius: 20px; 
              font-size: 15px; 
              font-weight: bold; 
              color: white;text-decoration: none; cursor:pointer; 
            }"
  */


  addStyle("div#SwdPR_PopUp {             display:none;           }           div#SwdPR_PopUp_Element_Name {             display:table;             width: 100%;           }");

  /* 
      Important!
      It wont work if the document has no body, such as top frameset pages.
  */


  if (document.body != null) {
    if (document.body.addEventListener) {
      document.body.addEventListener('mouseover', handler, false);
      document.addEventListener('contextmenu', rightClickHandler, false);
    } else if (document.body.attachEvent) {
      document.body.attachEvent('mouseover', function(e) {
        return handler(e || window.event);
      });
      document.body.attachEvent('oncontextmenu', function(e) {
        return rightClickHandler(e || window.event);
      });
    } else {
      document.body.onmouseover = handler;
      document.body.onmouseover = rightClickHandler;
    }
    document.SWD_Page_Recorder = new SWD_Page_Recorder();
    document.SWD_Page_Recorder.createElementForm();
  } else {
    say("Document has no body tag... Injecting empty SWD");
    document.SWD_Page_Recorder = "STUB. Document has no body tag :(";
  }

}).call(this);
